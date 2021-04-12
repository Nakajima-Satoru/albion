const fs = require('fs');
const generator = require("alvion/core/generator.js");

module.exports={

    listen:function(basePath,name){

        var configPath=name+"/config/app.js";

        if(!fs.existsSync(configPath)){
            console.log("ERR: The configuration file was not found.\n\Path: \""+configPath+"\"")
            return;
        }

        var config=require(basePath+"/"+name+"/config/app.js");

        if(config.https){
            this.listenhttps(basePath,name,config);
        }
        else{
            this.listenhttp(basePath,name,config);
        }

    },
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

            generator(requestObj);

        }).listen(443);
    
    },

    listenhttp:function(basePath,name,config){

        var http=require("http");

        if(!config.port){
            config.port="80";
        }

        console.log("# SERVER LISTEN START PORT="+config.port);

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

            generator(requestObj);

        }).listen(config.port);

    },

}

var requestObject=function(params){

    this.request=params.req;
    this.response=params.res;
    this.project=params.project;

};