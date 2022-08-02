resource "aws_ses_email_identity" "app-otp" {
  email = var.otp_email
}
