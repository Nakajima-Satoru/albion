/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * routing.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const path = require("path");

module.exports={

    /**
     * convertiongScope
     * @param {*} routings 
     * @returns 
     */
    convertiongScope:function(routings){

        var buffer={};

        var colum1=Object.keys(routings);
        for(var n=0;n<colum1.length;n++){
            var scope=colum1[n];
            var value1=routings[scope];

            if(scope=="/"){ scope=""; }

            var colum2=Object.keys(value1);
            for(var n2=0;n2<colum2.length;n2++){
                var url=colum2[n2];
                var param=value1[url];

                if(url=="/"){ url=""; }

                var fullUrl=scope+url;
                if(fullUrl==""){ fullUrl="/"; }
                
                buffer[fullUrl]=param;
            }
        }

        return buffer;
    },

    convertiongScopeError:function(routings){
        
        var buffer={};

        var colum1=Object.keys(routings);
        for(var n=0;n<colum1.length;n++){
            var scope=colum1[n];
            var value1=routings[scope];

            var colum2=Object.keys(value1);
            for(var n2=0;n2<colum2.length;n2++){
                var ErrorClass=colum2[n2];
                var param=value1[ErrorClass];

                var fullUrl=scope+":"+ErrorClass;
                
                buffer[fullUrl]=param;
            }
        }

        return buffer;
    },

    /**
     * get
     * @param {*} request 
     * @param {*} routeConfigs 
     * @returns 
     */
    get:function(request,routeConfigs){

        var url=request.url;

        var url1=url.split("#");
        var hash=null;
        if(url1[1]){
            hash=url1[1];
        }
        url=url1[0];

        var url2=url.split("?");
        var query=null;
        if(url2[1]){
            query=url2[1];
        }
        url=url2[0];

        var buffer = this.checkRoute(url,routeConfigs);

        if(!buffer[0]){
            return;
        }

        if(typeof buffer[0] == "string"){
            var buff=buffer[0].split("@");
            var getRoute={
                type:"controller",
                controller:buff[0],
                action:buff[1],
                aregment:buffer[1],
            };    
            getRoute.hash=hash;
            getRoute.query=this.convertQuery(query);        
        }
        else if(typeof buffer[0] == "function"){
            var getRoute={
                type:"function",
                function:buffer[0],
                aregment:buffer[1],
            };    
            getRoute.hash=hash;
            getRoute.query=this.convertQuery(query);      
        }

        return getRoute;
    },

    /**
     * getShell
     * @param {*} request 
     * @param {*} routeConfig 
     * @returns 
     */
    getShell:function(url,routeConfigs){

        var buffer = this.checkRoute(url,routeConfigs);

        if(!buffer[0]){
            return;
        }

        var buff=buffer[0].split("@");
        var getRoute={
            shell:buff[0],
            action:buff[1],
            aregment:buffer[1],
        };

        return getRoute;
    },

    /**
     * getAssets
     * @param {*} request 
     * @param {*} assetsRoutings 
     * @returns 
     */
    getAssets:function(request,assetsRoutings){

        var url=request.url;

        var url1=url.split("#");
        var hash=null;
        if(url1[1]){
            hash=url1[1];
        }
        url=url1[0];

        var url2=url.split("?");
        var query=null;
        if(url2[1]){
            query=url2[1];
        }
        url=url2[0];

        var urls=url.split("/");
        urls.shift();

        var colum=Object.keys(assetsRoutings);
        var assetsPath=null;
        var ignorePath=null;
        for(var n=0;n<colum.length;n++){
            var field=colum[n];
            var value=assetsRoutings[field];

            if(url.indexOf(field)==0){
                ignorePath=field;
                assetsPath=value;
            }
        }

        if(!assetsPath){
            return;
        }

        if(ignorePath=="/"){
            return assetsPath+url;
        }
        
        return assetsPath+url.replace(ignorePath,"");
    },

    /**
     * getError
     * @param {*} errorName 
     * @param {*} errorRoutings 
     * @returns 
     */
    getError:function(url,errorName,errorRoutings){

        if(!errorRoutings){
            return [];
        }

        var buffer=null;
        if(errorRoutings[errorName]){
            buffer=errorRoutings[errorName];
        }

        if(!buffer){
            var urls=url.split("/");
            urls.shift();
            var scope="/"+urls[0]+":"+errorName;

            var colum=Object.keys(errorRoutings);
            for(var n=0;n<colum.length;n++){
                var errorNameOnScope=colum[n];
                var errorParam=errorRoutings[errorNameOnScope];

                if(errorNameOnScope=="/:"+errorName){
                    buffer=errorParam;
                }

                if(errorNameOnScope==scope){
                    buffer=errorParam;
                    break;
                }
            }

        }

        if(!buffer){
            return;
        }

        var buff=buffer.split("@");
        var getRoute={
            controller:buff[0],
            action:buff[1],
        };    
        return getRoute;
    },

    /**
     * getShellError
     * @param {*} errorName 
     * @param {*} errorRoutings 
     * @returns 
     */
    getShellError:function(errorName,errorRoutings){

        if(!errorRoutings){
            return [];
        }


        var buffer=null;
        if(errorRoutings[errorName]){
            buffer=errorRoutings[errorName];
        }

        console.log(errorRoutings);
        if(!buffer){
            return;
        }

        var buff=buffer.split("@");
        var getRoute={
            shell:buff[0],
            action:buff[1],
        };    
        return getRoute;
        
    },

    /**
     * checkRoute
     * @param {*} url 
     * @param {*} routeConfig 
     * @returns 
     */
    checkRoute:function(url,routeConfig){

        if(!routeConfig){
            return [];
        }

        var urls=url.split("/");
        urls.shift();

        if(!urls[urls.length-1] && urls.length>=2){
            urls.pop();
        }

        var chk1={};
        var aregments={};

        var colum=Object.keys(routeConfig);
        for(var n=0;n<colum.length;n++){

            var field=colum[n];

            var fields=field.split("/");
            fields.shift();

            chk1[field]=[];
            aregments[field]=[];

            for(var n1=0;n1<fields.length;n1++){
                
                var word1=fields[n1];
                var word2=urls[n1];

                if(word1==word2){
                    chk1[field].push(1);
                }
                else if(word1.indexOf("{:")==0 && word1.indexOf("}")>-1){
                    if(word2){
                        chk1[field].push(1);
                        aregments[field].push(word2);
                    }
                    else{
                        if(word1.indexOf("?}")>-1){
                            chk1[field].push(1);
                            if(word2){
                                aregments[field].push(word2);
                            }
                            else{
                                aregments[field].push(null);
                            }

                        }
                        else{
                            chk1[field].push(0);
                        }
                    }
                }
                else{
                    chk1[field].push(0);
                }    
            }

        }

        var getRoute=null;
        var aregment=null;

        var chekColum=Object.keys(chk1);
        for(var n=0;n<chekColum.length;n++){
            var field=chekColum[n];

            var juge=true;
            for(var nn=0;nn<chk1[field].length;nn++){

                var val=chk1[field][nn];

                if(!val){
                    juge=false;
                }
            }

            if(chk1[field].length!=urls.length){
                juge=false;                                
            }

            if(juge){
                getRoute=routeConfig[field];


                if(aregments[field].length){
                    aregment=aregments[field];
                }
                else{
                    aregment=null;
                }
            }
        }

        return [getRoute,aregment];
    },

    /**
     * convertQuery
     * @param {*} queryStr 
     * @returns 
     */
    convertQuery:function(queryStr){

        if(!queryStr){
            return null;p
        }

        var queries={};

        var buff1=queryStr.split("&");
        for(var n=0;n<buff1.length;n++){
            var buff2=buff1[n].split("=");

            queries[buff2[0]]=buff2[1];
        }

        return queries;
    },

};