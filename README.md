1] npm init -y

2] npm install express

3] npm install -D typescript ts-node-dev @types/node @types/express

4] npx tsc --init

5] {
"compilerOptions": {
"target": "ES6",
"module": "commonjs",
"rootDir": "./src",
"outDir": "./dist",
"strict": true,
"esModuleInterop": true
}
}

6] "scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/app.ts",
"build": "tsc",
"start": "node dist/app.js"
}


--------------------------------END-NODE-SETUP---------------------------------------------

7] npm i prom-client -> It support to histogram , summaries

8] install helm (Windows amd64) -> Kubernets package manager

-------------------------------------------------------------------------------------------

9] do basic setup of kubernets , make cluster deploye application apply deploye,service 

------------------------------------prometheus---------------------------------------------

10] helm repo add prometheus-community https://prometheus-community.github.io/helm-charts 
     -> it is for prometheus 

11] helm repo update

12] helm install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace --set server.service.type=NodePort --set server.service.nodePort=30090 --set alertmanager.enabled=false

-------------------------------------------------------------------------------------------
13] kubectl get all -n monitoring -> get all monitoring namespace (monitoring | default are namespace)

14] kubectl edit configmap prometheus-server -n monitoring -> Edit config map
    Do same like this : 
   ******************************************************************************
   * scrape_configs:                                                            * 
   * - job_name: 'node-monitoring-k8s'	                                        *
   *  static_configs:                                                           * 
   *   - targets : ['node-monitoring-k8s.default.svc.cluster.local:3001']       * 
   ******************************************************************************

15] kubectl rollout restart deployment prometheus-server -n monitoring -> Restart the deployment
   
16] kubectl port-forward svc/prometheus-server 9090:80 -n monitoring -> run application on 9090
