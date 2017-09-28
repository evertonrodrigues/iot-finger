const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const config = require('./config.json');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mqttClient = mqtt.connect(config.mqttBrokerUrl);

const pushButtonStartTopic = 'iotfinger/pushbutton/start';
const pushButtonDoneTopic = 'iotfinger/pushbutton/done';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/pushbutton/start', (req, res) => {
  console.log('PushButton');
  mqttClient.publish(pushButtonStartTopic, String(req.body.duration));
  res.status(200).send('Done.');
});

mqttClient.on('connect', msg => {
  console.log(`Connected to MQTT broker: ${config.mqttBrokerUrl}`);
  mqttClient.subscribe(pushButtonDoneTopic);
  http.listen(3000, () => {
    console.log('Express server listening on port 3000');
  });
});

io.on('connection', socket => {
  console.log('Socket.io client connected');
  socket.on('disconnect', () => {
    console.log('Socket.io client disconnected');
  });
});

mqttClient.on('message', (topic, message) => {
  if (topic == pushButtonDoneTopic) {
    io.emit(pushButtonDoneTopic, { 'data': message.toString() });
  }
});