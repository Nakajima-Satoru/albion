/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * text.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

module.exports={

    /**
     * ucfirst
     * @param {*} string 
     * @returns 
     */
    ucfirst:function(string){
        return string.slice(0,1).toUpperCase() + string.slice(1);
    },

    /**
     * lcfirst
     * @param {*} string 
     * @returns 
     */
    lcfirst:function(string){
        return string.slice(0,1).toLowerCase() + string.slice(1);
    },

    /**
     * price
     * @param {*} string 
     * @returns 
     */
    price:function(string){
        return String(string).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    },

    /**
     * base64
     */
    base64:{

        /**
         * encode
         * @param {*} string 
         * @returns 
         */
        encode:function(string){
            return (Buffer.from(encodeURIComponent(string)).toString('base64'));
        },

        /**
         * decode
         * @param {*} string 
         * @returns 
         */
        decode:function(string){
            return decodeURIComponent(Buffer.from(string, 'base64').toString());
        },
    },

    /**
     * dateFormat
     * @param {*} dateString 
     * @param {*} format 
     * @returns 
     */
    dateFormat:function(dateString,format){

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
    },

};