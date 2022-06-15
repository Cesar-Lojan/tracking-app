const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const imagen = document.getElementById("imagen");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let button_text = document.getElementById("button-text");   
let nextImageButton = document.getElementById("nextimagebutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1;
let isVideo = false;
let model = null;

// video.width = 500
// video.height = 400

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    console.log("video started", status);
    if (status) {
      updateNote.innerText = "";
      isVideo = true;
      runDetection();
    } else {
      updateNote.innerText = "";
    }
  });
}

function toggleVideo() {
  if (!isVideo) {
    button_text.innerText = "Starting video";
    startVideo();
  } else {
    button_text.innerText = "Stopping video";
    handTrack.stopVideo(video);
    isVideo = false;
    button_text.innerText = "Video stopped";
  }
}

nextImageButton.addEventListener("click", function () {
  nextImage();
});

trackButton.addEventListener("click", function () {
  toggleVideo();
});

function nextImage() {
  imgindex++;
  handimg.src = "images/" + (imgindex % 9) + ".jpg";
  // alert(handimg.src)
  setTimeout(() => {
    runDetectionImage(handimg);
  }, 500);
}

function runDetection() {
  model.detect(video).then((predictions) => {
    //console.log("Predictions ABC: ", predictions);
    predictions.forEach(element => {
        //console.log(element.label);
        if(element.label == 'open') {
            imagen.setAttribute('src','abrir.jpg');
        } else 
        if(element.label == 'face') {
            imagen.setAttribute('src','cara.jpg');
        } else 
        if(element.label == 'closed') {
            imagen.setAttribute('src','cerrado.png');
        } else 
        if(element.label == 'point') {
            imagen.setAttribute('src','mano.jpg');
        }
    });
    model.renderPredictions(predictions, canvas, context, video);
    if (isVideo) {
      requestAnimationFrame(runDetection);
      
    }
  });
}

function runDetectionImage(img) {
  model.detect(img).then((predictions) => {
    console.log("Predictions XYZ: ", predictions);
    console.log("************************8888");
    model.renderPredictions(predictions, canvas, context, img);
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  console.log(model);
  updateNote.innerText = "Contenido cargado";
  runDetectionImage(handimg);
  trackButton.disabled = false;
  nextImageButton.disabled = false;
  updateNote.innerText = "";
});