variable "resource_group_name" {
  description = "The name of the resource group."
  type        = string
  default     = "OpenAvis-RG"
}

variable "location" {
  description = "The Azure region where resources will be deployed."
  type        = string
  default     = "West Europe"
}

variable "app_name_prefix" {
  description = "A prefix for all created resources to ensure unique names."
  type        = string
  default     = "openavis-merate"
}

variable "cosmos_db_name" {
  description = "Name of the Cosmos DB account (must be globally unique)"
  type        = string
  default     = "openavis-cosmos-db-merate"
}

variable "email_service_name" {
  description = "Name of the Azure Communication Service"
  type        = string
  default     = "openavis-comm-service"
}

variable "email_service_data_location" {
  description = "Data location for the Communication Service"
  type        = string
  default     = "Europe"
}

variable "domain_name" {
  description = "The root custom domain name"
  type        = string
  default     = "avismerate.it"
}

variable "email_sender_address" {
  description = "The email address to send from (e.g., DoNotReply@<guid>.azurecomm.net). Update this after creating the Managed Domain."
  type        = string
  default     = "DoNotReply@avismerate.it"
}

variable "subscription_id" {
  description = "The Azure subscription ID."
  type        = string
  default     = ""
}

