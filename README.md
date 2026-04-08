# Node.js + Kubernetes + Prometheus + Grafana Setup

This guide helps you:
- Build a Node.js app
- Deploy it on Kubernetes
- Monitor using Prometheus
- Visualize using Grafana

--------------------------------------------------

# 1. Node.js Setup

npm init -y

npm install express

npm install -D typescript ts-node-dev @types/node @types/express

npx tsc --init

Update tsconfig.json:

{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}

Add scripts in package.json:

"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}

--------------------------------------------------

# 2. Add Monitoring

npm install prom-client

--------------------------------------------------

# 3. Kubernetes Setup

kubectl apply -f deployment.yaml

kubectl apply -f service.yaml

--------------------------------------------------

# 4. Install Prometheus

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

helm install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace --set server.service.type=NodePort --set server.service.nodePort=30090 --set alertmanager.enabled=false

kubectl get all -n monitoring

--------------------------------------------------

# 5. Configure Prometheus

kubectl edit configmap prometheus-server -n monitoring

Add:

scrape_configs:
  - job_name: 'node-monitoring-k8s'
    static_configs:
      - targets: ['node-monitoring-k8s.default.svc.cluster.local:3001']

kubectl rollout restart deployment prometheus-server -n monitoring

kubectl port-forward svc/prometheus-server 9090:80 -n monitoring

Open:
http://localhost:9090

--------------------------------------------------

# 6. Install Grafana

helm repo add grafana https://grafana.github.io/helm-charts

helm repo update

helm install grafana grafana/grafana --namespace monitoring --set server.service.type=NodePort --set server.service.nodePort=30090 --set persistence.enabled=false

kubectl get all -n monitoring

--------------------------------------------------

# Get Grafana Password (PowerShell)

[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((kubectl get secret grafana -n monitoring -o jsonpath="{.data.admin-password}")))

Login:
username: admin
password: (use above command output)

--------------------------------------------------

# Access Grafana

kubectl port-forward svc/grafana 3000:80 -n monitoring

Open:
http://localhost:3000

--------------------------------------------------

# Import Dashboard

Go to Grafana → Import Dashboard

Use ID:
1860

Select Data Source:
Prometheus

--------------------------------------------------

# Generate Traffic (PowerShell)

while ($true) {
  Invoke-WebRequest http://127.0.0.1:8080
  Start-Sleep -Milliseconds 500
}

--------------------------------------------------

# Done

You now have:
- Node.js app on Kubernetes
- Prometheus monitoring
- Grafana dashboards