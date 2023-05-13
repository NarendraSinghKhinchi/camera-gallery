let db;
setup_database();
function setup_database(){
    const request = window.indexedDB.open("MyDatabase" ,1);
    // The second parameter to the open method is the version of the database. 
    // The version of the database determines the database schema — the object stores in the database and their structure.
    //  If the database doesn't already exist, it is created by the open operation, then an onupgradeneeded event is triggered,
    //  and you create the database schema in the handler for this event.
    request.onerror = (event) =>{
        console.log(event) ;
        // some error occured while requesting 
    }
    request.onsuccess = (event)=>{
        // do something with request.result!
        db = event.target.result;
        db.onerror = (event) => {
            // Generic error handler for all errors targeted at this database's
            // requests!
            console.error(`Database error: ${event.target.errorCode}`);
        };
    }// object store can only be created in onupgradeneeded
    request.onupgradeneeded = (event)=>{
        //tried to access a version that is higher than available
        db = event.target.result ;
        db.createObjectStore("video",{keyPath : "id"});
        db.createObjectStore("image",{keyPath:"id"});
    }
}

