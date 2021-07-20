/**
 * ==================================================
 * 
 * m02
 * 
 * dateFormat.js (dateFormat)
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const DateFormat = function(dateString,format){

    if(dateString){
        var d_=new Date(dateString);
    }
    else{
        var d_=new Date();
    }

    var str=format;

    str=str.replace("Y",d_.getFullYear());
    str=str.replace("m",("0"+(d_.getMonth()+1)).slice(-2));
    str=str.replace("d",("0"+d_.getDate()).slice(-2));   

    str=str.replace("H",("0"+d_.getHours()).slice(-2));
    str=str.replace("i",("0"+d_.getMinutes()).slice(-2));
    str=str.replace("s",("0"+d_.getSeconds()).slice(-2));
    
    return str;
};
module.exports=DateFormat;