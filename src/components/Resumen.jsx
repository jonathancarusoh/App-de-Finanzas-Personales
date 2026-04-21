export default function Resumen({ movimientos }) {
  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = ingresos - gastos;

  return (
    <div>
      <h2>Balance: ${balance}</h2>
      <p>Ingresos: ${ingresos}</p>
      <p>Gastos: ${gastos}</p>
    </div>
  );
}