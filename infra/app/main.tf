provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name = "${var.project_name}-${var.env}"
  tags = {
    Terraform   = "true"
    Environment = var.env
    Project     = var.project_name
  }
  tags_full = {
    Terraform   = "true"
    Environment = var.env
    Project     = var.project_name
    Name        = local.name
  }
}
