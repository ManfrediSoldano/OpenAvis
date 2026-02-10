# Frontend URLs (API is now integrated at /api/*)
output "static_web_app_default_host_name" {
  value = azurerm_static_web_app.frontend_prod.default_host_name
}

output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "storage_primary_connection_string" {
  value     = azurerm_storage_account.storage.primary_connection_string
  sensitive = true
}

output "assets_container_url" {
  value = "https://${azurerm_storage_account.storage.name}.blob.core.windows.net/${azurerm_storage_container.assets.name}"
}

output "frontend_beta_url" {
  value = "https://${azurerm_static_web_app.frontend_beta.default_host_name}"
  description = "The default URL of the beta frontend (API available at /api/*)"
}

# Cosmos DB
output "cosmos_db_endpoint" {
  value = azurerm_cosmosdb_account.db.endpoint
  description = "Cosmos DB endpoint"
}

# Communication Services
output "acs_connection_string" {
  value = azurerm_communication_service.acs.primary_connection_string
  description = "Azure Communication Services connection string"
  sensitive = true
}

