/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * cli.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
process.stdin.setEncoding('utf8');

const CLI=function(setList){

    if(!setList){
        setList=[];
    }

    /**
     * push
     * @param {*} callback 
     * @returns 
     */
    this.push=function(callback){
        setList.push(callback);
        return this;
    };

    /**
     * start
     * @param {*} option 
     */
    this.start=function(option){

        if(!option){
            option={};
        }

        var _index=0;
     
        var reader = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        var callObj={
                retake:function(){
                    _index--;
                    setList[_index](callObj);
                },
                out:function(string){
                    var indent="";
                    if(option.indent){
                        indent=option.indent;
                    }
                    process.stdout.write(indent+string);
                    return this;
                },
                next:function(){
                    _index++;
                    setList[_index](callObj);
                },
                end:function(){
                    process.exit();
                },
        };

        setList[_index](callObj);
            
        reader.on('line', function(value){
    
            callObj.value=value;
    
            _index++;
    
            if(setList[_index]){
                setList[_index](callObj);
            }
            else{
                process.stdin.end();
            }
    
        });
    
        process.stdin.on('end', function(){
    
        });
        
    };

};
module.exports = CLI;