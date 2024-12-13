import type { Inputs, Row } from "./types.d.ts";

/** Extract a single column from Rows of Inputs */
export function column(grid: Inputs, n: number): Column {
  return new Column(grid.map((row: Row) => row[n]));
}

/** A column of numbers */
export class Column {
  private readonly sorted: number[];

  /** Sort numbers */
  constructor(public readonly data: number[]) {
    this.sorted = data.slice().sort((a, b) => a - b);
  }

  /** Largest number */
  public get max(): number {
    return this.sorted[this.sorted.length - 1];
  }

  /** Smallest number */
  public get min(): number {
    return this.sorted[0];
  }

  /** Middle number */
  public get mean(): number {
    const index = Math.round((this.sorted.length - 1) / 2);
    return this.sorted[index];
  }

  /** Evenly distributed points between min and max, both included */
  public points(count: number): number[] {
    const low: number = this.min;
    const high: number = this.max;
    return Array(count)
      .fill(0)
      .map((_, i) => low + (i * (high - low)) / (count - 1));
  }
}
