/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * Render.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

var Core = require("./core.js");
var text = require("./text.js");

module.exports=class Render extends Core{

    /**
     * rendering
     */
    rendering(){

        if(this.ro.template()){
            var html=this.ro.rendering.loadTemplate(null,true);
        }
        else{
            var html=this.ro.rendering.loadView(null,true);
        }

        this.ro.echo(html);
    }

};