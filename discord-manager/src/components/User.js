import React, {useEffect, useState} from 'react'
import {useGlobalContext} from '../context'

import {getColor, getOnlinePlatform, formatTime} from '../utils'
import {FaRegGem} from 'react-icons/fa'

import {Option} from './OptionsBar';

function User({match}) {
    const {available, userInfo, getUserInfo, openModal, banKickInfo, setBanKickInfo} = useGlobalContext();
    const {id} = match.params;

    const [isHideManaged, setIsHideManaged] = useState(false);
    const [isHideEditable, setIsHideEditable] = useState(true);

    useEffect(()=>{
        if(available){
            getUserInfo(id);
        }
    }, [available, id]);

    useEffect(()=>{
        setBanKickInfo({name: "user" , reason: "none"});
    }, [userInfo])

    const formatDate = (time)=>{
        const month = time.getMonth();
        const year = time.getFullYear();
        const day = time.getDate();
        return `${month}/${day}/${year}`;
    }

    const toggleManaged = ()=>{
        setIsHideManaged(prev => !prev);
    }

    const toggleEditable = ()=>{
        setIsHideEditable(prev => !prev);
    }

    console.log(userInfo)

    return (
        <section className="user-corp">
        {
            banKickInfo.reason ==="KICKED" ? <div style={{textAlign:"center", padding:"40px"}}>{banKickInfo.name+ ` had been kicked from the Guild.`}</div>:
            banKickInfo.reason ==="BANNED" ? <div style={{textAlign:"center", padding:"40px"}}>{banKickInfo.name+ ` had been banned from the Guild.`}</div>:
            userInfo.info? (
            <div>
                <header className="user-manager-header">
                    <div className="user-manager-img-container">
                        {
                            userInfo.img ? <img src={userInfo.img} alt={userInfo.displayName}/> : <div className="img-user-default-state" style={{backgroundColor:"#7289DA"}}>{userInfo.displayName[0]+userInfo.displayName[1]}</div>
                        }
                        {
                            userInfo.presence.status ? <div className="state-user-page" style={{backgroundColor: getColor(userInfo.presence.status)}}></div> : <div style={{width:"12px"}}/>
                        }
                        {
                            userInfo.roles.all.filter((role)=>role[1].name==="Server Booster").length !== 0 ? 
                            <div className="tooltip">
                                <FaRegGem className="nitro"/>
                                <span className="tooltiptext">Server Nitro Booster</span>
                            </div>
                            : null
                        }
                        <hr/>
                    </div>
                    <section style={{padding:"10px", marginBottom:"20px"}}>
                        <h2 style={{padding:"10px", marginLeft:"6%", display:"inline",}}>{userInfo.info ? userInfo.info.tag : userInfo.displayName}</h2>
                        {
                            userInfo.isBot && <div className="bot-icon" style={{display:"inline", fontSize:"x-large"}}>BOT</div>
                        }
                        {
                            (userInfo.roles.highest && userInfo.roles.highest.name !== "@everyone" &&  userInfo.roles.highest.name !=="Server Booster") && <span className="hidden-flow role" style={{color: userInfo.roles.highestColor}}>{userInfo.roles.highest.name}</span>
                        }
                        <button className="btn kick" onClick={()=>{openModal("BAN", userInfo)}}>BAN</button>
                        <button className="btn mute" onClick={()=>{openModal("KICK", userInfo)}}>KICK</button>         
                        <div>{userInfo.presence.activities.length !==0 ? <Activity/> :null}</div>
                    </section>
                    <hr/>
                </header>
                <section>
                    <table>
                        <tbody className="user-table-info">
                            <tr><td>Nickname</td><td>{userInfo.displayName}</td></tr>
                            <tr><td>User ID</td><td>{userInfo.id}</td></tr>
                            <tr><td>User created at:</td><td>{formatDate(new Date(userInfo.info.createdAt))}</td></tr>
                            <tr><td>Channel joined at:</td><td>{formatDate(new Date(userInfo.joinedAt))}</td></tr>
                            <tr><td>Bannable?</td><td>{userInfo.bannable.toString()}</td></tr>
                            <tr><td>Kickable?</td><td>{userInfo.kickable.toString()}</td></tr>
                            <tr><td>Manageable?</td><td>{userInfo.manageable.toString()}</td></tr>
                            <tr><td>Is online on:</td><td>{getOnlinePlatform(userInfo.presence.clientStatus)}</td></tr>
                        </tbody>
                    </table>
                </section>
                <hr/>
                <section>
                    <h3 style={{textAlign:"center"}}>Roles</h3>
                    {
                        userInfo.roles.guildRoles.map(role=>{
                            if(role.name !== "@everyone" &&  role.name !=="Server Booster" && role.managed === false && role.editable){
                                return <Role key={"role"+role.id} {...role}/>
                            }else{return null}
                        })
                    }
                    {
                        userInfo.roles.guildRoles.map(role=>{
                            if(role.name !== "@everyone" &&  role.name !=="Server Booster" && role.managed === false && !role.editable && isHideEditable){
                                return <Role key={"role"+role.id} {...role}/>
                            }else{return null}
                        })
                    }
                    {
                        userInfo.roles.guildRoles.map(role=>{
                            if(role.name !== "@everyone" &&  role.name !=="Server Booster" && role.managed === true && isHideManaged){
                                return <Role key={"role"+role.id} {...role}/>
                            }else{return null}
                        })
                    }
                    <Option text="Hide uneditable roles." fun={toggleEditable}/>
                    <Option text="Show managed roles (BOT)." fun={toggleManaged}/>
                </section>
            </div>
            ): <div style={{textAlign:"center", padding:"40px"}}>Utente non trovato!</div>

        }
        </section>
    )
}

