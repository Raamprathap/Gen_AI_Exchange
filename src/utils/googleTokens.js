const fetch = require("node-fetch");
const connectDB = require("../config/connectDB");

const db = connectDB();
const User = db.collection("users");

async function getValidGoogleAccessToken(userId) {
  const userDoc = await User.doc(userId).get();
  const user = userDoc.data();
  if (!user?.googleAccessToken) return null;
  if (Date.now() > user.googleTokenExpiry) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: user.googleRefreshToken,
        grant_type: "refresh_token",
      }),
    });
    const newTokens = await res.json();
    await User.doc(userId).update({
      googleAccessToken: newTokens.access_token,
      googleTokenExpiry: Date.now() + newTokens.expires_in * 1000,
    });
    return newTokens.access_token;
  }
  return user.googleAccessToken;
}

module.exports = { getValidGoogleAccessToken };
