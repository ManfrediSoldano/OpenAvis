# OpenAvis Project

This project is a customizable, open-source web application for local AVIS (Italian Blood Donors Association) branches. It is designed to be easily configured and deployed by any local branch with minimal technical knowledge.

## 🏗️ Architecture

OpenAvis uses a **serverless architecture** on Azure for cost efficiency and scalability:

- **Frontend**: React app hosted on Azure Static Web Apps
- **Backend**: Azure Functions (Node.js) integrated with the Static Web App
- **Database**: Azure Cosmos DB (Serverless)
- **Email**: Azure Communication Services
- **Monthly Cost**: ~€0 on Free tier (Cosmos DB serverless charges only for actual usage)

## 📂 Project Structure

The repository is organized into four main directories:

- `/api`: Azure Functions API (serverless backend)
- `/frontend`: React frontend application
- `/infrastructure`: Terraform scripts for Azure deployment
- `/backend-legacy`: Previous Express.js backend (reference only, not deployed)

---

## ⚙️ Configuration

This project is designed to be deployed for any AVIS branch without changing any code. All customizations are handled by a single configuration file.

**File**: `api/config.json`

To customize the website for your local branch, simply edit the values in this file:

```json
{
  "associationName": "AVIS Merate",
  "location": "Merate, LC, Italy",
  "contactEmail": "contact@avismerate.it",
  "domain": "avismerate.it"
}
```

- `associationName`: The name of your local AVIS branch (e.g., "AVIS Milano").
- `location`: The city or area your branch operates in.
- `contactEmail`: The official contact email address.
- `domain`: The custom domain you own for the website.

---

## 💻 Local Development

