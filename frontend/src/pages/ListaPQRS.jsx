// pages/ListaPQRS.jsx
// Demuestra useEffect (carga de datos) y useReducer (manejo de estado complejo)
import { useReducer, useEffect } from 'react';
import { pqrsService } from '../services/pqrsService';
import TarjetaPQRS from '../components/TarjetaPQRS';

// useReducer: reducer que maneja todos los estados posibles de la carga
const estadoInicial = { pqrs: [], cargando: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'CARGAR_INICIO':
      return { ...state, cargando: true, error: null };
    case 'CARGAR_EXITO':
      return { ...state, cargando: false, pqrs: action.payload };
    case 'CARGAR_ERROR':
      return { ...state, cargando: false, error: action.payload };
    case 'ELIMINAR_PQRS':
      return { ...state, pqrs: state.pqrs.filter(p => p.id !== action.payload) };
    default:
      return state;
  }
}

function ListaPQRS() {
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  // useEffect: ejecuta la carga de datos al montar el componente
  useEffect(() => {
    dispatch({ type: 'CARGAR_INICIO' });
    pqrsService.obtenerTodas()
      .then(data => dispatch({ type: 'CARGAR_EXITO', payload: data }))
      .catch(err => dispatch({ type: 'CARGAR_ERROR', payload: err.message }));
  }, []);

  if (state.cargando) return <p>Cargando solicitudes...</p>;
  if (state.error)    return <p style={{ color: 'red' }}>Error: {state.error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2>Mis Solicitudes y PQRS</h2>
      {state.pqrs.length === 0
        ? <p>No tiene solicitudes registradas.</p>
        : state.pqrs.map(p => <TarjetaPQRS key={p.id} pqrs={p} />)
      }
    </div>
  );
}

export default ListaPQRS;
