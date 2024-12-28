---
{
  "title": "Kubernetes Advanced: Network FileSystem and Private Docker Registry",
  "description": "A guide to setting up a Network FileSystem and a Private Docker Registry on a Kubernetes cluster, covering the basics of deployment, configuration, and securing your cluster with NFS and a private Docker registry for a production-ready environment",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/617px-Kubernetes_logo_without_workmark.svg.png",
  "datetime": "2024/12/28 21:45",
  "author": "Mario Baldi"
}
---


### Network FileSystem
#### Master Node
Install NFS
```sh
apt install -y nfs-server
mkdir /data
```

edit `/etc/exports` as follow
```
/data *(rw,no_subtree_check,no_root_squash,crossmnt)
```
this is a little bit unsafe, if you don't manage the firewall do this instead
```
/data n1.iworkon.it(rw,no_subtree_check,no_root_squash,crossmnt) n2.iworkon.it(rw,no_subtree_check,no_root_squash,crossmnt) n3.iworkon.it(rw,no_subtree_check,no_root_squash,crossmnt)
```
then
```sh
systemctl enable --now nfs-server
exportfs -arv
```
#### Worker Node
Install NFS
```sh
apt install -y nfs-common
```
Now you have 3 ways to use nfs
#### Install K8s StorageClass
```sh
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner

helm install nfs-subdir-external-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \
  --create-namespace \
  --namespace nfs-provisioner \
  --set nfs.server=n1.iworkon.it  \
  --set nfs.path=/data
```
#### Connecting to NFS directly with Pod manifest
```
apiVersion: v1
kind: Pod
metadata:
  name: test
  labels:
    app.kubernetes.io/name: alpine
    app.kubernetes.io/part-of: kubernetes-complete-reference
    app.kubernetes.io/created-by: ssbostan
spec:
  containers:
    - name: alpine
      image: alpine:latest
      command:
        - touch
        - /data/test
      volumeMounts:
        - name: nfs-volume
          mountPath: /data
  volumes:
    - name: nfs-volume
      nfs:
        server: node004.b9tcluster.local
        path: /data
        readOnly: no
```
#### Connecting using the PersistentVolume resource
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-volume
  labels:
    storage.k8s.io/name: nfs
    storage.k8s.io/part-of: kubernetes-complete-reference
    storage.k8s.io/created-by: ssbostan
spec:
  accessModes:
    - ReadWriteOnce
    - ReadOnlyMany
    - ReadWriteMany
  capacity:
    storage: 10Gi
  storageClassName: ""
  persistentVolumeReclaimPolicy: Recycle
  volumeMode: Filesystem
  nfs:
    server: node004.b9tcluster.local
    path: /data
    readOnly: no
```
#### Dynamic provisioning using StorageClass
```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-test
  labels:
    storage.k8s.io/name: nfs
    storage.k8s.io/part-of: kubernetes-complete-reference
    storage.k8s.io/created-by: ssbostan
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: nfs-client
  resources:
    requests:
      storage: 1Gi
```

### Private Docker Registry
#### Master Node
Create TLS certificate
```sh
mkdir -p /registry/certs && cd /registry
openssl req -x509 -newkey rsa:4096 -days 3650 -nodes -sha256 -keyout certs/tls.key -out certs/tls.crt -subj "/CN=registry.iworkon.it" -addext "subjectAltName = DNS:registry.iworkon.it"
```
Use htpasswd to add user authentication to the docker registry
```sh
mkdir auth
docker run --rm --entrypoint htpasswd registry:2.6.2 -Bbn iworkon.it PASSWORD > auth/htpasswd
```
Create a secret to mount the certificates in the pods or container images
```sh
kubectl create namespace docker-registry
kubectl create secret tls registry-certs --cert=/registry/certs/tls.crt --key=/registry/certs/tls.key -n docker-registry
kubectl create secret generic registry-auth --from-file=/registry/auth/htpasswd -n docker-registry
```
Create a persistent volume claim for the registry `registry-volume.yaml`
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: docker-repo-pv
spec:
  capacity:
    storage: 200Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /tmp/repository
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: docker-repo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 200Gi
```
Then create the PV and PVC
```sh
kubectl create -f registry-volume.yaml -n docker-registry
```
Now let's create the registry pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docker-registry-pod
  labels:
    app: registry
spec:
  containers:
    - name: registry
      image: registry:2.6.2
      volumeMounts:
        - name: repo-vol
          mountPath: "/var/lib/registry"
        - name: certs-vol
          mountPath: "/certs"
          readOnly: true
        - name: auth-vol
          mountPath: "/auth"
          readOnly: true
      env:
        - name: REGISTRY_AUTH
          value: "htpasswd"
        - name: REGISTRY_AUTH_HTPASSWD_REALM
          value: "Registry Realm"
        - name: REGISTRY_AUTH_HTPASSWD_PATH
          value: "/auth/htpasswd"
        - name: REGISTRY_HTTP_TLS_CERTIFICATE
          value: "/certs/tls.crt"
        - name: REGISTRY_HTTP_TLS_KEY
          value: "/certs/tls.key"
  volumes:
    - name: repo-vol
      persistentVolumeClaim:
        claimName: docker-repo-pvc
    - name: certs-vol
      secret:
        secretName: registry-certs
    - name: auth-vol
      secret:
        secretName: registry-auth
---
apiVersion: v1
kind: Service
metadata:
  name: docker-registry
spec:
  selector:
    app: registry
  ports:
    - port: 5000
      targetPort: 5000
```
Apply
```sh
kubectl apply -f registry-service.yaml -n docker-registry
```
#### Configure nodes to access registry
Get the  service internal IP Address with
```sh
kubectl get all -n docker-registry
```
Add to `/etc/hosts`
```plaintext
123.123.123.123 registry.iworkon.it
```
And copy certificates on nodes
```sh
rm -rf /etc/docker/certs.d/registry.iworkon.it:5000
mkdir -p /etc/docker/certs.d/registry.iworkon.it:5000
scp root@n1.iworkon.it:/registry/certs/tls.crt /etc/docker/certs.d/registry.iworkon.it:5000/
```
#### Test Private Registry login from Nodes
```sh
docker login registry.iworkon.it:5000 -u iworkon.it -p PASSWORD
```
#### Test Locally via kube proxy / port forward
set `/etc/hosts` file pointing `localhost` for the registry DNS
```sh
127.0.0.1 registry.iworkon.it
```
then copy certificates locally
```sh
rm -rf /etc/docker/certs.d/registry.iworkon.it:5000
mkdir -p /etc/docker/certs.d/registry.iworkon.it:5000
scp root@n1.iworkon.it:/registry/certs/tls.crt /etc/docker/certs.d/registry.iworkon.it:5000/
```
Then start kubectl port forwarding
```sh
kubectl port-forward --namespace docker-registry svc/docker-registry 5000:5000
```
And finally login in the docker registry
```sh
docker login registry.iworkon.it:5000 -u iworkon.it -p PASSWORD
```
