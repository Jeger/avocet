const express = require('express');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const influx = require('influx')
const app = express();

const client = influx({
  host : 'localhost',
  database : 'avocet'
});

app.use(bodyParser.json());

app.post('/', function(req, res) {
  // const user = auth(req);
  console.log(req.body);
  const data = req.body.data;
  res.status(200);
  res.send();
  client.writePoint(data.batchId, {time: new Date(), temp: data.temp, flow: data.flow });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
