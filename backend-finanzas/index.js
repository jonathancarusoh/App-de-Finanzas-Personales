require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/finanzas")
  .then(() => console.log("🟢 MongoDB conectado"))
  .catch(err => console.log("🔴 Error MongoDB", err));

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

const User = require("./models/User");
const Gasto = require("./models/Gasto");

// 🔐 MIDDLEWARE AUTH
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // 🔥 separar "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// =====================
// 🟢 AUTH
// =====================

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const existe = await User.findOne({ email });
  if (existe) return res.status(400).json({ error: "Usuario ya existe" });

  const hash = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hash });
  await user.save();

  res.json({ message: "Usuario creado" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Usuario no existe" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Password incorrecta" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// =====================
// 🟢 GASTOS (CRUD)
// =====================

// GET
app.get("/gastos", auth, async (req, res) => {
  try {
    const userGastos = await Gasto.find({
      email: req.user.email
    });

    res.json(userGastos);

  } catch {
    res.status(500).json({ error: "Error al obtener gastos" });
  }
});
// POST
app.post("/gastos", auth, async (req, res) => {
  try {
    const { texto, monto, tipo, categoria } = req.body;

    // 🔥 VALIDACIONES (NO LAS BORRES)
    if (!texto || texto.trim() === "") {
      return res.status(400).json({ error: "Texto requerido" });
    }

    if (typeof monto !== "number" || isNaN(monto)) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    if (tipo !== "gasto" && tipo !== "ingreso") {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const nuevo = new Gasto({
      texto,
      monto,
      tipo,
      categoria,
      email: req.user.email
    });

    await nuevo.save();

    res.json(nuevo);

  } catch (err) {
    res.status(500).json({ error: "Error creando gasto" });
  }
});

// DELETE
app.delete("/gastos/:id", auth, async (req, res) => {
  try {
    const eliminado = await Gasto.findOneAndDelete({
      _id: req.params.id,
      email: req.user.email
    });

    if (!eliminado) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({ ok: true });

  } catch {
    res.status(500).json({ error: "Error al eliminar" });
  }
});
// PUT (EDITAR)
app.put("/gastos/:id", auth, async (req, res) => {
  try {
    const { texto, monto, tipo, categoria } = req.body;

    // 🔥 VALIDACIONES
    if (monto && typeof monto !== "number") {
      return res.status(400).json({ error: "Monto inválido" });
    }

    if (texto && texto.trim() === "") {
      return res.status(400).json({ error: "Texto inválido" });
    }

    if (tipo && tipo !== "gasto" && tipo !== "ingreso") {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const actualizado = await Gasto.findOneAndUpdate(
      {
        _id: req.params.id,
        email: req.user.email
      },
      { texto, monto, tipo, categoria },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(actualizado);

  } catch {
    res.status(500).json({ error: "Error al editar" });
  }
});
// =====================

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});

