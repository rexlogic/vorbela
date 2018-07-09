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
  let catText = ''
  let catTextraw = ''
  if (req.body.nlp.entities.stiridin_ro === undefined) {
    console.log('categorie nedefinita')
    catText = ''
    catTextraw = ' generale '
  }
  else {
    if (req.body.nlp.entities.stiridin_ro[0].value == 'sport' || req.body.nlp.entities.stiridin_ro[0].value == 'sportive') {
        catText = 'sports'
        catTextraw = ' din sport '
    }
    if (req.body.nlp.entities.stiridin_ro[0].value == 'bancare' || req.body.nlp.entities.stiridin_ro[0].value == 'afaceri') {
        catText = 'business'
        catTextraw = ' financiare '
    }
    if (req.body.nlp.entities.stiridin_ro[0].value == 'știință' || req.body.nlp.entities.stiridin_ro[0].value == 'științifice') {
        catText = 'science'
        catTextraw = ' din știință '
    }
    if (req.body.nlp.entities.stiridin_ro[0].value == 'mondene' || req.body.nlp.entities.stiridin_ro[0].value == 'bârfesc') {
        catText = 'entertainment'
        catTextraw = ' mondene '
    }
    if (req.body.nlp.entities.stiridin_ro[0].value == 'tehnice' || req.body.nlp.entities.stiridin_ro[0].value == 'tehnologice') {
        catText = 'technology'
        catTextraw = ' din tehnologie '
    }
  }
  let url = encodeURI('https://newsapi.org/v2/top-headlines?country=ro&category=' + catText + '&apiKey='+ process.env.NEW_APIK)
  console.log(url)
  console.log(req.body.nlp.entities)
  request(url, function (err, response, body) {
    if(err){
        res.send({
          replies: [{
            type: 'text',
            content: 'Nu pot afla știrile de azi.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
    } else {
      let st = JSON.parse(body)
      if(st.status != 'ok'){
        res.send({
          replies: [{
            type: 'text',
            content: 'Nicio știre azi.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        let stiriText = []
        for (i=0; i < st.totalResults; i++)
          if (st.articles[i].urlToImage != null) {
          stiriText.push({
            title: st.articles[i].source.name,
            imageUrl: st.articles[i].urlToImage,
            buttons: [{
              title: st.articles[i].title,
              type: 'web_url',
              value: st.articles[i].url
            }]
          })}
        
        res.send({
          replies: [
            {
              type: 'text',
              content: 'Iată știrile' + catTextraw + 'de azi:',
            },
            {
              type: 'carousel',
              content: stiriText
            }
          ], 
          conversation: {
            memory: { key: 'value' }
          }
        })    
      }
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
