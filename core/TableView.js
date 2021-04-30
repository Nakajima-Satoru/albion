/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * TableView.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const Core = require("./Core.js");

module.exports=class TableView extends Core{

   /**
     * constructor
     * @param {*} ro 
     * @param {*} option 
     */
    constructor(ro,option){
        super(ro,option);

        const albionOrm = require("albion_orm");
        this._orm=new albionOrm(this);

        this.changeDb();
    }

    /**
     * connection
     * @param {*} params 
     * @returns 
     */
    connection(params){
        return this._orm.connection(params);
    }

    /**
     * changeDb
     * @param {*} databaseName 
     * @returns 
     */
    changeDb(databaseName){

        if(!databaseName){
            databaseName="default";
        }

        if(typeof databaseName=="string"){

            if(!this.ro.project.config.database[databaseName]){
                return false;
            }
    
            var dbn=this.ro.project.config.database[databaseName];
            this._orm.connection(dbn);
    
        }
        else if(typeof databaseName == "object"){
            this._orm.connection(databaseName);
        }
 
        return true;
    }

    /**
     * getLog
     * @returns 
     */
     getLog(){
        return this._orm.getLog();
    }

    /**
     * _setSelectObj
     * @returns 
     */
    _setSelectObj(){
        if(this._orm.constructor.name != "OrmSelect"){
            return this.select();
        }
        else{
            return this._orm;
        }
    }

    /**
     * select
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
     select(params,callback){       
        this._orm.setTable("("+this.viewSql+") AS _TABLE");
        return this._orm.select(params,callback);
    }

    /**
     * where
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @param {*} logicalOperand 
     * @returns 
     */
    where(field,operand,value,index,logicalOperand){
        var obj=this._setSelectObj();
        obj.where(field,operand,value,index,logicalOperand);
        return this;
    }

    /**
     * whereAnd
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @returns 
     */
     whereAnd(field,operand,value,index){
        var obj=this._setSelectObj();
        obj.whereAnd(field,operand,value,index);
        return this;
    }

    /**
     * whereOr
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} index 
     * @returns 
     */
     whereOr(field,operand,value,index){
        var obj=this._setSelectObj();
        obj.whereOr(field,operand,value,index);
        return this;
    };

    /**
     * field
     * @param {*} fields 
     * @returns 
     */
     field(fields){
        var obj=this._setSelectObj();
        obj.field(fields);
        return this;
    }

    /**
     * limit
     * @param {*} limit 
     * @param {*} offset 
     * @returns 
     */
     limit(limit,offset){
        var obj=this._setSelectObj();
        obj.limit(limit,offset);
        return this;
    }

    /**
     * orderBy
     * @param {*} field 
     * @param {*} sort 
     * @returns 
     */
     orderBy(field,sort){
        var obj=this._setSelectObj();
        obj.orderBy(field,sort);
        return this;
    }

    /**
     * groupBy
     * @param {*} field 
     * @returns 
     */
     groupBy(field){
        var obj=this._setSelectObj();
        obj.groupBy(field);
        return this;
    }

    /**
     * distinct
     * @param {*} status 
     * @returns 
     */
     distinct(status){
        var obj=this._setSelectObj();
        obj.distinct(status);
        return this;
    }

    /**
     * all
     * @param {*} callback 
     * @param {*} type 
     * @param {*} field 
     */
    all(callback,type,field){
        var obj=this._setSelectObj();
        return obj.all(callback,type,field);
    }

    /**
     * first
     * @param {*} callback 
     */
    first(callback){
        var obj=this._setSelectObj();
        return obj.first(callback);
    }

    /**
     * value
     * @param {*} field 
     * @param {*} callback 
     * @param {*} option 
     */
     value(field,callback,option){
        var obj=this._setSelectObj();
        return obj.value(field,callback,option);
    }

    /**
     * min
     * @param {*} field 
     * @param {*} callback 
     */
     min(field,callback){
        var obj=this._setSelectObj();
        return obj.min(field,callback);
    }

    /**
     * max
     * @param {*} field 
     * @param {*} callback 
     */
    max(field,callback){
        var obj=this._setSelectObj();
        return obj.max(field,callback);
    }

    /**
     * avg
     * @param {*} field 
     * @param {*} callback 
     */
    avg(field,callback){
        var obj=this._setSelectObj();
        return obj.avg(field,callback);
    }

    /**
     * sum
     * @param {*} field 
     * @param {*} callback 
     */
    sum(field,callback){
        var obj=this._setSelectObj();
        return obj.sum(field,callback);
    }

    /**
     * list
     * @param {*} field 
     * @param {*} callback 
     */
    list(field,callback){
        var obj=this._setSelectObj();
        return obj.list(field,callback);
    }

    /**
     * count
     * @param {*} callback 
     */
    count(callback){
        var obj=this._setSelectObj();
        return obj.count(callback);
    }

    /**
     * paginate
     * @param {*} limit 
     * @param {*} page 
     * @param {*} callback 
     */
    paginate(limit,page,callback){
        var obj=this._setSelectObj();
        return obj.paginate(limit,page,callback);
    }

    /**
     * sql
     * @returns 
     */
    sql(){
        var obj=this._setSelectObj();
        return obj.sql();
    }

};