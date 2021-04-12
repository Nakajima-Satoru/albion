const fs = require("fs");
const routing = require("./routing.js");
const sync = require("./sync.js");

module.exports={
    
    go:function(ro){

        var getRoute = routing.get(ro.request, ro.project.config.routing);

        if(!getRoute){
            throw new Error("PAGE NOT FOUND.");
        }

        ro.route=getRoute;

        var controllerFullName=getRoute.controller.slice( 0, 1 ).toUpperCase() + ro.route.controller.slice( 1 )+"Controller";

        var controllerPath=ro.project.path+"/app/Controller/"+controllerFullName+".js";

        if(!fs.existsSync(controllerPath)){
            console.log("ERR: \""+controllerFullName+"\" file not Found.");
            console.log("PATH: "+controllerPath);
            ro.response.writehead(500);
            ro.response.end("ERROR"); 
            return;
        }

        var _c = require(controllerPath);

        var cont=new _c(ro);

        if(!cont[ro.route.action]){
            console.log("ERR: The \""+ro.route.action+"\" method of \""+controllerFullName+"\" is not specified.");
        //  ro.response.writehead(500);
            ro.response.end("ERROR"); 
            return;
        }

        cont.wait=function(){
            this._waited=true;
        };
        cont.next=function(){
            this._waited=false;
            this._next();
        };

        sync([
            function(next){
                cont._next=next;
                next();        
            },
            function(next){

                // call handlebefore
                if(!cont.handleBefore){
                    next();
                    return;
                }

                cont.handleBefore();
                if(!cont._waited){
                    next();
                }
            },
            function(next){

                if(ro.route.aregment){
                    cont[ro.route.action](...ro.route.aregment);
                }
                else{
                    cont[ro.route.action]();
                }

                if(!cont._waited){
                    next();
                }
            },
            function(next){

                // call handleAfter
                if(!cont.handleAfter){
                    next();
                    return;
                }

                cont.handleAfter();
                if(!cont._waited){
                    next();
                }
            },
       ]);

    },

    error:function(ro,error){
        ro.response.writeHead(404,{
            "Content-Type":"text/html",
        });
        ro.response.end("ERR: "+error.message+"\n"+error.name);
    },

    
};