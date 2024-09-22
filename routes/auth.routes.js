const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config()

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/youtube/callback"
}, (accessToken, refreshToken, profile, done) => {
  
  console.log('Google Strategy Callback');
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', JSON.stringify(profile, null, 2));
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get("/youtube",passport.authenticate("google",{ scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.force-ssl'] }))
router.get('/github', passport.authenticate('github', { scope: ['user:follow'] }));

function checkIfSubscribedToYouTube(accessToken, callback) {
    fetch('https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then((response)=> {
      return response.json();
    })
    
    .then((data) => {
      var subscriptions = data.items || [];
      var isSubscribed = subscriptions.some(function(sub) {
        return sub.snippet.resourceId.channelId === process.env.BYTE_CHANNEL_ID;
      });
      callback(null, isSubscribed)
      
    }
    )
    .catch((error) => {
      console.error('Error fetching YouTube subscriptions:', error);
      callback(error, false);
  });
}

function checkIfUserFollowsGitHub(accessToken, username, callback) {
    const url = `https://api.github.com/users/${username}/following/${process.env.BYTE_GITHUB_USERNAME}`

    fetch(url, {
        headers: {
        Authorization: 'Bearer ' + accessToken
        }
    })
    .then((response)=> {
        if (response.status === 204) {
          callback(null, true);
        } else {
          callback(null, false);
        }
    })
    .catch(function(error) {
        console.error('Error checking GitHub following status:', error);
        callback(error, false);
    });
  }

router.get("/youtube/callback",passport.authenticate("google",{failureRedirect:"/"}),(req,res)=>{
    
    var accessToken = req.user.accessToken;

    checkIfSubscribedToYouTube(accessToken,(error,isSubscribed)=>{
        if(error){
            res.send("Error Occured While checking subscriptions")
        }
        else if(isSubscribed){
            res.render("dashboard")
        }
        else{
            res.send("You have not subscribed to BYTE's Youtube Channel")        
          }
    })
})

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
  var accessToken = req.user.accessToken;
  const username = req.user.profile.username;

  checkIfUserFollowsGitHub(accessToken, username, function(error, isFollowing) {
      if (error) {
      res.send('Error occurred while checking follow status.');
      } else if (isFollowing) {
        res.render("dashboard")
      } else {
        res.send("You have not followed the BYTE's Github page")
      }
  });
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router