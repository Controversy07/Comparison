import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';
import './AutoSuggest.css';
import './Styles.css';

function getSuggestionValue(suggestion) {
  return suggestion.login;
}

function renderSuggestion(suggestion) {

  return (
    <span className='suggestion-content'>
      <img className="avatar" alt="avatar" src={suggestion.avatar_url}/>
      <span className="name">
        {suggestion.login}
      </span>
    </span>
  );
}

const initialState = {
  value: '',
  name1: '',
  avatar1: '',
  name2: '',
  avatar2: '',
  suggestions: [],
  winnerscreen: false,
  winner: ''
};

class App extends React.Component {
  constructor() {
    super();

    this.state = initialState;
  }



  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) =>{
    //Here you do whatever you want with the values
    console.log(suggestion); //For example alert the selected value
    if (this.state.name1) {
      this.setState({
        name2: suggestion.login,
        avatar2: suggestion.avatar_url,
      })
    } else {
      this.setState({
        name1: suggestion.login,
        avatar1: suggestion.avatar_url
      })
    }
    this.setState({
      value: ''
    })
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    
      fetch(`https://api.github.com/search/users?q=${value}&&page=1`)
        .then(response => response.json())
        .then(data => this.setState({ suggestions: data.items }))
        .catch(error => {
          this.setState({value: '', suggestions: []})
        });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderUserName1 = () => {
    if (this.state.name1) {
    return <span className='suggestion-content'>
        <img className="avatar" alt="avatar" src={this.state.avatar1}/>
        <span className="name">
          {this.state.name1}
        </span>
      </span>
    }
  };
  renderUserName2 = () => {
    if (this.state.name2) {
      return <span className='suggestion-content'>
          <img className="avatar" alt="avatar" src={this.state.avatar2}/>
          <span className="name">
            {this.state.name2}
          </span>
        </span>
    }
  };

  computeWinner = () => {
    fetch(`https://api.github.com/users/${this.state.name1}`)
        .then(response => response.json())
        .then(data => this.setState({ public_repos1: data.public_repos, followers1: data.followers,  }))
        .catch(error => {
          this.setState({value: '', suggestions: []})
    });
    fetch(`https://api.github.com/users/${this.state.name2}`)
        .then(response => response.json())
        .then(data => this.setState({ public_repos2: data.public_repos, followers2: data.followers,  }))
        .catch(error => {
          this.setState({value: '', suggestions: []})
    });
    if (this.state.public_repos1 > this.state.public_repos2) {
      this.setState({winner: 1})
    } else if (this.state.public_repos1 < this.state.public_repos2) {
      this.setState({winner: 2})
    } else if (this.state.public_repos1 === this.state.public_repos2) {
      if (this.state.followers1 > this.state.followers2) {
        this.setState({winner: 1})
      } else {
        this.setState({winner: 2})
      }
    }
  }

  showButton = () => {
    let handleClick = (e) => {
      e.preventDefault();
      this.setState({winnerscreen: true})
      this.computeWinner();
    }
    if (this.state.name1 && this.state.name2) {
      return <div className="ui animated button" tabIndex="0" onClick={handleClick}>
      <div className="visible content">Compare</div>
      <div className="hidden content">
        <i className="right arrow icon"></i>
      </div>
    </div>
    }
  };

  renderComparescreenOrWinner = () => {

    const { value, suggestions } = this.state;
    const isDisabled = this.state.name1 && this.state.name2;
    const inputProps = {
      placeholder: "Type the user name",
      value,
      onChange: this.onChange,
      disabled: isDisabled
    };
    let winnnerDisplay = (number) => {
      if (this.state.winner === number) {
        return 'winner';
      } 
    }

   
    let handleClick = (e) => {
      e.preventDefault();
      this.setState(initialState);
    }
    let removeUser1 = () => {
        if (this.state.name1) {
          this.setState({
            name1: '',
            avatar1: ''
          });
          if (this.state.name2) {
            this.setState({
              name1: this.state.name2,
              avatar1: this.state.avatar2,
              name2: '',
              avatar2:''
            })
          }
        } else {
          alert('First select a user');
        }
    }

    let removeUser2 = () => {
        if (this.state.name2) {
          this.setState({
            name2: '',
            avatar2: ''
          })
        } else {
          alert('First select a user')
        }
    }
    if (this.state.winnerscreen) {
      
      return <div id="result_space">

      <div id="head" className="up_head">

          <div className="heading small_heading">
              Git-compare
          </div>

           <div className="result_desc"  onClick={handleClick}><i className="fa"></i>Start Over</div>
      </div>

      <div className="result_tab">

          <div id="left_sele" className={winnnerDisplay(1)}>

              <div className="notfication hide">Winner</div>
              <div className="block">
              
                  <div className="basic_info">
                      <span className="photo">
                        <img src={this.state.avatar1} alt={this.state.name1} className="comparison-avatar"/>
                      </span>
                      <span className="bio">
                          <div className="username">Username: {this.state.name1}</div>
                      </span>
                  </div>

                  <div className="Rectangle" id="repos">
                      <span className="info">Repos</span>
                      <span className="value">{this.state.public_repos1}</span>
                  </div>

                  <div className="Rectangle" id="followers">
                      <span className="info">Followers</span>
                      <span className="value">{this.state.followers1}</span>
                  </div>

              </div>

          </div>

          <div id="right_sele" className={winnnerDisplay(2)}>

               <div className="notfication hide">Winner</div>
               <div className="block">
              
                  <div className="basic_info">
                      <span className="photo">
                        <img src={this.state.avatar2} alt={this.state.name2} className="comparison-avatar"/>
                      </span>
                      <span className="bio">
                          <div className="username">Username: {this.state.name2}</div>
                      </span>
                  </div>

                  <div className="Rectangle" id="repos">
                      <span className="info">Repos</span>
                      <span className="value">{this.state.public_repos2}</span>
                  </div>

                  <div className="Rectangle" id="followers">
                      <span className="info">Followers</span>
                      <span className="value">{this.state.followers2}</span>
                  </div>

              </div>

          </div>


          
      </div>

  </div>
    }
    else {
    return <div id="compare_screen" className="compare_screen">

    <div id="head" className="up_head">
      <div className="heading small_heading">
          Git-compare
      </div>
      <div className="desc">Compare users on Git</div>

      <div id="dp_space" className="hide">
          <div className="profile_dp" id="profile_img" onClick={removeUser1}>
            <img src={this.state.avatar1} alt={this.state.name1} className="comparison-avatar"/>
          </div>
          <div className="profile_dp" id="git_img" onClick={removeUser2}>
            <img src={this.state.avatar2} alt={this.state.name2} className="comparison-avatar"/>
          </div>
          <div className="second_desc">Add two users to compare</div>
      </div>
    </div>




    <div className="centre_select" id="first_select">
    <Autosuggest 
      suggestions={suggestions}
      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      onSuggestionSelected={this.onSuggestionSelected}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      disabled={this.isDisabled} />
    </div>
    {this.showButton()}
  </div>
  }
}

  render() {

    return (
      <div className="body">
        {this.renderComparescreenOrWinner()}
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#root'));
