module.exports=function(_syncList){

    var syncObject=function(){

        this.callbacks=[];

        this._index=0;

        this.then=function(callback){
            this.callbacks.push(callback);
            return this;
        };

        this.list=function(syncList){

            var o_ = new syncObject();
            for(var n=0;n<syncList.length;n++){
                o_.then(syncList[n]);
            }
            o_.run();

        };

        this.for=function(limit,callbacks){
            
            for(var n=0;n<limit;n++){
                this.callbacks.push(callbacks);
            }

            this.run();
        };

        this.foreach=function(data,callbacks){

            if(Array.isArray(data) == true){
                var length=data.length;
                for(var n=0;n<length;n++){

                    let index=n;
                    let value=data[index];

                    this.callbacks.push(function(obj){
                        callbacks(obj,index,value);
                    });
                }
            }
            else{
                if(typeof data=="object"){
                    var colum=Object.keys(data);
                    var length=colum.length;
                    for(var n=0;n<length;n++){

                        let field=colum[n]
                        let value=data[field];

                        this.callbacks.push(function(obj){
                            callbacks(obj,field,value);                        
                        });
                    }
                }
                else{
                    return;
                }
            }

            this.run();

        };

        this.run=function(){

            var cond=this;
            var next=function(){
                cond._index++;
                if(cond.callbacks[cond._index]){
                    cond.callbacks[cond._index](next);
                }
            };

            cond.callbacks[0](next);
        };

    };

    if(_syncList){
        var _s=new syncObject();
        _s.list(_syncList);
    }
    else{
        return new syncObject();
    }
    
};