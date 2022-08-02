provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

locals {
  name = "${var.project_name}-${var.env}"
  tags = {
    Terraform   = "true"
    Environment = var.env
    Project     = var.project_name
    Name        = local.name
  }
}

resource "aws_s3_bucket" "terraform-backend" {
  bucket = "${local.name}-terraform-backend-${data.aws_caller_identity.current.account_id}"

  tags = local.tags
}

resource "aws_s3_bucket_acl" "terraform-backend" {
  bucket = aws_s3_bucket.terraform-backend.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "terraform-backend" {
  bucket = aws_s3_bucket.terraform-backend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform-backend" {
  bucket = aws_s3_bucket.terraform-backend.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

#resource "aws_s3_bucket_logging" "my_protected_bucket_logging" {
#  bucket = aws_s3_bucket.my_protected_bucket.id
#
#  target_bucket = var.access_logging_bucket_name
#  target_prefix = "${var.bucket_name}/"
#}

resource "aws_s3_bucket_public_access_block" "terraform-backend" {
  bucket = aws_s3_bucket.terraform-backend.id

  # Block public access
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform-backend" {
  name         = "${local.name}-terraform-backend"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }

  tags = local.tags
}
