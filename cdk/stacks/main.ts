import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerImage, FargateTaskDefinition, Protocol } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export default class SolidStartFargateStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const repository = this.getEcrRepository();

    const cluster = this.createEcsCluster();

    const taskDefinition = this.createFargateTaskDefinition({ repository });

    this.createApplicationLoadBalancedFargateService({ cluster, taskDefinition });
  }

  createApplicationLoadBalancedFargateService({
    cluster,
    taskDefinition
  }: {
    cluster: Cluster;
    taskDefinition: FargateTaskDefinition;
  }) {
    new ApplicationLoadBalancedFargateService(
      this,
      'SolidStartApplicationLoadBalancedFargateService',
      {
        cluster,
        cpu: 256,
        desiredCount: 1,
        taskDefinition,
        memoryLimitMiB: 512,
        publicLoadBalancer: true,
        serviceName: 'SolidStartApplicationLoadBalancedFargateService'
      }
    );
  }

  getEcrRepository() {
    return <Repository>(
      Repository.fromRepositoryName(this, 'SolidStartEcrRepo', <string>process.env.ECR_REPO_NAME)
    );
  }

  createEcsCluster() {
    return new Cluster(this, 'SolidStartEcsCluster', {
      clusterName: 'SolidStartEcsCluster'
    });
  }

  createFargateTaskDefinition({ repository }: { repository: Repository }) {
    const taskDefinition = new FargateTaskDefinition(this, 'SolidStartTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    const container = taskDefinition.addContainer('SolidStartTaskDefinitionContainer', {
      image: ContainerImage.fromEcrRepository(repository, 'latest')
    });

    container.addPortMappings({
      containerPort: 3000,
      hostPort: 3000,
      protocol: Protocol.TCP
    });

    return taskDefinition;
  }
}
