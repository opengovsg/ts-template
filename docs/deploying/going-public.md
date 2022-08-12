# Going Public

The following guide lists the follow-up work that has to be done
before an application can be considered ready for public release

## Sign up for Accounts

Register for the following services:

| Name                  | Purpose                           |
| --------------------- | --------------------------------- |
| Cloudflare            | CDN, DNS                          |
| GovTech, Vodien et al | Domain name registrar             |
| Datadog               | Logging and monitoring            |
| BetterUptime          | Uptime monitoring                 |
| Google Groups         | Contact email for the application |
| Zendesk               | Product Operations                |


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

## Anything else

TODO
