import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Node.js is monitoring in Kubernets using Prometheus and Grafana..!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
