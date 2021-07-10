import React, {useState, useEffect} from 'react'
import {useGlobalContext} from '../context'

import { Option } from './OptionsBar';


function Roles() {
    const {userInfo} = useGlobalContext();
    const [isHideManaged, setIsHideManaged] = useState(false);
    const [isHideEditable, setIsHideEditable] = useState(true);

    const toggleManaged = ()=>{
        setIsHideManaged(prev => !prev);
    }

    const toggleEditable = ()=>{
        setIsHideEditable(prev => !prev);
    }

    useEffect(() => {
        setIsHideManaged(isHideManaged)
    }, [])
    return (
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
    )
}


const Role = ({name, id, color, editable, managed})=>{
    const {userInfo, toggleRole} = useGlobalContext();
    const [render, setRender] = useState(false);
    let checkbox = false;
    //a dirty solution to rerender the element... better solutions?
    useEffect(()=>{
        setRender(false);
        const timeout = setTimeout(()=>{setRender(true);}, 10);
        return ()=>{clearTimeout(timeout)}
    }, [userInfo])
    return(
    <article className="hidden-flow role" style={{color: (color === "#000000" ? "#7289DA" : color)}}>
        {
            render &&
            userInfo.roles.all.map((role, index, array)=>{
                if(role[0]===id && !editable){
                    checkbox= true;
                    return <input key={"has"+id} type="checkbox" defaultChecked={true} readOnly disabled="disabled" style={{transform:"scale(2)", marginRight:"10px"}}/>
                }else if(role[0]===id && editable){
                    checkbox= true;
                    return <input key={"has"+id} type="checkbox" defaultChecked={true} style={{transform:"scale(2)", marginRight:"10px"}} onChange={()=>{toggleRole(userInfo.id, id)}}/>
                }else if(index===array.length-1 && !editable && checkbox=== false){
                    return <input key={"has"+id} type="checkbox" defaultChecked={false} disabled="disabled" style={{transform:"scale(2)", marginRight:"10px"}}/>
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



export default Roles
