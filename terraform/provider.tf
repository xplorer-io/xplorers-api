terraform {
  required_providers {
    google = {
      version = ">= 5.40.0"
    }
    cloudflare = {
      source = "registry.terraform.io/cloudflare/cloudflare"
      version = "4.43.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}


