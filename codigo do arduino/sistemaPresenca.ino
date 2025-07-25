#include <ArduinoJson.h>

// ==== Sensores e atuadores ====
const int pir_pin = 2;
const int ledVerde_pin = 6;     // LED do modo casa
const int ledAlarme_pin = 3;
const int buzzer_pin = 4;

// ==== Temporização ====
unsigned long tempoSerial = 0;
unsigned long tempoBuzzer = 0;
const unsigned long intervaloSerial = 1000;
const unsigned long intervaloBuzzer = 100;

// ==== Estados ====
bool buzzerLigado = false;
bool sistemaAtivo = false;       
bool alarmeDisparado = false;    
bool luzLigadaExibida = false;
char modoAtual[12] = "desligado";

// ==== JSON ====
StaticJsonDocument<200> doc;

//Enviar status JSON pela Serial
void enviarStatusJson() {
  doc.clear();
  doc["presenca"] = digitalRead(pir_pin) == HIGH;
  doc["alarme"] = alarmeDisparado; 
  doc["modo"] = modoAtual;
  serializeJson(doc, Serial);
  Serial.println();
}

//Processa comando vindo da Serial
void processaComando(const char *comando) {
  if (strcmp(comando, "casa") == 0) {
    sistemaAtivo = false;
    alarmeDisparado = false;
    strcpy(modoAtual, "casa");
    digitalWrite(ledVerde_pin, LOW);
    digitalWrite(ledAlarme_pin, LOW);
    noTone(buzzer_pin);
    enviarStatusJson();

  } else if (strcmp(comando, "alarme") == 0) {
    sistemaAtivo = true;
    alarmeDisparado = false;
    strcpy(modoAtual, "alarme");
    digitalWrite(ledVerde_pin, LOW);
    enviarStatusJson();

  } else if (strcmp(comando, "desligado") == 0) {
    sistemaAtivo = false;
    alarmeDisparado = false;
    strcpy(modoAtual, "desligado");
    digitalWrite(ledVerde_pin, LOW);
    digitalWrite(ledAlarme_pin, LOW);
    noTone(buzzer_pin);
    enviarStatusJson();

  } else if (strcmp(comando, "desativar-alarme") == 0) {
    alarmeDisparado = false;
    digitalWrite(ledAlarme_pin, LOW);
    noTone(buzzer_pin);
    enviarStatusJson();
  }
}

void setup() {
  pinMode(pir_pin, INPUT);
  pinMode(ledVerde_pin, OUTPUT);
  pinMode(ledAlarme_pin, OUTPUT);
  pinMode(buzzer_pin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long tempoAtual = millis();

  //Ler comandos da Serial
  if (Serial.available()) {
    String comandoStr = Serial.readStringUntil('\n');
    comandoStr.trim();
    char comando[20];
    comandoStr.toCharArray(comando, sizeof(comando));
    processaComando(comando);
  }

  bool movimento = digitalRead(pir_pin) == HIGH;

  //Lógica do modo 
  if (sistemaAtivo && movimento && !alarmeDisparado) {
    alarmeDisparado = true;
    enviarStatusJson();
  }

  // Se alarme disparado, continua tocando até desativar
  if (alarmeDisparado) {
    if (tempoAtual - tempoBuzzer >= intervaloBuzzer) {
      if (buzzerLigado) {
        noTone(buzzer_pin);
        digitalWrite(ledAlarme_pin, LOW);
      } else {
        tone(buzzer_pin, buzzerLigado ? 500 : 2500);
        digitalWrite(ledAlarme_pin, HIGH);
      }
      buzzerLigado = !buzzerLigado;
      tempoBuzzer = tempoAtual;
    }
  } else {
    noTone(buzzer_pin);
    digitalWrite(ledAlarme_pin, LOW);
  }

  //Lógica do modo casa 
  if (strcmp(modoAtual, "casa") == 0) {
    if (movimento && !luzLigadaExibida) {
      digitalWrite(ledVerde_pin, HIGH);
      luzLigadaExibida = true;
      enviarStatusJson();
    } else if (!movimento && luzLigadaExibida) {
      digitalWrite(ledVerde_pin, LOW);
      luzLigadaExibida = false;
      enviarStatusJson();
    }
  }

  //Atualização periódica do status 
  if (tempoAtual - tempoSerial >= intervaloSerial) {
    enviarStatusJson();
    tempoSerial = tempoAtual;
  }
}
