import express, { Request, Response } from "express";
import client from "prom-client";

const app = express();
const PORT = 3001;

app.use(express.json());

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  eventLoopMonitoringPrecision: 5000,
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message:
      "Node.js is monitoring in Kubernets using Prometheus and Grafana..!",
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
