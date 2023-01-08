echo "\nRunning cdk...\n"

source ./scripts/env.sh

action=${1}
stack=${2}

if [[ -z "$action" ]]; then
  echo "\nNo action provided. Exiting...\n"
  exit 1
fi
if [[ -z "$stack" ]]; then
  echo "\nNo stack provided. Exiting...\n"
  exit 1
fi

cd cdk
cdk ${action} ${stack} --profile $AWS_PROFILE
