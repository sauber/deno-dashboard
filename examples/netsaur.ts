import {
  Sequential,
  DenseLayer,
  LeakyReluLayer,
  TanhLayer,
  tensor1D,
  tensor2D,
  WASM,
  setupBackend,
} from "jsr:@denosaurs/netsaur@0.4.2";
import { Dashboard } from "jsr:@sauber/ml-cli-dashboard";

await setupBackend(WASM);

// Training Data
const xs: number[][] = [];
const ys: number[][] = [];
for (let i = 0; i < 150; ++i) {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  xs.push([x, y]);
  ys.push([-Math.cos(Math.sqrt(x * x + y * y) * 5.5)]);
}
const txs = tensor2D(xs);
const tys = tensor2D(ys);

// Neural network
const net = new Sequential({
  size: [150, 1],
  layers: [
    DenseLayer({ size: [8] }),
    LeakyReluLayer(),
    DenseLayer({ size: [6] }),
    LeakyReluLayer(),
    DenseLayer({ size: [1] }),
    TanhLayer(),
  ],
});

// Hold predictions from neural network
const predictions: number[][] = Array(11).fill(Array(11));

// Pull out predictions from network covering range of input
async function predict(): Promise<void> {
  for (let y = 0; y <= 10; ++y)
    for (let x = 0; x <= 10; ++x)
      predictions[y][x] = (
        await net.predict(tensor1D([x / 5 - 1, y / 5 - 1]))
      ).data[0];
}

// Use number from lookup cell most near to parameters
function lookup(a: number, b: number): number {
  const row = Math.round(b + 1);
  const col = Math.round(a + 1);
  return predictions[row][col];
}

// Dashboard
const epochs = 20000;
const width = 74;
const height = 12;
const dashboard = new Dashboard(
  width,
  height,
  xs as Array<[number, number]>,
  ys.map((r) => r[0]),
  lookup,
  epochs
);

// Main loop
let loss = Infinity;
const epsilon = 0.01;
const iterations = 100;
let count = 0;
while (loss > epsilon && count < epochs) {
  loss = net.train([{ inputs: txs, outputs: tys }], iterations);
  await predict();
  count += iterations;
  dashboard.render(count, loss);
}
