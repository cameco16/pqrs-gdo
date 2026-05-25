// backend/src/routes/pqrs.js
// Rutas REST para PQRS con documentación Swagger
const express = require('express');
const router = express.Router();

// Datos simulados (en producción se reemplaza por base de datos)
let pqrsList = [
  { id: 1, tipo: 'Reclamo', descripcion: 'Factura con cobro incorrecto', estado: 'Abierta', fechaCreacion: new Date().toISOString(), usuarioId: 1 },
  { id: 2, tipo: 'Peticion', descripcion: 'Solicitud de revisión de medidor', estado: 'EnGestion', fechaCreacion: new Date().toISOString(), usuarioId: 1 },
];
let nextId = 3;

/**
 * @swagger
 * /api/pqrs:
 *   get:
 *     summary: Obtiene todas las PQRS registradas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de PQRS
 */
router.get('/', (req, res) => {
  res.json(pqrsList);
});

/**
 * @swagger
 * /api/pqrs/{id}:
 *   get:
 *     summary: Obtiene una PQRS por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PQRS encontrada
 *       404:
 *         description: PQRS no encontrada
 */
router.get('/:id', (req, res) => {
  const pqrs = pqrsList.find(p => p.id === parseInt(req.params.id));
  if (!pqrs) return res.status(404).json({ mensaje: 'PQRS no encontrada' });
  res.json(pqrs);
});

/**
 * @swagger
 * /api/pqrs:
 *   post:
 *     summary: Registra una nueva PQRS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, descripcion]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [Peticion, Queja, Reclamo, Sugerencia]
 *               descripcion:
 *                 type: string
 *               canal:
 *                 type: string
 *     responses:
 *       201:
 *         description: PQRS creada exitosamente
 */
router.post('/', (req, res) => {
  const { tipo, descripcion, canal = 'web' } = req.body;
  if (!tipo || !descripcion) {
    return res.status(400).json({ mensaje: 'tipo y descripcion son requeridos' });
  }
  const nueva = { id: nextId++, tipo, descripcion, canal, estado: 'Abierta', fechaCreacion: new Date().toISOString() };
  pqrsList.push(nueva);
  res.status(201).json(nueva);
});

/**
 * @swagger
 * /api/pqrs/{id}:
 *   put:
 *     summary: Actualiza el estado de una PQRS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Abierta, EnGestion, Resuelta, Cerrada]
 *     responses:
 *       200:
 *         description: PQRS actualizada
 */
router.put('/:id', (req, res) => {
  const idx = pqrsList.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ mensaje: 'PQRS no encontrada' });
  pqrsList[idx] = { ...pqrsList[idx], ...req.body };
  res.json(pqrsList[idx]);
});

/**
 * @swagger
 * /api/pqrs/{id}:
 *   delete:
 *     summary: Elimina una PQRS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PQRS eliminada
 */
router.delete('/:id', (req, res) => {
  const idx = pqrsList.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ mensaje: 'PQRS no encontrada' });
  pqrsList.splice(idx, 1);
  res.json({ mensaje: 'PQRS eliminada correctamente' });
});

module.exports = router;