const Activity = ()=>{
    const {userInfo} = useGlobalContext(); 
    let last= userInfo.presence.activities.length-1;
    const [time, getTime] = useState(new Date((userInfo.presence.activities[last].timestamps ? new Date()-new Date(userInfo.presence.activities[last].timestamps.start) : null)))
    
    
    useEffect(()=>{
        let interval=setInterval(() => {
            getTime(new Date((userInfo.presence.activities[last].timestamps ? new Date()-new Date(userInfo.presence.activities[last].timestamps.start) : null)))

        }, 900);
         return ()=>{clearInterval(interval)}
    },[userInfo, last]);
    return <div className="user-activity">
    {
        userInfo.presence.activities[last].type === "CUSTOM_STATUS" ?
        userInfo.presence.activities[last].state=== null ?
        <img src={userInfo.presence.activities[last].emoji.url} alt={userInfo.presence.activities[last].emoji.name}/>:
        <>{`${userInfo.presence.activities[last].state}`}</>:
        <>{`Is ${userInfo.presence.activities[last].type.toLowerCase()}`}<p style={{display:"inline", color:"lightblue"}}>{` ${userInfo.presence.activities[last].name}`}</p>{` for ${formatTime(time)}.`}</>
    }
    </div>
}

const Role = ({name, id, color, editable, managed})=>{
    const {userInfo, toggleRole} = useGlobalContext();
    let checkbox = false;
    return(
    <article className="hidden-flow role" style={{color: (color === "#000000" ? "#7289DA" : color)}}>
        {
            userInfo.roles.all.map((role, index, array)=>{
                if(role[0]===id && !editable){
                    checkbox= true;
                    return <input key={"has"+id} type="checkbox" checked="checked" readOnly disabled="disabled" style={{transform:"scale(2)", marginRight:"10px"}}/>
                }else if(role[0]===id && editable){
                    checkbox= true;
                    return <input key={"has"+id} type="checkbox" defaultChecked={true} style={{transform:"scale(2)", marginRight:"10px"}} onChange={()=>{toggleRole(userInfo.id, id)}}/>
                }else if(index===array.length-1 && !editable && checkbox=== false){
                    return <input key={"has"+id} type="checkbox" disabled="disabled" style={{transform:"scale(2)", marginRight:"10px"}}/>
                }else if(index===array.length-1 && editable && checkbox=== false){
                    return <input key={"has"+id} type="checkbox" defaultChecked={false} style={{transform:"scale(2)", marginRight:"10px"}} onChange={()=>{toggleRole(userInfo.id, id)}}/>
                }else{
                    return null
                }
            })
        }
        {
            managed && <span style={{display:"inline", marginRight:"5px"}} className="bot-icon">MANAGED</span>
        }
        <span style={{display:"inline"}}>{name}</span>
    </article>)
}


export default User