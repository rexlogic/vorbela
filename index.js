const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

var location = 'Slatina'

function getWeather (location) => {
  const params = {
    q: location,
    APPID: process.env.OWM_APIK,
    units: 'metric',
    lang: 'ro'
  }

  return axios.get('https://api.openweathermap.org/data/2.5/weather', { params })
    .then(({ data }) => data)
}

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('vremea')
})

app.post('/', (req, res) => {
  console.log(req.body.nlp.source)

  res.send({
    replies: [{
      type: 'text',
      content: 'Vremea în ' + location + ': ' + getWeather(location),
    }], 
    conversation: {
      memory: { key: 'value' }
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
