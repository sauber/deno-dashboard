import { rgb24 } from "@std/fmt/colors";
import type { Inputs, Outputs, Predict } from "../mod.ts";
import { BarLine } from "./barline.ts";
import { HeatmapMaker } from "./heatmap.ts";
import type { Heatmap } from "./heatmap.ts";
import { column } from "./column.ts";
import type { Column } from "./column.ts";

type Overlay = [Column, Column, Column];

////////////////////////////////////////////////////////////////////////
/// X Axis
////////////////////////////////////////////////////////////////////////

/** Render values and label on X Axis */
class XAxis {
  // Char position where axis begins
  public start: number = 0;

  /**
   * @param {string} name Label for X Axis
   * @param {number} high Highest value on X axis
   * @param {number} low Lowest value on X axis
   * @param {number} width Number of chars wide
   */
  constructor(
    private readonly name: string,
    private readonly width: number,
    private readonly high: number,
    private readonly low: number,
  ) {}

  /** Number of lines high */
  public get height(): 1 {
    return 1;
  }

  /** Generate all lines in X Axis
   * TODO: This output is static, so only render once
   */
  public render(): string[] {
    const low: string = this.low.toPrecision(2);
    const high: string = this.high.toPrecision(2);
    const bar = new BarLine(this.width)
      .at(this.start, low)
      .right(high)
      .at(this.start + (this.width - this.start) / 2, this.name);

    return [bar.line];
  }
}

////////////////////////////////////////////////////////////////////////
/// Y Axis
////////////////////////////////////////////////////////////////////////

/** Render values and label on Y Axis */
class YAxis {
  /**
   * @param {string} name Label for Y Axis
   * @param {number} high Highest value on Y axis
   * @param {number} low Lowest value on Y axis
   * @param {number} height Number of lines
   */
  constructor(
    private readonly name: string,
    private readonly high: number,
    private readonly low: number,
    private readonly height: number,
  ) {}

  /** Highest number as a string */
  private get highLabel(): string {
    return this.high.toPrecision(2);
  }

  /** Highest number as a string */
  private get lowLabel(): string {
    return this.low.toPrecision(2);
  }

  /** Max length of labels */
  public get width(): number {
    return Math.max(
      this.highLabel.length,
      this.name.length,
      this.lowLabel.length,
    );
  }

  /** Generate all lines in Y Axis
   * TODO: This output is static, so only render once
   */
  public render(): string[] {
    const w: number = this.width; // Width
    const h: number = this.height; // Height
    const padding = new BarLine(w).line;
    const lines: string[] = Array(h).fill(padding);
    lines[0] = new BarLine(w).right(this.highLabel).line;
    lines[Math.round((h - 1) / 2)] = new BarLine(w).center(this.name).line;
    lines[h - 1] = new BarLine(w).right(this.lowLabel).line;
    return lines;
  }
}

////////////////////////////////////////////////////////////////////////
/// Z Axis
////////////////////////////////////////////////////////////////////////

/** Render values and label on Z Axis */
class ZAxis {
  // Char position where content starts
  public start: number = 0;

  /**
   * @param {string} name Label for Z Axis
   * @param {number} width Number of chars wide
   */
  constructor(private readonly name: string, private readonly width: number) {}

  /** Number of lines high */
  public get height(): 1 {
    return 1;
  }

  /** Generate all lines in Z Axis
   * @param {number} low Lowest output value
   * @param {number} high Highest output value
   */
  public render(low: number, high: number): string[] {
    const block = "█";
    const red: string = rgb24(block, { r: 255, g: 0, b: 0 });
    const green: string = rgb24(block, { r: 0, g: 255, b: 128 });
    const black: string = rgb24(block, { r: 0, g: 0, b: 0 });
    const white: string = rgb24(block, { r: 255, g: 255, b: 255 });
    // Generate this sting: "#/#=-1.0  #/#=1.0"
    const labels: string = black +
      "/" +
      red +
      "=" +
      low.toPrecision(2) +
      "  " +
      white +
      "/" +
      green +
      "=" +
      high.toPrecision(2);
    const labelwidth: number = low.toPrecision(2).length +
      high.toPrecision(2).length + 10;
    const bar: string =
      new BarLine(Math.ceil((this.width - labelwidth) / 2)).line +
      labels +
      new BarLine(Math.floor((this.width - labelwidth) / 2)).line;
    return [bar];
  }
}

/** Traverse range of values for two parameters of the input set,
 * use mean input values for all other parameters,
 * generate heatmap for the values in range,
 * overlay values from output set,
 * and generate ANSI digram printable on console.
 */
export class Scatter {
  /** Label on x-axis */
  public readonly xlabel: string = "X";

  /** Label on y-axis */
  public readonly ylabel: string = "Y";

  /** Label for values */
  public readonly zlabel: string = "Output";

  /** Total width of diagrams in chars */
  public readonly width: number = 40;

  /** Total height of diagrams in lines of chars */
  public readonly height: number = 11;

  // Components in diagram
  private readonly xaxis: XAxis;
  private readonly yaxis: YAxis;
  private readonly zaxis: ZAxis;
  private readonly maker: HeatmapMaker;

  /**
   * @param {Inputs} input   - Training input values, array of rows of numbers
   * @param {Outputs} output  - Training output values, array of rows of numbers
   * @param {Predict} predict - Function to generate output scalar from [x,y] input values
   * @param {Scatter} config  - Options for x, y and z axis
   */
  constructor(
    private readonly inputs: Inputs,
    private readonly outputs: Outputs,
    predict: Predict,
    private readonly config: Partial<Scatter> = {},
  ) {
    Object.assign(this, config);

    // Define all the components of the diagram
    const xs: Column = column(inputs, 0);
    const ys: Column = column(inputs, 1);
    this.xaxis = new XAxis(this.xlabel, this.width, xs.max, xs.min);
    this.zaxis = new ZAxis(this.zlabel, this.width);
    const height: number = this.height - this.zaxis.height - this.xaxis.height;
    this.yaxis = new YAxis(this.ylabel, ys.max, ys.min, height);
    this.xaxis.start = this.yaxis.width;
    this.zaxis.start = this.yaxis.width;
    this.maker = new HeatmapMaker(
      this.width - this.yaxis.width,
      height,
      inputs,
      outputs,
      predict,
    );
  }

  /** Diagram Layout:
   * ┌Header────────────────────────────────┐
   * │   ▯ Lowest output  ▮ Highest output │
   * └──────────────────────────────────────┘
   * ┌LeftBar───┐┌Content───────────────────┐
   * │ Highest_Y││┌────────────────────────┐│
   * │          │││                        ││
   * │Y_Axisname│││        heatmap         ││
   * │          │││                        ││
   * │  Lowest_Y││└────────────────────────┘│
   * └──────────┘└──────────────────────────┘
   * ┌Footer────────────────────────────────┐
   * │        Lowest_X  Y_Axisname  Lowest_Y│
   * └──────────────────────────────────────┘
   */

  /** Generate heatmap diagram
   * @result String printable on terminal console
   */
  public plot(): string {
    const heatmap: Heatmap = this.maker.heatmap();

    const header: string[] = this.zaxis.render(heatmap.min, heatmap.max);
    const yaxis: string[] = this.yaxis.render();
    const content: string[] = heatmap.render().split("\n");
    const footer: string[] = this.xaxis.render();

    const lines: string[] = [
      ...header,
      ...yaxis.map((line, index) => [line, content[index]].join("")),
      ...footer,
    ];

    return lines.join("\n");
  }
}
