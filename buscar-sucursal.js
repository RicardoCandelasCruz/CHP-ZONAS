function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

app.post('/buscar-sucursal', (req, res) => {
  const { direccion } = req.body;

  if (!direccion) {
    return res.status(400).json({ message: 'Dirección requerida' });
  }

  const texto = normalizar(direccion);

  const sucursal = sucursales.find(s =>
    s.fraccionamientos.some(f =>
      texto.includes(normalizar(f))
    )
  );

  if (!sucursal) {
    return res.status(404).json({
      message: 'No encontramos una sucursal para esa zona'
    });
  }

  res.json({
    nombre: sucursal.nombre,
    telefono: sucursal.telefono,
    whatsapp: sucursal.whatsapp,
    fraccionamientos: sucursal.fraccionamientos
  });
});
