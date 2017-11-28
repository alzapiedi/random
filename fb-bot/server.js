require('dotenv').config()

import Botkit from 'botkit';
import express from 'express';
import fs from 'fs';

import { fetchUsersName, sendMessage } from './graphApiUtils';

const userData = JSON.parse(fs.readFileSync('./data.json'));

const controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.access_token,
    verify_token: 'nickalzapiedi',
    app_secret: process.env.app_secret,
    validate_requests: false
});

const bot = controller.spawn({});

controller.setupWebserver(3000, (err, webserver) => {
    controller.createWebhookEndpoints(webserver, bot, () => {
      setInterval(() => {
        IDS.forEach(id => sendMessage(id, "muahahaha"));
      }, 5000);
    });
});

controller.on('message_received', (bot, message) => {
  const userId = message.user;
   controller.storage.users.get(userId, (err, user) => {
     if (user && user.name) {
       bot.reply(message, `sup ${user.name}`);
     } else {
       IDS.push(userId);
       fetchUsersName(userId)
        .then(userName => {
          controller.storage.users.save({ id: userId, name: userName}, () => {
            bot.reply(message, `hi ${userName} its nice to meet you`);
          });
        })
     }
   });
});
