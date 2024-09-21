terraform {
  required_providers {
    google = {
      version = ">= 5.40.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.42.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
