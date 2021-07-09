import React from 'react';
import VoiceUserDraggable from './dnd-components/VoiceUserDraggable';
import {BiHide} from 'react-icons/bi'
import {useGlobalContext} from '../context/index';

function VoiceChannel({name, id, users, prov, isHover, userLimit}) {
    const {hideChannel, state} = useGlobalContext();

    const formatNumber = (num)=>{
        if(num > 10){
            return num;
        }else{
            return "0"+num;
        }
    }

    return (
        <div className="channel" style={{
            backgroundColor: isHover ? "rgb(67, 80, 67)" : "#37393d",
            border: isHover ? "2px rgb(96, 211, 96) solid" : "2px #7289DA solid",
            height: "90%",
        }}>
            <header className="channel-title">
                {
                    userLimit !== 0 && <div className="channel-users-limit"><span className="number-user-span">{formatNumber(users.length)}</span><span>{formatNumber(userLimit)}</span></div>
                }
                <button className="hide" onClick={()=>hideChannel(name,id)}><BiHide/></button>
                <h4>{name}</h4>
                {
                    users.length !==0 && <hr/>
                }
            </header>
            <div className="channel-users">
                {
                    users.map((user, index)=>{
                        if(state.isHideBots && user.bot){
                            return null;
                        }else{
                            return (
                                <VoiceUserDraggable key={user.id} user={user} index={index}/>
                            )
                        }
                        
                    })
                }
                {prov.placeholder}
            </div>
        </div>
    )
}

export default VoiceChannel
