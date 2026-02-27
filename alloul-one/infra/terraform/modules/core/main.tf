terraform {
  required_version = ">= 1.6.0"
}

variable "project" { type = string }
variable "region" { type = string }

# Provider/resources intentionally minimal scaffold for cloud-agnostic baseline.
# Expand with specific provider (AWS/GCP/Azure) in environment stacks.

resource "null_resource" "baseline" {
  triggers = {
    project = var.project
    region  = var.region
  }
}
