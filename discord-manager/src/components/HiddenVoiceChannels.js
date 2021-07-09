import React from 'react'
import {useGlobalContext} from '../context'
import {BiShow} from 'react-icons/bi'


function HiddenVoiceChannels() {
    const {state, showAllChannels} =useGlobalContext();
    return (
        <div className="channel">
            <header className="channel-title">
                <h4>Hidden Channels</h4>
            </header>
            <hr/>
            <div>
                {
                    state.hiddenChannels.map(channel=><HiddenChannel key={channel._id} id={channel._id} name={channel.name}/>)
                }
            </div>
            <button className="show" onClick={()=>{showAllChannels()}}>Show All</button>            
        </div>
    )
}


function HiddenChannel({name, id}){
    const {showChannel} = useGlobalContext();
    return(
        <article className="hidden-flow">
            {name}
            <button className="show" onClick={()=>showChannel(id)}><BiShow/></button>
        </article>
    )
}

export default HiddenVoiceChannels
