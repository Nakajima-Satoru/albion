const routing = require("./routing.js");

module.exports=function(ro){

    var getRoute = routing.get(ro.request, ro.project.config.routing);

    if(!getRoute){        
        ro.response.writeHead(404,{
            "Content-Type":"text/html",
        });
        ro.response.end("OK WEB!");
        return;
    }

    ro.response.writeHead(200,{
        "Content-Type":"text/html",
    });
    ro.response.end(JSON.stringify(getRoute));
    
};