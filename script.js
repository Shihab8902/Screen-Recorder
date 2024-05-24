//Select elements from DOM

//Video elements
const liveWindow = document.querySelector("#liveWindow");
const previewWindow = document.querySelector("#previewWindow");

//Control buttons
const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const downloader = document.querySelector("#downloader");
const downloadButton = document.querySelector("#downloadButton");
const reloadButton = document.querySelector("#reloadButton");


//Video data
let videoData = [];




//Get user media devices (Microphone + Screen capture)
const recordingHandler = navigator.mediaDevices.getDisplayMedia({
    //Get user screen mediastream
    video: {
        mediaSource: 'screen',
    },
    audio: true,

})

    .then(async (e) => {
        //Getting user audio source
        const userAudio = await navigator.mediaDevices.getUserMedia({
            audio: true, video: false
        })

        //Feed screen media stream to live preview window
        liveWindow.srcObject = e;


        //Combine audio and video media stream 
        const combinedMedia = new MediaStream([...e.getTracks(), ...userAudio.getTracks()]);

        //Recording combined media
        const recorder = new MediaRecorder(combinedMedia);


        //Start Recording 
        startButton.addEventListener("click", e => {
            recorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
            Toastify({
                text: "Recording Started!",
                duration: 3000,
                close: true,
                style: {
                    background: "#55FF55", color: "black"
                }
            }).showToast();
            videoData = [];
        });


        //Stop Recording
        stopButton.addEventListener("click", e => {
            recorder.stop();
            Toastify({
                text: "Recording Stopped!",
                duration: 3000,
                close: true,
                style: {
                    background: "#fa3a3a", color: "black"
                }

            }).showToast();


            //Push recorded data
            recorder.ondataavailable = e => {
                videoData.push(e.data);
            }

            //Convert recorded video to mp4
            recorder.onstop = () => {
                const convertedVideoData = new Blob(videoData, { type: "video/mp4" });
                downloadButton.disabled = false;
                stopButton.disabled = true;
                reloadButton.classList.remove("hidden");
                const videoURL = URL.createObjectURL(convertedVideoData);
                previewWindow.src = videoURL;
                downloader.href = videoURL;
            }


            //Reload the recording session
            reloadButton.addEventListener("click", () => {
                window.location.reload();
            })

        })


    })


