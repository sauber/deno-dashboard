// import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';
import { assertInstanceOf, assertNotMatch, assertStringIncludes } from "@std/assert";
import { Dashboard } from "./dashboard.ts";
import { xor } from "./examples.ts";
import type { Example } from "./examples.ts";

const x: Example = xor();

Deno.test("Instance", () => {
  const d = new Dashboard(40, 10, x.inputs, x.outputs, x.predict, 200);
  assertInstanceOf(d, Dashboard);
});

Deno.test("No iterations", () => {
  const d = new Dashboard(40, 10, x.inputs, x.outputs, x.predict, 200);
  const v: string = d.render(0, 0);
  // console.log(v);
  assertStringIncludes(v, 'No data');
  assertStringIncludes(v, '--:--:--');
});

Deno.test("Iteration 1", () => {
  const d = new Dashboard(40, 10, x.inputs, x.outputs, x.predict, 200);
  const v: string = d.render(1, 1);
  // console.log(v);
  assertStringIncludes(v, 'No data');
  assertNotMatch(v, /--:--:--/);
});

Deno.test("Iteration 2", () => {
  const d = new Dashboard(40, 10, x.inputs, x.outputs, x.predict, 200);
  d.render(1, 1);
  const v: string = d.render(2, 2);
  // console.log({v});
  assertStringIncludes(v, '\x1b[10F');
});

Deno.test("Run Iterations", { ignore: false }, () => {
  const max = 1000;
  const step = 100;
  const d = new Dashboard(40, 10, x.inputs, x.outputs, x.predict, max, "foox", "bary");
  for (let i = 0; i < max; i += step) {
    const printable: string = d.render(i, Math.random());
    console.log(printable);
    // await delay(1000);
  }
  console.log(d.finish());
});
