---
{
  "title": "Quick VPS/Bare Metal Kubernetes Setup",
  "description": "A quick guide to setting up a Kubernetes cluster on bare metal with Ingress and SSL, covering the basics of deployment, configuration, and securing your cluster with SSL certificates for a production-ready environment",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/617px-Kubernetes_logo_without_workmark.svg.png",
  "datetime": "2024/12/10 23:50",
  "author": "Mario Baldi"
}
---


# Setup Kubernetes Cluster on bare metal with Ingress and SSL
## 3 node cluster with 3 Virtual Private Servers

| Key           | VPS1          | VPS2          | VPS3          |
| ------------- | ------------- | ------------- | ------------- |
| **Hostname**  | n1.iworkon.it | n2.iworkon.it | n3.iworkon.it |
| **IPAddress** | 85.190.241.43 | 85.190.241.22 | 156.67.83.70  |

## Setup
### Hostname
```sh
> hostnamectl set-hostname n*.iworkon.it
```
### DNS
If you have no DNS just instruct the machines about your hostname addressing
```
# /etc/hosts
# ...
85.190.241.43 n1.iworkon.it
85.190.241.22 n2.iworkon.it
156.67.83.70 n3.iworkon.it
```
### Setup user
Add user, include into sudoers and set its password
```
> useradd -m iworkon
> usermod -aG sudo iworkon
> passwd iworkon
```
### SSH certificates
Create ssh key 
```sh
> ssh-keygen
```
and produce the keys
```sh
> ls ~/.ssh | grep iworkon
id_n1.iworkon.it
id_n1.iworkon.it.pub
id_n2.iworkon.it
id_n2.iworkon.it.pub
id_n3.iworkon.it
id_n3.iworkon.it.pub
```
Then copy the keys on the server
```
> ssh-copy-id -i ~/.ssh/id_n*.iworkon.it iworkon@n*.iworkon.it
```
### Setup system
#### Disable swap on all nodes
Comment with # the line `/swapfile` in `/etc/fstab`
```
> swapoff -a
> vim /etc/fstab
> systemctl restart containerd
```
#### Update repository
```
> apt update && apt upgrade
```
#### Install dependencies
```
> apt install docker.io
```
#### Load needed kernel module
```
> tee /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF
> modprobe overlay
> modprobe br_netfilter
> tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
> sysctl --system
```
#### Install containerd runtime
```
> apt install apt-transport-https ca-certificates curl software-properties-common
> curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/docker.gpg
> add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
> apt update
> apt install containerd.io
```
Setup containerd to use systemd as cgroup manager
```
> containerd config default | sudo tee /etc/containerd/config.toml >/dev/null
> sed -i 's/SystemdCgroup = false/SystemdCgroup = true/'/etc/containerd/config.toml
> systemctl restart containerd
> systemctl enable containerd
```
#### Install kubernetes
```
> mkdir -p /etc/apt/keyrings
> curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
> echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
> apt-get update
> apt-get install kubelet kubeadm kubectl
> apt-mark hold kubelet kubeadm kubectl
> systemctl enable --now kubelet
```
### Init k8s cluster
#### Init the master node
```
> kubeadm init
```
To start using your cluster, you need to run the following as a regular user:
```
> mkdir -p $HOME/.kube
> cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
> chown $(id -u):$(id -g) $HOME/.kube/config
```
Alternatively, if you are the root user, you can run:
```
> export KUBECONFIG=/etc/kubernetes/admin.conf
```
#### Join worker nodes
```
> kubeadm join 85.190.241.43:6443 --token v0nyg2.lueybwho9co1a61o \
	--discovery-token-ca-cert-hash sha256:721.......................................1ea
```
If you lose this you can generate a new token this way
```
kubeadm token create --print-join-command
```
#### Setup pod networking
Check on master that worker nodes joined the cluster, they may be not ready
```
> kubectl get nodes
```
Install Calico from master node for pod networks
```
> kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```
Now check that all nodes are ready
```
> kubectl get nodes
```
### Configure local kubectl
Copy `~/.kube/config` locally
### Addons
#### Install Helm
```bash
> helm repo add traefik https://traefik.github.io/charts
> helm repo update
> helm install traefik traefik/traefik
```
### Port forward service
```
> kubectl port-forward svc/servicename 8080:80 --namespace namespace
> kubectl port-forward pod/podname 8080:80 --namespace namespace
```
### Ingress
MetaLB
```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.8/config/manifests/metallb-native.yaml
```
Ingress-Nginx
```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```
Apply IP Pool `metalb-ips.yaml`
```
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default
  namespace: metallb-system
spec:
  addresses:
  - 85.190.241.43/32
  - 85.190.241.22/32
  - 156.67.83.70/32
  autoAssign: true
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default
```
run
```
kubectl apply -f metalb-ips.yaml
```
then ingress-nginx-controller should get an external ip
```
kubectl -n ingress-nginx get svc
```
or change ip via
```
kubectl edit svc/ingress-nginx-controller --namespace ingress-nginx
```
#### Cert-Manager
```
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
	--namespace cert-manager --create-namespace \
	--version v1.12.0 \
	--set installCRDs=true
```
Verify cert-manager is running
```
kubectl get pods -n cert-manager
```
Create the `cluster-issuer.yml`
```
# cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```
and apply it
```
kubectl apply -f cluster-issuer.yaml
```
deploy something and check certs
```
kubectl describe certificate whoami-tls
kubectl get cert
```
Example deployment
```
kind: Deployment
apiVersion: apps/v1
metadata:
  name: whoami
  labels:
    app: whoami

spec:
  replicas: 1
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
        - name: whoami
          image: traefik/whoami
          ports:
            - name: web
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: whoami

spec:
  ports:
    - name: web
      port: 80
      targetPort: web

  selector:
    app: whoami
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-whoami
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - whoami.iworkon.it
    secretName: whoami-tls
  rules:
  - host: whoami.iworkon.it
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: whoami
            port:
              number: 80
```
