terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.3"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "azs" {}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "rangeiq-vpc"
  cidr = var.vpc_cidr

  azs             = data.aws_availability_zones.azs.names
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true

  map_public_ip_on_launch = true
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.2"

  cluster_name    = var.cluster_name
  cluster_version = var.k8s_version

  subnet_ids = module.vpc.public_subnets
  vpc_id     = module.vpc.vpc_id

  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    api_nodes = {
      desired_size      = 2
      max_size          = 2
      min_size          = 1
      instance_types    = ["t3.medium"] # UPDATE THIS from t2.micro
      subnet_ids        = module.vpc.public_subnets
      security_group_id = aws_security_group.api_service.id

      labels = {
        service = "api"
      }
    }

    db_nodes = {
      desired_size      = 1
      max_size          = 1
      min_size          = 1
      instance_types    = ["t2.micro"]
      subnet_ids        = module.vpc.private_subnets
      security_group_id = aws_security_group.database_service.id
      labels = {
        service = "database"
      }
    }
  }
}
