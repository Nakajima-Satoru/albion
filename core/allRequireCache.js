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
				try{
					console.log("## require \""+_p+"\"");
					require(_p);
				}catch(error){
					throw new Error(error.stack);
				}
			}	
		}
	}

	if(config.templateEnging=="ejs"){
		try{
			console.log("## require \"ejs\"");
			require("ejs");
		}catch(error){
			throw new Error(error.stack);
		}
	}

	if(config.database){
		var colum=Object.keys(config.database);
		for(var n=0;n<colum.length;n++){
			try{

				var row=config.database[colum[n]];

				if(row.type=="mysql"){
					console.log("## require \"mysql\"");
					require("mysql");
				}
				else if(row.type=="sqlite3"){
					console.log("## require \"sqlite3\"");
					require("sqlite3");
				}
			
			}catch(error){
				throw new Error(error.stack);
			}

		}
	}

};