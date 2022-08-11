# Deploying Your Application - An Engineer's Guide

Learn how to prepare your application to take it from your development 
environment into a deployment ready to receive users.

## Sign up for Accounts

Register for the following services:

| Name | Purpose |
|-|-|
| Cloudflare | CDN, DNS |
| AWS | Cloud infrastructure |
| GovTech, Vodien et al | Domain name registrar |
| Datadog | Logging and monitoring |
| BetterUptime | Uptime monitoring |
| Google Groups | Contact email for the application |
| Zendesk | Product Operations |

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

## Monitoring

- Ensure that the application outputs logs that are 
  [ndjson-formatted](https://ndjson.org). This makes it very
  convenient for Datadog (and other tools) to parse and index
  your logs.  
  ts-template uses pino, which natively emits such logs.

- Generate an API key for your application from Datadog

- Inject the following env vars into your application:
  - `DD_API_KEY`
  - `DD_SOURCE` (typically nodejs or similar)
  - `DD_SERVICE` (the name of your application)
  - `DD_TAGS` (typically `env:staging` or `env:production`)

- Generate a client key for Datadog RUM

- Set up BetterUptime
