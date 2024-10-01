import type { Inputs, Outputs } from "jsr:@sauber/neurons";
import { Network, Train } from "jsr:@sauber/neurons";
import { Dashboard } from "jsr:@sauber/dashboard";


// Training Data
const xs: Inputs = [];
const ys: Outputs = [];
for (let i = 0; i < 150; ++i) {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  xs.push([x, y]);
  ys.push([-Math.cos(Math.sqrt(x * x + y * y) * 5.5)]);
}

// Neural network
const net = new Network(2).dense(8).lrelu.dense(6).lrelu.dense(1).tanh;
function predict(a: number, b: number): number {
  return net.predict([a, b])[0];
}

// Callback to dashboard from training
const epochs = 20000;
const width = 74;
const height = 12;
const d = new Dashboard(
  width,
  height,
  xs as Array<[number, number]>,
  ys.map((r) => r[0]),
  predict,
  epochs
);

// Callback to dashboard from training
function dashboard(iteration: number, loss: number[]): void {
  console.log(d.render(iteration, loss[loss.length - 1]));
}

// Run training
const t = new Train(net, xs, ys);
t.callback = dashboard;
t.callbackFrequency = 100;
t.epsilon = 0.01;
const learning_rate = 0.5;
t.run(epochs, learning_rate);
