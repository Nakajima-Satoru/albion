module.exports=function(ro){

    console.log("OK");

    ro.response.writeHead(200,{
        "Content-Type":"text/html",
    });
    ro.response.end("OK WEB!");
    
};