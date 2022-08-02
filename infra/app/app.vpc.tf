// https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest
resource "aws_eip" "nat" {
  count = 1 // 3 if production

  vpc = true

  tags = merge(local.tags, {
    Name = local.name
  })
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = local.name
  cidr = "10.0.0.0/16"

  create_database_subnet_group = true

  azs              = data.aws_availability_zones.available.names
  database_subnets = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  private_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets   = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway  = true
  single_nat_gateway  = true // false for production
  reuse_nat_ips       = true // Skip creation of EIPs for the NAT Gateways
  external_nat_ip_ids = aws_eip.nat.*.id

  enable_vpn_gateway = true

  nat_gateway_tags = local.tags
  igw_tags         = local.tags
  tags             = local.tags
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id       = module.vpc.vpc_id
  service_name = "com.amazonaws.${var.aws_region}.s3"
}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id       = module.vpc.vpc_id
  service_name = "com.amazonaws.${var.aws_region}.dynamodb"
}
