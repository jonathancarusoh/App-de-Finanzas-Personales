import { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListaMovimientos from "./components/ListaMovimientos";
import Resumen from "./components/Resumen";
import Grafico from "./components/Grafico";
import Login from "./components/LoginComponent";

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 loading

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
        setLoading(true);

        const res = await fetch("http://localhost:3000/gastos", {
        headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`
}
        });

        // 🔥 manejo de error
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al cargar gastos");
        }

        const data = await res.json();
        setMovimientos(data);

      } catch (err) {
        console.error("Error cargando gastos", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchGastos();
    }
  }, [isAuth]);

  // 🔥 AGREGAR
  const agregarMovimiento = async (mov) => {
    try {
      const res = await fetch("http://localhost:3000/gastos", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
        body: JSON.stringify(mov)
      });

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

  // 🔥 ELIMINAR
  const eliminarMovimiento = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/gastos/${id}`, {
        method: "DELETE",
       headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`
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

  // 🔥 EDITAR
  const editarMovimiento = async (movEditado) => {
    try {
      const res = await fetch(`http://localhost:3000/gastos/${movEditado.id}`, {
        method: "PUT",
       headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
        body: JSON.stringify(movEditado)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al editar");
      }

      const data = await res.json();

      setMovimientos(prev =>
        prev.map(m => (m.id === data.id ? data : m))
      );

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!isAuth) {
    return <Login setIsAuth={setIsAuth} />;
  }

  const logout = () => {
  localStorage.removeItem("token");
  setIsAuth(false);
};

return (
  <div className="container">
    <h1>Control de Gastos</h1>

  <button onClick={logout}>Cerrar sesión</button>
    
    {loading ? (
      <p>Cargando...</p>
    ) : (
      <>
        <Resumen movimientos={movimientos} />
        <Formulario agregarMovimiento={agregarMovimiento} />
        <ListaMovimientos
          movimientos={movimientos}
          eliminarMovimiento={eliminarMovimiento}
          editarMovimiento={editarMovimiento}
        />
        <Grafico movimientos={movimientos} />
      </>
    )}

  </div>
);
}

export default App;