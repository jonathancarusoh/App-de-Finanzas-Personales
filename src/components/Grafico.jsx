import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Grafico({ movimientos }) {
  const gastos = movimientos.filter(m => m.tipo === "gasto");

  const data = {
    labels: gastos.map(g => g.categoria),
    datasets: [
      {
        data: gastos.map(g => g.monto),
      },
    ],
  };

  return <Pie data={data} />;
}