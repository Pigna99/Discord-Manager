import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useGlobalContext} from '../context'

import {BsArrowLeft, BsArrowRight} from 'react-icons/bs'

function ChannelSlider() {
    const {guilds, active, setGuild} = useGlobalContext();


    const slideLeft = ()=>{
        if(active === 0){
            setGuild(guilds.list[guilds.list.length-1].id)

        }else{
            setGuild(guilds.list[active-1].id)
        }
    }

    const slideRight = ()=>{
        if(active === guilds.list.length-1){
            setGuild(guilds.list[0].id)
        }else{
            setGuild(guilds.list[active+1].id)
        }
    }

    return (
        <div className="slider">
            <button className="arrow arrow-left" onClick={slideLeft}><Link to="/"><BsArrowLeft/></Link></button>
            <div className="guild-name">
                {
                    guilds.list ? 
                    guilds.list.map((guild, index, array)=>{
                        let positionClass = "";
                        if(index === active){
                            positionClass = "active";
                        }else if(index === active-1 || (active === 0 && index === array.length-1)){
                            positionClass = "prev";
                        }else{
                            positionClass = "next";
                        }
                        return <Slide key = {guild.id} {...guild} positionClass={positionClass}/>
                    })
                    : <div>Guild not found</div>
                }
            </div>
            <button className="arrow arrow-right" onClick={slideRight}><Link to="/"><BsArrowRight/></Link></button>
        </div>
    )
}

const Slide = ({img, name, positionClass})=>{
    return(
        
            <div className={"guild-slider " + positionClass}>
                <Link to="/">
                    {
                        img && <img src={img} alt={name} className={"img-header"}/>
                    }
                </Link>
                <h3>
                    <Link to="/">{name}</Link>
                </h3>
            </div>
    )
}


export default ChannelSlider
