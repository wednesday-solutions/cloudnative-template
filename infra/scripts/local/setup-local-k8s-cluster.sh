#!/bin/bash

source ./infra/scripts/utils.sh

minikube start --kubernetes-version=v1.26.4 --cpus=4 --memory=8000 --disk-size=30g
killall kubectl

echo "Local K8s cluster up and running..."
