const validator = require("validator");
const isEmpty = require('./is_Empty');

module.exports = function validatePostInput(data){
    let errors = {};
    data.text = !isEmpty(data.text) ? data.text : '';

    if(validator.isEmpty(data.text)){
        errors.text = 'text field is required';
    }

    if(! validator.isLength(data.text, {min:10, max:300})){
        errors.text = 'Text must be between 10 and 300';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}; 
