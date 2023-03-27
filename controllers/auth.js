const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar")
const Jimp = require("jimp");
const {User} = require("../models/user");
const uuid = require('uuid');
const {sendEmail} = require("./emailServise")

const { HttpError, ctrlWrapper } = require("../helpers");
require('dotenv').config();
const {SECRET_KEY} = process.env;
const path = require("path");
const fs = require("fs/promises")

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user){
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuid.v4();
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
        verificationToken: newUser.verificationToken,
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
    })
}

const getCurrent = async(req, res)=> {
    const {email, name} = req.user;

    res.json({
        email,
        name,
    })
}

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
}

const updateAvatar = async(req, res)=> {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});
    Jimp.read(resultUpload)
    .then(image => {
      return image.resize(250, 250).write(resultUpload)})


    res.json({
        avatarURL,
    })
}

const userVerification = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });
    if (!user) {
      throw HttpError(404, 'User not found');
    }
    await User.findByIdAndUpdate(
      { email: user.email },
      {
        verificationToken: null,
        verify: true,
      }
    );
    res.status(200).json({
      status: 'OK',
      message: 'Verification successful',
    });
  };
  
  const resendEmail = async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user.verificationToken) {
      throw HttpError(409, 'Email has already been verified ');
    }
    sendEmail('tokav60731@etondy.com', user.verificationToken);
    // sendEmail(user.email, user.verificationToken);
  
    res.status(200).json({
      status: 'OK',
      message: 'Verification email sent',
    });
  };
  

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    userVerification:ctrlWrapper(userVerification),
    resendEmail:ctrlWrapper(resendEmail),
}
