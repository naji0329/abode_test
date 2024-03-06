const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let dotenv = require('dotenv').config()

const User = require('../model/user')

// Sign up User
router.post('/signup', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if(user) {
    return res.status(400).send({
      success: false,
      message: 'User already exists'
    });
  }

  user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }); 
  user = await user.save();

  if(!user) {
    return res.status(404).json({ success: false, message: 'User cannot be created' });
  }
  res.status(200).json({ success: true });
});

// Sign in Event
router.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = dotenv.parsed.secret;
  
  if(!user) {
    return res.status(400).send({ success: false, message: 'User with given Email not found' });
  }

  if(user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign({
      userID: user.id
    }, secret, { expiresIn: '1d' });
    res.status(200).json({
      success: true, 
      user: user.email,
      token
    });
  } else {
    res.status(400).json({
      success: false, 
      message: 'Password is mismatch'
    });
  }

});

module.exports = router;