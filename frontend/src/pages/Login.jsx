// pages/Login.jsx
// Página de inicio de sesión — usa useAuth() del Context API
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/pqrsService';

function Login() {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { usuario, token } = await authService.login(credenciales);
      iniciarSesion(usuario, token);
      navigate('/portal');
    } catch {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', padding: 32,
      border: '1px solid #ddd', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center', color: '#1F3864' }}>Iniciar Sesión</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Sistema PQRS — Gases de Occidente</p>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Correo electrónico</label>
          <input type="email" name="email" value={credenciales.email}
            onChange={handleChange} required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label>Contraseña</label>
          <input type="password" name="password" value={credenciales.password}
            onChange={handleChange} required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{
          width: '100%', backgroundColor: '#1F3864', color: '#fff',
          padding: 10, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15
        }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
