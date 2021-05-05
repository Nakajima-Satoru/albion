/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * ro.js (requestObject)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

var text = require("./text.js");
var fs = require("fs");
const garbage = require("./garbage.js");

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
        if(option){
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
        }
        else{
            return _header;
        }
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

            var status=parseInt(this.status());

            if(!(status>=400 && status<=499)){
                this.logWrite.access();
                if(status!=200){
                    if(this.error){
                        this.logWrite.error(this.error.stack);
                    }
                }    
            }
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
     * redirect
     * @param {*} url 
     */
    this.redirect=function(url){
        this
            .status(302)
            .header({
                Location:url,
            })
            .exit();
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
        if(typeof status == "boolean"){
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
        if(templateName !== undefined){
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
        if(viewName !== undefined){
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
                var errorStr = "Unable to see View file \""+viewPath+"\".";
                return errorStr;
            }
            
            var string = fs.readFileSync(viewPath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");

                if(cont.myClass.Ui){
                    cont.setData("Ui",cont.myClass.Ui);
                }

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
                var errorStr = "Unable to see Template file \""+templatePath+"\".";
                return errorStr;
            }

            var string = fs.readFileSync(templatePath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");

                if(cont.myClass.Ui){
                    cont.setData("Ui",cont.myClass.Ui);
                }

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
                    var errorStr = "Unable to see Element file \""+ElementPath+"\".";
                    return errorStr;
                }
                else{
                    return;
                }
            }

            var string = fs.readFileSync(templatePath).toString();

            if(cont.project.config.templateEnging=="ejs"){
                var ejs=require("ejs");

                if(cont.myClass.Ui){
                    cont.setData("Ui",cont.myClass.Ui);
                }
                
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

    /**
     * logWrite
     */
    this.logWrite={

        /**
         * convert
         * @param {*} format 
         * @param {*} content 
         * @returns 
         */
        convert:function(format,content){

            if(!content){
                content="";
            }

            format=format.split("[datetime]").join(text.dateFormat(null,"Y/m/d H:i:s"));
            format=format.split("[year]").join(text.dateFormat(null,"Y"));
            format=format.split("[month]").join(text.dateFormat(null,"m"));
            format=format.split("[day]").join(text.dateFormat(null,"d"));
            format=format.split("[method]").join(cont.method);
            format=format.split("[requestUrl]").join(cont.request.url);
            format=format.split("[responseCode]").join(cont.status());
            format=format.split("[remoteIp]").join(cont.request.connection.remoteAddress);
            format=format.split("[content]").join(content);

            return format;
        },

        /**
         * _
         * @param {*} type 
         * @param {*} fileName 
         * @param {*} content 
         */
        _:function(type, fileName, content){

            if(!fs.existsSync(cont.project.path+"/.log")){
                fs.mkdirSync(cont.project.path+"/.log");
            }

            if(type){
                if(cont.project.config.log[type].file){
                    fileName=cont.project.config.log[type].file;
                }    
            }
            fileName=cont.logWrite.convert(fileName);

            var appendPath=cont.project.path+"/.log/"+fileName;
        
            var format=content;
            if(type){
                format=cont.project.config.log[type].format;
            }              
            format=cont.logWrite.convert(format,content);

            fs.appendFileSync(appendPath,format+"\n");
    
        },

        /**
         * normal
         * @param {*} fileName 
         * @param {*} content 
         */
        normal:function(fileName,content){
            cont.logWrite._("",fileName,content);
        },

        /**
         * access
         */
        access:function(){

            if(!cont.project.config.log){
                return;
            }
        
            if(!cont.project.config.log.access){
                return;
            }

            cont.logWrite._("access","access.log");
        },

        /**
         * error
         * @param {*} content 
         * @returns 
         */
        error:function(content){

            if(!cont.project.config.log){
                return;
            }
        
            if(!cont.project.config.log.error){
                return;
            }
        
            cont.logWrite._("error","error.log",content);
        },
    };

    /**
     * throw
     * @param {*} errorMessage
     */
    this.throw=function(errorMessage){

        var error=new Error();
        error.message="[ALB_ERROR]"+errorMessage;

        const generator = require("./generator.js");
        generator.error(this,error);

    };
    
};
module.exports=requestObject;