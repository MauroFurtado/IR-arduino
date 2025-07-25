# SISTEMA DE ALARME E ILUMINAÇÃO AUTOMÁTICA POR PRESENÇA


Este projeto é um sistema de monitoramento em tempo real para Arduino, com interface web para controle de modos, alarme e visualização de eventos esse projeto foi reallizado como trabalho final da disciplina de Sistemas de Tempo Real.

## Funcionalidades

- Monitoramento de presença via sensor PIR
- Controle de modos: desligado, casa, alarme
- Alarme sonoro e visual (buzzer e LEDs)
- Log de eventos e status em tempo real
- Comunicação entre Arduino e servidor via Serial + API 

## Estrutura

- **codigo do arduino/sistemaPresenca.ino**: Código principal do Arduino
- **src/test/mock-server.cjs**: Servidor Node.js para comunicação Serial/API
- **src/**: Interface web (React + Tailwind)

## Instalação

### 1. Arduino

- Instale a biblioteca [ArduinoJson](https://arduinojson.org/)
- Faça upload do arquivo [`sistemaPresenca.ino`](src/codigo%20do%20arduino/sistemaPresenca.ino) para seu Arduino

### 2. Servidor Node.js

```sh
cd src/test
npm install serialport express cors
node mock-server.cjs
```

- Ajuste a porta serial (`COM5`) conforme necessário no arquivo [`mock-server.cjs`](src/test/mock-server.cjs)

### 3. Interface Web

```sh
npm install
npm run dev
```

## Uso

- Selecione o modo desejado na interface (Casa, Alarme, Desligado)
- O status do sistema e logs de eventos serão atualizados em tempo real
- O alarme pode ser desativado manualmente pela interface




**Arquivos principais:**
- Arduino: [`sistemaPresenca.ino`](src/codigo%20do%20arduino/sistemaPresenca.ino)
- Servidor: [`mock-server.cjs`](src/test/mock-server.cjs)
- Interface: [`App.tsx`](src/App.tsx),