# Replace `wednesday.pem` with your Auth Server's public key
kubectl create configmap haproxy-auth-gateway-iss-cert --from-file=./infra/configurations/haproxy/wednesday.pem
kubectl create configmap haproxy-auth-gateway-haproxy-cfg --from-file=./infra/configurations/haproxy/haproxy.cfg
