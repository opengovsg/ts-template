# Deploying the OGP Application Template

This step-by-step guide will walk the reader through the steps needed to have 
this application running on an environment hosted by Amazon Web Services, with
supporting services also set up

## Registrations

Front load all the service registrations so that you can focus on configuration

- [ ] Create a Google Groups e-mail for your application
- [ ] Register for a .gov.sg domain and the .sg equivalent
- [ ] Sign up for Cloudflare
- [ ] Sign up for Sentry.io, or create a new Sentry organisation
- [ ] Sign up for an Amazon Web Services account; have credit card details ready

## Domains and CDN

- [ ] Create a Cloudflare site for the .sg and .gov.sg domains
- [ ] Instruct the domain registrar (GovTech for .gov.sg, your commercial 
      registrar otherwise) to set the primary nameservers to the ones Cloudflare
      lists for your site
- [ ] (if you are not using .sg for testing your deployed application) Set up a 
      Page Rule that would redirect all requests from .sg to .gov.sg

## Amazon Web Services

Set up the application for deployments to Amazon Web Services (AWS)

_TODO: Build a Terraform config that would do all this_

### Virtual Private Cloud (VPC) and Networking

Create an environment (staging for now, production later) that consists of one 
VPC, segmented into three subnets, gated by NAT Gateways and Security Groups


- [ ] Navigate to the VPC section in AWS Console
- [ ] Create a VPC named `<app-name>-<environment>`, eg `checkfirst-staging`

#### Subnets

Create subnets in each availability zone in ap-southeast-1; for every zone, set
up one public subnet, one subnet that hosts application servers and one subnet
for the data store or RDS instance.

Use lower IP address ranges to denote more inward layers within an environment,
and higher IP address ranges to denote more outward (public-facing) layers. Eg,
use IP address ranges `172.31.{0-2}.x` for databases, `172.31.{8-10}.x` for EC2
instances, `172.31.{16-18}.x` for load balancers facing the Internet.

Take care to have a wide-enough IP range between layers to keep things organised

- [ ] Create `<app-name>-<environment>-rds-1a` in ap-southeast-1a 
- [ ] Create `<app-name>-<environment>-rds-1b` in ap-southeast-1b
- [ ] Create `<app-name>-<environment>-rds-1c` in ap-southeast-1c

- [ ] Create `<app-name>-<environment>-ec2-1a` in ap-southeast-1a 
- [ ] Create `<app-name>-<environment>-ec2-1b` in ap-southeast-1b
- [ ] Create `<app-name>-<environment>-ec2-1c` in ap-southeast-1c

- [ ] Create `<app-name>-<environment>-public-1a` in ap-southeast-1a 
- [ ] Create `<app-name>-<environment>-public-1b` in ap-southeast-1b
- [ ] Create `<app-name>-<environment>-public-1c` in ap-southeast-1c 

#### Internet Gateway

Create an Internet Gateway to allow Internet traffic to go in and out
of the VPC, so that your application can both send and receive requests

- [ ] Create an Internet Gateway attached to the VPC

#### NAT Gateways

Create one NAT Gateway for each availability zone, attaching each one to the 
corresponding public subnet

***NOTE:** NAT Gateways are expensive and are limited to 5 per account. If 
setting up for staging, consider setting up just one NAT Gateway on a chosen
availability zone.

If there are other ways for your applications to have outbound connectivity,
consider those. Alternatives include:

- Egress-only Internet Gateway - IPv6 only, limited and varying support from
  AWS products
- VPC Interface Endpoints and VPC Gateway Endpoints - supports only specific
  protocols and destinations (eg, to SES over SMTP, to S3, etc). Testing
  through trial and error.

Ensure you can get your application up and running first with NAT Gateways.
If desired, return to this section to test replacements for NAT Gateways.

- [ ] Create NAT Gateway for ap-southeast-1a
- [ ] Create NAT Gateway for ap-southeast-1b
- [ ] Create NAT Gateway for ap-southeast-1c

#### Route Tables

Define network traffic routing for subnets within the VPC

- [ ] Create a route table that routes all traffic (0.0.0.0/0, ::/0) via the
      Internet Gateway; associate this with the public subnets
- [ ] Create one route table that routes all traffic (0.0.0.0/0) via the NAT
      Gateway that sits on `<app-name>-<environment>-public-1a`; associate this
      route table with `<app-name>-<environment>-ec2-1a`
- [ ] Create one route table that routes all traffic (0.0.0.0/0) via the NAT
      Gateway that sits on `<app-name>-<environment>-public-1b`; associate this
      route table with `<app-name>-<environment>-ec2-1b`
- [ ] Create one route table that routes all traffic (0.0.0.0/0) via the NAT
      Gateway that sits on `<app-name>-<environment>-public-1c`; associate this
      route table with `<app-name>-<environment>-ec2-1c`

#### Security Groups

Create Security Groups for RDS and EC2

- [ ] Create the security group `<app-name>-<environment>-ec2`
- [ ] Create the security group `<app-name>-<environment>-rds`
  - [ ] Add an entry to allow incoming Postgres connections to be made 
        from `<app-name>-<environment>-ec2`
  - [ ] Add entries to allow incoming Postgres connections from
        the IPs of members of the team

Note that we do not create a security group for the load balancer; this is
automatically created by Elastic Beanstalk. We will come back for that security 
group once it is created, to limit incoming connections to EC2 to those from the 
load balancer, as well as to limit incoming connections to the load balancer to
those from Cloudflare IPs

### Relational Database Service (RDS)

Create an RDS instance that will sit on the designated subnets, enabling 
multi-AZ deployment, disk-level encryption and IAM authentication

- [ ] Create RDS subnet group that encompasses the following subnets:
  - `<app-name>-<environment>-rds-1a`
  - `<app-name>-<environment>-rds-1b`
  - `<app-name>-<environment>-rds-1c`

- [ ] Create RDS instance, carefully considering the following:
  - [ ] In most cases, create a Postgres instance
  - [ ] DB instance class - choose later generations of burstable classes,
        which offer reasonable price for performance
  - [ ] Storage
    - [ ] Choose either SSD or Provisioned IOPs. It is considered prudent to 
          use SSD first, and switch to Provisioned IOPs for increased 
          throughput as product userbase grows 
    - [ ] Allocate at least 100GB of storage for easier switching from SSD 
          to Provisioned IOPs
    - [ ] Enable storage autoscaling (storage is cheap after all), putting a 
          maximum threshold of ~1000GB
  - [ ] Enable Multi-AZ deployment. Note that this will double the cost of
        the instance, but will be an absolute must in ensuring uptime in
        production
  - [ ] Security Groups - choose `<application-name>-<environment>-rds`
  - [ ] Additional Configuration - Public Access
      - Enable if app data is not sensitive and you wish to have easy access
        to the database from local machine
      - Disable if app data is sensitive. You will need to provide a bastion
        host so that the database can be accessed from local machine via the
        bastion host
  - [ ] Authentication - Password and IAM
