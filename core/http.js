/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * http.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require('fs');
const os = require('os');
const generator = require("./generator.js");
const routing = require("./routing.js");
const requestObject = require("./ro.js");

module.exports={

    /**
     * listen
     * @param {*} basePath 
     * @param {*} name 
     * @param {*} option 
     * @returns 
     */
    listen:function(basePath,name,option){

/**
        setInterval(function(){
            var p=process.memoryUsage();
            fs.appendFile("memory.log",p.rss+"\n",function(){});
            delete p;
        },1000);
*/
        var configPath=basePath+"/"+name+"/config/app.js";

        if(!fs.existsSync(configPath)){
            console.log("ERR: The configuration file was not found.\n\Path: \""+configPath+"\"")
            return;
        }

        var config=require(basePath+"/"+name+"/config/app.js");

        if(option){
            if(option.port){
                config.port=option.port;
            }    
        }

        config = this.setConfig(config);

        this.garbageCollect(config);

        if(config.https){
            this.listenhttps(basePath,name,config);
        }
        else{
            this.listenhttp(basePath,name,config);
        }

    },

    /**
     * setConfig
     * @param {*} config 
     * @returns 
     */
    setConfig:function(config){

        if(!config.templateEnging){
            config.templateEnging="ejs";
        }

        if(config.routing.pages.releaseScope){
            config.routing.pages.release = routing.convertiongScope(config.routing.pages.release);
        }

        if(config.routing.pages.errorScope){
            config.routing.pages.error = routing.convertiongScopeError(config.routing.pages.error);
        }

        return config;
    },

    /**
     * listenhttps
     * @param {*} basePath 
     * @param {*} name 
     * @param {*} config 
     * @returns 
     */
    listenhttps:function(basePath,name,config){
          
        var https=require("https");

        if(!options.sslServerKey){
            console.log("ERR : \"SslServerKey\" is not set in the config file.");
            return;
        }
        if(!options.sslServerCrt){
            console.log("ERR : \"sslServerCrt\" is not set in the config file.");
            return;
        }
        if(fs.existsSync(basePath+"/"+config.ssl_server_key)){
            console.log("ERR: The SSL Server Key file was not found. \""+config.sslServerKey+"\"");
            return;
        }
        if(fs.existsSync(basePath+"/"+config.sslServerCrt)){
            console.log("ERR: The SSL Server Cetification file was not found. \""+config.sslServerCrt+"\"");
            return;
        }

        var options = {
                key: fs.readFileSync(config.sslServerKey),
                cert: fs.readFileSync(config.sslServerCrt)
        };

        var hostName="localhost";
        if(config.host){
            hostName=config.host;
        }

        https.createServer(options, function (req,res) {

            var requestObj=new requestObject({
                project:{
                    name:name,
                    path:basePath+"/"+name,
                    config:config,
                },
                req:req,
                res:res,
            });

            try{
                generator.go(requestObj);
            }catch(err){
                generator.error(requestObj,err);
            }

        }).listen(config.port,hostName,function(){
            var port="";
            if(config.port!=80){
                port=config.port;
            }
            console.log("------------------------------------------------");
            console.log("Server running at https://"+hostName+":"+port+"/");
            console.log("..");
            console.log("");
        });
    
    },

    /**
     * listenhttp
     * @param {*} basePath 
     * @param {*} name 
     * @param {*} config 
     */
    listenhttp:function(basePath,name,config){

        var http=require("http");

        if(!config.port){
            config.port="80";
        }

        console.log("# SERVER LISTEN START PORT="+config.port);
  
        var hostName="localhost";
        if(config.host){
            hostName=config.host;
        }

        http.createServer({},function(req,res){

            var requestObj=new requestObject({
                project:{
                    name:name,
                    path:basePath+"/"+name,
                    config:config,
                },
                req:req,
                res:res,
            });
            
            try{
                generator.go(requestObj);
                return;
            }catch(err){
                generator.error(requestObj,err);
            }

        }).listen(config.port,hostName,function(){
            var port="";
            if(config.port!=80){
                port=config.port;
            }
            console.log("------------------------------------------------");
            console.log("Server running at http://"+hostName+":"+port+"/");
            console.log("..");
            console.log("");
        });

    },

    /**
     * garbageCollect
     * @param {*} config 
     */
    garbageCollect:function(config){

        if(config.garbageCollectionInterval){
            var gcInterval=config.garbageCollectionInterval;
            var sss= setInterval(function(){
                try{
                    global.gc();
                }catch(err){
                    console.log(err);
                    clearInterval(sss);
                }
            },gcInterval*1000);
        }

    },

};