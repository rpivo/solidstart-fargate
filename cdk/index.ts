#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import SolidStartEcrStack from './stacks/ecr';
import SolidStartFargateStack from './stacks/main';

const { AWS_ACCOUNT: account, AWS_REGION: region } = process.env;

const env = {
  account,
  region
};

const app = new App();

new SolidStartEcrStack(app, 'SolidStartEcrStack', { env });
new SolidStartFargateStack(app, 'SolidStartFargateStack', { env });
