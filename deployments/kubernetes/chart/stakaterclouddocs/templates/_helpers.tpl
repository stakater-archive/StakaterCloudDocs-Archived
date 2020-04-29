{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "stakater-cloud-docs.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "stakater-cloud-docs.labels.selector" -}}
app: {{ template "stakater-cloud-docs.name" . }}
group: {{ .Values.stakaterclouddocs.labels.group }}
provider: {{ .Values.stakaterclouddocs.labels.provider }}
{{- end -}}

{{- define "stakater-cloud-docs.labels.stakater" -}}
{{ template "stakater-cloud-docs.labels.selector" . }}
version: "{{ .Values.stakaterclouddocs.labels.version }}"
{{- end -}}

{{- define "stakater-cloud-docs.labels.chart" -}}
chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
release: {{ .Release.Name | quote }}
heritage: {{ .Release.Service | quote }}
{{- end -}}
