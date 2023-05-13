let refresh = document.querySelector("#refresh");
let gallery_cont = document.querySelector(".gallery-cont");
let media_cont = document.querySelector(".media-cont");
refresh.addEventListener("click" , e=>{
    if(db){
        // console.log("hello gallery");
        const dbTransaction = db.transaction("video","readwrite");
        const videoStore = dbTransaction.objectStore("video");
        videoStore.openCursor().onsuccess = (event)=>{
            const cursor = event.target.result ;
            if(cursor){
                pushVideoInGallery(cursor);
                // console.log("key is" + cursor.key + "value is");
                cursor.continue();
            }else{
                // console.log("no more entries");
            }
        }
        
    }
    if(db){
        //this is for images
        const dbTransaction = db.transaction("image","readwrite");
        const imageStore = dbTransaction.objectStore("image");
        imageStore.openCursor().onsuccess = (event)=>{
            const cursor = event.target.result ;
            if(cursor){
                pushImageInGallery(cursor);
                // console.log("key is" + cursor.key + "value is");
                cursor.continue();
            }else{
                console.log("no more entries");
            }
        }
    }
})
function pushImageInGallery(cursor){
    const imgurl = cursor.value.url ;
    const media = document.createElement("div") ;
    media.classList.add("media-cont");
    media.setAttribute("id" , cursor.key);
    media.innerHTML = `
        <div class="media">
            <img src="${imgurl}" alt="image"></img>
        </div>
        <div class="delete">Delete</div>
        <div class="download">Download</div>
    `
    gallery_cont.appendChild(media);

    media.querySelector(".delete").addEventListener("click" , delete_function);
    media.querySelector(".download").addEventListener("click" ,(e)=>{
        download_function(e ,imgurl);
    });
}
function pushVideoInGallery(cursor){
    let blobData = cursor.value.blobData ;
    let videourl = URL.createObjectURL(blobData);
    const media = document.createElement("div") ;
    media.classList.add("media-cont");
    media.setAttribute("id" , cursor.key);
    media.innerHTML = `
        <div class="media">
            <video src="${videourl}" autoplay></video>
        </div>
        <div class="delete">Delete</div>
        <div class="download">Download</div>
    `
    gallery_cont.appendChild(media);
    media.querySelector(".delete").addEventListener("click" , delete_function);
    media.querySelector(".download").addEventListener("click" , e=>{
        download_function(e , videourl);
    });
}
function delete_function(e){
    const id  = e.target.parentElement.getAttribute("id");
    if(id.slice(0,3) === "img"){
        const dbTransaction = db.transaction("image","readwrite");
        const imageStore = dbTransaction.objectStore("image");
        imageStore.delete(id);
    }else{
        const dbTransaction = db.transaction("video","readwrite");
        const videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);
    }
    e.target.parentElement.remove();
}
function download_function(e , url){
    const id  = e.target.parentElement.getAttribute("id");
    const a = document.createElement("a") ;
    a.href = url ;
    if(id.slice(0,3) === "img"){
        a.download = "image.jpg" ;
        // a.download = "image/png" ;
    }else{
        a.download = "video/mp4"
    }
    a.click();
}

setTimeout(()=>{
    refresh.click();
    refresh.remove();
} , 500) ;
