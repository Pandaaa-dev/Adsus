const mongoose = require('mongoose')

// REFRESH TOKENS TO STAY ALERT ABOUT STOLEN TOKENS

const TokenSchema = new mongoose.Schema(String);
const RefreshToken = mongoose.model("RefreshTokens", TokenSchema);


module.exports = RefreshToken