# Deploying Your Application - A Guide For Everyone

Learn how to prepare your application to take it from your development 
environment to a simple deployment environment

## Infrastructure

We use DigitalOcean to allow for straightforward management of 
infrastructure. This is especially helpful for teams with few 
engineers, so that they can focus on building better product.

You will need a credit card to sign up for DigitalOcean.

### DigitalOcean Set-up

On initial login to DigitalOcean, the user will be presented with the 
following screen:

![DigitalOcean - Landing Page](images/digitalocean/landing-page.png)

Create a new database cluster, selecting the Singapore datacentre
and PostgreSQL as the engine:

![DigitalOcean - Create Database](images/digitalocean/create-database.png)

In a new tab, create a new App on DigitalOcean by clicking Create App, 
followed by Manage Access. Ensure that the DigitalOcean GitHub App 
(integration) is installed on both your personal GitHub account as 
well as the GitHub organisation containing the repo to deploy[^1].

![DigitalOcean - App From Source](images/digitalocean/app-from-source.png)

Click Next. Ensure Resources consist of a Web Service read from the 
Dockerfile, with 2GB RAM. Add a database as a resource.

![DigitalOcean - Resources](images/digitalocean/resources.png)

Under Configure Your Database, add your Previously Created DigitalOcean
Database.

![DigitalOcean - Attach Database](images/digitalocean/attach-database.png)

Edit the application's environment variables.

Go back to the database tab, and copy each connection parameter to the 
corresponding environment variable as shown in the screenshots below.
Also add `NODE_ENV`, and set that to `production`.

(If you wish to use email OTPs for your application, sign up for an email
service like SendGrid, then input the mail connection parameters as
the relevant environment variables documented [here](../../backend/src/config/config.schema.ts).

![DigitalOcean - Database Params](images/digitalocean/db-params.png)

![DigitalOcean - Environment Variables](images/digitalocean/env-vars.png)

Click ahead to Review, then Create Resources

## References
[^1]: https://www.digitalocean.com/community/questions/how-to-properly-link-github-repositories-in-app-platform
