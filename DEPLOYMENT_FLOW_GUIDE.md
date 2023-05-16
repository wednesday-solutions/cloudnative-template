# Developer's Guide

Wanna contribute? Or wanna use this template? Well this guide will get you upto speed with whatever we have in this repository. It will help you understand the concepts behind few things more so you'll have this entire template up and running just like production k8s deployment on your local machine!

## Requirements

Before you even start using or do anything let's make sure your machine has the required softwares and resources.

### Software Requirements

- [Docker](https://www.docker.com/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Helm](https://helm.sh/)
- [Nodejs](https://nodejs.org/en)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Tilt](https://tilt.dev/)

The above softwares must be available through CLI on your machine (regardless of OS or Architecture); given that you have `docker` installed spinning up a `kubernetes` (we'll use `k8s` for `kubernetes` from now on) cluster wouldn't be difficult.

Note that we're not using something like [Rancher](https://www.rancher.com/) or `Docker Desktop` for `K8s` we'll be using `minikube`, though you're free to use whatever you want. Just know that a few scripts might NOT work for you! So we recommend using `minikube` for getting a general understanding and idea.

### Hardware Requirement

Though managable and adjustable there is still a minimal limit that your host machine MUST have in order to have optimal developer experience with this repository. Know that you can always spin up a `k8s` cluster on `AWS` or `GCP` to provision resources separately (can be pricey though!).

This guide assumes that you have the minimum resource requirement, which are as follows:

NOTE: `Docker` here refers to the `docker daemon`, on MacOS and Windows you can use `Docker Desktop` to configure the daemon, in linux resources can be alloted through `docker cli` given that you've updated `cgroups` in your distro.

- A RAM requirement of minimum `8 GigaBytes` available to `Docker` with few Gigabytes more left for your host machine.
- A minimum of `4 CPUs` assigned and available to `Docker` with a few more left for your host machine.
- A minimum of `30 Gigabytes` of Space available to `Docker` with more left for your host machine.
- For good performance a minimum of `2 Gigabytes` of SWAP memory assinged to `Docker`.

## 1. Spin up a K8s Cluster

The very first thing that we must have is a `k8s` cluster where everything will be deployed. We'll use `Helm Charts` available in the `/infra/charts` directory and apply them to this cluster.

You can spin an instance in two ways, one is to simply run the the script that we've provided in the `/infra/scripts` directory. So let's spin up a `minikube` cluster! Run the following from root directory:

```sh
# Note `minikube`, `docker`, `helm`, and `kubectl` must be available
./infra/scripts/local/setup-local-k8s-cluster.sh
```

If your CLI is not able to use that file directory please give it execute permissions! You can achieve that on any script provided by doing the following:

```sh
chmod +x ./infra/scripts/local/setup-local-k8s-cluster.sh # Replace this with whatever script you wanna mark executable
```

The script does the following:

1. Creates a `minikube` cluster with `4 CPUs`, `8000MB of Memory`, and `30GB of Disk Space` this will be running on `k8s` version `1.26.4`
2. Enables `Ingress` addon on `minikube`, if you're not using `minikube` you'll probably have to install `ingress-nginx` separately.
3. Creates a `deployment` for K8s Dashboard, use (`minikube dashboard` or `kubectl proxy` to view it)
4. Installs CRDs (Custom Resource Definitions), ie. Cloudnative PG and Bitnami Charts repository

Once you've everything up and ready you'll see the following message `Local K8s cluster up and running...` in your terminal, if you have any errors double check with the requirements above or check the `Troubleshooting` section at the very bottom!

You can verify if your `minikube` and `k8s` cluster is running by doing the following:

```sh
# Verify Minikube Cluster
minikube status

# Verify K8s cluster
kubectl cluster-info
```

You'll probably see something like this, which means its working,

```sh
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured

Kubernetes control plane is running at https://127.0.0.1:51531
CoreDNS is running at https://127.0.0.1:51531/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Now before moving to next step just make sure that the `ingress` is running,

```sh
kubectl get all -n ingress-nginx
```

If you have this you're good to go! It must have `1/1` with `Running` status!

```sh
ingress-nginx          pod/ingress-nginx-controller-6cc5ccb977-5zgw4   1/1     Running
```

Now in your current terminal instance do the following to switch to `minikube`'s docker registry:

```sh
eval $(minikube docker-env)
```

NOTE: Now prefer using this terminal instance for the rest of this tutorial, we'll explicitly let you know for which commands you can change terminals!

WHY THE ABOVE?

The reason for doing this is, running `eval $(minikube docker-env)` causes your docker daemon to switch its [registry](https://minikube.sigs.k8s.io/docs/handbook/pushing/#1-pushing-directly-to-the-in-cluster-docker-daemon-docker-env) over to `minikube`'s therefore whatever image you build here or other stuff will remain valid ONLY UNTIL you're in `minikube`'s registry.

## 2. Build the `alpha` image

The `alpha` app inside `/apps/` directory is a `Nodejs` application, refer to its documentation for more! It uses Fastify as its framework, Redis for cache, and Postgres as Database.

From your root directory run the following to build the image:

```sh
docker build -f ./apps/alpha/Dockerfile -t fastify-postgres-alpha:local .
```

Notice the tag `local`, your image takes the default `latest` tag if not provided, unfortunately `k8s` will try to pull images by default if they have `latest` tags even if they are available on your local machine, even setting `imageNeverPull` doesn't help and it results in a `ErrImageNeverPull` error in your pod. Therefore we're using `local` as our tag here!

Give this sometime and once succeeded run the following to be sure if you have the image in your registry:

```sh
docker images
```

You should see something like this (only check for `fastify-postgres-alpha`)...

```sh
fastify-postgres-alpha                               local          d9278e44e77a   8 hours ago     559MB
ghcr.io/cloudnative-pg/postgresql                    15.2           87f8c432147d   20 hours ago    568MB
ghcr.io/cloudnative-pg/cloudnative-pg                1.20.0         d934ec47f27e   2 weeks ago     94.7MB
registry.k8s.io/kube-apiserver                       v1.26.4        35acdf74569d   4 weeks ago     134MB
registry.k8s.io/kube-controller-manager              v1.26.4        ab525045d05c   4 weeks ago     123MB
registry.k8s.io/kube-proxy                           v1.26.4        b19f8eada6a9   4 weeks ago     65.6MB
registry.k8s.io/kube-scheduler                       v1.26.4        15a59f71e969   4 weeks ago     56.4MB
registry.k8s.io/ingress-nginx/controller             <none>         0d4c0564c465   7 weeks ago     283MB
registry.k8s.io/ingress-nginx/kube-webhook-certgen   <none>         5a86b03a88d2   2 months ago    47.1MB
```

Feel free to dive into the `alpha` app's `Dockerfile`, its multistaged in order to provide high caching capabilities and reduce build time.

## 3. Generate Required Secrets and Certificates

The k8s cluster is capable of exposing certain ports on hosts set in the manifests however it requires certificates, we'll be using self-signed certificates for this case.

```shell
./infra/scripts/local/gen-cert.sh
```

The above will generate two sets of `certificate` and `key` one for `Keycloak` authentication server and one for `API Gateway` and insert them as secrets.

## 4. Get your public key and setup config maps

The HAProxy API Gateway requires the `Public Key` of your auth server to verify JWT that will be exchanged therefore we need to get the Pubilc Encryption Key.

An easy way to do that is to first deploy `Keycloak` auth server and tunnel it, we'll just create a relm and get what is necessary.

Let's start by `cd`-ing into `/infra/charts` directory. And execute these, remember when installing helm charts you MUST be in the `/infra/charts` directory.

```shell
helm install keycloak-local keycloak/ --values keycloak/values.local.yaml
```

This will start creating mainly two pods, one for `keycloak` auth server and another `cnpg` (Cloudnative Postgres) cluster with one master instance (you can increase these when in production however for resource availability we've a bare minimum setup). Please be patient while this deploys. Make sure to move ahead once you have both pods up and running.

Once done we can start tunneling (perform this on another terminal instance so as to keep your main terminal free), just open up another terminal instance and do:

```shell
minikube tunnel
```

Once done it might probably ask for priviledges just enter your password and `keycloak` will be available at `https://auth.localtest.me`. Enter default `admin` and `admin` as username and password (Please change these in production). The first thing to do is to create a new Realm!

- Create a new realm!
![Screenshot 2023-05-16 at 10 53 10 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/efc5cdb1-3773-4df3-9614-ef4d70feb7f3)
![Screenshot 2023-05-16 at 10 53 29 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/d0273333-8724-44e9-974e-de6105814c18)

- Create a new client in your new realm!

![Screenshot 2023-05-16 at 10 53 54 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/2d43ff0a-92f3-4f6e-8349-b2d1d13eac4f)

- Name it whatever you want I am calling it `frontend`!

![Screenshot 2023-05-16 at 10 54 16 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/bac5f10d-53ce-4025-84fd-52fcbc08c263)

- Make sure that you've disabled `Client Authentication` since this application will be protecting a Frontend app which is public so we need `public` access type! And then click on save!

![Screenshot 2023-05-16 at 10 54 38 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/46db8b0d-daf0-4d44-91a6-e56d8e284cdf)

- Since we'll be running our frontend on local therefore we need to update the URLs. Navigate to `Settings` of your newly created Client. And update the URLs like so and save!

![Screenshot 2023-05-16 at 10 55 19 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/c15ed5b3-77e1-49e7-949c-de53745bf6de)

- Now head over to `Realm Settings` on the side bar and head into `Login` tab and allow the following so as to allow users to register for an acccount!

![Screenshot 2023-05-16 at 10 55 43 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/da472eaa-21ec-4527-a345-4b864d12e9b1)

- Head back to `General` tab in your `Realm Settings` and open up the link which says `OpenID Endpoint Configuration`, you'll see a bunch of JSON open the link in `issuer`!

![Screenshot 2023-05-16 at 10 56 11 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/8d6d32d4-119b-416d-84a1-8e880e2de0ee)
![Screenshot 2023-05-16 at 10 56 38 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/4c2da6ab-28e4-4788-b6b8-f24e4de5a360)

- And here is the `public_key` you're looking for! Follow the steps below to know how to use it!

![Screenshot 2023-05-16 at 10 57 03 AM](https://github.com/wednesday-solutions/wednesday-cloudnative/assets/104886701/b3711c1b-c9a4-4296-a4a4-f7379e83f9da)

The above should give you a new realm of your own to play with. Explaination of Keycloak and how it works is available on their website check it out [here](https://keycloak.org).

You can get your public key by heading over to `https://auth.localtest.me/realms/<your-realm-name>`, and copy the `public_key` field.

Now create a new file with the name of your realm (you can name it whatever you want) and ending with `.pem` extension inside `/infra/configurations/haproxy/`. For example if we have a realm named `wednesday` we'll have `/infra/configurations/haproxy/wednesday.pem` file make sure the file looks like this:

```pem
-----BEGIN PUBLIC KEY-----
<--INSERT YOUR KEY HERE-->
-----END PUBLIC KEY-----
```

Now you can close the `tunneling` by closing (killing) the terminal running `minikube tunnel`. Keycloak will keep running.

Once you have this you have to create config maps you can manually configure the configmaps or run the following script.

```shell
./infra/scripts/local/create-configmaps-for-gateway.sh
```

Once this is done it will create two configmaps one named `haproxy-auth-gateway-iss-cert` with the `.pem` file you just made. Make sure the file `.pem` file contains the Public Key of Keycloak's Realm. The other file is gonna be `haproxy.cfg` is configurations for HAProxy which we will talk about later one we will configure the API Gateway!

Now you're ready for other deployments.

## 5. Deploy Redis Cluster

The Alpha application uses Redis cluster which means for it to work you have a working and running Redis instance. For this case we'll be using Replicated Redis Cluster. However for local work we'll only have the master node up.

```shell
helm install redis-cluster cache/
```

The above should be executed in the charts directory and it should start deploying the Redis cluster.

## 6. Deploy Alpha Service

Now we have our Authentication Server up and running its time to deploy the Alpha Service.

Again from the `/charts` directory run the following to deploy the Alpha Service:

```sh
helm install alpha-local alpha/ --values alpha/values.local.yaml
```

Now all you gotta do is wait for the Alpha Service to come up!

Once the service is up you should be able to the service running with a side (Dapr) running along side it. You can check logs for the application by doing a normal `kubectl logs <container-name>` this will emit logs from the application. However if you (by any chance) wanna check the logs emitted by Dapr just do the same and append `-c daprd`, then you can see the logs by the `dapr` daemon.

## 7. Deploy API Gateway

Now all we gotta do is start our Gateway that will start moving traffic. For this we will be using HAProxy Gateway its light weight and quite easy to configure. Fortunately we've already moved all the files that you needed in secrets and configmaps.

```sh
helm install haproxy-gateway api-gateway/ --values api-gateway/values.local.yaml
```

Just run the above and it should deploy the HAProxy gateway if you've done everything right all you have to do is to do `minikube tunnel` and you'll have everything running and ready.

## 8. Test using the frontend

Just head into `/apps/kebab` and do `pnpm dev` that should start the frontend at `http://localhost:3000` once that is up and running just try to login or you can register. And see everything succeeds, if it does you'll have your user data showing up.

Also if everything works you can even call the `Call Healthcheck Endpoint` that will hit the `alpha` service which should also succeed, check the HAProxy Gateway logs for more interesting information.

## Troubleshooting

<details>
  <summary>
    <b>I am getting OOM Killed!</b>
  </summary>
  OOM (Out of Memory) Killed simply means that your pods are requesting more memory than available. A few things to keep in mind is that the initial configuration and hardware requests provided at the top of this document is a MUST. Make sure you've not decreased the memory or CPU limit.

  <br />Few other things to keep in mind is that the initial values provided are bare minimum, which means if you increase the amount of instances (say Redis Cluster's instance) then you probably need to increase the resources too!

  Not only that make sure that you've left enough memory for your Host machine.
</details>
