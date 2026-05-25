// components/TarjetaPQRS.jsx
// Componente reutilizable que muestra el resumen de una PQRS
import React from 'react';

const coloresEstado = {
  Abierta:    '#2196F3',
  EnGestion:  '#FF9800',
  Resuelta:   '#4CAF50',
  Cerrada:    '#9E9E9E',
};

function TarjetaPQRS({ pqrs }) {
  const { id, tipo, descripcion, estado, fechaCreacion } = pqrs;
  const color = coloresEstado[estado] || '#9E9E9E';

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>PQRS #{id} — {tipo}</h3>
        <span style={{
          backgroundColor: color, color: '#fff',
          padding: '4px 12px', borderRadius: 20, fontSize: 13
        }}>
          {estado}
        </span>
      </div>
      <p style={{ color: '#555', marginTop: 8 }}>{descripcion}</p>
      <small style={{ color: '#999' }}>
        Registrada el: {new Date(fechaCreacion).toLocaleDateString('es-CO')}
      </small>
    </div>
  );
}

export default TarjetaPQRS;
