const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><title>Vremea webhook</title><style media="screen">html,body,div {	margin: 0; padding: 0; } html,body { height: 100%; overflow: hidden; } div {	width: 100%;	height: 100%;	border: 0; }</style></head><body><div>VREMEA</div></body></html>')
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
