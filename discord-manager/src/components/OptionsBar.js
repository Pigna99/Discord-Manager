import React from 'react';
import {useGlobalContext} from '../context';
import {AiFillCloseCircle} from 'react-icons/ai';


function OptionsBar() {
    const {state, hideOptionsBar, hideEmptyChannels, hideBots, guilds, setGuild, active, toggleDndChannels, toggleDndUsers} = useGlobalContext();
    return (
        <div className={"sidebar-under " + (state.isOptionsBar ? 'sidebar-visible' : '')}
         onClick={hideOptionsBar}>
            <div className={"sidebar-content " +(state.isOptionsBar ? '' : 'sidebar-content-shift')} onClick={(ev)=>{ev.stopPropagation()}}>
                <header className="sidebar-header">
                    <button className="btn-options-close" onClick={hideOptionsBar}><AiFillCloseCircle/></button>
                    <h3 style={{margin:"10px"}}>Options</h3>
                </header>
                <hr style={{margin:"0"}}/>
                <section className="sidebar-options">
                    <Option text="Hide bots." fun={hideBots}/>
                    <Option text="Hide empty channels." fun={hideEmptyChannels}/>
                    <Option text="Disable Channels drag and drop." fun={toggleDndChannels}/>
                    <Option text="Disable Users drag and drop." fun={toggleDndUsers}/>
                    <hr style={{margin:"0px", marginTop:"20px"}}/>
                    <h2>Select the Guild to monitor:</h2>
                    <div className="selector-container">
                    <select name="guild_select" id="change_guild" className="selector" value={guilds.list && guilds.list[active].id} onChange={()=>{setGuild(document.getElementById("change_guild").value)}}>
                        { guilds.list && guilds.list.map(guild=><option className="selector-items" key={guild.id} value={guild.id}>{guild.name}</option>)}
                    </select>
                    </div>
                </section>
            </div>
        </div>
    )
}

export function Option({text, fun}) {
    return (<div style={{marginTop:"5px"}}>
        <input type="checkbox" style={{marginRight:"10px", transform:"scale(1.5)"}} onChange={fun}/>
        {text}
    </div>)
}



export default OptionsBar
