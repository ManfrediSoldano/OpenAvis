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
  subscription_id = var.subscription_id
}


resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# --- Azure Cosmos DB (Serverless) ---
resource "azurerm_cosmosdb_account" "db" {
  name                = var.cosmos_db_name
  location            = "northeurope"
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capabilities {
    name = "EnableServerless"
  }

  geo_location {
    location          = "northeurope"
    failover_priority = 0
  }

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }
}

resource "azurerm_cosmosdb_sql_database" "main_db" {
  name                = "openavis-db"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db.name
}

resource "azurerm_cosmosdb_sql_container" "donors" {
  name                = "donors"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.main_db.name
  partition_key_paths = ["/email"]
}

# --- Azure Communication Services (Email) ---
resource "azurerm_communication_service" "acs" {
  name                = var.email_service_name
  resource_group_name = azurerm_resource_group.rg.name
  data_location       = var.email_service_data_location
}

resource "azurerm_email_communication_service" "email_service" {
  name                = "${var.email_service_name}-email"
  resource_group_name = azurerm_resource_group.rg.name
  data_location       = var.email_service_data_location
}

# Note: Domain provisioning is often manual or requires DNS validation.
# We create the service resources here; User must provision domain in Portal or add specific domain resource if DNS is controlled by Azure.

# --- Backend Infrastructure (Production & Beta) ---
resource "azurerm_service_plan" "plan" {
  name                = "${var.app_name_prefix}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# Backend - Production
resource "azurerm_linux_web_app" "backend_prod" {
  name                = "${var.app_name_prefix}-backend-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = true # B1 supports Always On
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "COSMOS_DB_ENDPOINT"       = azurerm_cosmosdb_account.db.endpoint
    "COSMOS_DB_KEY"            = azurerm_cosmosdb_account.db.primary_key
    "COSMOS_DB_DATABASE"       = azurerm_cosmosdb_sql_database.main_db.name
    "ACS_CONNECTION_STRING"    = azurerm_communication_service.acs.primary_connection_string
    "ENVIRONMENT"              = "production"
    "NODE_ENV"                 = "production"
    "EMAIL_SENDER_ADDRESS"     = var.email_sender_address
  }
}

# Backend - Beta (Shares the same plan)
resource "azurerm_linux_web_app" "backend_beta" {
  name                = "${var.app_name_prefix}-backend-beta"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false # Save resources for beta
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "COSMOS_DB_ENDPOINT"       = azurerm_cosmosdb_account.db.endpoint
    "COSMOS_DB_KEY"            = azurerm_cosmosdb_account.db.primary_key
    "COSMOS_DB_DATABASE"       = azurerm_cosmosdb_sql_database.main_db.name
    "ACS_CONNECTION_STRING"    = azurerm_communication_service.acs.primary_connection_string
    "ENVIRONMENT"              = "beta"
    "NODE_ENV"                 = "beta"
    "EMAIL_SENDER_ADDRESS"     = var.email_sender_address
  }
}

# --- Frontend Infrastructure (static Web Apps) ---

# Frontend - Production
resource "azurerm_static_web_app" "frontend_prod" {
  name                = "${var.app_name_prefix}-frontend-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Custom Domain for Prod (Commented out effectively until DNS is ready, or use with CAUTION)
# User must add CNAME record for 'avismerate.it' point to the static site hostname
resource "azurerm_static_web_app_custom_domain" "prod_domain" {
  static_web_app_id = azurerm_static_web_app.frontend_prod.id
  domain_name       = var.domain_name
  validation_type   = "dns-txt-token" # Often safer for initial setup
}

# Frontend - Beta
resource "azurerm_static_web_app" "frontend_beta" {
  name                = "${var.app_name_prefix}-frontend-beta"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Custom Domain for Beta
# User must add CNAME record for 'beta.avismerate.it'
resource "azurerm_static_web_app_custom_domain" "beta_domain" {
  static_web_app_id = azurerm_static_web_app.frontend_beta.id
  domain_name       = "beta.${var.domain_name}"
  validation_type   = "dns-txt-token"
}
