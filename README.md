# SISTEMA DE ALARME E ILUMINAÇÃO AUTOMÁTICA POR PRESENÇA

Este projeto é um sistema de monitoramento em tempo real para Arduino, com interface web para controle de modos, alarme e visualização de eventos. Projeto realizado como trabalho final da disciplina de Sistemas de Tempo Real.

## Funcionalidades

- Monitoramento de presença via sensor PIR
- Controle de modos: desligado, casa e alarme.
- Alarme sonoro e visual (buzzer e LEDs)
- Log de eventos e status em tempo real
- Comunicação entre Arduino e servidor via Serial + API REST

## Estrutura de Pastas

- **arduino/sistemaPresenca.ino**: Código principal do Arduino
- **server/mock-server.cjs**: Servidor Node.js para comunicação Serial/API REST
- **WEB/**: Interface web (React + Tailwind + TypeScript)

## Instalação

### 1. Arduino

- Instale a biblioteca [ArduinoJson](https://arduinojson.org/)
- Faça upload do arquivo [`arduino/sistemaPresenca.ino`](arduino/sistemaPresenca.ino) para seu Arduino

### 2. Servidor Node.js

```sh
cd server
npm install
node mock-server.cjs
```
- Ajuste a porta serial (`COM5`) conforme necessário no arquivo [`server/mock-server.cjs`](server/mock-server.cjs)

### 3. Interface Web

```sh
cd WEB
npm install
npm run dev
```

## Uso

- Acesse a interface web em [http://localhost:8080](http://localhost:8080)
- Selecione o modo desejado na interface (Casa, Alarme, Desligado)
- O status do sistema e logs de eventos serão atualizados em tempo real
- O alarme pode ser desativado manualmente pela interface

## Arquitetura

- A interface web (React) se comunica com o backend Node.js via HTTP (API REST)
- O backend conversa com o Arduino pela porta Serial
- Toda ação feita na interface é enviada ao backend, que repassa ao Arduino
- O status do Arduino é lido pelo backend e enviado para a interface web automaticamente


**Principais arquivos:**
- Arduino: [`arduino/sistemaPresenca.ino`](arduino/sistemaPresenca.ino)
- Backend: [`server/mock-server.cjs`](server/mock-server.cjs)
- Interface: [`WEB/src/App.tsx`](WEB/src/App.tsx)