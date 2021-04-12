var fs=require("fs");

fs.deepSearch=function(path){

    var getDirList=fs.readdirSync(path);

    var list={
        dir:[],
        file:[],
    };

    for(var n=0;n<getDirList.length;n++){

        var p_=path+"/"+getDirList[n];

        var stat = fs.statSync(p_);

        if(stat.isDirectory()){

            list.dir.push(p_);

            var buffer=fs.deepSearch(p_);

            for(var n2=0;n2<buffer.dir.length;n2++){
                list.dir.push(buffer.dir[n2]);
            }
            for(var n2=0;n2<buffer.file.length;n2++){
                list.file.push(buffer.file[n2]);
            }
        }
        else{
            list.file.push(p_);
        }
    }

    return list;

};

module.exports=fs;