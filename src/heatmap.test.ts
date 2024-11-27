import { assertEquals, assertGreater, assertInstanceOf } from "@std/assert";
import type { Inputs, Outputs } from "./types.d.ts";
import { HeatmapMaker } from "./heatmap.ts";

const inputs: Inputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

const outputs: Outputs = [0, 1, 1, 0];

/** Emulate XOR function */
function xor(x: number, y: number): number {
  return Math.abs(x - y);
}

Deno.test("Instance", () => {
  const h = new HeatmapMaker(13, 5, xor);
  assertInstanceOf(h, HeatmapMaker);
});

Deno.test("Render", () => {
  const m = new HeatmapMaker(7, 3, xor);
  const h = m.heatmap(inputs, outputs);
  assertEquals(h.min, 0);
  assertEquals(h.max, 1);
  const printable: string = h.render();
  assertGreater(printable.length, 0);
  // console.log(printable);
});
