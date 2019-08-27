# Amazon Price Checker

## What is this project?

The Amazon price checker is a full stack app, with the backend and server built with Nodejs/Express and Mongodb. For the client side, I used the Ionic framework (Angular version) to build a PWA, but with option to turn the client in to a full native iOS or Android app.

The purpose of the project is to allow a user to add items from Amazon to a list and to have the prices of that item tracked on the server. When an item hits a target buying price set by the user, the user will receive an email with a link to the item. Currently, the server will check the price every 6 hours, but that can be customised.

The prices for products on Amazon are gained by using [Puppeteer](https://github.com/GoogleChrome/puppeteer).

## Running the Project

### Prerequisites

- [Nodejs](https://nodejs.org/en/) - v10+
- [Mongodb](https://www.mongodb.com/) - v3 or v4
- [Ionic](https://ionicframework.com/)
- [Firebase](https://firebase.google.com/)

Nice to have:

- [Postman](https://www.getpostman.com/)
- [A GUI mongodb client](https://robomongo.org/download)

### Installation

Clone the repo to your local machine with the command:
```
git clone https://github.com/benAkehurst/amazon-price-checker.git
```

## Server

### [Server Documentation](https://github.com/benAkehurst/amazon-price-checker/tree/master/server#amazon-price-checker-nodejs-api-server)

1. In the root folder create a ```.env``` file and add the following items. The ```.env``` is used to send an email to the user if the target price is hit. To change the settings on a Gmail account to allow the sending of email from a node app, go [here](https://myaccount.google.com/lesssecureapps).

```
GMAIL_LOGIN=<A Gmail login>
GMAIL_PASSWORD=<The Gmail password>
```

2. Run the ```npm i``` command in the root server file to install the node_modules.

3. In a seperate terminal window run ```mongod``` to run Mongodb locally.

4. In the server terminal window, run ```npm run start```. This will run nodemon and keep the server running, and restart it when making a changes.

5. Now consult the readme for the server for the routes and use postman to check the server is running and responding to requests.

## Client

### [Client Documentation](https://github.com/benAkehurst/amazon-price-checker/tree/master/client/apt#amazon-price-checker-ionic-client)

1. Enter the client folder, and then the apt subfolder.

2. Run ```npm i``` to install the node_modules.

3. Run ```ionic serve``` to serve the client.

## Deploying

If you want to deploy the project, I have utalied 3 cloud services to do this.

- Datbase - I used mlad and replace the local db loacation in the DB settings in ```server.js```

- Server - I use Heroku. To deploy there you need to change the start script in the ```package.json``` to ```node server.js``` for Heroku. You will also need to use [this package](https://github.com/jontewks/puppeteer-heroku-buildpack) on Heroku to get Puppeteer to work.

- Client - I use Firebase as a static host, and follow these instructions to host and depoly the client --> [Ionic Deploy Docs](https://ionicframework.com/docs/publishing/progressive-web-app)

### FAQ's
- If you have question or suggestion, please open an issue or a PR.
