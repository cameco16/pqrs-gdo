// components/FormularioPQRS.jsx
// Demuestra el uso de useState para manejo de formularios
import { useState } from 'react';
import { pqrsService } from '../services/pqrsService';

function FormularioPQRS() {
  // useState: controla cada campo del formulario
  const [formulario, setFormulario] = useState({
    tipo: '',
    descripcion: '',
    canal: 'web',
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await pqrsService.crear(formulario);
      setMensaje({ tipo: 'exito', texto: 'PQRS registrada exitosamente.' });
      setFormulario({ tipo: '', descripcion: '', canal: 'web' });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al registrar la PQRS. Intente de nuevo.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Nueva Solicitud / PQRS</h2>

      {mensaje && (
        <div style={{ color: mensaje.tipo === 'exito' ? 'green' : 'red', marginBottom: 12 }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Tipo de solicitud</label>
          <select name="tipo" value={formulario.tipo} onChange={handleChange} required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}>
            <option value="">Seleccione...</option>
            <option value="Peticion">Petición</option>
            <option value="Queja">Queja</option>
            <option value="Reclamo">Reclamo</option>
            <option value="Sugerencia">Sugerencia</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Descripción</label>
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange}
            required rows={4} placeholder="Describa su caso..."
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
        </div>

        <button type="submit" disabled={enviando}
          style={{ backgroundColor: '#1F3864', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {enviando ? 'Enviando...' : 'Registrar PQRS'}
        </button>
      </form>
    </div>
  );
}

export default FormularioPQRS;
