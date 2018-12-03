const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const datef = require('dateformat')
const math = require('mathjs')
const app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><head><title>Vorbela webhooks</title></head><body bgcolor="#ccddff"><div style="font-weight:bold; text-align:center;"><a href="http://www.mnemonic.ml/vorbela/">VORBELA</a></div></body></html>')
})

app.post('/mate', (req, res) => {
  console.log(req.body)
  let rez = 0
  let urlm = encodeURI('http://api.mathjs.org/v4/?expr=') + encodeURIComponent('0+0')
  if (req.body.nlp.entities.math_ro === undefined) {
    console.log('expresie nedefinita')
    urlm = encodeURI('http://api.mathjs.org/v4/?expr=') + encodeURIComponent('0+0')
  } else {
    console.log(req.body.nlp.entities.math_ro[0])
    urlm = encodeURI('http://api.mathjs.org/v4/?expr=') + encodeURIComponent((req.body.nlp.entities.math_ro[0].value.replace(/,/g, '.')).replace(/x/g, '*')) + '&precision=3'
  }

  console.log(urlm)
  request(urlm, function (err, response, body) {
    if(err){
       res.send({
          replies: [{
            type: 'text',
            content: 'Nu știu matematică acum.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
    } else {
      rez = body
      if(rez.indexOf('Error') != 0){
        console.log('Calculat')
        res.send({
          replies: [{
            type: 'text',
            content: 'Rezultatul este ' + rez.replace('.', ',') + '.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        console.log('Math API error.')
        res.send({
          replies: [{
            type: 'text',
            content: 'Nu pot să calculez asta.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      }
    }
  })
})

app.post('/data', (req, res) => {
  console.log(req.body)
  datef.i18n = {
    dayNames: [
        'dum.', 'lun.', 'mar.', 'mie.', 'joi', 'vin.', 'sâm.',
        'duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'
    ],
    monthNames: [
        'Ian.', 'Feb.', 'Mar.', 'Apr.', 'Mai', 'Iun.', 'Iul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.',
        'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
    ],
    timeNames: [
        'dimineața', 'după-amiaza', 'am', 'pm', 'ante-meridian', 'post-meridian', 'AM', 'PM'
    ]
  }
  
  let datazi = ''
  let urlt = encodeURI('http://api.timezonedb.com/v2/get-time-zone?key=' + process.env.TZD_APIK + '&format=json&by=zone&zone=Europe/Bucharest')
  request(urlt, function (err, response, body) {
    if(err){
       res.send({
          replies: [{
            type: 'text',
            content: 'Nu știu ce zi e azi.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
    } else {
      let dat = JSON.parse(body)
      if(dat.status === 'OK'){
        console.log('OK')
        console.log(urlt)
        datazi = dat.formatted
        res.send({
          replies: [{
            type: 'text',
            content: 'Azi este ' + datef(datazi, 'dddd, d mmmm yyyy') +'. Acum este ora ' + datef(datazi, 'H') + ' și ' + datef(datazi, 'M') + ' minute.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      } else {
        console.log('Date-time API error.')
        res.send({
          replies: [{
            type: 'text',
            content: 'Nu știu data de azi.',
          }], 
          conversation: {
            memory: { key: 'value' }
          }
        })
      }
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
    console.log(req.body.nlp.entities.stiridin_ro[0])
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
  let urls = encodeURI('https://newsapi.org/v2/top-headlines?country=ro&category=' + catText + '&apiKey='+ process.env.NEW_APIK)
  console.log(urls)
  console.log(req.body.nlp.entities)
  request(urls, function (err, response, body) {
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
        console.log('st.totalResults=' + st['articles'].length)
        for (var i=0; i < st['articles'].length; i++) {
          
          stiriText.push({
            title: st.articles[i].source.name,
            imageUrl: ((st.articles[i].urlToImage != null) ? st.articles[i].urlToImage : 'https://raw.githubusercontent.com/rexlogic/vorbela/master/stiri.jpg'),
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
  let urlv = encodeURI('http://api.openweathermap.org/data/2.5/weather?q='+ city + '&lang=ro&units=metric&appid=' + apiKey)
  console.log(urlv)
  request(urlv, function (err, response, body) {
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
