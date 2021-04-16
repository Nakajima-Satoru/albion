/**
 * ==================================================
 * 
 * ALBION Ver 1.0.0
 * 
 * Validator.js
 * 
 * CopyLight: Nakajima-Satoru since 0201/04/16
 * 
 * ==================================================
 */

const Core = require("./Core.js");
const albionValidator = require("albion_validator");

module.exports=class Validator extends Core{

    /**
     * constructor
     * @param {*} ro 
     * @param {*} option 
     */
    constructor(ro,option){
        super(ro,option);
        this.validator = new albionValidator(this);
    }

    /**
     * verify
     * @param {*} data 
     * @param {*} option 
     * @returns 
     */
    verify(data, option){
        return this.validator.verify(data, option);
    }

    /**
     * addRule
     * @param {*} field 
     * @param {*} rule 
     * @param {*} message 
     * @returns 
     */
    addRule(field, rule ,message){
        return this.validator.addRule(field, rule, message);
    }
    
    /**
     * addRuleWithIndex
     * @param {*} indexName 
     * @param {*} field 
     * @param {*} rule 
     * @param {*} message 
     * @returns 
     */
    addRuleWithIndex(indexName,field,rule,message){
        return this.validator.addRuleWithIndex(indexName, field, rule, message);
    }

    /**
     * deleteRule
     * @param {*} field 
     * @param {*} index 
     * @returns 
     */
    deleteRule(field,index){
        return this.validator.deleteRule(field, index);
    }
};