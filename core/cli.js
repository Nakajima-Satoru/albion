/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * cli.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
const CLI=function(){

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var reader = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var requestCallback=[];
    var requestIndex=0;

    reader.on('line', function(value){
        requestIndex++;
        var retake=function(){
            requestIndex--;
        };
        requestCallback[requestIndex-1](value,retake);
        return true;
    });

    process.stdin.on('end', function () {
        //do something
    });

    this.commandMode = true;
    
    /**
     * echo
     * @param {*} str 
     * @param {*} color 
     * @returns 
     */
    this.echo=function(str,color){
        var strings=str.toString();

        var colors={
            black   : '\u001b[30m',
            red     : '\u001b[31m',
            green   : '\u001b[32m',
            yellow  : '\u001b[33m',
            blue    : '\u001b[34m',
            magenta : '\u001b[35m',
            cyan    : '\u001b[36m',
            white   : '\u001b[37m',
        };

        if(color){
            strings=colors[color]+strings+colors.white;
        }

        process.stdout.write(strings);
        return this;
    };

    /**
     * input
     * @param {*} callback 
     * @returns 
     */
    this.input=function(callback){
        requestCallback.push(callback);
        return this;
    };

    /**
     * exit
     */
    this.exit=function(){
        process.exit(0);
    };

};
module.exports = CLI;