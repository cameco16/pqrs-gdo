// App.jsx
// Configuración de rutas con React Router v6 y protección por autenticación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ListaPQRS from './pages/ListaPQRS';
import FormularioPQRS from './components/FormularioPQRS';

// Componente de ruta protegida: redirige al login si no está autenticado
function RutaProtegida({ children, rolRequerido }) {
  const { autenticado, usuario } = useAuth();

  if (!autenticado) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario?.rol !== rolRequerido) {
    return <Navigate to="/no-autorizado" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Portal del usuario autenticado */}
          <Route path="/portal" element={
            <RutaProtegida>
              <ListaPQRS />
            </RutaProtegida>
          } />
          <Route path="/portal/nueva-pqrs" element={
            <RutaProtegida>
              <FormularioPQRS />
            </RutaProtegida>
          } />

          {/* Panel del agente */}
          <Route path="/agente" element={
            <RutaProtegida rolRequerido="agente">
              <div><h2>Panel del Agente</h2></div>
            </RutaProtegida>
          } />

          {/* Panel administrativo */}
          <Route path="/admin" element={
            <RutaProtegida rolRequerido="admin">
              <div><h2>Panel Administrativo</h2></div>
            </RutaProtegida>
          } />

          {/* Ruta 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: 80 }}>
              <h2>404 — Página no encontrada</h2>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
