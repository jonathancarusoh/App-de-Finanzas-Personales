const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "clave_secreta";

// 🧠 fake DB (después lo cambiamos por real)
let users = [];

let gastos = [];

// 🟢 RUTA PROTEGIDA
app.get("/gastos", auth, (req, res) => {
  const userGastos = gastos.filter(g => g.email === req.user.email);
  res.json(userGastos);
});

// ➕ CREAR GASTO
app.post("/gastos", auth, (req, res) => {
  const nuevo = {
    ...req.body,
    email: req.user.email
  };

  gastos.push(nuevo);

  res.json(nuevo);
});

// 🟢 REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existe = users.find(u => u.email === email);
  if (existe) return res.status(400).json({ error: "Usuario ya existe" });

  const hash = await bcrypt.hash(password, 10);

  users.push({ email, password: hash });

  res.json({ message: "Usuario creado" });
});

// 🟢 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "Usuario no existe" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Password incorrecta" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});


// ❌ DELETE
app.delete("/gastos/:id", auth, (req, res) => {
  gastos = gastos.filter(g => g.id != req.params.id);
  res.json({ ok: true });
});

// (editar) PUT
app.put("/gastos/:id", auth, (req, res) => {
  gastos = gastos.map(g =>
    g.id == req.params.id ? { ...g, ...req.body } : g
  );

  res.json(req.body);
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));