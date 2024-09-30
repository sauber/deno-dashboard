import { assertGreater, assertInstanceOf } from "@std/assert";
import { Scatter } from "./scatter.ts";
import { wave, xor } from "./examples.ts";

Deno.test("Initialize", () => {
  const x = xor();
  const s = new Scatter(x.inputs, x.outputs, x.predict);
  assertInstanceOf(s, Scatter);
});

Deno.test("XOR plot", () => {
  const x = xor();
  const s = new Scatter(x.inputs, x.outputs, x.predict);
  const printable: string = s.plot();
  assertGreater(printable.length, 0);
  // console.log(printable);
});

Deno.test("Wave plot", () => {
  const x = wave();
  const s = new Scatter(x.inputs, x.outputs, x.predict);
  const printable: string = s.plot();
  assertGreater(printable.length, 0);
  // console.log(printable);
});
