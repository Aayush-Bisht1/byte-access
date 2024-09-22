# B.Y.T.E - Access

## Introduction
Build a system that restricts access to a page using a private route. Only users subscribed to B.Y.T.E.'s YouTube channel at YouTube or following the GitHub account at GitHub can access it.

## Implementation :
1.Install Passport.js: npm install passport passport-github2
2.Configure the GitHub strategy in Passport with your OAuth credentials.
3.Use the passport.authenticate() method to handle the GitHub OAuth flow and verify the user’s follow status.
4.Set up callback routes to handle OAuth tokens and redirect users.


## Features
• Google OAuth 2.0 Authentication
• YouTube subscription verification
• GitHub follow status check
• Protected routes based on authentication status
• User-friendly interface for login and status display
• Secure session management
• Cross-Origin Resource Sharing (CORS) support

## Authentication Flow
1.User clicks the "Login with Google" button
2.User is redirected to Google's OAuth consent screen
3.User grants permissions
4.Google redirects back to the application with an authentication code
5.Backend exchanges the code for access tokens
6.User's basic profile information is retrieved
7.YouTube subscription and GitHub follow status are checked
8.User session is created, and the user is redirected to the dashboard

## Subscription and Follow Checks
• YouTube subscription check: Verifies if the user is subscribed to the specified YouTube channel using the YouTube Data API
• GitHub follow check: Verifies if the user is following the specified GitHub account using the GitHub API
