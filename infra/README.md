## Quick Start

Use terraform to setup infrastructure skeleton consisting of
- vpc
- database
- ecs app

#### Requires
  - `terraform`
  - `jq`
  - Configured AWS credentials

### Setup
- Setup TF environment
  - Copy `infra/env/example/*` into `infra/env/staging/*` and update files accordingly

- Bootstrap terraform s3 backend (TODO, move this state to S3)
```bash
# in infra
cd infra
terraform -chdir=backend init
terraform -chdir=backend apply --var-file=../env/staging/variables.tf --state=../env/staging/state.backend.tf
terraform -chdir=backend output --state=../env/staging/state.backend.tf
```

- Create backend config file `infra/env/staging/backend.tf` based on results from above
```terraform
bucket         = "<get from previous terraform output>"
key            = "terraform.tfstate"
encrypt        = true
region         = "ap-southeast-1"
dynamodb_table = "<get from previous terraform output>"
```

- Setup terraform s3 backend.
```bash
# in infra
cd infra
terraform -chdir=app init --backend-config=../env/staging/backend.tf
terraform -chdir=app apply --var-file=../env/staging/variables.tf
terraform -chdir=app output -json | jq ."app"."value"
# if successful, you should see something on the ALB DNS

# get secrets !! dont share !!
terraform -chdir=app output -json | jq ."database"."value"."cluster_master_password"
```

- Setup SSM Parameters, based on environment variables in `.env.development`
  - Copy `.env.development` to `.env.staging`
  - Update the variables in `.env.staging` for your specific environment from previous terraform output
  - Run `ENV=staging npm run env:put` and run generated SSM commands

- [Local Dev] Deploy code to ECS manually
  - Login to ECR
  ```bash
  # in root folder
  aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com
  ```
  - Build docker file and push to ECR
  ```bash
  # in root folder
  docker build -t <AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com/ts-template-staging-app:latest .
  docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com/ts-template-staging-app:latest
  ```
  - Update ECS task definition and force redeploy
  ```bash
  # in root folder
  # substitute commands with correct variables
  cp ecs-task-definition.json ecs-task-definition-manual.json
  sed -i '' 's/<AWS_ACCOUNT_ID>/<AWS_ACCOUNT_ID>/g' ecs-task-definition-manual.json
  sed -i '' 's/<IMAGE_TAG>/<IMAGE_TAG>/g' ecs-task-definition-manual.json
  sed -i '' 's/<APP_NAME>/<APP_NAME>/g' ecs-task-definition-manual.json
  sed -i '' 's/<ENV>/<ENV>/g' ecs-task-definition-manual.json

  aws ecs register-task-definition --family ts-template-staging-app --cli-input-json file://ecs-task-definition-manual.json
  aws ecs update-service --cluster ts-template-staging-app --service ts-template-staging-app --force-new-deployment --task-definition ts-template-staging-app
  ```

- Deploy code to ECS via GH actions
  - TBC

- Setup SES for OTP
  - Verify email based on configuration
  - Move out of sandbox
  ```bash
  aws sesv2 put-account-details \
  --production-access-enabled \
  --mail-type TRANSACTIONAL \
  --website-url https://example.com \
  --use-case-description "Use case description" \
  --additional-contact-email-addresses info@example.com \
  --contact-language EN
  ```

- TODO setup HTTPS & ACM
- TODO setup VPN
