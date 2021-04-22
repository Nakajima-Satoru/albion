/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * generator.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require("fs");
const url = require('url');
const path = require("path");
const routing = require("./routing.js");
const sync = require("./sync.js");
const text = require("./text.js");

module.exports={
    
    /**
     * go
     * @param {*} ro 
     * @returns 
     */
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
        ro.method=ro.request.method;
        ro.query.set(url.parse(ro.request.url, true).query);

        if(ro.method=="POST" || ro.method=="PUT"){

            var _postData = "";

            var cont = this;

            // get post data
            ro.request.on('data', function(chunk){
                _postData += chunk.toString();
            });

            ro.request.on('end', function(){

                _postData=cont.convertPostData(ro,_postData);
            
                if(ro.method=="POST"){
                    ro.post.set(_postData);
                }
                else if(ro.method=="PUT"){
                    ro.put.set(_postData);
                }

                if(getRoute.type == "controller"){
                    cont.setController(ro);
                }
                else if(getRoute.type == "function"){
                    cont.setFunction(ro);
                }
      
            });

        }
        else{
            
            if(getRoute.type == "controller"){
                this.setController(ro);
            }
            else if(getRoute.type == "function"){
                this.setFunction(ro);
            }

        }

    },

    /**
     * goAssets
     * @param {*} ro 
     * @param {*} assetsPath 
     */
    goAssets:function(ro,assetsPath){

        var _path=ro.project.path+"/"+assetsPath;

        if(!fs.existsSync(_path)){
            ro.status(404);
            throw new Error("PAGE NOT FOUND2");
        }

        if(fs.statSync(_path).isDirectory()){

            var juge=false;

            if(ro.project.config.assetsIndexFiles){

                var indexFiles = ro.project.config.assetsIndexFiles;

                for(var n=0;n<indexFiles.length;n++){
                    var fileName=indexFiles[n];

                    if(fs.statSync(_path+fileName)){
                        juge=true;
                        _path+=fileName;
                        break;
                    }
                }
            }

            if(!juge){
                ro.status(404);
                throw new Error("PAGE NOT FOUND3");    
            }
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

    /**
     * error
     * @param {*} ro 
     * @param {*} error 
     */
    error:function(ro,error){

        var errorName=error.name;

        if(!ro.status() || ro.status()==200){
            ro.status(500);
        }
        ro.error=error;

        var getErrorRoute=routing.getError(ro.request.url,errorName, ro.project.config.routing.error);

        if(!getErrorRoute){
            this.simpleErrorOutput(ro,error);
            return;
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

    /**
     * setController
     * @param {*} ro 
     * @param {*} errorexception 
     */
    setController:function(ro,errorexception){

        var controllerFullName=text.ucfirst(ro.route.controller)+"Controller";

        var controllerPath=ro.project.path+"/app/Controller/"+controllerFullName+".js";

        if(!fs.existsSync(controllerPath)){
            ro.status(500);
            throw new Error("\""+controllerFullName+"\" file not Found.");
        }

        if(!ro.project.config.requireCache){
            delete(require.cache[path.resolve(controllerPath)]);
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

    setFunction:function(ro){

        var _sync=new FunctionSync();

        sync([
            function(next){
                _sync.next=function(){
                    this._waited=false;
                    next();
                };
                next();    
            },
            function(next){
                ro.route.function(ro,_sync);

                if(!_sync._waited){
                    next();
                }
            },
            function(){
                ro.exit();
            },
        ]);

    },

    /**
     * simpleErrorOutput
     * @param {*} ro 
     * @param {*} error 
     * @param {*} error2nd 
     */
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

    /**
     * convertPostData
     * @param {*} ro 
     * @param {*} postDataStr 
     * @returns 
     */
    convertPostData:function(ro,postDataStr){

        var contentType=ro.request.headers["content-type"];

        if(contentType=="application/json"){
            return JSON.parse(postDataStr);
        }
        else if(contentType.indexOf("multipart/form-data")>-1){

            // comming soon....

        }
        else{
            postDataStr=decodeURI(postDataStr);

            var buff=postDataStr.split("&");

            var response={};
            for(var n=0;n<buff.length;n++){
                var buff2=buff[n].split("=");
                var field=buff2[0];
                var value=buff2[1];

                if(field.indexOf("[]")>0){
                    field=field.replace("[]","");
                    if(!response[field]){
                        response[field]=[];
                    }

                    response[field].push(value);
                }
                else if(field.indexOf("[")>0){

                    field=field.split("]").join("").split("[");

                    if(field.length==2){
                        if(!response[field[0]]){
                            response[field[0]]={};
                        }
                        response[field[0]][field[1]]=value;
                    }

                    if(field.length==3){
                        if(!response[field[0]][field[1]]){
                            response[field[0]][field[1]]={};
                        }
                        response[field[0]][field[1]][field[2]]=value;
                    }

                    if(field.length==3){
                        if(!response[field[0]][field[1]][field[2]]){
                            response[field[0]][field[1]][field[2]]={};
                        }
                        response[field[0]][field[1]][field[2]][field[3]]=value;
                    }

                }
                else{

                    response[field]=value;
                }
            }
    
            return response;

        }

    },

};
const FunctionSync=function(){

    this._waited=false;

    this.wait=function(){
        this._waited=true;
    };

};