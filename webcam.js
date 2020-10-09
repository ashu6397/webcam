function onVideoFail(e) {
    console.log('webcam fail!', e);
}

function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser');
}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var video = document.querySelector('video');
var streamRecorder;
var webcamstream;

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
        const options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
        video.srcObject = stream;
        webcamstream = stream;
        streamRecorder = new MediaRecorder(stream, options);
        streamRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
            console.log("Data available");
            postDataToServer(chunks);
        };
    }).catch((error) => {
        onVideoFail(error);
    });
} else {
    alert('failed');
}
var chunks = [];
var dataSendInterval;
function startRecording() {
    streamRecorder.start();
    console.log('Recording started');
    dataSendInterval = setInterval(() => {
        streamRecorder.requestData();
    }, 5000);
}
function stopRecording() {
    webcamstream.getTracks().forEach(function (track) {
        track.stop();
        clearInterval(dataSendInterval);
        console.log('Recording stopped');
    });
}
var videoUploadCounter = 0;
function postDataToServer(videoblob) {

    var webcamData = {};
    webcamData = new Blob(videoblob, {
        type: "video/webm"
    });
    var http = new XMLHttpRequest();
    var url = 'http://localhost:8080/upload';
    http.open('POST', url);
    var recordForm = new FormData();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            onUploadSuccess();
            chunks = [];
        }
    };
    ++videoUploadCounter;
    recordForm.append("data", webcamData, "data " );
    http.send(recordForm);
}
function onUploadSuccess() {
    console.log('video uploaded');
}
