import React, {useState} from 'react';
import {useGlobalContext} from '../context';
import {AiFillCloseCircle} from 'react-icons/ai';
import {Link} from 'react-router-dom';

import {getColor} from '../utils'

function UsersStateBar() {
    const {state, hideUsersStateBar, usersStateInfo} = useGlobalContext();

    const [search, setSearch] = useState('');
    
    const showUserState = (user, state, bot, search)=>{
        let re = new RegExp(search, "i");
        return (user.presence===state && user.isBot === bot && (search === "" || user.name.search(re) !== -1 || user.displayName.search(re) !== -1 || user.id.toString().search(re) !==-1))
    }
    return (
        <div className={"sidebar-under "+ (state.isUsersStateBar ? 'sidebar-visible' : '')} onClick={hideUsersStateBar}>
           <div className={"sidebar-users-content " +(state.isUsersStateBar ? '' : 'sidebar-users-content-shift')} onClick={(ev)=>{ev.stopPropagation()}}>
                <header className="sidebar-header">
                    <button className="btn-options-close" onClick={hideUsersStateBar}><AiFillCloseCircle/></button>
                    <h3 style={{margin:"10px"}}>Server Users</h3>
                </header>
                <hr style={{margin:"0"}}/>
                <section className="search-section">
                    <input placeholder="search an user" className="search-bar" id="search_user" name="search_user" type="text" value={search} onChange={(e)=> setSearch(e.target.value)}></input>
                </section>
                <section className="users-state-section">
                    <hr style={{margin:"0"}}/>
                    <h4 className="users-state-header">Online</h4>
                    <hr style={{margin:"0"}}/>
                    {
                        usersStateInfo.map((user)=>{
                            if(showUserState(user, "online", false, search)){ //user.presence==="online" && user.isBot === false && (search === "" || user.name.search(re) !== -1 || user.displayName.search(re) !== -1
                                return <UserState key={"state" + user.id} {...user}/>
                            }
                            return null;
                        })
                    }
                    {
                        usersStateInfo.map((user)=>{
                            if(showUserState(user, "idle", false, search)){
                                return <UserState key={"state" + user.id} {...user}/>
                            }
                            return null;
                        })
                    }
                    {
                        usersStateInfo.map((user)=>{
                            if(showUserState(user, "dnd", false, search)){
                                return <UserState key={"state" + user.id} {...user}/>
                            }
                            return null;
                        })
                    }
                    <hr style={{margin:"0"}}/>
                    <h4 className="users-state-header">Bots</h4>
                    <hr style={{margin:"0"}}/>
                    {
                        usersStateInfo.map((user)=>{
                            if(showUserState(user, "online", true, search)){
                                return <UserState key={"state" + user.id} {...user}/>
                            }
                            return null;
                        })
                    }
                    <hr style={{margin:"0"}}/>
                    <h4 className="users-state-header">Offline</h4>
                    <hr style={{margin:"0"}}/>
                    {
                        usersStateInfo.map((user)=>{
                            if(showUserState(user, "offline", false, search)){
                                return <UserState key={"state" + user.id} {...user} color={"grey"}/>
                            }
                            return null;
                        })
                    }
                    <hr style={{margin:"0"}}/>
                </section>
           </div>
       </div>
    )
}

function UserState({displayName, id, img, presence, isBot, color, name}){
    const {hideUsersStateBar} = useGlobalContext();
    return(
        <div className="user-state">
            <Link to={`/user/${id}`} onClick={hideUsersStateBar}>
                {
                    img ? <img src={img} alt={displayName} className="img-user-state"/> : <div className="img-default-state" style={{backgroundColor:"#7289DA"}}>{name[0]+name[1]}</div>
                }
            </Link>
            {
                presence !== "offline" ? <div className="state" style={{backgroundColor: getColor(presence)}}></div> : <div style={{width:"12px"}}/>
            }
            <h4 style={{color:(color === "#000000" ? "white" : color)}}><Link to={`/user/${id}`} onClick={hideUsersStateBar}>{displayName}</Link></h4>
            {
                isBot && <div className="bot-icon">BOT</div>
            }
        </div>
    )
}

export default UsersStateBar
