<img src="public/logo-whitebg.png" style="height:80px" alt="Timeboard logo" />

# Timeboard

**A web app for storing times and displaying a leaderboard at events.**

While the web app should work well for most small events that have a use for it, it has a security system that may be too weak for some cases. While this web app can work well as a display, I would not recommend using it as the single source of truth at events where there are significant stakes (monetary or otherwise) dependent on the times posted.

## Technologies used

[Vue.js](https://vuejs.org) | [TypeScript](https://www.typescriptlang.org) | [Nuxt](https://nuxt.com) | [Tailwind CSS](https://tailwindcss.com)


## Deploying the web app

### Run locally

Install Node.js and npm on your system if they are not already installed.

To build and run the web app locally, run the following commands:

```sh
npm install
npm run build
npm run preview
```

If you need the web app to run on a specific port (or need to avoid collisions with other apps/services), replace the last command with
```sh
PORT=nnnn npm run preview
```
where `nnnn` is the port number.

### Deploy to the internet

To deploy an instance of this web app on the internet, follow [these instructions](https://nuxt.com/docs/getting-started/deployment) and/or instructions from your hosting provider to deploy a Nuxt web app.


## Setting up the web app

It is strongly recommended to complete initial setup before your event takes place to minimise inconvenience and security risks.

When you first open the web app in a web browser, an initial set of data is created on the server, with an empty leaderboard, a few default settings, and the default password `admin`.

To begin setting up the web app, go to the organisers login page, log in using the default password `admin`, then **follow the prompts to change the password immediately.** 

Once you have changed the password, you will be taken to the settings page, where you can change settings related to how the leaderboard is displayed.

Once you are happy with the settings, usse the links in the navigation bar to go back to the leaderboard.


## Using the web app

There are two types of users of this web app:
- Event organisers, who login with a password, and are able to add and remove times and change settings. The password should not be shared with anyone who is not an organiser.
- Partipants and other users, who are able to view the current leaderboard. 

