const fs = require("fs");
const core = require("./core.js");
const text = require("./text.js");

module.exports=class Controller extends core{

    constructor(ro){
        super(ro);
        this.autoRender=false;
        this.viewName=ro.route.actoun;
    }

    _rendering(){

        if(!this.ro.getAutoRender()){
            return;
        }

        var renderClassName=this.ro.getRender();

        if(!renderClassName){
            var render=require("./Render.js");
        }
        else{
            renderClassName=text.ucfirst(renderClassName)+"Render";
            var renderPath = ro.project.path+"/app/Render/"+renderClassName+".js";
            if(!fs.existsSync(renderPath)){
                throw new Error("\""+renderClassName+"\" class not found")
            }
            var render=require(renderPath);
        }

        var viewName=this.ro.getView();

        if(!viewName){
            viewName=this.ro.route.action;
        }

        console.log(render);


    }

};