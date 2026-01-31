# Frontend URLs (API is now integrated at /api/*)
output "frontend_prod_url" {
  value = "https://${azurerm_static_web_app.frontend_prod.default_host_name}"
  description = "The default URL of the production frontend (API available at /api/*)"
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

