# Quick Start Guide - OpenAvis Development

## 🚀 Setup Rapido (5 minuti)

### Prerequisites Check
```bash
# Verifica Node.js (richiesto v18+)
node --version

# Installa Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Installa Azure Static Web Apps CLI (opzionale)
npm install -g @azure/static-web-apps-cli
```

### 1. Clone e Setup
```bash
# Clone repository (se non l'hai già fatto)
git clone https://github.com/your-org/OpenAvis.git
cd OpenAvis
```

### 2. Configura API
```bash
cd api

# Installa dipendenze
npm install

# Crea file di configurazione locale
cp local.settings.json.example local.settings.json

# IMPORTANTE: Modifica local.settings.json con le tue credenziali Azure
# Per ora, puoi lasciare i valori di esempio per test senza DB
```

**Contenuto `local.settings.json` per test locale senza Azure**:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_DB_ENDPOINT": "https://localhost:8081",
    "COSMOS_DB_KEY": "mock-key",
    "COSMOS_DB_DATABASE": "openavis-db",
    "ACS_CONNECTION_STRING": "",
    "EMAIL_SENDER_ADDRESS": "test@localhost",
    "NODE_ENV": "development"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}
```

### 3. Start API
```bash
# Dalla cartella api/
npm start
```

Dovresti vedere:
```
Functions:
        config: [GET] http://localhost:7071/api/config
        sendOtp: [POST] http://localhost:7071/api/send-otp
        signup: [POST] http://localhost:7071/api/signup
        verifyOtp: [POST] http://localhost:7071/api/verify-otp
```

### 4. Test API (nuovo terminal)
```bash
# Test endpoint config
curl http://localhost:7071/api/config

# Dovrebbe restituire:
{
  "associationName": "AVIS Merate",
  "location": "Merate, LC, Italy",
  "contactEmail": "contact@avismerate.it",
  "domain": "avismerate.it"
}
```

### 5. Start Frontend (terzo terminal)
```bash
cd frontend

# Installa dipendenze (prima volta)
npm install

# Start development server
npm start
```

Il browser si aprirà automaticamente su `http://localhost:3000` 🎉

---

## 🧪 Test Completo con SWA CLI

Per testare in un ambiente più simile alla produzione:

```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Start emulator SWA (dalla root del progetto)
swa start frontend/build --api-location api
```

Apri `http://localhost:4280` - Frontend e API sono serviti insieme!

---

## 🔧 Troubleshooting

### Problema: "func: command not found"
**Soluzione**: Installa Azure Functions Core Tools
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### Problema: API ritorna errori di connessione DB
**Soluzione**: È normale in dev mode senza Azure configurato
- Gli OTP vengono loggati nella console invece che salvati
- Le email vengono simulate (loggato nella console)
- Il signup potrebbe fallire (necessita Cosmos DB)

Per testare completamente, configura le credenziali Azure reali in `local.settings.json`

### Problema: "Port 7071 already in use"
**Soluzione**: Ferma eventuali altre istanze di Azure Functions
```bash
# Windows
netstat -ano | findstr :7071
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :7071
kill <PID>
```

### Problema: Frontend non chiama API
**Soluzione**: Verifica la configurazione in `frontend/src/api/client.ts`
- In dev mode dovrebbe usare `http://localhost:7071`
- Con SWA CLI dovrebbe usare relative URL

---

## 📝 Modifica Configurazione

Per personalizzare per la tua AVIS locale:

**File: `api/config.json`**
```json
{
  "associationName": "AVIS TuaCittà",
  "location": "TuaCittà, Provincia, Italy",
  "contactEmail": "info@avistuacitta.it",
  "domain": "avistuacitta.it"
}
```

Riavvia l'API e vedrai i nuovi valori!

---

## 🎯 Next Steps

1. ✅ Familiarizza con la struttura del codice
2. ✅ Testa tutte le funzionalità localmente
3. ✅ Leggi [MIGRATION.md](MIGRATION.md) per il deploy
4. ✅ Configura le credenziali Azure reali
5. ✅ Segui il README principale per il deploy

---

## 📚 File Importanti

- `README.md` - Documentazione completa
- `REFACTORING_SUMMARY.md` - Riepilogo modifiche
- `MIGRATION.md` - Checklist deployment
- `api/README.md` - Documentazione API specifica
- `api/test-api.ps1` - Script test automatico

---

## 💡 Tips

- **Dev Mode**: NODE_ENV=development → Email simulate, OTP loggati
- **Beta Mode**: NODE_ENV=beta → Email reali, OTP salvati in DB
- **Prod Mode**: NODE_ENV=production → Tutto in produzione

- **Hot Reload**: Il frontend ha hot reload automatico
- **API Changes**: Devi riavviare `npm start` in `api/` per vedere le modifiche
- **TypeScript**: I file .ts sono compilati automaticamente

---

Buon coding! 🚀
