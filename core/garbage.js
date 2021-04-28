/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * garbage.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
const garbage=function(ro){

    var colum=Object.keys(ro);
    for(var n=0;n<colum.length;n++){
        var field=colum[n];

        delete ro[field];
    }

};
module.exports = garbage;