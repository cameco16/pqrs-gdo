// backend/src/routes/auth.js
// Rutas de autenticación con documentación Swagger
const express = require('express');
const router = express.Router();

// Usuarios simulados (en producción se reemplaza por base de datos)
const usuarios = [
  { id: 1, nombre: 'David Cárdenas', email: 'david@gdo.com', password: '1234', rol: 'admin' },
  { id: 2, nombre: 'Agente GdO',    email: 'agente@gdo.com', password: '1234', rol: 'agente' },
  { id: 3, nombre: 'Usuario Final', email: 'usuario@gdo.com', password: '1234', rol: 'usuario' },
];

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token y datos del usuario
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  // Token simulado (en producción usar jsonwebtoken)
  const token = Buffer.from(`${usuario.id}:${usuario.rol}:${Date.now()}`).toString('base64');
  const { password: _, ...datosUsuario } = usuario;
  res.json({ usuario: datosUsuario, token });
});

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: El correo ya está registrado
 */
router.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ mensaje: 'El correo ya está registrado' });
  }
  const nuevo = { id: usuarios.length + 1, nombre, email, password, rol: 'usuario' };
  usuarios.push(nuevo);
  const { password: _, ...datosUsuario } = nuevo;
  res.status(201).json({ usuario: datosUsuario });
});

module.exports = router;
