import { BarLine } from "./barline.ts";
import { Loss } from "./loss.ts";
import { Scatter } from "./scatter.ts";
import { Iteration } from "./iteration.ts";
import type { Inputs, Outputs, Predict } from "../mod.ts";

// ANSI escape codes
const SEP = "│";
const ESC = "\u001B[";
const SHOW = ESC + "?25h";
const HIDE = ESC + "?25l";
const LINEUP = ESC + "F";

/** A CLI printable dashboard with progressbar, scatter plot and loss chart. */
export class Dashboard {
  private readonly scatter: Scatter;
  private readonly loss: Loss;
  private readonly header: string;
  private readonly iteration: Iteration;
  private readonly losses: number[] = [];

  /**
   * Create a new Dashboard of given size and set of training data.
   * @param {number} width - Number of chars wide
   * @param {number} height - Number for lines high
   * @param {Inputs} inputs  - Training input data set
   * @param {Outputs} outputs  - Training output data set
   * @param {Outputs} predict - Function to predict output from inputs
   * @param {number} epochs - Max number of epochs for training
   */
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly inputs: Inputs,
    private readonly outputs: Outputs,
    private readonly predict: Predict,
    private readonly epochs: number,
    private readonly xlabel: string = "X",
    private readonly ylabel: string = "Y",
  ) {
    const colWidth = Math.floor((this.width - 1) / 2);
    const colHeight = this.height - 2;
    this.scatter = new Scatter(inputs, outputs, predict, {
      width: colWidth,
      height: colHeight,
      xlabel,
      ylabel,
    });
    this.loss = new Loss(colWidth, colHeight);
    this.header = ["Scatter Plot", "Loss History"]
      .map((h) => new BarLine(colWidth, "-").left(h).line)
      .join(SEP);
    this.iteration = new Iteration(epochs, colWidth * 2 + 1);
  }

  /**
   * Combine components into dashboard
   * @param {number} iteration - Count of iterations completed
   * @param {number} loss - Error of most recent iteration
   * @result String printable on terminal console
   */
  public render(iteration: number, loss: number): string {
    const lines: string[] = [];

    this.losses.push(loss);
    const scatter: string[] = this.scatter.plot().split("\n");
    const losscomp: string[] = this.loss.render(this.losses).split("\n");
    const HOME = ESC + this.height.toString() + "F";
    lines.push(
      // At all subsequent iterations move cursor up to first line if output
      // Display header line
      HIDE + (this.losses.length > 1 ? HOME : "") + this.header,
      // Display scatter plot and loss chart side by side
      ...scatter.map((line, index) => [line, losscomp[index]].join(SEP)),
      // Display progress bar
      this.iteration.render(iteration) + SHOW,
    );
    return lines.join("\n");
  }

  /** Reset cursor
   * @result String printable on terminal console
   */
  public finish(): string {
    return LINEUP;
  }
}
