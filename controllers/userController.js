const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const confirm_user = await User.findOne({ email });
  if (confirm_user) {
    res.status(401);
    throw new Error("User already exists!");
  }
  //   hashPassword
  const hashPassword = await bcrypt.hash(password, 10);
  const addUser = await User.create({
    username,
    email,
    password: hashPassword,
  });
  res.status(201).json(addUser);
});
// @desc Login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const confirm_if_user_exists = await User.findOne({ email });
  if(confirm_if_user_exists && (await bcrypt.compare(password, confirm_if_user_exists.password)))
  {
    const accessToken = jwt.sign({
        user:{
            username: confirm_if_user_exists.username,
            email: confirm_if_user_exists.email,
            id:confirm_if_user_exists.id
        }
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"10m"}
    )
    res.status(200).json({accessToken});
  }
  
});
// @desc Current  user details
// @route GET /api/users/current
// @access public
const currentUser = asyncHandler(async (req, res) => {
  res.status(201).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };