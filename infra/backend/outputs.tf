output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "caller_arn" {
  value = data.aws_caller_identity.current.arn
}

output "caller_user" {
  value = data.aws_caller_identity.current.user_id
}

output "s3_bucket" {
  value = aws_s3_bucket.terraform-backend.id
}

output "dynamodb" {
  value = aws_dynamodb_table.terraform-backend.id
}
