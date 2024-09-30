import { format } from "@std/datetime/format";

type MS = number;

export class Iteration {
  /** Start time */
  private readonly start: number;

  /** Current count */
  private count: number = 0;

  constructor(private max: number, private readonly width: number) {
    this.start = new Date().getTime();
  }

  /** Display current absolute count and max */
  private ratio(): string {
    const i = this.count;
    const l: number = this.max.toString().length;
    const p: number = i.toString().length;
    const pad: string = Array(l - p)
      .fill(" ")
      .join("");
    return pad + i + "/" + this.max;
  }

  /** Display time when expecting to finish */
  private eta(): string {
    const i = this.count;
    // Not started
    if (i == 0) return "--:--:--";

    const now: MS = new Date().getTime();
    // how many ms since start
    const gone: MS = now - this.start;
    // Ratio of completion
    const ratio: MS = i / this.max;
    // how many ms remaining
    const remain: MS = gone / ratio - gone;
    // Absolute time when finishing
    const eta: MS = Math.round(now + remain);

    const time = format(new Date(eta), "HH:mm:ss");
    const date = format(new Date(eta), "MM-dd");
    const today = format(new Date(), "MM-dd");

    if (date == today) return time;
    else return date + " " + time;
  }

  // Display visually progress
  private bar(width: number): string {
    const ratio: number = this.count / this.max;
    const filled: number = Math.round(ratio * (width - 2));
    const open: number = width - 2 - filled;
    const bar =
      "[" +
      Array(filled).fill("=").join("") +
      Array(open).fill("-").join("") +
      "]";
    return bar;
  }

  /** Generate a string of each component */
  private combined(): string {
    const ratio: string = this.ratio();
    const eta: string = this.eta();
    const bar: string = this.bar(this.width - ratio.length - eta.length - 2);
    return [ratio, bar, eta].join(" ");
  }

  /** Display a bar with information about iterations */
  public render(iterations: number): string {
    this.count = iterations;
    return this.combined();
  }

  /** Finish at whatever current count is */
  public finish(): string {
    this.max = this.count;
    return this.combined();
  }
}
