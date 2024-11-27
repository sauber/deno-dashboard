/** A single set of inputs */
export type Row = [number, number];

/** Input Dataset */
export type Inputs = Array<Row>;

/** The column of output data to display */
export type Outputs = Array<number>;

/** Function to predict output from two inputs */
export type Predict = (x: number, y: number) => number;