/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * consoleRequestObject.js (ConsoleRequestObject)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
const CLI = require("./cli.js");

const ConsoleRequestObject = function(){

    var cli=new CLI();

    var cliColum=Object.keys(cli);
    for(var n=0;n<cliColum.length;n++){
        var field=cliColum[n];
        var object=cli[field];

        this[field]=object;
    }

};
module.exports = ConsoleRequestObject;