# Microservices-Based Online Store

I built a Microservice-Based Online Store, customized it and deployed it in the local Kubernetes pods, where all the services have their own logic and the database as well as perform the specific functions. It is  built with Node JS and Next.js (React). It also uses NATS Streaming Server to implement publish -subscribe message distribution model for one-to-many communication.

You can see in the video how I delete Products Service Pod but a user’s shopping cart is still available and you can even process the payment with Stripe (Test mode). This should be very interesting if you have built applications with monolithic architecture only. I deployed the app locally but you can run microservices, say, on Digital Ocean with Kubernetes.

```
Create kubectl secrets for the app

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_51KwPjRKVwzOYdWGqlFEqqLuE1OnBz4JkZhgnYnqUw43SBmHVr9PTzhgUNalLWORbD4XDDPQegUWogW3A4ioxjpnA00On3HiaXF

Stripe Card Information for testing

Card Number: 4242 4242 4242 4242
CVC: 567
Expiration Date: 12/34

Run the following command to install ingress-nginx 

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
```

Go to Microservices-Based Online Store [Video](https://youtu.be/527022qAb9M) page
Go to Microservices-Based Online Store [Description](https://github.com/Ashot72/Microservices-based-Online-Store/) page
