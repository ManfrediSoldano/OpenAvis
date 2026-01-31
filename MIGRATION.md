# Migration Checklist: Express.js → Azure Functions

## ✅ Completed Steps

### 1. Code Migration
- [x] Renamed `backend/` to `backend-legacy/`
- [x] Created new `api/` folder structure
- [x] Migrated `DatabaseService` with OTP support
- [x] Migrated `EmailService` (identical)
- [x] Created 4 Azure Functions:
  - [x] `config.ts` - GET /api/config
  - [x] `sendOtp.ts` - POST /api/send-otp
  - [x] `verifyOtp.ts` - POST /api/verify-otp
  - [x] `signup.ts` - POST /api/signup
- [x] Copied `config.json` to `api/`
- [x] Created OTP model with TTL support

### 2. Infrastructure Updates
- [x] Updated Terraform to add `otps` container
- [x] Removed App Service Plan from Terraform
- [x] Removed Backend Web Apps from Terraform
- [x] Added app_settings to Static Web Apps
- [x] Configured Free tier for Static Web Apps

### 3. CI/CD Updates
- [x] Removed backend build/deploy steps from workflow
- [x] Added `api_location: "api"` to SWA deploy
- [x] Updated both beta and production jobs

### 4. Documentation
- [x] Updated main README.md
- [x] Created api/README.md development guide
- [x] Created local.settings.json.example
- [x] Documented migration path

---

## 🚀 Next Steps (Before Deployment)

### Phase 1: Local Testing
1. **Test API locally**:
   ```sh
   cd api
   npm install
   npm start
   ```
   - Verify all 4 endpoints work
   - Test OTP flow (send → verify)
   - Check email sending (logs in dev mode)

2. **Test with SWA CLI**:
   ```sh
   npm install -g @azure/static-web-apps-cli
   cd frontend && npm run build && cd ..
   swa start frontend/build --api-location api
   ```
   - Test full user journey
   - Verify API calls from frontend work

### Phase 2: Infrastructure Deployment
3. **Update Terraform state**:
   ```sh
   cd infrastructure
   terraform plan
   ```
   Expected changes:
   - **+1** `azurerm_cosmosdb_sql_container.otps`
   - **-1** `azurerm_service_plan.plan`
   - **-1** `azurerm_linux_web_app.backend_prod`
   - **-1** `azurerm_linux_web_app.backend_beta`
   - **~2** `azurerm_static_web_app` (modified to add app_settings)

4. **Apply Terraform**:
   ```sh
   terraform apply
   ```
   ⚠️ **Warning**: This will **destroy** the old backend App Services

### Phase 3: GitHub Actions Setup
5. **Verify GitHub Secrets** are set:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`

6. **Test Beta Deployment**:
   - Push to `main` branch
   - Monitor GitHub Actions workflow
   - Verify beta site works: `https://beta.avismerate.it`
   - Test all endpoints from frontend

7. **Approve Production**:
   - Review beta functionality
   - Approve production deployment in GitHub
   - Verify production site: `https://avismerate.it`

### Phase 4: Cleanup
8. **Verify old resources are deleted**:
   ```sh
   az resource list --resource-group OpenAvis-RG
   ```
   Should NOT see:
   - `openavis-merate-plan` (App Service Plan)
   - `openavis-merate-backend-prod`
   - `openavis-merate-backend-beta`

9. **Delete backend-legacy folder** (after confirming everything works):
   ```sh
   rm -rf backend-legacy
   ```

---

## 🧪 Testing Checklist

### API Endpoints
- [ ] `GET /api/config` returns correct association data
- [ ] `POST /api/send-otp` creates OTP in Cosmos DB
- [ ] OTP email is sent (or logged in dev)
- [ ] `POST /api/verify-otp` validates correct OTP
- [ ] `POST /api/verify-otp` rejects wrong OTP
- [ ] `POST /api/verify-otp` deletes OTP after verification
- [ ] OTP expires after 5 minutes (check Cosmos DB)
- [ ] `POST /api/signup` saves donor to Cosmos DB
- [ ] Confirmation email is sent after signup

### Frontend Integration
- [ ] Homepage loads configuration from `/api/config`
- [ ] Signup flow: Step 1 (personal info) works
- [ ] Signup flow: Step 2 (OTP sent) works
- [ ] Signup flow: Step 3 (OTP verification) works
- [ ] Signup flow: Step 4 (additional info) works
- [ ] Thank you page shows after submission
- [ ] Error messages display correctly

### Infrastructure
- [ ] Beta Static Web App has correct app_settings
- [ ] Production Static Web App has correct app_settings
- [ ] Cosmos DB has `donors` container
- [ ] Cosmos DB has `otps` container with TTL enabled
- [ ] Communication Service connection works
- [ ] Custom domains are configured

---

## 📊 Cost Comparison

| Component | Old Architecture | New Architecture |
|-----------|-----------------|------------------|
| Frontend | SWA Free | SWA Free |
| Backend | App Service B1 (€12/mo) | Azure Functions Free |
| Database | Cosmos DB Serverless | Cosmos DB Serverless |
| Email | ACS Pay-as-go | ACS Pay-as-go |
| **Total** | **~€13/month** | **~€0.50/month** |
| **Savings** | - | **96% reduction** |

---

## 🔄 Rollback Plan

If something goes wrong:

1. **Keep backend-legacy folder**: Don't delete until fully tested
2. **Terraform state**: Keep backup of tfstate before `terraform apply`
3. **Rollback steps**:
   ```sh
   # Restore backend folder
   mv backend-legacy backend
   
   # Revert Terraform changes
   cd infrastructure
   git checkout main.tf
   terraform apply
   
   # Revert workflow
   cd ../.github/workflows
   git checkout deploy.yml
   ```

---

## 📝 Known Differences

| Feature | Express Backend | Azure Functions |
|---------|----------------|-----------------|
| OTP Storage | In-memory (volatile) | Cosmos DB (persistent) |
| Cold Start | N/A (always on) | ~1-2s first request |
| Logs | Console + stdout | Application Insights |
| CORS | Manual config | Not needed (same origin) |
| Port | 3001 | N/A (SWA proxy) |
| Environment | Node process | Serverless runtime |

---

## 🆘 Troubleshooting

### Issue: API endpoints return 404
**Fix**: Ensure `api_location: "api"` is set in GitHub workflow

### Issue: Functions build fails
**Fix**: Check `package.json` has all dependencies, run `npm install` locally

### Issue: Environment variables not available
**Fix**: Verify app_settings in Terraform for Static Web Apps

### Issue: OTPs not persisting
**Fix**: 
1. Check Cosmos DB connection string
2. Verify `otps` container exists
3. Check container has TTL enabled

### Issue: Emails not sending
**Fix**:
1. In dev mode, emails are logged (expected)
2. In prod, check ACS_CONNECTION_STRING is correct
3. Verify sender address is configured in ACS

---

## 📅 Timeline

- **Day 1**: Local testing (Phase 1)
- **Day 2**: Infrastructure deployment (Phase 2)
- **Day 3**: Beta deployment and testing (Phase 3)
- **Day 4**: Production approval and final testing (Phase 3)
- **Day 5**: Monitoring and cleanup (Phase 4)

---

## ✨ Success Criteria

- ✅ All API endpoints return expected responses
- ✅ Full donor signup flow works end-to-end
- ✅ OTPs expire automatically after 5 minutes
- ✅ Emails are sent successfully
- ✅ Monthly cost is under €2
- ✅ No backend App Service resources exist
- ✅ Beta and production environments are functional
