// pages/AdminPanel.jsx
// Panel administrativo — gestión completa de PQRS y usuarios
import { useReducer, useEffect, useState } from 'react';
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
    case 'ELIMINAR_PQRS':
      return { ...state, pqrs: state.pqrs.filter(p => p.id !== action.payload) };
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

function AdminPanel() {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const [filtro, setFiltro] = useState('Todos');
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

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que desea eliminar esta PQRS?')) return;
    try {
      await pqrsService.eliminar(id);
      dispatch({ type: 'ELIMINAR_PQRS', payload: id });
    } catch {
      alert('Error al eliminar la PQRS.');
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  const pqrsFiltradas = filtro === 'Todos'
    ? state.pqrs
    : state.pqrs.filter(p => p.estado === filtro);

  const conteo = {
    total:     state.pqrs.length,
    Abierta:   state.pqrs.filter(p => p.estado === 'Abierta').length,
    EnGestion: state.pqrs.filter(p => p.estado === 'EnGestion').length,
    Resuelta:  state.pqrs.filter(p => p.estado === 'Resuelta').length,
    Cerrada:   state.pqrs.filter(p => p.estado === 'Cerrada').length,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6FB' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: '#1F3864', padding: '0 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00A896' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            Sistema PQRS — Gases de Occidente
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#CADCFC', fontSize: 14 }}>
            👤 {usuario?.nombre} <span style={{ color: '#00A896', fontWeight: 700 }}>(Admin)</span>
          </span>
          <button onClick={handleLogout} style={{
            backgroundColor: 'transparent', border: '1px solid #CADCFC',
            color: '#CADCFC', padding: '6px 14px', borderRadius: 6,
            cursor: 'pointer', fontSize: 13
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>

        <h2 style={{ color: '#1F3864', marginBottom: 8 }}>Panel Administrativo</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          Gestión completa de todas las solicitudes y PQRS del sistema.
        </p>

        {/* Tarjetas de resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total', valor: conteo.total, bg: '#1F3864', color: '#fff' },
            { label: 'Abiertas', valor: conteo.Abierta, bg: '#E3F2FD', color: '#1565C0' },
            { label: 'En Gestión', valor: conteo.EnGestion, bg: '#FFF3E0', color: '#E65100' },
            { label: 'Resueltas', valor: conteo.Resuelta, bg: '#E8F5E9', color: '#2E7D32' },
          ].map(card => (
            <div key={card.label} style={{
              backgroundColor: card.bg, borderRadius: 10,
              padding: '20px 16px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: card.color }}>{card.valor}</div>
              <div style={{ fontSize: 13, color: card.color, marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['Todos', 'Abierta', 'EnGestion', 'Resuelta', 'Cerrada'].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '6px 16px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: filtro === f ? 700 : 400,
              backgroundColor: filtro === f ? '#1F3864' : '#E5E7EB',
              color: filtro === f ? '#fff' : '#374151',
            }}>
              {f === 'EnGestion' ? 'En Gestión' : f}
            </button>
          ))}
        </div>

        {/* Lista de PQRS */}
        {state.cargando && <p style={{ color: '#6B7280' }}>Cargando...</p>}
        {state.error && <p style={{ color: 'red' }}>Error: {state.error}</p>}

        {pqrsFiltradas.length === 0 && !state.cargando && (
          <div style={{ textAlign: 'center', padding: 48, color: '#9CA3AF' }}>
            No hay PQRS con este filtro.
          </div>
        )}

        {pqrsFiltradas.map(p => {
          const est = coloresEstado[p.estado] || coloresEstado.Cerrada;
          return (
            <div key={p.id} style={{
              backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'flex-start', gap: 16
            }}>
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

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
                <select
                  value={p.estado}
                  onChange={e => cambiarEstado(p.id, e.target.value)}
                  style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #D1D5DB',
                    fontSize: 13, cursor: 'pointer' }}
                >
                  <option value="Abierta">Abierta</option>
                  <option value="EnGestion">En Gestión</option>
                  <option value="Resuelta">Resuelta</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
                <button onClick={() => eliminar(p.id)} style={{
                  backgroundColor: '#FEE2E2', color: '#DC2626',
                  border: 'none', borderRadius: 6, padding: '6px 8px',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminPanel;
