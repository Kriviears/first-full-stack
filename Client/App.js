import React from 'react';
import logo from './logo.svg';
import './App.css';
import GpApp from './gp-app/gp-app'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      apps: [],
      searchTerm: '',
      sort: '',
      genres: ''
    }
  }

  setSearchTerm(searchTerm){
    this.setState({
      searchTerm
    });
  }

  setSort(sort){
    this.setState({
      sort
    });
  }

  setGenres(genres){
    this.setState({
      genres
    });
  }

  handleSubmit(e){
    e.preventDefault();
    const baseUrl = 'http://localhost:8000/apps';
    const params = [];
    if(this.state.searchTerm){
      params.push(`searchTerm=${this.state.searchTerm}`);
    }
    if(this.state.sort){
      params.push(`sort=${this.state.sort}`);
    }
    if(this.state.genres){
      params.push(`genres=${this.state.genres}`);
    }

    const query = params.join('&');
    const url = `${baseUrl}?${query}`;

    fetch(url)
      .then(res =>{
        if(!res.ok){
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          apps: data,
          error: null
        });
      })
      .catch(err =>{
        this.setState({
          error: 'Sorry, could not get apps at this time'
        })
      })
  }



  
  render(){
    const apps = this.state.apps.map((gpapp, i)=>{
      return <GpApp {...gpapp} key={i}/>
    })
    return (
      <div className="App">
        <hi>Google Play Apps</hi>
        <div>
          <form onSubmit={e => this.handleSubmit(e)}>
            <label htmlFor='searchTerm'>Search: </label>
            <input
              type='text'
              id='searchTerm'
              name='searchTerm'
              value={this.state.searchTerm}
              onChange={e => this.setSearchTerm(e.target.value)}
            />
            <label htmlFor='sort'></label>
            <select id='sort' name='sort' onChange={e => this.setSort(e.target.value)}>
              <option value=''>All</option>
              <option value='Rating'>rating</option>
              <option value='App'>Title</option>
            </select>
            <label htmlFor='genres'></label>
            <select id='genre' name='genre' onChange={e => this.setGenres(e.target.value)}>
              <option value=''>All</option>
              <option value='Action'>Action</option>
              <option value='Puzzle'>Puzzle</option>
              <option value='Strategy'>Strategy</option>
              <option value='Casual'>Casual</option>
              <option value='Arcade'>Arcade</option>
              <option value='Card'>Card</option>
            </select>
            <button type='submit'>Search</button>
          </form>
          { apps }
        </div>
      </div>
    );
  }
}

export default App;
