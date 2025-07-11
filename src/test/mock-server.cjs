// mock-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let status = {
  presenca: false,
  alarme: false,
  modo: 'manual',
  hora: new Date().toLocaleTimeString()
};

// API que o Arduino vai implementar
app.get('/api/status', (req, res) => {
  status.hora = new Date().toLocaleTimeString();
  //status.alarme = Math.random() > 0.5; // Simula alarme
  status.presenca = Math.random() > 0.7; // Simula sensor
  res.json(status);
});

app.post('/api/modo', (req, res) => {
  status.modo = req.body.modo;
  console.log(`Modo alterado para: ${status.modo}`);
  res.json({ success: true });
});

app.post('/api/desativar-alarme', (req, res) => {
  status.alarme = false;
  console.log('Alarme desativado');
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Mock Arduino Server rodando em http://localhost:3001');
});
