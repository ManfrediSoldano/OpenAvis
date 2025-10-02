terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "plan" {
  name                = "${var.app_name_prefix}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1" # Basic tier, you can change to F1 for Free tier
}

# App Service for the Node.js Backend
resource "azurerm_linux_web_app" "backend_app" {
  name                = "${var.app_name_prefix}-backend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false # Set to true for Basic tier and above if needed
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1" # Recommended for Node.js apps
  }
}

# Note: The React frontend should be deployed as a Static Web App for best performance and cost.
# The resource below is a placeholder. A real deployment would involve a CI/CD pipeline
# (like GitHub Actions) to build the React app and deploy it to the Static Web App.

resource "azurerm_static_site" "frontend_app" {
  name                = "${var.app_name_prefix}-frontend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}
