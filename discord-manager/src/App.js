import React from 'react';
// import logo from './logo.svg';
import {useGlobalContext} from './context';
import {RiSettings5Fill} from 'react-icons/ri'
import {BiMenu} from 'react-icons/bi';
import {BrowserRouter} from 'react-router-dom';



import OptionsBar from './components/OptionsBar';
import UsersStateBar from './components/UsersStateBar';
import Modal from './components/Modal';
import ChannelSlider from './components/ChannelSlider';

import Path from './screen';





function App() {
  const {available, voiceChannels, showOptionsBar, showUsersStateBar} = useGlobalContext();
  if(available){//move? - sort the voice channels
    voiceChannels.sort((first, second)=>first.position - second.position);
    // console.log(voiceChannels)
  }
  

  return (
    <BrowserRouter> 
      <div className="title">
        <header>
          <button className="btn-options" onClick={available && showOptionsBar}><RiSettings5Fill/></button>
          <button className="btn-options btn-users" onClick={available && showUsersStateBar}><BiMenu/></button>
          <h2>Discord Manager</h2>
        </header>
        <hr className="hr-header"/>
        <ChannelSlider/>
      </div>
      <OptionsBar/>
      <UsersStateBar/>
      <Modal/>
      <Path/>
    </BrowserRouter>
  );
}

export default App;
