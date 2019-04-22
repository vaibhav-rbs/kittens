import React from 'react';

import {createStore} from 'redux';

import  ProfileApp  from './src/ProfileApp';
import {Provider} from 'react-redux';




const initialState = {
  likedPets: [],
  dislikedPets: []

}
const reducer = (state = initialState, action) =>{
  if (action.type == 'LIKE_PETS'){
    return{
      likedPets: [...state.likedPets,action.index]

    };
  }
  else if (action.type == 'DISLIKE_PETS'){
    return {
      dislikedPets: [...state.dislikedPets,action.index]
      };
  }
else { 
  return state
}
  
  
}

const store = createStore(reducer);
export default class App extends React.Component {



  render() {
    return (
    <Provider store = {store}>
      <ProfileApp></ProfileApp>
    </Provider>

    )
  }
}