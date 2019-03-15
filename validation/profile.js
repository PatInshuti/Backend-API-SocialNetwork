const validator = require("validator");
const isEmpty = require('./is_Empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    

    if(! validator.isLength(data.handle, {min:2, max:40})){
        errors.handle = 'Handle needs to be between 2 and 40 characters';
    }

    if(validator.isEmpty(data.handle)){
        errors.handle = 'handle profile is required';
    }


    if(validator.isEmpty(data.status)){
        errors.status = 'Status field required';
    }

    if(validator.isEmpty(data.skills)){
        errors.skills = 'skills fields required';
    }

    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.website = 'Not a valid URL';
        }
    }
    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.website = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.faceboook)){
        if(!validator.isURL(data.faceboook)){
            errors.website = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            errors.website = 'Not a valid URL';
        }
    }

    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.website = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}; 