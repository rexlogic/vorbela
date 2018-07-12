# Vorbela webhooks

O aplicație pentru testarea boților de limba română instruiți în [Recast.ai](https://recast.ai/).

## Introducere

Aplicația este utilă pentru realizarea acțiunilor webhook ale boților de limba română construiți și instruiți în platforma Recast.ai (sau alta compatibilă) și implementează următoarele rute:

- /meteo
- /stiri
- /data
- /mate

### Necesități

Un bot pentru conversație în limba română.

## Utilizare

Pentru utilizare neabuzivă și adecvată în termenii licenței, aplicația poate fi apelată de boți folosind următorul URL de bază:  http://vorbela.herokuapp.com, iar oricare din rutele de mai sus ca webhook pentru acțiuni specifice. Exemplul de mai jos este informativ, utlizarea de către bot necesită doar apelarea rutei utile la instruirea acțiunii, răspunsul fiind prelucrat de către platformă și introdus în conversație.

### Exemplu

Apelare (JSON trimis de bot către aplicație pentru acțiunea care solicită data și ora):

```
{ nlp:
	{ ...
		source: 'Cât e ceasul?',
   	  ...
		language: 'ro',
	  ...
	},
  ...
  conversation: 
	{
  	  ...
		language: 'ro',
 	  ...
		skill: 'data',
	  ...
 	}
}
```

Răspuns (JSON trimis de aplicație către bot ca răspuns la solicitarea datei sau orei):

```
{ replies:
   [{
     ...
     content: 'Azi este joi, 12 iulie 2018. Acum este ora 6 și 44 minute.',
   }], 
  ...
}
```

## Programare

* [Node.js](https://nodejs.org/en/)

## Autor

* **[REXLOGIC](https://github.com/rexlogic/)**

## Licență

Licența este <a href="https://opensource.org/licenses/MIT">MIT</a>. Vezi detaliile în [LICENSE.md](https://github.com/rexlogic/vorbela/blob/master/LICENSE).

## Aprecieri

Aplicația folosește următoarele interfețe API:

- /meteo (<a href="https://openweathermap.org/">OpenWeatherMap</a>)
- /stiri (furnizate de <a href="https://newsapi.org">News API</a>)
- /data (<a href="https://timezonedb.com/">TimeZoneDB</a>)
- /mate (<a href="http://mathjs.org/">Math.js</a>)
<hr />
Aplicația rulează în platforma <a href="https://www.heroku.com/">Heroku</a>.
<hr />
© 2018 REXLOGIC. 
<br /><br />

<!--
<a href="https://heroku.com/deploy?template=https://github.com/rexlogic/vremea">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
-->


