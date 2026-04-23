require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// 🧠 fake DB
let users = [];
let gastos = [];

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

  const existe = users.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ error: "Usuario ya existe" });
  }

  const hash = await bcrypt.hash(password, 10);

  users.push({ email, password: hash });

  res.json({ message: "Usuario creado" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "Usuario no existe" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ error: "Password incorrecta" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// =====================
// 🟢 GASTOS (CRUD)
// =====================

// GET
app.get("/gastos", auth, (req, res) => {
  const userGastos = gastos.filter(g => g.email === req.user.email);
  res.json(userGastos);
});

// POST
app.post("/gastos", auth, (req, res) => {
  const { texto, monto, tipo, categoria } = req.body;

  // 🔥 VALIDACIONES PRO
  if (!texto || texto.trim() === "") {
    return res.status(400).json({ error: "Texto requerido" });
  }

  if (typeof monto !== "number" || isNaN(monto)) {
    return res.status(400).json({ error: "Monto debe ser un número válido" });
  }

  if (tipo !== "gasto" && tipo !== "ingreso") {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  // opcional
  if (!categoria) {
    return res.status(400).json({ error: "Categoría requerida" });
  }

  const nuevo = {
    id: Date.now(),
    texto,
    monto,
    tipo,
    categoria,
    email: req.user.email
  };

  gastos.push(nuevo);

  res.json(nuevo);
});

// DELETE
app.delete("/gastos/:id", auth, (req, res) => {
  const id = req.params.id;

  const antes = gastos.length;

  gastos = gastos.filter(
    g => !(g.id == id && g.email === req.user.email)
  );

  if (gastos.length === antes) {
    return res.status(404).json({ error: "No encontrado o no autorizado" });
  }

  res.json({ ok: true });
});
// PUT (EDITAR)
app.put("/gastos/:id", auth, (req, res) => {
  const id = req.params.id;

  // 🔥 VALIDACIÓN
  if (req.body.monto && typeof req.body.monto !== "number") {
    return res.status(400).json({ error: "Monto inválido" });
  }

  if (req.body.texto && req.body.texto.trim() === "") {
    return res.status(400).json({ error: "Texto inválido" });
  }

  if (
    req.body.tipo &&
    req.body.tipo !== "gasto" &&
    req.body.tipo !== "ingreso"
  ) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  let actualizado;

  gastos = gastos.map(g => {
    if (g.id == id && g.email === req.user.email) {
      actualizado = { ...g, ...req.body };
      return actualizado;
    }
    return g;
  });

  if (!actualizado) {
    return res.status(404).json({ error: "Gasto no encontrado" });
  }

  res.json(actualizado);
});
// =====================

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});

