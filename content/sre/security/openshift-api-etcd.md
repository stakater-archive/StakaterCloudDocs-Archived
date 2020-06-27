# OpenShift API Server and ETCD

The OpenShift API server and etcd data store are the most sensitive components that run in your OpenShift master. If an unauthorized user or system gets access to your OpenShift API server, the user or system can change settings, manipulate, or take control of your cluster, which puts your cluster at risk for malicious attacks.

To protect your OpenShift API server and etcd data store, you must secure and limit the access to your OpenShift API server for both human users and Kubernetes service accounts (machine users).

### How is access to my OpenShift API server granted?

By default, Kubernetes requires every request to go through several stages before access to the API server is granted:

<ol><li><strong>Authentication: </strong>Validates the identity of a registered user or service account.</li><li><strong>Authorization: </strong>Limits the permissions of authenticated users and service accounts to ensure that they can access and operate only the cluster components that you want them to.</li><li><strong>Admission control: </strong>Validates or mutates requests before they are processed by the OpenShift API server. Many Kubernetes features require admission controllers in order to properly function.</li></ol>
