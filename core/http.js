/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * http.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require('fs');
const generator = require("./generator.js");
const requestObject = require("./ro.js");

module.exports={

    /**
     * listen
     * @param {*} basePath 
     * @param {*} name 
     * @returns 
     */
    listen:function(basePath,name){

        var configPath=basePath+"/"+name+"/config/app.js";

        if(!fs.existsSync(configPath)){
            console.log("ERR: The configuration file was not found.\n\Path: \""+configPath+"\"")
            return;
        }

        var config=require(basePath+"/"+name+"/config/app.js");

        if(!config.templateEnging){
            config.templateEnging="ejs";
        }

        if(config.https){
            this.listenhttps(basePath,name,config);
        }
        else{
            this.listenhttp(basePath,name,config);
        }

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
                console.error(err);
                generator.error(requestObj,err);
            }

        }).listen(443);
    
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
        console.log("....");

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
                console.error(err);
                generator.error(requestObj,err);
            }

        }).listen(config.port);

    },

};