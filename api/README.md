# OpenAvis API - Azure Functions Development Guide

## Overview

This folder contains the serverless backend for OpenAvis, implemented using **Azure Functions v4** with the **Node.js Programming Model v4**.

## Architecture

### Key Components

1. **Functions** (`src/functions/`): Individual HTTP-triggered functions
   - `config.ts`: Returns association configuration
   - `sendOtp.ts`: Generates and sends OTP
   - `verifyOtp.ts`: Verifies and consumes OTP
   - `signup.ts`: Saves donor data and sends confirmation

2. **Services** (`src/services/`): Shared business logic
   - `database.ts`: Cosmos DB interactions (donors + OTPs)
   - `email.ts`: Azure Communication Services email sending

3. **Models** (`src/models/`): TypeScript interfaces
   - `otp.ts`: OTP document structure with TTL

### OTP Flow

```
User enters email
    ↓
POST /api/send-otp
    ↓
Generate 6-digit code
    ↓
Save to Cosmos DB (TTL: 5 min)
    ↓
Send email via ACS
    ↓
User enters OTP
    ↓
POST /api/verify-otp
    ↓
Check Cosmos DB
    ↓
Delete OTP (consume)
    ↓
Return success
```

## Local Development

### Prerequisites

```sh
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### Setup

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Configure environment**:
   ```sh
   cp local.settings.json.example local.settings.json
   # Edit local.settings.json with your Azure credentials
   ```

3. **Start the Functions runtime**:
   ```sh
   npm start
   ```

4. **Test endpoints**:
   ```sh
   # Get config
   curl http://localhost:7071/api/config

   # Send OTP
   curl -X POST http://localhost:7071/api/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'

   # Verify OTP
   curl -X POST http://localhost:7071/api/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","otp":"123456"}'
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `COSMOS_DB_ENDPOINT` | Cosmos DB account endpoint | `https://xxx.documents.azure.com:443/` |
| `COSMOS_DB_KEY` | Cosmos DB primary key | `your-key-here` |
| `COSMOS_DB_DATABASE` | Database name | `openavis-db` |
| `ACS_CONNECTION_STRING` | Azure Communication Services | `endpoint=https://...` |
| `EMAIL_SENDER_ADDRESS` | Email sender address | `DoNotReply@avismerate.it` |
| `NODE_ENV` | Environment | `development`, `beta`, `production` |

## Deployment

API functions are deployed automatically via GitHub Actions as part of the Static Web App deployment.

### Manual Deployment (Testing)

```sh
# Build TypeScript
npm run build

# Deploy to Azure (requires Azure CLI login)
func azure functionapp publish <your-function-app-name>
```

## File Structure

```
api/
├── src/
│   ├── functions/          # HTTP endpoints
│   │   ├── config.ts
│   │   ├── sendOtp.ts
│   │   ├── verifyOtp.ts
│   │   └── signup.ts
│   ├── services/           # Business logic
│   │   ├── database.ts
│   │   └── email.ts
│   └── models/             # TypeScript types
│       └── otp.ts
├── config.json             # Association configuration
├── host.json               # Azure Functions host config
├── package.json
├── tsconfig.json
└── local.settings.json     # Local env vars (gitignored)
```

## Testing

### Unit Tests (TODO)

```sh
npm test
```

### Integration Tests

Use the Azure Functions Core Tools to test locally with real Azure services:

1. Configure `local.settings.json` with real credentials
2. Start functions: `npm start`
3. Use Postman/curl to test endpoints

## Common Issues

### Issue: "Cannot find module '@azure/functions'"

**Solution**: Run `npm install` in the `api/` folder.

### Issue: "Email Client not initialized"

**Solution**: 
- Check `ACS_CONNECTION_STRING` in `local.settings.json`
- In dev mode (`NODE_ENV=development`), emails are logged instead of sent

### Issue: "Cannot read file config.json"

**Solution**: Ensure `config.json` exists in the `api/` folder and is deployed with the functions.

### Issue: OTPs not expiring

**Solution**: 
- Check Cosmos DB container `otps` has `defaultTtl = -1`
- Each OTP document must have `ttl: 300` field

## Best Practices

1. **Environment Detection**: Use `NODE_ENV` to differentiate local/beta/prod
2. **Error Handling**: Always wrap in try-catch and return appropriate HTTP status
3. **Logging**: Use `context.log()` and `context.error()` for Application Insights
4. **Secrets**: Never commit `local.settings.json` or credentials
5. **CORS**: Handled automatically by Static Web Apps integration

## Migration from Express Backend

The functions in this folder replace the previous Express.js backend with these changes:

| Old (Express) | New (Azure Functions) |
|---------------|----------------------|
| In-memory OTP store | Cosmos DB with TTL |
| Single `app.ts` file | Separate function files |
| Manual CORS config | No CORS needed (same origin) |
| App Service hosting | Integrated with SWA |
| €12/month | €0/month (Free tier) |

## References

- [Azure Functions Node.js Developer Guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=typescript)
- [Static Web Apps: Bring your own functions](https://learn.microsoft.com/en-us/azure/static-web-apps/functions-bring-your-own)
- [Cosmos DB TTL](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/time-to-live)
