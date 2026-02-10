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

# --- Azure Cosmos DB (Serverless) - BETA (Existing) ---
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

# OTPs Container with TTL for automatic cleanup
resource "azurerm_cosmosdb_sql_container" "otps" {
  name                = "otps"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.main_db.name
  partition_key_paths = ["/email"]
  default_ttl         = -1  # Enable TTL, documents specify their own TTL value
}

resource "azurerm_cosmosdb_sql_container" "news" {
  name                = "news"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.main_db.name
  partition_key_paths = ["/id"]
}

# --- Azure Cosmos DB (Serverless) - PROD (New) ---
resource "azurerm_cosmosdb_account" "db_prod" {
  name                = "${var.cosmos_db_name}-prod"
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

resource "azurerm_cosmosdb_sql_database" "main_db_prod" {
  name                = "openavis-db"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db_prod.name
}

resource "azurerm_cosmosdb_sql_container" "donors_prod" {
  name                = "donors"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db_prod.name
  database_name       = azurerm_cosmosdb_sql_database.main_db_prod.name
  partition_key_paths = ["/email"]
}

resource "azurerm_cosmosdb_sql_container" "otps_prod" {
  name                = "otps"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db_prod.name
  database_name       = azurerm_cosmosdb_sql_database.main_db_prod.name
  partition_key_paths = ["/email"]
  default_ttl         = -1
}

resource "azurerm_cosmosdb_sql_container" "news_prod" {
  name                = "news"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.db_prod.name
  database_name       = azurerm_cosmosdb_sql_database.main_db_prod.name
  partition_key_paths = ["/id"]
}

# --- Azure Storage Account (Blob Storage - S3 equivalent) ---
resource "azurerm_storage_account" "storage" {
  name                     = "openavismeratestorage" # Must be globally unique, lowercase, no hyphens
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  # Required to allow public access to containers
  allow_nested_items_to_be_public = true

  tags = {
    environment = "production"
  }
}

resource "azurerm_storage_container" "assets" {
  name                  = "public-assets"
  storage_account_id    = azurerm_storage_account.storage.id
  container_access_type = "blob" # Allows public read access to blobs (files)
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

# --- Frontend Infrastructure (Static Web Apps with Integrated Functions) ---

# Frontend - Production
resource "azurerm_static_web_app" "frontend_prod" {
  name                = "${var.app_name_prefix}-frontend-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    "COSMOS_DB_ENDPOINT"    = azurerm_cosmosdb_account.db_prod.endpoint
    "COSMOS_DB_KEY"         = azurerm_cosmosdb_account.db_prod.primary_key
    "COSMOS_DB_DATABASE"    = azurerm_cosmosdb_sql_database.main_db_prod.name
    "ACS_CONNECTION_STRING" = azurerm_communication_service.acs.primary_connection_string
    "EMAIL_SENDER_ADDRESS"  = var.email_sender_address
    "NODE_ENV"              = "production"
  }
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
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    "COSMOS_DB_ENDPOINT"    = azurerm_cosmosdb_account.db.endpoint
    "COSMOS_DB_KEY"         = azurerm_cosmosdb_account.db.primary_key
    "COSMOS_DB_DATABASE"    = azurerm_cosmosdb_sql_database.main_db.name
    "ACS_CONNECTION_STRING" = azurerm_communication_service.acs.primary_connection_string
    "EMAIL_SENDER_ADDRESS"  = var.email_sender_address
    "NODE_ENV"              = "beta"
  }
}

# Custom Domain for Beta
# User must add CNAME record for 'beta.avismerate.it'
resource "azurerm_static_web_app_custom_domain" "beta_domain" {
  static_web_app_id = azurerm_static_web_app.frontend_beta.id
  domain_name       = "beta.${var.domain_name}"
  validation_type   = "dns-txt-token"
}
