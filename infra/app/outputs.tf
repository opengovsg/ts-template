output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "caller_arn" {
  value = data.aws_caller_identity.current.arn
}

output "caller_user" {
  value = data.aws_caller_identity.current.user_id
}

output "aws_availability_zones" {
  value = data.aws_availability_zones.available
}

output "vpc" {
  value = module.vpc
}

output "database" {
  value     = module.database
  sensitive = true
}

output "app" {
  value = {
    AWS_ACCOUNT_ID = data.aws_caller_identity.current.account_id
    ALB_DNS_NAME   = aws_alb.app.dns_name
    APP_NAME       = var.project_name
    ENV            = var.env
    ECR_URL        = aws_ecr_repository.app.repository_url
    IMAGE_TAG      = "${aws_ecr_repository.app.repository_url}:latest"
    DB_HOST        = module.database.cluster_endpoint
    OTP_EMAIL      = var.otp_email
  }
}
