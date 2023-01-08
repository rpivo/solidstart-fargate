# solidstart-fargate

Small template to quickly deploy a [solid-start](https://github.com/solidjs/solid-start) app to AWS ECS using [Fargate](https://aws.amazon.com/fargate/).

- [Setup](#setup)
- [First-Time Deployment](#first-time-deployment)
- [Viewing The App Live](#viewing-the-app-live)
- [Deploying Changes](#deploying-changes)
- [Destroying The Stack](#destroying-the-stack)
- [Updating Dependencies](#updating-dependencies)

### Setup

Setup consists of:

- installing cdk globally
- installing local dependencies
- setting up an AWS profile

**You may also need to bootstrap your aws environment if you haven't already done so. [See here.](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)**

<hr />

Install aws cdk globally so that you have access to the cli:

```sh
npm i -g aws-cdk
```

Install this repo's dependencies:

```sh
npm ci
```

This repo assumes the use of an AWS profile on your computer called `personal_account`. If you've previously set up a profile and want to use it here, replace instances of `personal_account` in this repo with the name of your profile.

If you have never set up a profile, go to https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html.

### First-Time Deployment

First-time deployment goes like this:

1. Add environment variables
2. Deploy the ECR repo
3. Deploy the image which contains the solid-start build.
4. Finally, deploy Fargate.

Fargate needs to create a service from an image that already lives in ECR, so we deploy ECR and the image first.

Note that you can diff the stacks before actually deploying them to see what changes they will make to your account. Ex:

```sh
npm run diff SolidStartEcrStack
```

<hr />

1. Add your environment variables to **scripts/env.sh**:

```sh
export ECR_REPO_NAME=solid-start-ecr-repo
# change this profile name if using a different profile
export AWS_PROFILE=personal_account
export AWS_ACCOUNT={your account id}
export AWS_REGION={aws region}

```

2. Deploy the ECR stack.

```sh
npm run deploy SolidStartEcrStack
```

You should now see the stack `SolidStartEcrStack` appear in Cloudformation, and you should see a new repo in ECR.

3. Build a new image and deploy it to ECR. This builds the source code and creates a new image containing that build. You will need to have Docker running for this step:

```sh
npm run deploy:image
```

You should now see a new image tagged `latest` inside of the ECR repo you made.

4. Deploy the Fargate stack. Most of the resources live in this stack.

```sh
npm run deploy SolidStartFargateStack
```

You should now see the `SolidStartFargateStack` stack in Cloudformation, and you should see a new Fargate cluster containing one service in ECS.

That's it!

### Viewing The App Live

To see your app live on AWS, you'll need to find the A record that is auto-assigned to the load balancer in front of the service. To do this in the dashboard:

- Go to EC2 > Load balancers
- Find the load balancer associated with this stack (should have `Solid` in the name)
- Copy the **DNS name** (A record) for the load balancer and navigate to it in the browser

### Deploying Changes

After the initial deployment, you don't need to redeploy the stacks unless you are making configuration changes to them.

To deploy a new build of the app:

```sh
npm run deploy:image
npm run updateService
```

`deploy:image` builds and deploys a new image, and `updateService` will force Fargate to create a new service using the latest deployed image. This puts the new service into rotation within the cluster while also taking down the old service.

### Destroying The Stack

To destroy all resources:

Destroy the fargate stack first.

```sh
npm run destroy SolidStartFargateStack
```

Then, delete all images inside the ECR repo. You can do this using the AWS cli, or from the dashboard.

Then, destroy the ECR stack:

```sh
npm run destroy SolidStartEcrStack
```

### Updating Dependencies

#### solid-start

This template was bootstrapped with `npm init solid@latest` with TypeScript and the SSR option. To completely bootstrap it with solid-start again, create a new repo, run `npm init solid@latest`, and then:

- copy the **scripts** and **cdk** folders from this repo to the new repo.
- copy the `diff`, `deploy`, and `destroy` scripts from this **package.json** to the new repo.
- Install `aws-cdk-lib`, `constructs`, and `ts-node` to be able to run cdk stuff in the new repo.

Other than that, you can update the other dependencies of this repo as need be.
