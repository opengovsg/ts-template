# Deploying Your Application - An Engineer's Guide

Learn how to prepare your application to take it from your development
environment into a deployment ready to receive users.

## Infrastructure

### AWS Account Set-up

#### Managed

- Create new CloudCity accounts for staging and production

#### Manual

- Register for AWS VPN and AWS SSO
- Create root AWS
- Create two AWS accounts, for staging and production
- If desired, set up AWS Control Tower

### Setting up compute and networking

- Use terraform to deploy CRUD application infrastructure, with
  template provided in a separate repository. This includes:
  - VPCs
  - Subnets
  - Security Groups
  - ECS (preferred) or Elastic Beanstalk (legacy)
  - RDS

- Stash the following secrets for GitHub Actions:
  - AWS access keys
  - Elastic Container Registry details
  - Environment Names

- Stash secrets in AWS Systems Manager Parameter Store.
  The actual secrets to store are defined in ecs-task-definition.json

- Use the following branch names for deploying:
  - `staging` - deploys to staging
  - `master` or `release` - deploys to production

- Wire the deploy GitHub Action to be invoked on push to
  the designated branch names

- Obtain Amazon Certificate Manager (ACM) SSL certificates for
  the domain associated with the application
  - Configure DNS entries in Cloudflare to facilitate this,
      following instructions from AWS

- Create DNS entries on Cloudflare that point the root domain
  and www subdomain to the load balancer

- Create DNS entries on Cloudflare so that Google Groups
  can be used for mail addresses with the domain name associated
  with the application

### Setting up GitHub Actions

The GitHub Actions CI workflow (`ci.yml`) uses GitHub OIDC to authenticate with AWS.

This has several benefits over using AWS access keys:

- The credentials are short-lived, and can be revoked at any time
- Fine grained access control for credentials

Read more on OIDC [here](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect).

The simplest way to set this up is using CloudFormation. In the root AWS account, create a CloudFormation stack:

```yaml
Parameters:
  GitHubOrg:
    Type: String
  RepositoryName:
    Type: String
  OIDCProviderArn:
    Description: Arn for the GitHub OIDC Provider.
    Default: ""
    Type: String
​
Conditions:
  CreateOIDCProvider: !Equals
    - !Ref OIDCProviderArn
    - ""
​
Resources:
  Role:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Effect: Allow
            Action: sts:AssumeRoleWithWebIdentity
            Principal:
              Federated: !If
                - CreateOIDCProvider
                - !Ref GithubOidc
                - !Ref OIDCProviderArn
            Condition:
              StringLike:
                token.actions.githubusercontent.com:aud: sts.amazonaws.com
                token.actions.githubusercontent.com:sub: !Sub repo:${GitHubOrg}/${RepositoryName}:*
      Policies: # TODO - Attach any other policies you need to deploy your app (ECR, EB)
        - PolicyName: DeployToSomeS3Bucket
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - s3:DeleteObject
                  - s3:GetBucketLocation
                  - s3:GetObject
                  - s3:ListBucket
                  - s3:PutObject
                  - s3:ListObjectsV2
                Resource: arn:aws:s3:::<s3-bucket-name>/*
​
  GithubOidc:
    Type: AWS::IAM::OIDCProvider
    Condition: CreateOIDCProvider
    Properties:
      Url: https://token.actions.githubusercontent.com
      ClientIdList:
        - sts.amazonaws.com
      ThumbprintList:
        - 6938fd4d98bab03faadb97b34396831e3780aea1
​
Outputs:
  Role:
    Value: !GetAtt Role.Arn
```

The stack creates a role that is assumed by the GitHub Action. The stack provided allows the role to sync with an S3 bucket. You must add any policies required to deploy your application to that role.

The stack will prompt for a few inputs:

- `GitHubOrg`: This should be either `datagovsg` or `opengovsg`
- `RepositoryName`: The repository the GitHub Action will run on
- `OIDCProviderARN`:
  - If a GitHub OIDC provider already exists in the account, use the ARN of the provider
  - Else leave this field blank, and the stack will create a new provider

After creating the resources, navigate to the GitHub OIDC Provider created, and copy the ARN.

In the GitHub Action's env vars, set:

- `AWS_ROLE_ARN`: the copied ARN
- `AWS_REGION`: the region of the AWS account

That's it!

> Terraform version coming soon...
