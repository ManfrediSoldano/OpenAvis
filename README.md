# OpenAvis Project

This project is a customizable, open-source web application for local AVIS (Italian Blood Donors Association) branches. It is designed to be easily configured and deployed by any local branch with minimal technical knowledge.

## Project Structure

The repository is organized into three main directories:

- `/backend`: Contains the Node.js and Express backend server.
- `/frontend`: Contains the React frontend application.
- `/infrastructure`: Contains the Terraform scripts for deploying the application to Microsoft Azure.

---

## ⚙️ Configuration

This project is designed to be deployed for any AVIS branch without changing any code. All customizations are handled by a single configuration file.

**File**: `backend/config.json`

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

Follow these steps to run the application on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- [Terraform](https://www.terraform.io/downloads.html)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

### 1. Run the Backend

Open a terminal and navigate to the backend directory:

```sh
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

The backend server will start on `http://localhost:3001`.

### 2. Run the Frontend

Open a second terminal and navigate to the frontend directory:

```sh
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will open automatically in your browser at `http://localhost:3000`.

---

## 🚀 Deployment to Azure

### 1. Prerequisites & Credentials (Manual Step)

Since you are setting this up for the first time, you need to generate Azure credentials for GitHub Actions to use.

1.  **Login to Azure CLI**:
    ```sh
    az login
    ```
2.  **Create Service Principal**:
    Run the following command to create a Service Principal with "Contributor" access.
    Replace `<SUBSCRIPTION_ID>` with your actual Subscription ID (you can see it in the output of `az login`).
    ```sh
    az ad sp create-for-rbac --name "OpenAvisDeploy" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID> --sdk-auth
    ```
3.  **Save the Output**:
    The command will output a JSON object. **Copy this entire JSON**. You will need it for the GitHub Repository Secret named `AZURE_CREDENTIALS`.

### 2. Infrastructure (Terraform)

The infrastructure is defined in the `/infrastructure` folder. It sets up:
-   **Resource Group**: Container for all resources.
-   **Cosmos DB**: Serverless database for donor data.
-   **Communication Service**: For sending emails.
-   **App Service Plan (Linux)**: Hosting plan.
-   **App Service**: Hosting for the Node.js Backend.
-   **Static Web App**: Hosting for the React Frontend.

To deploy manually (or test):
```sh
cd infrastructure
terraform init
terraform apply
```

### 3. DNS Configuration (Manual Step - GoDaddy)

Terraform sets up the resources, but for connecting custom domains like `avismerate.it` and `beta.avismerate.it`, you need to perform manual steps in the GoDaddy DNS panel.

#### Beta Environment: `beta.avismerate.it`
1.  **Azure Portal**: Navigate to the Static Web App named `openavis-merate-frontend-beta`.
2.  **Custom Domains**: Click **"Add"**, enter `beta.avismerate.it`, and select "DNS TXT token" for validation.
3.  **Validation Token**: Azure will provide a host name (e.g., `_dnsauth.beta`) and a value.
4.  **GoDaddy**: In your DNS Management:
    -   Add a **TXT** record with the **Host** and **Value** provided by Azure.
    -   Add a **CNAME** record with Host `beta` pointing to your Azure SWA default hostname (e.g., `gentle-wave-....azurestaticapps.net`).
5.  **Activation**: Once the records propagate, click "Validate" in Azure. SSL will be automatically provisioned.

#### Production Environment: `avismerate.it`
1.  **Azure Portal**: Navigate to the Static Web App named `openavis-merate-frontend-prod`.
2.  **Custom Domains**: Add both `avismerate.it` and `www.avismerate.it`.
3.  **Validation**: Follow the same TXT token process for both.
4.  **GoDaddy**: 
    -   Add **TXT** records for validation as requested.
    -   Add a **CNAME** record for `www` pointing to the Production SWA hostname.
    -   For the root domain (`@`), follow the instructions in the Azure Portal for "Root domain hosting".

---

### 4. CI/CD: Pipeline & Authorization (GitHub Actions)

We use a **Sequential Environment Pipeline** (Beta → Production). To make this work, you must authorize GitHub to act on your Azure account and configure the manual gate.

#### Step 1: Authorize GitHub on Azure Portal
GitHub needs permission to update your Web Apps.
1.  **Open your terminal** and ensure you are logged in: `az login`.
2.  **Create a Service Principal**: This is like a "virtual user" for GitHub. Run:
    ```sh
    az ad sp create-for-rbac --name "OpenAvisGitHubDeploy" --role contributor --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID> --sdk-auth
    ```
    *(Replace `<YOUR_SUBSCRIPTION_ID>` with yours).*
3.  **Copy the JSON output**: It contains the `clientId`, `clientSecret`, `tenantId`, etc. You will need this for GitHub.

#### Step 2: Configure Secrets in GitHub
1.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Click **"New repository secret"** and add the following:
    -   `AZURE_CREDENTIALS`: Paste the **entire JSON** object from Step 1.
    -   `AZURE_CLIENT_ID`: The `clientId` from the JSON.
    -   `AZURE_CLIENT_SECRET`: The `clientSecret` from the JSON.
    -   `AZURE_TENANT_ID`: The `tenantId` from the JSON.
    -   `AZURE_SUBSCRIPTION_ID`: Your Azure Subscription ID.

#### Step 3: Setup Environments & Manual Approval (The "Gate")
To prevent automatic deployment to production, we use GitHub Environments:
1.  Go to **Settings** -> **Environments**.
2.  Click **"New environment"** and name it `beta`. (No protection needed here).
3.  Click **"New environment"** again and name it `production`.
4.  Inside the **`production`** environment settings:
    -   Check **"Required reviewers"**.
    -   Search and add your GitHub username.
    -   Click **"Save protection rules"**.

#### Step 4: How the Pipeline Runs
1.  **Push to `main`**: GitHub starts the "Deploy to Beta" job automatically.
2.  **Beta Online**: Within minutes, the changes are live at `https://beta.avismerate.it`.
3.  **The Pause**: The workflow will show a status of **"Waiting"**. You will receive an email and a notification on GitHub.
4.  **Review & Approve**:
    -   Go to the **Actions** tab.
    -   Click on the running workflow.
    -   Click **"Review deployments"**, select `production`, and click **"Approve"**.
5.  **Production Live**: Only then, the code is moved to `https://avismerate.it`.


---
External framework used:
- https://primereact.org/steps/