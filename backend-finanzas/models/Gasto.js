const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema({
  texto: String,
  monto: Number,
  tipo: String,
  categoria: String,
  email: String
});

module.exports = mongoose.model("Gasto", gastoSchema);