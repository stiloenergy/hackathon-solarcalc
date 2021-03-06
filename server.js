var express = require('express');
var _ = require("underscore");
var app = express();
var calculator = require('./public/js/solarCalculations/sunCalculator')
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/api', function (req, res) {
  var area = req.query.area,
    state = req.query.state,
    residents = req.query.residents,
    kind = req.query.kind;
    withBattery = req.query.withBattery;

  calc =  calculator();
  calc.setBattery(withBattery);
  var result = calc.calculateSolarCap(area, state, residents, kind);

  res.json(result);
});
var port = Number(process.env.PORT || 8081);
http.listen(port);
console.log("App listening on port "+port);