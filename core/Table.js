const Core = require("./Core.js");

module.exports=class Table extends Core{

    constructor(ro,option){
        super(ro,option);

        const albionOrm = require("albion_orm");
        this._orm=new albionOrm(this);

        if(ro.project.config.database.default){
            var defaultConectData=ro.project.config.database.default;
            this._orm.connection(defaultConectData);
        }

    }

    connection(params){
        return this._orm.connection(params);
    }

    setTable(tableName){
        return this._orm.setTable(tableName);
    }

    check(){
        return this._orm.check();
    }

    query(sql,bind,callback){
        return this._orm.query(sql,bind,callback);
    }

    select(params,callback){
        return this._orm.select(params,callback);
    }

    save(params,option,callback){
        return this._orm.save(params,option,callback);
    }

    insert(params,option,callback){
        return this._orm.insert(params,option,callback);
    }

    update(params,option,callback){
        return this._orm.update(params,option,callback);
    }

    delete(params,callback){
        return this._orm.delete(params,callback);
    }

    migration(){
        return this._orm.migration();
    }

    show(){
        return this._orm.show();
    }

};