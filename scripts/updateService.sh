source ./scripts/env.sh

aws ecs update-service \
  --region $AWS_REGION \
  --profile $AWS_PROFILE \
  --cluster SolidStartEcsCluster \
  --service SolidStartApplicationLoadBalancedFargateService \
  --force-new-deployment \
  --no-cli-pager
