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
    console.log("stopButton clicked");
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
    fetch("http://localhost:5000/extract-intent", options)
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
        console.log("here");
        stopRecording();
      }, 5000);
    }).catch(function (err) {
      console.log(err);
    });
  }



  function listenToUser() {
    console.log("ready");
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
