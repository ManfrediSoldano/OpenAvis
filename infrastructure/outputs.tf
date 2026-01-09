output "backend_prod_url" {
  value = "https://${azurerm_linux_web_app.backend_prod.default_hostname}"
  description = "The URL of the production backend."
}

output "backend_beta_url" {
  value = "https://${azurerm_linux_web_app.backend_beta.default_hostname}"
  description = "The URL of the beta backend."
}

output "frontend_prod_url" {
  value = "https://${azurerm_static_web_app.frontend_prod.default_host_name}"
  description = "The default URL of the production frontend."
}

output "frontend_beta_url" {
  value = "https://${azurerm_static_web_app.frontend_beta.default_host_name}"
  description = "The default URL of the beta frontend."
}
