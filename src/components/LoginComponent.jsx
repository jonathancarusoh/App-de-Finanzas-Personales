import { useState } from "react";

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);

      // 🔥 AVISA A APP QUE YA ESTÁ LOGUEADO
      setIsAuth(true);

    } catch (err) {
      alert(err.message);
    }
  };

  // 🆕 REGISTER
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      alert("Usuario creado ✅ ahora iniciá sesión");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Iniciar sesión
      </button>

      <button onClick={handleRegister}>
        Crear cuenta
      </button>
    </div>
  );
}