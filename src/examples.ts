import type { Inputs, Outputs, Predict } from "../mod.ts";

/** A network to solve inputs to outputs */
export type Example = {
  predict: Predict;
  inputs: Inputs;
  outputs: Outputs;
};

/** XOR logic */
export function xor(): Example {
  return {
    predict: (x: number, y: number) => Math.abs(x - y),
    inputs: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    outputs: [0, 1, 1, 0],
  };
}

/** Sinus wave from middle of area */
export function wave(): Example {
  const xs: Inputs = [];
  const ys: Outputs = [];

  const wave = (x: number, y: number): number =>
    -Math.cos(Math.sqrt(x * x + y * y) * 5.5);

  for (let i = 0; i < 150; ++i) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    xs.push([x, y]);
    ys.push(wave(x, y));
  }

  return {
    predict: wave,
    inputs: xs,
    outputs: ys,
  };
}
