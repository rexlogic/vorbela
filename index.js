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
  console.log(req.body.nlp.source)
  let city = 'Slatina'
  let apiKey = process.env.OWM_APIK
  let url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}'
  console.log(url)
  request(url, function (err, response, body) {
    if(err){
        res.send({
          replies: [{
            type: 'text',
            content: 'eroare url',
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
            content: 'eroare oras',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        let weatherText = 'Sunt ${weather.main.temp} de grade în ${weather.name}!'
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
