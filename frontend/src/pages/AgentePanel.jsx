// pages/AgentePanel.jsx
// Panel del agente — gestión de casos asignados
import { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pqrsService } from '../services/pqrsService';

const estadoInicial = { pqrs: [], cargando: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'CARGAR_INICIO':
      return { ...state, cargando: true, error: null };
    case 'CARGAR_EXITO':
      return { ...state, cargando: false, pqrs: action.payload };
    case 'CARGAR_ERROR':
      return { ...state, cargando: false, error: action.payload };
    case 'ACTUALIZAR_PQRS':
      return {
        ...state,
        pqrs: state.pqrs.map(p => p.id === action.payload.id ? action.payload : p),
      };
    default:
      return state;
  }
}

const coloresEstado = {
  Abierta:   { bg: '#E3F2FD', color: '#1565C0' },
  EnGestion: { bg: '#FFF3E0', color: '#E65100' },
  Resuelta:  { bg: '#E8F5E9', color: '#2E7D32' },
  Cerrada:   { bg: '#F5F5F5', color: '#616161' },
};

function AgentePanel() {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'CARGAR_INICIO' });
    pqrsService.obtenerTodas()
      .then(data => dispatch({ type: 'CARGAR_EXITO', payload: data }))
      .catch(err => dispatch({ type: 'CARGAR_ERROR', payload: err.message }));
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const actualizada = await pqrsService.actualizar(id, { estado: nuevoEstado });
      dispatch({ type: 'ACTUALIZAR_PQRS', payload: actualizada });
    } catch {
      alert('Error al actualizar el estado.');
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  const pendientes = state.pqrs.filter(p => p.estado === 'Abierta' || p.estado === 'EnGestion');
  const resueltas  = state.pqrs.filter(p => p.estado === 'Resuelta' || p.estado === 'Cerrada');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6FB' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: '#2E75B6', padding: '0 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00A896' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            Sistema PQRS — Gases de Occidente
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#DBEAFE', fontSize: 14 }}>
            👤 {usuario?.nombre} <span style={{ color: '#00A896', fontWeight: 700 }}>(Agente)</span>
          </span>
          <button onClick={handleLogout} style={{
            backgroundColor: 'transparent', border: '1px solid #DBEAFE',
            color: '#DBEAFE', padding: '6px 14px', borderRadius: 6,
            cursor: 'pointer', fontSize: 13
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>

        <h2 style={{ color: '#1F3864', marginBottom: 4 }}>Panel del Agente</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          Casos asignados para gestión y resolución.
        </p>

        {/* Resumen rápido */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ backgroundColor: '#FFF3E0', borderRadius: 10, padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#E65100' }}>{pendientes.length}</div>
            <div style={{ fontSize: 13, color: '#E65100', marginTop: 4 }}>Casos pendientes</div>
          </div>
          <div style={{ backgroundColor: '#E8F5E9', borderRadius: 10, padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2E7D32' }}>{resueltas.length}</div>
            <div style={{ fontSize: 13, color: '#2E7D32', marginTop: 4 }}>Casos resueltos</div>
          </div>
        </div>

        {state.cargando && <p style={{ color: '#6B7280' }}>Cargando casos...</p>}
        {state.error && <p style={{ color: 'red' }}>Error: {state.error}</p>}

        {/* Casos pendientes */}
        {pendientes.length > 0 && (
          <>
            <h3 style={{ color: '#1F3864', marginBottom: 12, borderBottom: '2px solid #E5E7EB', paddingBottom: 8 }}>
              📋 Casos pendientes
            </h3>
            {pendientes.map(p => {
              const est = coloresEstado[p.estado];
              return (
                <div key={p.id} style={{
                  backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${est.color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: '#1F3864' }}>#{p.id} — {p.tipo}</span>
                        <span style={{
                          backgroundColor: est.bg, color: est.color,
                          padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600
                        }}>
                          {p.estado === 'EnGestion' ? 'En Gestión' : p.estado}
                        </span>
                      </div>
                      <p style={{ color: '#4B5563', margin: '0 0 6px' }}>{p.descripcion}</p>
                      <small style={{ color: '#9CA3AF' }}>
                        {new Date(p.fechaCreacion).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </small>
                    </div>
                    <div style={{ minWidth: 150 }}>
                      <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                        Cambiar estado:
                      </label>
                      <select
                        value={p.estado}
                        onChange={e => cambiarEstado(p.id, e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6,
                          border: '1px solid #D1D5DB', fontSize: 13, cursor: 'pointer' }}
                      >
                        <option value="Abierta">Abierta</option>
                        <option value="EnGestion">En Gestión</option>
                        <option value="Resuelta">Resuelta</option>
                        <option value="Cerrada">Cerrada</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Casos resueltos */}
        {resueltas.length > 0 && (
          <>
            <h3 style={{ color: '#1F3864', margin: '28px 0 12px', borderBottom: '2px solid #E5E7EB', paddingBottom: 8 }}>
              ✅ Casos resueltos / cerrados
            </h3>
            {resueltas.map(p => {
              const est = coloresEstado[p.estado];
              return (
                <div key={p.id} style={{
                  backgroundColor: '#FAFAFA', borderRadius: 10, padding: 16, marginBottom: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  borderLeft: `4px solid ${est.color}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 600, color: '#6B7280' }}>#{p.id} — {p.tipo}</span>
                    <span style={{
                      backgroundColor: est.bg, color: est.color,
                      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>
                      {p.estado}
                    </span>
                    <span style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 'auto' }}>
                      {new Date(p.fechaCreacion).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <p style={{ color: '#9CA3AF', margin: '6px 0 0', fontSize: 13 }}>{p.descripcion}</p>
                </div>
              );
            })}
          </>
        )}

        {!state.cargando && state.pqrs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>
            No hay casos asignados.
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentePanel;
