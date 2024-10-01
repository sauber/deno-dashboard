# deno-dashboard

Visualize training of neural networks by displaying learning rate and scatter plot of predictions on cli terminal.

## Examples

Below are example outputs using different neural network backends. The training data is sine wave in a 2D plane. In both examples the networks have two hidden layers with 8 and 6 nodes.

### Brain.js

A npm module using Adam optimization.

[![asciicast](https://asciinema.org/a/SYiyjhkqRLJ1amG6oXuXFXtC2.svg)](https://asciinema.org/a/SYiyjhkqRLJ1amG6oXuXFXtC2)

### Neurons

A pure typescript module using stochastic gradient descent.

[![asciicast](https://asciinema.org/a/hyMutOMpwVoUtMvOtqh7hHg94.svg)](https://asciinema.org/a/hyMutOMpwVoUtMvOtqh7hHg94)
