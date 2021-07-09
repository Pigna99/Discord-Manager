import React from 'react';
import { useGlobalContext } from '../context';
import {AiOutlineAudioMuted} from 'react-icons/ai';
import {BiVolumeMute, BiVideo} from 'react-icons/bi';
import {CgScreen} from 'react-icons/cg';
import {Link} from 'react-router-dom';

function VoiceUser({name, color, id, img, voiceInfo}) {
    const {kickUser, muteUser, deafUser} = useGlobalContext();
    return (
        <article className="user">
            <div className="user-header">
                <Link to={`/user/${id}`}>
                    {
                        img? <img src={img} alt={name} className="img-voice-user"/> : <div className="img-default" style={{backgroundColor:color}}>{name[0]+name[1]}</div>
                    }
                </Link>
                <h5 style={{color:color}}><Link to={`/user/${id}`}>{name}</Link></h5> 
                <VoiceUserState {...voiceInfo} id={id}/>
            </div>
            <div className="user-options">
                <button className="btn kick" onClick={()=>kickUser(id)}>kick</button>
                <button className="btn mute" onClick={()=>muteUser(id)}>mute</button>
                <button className="btn mute" onClick={()=>deafUser(id)}>deaf</button>
            </div>
        </article>
    )
}

const VoiceUserState = ({selfDeaf, selfMute, serverDeaf, serverMute, selfVideo, streaming, id})=>{
    return(
        <>
            {
                selfMute && <AiOutlineAudioMuted/>
            }
            {
                selfDeaf && <BiVolumeMute/>
            }
            {
                serverMute && <AiOutlineAudioMuted style={{color:"red"}}/>
            }
            {
                serverDeaf && <BiVolumeMute style={{color:"red"}}/>
            }
            {
                selfVideo && <BiVideo/>
            }
            {
                streaming && <CgScreen/>
            }        
        </>
    )

}

export default VoiceUser