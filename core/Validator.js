const Core = require("./Core.js");
const albionValidator = require("albion_validator");

module.exports=class Validator extends Core{

    constructor(ro,option){
        super(ro,option);
        this.validator = new albionValidator(this);
    }

    verify(data, option){
        return this.validator.verify(data, option);
    }

    addRule(field, rule ,message){
        return this.validator.addRule(field, rule, message);
    }
    
    addRuleWithIndex(indexName,field,rule,message){
        return this.validator.addRuleWithIndex(indexName, field, rule, message);
    }

    deleteRule(field,index){
        return this.validator.deleteRule(field, index);
    }
};