// mock-server.js
const express = require('express');
const cors = require('cors');
const { SerialPort, ReadlineParser } = require('serialport');

const app = express();
app.use(cors());
app.use(express.json());

// ==== Estado do sistema ====
let status = {
  presenca: false,
  alarme: false,
  modo: 'desligado',
  hora: new Date().toLocaleTimeString()
};

// ==== Configuração da porta serial ====
const port = new SerialPort({
  path: 'COM5', // Substitua pela porta correta no Windows ou /dev/ttyUSB0 no Linux
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
  try {
    const json = JSON.parse(data);
    status.presenca = json.presenca;
    status.alarme = json.alarme;
    status.modo = json.modo;
    status.hora = new Date().toLocaleTimeString();
    console.log('Recebido do Arduino:', status);
  } catch (err) {
    console.error('Erro ao parsear JSON:', err.message);
  }
});

// ==== Rotas ====
app.get('/api/status', (req, res) => {
  res.json(status);
});

app.post('/api/modo', (req, res) => {
  const { modo } = req.body;
  if (modo) {
    status.modo = modo;
    port.write(`${modo}\n`); // Envia comando para Arduino
    console.log(`Modo alterado para: ${modo}`);
    res.json({ success: true, modo });
  } else {
    res.status(400).json({ success: false, message: 'Modo inválido' });
  }
});

app.post('/api/desativar-alarme', (req, res) => {
  status.alarme = false;
  port.write(`desligar\n`);
  console.log('Alarme desativado via API');
  res.json({ success: true });
});

// ==== Inicializa servidor ====
app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
