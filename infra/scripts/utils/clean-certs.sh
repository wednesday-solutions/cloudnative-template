FILE=./local-ss-certificate.pem
if test -f "$FILE"; then
    echo "$FILE exists. Deleting..."
    rm ./local-ss-certificate.pem
fi

FILE=./local-ss-key.pem
if test -f "$FILE"; then
    echo "$FILE exists. Deleting..."
    rm ./local-ss-key.pem
fi

FILE=./api-tls.crt
if test -f "$FILE"; then
    echo "$FILE exists. Deleting..."
    rm ./api-tls.crt
fi

FILE=./api-tls.key
if test -f "$FILE"; then
    echo "$FILE exists. Deleting..."
    rm ./api-tls.key
fi
