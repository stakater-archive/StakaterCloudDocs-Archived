# Sealed Secrets

## Overview

[SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) controller solves the problem of storing kubernetes secret data securely by encrypting the configurations. It can only be decrypted by sealed secret controller running in cluster.

## Architecutre

SealedSecrets is composed of two components:

* `Controller`: A cluster-side component for data decryption.
* `Kubeseal`: A client-side utility for data encryption. It uses asymmetric cryptography methods for data encryption & kubeconfig to communicate with the cluster.

## Pre-Requisites

You need to have `kubeseal` installed on your local machine. You can check the latest release at [Sealed Secret Releases](https://github.com/bitnami-labs/sealed-secrets/releases) and install latest.

## Usage

### Create K8s secret

Lets create a sample k8s secret that will be used for MySQL:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secrets
  namespace: gabbar-dev
data:
  USERNAME: cm9vdA==                   # <- base64 encoded root
  USER_PASSWORD: QG15c3FscGFzc3dvcmQ=   # <- base64 encoded @mysqlpassword
  DATABASE: dGVzdC1kYXRhYmFzZQ==        # -< base64 encoded test-database
```

save it in a file named `secret-mysql.yaml`. This file should not be pushed to git as it is easily decodable.

Now install kubeseal and your kubeconfig should be pointing to Openshift cluster.

As sealed secrets controller is running in `stakater-sealed-secrets` namespace and sealed secrets service name is `sealed-secrets`, so you need to run

```sh
kubeseal --controller-name=sealed-secrets --controller-namespace=stakater-sealed-secrets --format yaml  < SECRET_FILE 
```

where:

- SECRET_FILE: the name of the yaml file containing the k8s secret
- SEALED_SECRET: the name of the yaml file that will contain the sealed secret

e.g. to encrypt the above `secret-mysql.yaml` file, you need to run

## For Dynamic Test Environment

To use secrets in dynamic test environments(for PR environment),you need to seal secret with ```cluster-wide``` scope so that it can be decrypted by any namespace. since PR namespaces are dynamic and tied to the lifecycle of PR,```cluster-wide``` scope make sure that it can be decrypted by dynamic namespaces. Following are the steps to create sealedsecrets in DTE:


```sh
kubeseal --controller-name=sealed-secrets --controller-namespace=stakater-sealed-secrets --format yaml --scope cluster-wide < secret-mysql.yaml 
```

Above command will generate sealedsecret resource output . for example 
```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  annotations:
    sealedsecrets.bitnami.com/cluster-wide: "true"
  creationTimestamp: null
  name: mysql-secrets
spec:
  encryptedData:
    DATABASE: AgBLmwvAwbVndSAxlC2HD/PiFMr2CNH/6uoxlP/FlT9fSARSTnJg2REqWM9LVT4OqvGiNDpnlSFOyOOnqQxfKAvpce5pilLQCSmHmCLei0m123CDebNaN8pqhl/BCBZ8VsHXAtoEbnY6aXwOnAV5uL55b15V7DQFI6J+72vENfs2nm/qDeQKlqyfALALpwfmvkiIjIvA9tKzfK6qpeF3ZGp5Lx84hd7C3+xAAKiaOTUd0+RX2xBjhRQ7T6Rp5OnOsyjO10IKL4En+Z4ffmF69F7E7TaB87gEVJqSaP0T7mg7Ecjn5OD9cauJPPHg48qN2VQDctFRY2rOzOGD8oq18aptD88JWpqtS3RFqKymn5ChoT6dSUAeXXJfXqQXlYnMWXR5dNscwrYUx56u3VVmxlhcSq8gls/u2GuO8YHk/zAbZEwiDlL6TgXnp6PYQKv05oEOojc8FZ+OpvFNGH54mMCmpNdSxgnW78loC408sdS2rscs/+J86xXh4chN2j4H1Gw1KNz8ERbJ9mzlYO0C0BP42UWuwSuqzji4njl0fQ6Dw1yURQ64EDCz3jibMMdq8jyP+219klqzdq8SVOIfKB2jfTNqdlkhEI0NZcSeBYiREdJR0amBiINdbLg+BTujz/vz956Dbm3D7mXeGy0DW/rQdY79tiH5NjUK1B5iKe34+OSlkf0TbIvuGpCmWM26glkU7sU6yPPedAYeIBGR
    USER_PASSWORD: AgCkxffaVsKg4WJzFjS1Tl6VxN9hi384bqaMFEUJeihID7ZmpXZ2F6YGHei/ovMzfws9xUPRM/d7FAio6M2gMl13MC0V8ZLJ/Q83kWdTtOXapJMwA4VzkarGcalPXfSOBa+DbfJSaynWHwlgWKwdcUuVzX0tvqhEJTMUA30k+mIG2fltLYkChaFxMmpvz/3LZAvfNPScE0SgzsZvToOLqDqoKHoVTsVLnI4LlADFU+el9cXDfEPFeqqIyV+nQFvdBwdbo3SMK4VcfpeTqfgH18ZwZrRetJU0/JfglrthUxmY7C8vw6FLBGOxE8WsAk93fFLl8E8PLrTQv2n4sXEXatCAm+4czkO5RCLsW6vlMy8KDmzEgB7RtFcLvn790e9zVMrvocadg7d8hQjmjyCmp/ZyvfeD68lau1IjOIM3dFvzGsFsqeAwRNPQPCRw4fd7pKlp+AQMSRUUYric8AEV562oETP/+oi+I0lcfwHid77RovsUwIqOQj2rTkN/8VQpDLUqO1qx7RRVUWhg1KjRPEzkuu36XznUk3TvlQqQIzbUgqwgVKlA1Fb7UL5bEwuCTn8w715Gy2mbL9UJOZEi4eMRv7Zh9oX/tpfU4mxY19slV7QNHwFhJzS7rgDBkxTzxafAKIGim3hXbT2H2f0+Bl8JuBf/jpAIZwK9EwR1UYLvPEhdOUi0xDMi4cPI7ubHiqxId7n+Gp+w+gB40VgqvQ==
    USERNAME: AgAkGib0aXLAXjJ9CIIg7HG56TjVU6NqZ8DKfFuMItupYJ6iacQ3aIOETpLKTUBsTFXt4MLHG0SJYDVBmTQ7xinjwbz0iwb6jtTLoI4wlSzoVByTfZMqkvMmqLSOdKXatzfKQl3VwpO/qJTwPV9iQotPvzpD+tP5bwrZ7/g06kivhBM3A+gj63+j14MGQYAnwoV2OVSsj1aCNi2cR8Og0GWlwvO6bsO1xljud9yy271hVMu/eBToLS/ocu/+m00p/ey7Sdi4J4s8R8n8OqSiYD+QgNMm99dC3m/BeSAXe7hCna0OnCX9aMMGhNzkD7fD8FX1xB8nN3pp+zNFfVxd0bT0e+CkZREhGtxil8Q9WOv/bmguinkTgBP+rcCtPUu6AdIxKH3VTPcmoqDCdI7DxzoJ3daGTzruTYD4WATuoYGgeK6nPsQPDutWLqNCfiTW1PvUyfDSqpyaSJp+exc2YqlbK+QVZMRP9gSM91zfHSM2PkfuqQPAA2+wlgjvyZ44akTvpVnDplxMXvMfJDC3e8bjyHYz1CGYcSeE9iO/OyhK1N+6HWVwHEGwmkboA/b9HnDz/dhTpfiZx2Szmmf1XBUPRshVpArlzrdOlQTXXYvf8FfBBf0whTT6lCLJqs7JORaxYphU+tmgjCkzUfhKxjPYYrhH4uryizQWr+Wu/Y3mPe23HQ88b/P7WV6qkv1X1LHWXHZK
  template:
    metadata:
      annotations:
        sealedsecrets.bitnami.com/cluster-wide: "true"
      creationTimestamp: null
      name: mysql-secrets
```
you need to add sealedsecret block in helm values present in `deploy/values.yaml` in your application repository and copy paste key values from generated output
```yaml
  sealedSecret:
    enabled: true
    annotations:
      sealedsecrets.bitnami.com/cluster-wide: "true"
    files:
    - name: mysql-secrets
      encryptedData:
         DATABASE: AgBLmwvAwbVndSAxlC2HD/PiFMr2CNH/6uoxlP/FlT9fSARSTnJg2REqWM9LVT4OqvGiNDpn lSFOyOOnqQxfKAvpce5pilLQCSmHmCLei0m123CDebNaN8pqhl/BCBZ8VsHXAtoE bnY6aXwOnAV5uL55b15V7DQFI6J+72vENfs2nm/qDeQKlqyfALALpw fmvkiIjIvA9tKzfK6qpeF3ZGp5Lx84hd7C3+xAAKiaOTUd0+RX2xBjhRQ7T6Rp5OnOsyjO10IKL4En+Z4ffmF69F7E7TaB87gEVJqSaP0T7mg7Ecjn5OD9cauJPPHg48qN2VQDctFRY2rOzOGD8oq18aptD88JWpqtS3RFqKymn5ChoT6dSUAeXXJfXqQXlYnMWXR5dNscwrYUx56u3VVmxlhcSq8gls/u2GuO8YHk/zAbZEwiDlL6TgXnp6PYQKv05oEOojc8FZ+OpvFNGH54mMCmpNdSxgnW78loC408sdS2rscs/+J86xXh4chN2j4H1Gw1KNz8ERbJ9mzlYO0C0BP42UWuwSuqzji4njl0fQ6Dw1yURQ64EDCz3jibMMdq8jyP+219klqzdq8SVOIfKB2jfTNqdlkhEI0NZcSeBYiREdJR0amBiINdbLg+BTujz/vz956Dbm3D7mXeGy0DW/rQdY79tiH5NjUK1B5iKe34+OSlkf0TbIvuGpCmWM26glkU7sU6yPPedAYeIBGR
         USER_PASSWORD: AgCkxffaVsKg4WJzFjS1Tl6VxN9hi384bqaMFEUJeihID7ZmpXZ2F6YGHei/ovMzfws9xUPRM/d7FAio6M2gMl13MC0V8ZLJ/Q83kWdTtOXapJMwA4VzkarGcalPXfSOBa    +DbfJSaynWHwlgWKwdcUuVzX0tvqhEJTMUA30k+mIG2fltLYkChaFxMmpvz/3LZAvfNPScE0SgzsZvToOLqDqoKHoVTsVLnI4LlADFU+el9cXDfEPFeqqIyV     +nQFvdBwdbo3SMK4VcfpeTqfgH18ZwZrRetJU0/JfglrthUxmY7C8vw6FLBGOxE8WsAk93fFLl8E8PLrTQv2n4sXEXatCAm     +4czkO5RCLsW6vlMy8KDmzEgB7RtFcLvn790e9zVMrvocadg7d8hQjmjyCmp/ZyvfeD68lau1IjOIM3dFvzGsFsqeAwRNPQPCRw4fd7pKlp+AQMSRUUYric8AEV562oETP/+oi     +I0lcfwHid77RovsUwIqOQj2rTkN/8VQpDLUqO1qx7RRVUWhg1KjRPEzkuu36XznUk3TvlQqQIzbUgqwgVKlA1Fb7UL5bEwuCTn8w715Gy2mbL9UJOZEi4eMRv7Zh9oX/     tpfU4mxY19slV7QNHwFhJzS7rgDBkxTzxafAKIGim3hXbT2H2f0+Bl8JuBf/jpAIZwK9EwR1UYLvPEhdOUi0xDMi4cPI7ubHiqxId7n+Gp+w+gB40VgqvQ==
         USERNAME: AgAkGib0aXLAXjJ9CIIg7HG56TjVU6NqZ8DKfFuMItupYJ6iacQ3aIOETpLKTUBsTFXt4MLHG0SJYDVBmTQ7xinjwbz0iwb6jtTLoI4wlSzoVByTfZMqkvMmqLSOdKXatzfKQl3VwpO/     qJTwPV9iQotPvzpD+tP5bwrZ7/g06kivhBM3A+gj63+j14MGQYAnwoV2OVSsj1aCNi2cR8Og0GWlwvO6bsO1xljud9yy271hVMu/eBToLS/ocu/+m00p/ey7Sdi4J4s8R8n8OqSiYD+QgNMm99dC3m/ BeSAXe7hCna0OnCX9aMMGhNzkD7fD8FX1xB8nN3pp+zNFfVxd0bT0e+CkZREhGtxil8Q9WOv/bmguinkTgBP     +rcCtPUu6AdIxKH3VTPcmoqDCdI7DxzoJ3daGTzruTYD4WATuoYGgeK6nPsQPDutWLqNCfiTW1PvUyfDSqpyaSJp+exc2YqlbK+QVZMRP9gSM91zfHSM2PkfuqQPAA2     +wlgjvyZ44akTvpVnDplxMXvMfJDC3e8bjyHYz1CGYcSeE9iO/OyhK1N+6HWVwHEGwmkboA/b9HnDz/dhTpfiZx2Szmmf1XBUPRshVpArlzrdOlQTXXYvf8FfBBf0whTT6lCLJqs7JORaxYphU   +tmgjCkzUfhKxjPYYrhH4uryizQWr+Wu/Y3mPe23HQ88b/P7WV6qkv1X1LHWXHZK 
```

## For Dev Environment:

To generate sealedsecrets for dev environment, you need to run the following command

```sh
kubeseal --controller-name=sealed-secrets --controller-namespace=stakater-sealed-secrets --format yaml  < secret-mysql.yaml 
```
Above command will generate sealedsecret resource output . for example 

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  creationTimestamp: null
  name: mysql-secrets
  namespace: gabbar-dev
spec:
  encryptedData:
    DATABASE: AgBLmwvAwbVndSAxlC2HD/PiFMr2CNH/6uoxlP/FlT9fSARSTnJg2REqWM9LVT4OqvGiNDpnlSFOyOOnqQxfKAvpce5pilLQCSmHmCLei0m123CDebNaN8pqhl/BCBZ8VsHXAtoEbnY6aXwOnAV5uL55b15V7DQFI6J+72vENfs2nm/qDeQKlqyfALALpwfmvkiIjIvA9tKzfK6qpeF3ZGp5Lx84hd7C3+xAAKiaOTUd0+RX2xBjhRQ7T6Rp5OnOsyjO10IKL4En+Z4ffmF69F7E7TaB87gEVJqSaP0T7mg7Ecjn5OD9cauJPPHg48qN2VQDctFRY2rOzOGD8oq18aptD88JWpqtS3RFqKymn5ChoT6dSUAeXXJfXqQXlYnMWXR5dNscwrYUx56u3VVmxlhcSq8gls/u2GuO8YHk/zAbZEwiDlL6TgXnp6PYQKv05oEOojc8FZ+OpvFNGH54mMCmpNdSxgnW78loC408sdS2rscs/+J86xXh4chN2j4H1Gw1KNz8ERbJ9mzlYO0C0BP42UWuwSuqzji4njl0fQ6Dw1yURQ64EDCz3jibMMdq8jyP+219klqzdq8SVOIfKB2jfTNqdlkhEI0NZcSeBYiREdJR0amBiINdbLg+BTujz/vz956Dbm3D7mXeGy0DW/rQdY79tiH5NjUK1B5iKe34+OSlkf0TbIvuGpCmWM26glkU7sU6yPPedAYeIBGR
    USER_PASSWORD: AgCkxffaVsKg4WJzFjS1Tl6VxN9hi384bqaMFEUJeihID7ZmpXZ2F6YGHei/ovMzfws9xUPRM/d7FAio6M2gMl13MC0V8ZLJ/Q83kWdTtOXapJMwA4VzkarGcalPXfSOBa+DbfJSaynWHwlgWKwdcUuVzX0tvqhEJTMUA30k+mIG2fltLYkChaFxMmpvz/3LZAvfNPScE0SgzsZvToOLqDqoKHoVTsVLnI4LlADFU+el9cXDfEPFeqqIyV+nQFvdBwdbo3SMK4VcfpeTqfgH18ZwZrRetJU0/JfglrthUxmY7C8vw6FLBGOxE8WsAk93fFLl8E8PLrTQv2n4sXEXatCAm+4czkO5RCLsW6vlMy8KDmzEgB7RtFcLvn790e9zVMrvocadg7d8hQjmjyCmp/ZyvfeD68lau1IjOIM3dFvzGsFsqeAwRNPQPCRw4fd7pKlp+AQMSRUUYric8AEV562oETP/+oi+I0lcfwHid77RovsUwIqOQj2rTkN/8VQpDLUqO1qx7RRVUWhg1KjRPEzkuu36XznUk3TvlQqQIzbUgqwgVKlA1Fb7UL5bEwuCTn8w715Gy2mbL9UJOZEi4eMRv7Zh9oX/tpfU4mxY19slV7QNHwFhJzS7rgDBkxTzxafAKIGim3hXbT2H2f0+Bl8JuBf/jpAIZwK9EwR1UYLvPEhdOUi0xDMi4cPI7ubHiqxId7n+Gp+w+gB40VgqvQ==
    USERNAME: AgAkGib0aXLAXjJ9CIIg7HG56TjVU6NqZ8DKfFuMItupYJ6iacQ3aIOETpLKTUBsTFXt4MLHG0SJYDVBmTQ7xinjwbz0iwb6jtTLoI4wlSzoVByTfZMqkvMmqLSOdKXatzfKQl3VwpO/qJTwPV9iQotPvzpD+tP5bwrZ7/g06kivhBM3A+gj63+j14MGQYAnwoV2OVSsj1aCNi2cR8Og0GWlwvO6bsO1xljud9yy271hVMu/eBToLS/ocu/+m00p/ey7Sdi4J4s8R8n8OqSiYD+QgNMm99dC3m/BeSAXe7hCna0OnCX9aMMGhNzkD7fD8FX1xB8nN3pp+zNFfVxd0bT0e+CkZREhGtxil8Q9WOv/bmguinkTgBP+rcCtPUu6AdIxKH3VTPcmoqDCdI7DxzoJ3daGTzruTYD4WATuoYGgeK6nPsQPDutWLqNCfiTW1PvUyfDSqpyaSJp+exc2YqlbK+QVZMRP9gSM91zfHSM2PkfuqQPAA2+wlgjvyZ44akTvpVnDplxMXvMfJDC3e8bjyHYz1CGYcSeE9iO/OyhK1N+6HWVwHEGwmkboA/b9HnDz/dhTpfiZx2Szmmf1XBUPRshVpArlzrdOlQTXXYvf8FfBBf0whTT6lCLJqs7JORaxYphU+tmgjCkzUfhKxjPYYrhH4uryizQWr+Wu/Y3mPe23HQ88b/P7WV6qkv1X1LHWXHZK
  template:
    metadata:
      creationTimestamp: null
      name: mysql-secrets
      namespace: gabbar-dev
```

you need to add sealedsecret block in helm values present in `<tenant>/<application>/<env>/values.yaml` in gitops-config repository and copy paste key values from generated output

```yaml
  sealedSecret:
    enabled: true
    annotations: ""
    files:
    - name: mysql-secrets
      encryptedData:
         DATABASE: AgBLmwvAwbVndSAxlC2HD/PiFMr2CNH/6uoxlP/FlT9fSARSTnJg2REqWM9LVT4OqvGiNDpn lSFOyOOnqQxfKAvpce5pilLQCSmHmCLei0m123CDebNaN8pqhl/BCBZ8VsHXAtoE bnY6aXwOnAV5uL55b15V7DQFI6J+72vENfs2nm/qDeQKlqyfALALpw fmvkiIjIvA9tKzfK6qpeF3ZGp5Lx84hd7C3+xAAKiaOTUd0+RX2xBjhRQ7T6Rp5OnOsyjO10IKL4En+Z4ffmF69F7E7TaB87gEVJqSaP0T7mg7Ecjn5OD9cauJPPHg48qN2VQDctFRY2rOzOGD8oq18aptD88JWpqtS3RFqKymn5ChoT6dSUAeXXJfXqQXlYnMWXR5dNscwrYUx56u3VVmxlhcSq8gls/u2GuO8YHk/zAbZEwiDlL6TgXnp6PYQKv05oEOojc8FZ+OpvFNGH54mMCmpNdSxgnW78loC408sdS2rscs/+J86xXh4chN2j4H1Gw1KNz8ERbJ9mzlYO0C0BP42UWuwSuqzji4njl0fQ6Dw1yURQ64EDCz3jibMMdq8jyP+219klqzdq8SVOIfKB2jfTNqdlkhEI0NZcSeBYiREdJR0amBiINdbLg+BTujz/vz956Dbm3D7mXeGy0DW/rQdY79tiH5NjUK1B5iKe34+OSlkf0TbIvuGpCmWM26glkU7sU6yPPedAYeIBGR
         USER_PASSWORD: AgCkxffaVsKg4WJzFjS1Tl6VxN9hi384bqaMFEUJeihID7ZmpXZ2F6YGHei/ovMzfws9xUPRM/d7FAio6M2gMl13MC0V8ZLJ/Q83kWdTtOXapJMwA4VzkarGcalPXfSOBa    +DbfJSaynWHwlgWKwdcUuVzX0tvqhEJTMUA30k+mIG2fltLYkChaFxMmpvz/3LZAvfNPScE0SgzsZvToOLqDqoKHoVTsVLnI4LlADFU+el9cXDfEPFeqqIyV     +nQFvdBwdbo3SMK4VcfpeTqfgH18ZwZrRetJU0/JfglrthUxmY7C8vw6FLBGOxE8WsAk93fFLl8E8PLrTQv2n4sXEXatCAm     +4czkO5RCLsW6vlMy8KDmzEgB7RtFcLvn790e9zVMrvocadg7d8hQjmjyCmp/ZyvfeD68lau1IjOIM3dFvzGsFsqeAwRNPQPCRw4fd7pKlp+AQMSRUUYric8AEV562oETP/+oi     +I0lcfwHid77RovsUwIqOQj2rTkN/8VQpDLUqO1qx7RRVUWhg1KjRPEzkuu36XznUk3TvlQqQIzbUgqwgVKlA1Fb7UL5bEwuCTn8w715Gy2mbL9UJOZEi4eMRv7Zh9oX/     tpfU4mxY19slV7QNHwFhJzS7rgDBkxTzxafAKIGim3hXbT2H2f0+Bl8JuBf/jpAIZwK9EwR1UYLvPEhdOUi0xDMi4cPI7ubHiqxId7n+Gp+w+gB40VgqvQ==
         USERNAME: AgAkGib0aXLAXjJ9CIIg7HG56TjVU6NqZ8DKfFuMItupYJ6iacQ3aIOETpLKTUBsTFXt4MLHG0SJYDVBmTQ7xinjwbz0iwb6jtTLoI4wlSzoVByTfZMqkvMmqLSOdKXatzfKQl3VwpO/     qJTwPV9iQotPvzpD+tP5bwrZ7/g06kivhBM3A+gj63+j14MGQYAnwoV2OVSsj1aCNi2cR8Og0GWlwvO6bsO1xljud9yy271hVMu/eBToLS/ocu/+m00p/ey7Sdi4J4s8R8n8OqSiYD+QgNMm99dC3m/ BeSAXe7hCna0OnCX9aMMGhNzkD7fD8FX1xB8nN3pp+zNFfVxd0bT0e+CkZREhGtxil8Q9WOv/bmguinkTgBP     +rcCtPUu6AdIxKH3VTPcmoqDCdI7DxzoJ3daGTzruTYD4WATuoYGgeK6nPsQPDutWLqNCfiTW1PvUyfDSqpyaSJp+exc2YqlbK+QVZMRP9gSM91zfHSM2PkfuqQPAA2     +wlgjvyZ44akTvpVnDplxMXvMfJDC3e8bjyHYz1CGYcSeE9iO/OyhK1N+6HWVwHEGwmkboA/b9HnDz/dhTpfiZx2Szmmf1XBUPRshVpArlzrdOlQTXXYvf8FfBBf0whTT6lCLJqs7JORaxYphU   +tmgjCkzUfhKxjPYYrhH4uryizQWr+Wu/Y3mPe23HQ88b/P7WV6qkv1X1LHWXHZK 
```

### Consuming Secret in Application

#### Using Environment Variables

When consuming the secret in application using environment variable, you would need to add `env:` field in values file, e.g. if you want to use env vars from above mysql secret, in values file, replace

```yaml
  env: []
```

to

```yaml
  env:
  - name: MYSQL_USERNAME
    valueFrom:
      secretKeyRef:
        name: mysql-secrets
        key: USERNAME
  - name: MYSQL_PASSWORD
    valueFrom:
      secretKeyRef:
        name: mysql-secrets
        key: USER_PASSWORD
```

## References

For more details, you can look at [Stakater Cloud Docs - Sealed Secrets](https://stakaterclouddocs.stakater.com/content/sre/secrets/sealed-secrets.html)
