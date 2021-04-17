/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
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

        const albionOrm = require("albion_orm");
        this._orm=new albionOrm(this);

        if(ro.project.config.database.default){
            var defaultConectData=ro.project.config.database.default;
            this._orm.connection(defaultConectData);
        }

        var defaultTableName = this.constructor.name.replace("Table","");
        defaultTableName=defaultTableName.toLowerCase();

        var prefix="";
        if(ro.project.config.database.default.prefix){
            prefix=ro.project.config.database.default.prefix;
        }
        this.setTable(prefix+defaultTableName);

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
     * check
     * @returns 
     */
    check(){
        return this._orm.check();
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
     * @param {*} option 
     * @param {*} callback 
     * @returns 
     */
    delete(params,option,callback){
        return this._orm.delete(params,option,callback);
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