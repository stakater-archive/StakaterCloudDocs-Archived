# OpenShift API Server and ETCD

The OpenShift API server and etcd data store are the most sensitive components that run in your OpenShift master. If an unauthorized user or system gets access to your OpenShift API server, the user or system can change settings, manipulate, or take control of your cluster, which puts your cluster at risk for malicious attacks.

To protect your OpenShift API server and etcd data store, you must secure and limit the access to your OpenShift API server for both human users and Kubernetes service accounts (machine users).

### How is access to my OpenShift API server granted?

By default, Kubernetes requires every request to go through several stages before access to the API server is granted:

<ol><li><strong>Authentication: </strong>Validates the identity of a registered user or service account.</li><li><strong>Authorization: </strong>Limits the permissions of authenticated users and service accounts to ensure that they can access and operate only the cluster components that you want them to.</li><li><strong>Admission control: </strong>Validates or mutates requests before they are processed by the OpenShift API server. Many Kubernetes features require admission controllers in order to properly function.</li></ol>

### What does SRO do to secure my OpenShift API server and etcd data store?

The following image shows the default cluster security settings that address authentication, authorization, admission control, and secure connectivity between the Kubernetes master and worker nodes.

TODO - add image

<table>
<caption>OpenShift API Server and ETCD Security</caption>
  <thead>
  <th>Security feature</th>
  <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>Fully managed and dedicated OpenShift master</td>
      <td>Every cluster in SRO is controlled by a dedicated OpenShift master that is managed by Stakater. The OpenShift master is set up with the following dedicated components that are not shared with other customers.
        <ul><li><strong>ETCD data store:</strong> Stores all Kubernetes resources of a cluster, such as `Services`, `Deployments`, and `Pods`. Kubernetes `ConfigMaps` and `Secrets` are app data that is stored as key value pairs so that they can be used by an app that runs in a pod. Data in etcd is stored on the local disk of the OpenShift master and is regularly backed up. Data is encrypted during transit and at rest.</li>
          <li><strong>openshift-api:</strong> Serves as the main entry point for all cluster management requests from the worker node to the OpenShift master. The API server validates and processes requests that change the state of cluster resources, such as pods or services, and stores this state in the etcd data store.</li>
          <li><strong>openshift-controller:</strong> Watches for newly created pods and decides where to deploy them based on capacity, performance needs, policy constraints, anti-affinity specifications, and workload requirements. If no worker node can be found that matches the requirements, the pod is not deployed in the cluster. The controller also watches the state of cluster resources, such as replica sets. When the state of a resource changes, for example if a pod in a replica set goes down, the controller manager initiates correcting actions to achieve the required state. </li>
            <li><strong>cloud-controller-manager:</strong> The cloud controller manager manages cloud provider-specific components such as the cloud load balancer. </li>
  </tbody>
</table>
