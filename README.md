<img src="public/logo-whitebg.png" style="height:80px" alt="Timeboard logo" />

# Timeboard

**A web app for storing times and displaying a leaderboard at events.**

## Technologies used

[Vue.js](https://vuejs.org) | [TypeScript](https://www.typescriptlang.org) | [Nuxt](https://nuxt.com) | [Tailwind CSS](https://tailwindcss.com)

**This web app currently uses the release candidate version of [nuxt/image](https://image.nuxt.com), and will receive updates as it progresses towards a stable release.** If you are experiencing issues with images on the web app during deployment, or otherwise wish to opt out of this, you may wish to check out the `safe-img` branch.


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

