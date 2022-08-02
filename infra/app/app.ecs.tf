resource "aws_ecr_repository" "app" {
  name         = "${local.name}-app"
  force_delete = true
  tags         = local.tags
}

resource "aws_iam_role" "app" {
  name               = "${local.name}-app-execution-task-role"
  assume_role_policy = data.aws_iam_policy_document.app.json
  tags               = local.tags
}

data "aws_iam_policy_document" "app" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "app" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "app-1" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "app-2" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}

resource "aws_ecs_cluster" "app" {
  name = "${local.name}-app"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = local.tags
}

resource "aws_cloudwatch_log_group" "app" {
  name = "/ecs/${local.name}-app"
  tags = local.tags
}

resource "aws_ecs_task_definition" "app" {
  family = "${local.name}-app"

  container_definitions = <<DEFINITION
  [
    {
      "name": "${local.name}-app-container",
      "image": "nginxdemos/nginx-hello:plain-text",
      "entryPoint": [],
      "environment": [],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.app.id}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080,
          "protocol": "tcp"
        }
      ],
      "cpu": 256,
      "memory": 512,
      "networkMode": "awsvpc"
    }
  ]
  DEFINITION

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"
  execution_role_arn       = aws_iam_role.app.arn
  task_role_arn            = aws_iam_role.app.arn

  tags = local.tags
}

data "aws_ecs_task_definition" "app" {
  task_definition = aws_ecs_task_definition.app.family
}

resource "aws_ecs_service" "app" {
  name                 = "${local.name}-app"
  cluster              = aws_ecs_cluster.app.id
  task_definition      = "${aws_ecs_task_definition.app.family}:${max(aws_ecs_task_definition.app.revision, data.aws_ecs_task_definition.app.revision)}"
  desired_count        = 1
  launch_type          = "FARGATE"
  scheduling_strategy  = "REPLICA"
  force_new_deployment = true

  network_configuration {
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
    security_groups  = [
      aws_security_group.app.id,
      aws_security_group.app-alb.id
    ]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${local.name}-app-container"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.app]
}

resource "aws_security_group" "app" {
  name   = "${local.name}-app"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.app-alb.id]
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

#resource "aws_appautoscaling_target" "ecs_target" {
#  max_capacity       = 2
#  min_capacity       = 1
#  resource_id        = "service/${aws_ecs_cluster.aws-ecs-cluster.name}/${aws_ecs_service.aws-ecs-service.name}"
#  scalable_dimension = "ecs:service:DesiredCount"
#  service_namespace  = "ecs"
#}
#
#resource "aws_appautoscaling_policy" "ecs_policy_memory" {
#  name               = "${var.app_name}-${var.app_environment}-memory-autoscaling"
#  policy_type        = "TargetTrackingScaling"
#  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
#  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
#  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
#
#  target_tracking_scaling_policy_configuration {
#    predefined_metric_specification {
#      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
#    }
#
#    target_value = 80
#  }
#}
#
#resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
#  name               = "${var.app_name}-${var.app_environment}-cpu-autoscaling"
#  policy_type        = "TargetTrackingScaling"
#  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
#  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
#  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
#
#  target_tracking_scaling_policy_configuration {
#    predefined_metric_specification {
#      predefined_metric_type = "ECSServiceAverageCPUUtilization"
#    }
#
#    target_value = 80
#  }
#}
