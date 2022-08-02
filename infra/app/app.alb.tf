resource "aws_alb" "app" {
  name               = "${local.name}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.app-alb.id]

  tags = local.tags
}

resource "aws_security_group" "app-alb" {
  name   = "${local.name}-alb"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = local.tags
}

resource "aws_lb_target_group" "app" {
  name        = "${local.name}-alb"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id

  health_check {
    healthy_threshold   = "3"
    interval            = "300"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "2"
  }

  tags = local.tags
}

resource "aws_lb_listener" "app" {
  count             = var.dns_verified ? 0 : 1
  load_balancer_arn = aws_alb.app.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.id
  }
}

resource "aws_lb_listener" "app-https" {
  count             = var.dns_verified ? 1 : 0
  load_balancer_arn = aws_alb.app.id
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.app.arn


  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.id
  }
}

resource "aws_acm_certificate" "app" {
  domain_name       = var.dns_name
  validation_method = "DNS"

  tags = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

