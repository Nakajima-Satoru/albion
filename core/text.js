/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * text.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

module.exports={

    ucfirst:function(string){
        return string.slice(0,1).toUpperCase() + string.slice(1);
    },

    lcfirst:function(string){
        return string.slice(0,1).toLowerCase() + string.slice(1);
    },

    price:function(string){
        return String(string).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },

};