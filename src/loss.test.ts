import { assertInstanceOf } from "@std/assert/assert-instance-of";
import { Loss } from "./loss.ts";
import { assertEquals } from "@std/assert/assert-equals";

Deno.test("Instance", () => {
  const l = new Loss(0, 0);
  assertInstanceOf(l, Loss);
});

Deno.test("No Chart", () => {
  const l = new Loss(0, 0);
  const r = l.render([]);
  assertEquals(r, "No data");
});

Deno.test("No Chart of 1 item", () => {
  const l = new Loss(0, 0);
  const r = l.render([0]);
  assertEquals(r, "No data");
});

Deno.test("Chart of 2 items", () => {
  const l = new Loss(10, 2);
  const r = l.render([0, 1]);
  assertEquals(r.split("\n").length, 2);
});

Deno.test("Chart of 100 items", () => {
  const l = new Loss(10, 4);
  const data = Array(100)
    .fill(0)
    .map((_) => Math.random());
  const r = l.render(data);
  assertEquals(r.split("\n").length, 4, "Height 4");
  assertEquals(r.split("\n")[0].length, 10, "Width 10");
});
