locals {
  timestamp = formatdate("YYMMDDHHmmss", timestamp())
}

resource "google_cloud_run_service" "xplorers_backend" {
  name     = "xplorers-service-${terraform.workspace}"
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/xplorers-artifact-repo/xplorers-backend-service:${var.docker_image_tag}"
        ports {
          container_port = 3000
        }
        env {
          name = "SLACK_BOT_TOKEN"
          value_from {
            secret_key_ref {
              name = "slack-token"
              key  = "latest"
            }
          }
        }
      }
    }
  }


  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_api_gateway_api" "xplorers_api" {
  project  = var.project_id
  provider = google-beta
  api_id   = "xplorers-api-${terraform.workspace}"
}

resource "google_project_service" "xplorers_api_gateway" {
  project = var.project_id
  service = google_api_gateway_api.xplorers_api.managed_service

  depends_on = [google_api_gateway_gateway.xplorers_api_gateway]
}

data "template_file" "openapi_spec" {
  template = file("${path.module}/xplorersApiSpec.yaml.tpl")

  vars = {
    cloud_run_url        = google_cloud_run_service.xplorers_backend.status[0].url
    api_endpoint_service = google_api_gateway_api.xplorers_api.managed_service
  }
}

resource "google_api_gateway_api_config" "xplorers_api_cfg" {
  project       = var.project_id
  provider      = google-beta
  api           = google_api_gateway_api.xplorers_api.api_id
  api_config_id = "xplorers-api-config-${local.timestamp}"

  openapi_documents {
    document {
      path     = "xplorersApiv2.yaml"
      contents = base64encode(data.template_file.openapi_spec.rendered)
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "xplorers_api_gateway" {
  project    = var.project_id
  region     = var.region
  provider   = google-beta
  gateway_id = "xplorers-api-gateway-${terraform.workspace}"
  api_config = google_api_gateway_api_config.xplorers_api_cfg.id
}

output "cloud_run_url" {
  value = google_cloud_run_service.xplorers_backend.status[0].url
}

output "api_gateway_url" {
  value = google_api_gateway_gateway.xplorers_api_gateway.default_hostname
}

resource "cloudflare_record" "xplorers_record_CNAME_1" {
  name    = "www"
  proxied = false
  ttl     = 1
  type    = "CNAME"
  content   = "xplorers-website.vercel.app"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_CNAME-2" {
  name    = "xplorers.tech"
  proxied = false
  ttl     = 1
  type    = "CNAME"
  content   = "xplorers-website.vercel.app"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_MX_3" {
  content  = "route2.mx.cloudflare.net"
  name     = "xplorers.tech"
  priority = 11
  proxied  = false
  ttl      = 1
  type     = "MX"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_MX_1" {
  content  = "route1.mx.cloudflare.net"
  name     = "xplorers.tech"
  priority = 71
  proxied  = false
  ttl      = 1
  type     = "MX"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_MX_2" {
  content  = "route3.mx.cloudflare.net"
  name     = "xplorers.tech"
  priority = 37
  proxied  = false
  ttl      = 1
  type     = "MX"
  zone_id = var.xplorers_domain
}
 
resource "cloudflare_record" "xplorers_record_TXT_3" {
  content = "\"v=DMARC1; p=none; rua=mailto:b1194f0bc1d140b395920bfdcc91ce2a@dmarc-reports.cloudflare.net\""
  name    = "_dmarc"
  proxied = false
  ttl     = 1
  type    = "TXT"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_TXT_2" {
  content = "\"v=spf1 include:_spf.mx.cloudflare.net ~all\""
  name    = "xplorers.tech"
  proxied = false
  ttl     = 1
  type    = "TXT"
  zone_id = var.xplorers_domain
}

resource "cloudflare_record" "xplorers_record_TXT_1" {
  content = "\"hcp-domain-verification=bd3cf9469e22b933c6ad349a8f97ad5c08ff4174e22c4aa911f75d9e261ee6e1\""
  name    = "xplorers.tech"
  proxied = false
  ttl     = 1
  type    = "TXT"
  zone_id = var.xplorers_domain
}
