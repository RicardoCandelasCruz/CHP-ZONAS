const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // donde estará tu HTML

// ================= DATOS =================
const sucursales = [
  {
    id: 1,
    nombre: 'Cheese Pizza Centro',
    telefono: '4491234567',
    whatsapp: '4491234567',
    fraccionamientos: [
      'pilar blanco',
      'españa',
      'insurgentes'
    ]
  },
  {
    id: 2,
    nombre: 'Cheese Pizza Norte',
    telefono: '4499876543',
    whatsapp: '4499876543',
    fraccionamientos: [
      'bosques',
      'altavista',
      'canteras'
    ]
  }
];

// =============== ENDPOINT ===============
app.post('/buscar-sucursal', (req, res) => {
  const { direccion } = req.body;

  if (!direccion) {
    return res.status(400).json({ message: 'Dirección requerida' });
  }

  const texto = direccion.toLowerCase();

  const sucursal = sucursales.find(s =>
    s.fraccionamientos.some(f => texto.includes(f))
  );

  if (!sucursal) {
    return res.status(404).json({
      message: 'No se encontró sucursal para esa zona'
    });
  }

  res.json({
    nombre: sucursal.nombre,
    telefono: sucursal.telefono,
    whatsapp: sucursal.whatsapp,
    fraccionamientos: sucursal.fraccionamientos
  });
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🍕 Cheese Pizza server en http://localhost:${PORT}`);
});