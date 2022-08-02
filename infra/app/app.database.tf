resource "aws_db_parameter_group" "app" {
  name        = "${local.name}-aurora-db-postgres13-parameter-group"
  family      = "aurora-postgresql13"
  description = "${local.name}-aurora-db-postgres13-parameter-group"
  tags        = local.tags
}

resource "aws_rds_cluster_parameter_group" "app" {
  name        = "${local.name}-aurora-postgres13-cluster-parameter-group"
  family      = "aurora-postgresql13"
  description = "${local.name}-aurora-postgres13-cluster-parameter-group"
  tags        = local.tags
}

module "database" {
  source = "terraform-aws-modules/rds-aurora/aws"

  name              = "${local.name}-db"
  engine            = "aurora-postgresql"
  engine_mode       = "provisioned"
  engine_version    = "13.6"
  storage_encrypted = true

  vpc_id                 = module.vpc.vpc_id
  create_db_subnet_group = false
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  subnets                = module.vpc.database_subnets
  create_security_group  = true
  allowed_cidr_blocks    = module.vpc.private_subnets_cidr_blocks

  monitoring_interval = 60

  apply_immediately   = true
  skip_final_snapshot = true

  db_parameter_group_name         = aws_db_parameter_group.app.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.app.id

  master_username = "postgres"

  serverlessv2_scaling_configuration = {
    min_capacity = 2
    max_capacity = 10
  }

  instance_class = "db.serverless"
  instances      = {
    one = {}
    two = {}
  }

  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = local.tags
}
