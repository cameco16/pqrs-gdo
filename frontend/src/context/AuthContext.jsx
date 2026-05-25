// context/AuthContext.jsx
// Context API — gestión global del estado de autenticación
import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);

  const iniciarSesion = (datosUsuario, token) => {
    localStorage.setItem('token', token);
    setUsuario(datosUsuario);
    setAutenticado(true);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    setAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ usuario, autenticado, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}
