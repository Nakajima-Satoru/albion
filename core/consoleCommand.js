/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * consoleCommand.js (consoleCommand)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require("fs");
const routing = require("./routing.js");
const text = require("./text.js");
const sync = require("./sync.js");
const ConsoleRequestObject = require("./consoleRequestObject.js");

const consoleCommand = function(){

    var _path="";

    /**
     * go
     * @param {*} basePath 
     * @param {*} path 
     * @param {*} cmd 
     * @returns 
     */
    this.go = function(basePath,path,cmd){

        _path=basePath+"/"+path;

        var configPath=_path+"/config/app.js";

        if(!fs.existsSync(configPath)){
            console.log("ERR: The configuration file was not found.\n\Path: \""+configPath+"\"")
            return;
        }

        var config=require(_path+"/config/app.js");

        var request=cmd[0];
        if(!request){
            request="/";
        }

        try{
            this.routeCheck(request,config);
        }catch(error){
            this.error(error,config);
        }
    };

    /**
     * routeCheck
     * @param {*} request 
     * @param {*} config 
     */
    this.routeCheck=function(request,config){

        var getRoute = routing.getShell(request,config.routing.shell.release);

        if(!getRoute){
            throw new Error("Access Page not found.");
        }

        this.setShell(getRoute);
    };

    /**
     * setShell
     * @param {*} getRoute 
     * @param {*} errorexception 
     */
    this.setShell=function(getRoute,errorexception){

        var shellName=text.ucfirst(getRoute.shell)+"Shell";

        var shellPath=_path+"/app/Shell/"+shellName+".js";

        if(!fs.existsSync(shellPath)){
            throw new Error("\""+shellName+"\" file not Found.");
        }

        var _s = require(shellPath);

        var cro=new ConsoleRequestObject();

        var cont=new _s(cro);

        if(!cont[getRoute.action]){
            throw new Error("The \""+getRoute.action+"\" method of \""+shellName+"\" is not specified.");
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

                if(getRoute.aregment){
                    cont[getRoute.action](...getRoute.aregment);
                }
                else{            
                    if(errorexception){
                        cont[getRoute.action](errorexception);
                    }
                    else{
                        cont[getRoute.action]();
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
       ]);

    };

    /**
     * error
     * @param {*} error 
     * @param {*} config 
     * @returns 
     */
    this.error=function(error,config){

        var errorName=error.name;

        var getErrorRoute=routing.getShellError(errorName,config.routing.shell.error);

        if(!getErrorRoute){
            this.simpleErrorOutput(error);
            return;
        }

        try{
            this.setShell(getErrorRoute,error);
        }catch(error2nd){
            console.log(error2nd);
            this.simpleErrorOutput(error,error2nd);
        }

    };

    /**
     * simpleErrorOutput
     * @param {*} error 
     * @param {*} error2nd 
     */
    this.simpleErrorOutput=function(error,error2nd){
        console.log(error.stack);
    };


};
module.exports = consoleCommand;