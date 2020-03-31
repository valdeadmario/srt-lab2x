const plotly = require("plotly")("valdeadmario", "yaKNsI7OESXDqOmq3EQr");

const graph = (arrX, arrY, name) => {
  const trace1 = {
    x: arrY,
    y: arrX,
    type: "scatter"
  };
  const data = [trace1];
  const layout = {
    yaxis2: {
      domain: [0.6, 0.95],
      anchor: "x2"
    },
    xaxis2: {
      domain: [0.6, 0.95],
      anchor: "y2"
    }
  };
  const graphOptions = { layout: layout, filename: name, fileopt: "overwrite" };
  plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
  });

  return "Successfully builded";
};

const linspace = (start, stop, num) => {
  let result = [];
  if (num === 1) {
    for (let i = start; i < stop; i++) {
      result.push(i);
    }
  } else {
    const step = stop / num;
    for (let i = start; i < stop; i = i + step) {
      result.push(i);
    }
  }
  return result;
};

const signalGeneration = (n, w, N) => {
  let A, fi;
  let x = new Array(N);
  x.fill(0, 0, x.length);
  const frequencies = linspace(0, w, n);
  for (let i = 0; i < n; i++) {
    A = Math.random(0, 1);
    fi = Math.random(0, 1);
    for (let j = 0; j < N; j++) {
      x[j] += A * Math.sin(frequencies[i] * j + fi);
    }
  }
  return x;
};

const dftGenerator = x => {
  const N = x.length;
  let fReal = new Array(N).fill(0);
  let fImaginary = new Array(N).fill(0);
  let fp = new Array(N).fill(0);

  for (let p = 0; p < N; p++) {
    for (let k = 0; k < N; k++) {
      fReal[p] += x[k] * Math.cos(((2 * Math.PI) / N) * p * k);
      fImaginary[p] += x[k] * Math.sin(((2 * Math.PI) / N) * p * k);
    }
    fp[p] = Math.sqrt(Math.pow(fReal[p], 2) + Math.pow(fImaginary[p], 2));
  }

  return fp;
};

const fftGenerator = x => {
  const N = x.length;
  const halfN = Math.floor(N / 2);
  let freal11 = new Array(halfN).fill(0);
  let freal12 = new Array(halfN).fill(0);
  let freal1 = new Array(N).fill(0);
  let fimage11 = new Array(halfN).fill(0);
  let fimage12 = new Array(halfN).fill(0);
  new Array(N / 2).fill(0);
  let fimage1 = new Array(N).fill(0);

  let f = new Array(N).fill(0);

  for (let p = 0; p < halfN; p++) {
    for (let m = 0; m < halfN; m++) {
      freal11[p] += x[2 * m + 1] * Math.cos(((4 * Math.PI) / N) * p * m);
      fimage11[p] += x[2 * m + 1] * Math.sin(((4 * Math.PI) / N) * p * m);
      freal12[p] += x[2 * m] * Math.cos(((4 * Math.PI) / N) * p * m);
      fimage12[p] += x[2 * m] * Math.sin(((4 * Math.PI) / N) * p * m);
      freal1[p] =
        freal12[p] +
        freal11[p] * Math.cos(((2 * Math.PI) / N) * p) -
        fimage11[p] * Math.sin(((2 * Math.PI) / N) * p);
      fimage1[p] =
        fimage12[p] +
        fimage11[p] * Math.cos(((2 * Math.PI) / N) * p) +
        freal11[p] * Math.sin(((2 * Math.PI) / N) * p);
      freal1[p + N / 2] =
        freal12[p] -
        (freal11[p] * Math.cos(((2 * Math.PI) / N) * p) -
          fimage11[p] * Math.sin(((2 * Math.PI) / N) * p));
      fimage1[p + N / 2] =
        fimage12[p] -
        (fimage11[p] * Math.cos(((2 * Math.PI) / N) * p) +
          freal11[p] * Math.sin(((2 * Math.PI) / N) * p));
      f[p] = (freal1[p] ** 2 + fimage1[p] ** 2) ** 0.5;
      f[p + N / 2] = (freal1[p + N / 2] ** 2 + fimage1[p + N / 2] ** 2) ** 0.5;
    }
  }

  return f;
};

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
let N = 256; // N - number of countings

const x = signalGeneration(n, w, N);

const y = linspace(0, N, 1);

const dft = dftGenerator(x);
const fft = fftGenerator(x);

console.log({ fft, dft });

graph(dft, y, "dft");
graph(fft, y, "fft");
