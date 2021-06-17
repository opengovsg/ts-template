# Deploying the OGP Application Template

This step-by-step guide will walk the reader through the steps needed to have 
this application running on an environment hosted by Amazon Web Services, with
supporting services also set up

## Registrations

Front load all the service registrations so that you can focus on configuration

- [ ] Create two 1Password Vaults, one for staging and one for production
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
- [ ] Create a Page Rule that forwards all requests from www.name.gov.sg to
      name.gov.sg

## Amazon Web Services

Set up the application for deployments to Amazon Web Services (AWS)

_TODO: Build a Terraform config that would do all this_

- [ ] Ensure that the console is in the ap-southeast-1 region

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
group once it is created, to limit incoming connections to the load balancer to
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
        the instance, but is an absolute must for ensuring uptime and rapid
        switching between instance sizes in production
  - [ ] Security Groups - choose `<application-name>-<environment>-rds`
  - [ ] Additional Configuration - Public Access
      - Enable if app data is not sensitive and you wish to have easy access
        to the database from local machine
      - Disable if app data is sensitive. You will need to provide a bastion
        host so that the database can be accessed from local machine via the
        bastion host
  - [ ] Authentication - Password and IAM

### AWS Certificate Manager (ACM)

- [ ] Follow instructions to obtain a certificate with `name.gov.sg` as the
      Common Name, and `www.name.gov.sg` as the Subject Alt Name. Use 
      Cloudflare to create the appropriate DNS entries for verification

### S3

- [ ] Create an S3 bucket named `<application-name>-access-logs`, leaving
      everything as default

### Elastic Container Registry (ECR)

- [ ] Create a new ECR registry named `<application-name>`
- [ ] Stash the following secrets into GitHub settings:
  - [ ] `ECR_URL` - typically `<account-id>.dkr.ecr.<region>.amazonaws.com`
  - [ ] `ECR_REPO` - `<application-name>`

### Elastic Beanstalk

Create the Elastic Beanstalk environment that will manage the application servers
and the load balancers that gate access to them

- [ ] Create new web server environment
  - Application name `<application-name>-<environment>`
    - This is not a typo: the goal here is to keep separate the application 
      versions deployed to their respective environments
  - Environment name `<application-name>-<environment>`
  - Platform `Docker running on 64bit Amazon Linux 2`, latest version
  - Application code `Sample application`
  - Configure more options
- [ ] Set configuration preset to High availability
  - You may wish to experiment with Spot instances at your own peril
- [ ] Software
  - [ ] Stream logs to CloudWatch with a retention of 365 days for production
  - [ ] Configure environment variables per your application
    - Set `DB_URI` to a database connection string bearing master credentials,
      but only for now
- [ ] Instances
  - [ ] Check the `<app-name>-<environment>-ec2` EC2 Security Group
- [ ] Capacity
  - [ ] Choose an appropriate instance size. Leave autoscaling parameters as
        their defaults for now
- [ ] Load balancer
  - [ ] Use the Application Load Balancer for now
  - [ ] Disable the default HTTP listener
  - [ ] Add an HTTPS listener using the ACM certificate created earlier
  - [ ] Enable storing of logs to the `<application-name>-access-logs` S3 bucket
- [ ] Rolling updates and deployments
  - [ ] Deployment policy `Rolling with additional batch`, batch size `100%`
  - [ ] Configuration updates `Rolling based on Health`, batch size `1`
- [ ] Monitoring
  - [ ] Health reporting system `Enhanced`
- [ ] Managed updates
  - [ ] Enable managed updates, choosing an appropriate window to perform these
  - [ ] Allow instances to be replaced if no updates available
- [ ] Network
  - [ ] Select the VPC `<app-name>-<environment>`

#### Post-creation actions

- [ ] Add time-based scaling tasks to deliberately scale up and scale down 
      (one for each action) the number of instances within a given time window
- [ ] Under the Auto Scaling Group section in EC2, identify the auto-scaling 
      group associated with the Elastic Beanstalk environment, and set 
      termination policy to OldestFirst
- [ ] Under the Security Groups section in EC2 or VPC, identify the security 
      group associated with the Elastic Beanstalk load balancer; set incoming 
      addresses to [Cloudflare IP ranges](https://www.cloudflare.com/en-gb/ips/) 
      on port 443
- [ ] Stash the following secrets into GitHub settings:
  - [ ] `EB_APP_STAGING` and `EB_ENV_STAGING` - 
    the application and environment names for staging in Elastic Beanstalk 
  - [ ] `EB_APP_PRODUCTION` and `EB_ENV_PRODUCTION` - 
    the application and environment names for production in Elastic Beanstalk 
    (when ready)

#### A Word About Alternatives

Elastic Beanstalk is not the only means through which an application can be 
served. Alternatives include:

- Using API Gateway and AWS Lambda, optionally with AWS Amplify or other JAM Stack
  serving the frontend

- Using AWS App Runner

### Simple Email Service (SES)

- [ ] Verify the domain of the application
- [ ] Verify the email addresses who will be receiving OTPs from the application
      while SES is still in Sandbox mode
- [ ] Apply to upgrade the account from Sandbox to Production via Sending Statistics
- [ ] Create SMTP Credentials under SMTP Settings, if the application is using SMTP
      (as opposed to through aws-sdk) to send OTP emails

### Identity and Access Management (IAM)

- [ ] Set a complex password policy requiring at least 36 characters 
      (at time of writing) and inclusion of non-alphanumeric characters. Team
      members are expected to generate a complex password and store them in 
      their personal vaults in 1Password
- [ ] Create a `developers` policy using the wizard to determine the policies 
      needed for developers
- [ ] Create a `cicd` policy using the policy in `iam-policies/cicd.json`
- [ ] Create a `enforce-mfa` policy using the policy in `iam-policies/enforce-mfa.json`
- [ ] Create a `developers` group, attaching the `enforce-mfa` and `developers`
      policies to the group
- [ ] Create individual IAM users for the engineering team within the group
- [ ] Create a `cicd` user which has the `cicd` policy attached
- [ ] Generate an API Access Key for the `cicd` user, storing the generated
      credentials within the production vault in 1Password
- [ ] Stash the `cicd` credentials in GitHub as repository secrets for GitHub 
      Actions as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### Final configurations

- [ ] Create `staging` and `production` branches off `develop`
- [ ] Protect `production` with a branch policy that disallows force pushes
      and requires reviews before merging

Deploys to `staging` would involve pushing from a source branch to a `staging`,
by force if necessary. This allows developers to use the staging environment
to either test `develop` or their own feature branches as needed.

Deploys to `production` would involve merging by PR only.
