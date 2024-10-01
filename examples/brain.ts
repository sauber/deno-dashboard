import brain from "npm:brain.js@1.6.0";
import { Dashboard } from "jsr:@sauber/dashboard";

// Training Data
const training = [];
for (let i = 0; i < 150; ++i) {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  training.push({
    input: [x, y],
    output: [-Math.cos(Math.sqrt(x * x + y * y) * 5.5)],
  });
}

// Neural network
const epochs = 20000;
const net = new brain.NeuralNetwork({
  hiddenLayers: [8, 6],
  callback: dashboard,
  callbackPeriod: 100,
  activation: "tanh",
  errorThresh: 0.03,
  iterations: epochs,
});

// Callback to network from dashboard
function predict(a: number, b: number): number {
  return net.run([a, b])[0];
}

// Dashboard
const width = 74;
const height = 12;
const d = new Dashboard(
  width,
  height,
  training.map((r) => [r.input[0], r.input[1]]),
  training.map((r) => r.output[0]),
  predict,
  epochs
);

// Callback to dashboard from training
function dashboard({
  iterations,
  error,
}: {
  iterations: number;
  error: number;
}): void {
  console.log(d.render(iterations, error));
}

// Run training
const result = net.train(training);
console.log(d.render(result.iterations, result.error));
console.log(d.finish());
