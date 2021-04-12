module.exports={

    get:function(request,routeConfig){

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

        var getRoute = this.checkRoute(url,routeConfig);
        if(getRoute){
            getRoute.hash=hash;
            getRoute.query=this.convertQuery(query);    
        }

        return getRoute;

    },

    checkRoute:function(url,routeConfig){

        var urls=url.split("/");
        urls.shift();

        var chk1={};
        var aregments={};

        var colum=Object.keys(routeConfig.release);
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

            if(juge){
                getRoute=routeConfig.release[field];
                if(aregments[field].length){
                    aregment=aregments[field];
                }
                else{
                    aregment=null;
                }
            }
        }

        var response=null;
        if(getRoute){
            var buff=getRoute.split("@");
            response={
                controller:buff[0],
                action:buff[1],
                aregment:aregment,
            };    
        }

        return response;
    },

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