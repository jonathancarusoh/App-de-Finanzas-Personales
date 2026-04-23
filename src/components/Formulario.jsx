import { useState } from "react";

export default function Formulario({ agregarMovimiento }) {
  const [texto, setTexto] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("gasto");
    const [categoria, setCategoria] = useState("general");
  
const handleSubmit = (e) => {
    e.preventDefault();

    if (!texto || !monto) return;

 agregarMovimiento({
  texto,
  monto: Number(monto),
  tipo,
  categoria
});

    setTexto("");
    setMonto("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Descripción"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
  <option value="comida">Comida</option>
  <option value="transporte">Transporte</option>
  <option value="ocio">Ocio</option>
  <option value="general">General</option>
</select>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </select>

      <button>Agregar</button>
    </form>
  );
}