source ./scripts/env.sh

aws ecs update-service \
  --profile $AWS_PROFILE \
  --cluster SolidStartEcsCluster \
  --service SolidStartApplicationLoadBalancedFargateService \
  --force-new-deployment \
  --no-cli-pager
