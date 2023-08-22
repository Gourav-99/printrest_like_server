// passport.js

import passport from "passport";
import { User } from "../database";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((id, done) => {
  // User.findById(id, (err: Error, doc: IMongoDBUser) => {
  //   // Whatever we return goes to the client and binds to the req.user property
  //   return done(null, doc);
  // });
  return done(null, id);
});
// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID ||
        "1077413334268-f1e5co6raqdo7lv24qdlhp7gnmjjf505.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      callbackURL:
        "https://3z5n8hb7u8.execute-api.ap-south-1.amazonaws.com/oauth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Update the user's information if they exist
          console.log("already exists");
          user.googleId = profile.id;
          user.isOauthUser = true;

          user.profilePicture = profile.photos[0].value;
          await user.save();
        } else {
          // Create a new user if they don't exist
          console.log("new creating");
          user = await User.create({
            googleId: profile.id,
            isOauthUser: true,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicture: profile.photos[0].value,
          });
        }
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
// Twitter Strategy
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: TWITTER_CONSUMER_KEY,
//       consumerSecret: TWITTER_CONSUMER_SECRET,
//       callbackURL: "/oauth/twitter/callback",
//     },
//     function (token, tokenSecret, profile, cb) {
//       User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
export default passport;
