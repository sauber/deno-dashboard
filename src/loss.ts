import { plot } from "@chart";
import { BarLine } from "./barline.ts";

/** Pick samples from array */
function resample(data: number[], count: number): number[] {
  // No resample if too little data
  if (count >= data.length) return data;

  // Average of numbers
  const average = (arr: number[]) =>
    arr.reduce((p: number, c: number) => p + c, 0) / arr.length;

  // Downsample buckets
  const output: number[] = [];
  const bucketSize = data.length / count;
  for (let i = 1; i <= count; ++i) {
    const bucket: number[] = data.slice(
      Math.floor((i - 1) * bucketSize),
      Math.ceil(i * bucketSize)
    );
    output.push(average(bucket));
  }
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
    const chartWidth = this.width - 7;
    const points: number[] = resample(history, chartWidth);
    const printable: string = plot(points, {
      height: this.height - 1,
      padding: "      ",
    });

    const stripped = printable
      .split("\n")
      // Remove single trailing space from each line
      .map((l) => l.replace(/ $/, ""))
      // Pad end of line to full width
      .map((l) => l + new BarLine(this.width - l.length).line)
      .join("\n");

    return stripped;
  }
}
