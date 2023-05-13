let video = document.querySelector("video");
let record_cont = document.querySelector(".record-cont") ;
let capture_cont = document.querySelector(".capture-cont");
let record_btn = document.querySelector(".record-btn");
let capture_btn = document.querySelector(".capture-btn");
let timer_cont = document.querySelector(".timer-cont");
let canvas = document.querySelector("#canvas") ;
let photo = document.querySelector("#photo");
let filter_layer = document.querySelector(".filter-layer") ;
let allFilters = document.querySelectorAll(".filter") ;
media_request();
function media_request(){
    let constraints ={
        video :true,
        audio:false 
    } 
    let chunks = [] // data in parts smaller piece by piece
    // navigator is a global object gives info about browser
    let stream_promise = navigator.mediaDevices.getUserMedia(constraints) ;
    stream_promise.then((stream)=>{
        video.srcObject = stream ;

        let recorder = new MediaRecorder(stream);
        recorder.addEventListener("start" , e=>{
            chunks = [] ;
        })
        recorder.addEventListener("dataavailable" , e=>{
            chunks.push(e.data);
        })
        recorder.addEventListener("stop" , e=>{
            // converion of media chunks data to video
            let blob = new Blob(chunks,{type: "video/mp4"});
            // let videourl = URL.createObjectURL(blob);
            if(db){
                let dbTransaction = db.transaction("video","readwrite");
                let videoStore = dbTransaction.objectStore("video");
                const id = shortid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
                let videoEntry = {
                    id :`vid${id}`,
                    blobData : blob
                }
                videoStore.add(videoEntry);
            }
            // let a = document.createElement("a");
            // a.href = videourl ;
            // a.download = "stream.mp4" ;
            // a.click() ;
        })
        video_handler(recorder) ;// this function handles video recording and downloading
        capture_handler();
    }).catch(err =>{
        console.log(err);
    })
}
function video_handler(recorder){
    let record_flag = false ;
    record_cont.addEventListener("click" , e=>{
        if(!recorder)return ;
        record_flag = !record_flag ;
        if(record_flag){// start
            recorder.start();
            record_btn.classList.add("scale-record") ;
            startTimer();
        }else{// stop
            recorder.stop();
            record_btn.classList.remove("scale-record");
            stopTimer();
        }
    })
    let timerId ;
    function startTimer(){
        timer_cont.style.display = "block" ;
        let secs = 0 ;
        let hrs = 0 ;
        let mins = 0 ;

        function display_record_time(){
            secs++ ;
            if(secs === 60){mins += 1 ; secs = 0 ;}
            if(mins === 60){hrs += 1 ; mins = 0 ;}
            const hrs2 = hrs < 10 ? `0${hrs}` : hrs ;
            const mins2 = mins < 10 ? `0${mins}` : mins ;
            const secs2 = secs < 10 ? `0${secs}` : secs ;

            timer_cont.innerText = `${hrs2}:${mins2}:${secs2}` ;
        }
        timerId = setInterval(display_record_time , 1000);
    }
    function stopTimer(){
        timer_cont.innerText = "00:00:00" ;
        timer_cont.style.display = "none" ;
        clearInterval(timerId);
    }
}
function capture_handler(){
  let filter_color = "transparent" ;
  
  capture_cont.addEventListener("click" , e=>{
      capture_btn.classList.add("scale-capture");
      setTimeout(()=>{capture_btn.classList.remove("scale-capture")},500);
      takePicture();
      e.preventDefault();
  })
  function takePicture(){
    
    const width = video.videoWidth ;
    const  height = video.videoHeight ;
    canvas.setAttribute("width",width);
    canvas.setAttribute("height",height);
    const context = canvas.getContext("2d");
    context.drawImage(video , 0 , 0 , width , height);
    context.fillStyle = filter_color ;
    context.fillRect(0 , 0 , width , height);
    const photoUrl = canvas.toDataURL();
    if(db){
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        const id = shortid() //=> "Uakgb_J5m9g-0JDMbcJqLJ"
        let imageEntry = {
            id : `img${id}` ,
            url: photoUrl
        }
        imageStore.add(imageEntry);
    }
    // let a = document.createElement("a");
    // a.href = photoUrl ;
    // a.download = "image/png" ;
    // a.click();
  }
  allFilters.forEach(element => {
    element.addEventListener("click" , e=>{
        filter_color = getComputedStyle(element).getPropertyValue("background-color");
        filter_layer.style.backgroundColor = filter_color ;
    })
  });
}