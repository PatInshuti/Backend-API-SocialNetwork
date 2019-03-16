const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema

const UserSchema = new Schema({
    
    name:{
        type: String,
        //required:true
    },

    email:{
        type:String,
        //requried:true
    },

    password:{
        type:String,
        //requried:true
    },

    avatar:{
        type:String,
        //requried:false
    },

    date:{
        type:Date,
        default:Date.now
    },
    facebook:{
        id:{
            type:String
        },
        token:{
            type:String
        },
        name:{
            type:String
        },
        email:{
            type:String
        }
    },

    google:{
        id: {
            type:String
        },
        displayName:{
            type:String
        },
        profile:{
            type:String
        },
        avatar:{
            type:String
        },
        gender:{
            type:String
        }
    },
    
    twitter:{
        id: {
            type:String
        },
        displayName:{
            type:String
        },
        profile:{
            type:String
        },
        picture:{
            type:String
        },
        gender:{
            type:String
        }
    },
    github:{
        id: {
            type:String
        },
        username:{
            type:String
        },
        fullname:{
            type:String
        },
        avatar:{
            type:String
        },
        gender:{
            type:String
        },
        bio:{
            type:String
        },
        url:{
            type:String
        }
    } 
});

module.exports = User = mongoose.model('users', UserSchema);