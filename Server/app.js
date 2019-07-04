'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const apps = require('./store-data');

const app = express();

app.use(morgan('common'));
app.use(cors());

app.get('/apps', (req, res)=>{
  const { searchTerm, sort, genres } = req.query;

  console.log(searchTerm, sort, genres);

  if(sort){
    if(!['Rating', 'App'].includes(sort)){
      return res.status(400).send('Apps must be sorted by either rating or title');
    }
  }

  if(genres){
    if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
      return res.status(400).send('Sorry the genre you are looking for is not supported by this search');
    }
  }

  let results = apps.filter(app =>
    app
      .App
      .toLowerCase()
      .includes(searchTerm.toLowerCase()));

  if(sort){
    results.sort((a, b)=>{
      return a[sort] > b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
    });
  }

  if(genres){
    results = results.filter(app=>
      app
        .Genres
        .toLowerCase()
        .includes(genres.toLowerCase()));
  }

  res.json(results);
});


app.listen(8000, ()=>{
  console.log('Server started on PORT 8000');
});