import { blockify } from "@image";
import type { Inputs, Outputs, Predict } from "../mod.ts";
import { column, Column } from "./column.ts";

// Set of: Input XS, Input YS, Outputs
type Overlay = [Column, Column, Column];

/** Create heatmap of freshly predicted values */
export class HeatmapMaker {
  /** Row of mean values from all columns */
  private readonly overlay: Overlay;
  private readonly inputs: Inputs;

  /**
   * @param {number} width Number of chars wide
   * @param {number} height Number of lines high
   * @param {inputs} Inputs Inputs training data
   * @param {outputs} Outputs Outputs training data
   * @param {predict} function Generate one output from two inputs, x and y
   */
  constructor(
    private readonly width: number,
    private readonly height: number,
    inputs: Inputs,
    outputs: Outputs,
    private readonly predict: Predict
  ) {
    // Keep static overlay data for later
    const x = column(inputs, 0);
    const y = column(inputs, 1);
    this.overlay = [x, y, new Column(outputs)];

    // Generate set of inputs for heatmap
    const xs = x.points(width * 2);
    const ys = y.points(height * 2);
    this.inputs = [];
    ys.forEach((y) => xs.forEach((x) => this.inputs.push([x, y])));
  }

  public heatmap(): Heatmap {
    const values: Outputs = this.inputs.map((input) => this.predict(...input));
    return new Heatmap(this.width * 2, this.height * 2, values, this.overlay);
  }
}

/** Render heatmap of values and overlay */
export class Heatmap {
  /** Minimum output value */
  public readonly min: number;

  /** Maximum output value */
  public readonly max: number;

  /** Bitmap of predicted values and training values */
  private readonly bitmap: Uint8Array;

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly values: number[],
    private readonly overlay: Overlay
  ) {
    // Find min and max output values
    const all = [...values, overlay[2].min, this.overlay[2].max];
    this.min = Math.min(...all);
    this.max = Math.max(...all);

    // Generate bitmap
    this.bitmap = new Uint8Array(this.width * this.height * 4);
    this.predictions();
    this.trainingdata();
  }

  /** Insert pixel and [x,y] position */
  private pixel(x: number, y: number, r: number, g: number, b: number): void {
    // Input data has (0,0) at bottom-left, but bitmap has at top-left
    const index = ((this.height - y - 1) * this.width + x) * 4;
    this.bitmap.set([r, g, b], index);
  }

  /** Scale value to be in range 0-255 */
  private vscale(input: number): number {
    const input_min: number = this.min;
    const input_max: number = this.max;
    const output_min = 0;
    const output_max = 256;
    const f: number =
      ((input - input_min) / (input_max - input_min)) *
        (output_max - output_min) +
      output_min;

    const i: number = f > 255 ? 255 : Math.floor(f);
    return i;
  }

  /** Insert predicted data on bitmap */
  private predictions(): void {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const index: number = y * this.width + x;
        const v: number = this.vscale(this.values[index]);
        this.pixel(x, y, v, v, v);
      }
    }
  }

  /** Insert overlay training data on bitmap */
  private trainingdata(): void {
    // Overlay training
    const xmin = this.overlay[0].min;
    const xmax = this.overlay[0].max;
    const ymin = this.overlay[1].min;
    const ymax = this.overlay[1].max;
    const width = this.width;
    const height = this.height;
    this.overlay[0].data.forEach((x: number, i: number) => {
      // Scale X to xaxis point
      const xf = ((x - xmin) / (xmax - xmin)) * width;
      const xi = xf >= width ? width - 1 : Math.floor(xf);

      // Scale Y to yaxis point
      const y = this.overlay[1].data[i];
      const yf = ((y - ymin) / (ymax - ymin)) * height;
      const yi = yf >= height ? height - 1 : Math.floor(yf);

      // Scale v to output range
      const z = this.overlay[2].data[i];
      const v: number = this.vscale(z);

      // Insert red or green pixel
      this.pixel(xi, yi, 255 - v, v, Math.round(v / 2));
    });
  }

  /** Convert heatmap bitmap printable string */
  public render(): string {
    return blockify(this.bitmap, this.width, this.height);
  }
}