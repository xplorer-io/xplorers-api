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
