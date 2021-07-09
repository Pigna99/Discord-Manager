import React from 'react';
import {Route, Switch} from 'react-router-dom';
import VoiceChannelsContainer from '../components/VoiceChannelsContainer';
import User from '../components/User';

function Path() {
    return (
            <Switch>
                <Route path="/" exact component={VoiceChannelsContainer}/>
                <Route path="/user/:id" component={User}/>
                <Route path="*" >Page not Found!</Route>
            </Switch>
    )
}

export default Path;
