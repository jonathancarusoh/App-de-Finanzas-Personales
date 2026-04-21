import { useState } from "react";

export default function ListaMovimientos({ movimientos, eliminarMovimiento, editarMovimiento }) {

  const [editandoId, setEditandoId] = useState(null);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  return (
    <div>
      {movimientos.map((mov) => (
        <div key={mov.id}>

          {editandoId === mov.id ? (
            <>
              <input
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
              />

              <input
                type="number"
                value={nuevoMonto}
                onChange={(e) => setNuevoMonto(e.target.value)}
              />

              <button onClick={() => {
                editarMovimiento({
                  ...mov,
                  texto: nuevoTexto,
                  monto: Number(nuevoMonto)
                });
                setEditandoId(null);
              }}>
                Guardar
              </button>
            </>
          ) : (
            <>
              <span>{mov.texto}</span>

              <span>
                {mov.tipo === "gasto" ? "-" : "+"}${mov.monto}
              </span>

              <span>{mov.categoria}</span>

              <button onClick={() => {
                setEditandoId(mov.id);
                setNuevoTexto(mov.texto);
                setNuevoMonto(mov.monto);
              }}>
                ✏️
              </button>

              <button onClick={() => eliminarMovimiento(mov.id)}>
                ❌
              </button>
            </>
          )}

        </div>
      ))}
    </div>
  );
}