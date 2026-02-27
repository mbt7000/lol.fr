terraform {
  required_version = ">= 1.6.0"
}

module "core" {
  source  = "../../modules/core"
  project = "alloul-one-prod"
  region  = "us-east-1"
}
