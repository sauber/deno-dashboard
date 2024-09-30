import { assertEquals, assertInstanceOf } from "@std/assert";
import { BarLine } from "./barline.ts";

Deno.test("Instance", () => {
  const b = new BarLine(0);
  assertInstanceOf(b, BarLine);
});

Deno.test("Width", () => {
  const b = new BarLine(2);
  assertEquals(b.line, "  ");
});

Deno.test("Char", () => {
  const b = new BarLine(2, "=");
  assertEquals(b.line, "==");
});

Deno.test("Left", () => {
  const b = new BarLine(5).left("hi");
  assertEquals(b.line, "hi   ");
});

Deno.test("Right", () => {
  const b = new BarLine(5).right("hi");
  assertEquals(b.line, "   hi");
});

Deno.test("At", () => {
  const b = new BarLine(5).at(3, "hi");
  assertEquals(b.line, "  hi ");
});

Deno.test("Center", () => {
  const b = new BarLine(5).center("hi");
  assertEquals(b.line, " hi  ");
});
