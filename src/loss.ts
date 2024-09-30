import { plot } from "chart";
import { BarLine } from "./barline.ts";

/** Pick samples from array
 * TODO: Smooth average of intervals instad of picking
 */
function resample(data: number[], count: number): number[] {
  if (count >= data.length) return data;
  const output: number[] = [];
  for (let i = 1; i <= count; ++i) {
    output.push(data[Math.floor((data.length * i) / count - 1)]);
  }
  // console.log({ output });
  return output;
}

/** Display a loss chart */
export class Loss {
  constructor(
    private readonly width: number,
    private readonly height: number
  ) {}

  /** Display a message that data is insufficient */
  private nodata(): string {
    const blank = new BarLine(this.width).line;
    const blanks = Array(this.height).fill(blank);
    blanks[this.height / 2] = new BarLine(this.width).center("No data").line;
    return blanks.join("\n");
  }

  // Generate chart
  public render(history: number[]): string {
    if (history.length < 2) return this.nodata();

    // Generate a graph
    // TODO: Better estimation of padding width
    const points: number[] = resample(history, this.width - 7);
    const printable: string = plot(points, {
      height: this.height - 1,
      padding: "      ",
    });
    // Remove single trailing space from each line
    const stripped = printable
      .split("\n")
      .map((l) => l.replace(/ $/, ""))
      .join("\n");

    return stripped;
  }
}
