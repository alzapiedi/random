require('dotenv').config()

import http from 'superagent';

const GRAPH_API_URL = 'https://graph.facebook.com/v2.9';

export function sendMessage(id, text) {
  http.post(`${GRAPH_API_URL}/me/messages`)
    .set('Content-Type', 'application/json')
    .send({
      recipient: { id },
      message: { text },
      access_token: process.env.access_token
    })
    .then(response => {})
    .catch(e => console.log(e.message));
}

function getName(obj) {
  if (obj.name) return obj.name;
  return `${obj.first_name} ${obj.last_name}`;
}

export function fetchUsersName(id) {
  return http.get(`${GRAPH_API_URL}/${id}?access_token=${process.env.access_token}`)
  .then(res => {
    console.log(res.text);
    const user = JSON.parse(res.text);
    const name = getName(user);
    return name;
  })
  .catch(err => {
    console.log('error fetching users name');
  });
}
