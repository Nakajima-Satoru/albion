var Core = require("./core.js");
var text = require("./text.js");

module.exports=class Render extends Core{

    rendering(){

        if(this.ro.template.get()){
            var html=this.ro.rendering.loadTemplate(null,true);
        }
        else{
            var html=this.ro.rendering.loadView(null,true);
        }
/*
        if(this.ro.project.config.templateEnging=="ejs"){
            var ejs=require("ejs");
            html = ejs.render(html, this.ro.getData());                
        }
*/
        this.ro.echo(html);
    }

};