import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertInstanceOf,
} from "@std/assert";
import { type DataSet, Rank2D } from "./rank2d.ts";

/** Generate a random dataset */
function dataset(length: number): DataSet {
  let letter = "@";
  return [...Array(length)].map(() => {
    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    return {
      x: Math.round(-100 + 200 * Math.random()),
      y: Math.round(-100 + 200 * Math.random()),
      item: letter,
    };
  });
}

Deno.test("Empty initialization", () => {
  const g = new Rank2D(dataset(0));
  assertInstanceOf(g, Rank2D);
});

Deno.test("Optimize Zero Items", () => {
  const g = new Rank2D(dataset(0));
  g.optimize();
  assertEquals(g.displacement, 0);
});

Deno.test("Optimize One Item", () => {
  const g = new Rank2D(dataset(1));
  g.optimize();
  assertEquals(g.displacement, 0);
});

Deno.test("Optimize Two Items", () => {
  const g = new Rank2D(dataset(2));
  const before = g.displacement;
  g.optimize();
  const after = g.displacement;
  assert(before >= after);
  assertAlmostEquals(g.displacement, Math.sqrt(2), 0.1);
});

Deno.test("Optimize Three Items", () => {
  const g = new Rank2D(dataset(3));
  g.optimize();
  assert(g.displacement > Math.sqrt(2));
});

Deno.test("Optimize Many Items", () => {
  const g = new Rank2D(dataset(1000));
  g.optimize();
  assert(g.displacement > 50);
});

Deno.test("Visualize before and after", { ignore: true }, () => {
  const g = new Rank2D(dataset(5));
  console.table(g.table);
  g.optimize();
  console.table(g.table);
});
