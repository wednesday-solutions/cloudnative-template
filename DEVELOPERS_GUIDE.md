# Developer's Developing Guide

Refer to to the Deployment Flow Guide for more info! If you wanna go into depth of stuff. However for quick setup of development you can use the following!

NOTE: Make sure that you've setup the `public_key` in your keycloak instance or have one that keycloak will use, refer to the [`DEPLOYMENT_FLOW`](https://github.com/wednesday-solutions/fastify-postgres/blob/main/DEPLOYMENT_FLOW_GUIDE.md) to get the public_key!

Were you expecting a huge page explaining how you need to do 20 steps to merely start? Nope not this template! Let's do it in three steps!

Please read requirements in [Deployment Flow Guide](https://github.com/wednesday-solutions/fastify-postgres/blob/main/DEPLOYMENT_FLOW_GUIDE.md)!

## Step #1 - Start the cluster!

Start by creating a minikube cluster with all the stuff that is required lucky you we have just a script that will do the job for you!

```sh
# Note `minikube`, `docker`, `helm`, and `kubectl` must be available
./infra/scripts/local/setup-local-k8s-cluster.sh
```

## Step #2 - Switch to Minikube registry

```sh
eval $(minikube docker-env)
```

## Step #3 - Tilt up

```sh
tilt up
```

And you're done! Enjoy microservices development!
