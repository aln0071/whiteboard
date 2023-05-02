const micTool = (function mic() {

  const tools = {
    pencil: "toolID-Pencil",
    line: "toolID-Straight line",
    rectangle: "toolID-Rectangle",
    ellipse: "toolID-Ellipse",
    text: "toolID-Text",
    eraser: "toolID-Eraser",
    hand: "toolID-Hand",
    grid: "toolID-Grid",
    download: "toolID-Download",
    zoom: "toolID-Zoom",
  };

  const colorMap = new Map();
  colorMap.set("black", "#000000");
  colorMap.set("red", "#FF4136");
  colorMap.set("blue", "#0074D9");
  colorMap.set("orange", "#FF851B");
  colorMap.set("yellow", "#FFDC00");
  colorMap.set("green", "#3D9970");
  colorMap.set("light green", "#91E99B");
  colorMap.set("purple", "#90468b");
  colorMap.set("sky blue", "#7FDBFF");
  colorMap.set("gray", "#AAAAAA");
  colorMap.set("pink", "#E65194");


  var active = true;
  URL = window.URL || window.webkitURL;
  var gumStream;
  //stream from getUserMedia() 
  var rec;
  //Recorder.js object 
  var input;
  //MediaStreamAudioSourceNode we'll be recording 
  // shim for AudioContext when it's not avb. 
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext;


  function stopRecording() {
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(sendDataToServer);
  }

  function sendDataToServer(blob) {
    const file = new File([blob], 'test.wav', {
      type: blob.type,
      lastModified: Date.now()
    });
    console.log(file);
    console.log(blob.type)
    var data = new FormData()
    data.append('file', blob)
    data.append('filename', 'test.wav')
    const options = {
      method: 'POST',
      body: data
    }
    fetch("http://localhost:5000/extract-tool", options)
      .then(resp => resp.json())
      .then((data) => {
        console.log(data);
        toolId = tools[data.intent];
        if (toolId !== undefined) {
          document.getElementById(toolId)?.click();
        } else {
          document.getElementById(toolId['pencil'])?.click();
        }

      }).catch((e) => {
        console.log("error" + e);
      })

    fetch("http://localhost:5000/extract-color", options)
      .then(resp => resp.json())
      .then((data) => {
        console.log(data);
        color = data.color;
        color_code = colorMap.get(color)
        console.log(colorMap.get(color))
        console.log(document.getElementById("chooseColor"))
        document.getElementById("chooseColor").value = color_code
      }).catch((e) => {
        console.log("error" + e);
      })
  }

  function startRecording() {
    var constraints = {
      audio: true,
      video: false
    }
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
      /* assign to gumStream for later use */
      gumStream = stream;
      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);
      /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
      rec = new Recorder(input, {
        numChannels: 1
      })
      //start the recording process 
      rec.record()
      console.log("Recording started");
      setTimeout(() => {
        stopRecording();
      }, 5000);
    }).catch(function (err) {
      console.log(err);
    });
  }



  function listenToUser() {
    startRecording();
  }

  return {
    name: "Mic",
    shortcut: "m",
    listeners: {},
    icon: "tools/mic/mic.svg",
    oneTouch: true,
    onstart: listenToUser,
    active,
  };
})();
