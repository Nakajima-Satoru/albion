var requestObject=function(params){

    this._str="";

    this.request=params.req;
    this.response=params.res;
    this.project=params.project;

    var _status=200;
    var _header={};
    var _exited=false;
    var _autoRender=false;
    var _render=null;
    var _view=null;

    if(this.project.config.responseHeader){
        _header=this.project.config.responseHeader;
    }

    this.status=function(type){
        if(type){
            _status=type;
            return this;
        }
        else{
            return _status;
        }
    };

    this.header=function(option){
        var colum=Object.keys(option);
        for(var n=0;n<colum.length;n++){
            var field=colum[n];
            var value=option[field];

            if(value){
                _header[field]=value;
            }
            else{
                delete _header[field];                
            }
        }
        return this;
    };

    this.echo=function(string){
        if(string){
            this._str+=string;
        }
        return this;
    };

    this.exit=function(string){
        if(!_exited){
            _exited=true;
            if(string){
                this._str+=string;
            }
            this.response.writeHead(_status,_header);
            this.response.end(this._str);    
        }
    };

    this.debug=function(objects){

        var str=JSON.stringify(objects,null,"\t");
        this.echo("<pre>"+str+"</pre>");

        return this;
    };

    this.sanitize=function(string){

        var saList={
            "<":"&lt;",
            ">":"&gt;",
            " ":"&nbsp;",
            "&":"&amp;",
            "©":"&copy;",
            "®":"&reg;",
            "™":"&trade;",
            '"':"&quot;",
            "'":"&#39;",
            "¥":"&yen;",
        };

        var colum=Object.keys(saList);

        for(var n=0;n<colum.length;n++){
            var target=colum[n];
            var value=saList[target];
            
            string=string.split(target).join(value);
        }

        return string;
    };

    this.setAutoRender=function(status){
        _autoRender=status;
        return this;
    };

    this.getAutoRender=function(){
        return _autoRender;
    }

    this.setRender=function(renderName){
        _render=renderName;
        return this;
    };

    this.getRender=function(){
        return _render;
    };

    this.setView=function(viewName){
        _view=viewName;
        return this;
    };
    
    this.getView=function(){
        return _view;
    };
    
};
module.exports=requestObject;