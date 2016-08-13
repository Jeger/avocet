const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const influx = require('influx')
const app = express();

const client = influx({
  host : 'localhost',
  database : 'avocet'
});

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.status(401);
      res.send();
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'process.env.HOOK_USERNAME' && user.pass === 'process.env.HOOK_PASSWORD') {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.use(bodyParser.json());

app.post('/', auth, function(req, res) {
  const data = req.body.data;
  res.status(200);
  res.send();
  client.writePoint(data.batchId, {time: new Date(), temp: data.temp, flow: data.flow });
});

app.listen(3000, function () {
  console.log('Webhook running!');
});
