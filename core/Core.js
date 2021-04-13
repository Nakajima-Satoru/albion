const expandClass = require("./expandClass.js");
const text = require("./text.js");

module.exports=class Core{

    constructor(ro,option){
        this.ro=ro;

        if(option){
            var colum=Object.keys(option);
            for(var n=0;n<colum.length;n++){
                var field=colum[n1];
                var value=option[field];
                this[field]=value;
            }
        }

        if(ro.project.config.useClass){

            var length=ro.project.config.useClass.length;
            for(var n=0;n<length;n++){
                var classType=ro.project.config.useClass[n];
                this.Model = new expandClass(ro, text.ucfirst(classType));
            }

        }
    }



}