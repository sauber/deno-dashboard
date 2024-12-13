import { assertEquals, assertInstanceOf } from "@std/assert";
import { Iteration } from "./iteration.ts";

Deno.test("Instance", () => {
  const i = new Iteration(0, 0);
  assertInstanceOf(i, Iteration);
});

Deno.test("Count 0", () => {
  const i = new Iteration(100, 40);
  const bar = i.render(0);
  assertEquals(bar.substring(0, 7), "  0/100");
  assertEquals(bar.substring(bar.length - 8, bar.length), "--:--:--");
});

Deno.test("Count to max", () => {
  const max = 10;
  const width = 40;
  const i = new Iteration(max, width);
  Array(max + 1).fill(0).map((_, n) => {
    const bar = i.render(n);
    console.log(bar);
    assertEquals(bar.length, width);
  });
});

Deno.test("Finish before max", () => {
  const max = 10;
  const width = 40;
  const i = new Iteration(max, width);
  i.render(1);
  const bar = i.finish();
  assertEquals(bar.substring(0, 3), "1/1");
});

Deno.test("Exceed max", () => {
  const max = 10;
  const width = 40;
  const i = new Iteration(max, width);
  i.render(max+1);
  const bar = i.finish();
  assertEquals(bar.substring(0, 5), "11/11");
});
