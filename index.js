const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><head><title>Vorbela webhooks</title></head><body bgcolor="#ccddff"><div style="font-weight:bold; text-align:center;">VORBELA</div></body></html>')
})

app.post('/zodiac', (req, res) => {
  console.log(req.body)
  res.send({
   replies: [{
     type: 'text',
     content: 'Toate zodiile sunt norocoase azi.',
   }], 
   conversation: {
    memory: { key: 'value' }
   }
  })
})

app.post('/stiri', (req, res) => {
  console.log(req.body)
  require('dotenv').config();
  let should = require('should')
  let NewsAPI = require('./news.js');
  
  if (!process.env.NEW_APIK) throw new Error('No news API Key specified.');
  let newsapi = new NewsAPI(process.env.NEW_APIK);
   
  newsapi.v2.topHeadlines({
          language: 'ro'
        }, (err, res) => {
          if (err) {
            return done(err)
          }
          res.status.should.equal('ok')
          should.exist(res.articles)
          let textStiri = res.articles[0].title
          done()
  })
  
  res.send({
   replies: [{
     type: 'text',
     content: textStiri,
   }], 
   conversation: {
    memory: { key: 'value' }
   }
  })
})

app.post('/meteo', (req, res) => {
  console.log(req.body)
  let city = ''
  let cityraw= ''
  let apiKey = process.env.OWM_APIK
  if (req.body.nlp.entities.location_ro === undefined) {
    console.log('oras nedefinit')
    city = 'bucurești,ro'
    cityraw = 'București'
  }
  else {
    console.log(req.body.nlp.entities.location_ro[0])
    city = req.body.nlp.entities.location_ro[0].value + ',ro'
    cityraw = req.body.nlp.entities.location_ro[0].raw
  }
  let url = encodeURI('http://api.openweathermap.org/data/2.5/weather?q='+ city + '&lang=ro&units=metric&appid=' + apiKey)
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
      let wh = JSON.parse(body)
      if(wh.main == undefined){
        res.send({
          replies: [{
            type: 'text',
            content: 'Vremea este diferită de la o localitate la alta.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        let weatherText = 'Sunt ' + Math.round(wh.main.temp) + '°C și ' + wh.weather[0].description + ' în ' + cityraw + '.'
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
