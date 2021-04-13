const fs = require("fs");
const path = require("path");
const routing = require("./routing.js");
const sync = require("./sync.js");
const text = require("./text.js");

module.exports={
    
    go:function(ro){

        var getRoute = routing.get(ro.request, ro.project.config.routing.release);

        if(!getRoute){
            var getRouteAsset = routing.getAssets(ro.request,ro.project.config.routing.assets);

            if(getRouteAsset){
                this.goAssets(ro,getRouteAsset);
                return;
            }
            else{
                ro.status(404);
                throw new Error("Access Page not found.");
            }    
        }

        ro.route=getRoute;

        this.setController(ro);

/*
        var controllerFullName=text.ucfirst(ro.route.controller)+"Controller";

        var controllerPath=ro.project.path+"/app/Controller/"+controllerFullName+".js";

        if(!fs.existsSync(controllerPath)){
            ro.status(500);
            throw new Error("\""+controllerFullName+"\" file not Found.");
        }

        var _c = require(controllerPath);

        var cont=new _c(ro);

        if(!cont[ro.route.action]){
            ro.status(500);
            throw new Error("The \""+ro.route.action+"\" method of \""+controllerFullName+"\" is not specified.");
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
            function(next){

                // rendering
                cont._rendering();
                next();

            },
            function(next){
                ro.exit();
            },
       ]);
*/
    },

    goAssets:function(ro,assetsPath){

        var _path=ro.project.path+"/"+assetsPath;

        if(!fs.existsSync(_path)){
            throw new Error("PAGE NOT FOUND2");
        }

        if(fs.statSync(_path).isDirectory()){
            ro.status(404);
            throw new Error("PAGE NOT FOUND3");
        }

        var ext=path.extname(_path).split(".").join("");

        var content=fs.readFileSync(_path,"binary");

        var mimeType="text/plain";
        if(ro.project.config.assetsMimeType[ext]){
            mimeType=ro.project.config.assetsMimeType[ext];
        }

        var cacheControl="";
        if(ro.project.config.assetsControlCache){
            cacheControl=ro.project.config.assetsControlCache;
        }

        ro.header({
            "Content-Type":mimeType+" ;charset=utf-8",
            "Cache-Control":cacheControl,
        });
        ro.exit(content,"binary");
    },

    error:function(ro,error){

        var errorName=error.name;

        var getErrorRoute=routing.getError(errorName, ro.project.config.routing.error);

        if(!getErrorRoute){
            this.simpleErrorOutput(ro,error);
        }

        var _beforeRoute=ro.route;
        ro.route=getErrorRoute;
        ro.beforeRoute=_beforeRoute;

        try{

            if(!ro.project.config.debugMode){
                error.stack="Invalid Error.";
            }

            this.setController(ro,error);
        }catch(error2nd){
            console.log(error2nd);
            this.simpleErrorOutput(ro,error,error2nd);
        }

    },

    setController:function(ro,errorexception){

        var controllerFullName=text.ucfirst(ro.route.controller)+"Controller";

        var controllerPath=ro.project.path+"/app/Controller/"+controllerFullName+".js";

        if(!fs.existsSync(controllerPath)){
            ro.status(500);
            throw new Error("\""+controllerFullName+"\" file not Found.");
        }

        var _c = require(controllerPath);

        var cont=new _c(ro);

        if(!cont[ro.route.action]){
            ro.status(500);
            throw new Error("The \""+ro.route.action+"\" method of \""+controllerFullName+"\" is not specified.");
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

                if(errorexception){
                    cont.handleBefore(errorexception);
                }
                else{
                    cont.handleBefore();
                }

                if(!cont._waited){
                    next();
                }
            },
            function(next){

                if(ro.route.aregment){
                    cont[ro.route.action](...ro.route.aregment);
                }
                else{            
                    if(errorexception){
                        cont[ro.route.action](errorexception);
                    }
                    else{
                        cont[ro.route.action]();
                    }
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

                if(errorexception){
                    cont.handleAfter(errorexception);
                }
                else{
                    cont.handleAfter();
                }
                
                if(!cont._waited){
                    next();
                }
            },
            function(next){

                // rendering
                cont._rendering();
                next();

            },
            function(next){
                ro.exit();
            },
       ]);

    },

    simpleErrorOutput:function(ro,error,error2nd){

        if(ro.project.config.debugMode){
            var errorStr=error.stack
            if(error2nd){
                errorStr+="\n\n"+error2nd.stack;
            }
            ro.exit("<pre>"+errorStr+"</pre>");
        }
        else{          
            ro.exit("<pre>Invalid Error.</pre>");
        }

    },

    
};