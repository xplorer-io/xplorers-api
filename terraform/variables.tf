variable "project_id" {
  type = string
}

variable "project_number" {
  type = string
}

variable "region" {
  type = string
}

variable "artifacts_bucket_name" {
  type        = string
  description = "Bucket storing xplorers api artifacts"
}

variable "docker_image_tag" {
  description = "Docker image tag for Xplorers Backend Service"
}
variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}
variable "cloudflare_account" {
  type      = string
  sensitive = true
}
variable "xplorers_domain" {
  default = "xplorers.tech"
}
variable "cloudlfare_zone_id" {
	type = string
	sensitive = true
}
