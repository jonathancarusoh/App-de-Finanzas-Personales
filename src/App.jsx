import { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListaMovimientos from "./components/ListaMovimientos";
import Resumen from "./components/Resumen";
import Grafico from "./components/Grafico";

function App() {
  const [movimientos, setMovimientos] = useState([]);

  // 🔥 cargar desde localStorage
  useEffect(() => {
    const guardado = localStorage.getItem("movimientos");
    if (guardado) {
      setMovimientos(JSON.parse(guardado));
    }
  }, []);

  // 🔥 guardar cambios
  useEffect(() => {
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
  }, [movimientos]);

  const agregarMovimiento = (mov) => {
    setMovimientos(prev => [mov, ...prev]);
  };

  const eliminarMovimiento = (id) => {
  setMovimientos(movimientos.filter(m => m.id !== id));
};

const editarMovimiento = (movEditado) => {
  setMovimientos(prev =>
    prev.map(m =>
      m.id === movEditado.id ? movEditado : m
    )
  );
};

  return (
    <div className="container">
      <h1>Control de Gastos</h1>
   
      <Resumen 
      movimientos={movimientos} />
      <Formulario 
      agregarMovimiento={agregarMovimiento} />
  <ListaMovimientos 
  movimientos={movimientos} 
  eliminarMovimiento={eliminarMovimiento}
  editarMovimiento={editarMovimiento}
/>
       <Grafico movimientos={movimientos} />
    </div>
  );
}

export default App;