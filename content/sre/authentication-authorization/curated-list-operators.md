# Curated List of Operators for SAAP Roles

SAAP cluster admins cannot install cluster-wide operator from Operator Hub, allowed operators to install are maintained as a curated list by SAAP. This restriction is added as the Operator Lifecycle Manager (OLM) runs with cluster-admin privileges. By default, Operator authors can specify any set of permissions in the cluster service version (CSV) and OLM will consequently grant it to the Operator.

- certificates.certmanager.k8s.io
- issuers.certmanager.k8s.io
- clusterissuers.certmanager.k8s.io
- orders.certmanager.k8s.io
- challenges.certmanager.k8s.io
- anchoreengines.anchore.com
- atlasmaps.atlasmap.io
- builds.camel.apache.org
- camelcatalogs.camel.apache.org
- integrations.camel.apache.org
- integrationcontexts.camel.apache.org
- integrationplatforms.camel.apache.org
- couchbaseclusters.couchbase.com
- openliberties.openliberty.io
- opsmxspinnakeroperators.charts.helm.k8s.io
- seldondeployments.machinelearning.seldon.io
- spinnakeroperators.charts.helm.k8s.io=
- twistlockconsoles.charts.helm.k8s.io
- tekton.dev

## How to request a new operator to be added to Curated List 
If the user requires to install an operator that is not mentioned in the above list , the user can raise a request with Stakater Support.The Stakater team will review and add it to the allowed list

## Items to be provided to Stakater Support
- Operator Name 
- Official Operator repository 
- Detailed description of use case
