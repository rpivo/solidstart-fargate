import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export default class SolidStartEcrStackStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.createEcrRepository();
  }

  createEcrRepository() {
    return new Repository(this, 'SolidStartEcrRepo', {
      repositoryName: process.env.ECR_REPO_NAME
    });
  }
}
