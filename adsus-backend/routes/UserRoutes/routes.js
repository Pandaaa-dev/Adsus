const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const authMid = require("../../utils/authMid");
const RefreshToken = require("../../models/RefreshToken");
const Video = require("../../models/Video");
const userRoutes = express.Router();

// -------------------------------------------------------------------------------------------

//// SIGN UP
userRoutes.post("/register", async (req, res) => {
  const usernameTaken = await User.find({ username: req.body.username }).exec();

  // If An account with that username already exists
  if (usernameTaken.length > 0) {
    res.status(406);
    res.error = "Username Already Taken!";
    return;
  }

  // Making the users first Token

  const token = await jwt.sign(
    {
      username: req.body.username,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "20m" }
  );

  // Making a Refresh Token

  const rToken = await jwt.sign(
    {
      username: req.body.username,
    },
    process.env.REFRESH_SECRET
  );

  // Adding a protection layer to emails
  const emailToken = await jwt.sign(
    {
      email: req.body.email,
    },
    process.env.EMAIL_SECRET
  );

  //  Hashing password
  bcrypt.genSalt(10, async function (err, salt) {
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    // Making the user
    const newUser = new User({
      username: req.body.username,
      password: passwordHash,
      email: emailToken,
    });

    await newUser.save();

    // Sending Responses
    res.status(201);
    res.send({
      token: token,
      refreshToken: rToken,
    });
  });

  // Saving the RefreshToken to the database
  const refreshToken = new RefreshToken(rToken);
  await refreshToken.save();
});

// -------------------------------------------------------------------------------------------

// Log in
userRoutes.post("login", async (req, res) => {
  // If username is in the database
  const user = await User.findOne({ username: req.body.username }).exec();
  if (user.length < 0) {
    res.send({ error: "Username Not in Database" });
    return;
  }

  // Password Check

  const isPasswordCorrect = await bcrypt.compare(
    req.body.hash,
    user[0].password
  );

  if (!isPasswordCorrect) {
    res.send({ error: "Incorrect Password!" });
    return;
  }

  //Password And Username Match
  // Making the users Tokens

  const token = await jwt.sign(
    {
      username: user.username,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "20m" }
  );

  // Making a Refresh Token

  const rToken = await jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_SECRET
  );

  // Send responses
  res.status(202);
  res.send({
    user: {
      username: user.username,
      points: user.points,
      ads_played: user.ads_played,
      isEmailConfirmed: user.isEmailConfirmed,
      role: 1
    },
    tokens: {
      t: token,
      rt: rToken,
    },
  });
  const refreshToken = new RefreshToken(rToken);
  await refreshToken.save();
});

// -------------------------------------------------------------------------------------------

// Increase Points
userRoutes.post("/increase", authMid, async (req, res) => {
  if (!req.authenticated) {
    res.status(401);
    res.send({
      error: "Refresh User Tokens",
    });
    return;
  }

  try {
    const video = await Video.find({ id: req.body.vc });
    const changeUser = await User.findOneAndUpdate(
      { username: req.username },
      { $inc: { points: video.pointsm, ads_played: 1 } }
    );
  } catch (e) {
    res.error = e;
    res.status = 401;
    res.send({
      error: "Something went wrong....",
    });
    return;
  }

  res.status = 200;
  res.send({
    newPoints: changeUser.points,
    message: "Success!",
  });
});

// -------------------------------------------------------------------------------------------
// Edit User 

userRoutes.post("/editdetails", authMid, async (req, res) => {
  if(!req.authenticated){

  }
  const user = await User.find({ username: req.username });

  if (user.username !== req.body.username) {
    res.status = 401;
    res.send({
      error: "Different usernames. Refresh User Tokens",
    });
    return;
  }

  const updateFields = { ...req.body.updateFields };

  try {
    const changedUser = await User.findOneAndUpdate(
      { username: user.username },
      updateFields
    );
  } catch (e) {
    res.error = e;
    res.status = 401;
    res.send({
      error: `Was not able to update... Please contact ${process.env.SUPPORT_EMAIL} to fix the problem`,
    });
    return;
  }

  
  let resultObj = {
   user: {
    username: changedUser.username,
    points: changedUser.points,
    ads_played: changedUser.ads_played,
    isEmailConfirmed: changedUser.isEmailConfirmed
   }
  };
  

  // If user changes their username new tokens need to be generated.
  
  if (updateFields.username) {

    // Making a new token
    const token = await jwt.sign(
      {
        username: user.username,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    // Making a Refresh Token

    const rToken = await jwt.sign(
      {
        username: user.username,
      },
      process.env.REFRESH_SECRET
    );

    resultObj = {
      user: {
        username: changedUser.username,
        points: changedUser.points,
        ads_played: changedUser.ads_played,
        isEmailConfirmed: changedUser.isEmailConfirmed,
      },
      tokens: {
        t: token,
        rt: token,
      },
    };
    RefreshToken.findOneAndUpdate(req.get('Refresh'), rToken)
  }

  res.status(200);
  res.send(resultObj);
});

// -----------------------------------------------------------------------------------------------------------

// Checking if username exists
userRoutes.get('/usernamecheck', async (req, res) => {
  
  if(!req.query.uname) return 
  const user = await User.findOne({username: req.query.uname}).exec()
  if(user.length > 0) {
    res.status(200)
    res.send({
      exists: true
    })
    return
  }
  res.status(200)
    res.send({
      exists: false
    })
})



module.exports = userRoutes;
