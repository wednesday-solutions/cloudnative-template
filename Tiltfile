print("""
-----------------------------------------------------------------
✨ Its Wednesday eh?! 🤠
NOTE: Be in minikube registry, if you're here after
`setup-local-k8s-cluster` script you're good to go! Also
you must have a public key available at
`./infra/configurations/haproxy/` directory.
-----------------------------------------------------------------
""".strip())

#######################
# BUILD IMAGES
#######################

# Build alpha app image
docker_build(
  'fastify-postgres-alpha:local',
  dockerfile='./apps/alpha/Dockerfile.local',
  context='.',
  ignore=['./apps/kebab'],
  entrypoint='pnpm start:dev --filter alpha',
  live_update=[sync('.', '/apps/alpha')]
)

#######################
# Resource Initialization
#######################

# Initialize certificates
local_resource('init certificates', cmd='./infra/scripts/local/gen-cert.sh', auto_init=True)

# Initialize Configmaps for API Gateway
local_resource('init gateway configmaps', cmd='./infra/scripts/local/create-configmaps-for-gateway.sh', auto_init=True)

# Initialize Dapr
local_resource('initialize dapr', cmd='dapr init -k', auto_init=True)

########################
# Deploy helm charts
#######################

# Deploy Redis Cache Cluster
k8s_yaml(helm('./infra/charts/cache', name='redis-cluster'))

# Deploy Jaeger
# k8s_yaml(helm('./infra/charts/jaeger', name='jaegar-tracing', values='./infra/charts/jaeger/values.local.yaml'))

# Deploy Keycloak Auth server
k8s_yaml(helm('./infra/charts/keycloak', name='keycloak-local', values='./infra/charts/keycloak/values.local.yaml'))

# Deploy Alpha Service
k8s_yaml(helm('./infra/charts/alpha', name='alpha-local', values='./infra/charts/alpha/values.local.yaml'))

# Deploy API Gateway
k8s_yaml(helm('./infra/charts/api-gateway', name='haproxy-gateway', values='./infra/charts/api-gateway/values.local.yaml'))
