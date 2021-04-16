/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * ro.js (requestObject)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

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
    var _sendData={
        ro:this,
    };
    var _query={};
    var _post={};
    var _put={};

    if(this.project.config.responseHeader){
        var colum=Object.keys(this.project.config.responseHeader);
        for(var n=0;n<colum.length;n++){
            var field=colum[n];
            var value=this.project.config.responseHeader[field];
            _header[field]=value;
        }
    }

    /**
     * status
     * @param {*} type 
     * @returns 
     */
    this.status=function(type){
        if(type){
            _status=type;
            return this;
        }
        else{
            return _status;
        }
    };

    /**
     * header
     * @param {*} option 
     * @returns 
     */
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

    /**
     * echo
     * @param {*} string 
     * @returns 
     */
    this.echo=function(string){
        if(string){
            this._str+=string;
        }
        return this;
    };

    /**
     * exit
     * @param {*} string 
     * @param {*} option 
     */
    this.exit=function(string,option){
        if(!_exited){
            _autoRender=false;
            _exited=true;
            if(string){
                this._str+=string;
            }
            var setHeader={};
            var colum=Object.keys(_header);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=_header[field];
                setHeader[field]=value;
            }
            this.response.writeHead(_status,setHeader);
            this.response.end(this._str,option);    
        }
    };

    /**
     * debug
     * @param {*} objects 
     * @returns 
     */
    this.debug=function(objects){

        var str=JSON.stringify(objects,null,"   ");
        this.echo("<pre>"+str+"</pre>");

        return this;
    };

    /**
     * sanitize
     * @param {*} string 
     * @returns 
     */
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

    /**
     * setData
     * @param {*} field 
     * @param {*} value 
     * @returns 
     */
    this.setData=function(field,value){
        _sendData[field]=value;
        return this;
    };

    /**
     * setDatas
     * @param {*} values 
     * @returns 
     */
    this.setDatas=function(values){

        var colum=Object.keys(values);
        for(var n=0;n<colum.length;n++){
            var field=colum[n];
            var value=values[field];

            _sendData[field]=value;
        }
        return this;
    };

    /**
     * getData
     * @returns 
     */
    this.getData=function(){
        return _sendData;
    };

    /**
     * autoRender
     * @param {*} status 
     * @returns 
     */
    this.autoRender=function(status){
        if(status){
            _autoRender=status;
            return this;
        }
        else{
            return _autoRender;
        }
    };

    /**
     * render
     * @param {*} renderName 
     * @returns 
     */
    this.render=function(renderName){
        if(renderName){
            _render=renderName;
            return this;
        }
        else{
            return _render;
        }
    };

    /**
     * template
     * @param {*} templateName 
     * @returns 
     */
    this.template=function(templateName){
        if(templateName){
            _template=templateName;
            return this;
        }
        else{
            return _template;
        }
    };

    /**
     * view
     * @param {*} viewName 
     * @returns 
     */
    this.view=function(viewName){
        if(viewName){
            _view=viewName;
            return this;
        }
        else{
            return _view;
        }
    };

    /**
     * rendering
     */
    this.rendering={

        /**
         * loadView
         * @param {*} viewName 
         * @param {*} onErrorHandle 
         * @returns 
         */
        loadView:function(viewName,onErrorHandle){

            if(!viewName){
                viewName=cont.view();
            }

            if(!viewName){
                viewName=cont.route.action;
            }
    
            var viewPath=cont.project.path+"/render/View/"+text.ucfirst(cont.route.controller)+"/"+viewName+".html";

            if(!fs.existsSync(viewPath)){
                throw new Error("Unable to see View file \""+viewPath+"\".");
            }
            
            var string = fs.readFileSync(viewPath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");
                string = ejs.render(string, cont.getData());                
            }

            return string;
        },

        /**
         * loadTemplate
         * @param {*} templateName 
         * @param {*} onErrorHandle 
         * @returns 
         */
        loadTemplate:function(templateName, onErrorHandle){

            if(!templateName){
                templateName=cont.template();
            }

            var templatePath=cont.project.path+"/render/Template/"+templateName+".html";

            if(!fs.existsSync(templatePath)){
                throw new Error("Unable to see Template file \""+templatePath+"\".");
            }

            var string = fs.readFileSync(templatePath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");
                string = ejs.render(string, cont.getData());
            }
    
            return string;

        },

        /**
         * loadErement
         * @param {*} elementName 
         * @returns 
         */
        loadErement:function(elementName){

            var ElementPath=cont.project.path+"/render/Element/"+elementName+".html";

            if(!fs.existsSync(ElementPath)){
                if(onErrorHandle){
                    throw new Error("Unable to see Element file \""+ElementPath+"\".");
                }
                else{
                    return;
                }
            }

            var string = fs.readFileSync(templatePath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");
                string = ejs.render(string, cont.getData());
            }
    
            return string;

        },
    };

    /**
     * query
     */
    this.query={

        /**
         * set
         * @param {*} data 
         * @returns 
         */
        set:function(data){
            var colum=Object.keys(data);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=data[field];
                _query[field]=value;
            }
            return this;
        },

        /**
         * get
         * @param {} name 
         * @returns 
         */
        get:function(name){
            if(name){
                if(_query[name]){
                    return _query[name];
                }
                else{
                    return null;
                }
            }
            else{
                if(Object.keys(_query).length){
                    return _query;
                }
                else{
                    return null;
                }
            }
        },

        /**
         * delete
         * @param {*} name 
         */
        delete:function(name){
            if(name){
                delete _query[name];
            }
            else{
                _query={};
            }
        },
    };

    /**
     * post
     */
    this.post={

        /**
         * set
         * @param {*} data 
         * @returns 
         */
        set:function(data){
            var colum=Object.keys(data);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=data[field];
                _post[field]=value;
            }
            return this;
        },

        /**
         * get
         * @param {*} name 
         * @returns 
         */
        get:function(name){
            if(name){
                if(_post[name]){
                    return _post[name];
                }
            }
            else{
                if(Object.keys(_post).length){
                    return _post;
                }
                else{
                    return null;
                }
            }
        },

        /**
         * delete
         * @param {*} name 
         */
        delete:function(name){
            if(name){
                delete _post[name];
            }
            else{
                _post={};
            }
        },
    };

    /**
     * put
     */
    this.put={

        /**
         * set
         * @param {*} data 
         * @returns 
         */
        set:function(data){
            var colum=Object.keys(data);
            for(var n=0;n<colum.length;n++){
                var field=colum[n];
                var value=data[field];
                _put[field]=value;
            }
            return this;
        },

        /**
         * get
         * @param {*} name 
         * @returns 
         */
        get:function(name){
            if(name){
                if(_put[name]){
                    return _put[name];
                }
            }
            else{
                if(Object.keys(_put).length){
                    return _put;
                }
                else{
                    return null;
                }
            }
        },

        /**
         * delete
         * @param {*} name 
         */
        delete:function(name){
            if(name){
                delete _put[name];
            }
            else{
                _put={};
            }
        },
    };

};
module.exports=requestObject;