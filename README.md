# Node.js + Docker + Kubernetes + Prometheus + Grafana Setup

This project demonstrates a complete DevOps workflow:

- Build a Node.js application
- Containerize using Docker
- Deploy on Kubernetes (Minikube)
- Monitor using Prometheus
- Visualize metrics using Grafana

---

# Project Overview

This project helps you understand how to move from development to deployment and monitoring in a real-world setup.

Flow:

Code → Docker → Kubernetes → Prometheus → Grafana

---

# 1. Node.js Setup

Initialize project:

```bash
npm init -y
```

Install dependencies:

```bash
npm install express
npm install -D typescript ts-node-dev @types/node @types/express
```

Initialize TypeScript:

```bash
npx tsc --init
```

Update `tsconfig.json`:

```json
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
```

Update `package.json` scripts:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

---

# 2. Add Monitoring (Prometheus Client)

Install:

```bash
npm install prom-client
```

This will expose metrics from your Node.js app.

---

# 3. Kubernetes Deployment

Apply deployment and service:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

# 4. Install Prometheus (Helm)

Add repo:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Install Prometheus:

```bash
helm install prometheus prometheus-community/prometheus \
--namespace monitoring \
--create-namespace \
--set server.service.type=NodePort \
--set server.service.nodePort=30090 \
--set alertmanager.enabled=false
```

Check resources:

```bash
kubectl get all -n monitoring
```

---

# 5. Configure Prometheus

Edit config:

```bash
kubectl edit configmap prometheus-server -n monitoring
```

Add scrape config:

```yaml
scrape_configs:
  - job_name: "node-monitoring-k8s"
    static_configs:
      - targets: ["node-monitoring-k8s.default.svc.cluster.local:3001"]
```

Restart Prometheus:

```bash
kubectl rollout restart deployment prometheus-server -n monitoring
```

Port forward:

```bash
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
```

Open in browser:

```
http://localhost:9090
```

---

# 6. Install Grafana

Add repo:

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

Install Grafana:

```bash
helm install grafana grafana/grafana \
--namespace monitoring \
--set server.service.type=NodePort \
--set server.service.nodePort=30090 \
--set persistence.enabled=false
```

Check:

```bash
kubectl get all -n monitoring
```

---

# Get Grafana Password (Windows PowerShell)

```powershell
[System.Text.Encoding]::UTF8.GetString(
[System.Convert]::FromBase64String(
(kubectl get secret grafana -n monitoring -o jsonpath="{.data.admin-password}")))
```

Login:

- Username: admin
- Password: (output from above command)

---

# Access Grafana

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Open:

```
http://localhost:3000
```

---

# Import Dashboard

- Go to Grafana → Import
- Enter Dashboard ID: **1860**
- Select Data Source: **Prometheus**

---

# Generate Traffic (Testing)

```powershell
while ($true) {
  Invoke-WebRequest http://127.0.0.1:8080
  Start-Sleep -Milliseconds 500
}
```

This will generate load and show metrics in Grafana.

---

# Final Result

You now have:

- Node.js app running on Kubernetes
- Metrics collected using Prometheus
- Visualization using Grafana dashboards

---

# Notes

- Make sure Docker, Kubernetes (Minikube), and Helm are installed
- Update service names and ports if needed
- Ensure your app exposes `/metrics` endpoint

---

# Author

Vishal Bodkhe
