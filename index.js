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
  let NewsAPI = require('news.js');
  
  if (!process.env.NEW_APIK) throw new Error('No news API Key specified.');
  let newsapi = new NewsAPI(process.env.NEW_APIK);
  
  describe('NewsAPI', function () {
  describe('V1', function () {
    describe('Sources', function () {
      it('should return "ok" and a list of sources', function (done) {
        newsapi.sources().then(res => {
          res.status.should.equal('ok');
          should.exist(res.sources);
          done();
        }).catch(done);
      });
  
      it('should return "ok" and a list of sources using a callback', function (done) {
        newsapi.sources((err, res) => {
          if (err) {
            return done(err);
          }
          res.status.should.equal('ok');
          should.exist(res.sources);
          done();
        });
      });
  
      it('should return "ok" and a list of sources using a callback and empty params object', function (done) {
        newsapi.sources({}, (err, res) => {
          if (err) {
            return done(err);
          }
          res.status.should.equal('ok');
          should.exist(res.sources);
          done();
        });
      });
    });
  
    describe('Articles', function () {
      it('should return "ok" and a list of articles for a valid source', function (done) {
        const sourceId = 'buzzfeed';
        newsapi.articles({
          source: sourceId
        }).then(articlesRes => {
          articlesRes.status.should.equal('ok');
          should.exist(articlesRes.articles);
          done();
        }).catch(done);
      });
  
      it('should return "ok" and a list of articles for a valid source using a callback', function (done) {
        const sourceId = 'buzzfeed';
        newsapi.articles({
          source: sourceId
        }, (err, articlesRes) => {
          if (err) {
            return done(err);
          }
          articlesRes.status.should.equal('ok');
          should.exist(articlesRes.articles);
          done();
        });
      });

      it('Should throw an error if no source is provided', function (done) {
        newsapi.articles().then(res => {
          done(new Error('Should have thrown an error'));
        }).catch(err => {
          done();
        });
      });
    });
  });

  describe('V2', function () {
    describe('sources', function () {
      it('Should return "ok" and a list of sources', function (done) {
        newsapi.v2.sources().then(res => {
          res.status.should.equal('ok');
          should.exist(res.sources);
          done();
        }).catch(done);
      });
    });

    describe('top-headlines', function () {
      it('Should return "ok" and a list of top headlines', function (done) {
        newsapi.v2.topHeadlines({
          language: 'en'
        }).then(res => {
          res.status.should.equal('ok');
          should.exist(res.articles);
          done();
        }).catch(done);
      });

      it('Should return "ok" and a list of top headlines using a callback', function (done) {
        newsapi.v2.topHeadlines({
          language: 'en'
        }, (err, res) => {
          if (err) {
            return done(err);
          }
          res.status.should.equal('ok');
          should.exist(res.articles);
          done();
        });
      });

      it('Should default to english language if no options are provided and return a list of top headlines', function (done) {
        newsapi.v2.topHeadlines().then(res => {
          res.status.should.equal('ok');
          should.exist(res.articles);
          done();
        }).catch(done);
      });

      it('Should throw an error if all required params are missing', function (done) {
        newsapi.v2.topHeadlines({})
          .then(res => {
            done(new Error('This should have thrown an error'));
          })
          .catch((err) => {
            done();
          });
      });
    });

    describe('everything', function () {
      it('Should return "ok" and a list of articles', function (done) {
        newsapi.v2.everything({
          sources: 'bbc-news'
        }).then(res => {
          res.status.should.equal('ok');
          should.exist(res.articles);
          done();
        }).catch(done);
      });

      it('Should not cache results if noCache is on', function (done) {
        newsapi.v2.everything({
          sources: 'bbc-news'
        }, {
          noCache: true,
          showHeaders: true
        }).then(res => {
          res.headers.get('x-cached-result').should.equal('false');
          res.body.status.should.equal('ok');
          should.exist(res.body.articles);
          done();
        }).catch(done);
      });

      it('Should throw an error if all required params are missing', function (done) {
        newsapi.v2.everything({})
          .then(res => {
            done(new Error('This should have thrown an error'));
          })
          .catch((err) => {
            done();
          });
      });
    });
  });
});
  
  res.send({
   replies: [{
     type: 'text',
     content: 'Știrile de azi sunt învechite.',
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
