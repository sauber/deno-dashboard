import { plot } from "asciichart";
import { BarLine } from "./barline.ts";
import { downsample } from "@sauber/statistics";

/** Display a loss chart */
export class Loss {
  constructor(
    private readonly width: number,
    private readonly height: number,
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
    const points: number[] = downsample(history, chartWidth);
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
