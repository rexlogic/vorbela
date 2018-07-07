const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html><html><body bgcolor="#ADD8E6"><div>VREMEA</div></body></html>')
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
