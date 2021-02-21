const express = require('express');
const cors = require('cors');
const app = express();
 
app.use(cors());

app.get('/', function (req, res) {
  res.json([
    {"fetchTime":"2021-02-19T11:00:13.394Z","firstContentfulPaint":1551.023},
    {"fetchTime":"2021-02-19T11:04:29.803Z","firstContentfulPaint":2356.7110000000002},
    {"fetchTime":"2021-02-19T11:08:50.695Z","firstContentfulPaint":1400.3519999999999},
    {"fetchTime":"2021-02-19T11:21:44.343Z","firstContentfulPaint":1303.9209999999998},
    {"fetchTime":"2021-02-19T11:30:58.461Z","firstContentfulPaint":1383.8609999999999},
    {"fetchTime":"2021-02-19T11:42:00.331Z","firstContentfulPaint":3839.842},
    {"fetchTime":"2021-02-19T19:02:38.504Z","firstContentfulPaint":3640.935},
    {"fetchTime":"2021-02-21T20:10:47.528Z","firstContentfulPaint":5775.239},
    {"fetchTime":"2021-02-21T20:11:15.957Z","firstContentfulPaint":5755.207},
    {"fetchTime":"2021-02-21T20:12:15.382Z","firstContentfulPaint":6063.418},
    {"fetchTime":"2021-02-21T20:14:38.852Z","firstContentfulPaint":4733.514}])
})
 
app.listen(3000)