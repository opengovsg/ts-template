# Deploying the OGP Application Template

This step-by-step guide will walk the reader through the steps needed to have 
this application running on a hosted environment, with supporting services also set up

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

## Deploying to Cloud Provider

Generally, we use [AWS](./AWS.md) for a full, comprehensive set-up, especially for
more sophisticated applications. We can also deploy to simpler environments like
Heroku and Digital Ocean, although the guides for those have yet to be written.

## Final Configurations

- [ ] Create `staging` and `production` branches off `develop`
- [ ] Protect `production` with a branch policy that disallows force pushes
      and requires reviews before merging

Deploys to `staging` would involve pushing from a source branch to a `staging`,
by force if necessary. This allows developers to use the staging environment
to either test `develop` or their own feature branches as needed.

Deploys to `production` would involve merging by PR only.

## Monitoring and Backups

Refer to the OGP Monitoring Guide and OGP Backup Guide to set up the necessary
monitoring and backup infrastructure
