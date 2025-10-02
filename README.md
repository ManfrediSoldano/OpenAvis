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

This project uses Terraform to create the necessary infrastructure on Azure. The code is deployed separately.

### Manual Steps Before Deployment

1.  **Log in to Azure**: Open your terminal and log in to your Azure account.
    ```sh
    az login
    ```

2.  **Configure Custom Domain**: The Terraform script does not handle DNS configuration. You must manually configure your custom domain (e.g., `avismerate.it`) in your domain registrar's portal (e.g., GoDaddy) to point to the Azure resources *after* they are created. You will typically do this in the Azure Portal on the created App Service or Static Web App.

### Deploying the Infrastructure

1.  Navigate to the infrastructure directory:
    ```sh
    cd infrastructure
    ```

2.  Initialize Terraform. This will download the necessary providers.
    ```sh
    terraform init
    ```

3.  (Optional) Preview the changes that Terraform will make.
    ```sh
    terraform plan
    ```

4.  Apply the changes to create the resources on Azure.
    ```sh
    terraform apply
    ```

Terraform will provision a Resource Group, an App Service Plan, an App Service for the backend, and a Static Web App for the frontend.

### Deploying the Code (Post-Infrastructure)

After the infrastructure is created, you need to deploy your code. The recommended approach is to set up a CI/CD pipeline (e.g., using GitHub Actions).

-   **Backend**: Configure the pipeline to build your Node.js app, create a deployment package (a zip file), and deploy it to the `azurerm_linux_web_app` instance.
-   **Frontend**: Configure the pipeline to build your React app (`npm run build`) and deploy the static files from the `build` directory to the `azurerm_static_site` instance.

These deployment steps are typically configured within the Azure Portal or through YAML files for your CI/CD provider.


---
External framework used:
- https://primereact.org/steps/