Follow these steps to run the application locally for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (includes npm)
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) v4.x
- [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) (optional but recommended)
- [Terraform](https://www.terraform.io/downloads.html) (for infrastructure deployment)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for infrastructure deployment)

### Setup Environment Variables

The API functions need Azure credentials to connect to Cosmos DB and Communication Services. For local development:

1. Navigate to the `api/` folder
2. Copy `local.settings.json.example` to `local.settings.json`:
   ```sh
   cd api
   cp local.settings.json.example local.settings.json
   ```
3. Edit `local.settings.json` and fill in your Azure credentials:
   - `COSMOS_DB_ENDPOINT`: Your Cosmos DB endpoint URL
   - `COSMOS_DB_KEY`: Your Cosmos DB primary key
   - `COSMOS_DB_DATABASE`: Database name (default: `openavis-db`)
   - `ACS_CONNECTION_STRING`: Azure Communication Services connection string
   - `EMAIL_SENDER_ADDRESS`: Sender email address

> ⚠️ **Note**: `local.settings.json` is gitignored to prevent credential leaks. In local dev mode, emails are logged to console instead of sent.

### Option 1: Run with Azure Static Web Apps CLI (Recommended)

This simulates the production environment where the frontend and API run together:

```sh
# Install SWA CLI globally (one-time)
npm install -g @azure/static-web-apps-cli

# Build the frontend
cd frontend
npm install
npm run build
cd ..

# Install API dependencies
cd api
npm install
cd ..

# Start the emulator (runs frontend + API together)
swa start frontend/build --api-location api
```

The app will be available at `http://localhost:4280`

- Frontend: Served from `frontend/build`
- API: Available at `http://localhost:4280/api/*`

### Option 2: Run Frontend and API Separately

#### 1. Run the API (Azure Functions)

```sh
cd api
npm install
npm start
```

The API will start on `http://localhost:7071` with endpoints at:
- `GET  /api/config`
- `POST /api/send-otp`
- `POST /api/verify-otp`
- `POST /api/signup`

#### 2. Run the Frontend

Open a second terminal:

```sh
cd frontend
npm install
npm start
```

The frontend will open at `http://localhost:3000`.

> **Note**: You may need to update `frontend/src/api/client.ts` to point to `http://localhost:7071` for local API testing.

---

## 🚀 Deployment to Azure

### 1. Prerequisites & Credentials (Manual Step)

Since you are setting this up for the first time, you need to generate Azure credentials for GitHub Actions to use.

1. **Login to Azure CLI**:
   ```sh
   az login
   ```
2. **Create Service Principal**:
   Run the following command to create a Service Principal with "Contributor" access.
   Replace `<SUBSCRIPTION_ID>` with your actual Subscription ID (you can see it in the output of `az login`).
   ```sh
   az ad sp create-for-rbac --name "OpenAvisDeploy" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID> --sdk-auth
   ```
3. **Save the Output**:
   The command will output a JSON object. **Copy this entire JSON**. You will need the individual fields for GitHub secrets.

### 2. Infrastructure (Terraform)

The infrastructure is defined in the `/infrastructure` folder. It sets up:
- **Resource Group**: Container for all resources.
- **Cosmos DB (Serverless)**: Database for donor data and OTPs with TTL.
  - Container `donors`: Stores donor signup data
  - Container `otps`: Stores OTPs with 5-minute auto-expiration
- **Communication Service**: For sending emails.
- **Static Web Apps (Free tier)**: Hosting for React Frontend + Azure Functions API.
  - Beta environment: `openavis-merate-frontend-beta`
  - Production environment: `openavis-merate-frontend-prod`

#### Key Changes from Legacy Architecture

**Removed** (cost savings):
- ❌ App Service Plan (B1): Was €12/month
- ❌ Linux Web Apps for backend

**Added**:
- ✅ Cosmos DB `otps` container with TTL support
- ✅ App settings for Static Web Apps to pass credentials to API functions

#### Deploy the Infrastructure

```sh
cd infrastructure

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply (creates all resources)
terraform apply
```

Terraform will output important URLs after deployment:
- Static Web App URLs (beta and production)
- Cosmos DB endpoint
- Communication Service connection string

### 3. DNS Configuration (Manual Step - GoDaddy)

Terraform sets up the resources, but for connecting custom domains like `avismerate.it` and `beta.avismerate.it`, you need to perform manual steps in the GoDaddy DNS panel.

#### Beta Environment: `beta.avismerate.it`
1. **Azure Portal**: Navigate to the Static Web App named `openavis-merate-frontend-beta`.
2. **Custom Domains**: Click **"Add"**, enter `beta.avismerate.it`, and select "DNS TXT token" for validation.
3. **Validation Token**: Azure will provide a host name (e.g., `_dnsauth.beta`) and a value.
4. **GoDaddy**: In your DNS Management:
   - Add a **TXT** record with the **Host** and **Value** provided by Azure.
   - Add a **CNAME** record with Host `beta` pointing to your Azure SWA default hostname (e.g., `gentle-wave-....azurestaticapps.net`).
5. **Activation**: Once the records propagate, click "Validate" in Azure. SSL will be automatically provisioned.

#### Production Environment: `avismerate.it`
1. **Azure Portal**: Navigate to the Static Web App named `openavis-merate-frontend-prod`.
2. **Custom Domains**: Add both `avismerate.it` and `www.avismerate.it`.
3. **Validation**: Follow the same TXT token process for both.
4. **GoDaddy**: 
   - Add **TXT** records for validation as requested.
   - Add a **CNAME** record for `www` pointing to the Production SWA hostname.
   - For the root domain (`@`), follow the instructions in the Azure Portal for "Root domain hosting".

---

### 4. Email Configuration (Manual Step - Azure Portal)

Terraform creates the Communication Service resources, but you must manually configure the domain and sender identity in the Azure Portal to enable email sending.

1. **Add and Verify Domain (Email Communication Service)**
   - Go to the **Email Communication Service** resource (e.g., `openavis-comm-service-email`).
   - Click **Provision domains** -> **Add domain**.
   - Enter `avismerate.it` (or your custom domain) and choose **Verify**.
   - Add the provided **TXT** record to your GoDaddy (or other provider) DNS.
   - Wait for verification to complete (Status: Verified).

2. **Connect Domain (Communication Service)**
   - Go to the **Communication Service** resource (e.g., `openavis-comm-service`).
   - Click **Domains** -> **Connect domain**.
   - Select the **Email Communication Service** and the verified domain.
   - Click **Connect**.

3. **Update Sender Address**
   - Ensure the `EMAIL_SENDER_ADDRESS` variable in your `local.settings.json` and in the Azure Static Web App **Environment variables** matches the configured domain (e.g., `DoNotReply@avismerate.it`).

---

### 5. CI/CD: Pipeline & Authorization (GitHub Actions)

We use a **Sequential Environment Pipeline** (Beta → Production). To make this work, you must authorize GitHub to act on your Azure account and configure the manual gate.

#### Step 1: Configure Secrets in GitHub
1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **"New repository secret"** and add the following (from the Service Principal JSON created earlier):
   - `AZURE_CLIENT_ID`: The `clientId` from the JSON.
   - `AZURE_TENANT_ID`: The `tenantId` from the JSON.
   - `AZURE_SUBSCRIPTION_ID`: Your Azure Subscription ID.

> **Note**: The new workflow uses OIDC (OpenID Connect) authentication, so you don't need `AZURE_CLIENT_SECRET` or `AZURE_CREDENTIALS`.

#### Step 2: Setup Environments & Manual Approval (The "Gate")
To prevent automatic deployment to production, we use GitHub Environments:
1. Go to **Settings** -> **Environments**.
2. Click **"New environment"** and name it `beta`. (No protection needed here).
3. Click **"New environment"** again and name it `production`.
4. Inside the **`production`** environment settings:
   - Check **"Required reviewers"**.
   - Search and add your GitHub username.
   - Click **"Save protection rules"**.

#### Step 3: How the Pipeline Runs
1. **Push to `main`**: GitHub starts the "Deploy to Beta" job automatically.
2. **Beta Online**: Within minutes, the changes are live at `https://beta.avismerate.it`.
   - The deploy includes **both** the frontend (from `frontend/build`) and the API (from `api/`).
3. **The Pause**: The workflow will show a status of **"Waiting"**. You will receive an email and a notification on GitHub.
4. **Review & Approve**:
   - Go to the **Actions** tab.
   - Click on the running workflow.
   - Click **"Review deployments"**, select `production`, and click **"Approve"**.
5. **Production Live**: Only then, the code is moved to `https://avismerate.it`.

---

## 🔄 Migration from Legacy Backend

If you previously had the Express.js backend deployed:

1. **Remove old App Service resources** via Terraform:
   ```sh
   cd infrastructure
   terraform apply  # This will destroy the App Service Plan and Web Apps
   ```
2. **Update DNS** (if needed): The API is now served from the same domain under `/api/*` instead of a separate backend URL.
3. **No frontend changes required**: The frontend API client is already configured to use relative paths.

---

## 📊 Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Static Web Apps | Free | €0 |
| Azure Functions (Integrated) | Free tier (1M requests/month) | €0 |
| Cosmos DB | Serverless | ~€0.25-1 (only for actual usage) |
| Communication Services | Pay-as-you-go | ~€0.10 per 1000 emails |
| **Total** | | **~€0.50-2/month** vs. **€12+/month** with App Service |

---

## 🛠️ Development Notes

### API Endpoints

All endpoints are available at `/api/*`:

1. **GET /api/config**: Returns association configuration (from `config.json`)
2. **POST /api/send-otp**: Generates and sends OTP to email (stored in Cosmos DB with 5-min TTL)
3. **POST /api/verify-otp**: Verifies OTP and consumes it
4. **POST /api/signup**: Saves donor data and sends confirmation email

### OTP Management

OTPs are now **persisted in Cosmos DB** instead of in-memory storage:
- **Container**: `otps`
- **TTL**: 300 seconds (5 minutes) - automatic cleanup
- **Partition Key**: `/email`
- **Benefits**: Works with serverless functions, survives restarts, automatic expiration

---

## 📚 External Frameworks

- Frontend UI: [PrimeReact](https://primereact.org/)
- Icons: [PrimeIcons](https://primereact.org/icons/)

---

## 📝 License

This project is open-source and available for any AVIS branch to use and customize.