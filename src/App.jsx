import { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListaMovimientos from "./components/ListaMovimientos";
import Resumen from "./components/Resumen";
import Grafico from "./components/Grafico";
import Login from "./components/LoginComponent";

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  // 🔥 detectar login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
  }, []);

  // 🔥 traer gastos del backend
  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const res = await fetch("http://localhost:3000/gastos", {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });

        const data = await res.json();
        setMovimientos(data);
      } catch (err) {
        console.error("Error cargando gastos", err);
      }
    };

    if (isAuth) {
      fetchGastos();
    }
  }, [isAuth]);

  // 🔥 AGREGAR (AHORA CON BACKEND)
 const agregarMovimiento = async (mov) => {
  try {
    const res = await fetch("http://localhost:3000/gastos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(mov)
    });

    // 🔥 manejo de error real
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al guardar");
    }

    const data = await res.json();

    setMovimientos(prev => [data, ...prev]);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const eliminarMovimiento = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/gastos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      throw new Error("Error al eliminar");
    }

    setMovimientos(prev => prev.filter(m => m.id !== id));

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const editarMovimiento = async (movEditado) => {
  try {
    const res = await fetch(`http://localhost:3000/gastos/${movEditado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(movEditado)
    });

    if (!res.ok) {
      throw new Error("Error al editar");
    }

    const data = await res.json();

    setMovimientos(prev =>
      prev.map(m => m.id === data.id ? data : m)
    );

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  if (!isAuth) {
    return <Login setIsAuth={setIsAuth} />;
  }

  return (
    <div className="container">
      <h1>Control de Gastos</h1>

      <Resumen movimientos={movimientos} />

      <Formulario agregarMovimiento={agregarMovimiento} />

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