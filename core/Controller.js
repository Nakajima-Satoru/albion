/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * Controller.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const fs = require("fs");
const core = require("./core.js");
const text = require("./text.js");

module.exports=class Controller extends core{

    /**
     * constructor
     * @param {*} ro 
     */
    constructor(ro){
        super(ro);
        this.autoRender=false;
        this.viewName=ro.route.actoun;
    }

    /**
     * _rendering
     * @returns 
     */
    _rendering(){

        if(!this.ro.autoRender()){
            return;
        }

        var renderClassName=this.ro.render();

        if(!renderClassName){
            var Render=require("./Render.js");
        }
        else{
            renderClassName=text.ucfirst(renderClassName)+"Render";
            var renderPath = ro.project.path+"/app/Render/"+renderClassName+".js";
            if(!fs.existsSync(renderPath)){
                throw new Error("\""+renderClassName+"\" class not found")
            }
            var Render=require(renderPath);
        }

        var render = new Render(this.ro);

        render.rendering();

    }

};