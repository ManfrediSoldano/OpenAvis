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
