/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * allRequestCache.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */
const fs = require("./fs.js");

module.exports = function(basePath,name,config){

	var path = basePath+"/"+name;

	var useClass=config.useClass;

	for(var n1=0;n1<useClass.length;n1++){
		var className = useClass[n1];

		var search = fs.deepSearch(path+"/app/"+className);
		if(search){
			for(var n2=0;n2<search.file.length;n2++){
				var _p=search.file[n2];
				require(_p);
				console.log("## require \""+_p+"\"");
			}	
		}
	}

};