const express = require("express");
const cluster = require("cluster");
const os = require("os");

const app = express();

const numCpu = os.cpus().length;
app.get("/", (req, res) => {
  for (let i = 0; i < 1e8; i++) {}
  //   console.log(numCpu);
  res.send(`Ok from ${process.pid}`);
});
if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died.`);
    cluster.fork();
  });
} else {
  app.listen(3000, () => {
    console.log(`Server ${process.pid} started on port 3000...`);
  });
}
// app.listen(3000, () => {
//   console.log(`Server ${process.pid} started on port 3000...`);
// });
