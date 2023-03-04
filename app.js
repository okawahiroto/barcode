    // カメラの設定
    const constraints = {
      video: { facingMode: "environment" }
    };

    // ビデオ要素の取得
    const video = document.getElementById("video");

    // カメラのストリームを取得してビデオ要素にセット
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
      });

Quagga.init({
  inputStream: {
    name: 'Live',
    type: 'LiveStream',
    // target: document.querySelector('#interactive'),//埋め込んだdivのID
    target: document.querySelector('#video'),//埋め込んだdivのID
    constraints: {
      facingMode: 'environment',
    },
    area: {//必要ならバーコードの読み取り範囲を調整できる（この場合は、上30%/下30%は読み取りしない）
      top: "30%",
      right: "0%",
      left: "0%",
      bottom: "30%"
    },
    singleChannel: false // true: only the red color-channel is read
  },
  locator: {
    patchSize: 'medium',
    halfSample: true,
  },
  numOfWorkers: 2,
  decoder: {
    readers: ['ean_reader']//ISBNは基本的にこれ（他にも種類あり）
  },
  locate: true,
}, (err) => {
  if(!err) {
    Quagga.start();
    // alert("started");
  }
})

// Quagga.onProcessed(data) => {
//   const ctx = this.Quagga.canvas.ctx.overlay;
//   const canvas = this.Quagga.canvas.dom.overlay;

//   if (!data) return;

//   // 認識したバーコードを緑の枠で囲む
//   if (data.boxes) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const hasNotRead = box => box !== data.box;
//     data.boxes.filter(hasNotRead).forEach(box => {
//       this.Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, { color: "green", lineWidth: 2 });
//     });
//   }

//   // 読み取ったバーコードを青の枠で囲む
//   if (data.box) {
//     this.Quagga.ImageDebug.drawPath(data.box, { x: 0, y: 1 }, ctx, { color: "blue", lineWidth: 2 });
//   }

//   // 読み取ったバーコードに赤い線を引く
//   if (data.codeResult && data.codeResult.code) {
//     this.Quagga.ImageDebug.drawPath(data.line, { x: "x", y: "y" }, ctx, { color: "red", lineWidth: 3 });
//   }
// };

// Quagga.onProcessed(success => {
//   console.log('prosecced');
// });

Quagga.onDetected(success => {
  const code = success.codeResult.code;
  // if(calc(code)) alert(code);
  if(calc(code)) console.log(code);
  console.log(success.codeResult.format);
  JsBarcode("#barcode", code, {format: "EAN13"});
});

const calc = isbn => {
  const arrIsbn = isbn
    .toString()
    .split("")
    .map(num => parseInt(num));
  let remainder = 0;
  const checkDigit = arrIsbn.pop();

  arrIsbn.forEach((num, index) => {
    remainder += num * (index % 2 === 0 ? 1 : 3);
  });
  remainder %= 10;
  remainder = remainder === 0 ? 0 : 10 - remainder;

  return checkDigit === remainder;
};
