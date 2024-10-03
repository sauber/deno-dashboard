# deno-dashboard

Visualize training of neural networks by displaying learning rate and scatter plot of predictions on cli terminal.

## Usage

No particular neural networks or other training networks are directly supported. Users are expected to write to callback methods to bridge data between the network and the dashboard.

### Training callback

To get continous status from training process, the training process must accept a callback process where it can deliver number of iterations and current error or loss to dashboard. Ie:

```ts
const dashboard = new Dashboard(...);

function status(iteration: number, loss: number): void {
  console.log(dashboard.render(iteration, loss));
}

new Training({..., callback: status, ...}).run()
```

Each neural network framework reports iteration and loss differently, so adjust the callback function accordingly.

### Network callback

The scatter plot querys the neural network for predicted output of a range of two parameters. The ranges are between min and max in the input training set. Exactly two parameters are used in the scatter plot, so if the neural network have more parameters, they need to be inserted. The dashboard must be supplied with a wrapper function for calling prediction on the network. Ie:

```ts
const trainingData = [...];
const net = new Network(...);

// Example:
// X and Y is mapped to parameter 1 and 2. Use means values for all other parameters.
// Use the 4th output value for scatter plot
const means: number[] = means(trainingData);
function predict(a: number, b: number): number {
  const input = means.slice();
  input[2] = a; input[1] = b;
  const output = net.forward(input);
  return output[3];
}

const dashboard = new Dashboard(..., predict, ...);
```

In the example above, mean value for all other parameters than X and Y are calculated.


## Example

Here is a complete example of bridging the training process and dashboard with a prediction callback function and with a status


```ts
import type { Inputs, Outputs } from "jsr:@sauber/neurons";
import { Network, Train } from "jsr:@sauber/neurons";
import { Dashboard } from "jsr:@sauber/ml-cli-dashboard";

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

// Callback to network from dashboard
function predict(a: number, b: number): number {
  return net.predict([a, b])[0];
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
  predict,
  epochs
);

// Callback to dashboard from training
function status(iteration: number, lossHistory: number[]): void {
  const loss = lossHistory[lossHistory.length-1];
  console.log(dashboard.render(iteration, loss);
}

// Run training
const t = new Train(net, xs, ys);
t.callback = status;
t.callbackFrequency = 100;
t.epsilon = 0.01;
const learning_rate = 0.5;
t.run(epochs, learning_rate);
console.log(dashboard.finish());
```

## Backend Examples

Below are example outputs using different neural network backends. The training data is sine wave in a 2D plane. In both examples the networks have two hidden layers with 8 and 6 nodes.

### Brain.js

A npm module using Adam optimization.

Running this code:

```bash
deno run https://raw.githubusercontent.com/sauber/deno-dashboard/refs/heads/main/examples/brain.ts
```

Should render output like this:

[![asciicast](https://asciinema.org/a/SYiyjhkqRLJ1amG6oXuXFXtC2.svg)](https://asciinema.org/a/SYiyjhkqRLJ1amG6oXuXFXtC2)

The actual learning process varies due to neural network starting with random values.

### Neurons

A pure typescript module using stochastic gradient descent.

Running this code:

```bash
deno run https://raw.githubusercontent.com/sauber/deno-dashboard/refs/heads/main/examples/neurons.ts
```

[![asciicast](https://asciinema.org/a/hyMutOMpwVoUtMvOtqh7hHg94.svg)](https://asciinema.org/a/hyMutOMpwVoUtMvOtqh7hHg94)

## Contribute

Please file pull request.

## License

See [LICENSE](./LICENSE).