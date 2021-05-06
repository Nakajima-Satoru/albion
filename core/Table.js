/**
 * ==================================================
 * 
 * FW_DAGGER Ver 1.0.0
 * 
 * Table.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const Core = require("./Core.js");

module.exports=class Table extends Core{

    /**
     * constructor
     * @param {*} ro 
     * @param {*} option 
     */
    constructor(ro,option){
        super(ro,option);

        const daggerOrm = require("fw_dagger_orm");
        this._orm=new daggerOrm(this);

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
        
        var prefix="";
        if(dbn.prefix){
            prefix=dbn.prefix;
        }

        var defaultTableName = this.constructor.name.replace(new RegExp("Table$"),"");
        defaultTableName=defaultTableName.toLowerCase();

        this.setTable(prefix+defaultTableName);

        return true;
    }

    /**
     * setTable
     * @param {*} tableName 
     * @returns 
     */
    setTable(tableName){
        return this._orm.setTable(tableName);
    }

    /**
     * setSurrogateKey
     * @param {*} field 
     * @returns 
     */
    setSurrogateKey(field){
        return this._orm.setSurrogateKey(field);
    }

    /**
     * setTimeStamp
     * @param {*} params 
     */
    setTimeStamp(params){
        return this._orm.setTimeStamp(params);
    }

    /**
     * getTimeStamp
     * @returns 
     */
    getTimeStamp(){
        return this._orm.getTimeStamp();
    }

    /**
     * setLogicalDeleteKey
     * @param {*} params 
     * @returns 
     */
    setLogicalDeleteKey(params){
        return this._orm.setLogicalDeleteKey(params);
    }

    /**
     * getLogicalDeleteKey
     * @returns 
     */
    getLogicalDeleteKey(){
        return this._orm.getLogicalDeleteKey();
    }

    /**
     * getLog
     * @returns 
     */
    getLog(){
        return this._orm.getLog();
    }
    
    /**
     * check
     * @param {*} callback 
     * @returns 
     */
    check(callback){
        return this._orm.check(callback);
    }

    /**
     * checkSurrogateKey
     */
    checkSurrogateKey(){
        return this._orm.checkSurrogateKey();
    }

    /**
     * query
     * @param {*} sql 
     * @param {*} bind 
     * @param {*} callback 
     * @returns 
     */
    query(sql,bind,callback){
        return this._orm.query(sql,bind,callback);
    }

    /**
     * select
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    select(params,callback){
        return this._orm.select(params,callback);
    }

    /**
     * save
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    save(params,option,callback){
        return this._orm.save(params,option,callback);
    }

    /**
     * insert
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    insert(params,option,callback){
        return this._orm.insert(params,option,callback);
    }

    /**
     * update
     * @param {*} params 
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    update(params,option,callback){
        return this._orm.update(params,option,callback);
    }

    /**
     * delete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    delete(params,callback){
        return this._orm.delete(params,callback);
    }

    /**
     * physicalDelete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    physicalDelete(params,callback){
        return this._orm.physicalDelete(params,callback);
    }

    /**
     * physicalDeleteSql
     * @param {*} params 
     * @returns 
     */
    physicalDeleteSql(params){
        return this._orm.physicalDeleteSql(params);
    }

    /**
     * logicalDelete
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    logicalDelete(params,callback){
        return this._orm.logicalDelete(params,callback);
    }

    /**
     * logicalDeleteSql
     * @param {*} params 
     * @returns 
     */
     logicalDeleteSql(params){
        return this._orm.logicalDeleteSql(params);
    }

    /**
     * revert
     * @param {*} params 
     * @param {*} callback 
     * @returns 
     */
    revert(params,callback){
        return this._orm.revert(params,callback);
    }

    /**
     * revertSql
     * @param {*} params 
     */
    revertSql(params){
        return this._orm.revertSql(params);
    }

    /**
     * migration
     * @returns 
     */
    migration(){
        return this._orm.migration();
    }

    /**
     * show
     * @returns 
     */
    show(){
        return this._orm.show();
    }

    /**
     * transaction
     * @param {*} callback 
     * @param {*} errCallback 
     */
    transaction(callback,errCallback){
        return this._orm.transaction(callback,errCallback);
    }

};