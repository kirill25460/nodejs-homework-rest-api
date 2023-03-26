<<<<<<< HEAD
const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL: {
        type: String,
        required: true,
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const schemas = {
    registerSchema,
    loginSchema,
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}
=======
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: {
    type: String,
    default: null,
  },
});

const User = model('user', userSchema);

module.exports = User;
>>>>>>> 748d259cd76629227a7eb358dc979a86a63dd3d2
