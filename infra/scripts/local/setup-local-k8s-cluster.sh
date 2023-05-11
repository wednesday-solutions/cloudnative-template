#!/bin/bash

source ./infra/scripts/utils.sh

###  ¯\_(ツ)_/¯
echo '----------------------------------------------------------------------------'
echo '------------------- WEDNESDAY SOLUTIONS FASTIFY POSTGRES -------------------'
echo '----- NOTE THE DEFAULT CONFIGURATIONS FOR THIS CLUSTER ARE AS FOLLOWS ------'
echo '----------- MEMORY: 8000MB CPUs: 4 K8s Version: 1.26.4 DISK: 30G -----------'
echo '-------------- CONFIGURE THIS ACCORDING TO YOUR REQUIREMENTS ---------------'
echo '----------------------------------------------------------------------------'
echo

# Create a new Minikube Cluster
minikube start --kubernetes-version=v1.26.4 --cpus=4 --memory=8000 --disk-size=30g
killall kubectl

# Enable Ingress Addon
echo 'Enabling Ingress addon...'
minikube addons enable ingress
echo

# Deploying K8s Dashboard
echo 'Deploying K8s Dashboard...'
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
echo

# Install CRDs
echo 'Installing CRDs...'
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.20/releases/cnpg-1.20.0.yaml
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
echo

echo "Local K8s cluster up and running..."
