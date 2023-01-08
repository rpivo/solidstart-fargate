source ./scripts/env.sh

npm run build:src

aws ecr get-login-password \
  --region $AWS_REGION \
  --profile $AWS_PROFILE | docker login \
  --username AWS \
  --password-stdin ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker build -t $ECR_REPO_NAME .

docker tag ${ECR_REPO_NAME}:latest ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

docker push ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest
