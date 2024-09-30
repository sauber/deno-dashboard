/** A blank line with labels added at positions */
export class BarLine {
  public line: string;

  constructor(width: number, char: string = " ") {
    this.line = new Array(width).fill(char).join("");
  }

  /** Label at left side of bar */
  public left(label: string): this {
    this.line = label + this.line.substring(label.length, this.line.length);
    return this;
  }

  /** Label at right side of bar */
  public right(label: string): this {
    this.line = this.line.substring(0, this.line.length - label.length) + label;
    return this;
  }

  /** Label centered at position */
  public at(position: number, label: string): this {
    this.line =
      this.line.substring(0, position - Math.floor(label.length / 2)) +
      label +
      this.line.substring(
        position + Math.ceil(label.length / 2),
        this.line.length
      );
    return this;
  }

  /** Label at middle of string */
  public center(label: string): this {
    return this.at(this.line.length / 2, label);
  }
}
