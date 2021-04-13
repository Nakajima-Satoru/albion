const fs = require("fs");
const text = require("./text.js");

const expandClass=function(ro,classType){

    this.load=function(classNameList){

        if(typeof classNameList === "string"){
            classNameList = [classNameList];
        }

        for(var n=0;n<classNameList.length;n++){

            var className = text.ucfirst(classNameList[n]);

            var _o = this.get(className);

            if(_o){
                this[className] = _o;
            }

        }

    };

    this.get=function(className,option){

        className = text.ucfirst(className);

        var classFullName = className+classType;

        var path=ro.project.path+"/app/"+classType+"/"+classFullName+".js";

        if(!fs.existsSync(path)){
            return;
        }

        var _class = require(path);

        var _o = new _class(ro,option);

        if(_o.handleBefore){
            _o.handleBefore();
        }

        return _o;
    };

};

module.exports=expandClass;