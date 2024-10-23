import { assertEquals, assertInstanceOf } from "@std/assert";
import { Column } from "./column.ts";

Deno.test("Column Instance", () => {
  const c = new Column([]);
  assertInstanceOf(c, Column);
});

Deno.test("Min, Max, Mean", () => {
  const c = new Column([3, 1, 2]);
  assertEquals(c.min, 1);
  assertEquals(c.max, 3);
  assertEquals(c.mean, 2);
});

Deno.test("Distribution of points", () => {
  const c = new Column([3, 1, 2]);
  const p: number[] = c.points(5);
  assertEquals(p, [1, 1.5, 2, 2.5, 3]);
});
