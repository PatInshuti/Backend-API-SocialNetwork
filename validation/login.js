const validator = require("validator");
const isEmpty = require('./is_Empty');

module.exports = function validateLoginInput(data){
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }

    if(! validator.isEmail(data.email)){
        errors.email = 'Name field is required';
    }


    if(validator.isEmpty(data.password)){
        errors.password = 'password field is required';
    }

    if(! validator.isLength(data.password, {min:3, max:30})){
        errors.password = 'password must be between 3 and 30';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}; 
