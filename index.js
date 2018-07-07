const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><head><title>Vremea webhook</title></head><body bgcolor="#ccddff"><div style="font-weight:bold; text-align:center;">VREMEA</div></body></html>')
})

app.post('/', (req, res) => {
  console.log(req.body)
  let city = ''
  let apiKey = process.env.OWM_APIK
  if (req.body.nlp.entities.location_ro == undefined) {
    console.log('oras nedefinit')
    city = 'București,ro'
  }
  else {
    console.log(req.body.nlp.entities.location_ro[0])
    city = req.body.nlp.entities.location_ro[0].value + ',ro'
  }
  let url = 'http://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=metric&lang=ro&appid=' + apiKey
  console.log(url)
  request(url, function (err, response, body) {
    if(err){
        res.send({
          replies: [{
            type: 'text',
            content: 'Nu știu cum e vremea acum.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.send({
          replies: [{
            type: 'text',
            content: 'În ce localitate vrei să știi cum e vremea?',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        console.log(weather.weather[0].description)
        let weatherText = 'Sunt ' + weather.main.temp + '°C în ' + weather.name + ', și '
         res.send({
          replies: [{
            type: 'text',
            content: weatherText,
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })      
      }
    }
})
})

app.post('/errors', (req, res) => {
  console.log(req.body) 
  res.send() 
}) 

app.listen(app.get('port'), () => { 
  console.log('Server is running on port 5000') 
})
