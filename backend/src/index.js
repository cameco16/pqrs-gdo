// backend/src/index.js
// Servidor Express con documentación Swagger y rutas REST para PQRS
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ── Configuración de Swagger ─────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API PQRS — Gases de Occidente',
      version: '1.0.0',
      description: 'API REST para la gestión centralizada de solicitudes y PQRS',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ── Rutas ────────────────────────────────────────────────────────────────────
const pqrsRoutes = require('./routes/pqrs');
const authRoutes = require('./routes/auth');

app.use('/api/pqrs', pqrsRoutes);
app.use('/api/auth', authRoutes);

// ── Inicio del servidor ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});
