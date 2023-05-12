# Generate certificates for KeyCloak and insert it as a secret
openssl req -subj '/CN=auth.localtest.me/O=wednesday./C=US' -newkey rsa:2048 -nodes -keyout local-ss-key.pem -x509 -days 365 -out local-ss-certificate.pem
kubectl create secret tls local-tls-secret --cert local-ss-certificate.pem --key local-ss-key.pem
echo "Created secret 'local-tls-secret' with required certificates..."

# Generate certificates for HAProxy Auth Gateway and insert it as a secret
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout api-tls.key -out api-tls.crt -subj "/CN=api.localtest.me/O=wednesday"
kubectl create secret tls gateway-tls-secret --key api-tls.key --cert api-tls.crt
echo "Created secret 'gateway-tls-secret' with required certificates..."
