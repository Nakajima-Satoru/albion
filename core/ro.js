var text = require("./text.js");
var fs = require("fs");

var requestObject=function(params){

    var cont=this;

    this._str="";

    this.request=params.req;
    this.response=params.res;
    this.project=params.project;

    var _status=200;
    var _header={};
    var _exited=false;
    var _autoRender=false;
    var _render=null;
    var _template=null;
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

    this.autoRender={
        set:function(status){
            _autoRender=status;
            return this;
        },
        get:function(){
            return _autoRender;
        },
    };

    this.render={
        set:function(renderName){
            _render=renderName;
            return this;
        },
        get:function(){
            return _render;
        },
    };

    this.template={
        set:function(templateName){
            _template=templateName;
            return this;
        },
        get:function(){
            return _template;
        },
    };

    this.view={
        set:function(viewName){
            _view=viewName;
            return this;
        },
        get:function(){
            return _view;
        },
    };

    this.rendering={

        loadView:function(viewName){

            if(!viewName){
                viewName=cont.view.get();
            }

            if(!viewName){
                viewName=cont.route.action;
            }
    
            var viewPath=cont.project.path+"/render/View/"+text.ucfirst(cont.route.controller)+"/"+viewName+".html";

            if(!fs.existsSync(viewPath)){
                return;
            }
            
            var string = fs.readFileSync(viewPath).toString();

            return string;
        },

        loadTemplate:function(templateName){

            if(!templateName){
                templateName=cont.template.get();
            }

            var templatePath=cont.project.path+"/render/Template/"+templateName+".html";

            if(!fs.existsSync(templatePath)){
                return;
            }

            var string = fs.readFileSync(templatePath).toString();

            return string;

        },

        loadErement:function(elementName){


        },
    };

};
module.exports=requestObject;