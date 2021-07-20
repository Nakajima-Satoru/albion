/**
 * ==================================================
 * 
 * m02
 * 
 * expandClass.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require("fs");
const path = require("path");
const text = require("./text.js");

const expandClass=function(ro,classType){

    /**
     * load
     * @param {*} classNameList 
     */
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

    /**
     * get
     * @param {*} className 
     * @param {*} option 
     * @returns 
     */
    this.get=function(className,option){

        className = text.ucfirst(className);

        var classFullName = className+classType;

        var _path=ro.project.path+"/app/"+classType+"/"+classFullName+".js";

        if(!fs.existsSync(_path)){
            return;
        }

        if(!ro.project.config.requireCache){
            delete(require.cache[path.resolve(_path)]);
        }

        var _class = require(_path);

        var _o = new _class(ro,option);

        if(_o.handleBefore){
            _o.handleBefore();
        }

        return _o;
    };

};
module.exports=expandClass;