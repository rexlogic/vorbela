const express = require('express')
const bodyParser = require('body-parser')
const OpenWeatherMapHelper = require('openweathermap-node')
const app = express()
const helper = new OpenWeatherMapHelper(
    {
        APPID: process.env.OWM_APIK,
        units: 'metric'
    }
)

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

helper.getCurrentWeatherByCityName('Slatina', (err, currentWeather) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(currentWeather);
    }
})

app.get('/', function (req, res) {
  res.send('vremea')
})

app.post('/', (req, res) => {
  console.log(req.body.nlp.source)
  
  res.send({
    replies: [{
      type: 'text',
      content: 'Vremea în ' + ': ',
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
