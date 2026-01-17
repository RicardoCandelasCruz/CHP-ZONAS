const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Cargar datos de sucursales con manejo de errores
let sucursales = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'public', 'sucursales.json'), 'utf8');
  sucursales = JSON.parse(data);
} catch (error) {
  console.error('Error cargando sucursales.json:', error.message);
  process.exit(1);
}

function normalizar(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

app.post('/buscar-sucursal', (req, res) => {
  try {
    const { direccion } = req.body;

    if (!direccion || typeof direccion !== 'string') {
      return res.status(400).json({ message: 'Dirección requerida' });
    }

    const texto = normalizar(direccion);

    const sucursal = sucursales.find(s =>
      s.fraccionamientos && s.fraccionamientos.some(f =>
        normalizar(f).includes(texto) || texto.includes(normalizar(f))
      )
    );

    if (!sucursal) {
      return res.status(404).json({
        message: 'No encontramos una sucursal para esa zona'
      });
    }

    res.json({
      nombre: sucursal.nombre || 'Sin nombre',
      telefono: sucursal.telefono || 'Sin teléfono',
      whatsapp: sucursal.whatsapp || 'Sin WhatsApp',
      fraccionamientos: sucursal.fraccionamientos || []
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));