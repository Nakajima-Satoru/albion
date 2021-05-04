/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * hash.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const crypto = require('crypto');

const hash = function(hashName,text){

    if(!text){
        text="";
    }

    if(!hashName){
        hashName="sha256";
    }

    return crypto.createHash(hashName).update(text).digest('hex');

};
module.exports = hash;
