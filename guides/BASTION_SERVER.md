# Accessing A Production Database via Bastion Server

This step-by-step guide will walk the reader through the steps needed to create
a bastion server to access the production database. Note that this guide follows
the conventions and configurations found in DEPLOYING.md

## Prior to Setup

Please ensure that you have set up your RDS as instructed in DEPLOYING.md.

## Create a Security Group for SSH Tunnelling

- [ ] We start by creating a security group that only allows SSH access from specific IPs
- [ ] From the EC2 Console, select `Security Groups` and `Create Security Group`
- [ ] Name your new security group `<app-name>-production-rds-bastion`
- [ ] Under `VPC`, select the production VPC i.e. `<app-name>-production`
- [ ] Add a new inbound rule with `Type: SSH`. Add `My IP` under source. This will restrict
SSH access to your current IP address only. Note that this might change if your IP address is
not static.
- [ ] (Optional) Add the IPs of Funan WeWork to the Source. `203.117.162.194/32`, `223.25.68.154/32`,
`118.189.48.46/32`
- [ ] Create the security group

## Setup EC2 Instance

### Config EC2 Instance

- [ ] Create an EC2 nano instance from the EC2 console. Note that this bastion
server should only handle the ssh tunnel to the database.
- [ ] Select the default "Amazon Linux 2 AMI".
- [ ] Select the `t3.nano` instance type.
- [ ] Select the production VPC i.e. `<app-name>-production`.
- [ ] Select the public facing subnet i.e. `<app-name>-production-public-1a`.
- [ ] Select `Auto-assign Public IP` to `Enable`.
- [ ] Ensure that `Shutdown Behavior` is `Stop`.
- [ ] Accept the remaining default settings until you reach `Step 6: Configure Security Group`

### Configuring Security Groups 

- [ ] For `Assign a security group`, select `Select an existing security group`
- [ ] Allow restricted SSH access by selecting the Bastion Security Group
i.e `<app-name>-production-rds-bastion`
- [ ] Allow db access to RDS by selecting the ec2 Security Group i.e `<app-name>-production-ec2`

### Download Login Credentials

- [ ] Create a new key pair for your instance
- [ ] REMEMBER to download the key-pair. You can rename your `.cer` file as a `.pem` file
- [ ] Ideally save it in `~/.ssh` and `chmod 400 <filename>.pem` to secure your PEM.
- [ ] Upload your login credentials to 1Password

## Accessing the Database via SSH Tunnelling

- [ ] Test your ec2 credentials with
`ssh -i <filename.pem> ec2-user@<ec2-instance-public-ip-address>`
- [ ] If your connection times out, please remember to whitelist your existing IP address
and/or Funan WeWork IP.
- [ ] If your ec2 credentials are correct, you should be able to use a database GUI client
that supports SSH tunnelling
