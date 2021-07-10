import React, {useContext, useState, useEffect, useReducer} from "react";
import socketIOClient from 'socket.io-client';
import {GENERIC_INFO} from './actions';
import reducer from "./reducer";

const ENDPOINT = "http://127.0.0.1:4001";//da mettere in altro file?
const initialState = {
    hiddenChannels : [],
    isOptionsBar: false,
    isHideBots: false,
    isHideEmptyChannels:false,
    isUsersStateBar: false,
    isModal: false,
    modalContent: {
        modalText:"sample",
        modalFunction: null,
        id:null,
    },
    selectedGuild:null,
    isDndUsers: true,
    isDndChannels: true,
};


const AppContext = React.createContext();

const AppProvider = ({children})=>{//context!
    const [state, dispatch] = useReducer(reducer, initialState);
    const [active, setActive] = useState(0);

    const [guilds, setGuilds] = useState([]);
    const [discordGenericInfo, setDiscordGenericInfo] = useState('');
    const [usersStateInfo, setUsersStateInfo] = useState([]);
    const [socketState, setSocketState] = useState('');//per usare il socket un po' ovunque

    const [userInfo, setUserInfo] = useState('');
    const [banKickInfo, setBanKickInfo] = useState({name: "user" , reason: "none"});

    //discord commands
    const kickUser = (userid)=>{
        socketState.emit("KICK" , userid);
    }

    const muteUser = (userid)=>{
        socketState.emit("MUTE" , userid);
    }

    const deafUser = (userid)=>{
        socketState.emit("DEAF" , userid);
    }

    const dragUser = (result)=>{
        if(result.destination){
            if(result.destination.droppableId !== result.source.droppableId){
                let data = {
                    user: result.draggableId,
                    channel: result.destination.droppableId,
                }
                socketState.emit("DRAG_USER", data)
            }
        }else{
            console.log("Grab Errato!")
        }

    }

    const dragAllUsers = (start, end) =>{
        if(start !== end){//cant' drop in the same channel you grabbed
            let data = {
                startChannel: start,
                endChannel: end
            }
            socketState.emit("DRAG_ALL", data);
        }
        
    }

    const getUserInfo = (id) =>{
        socketState.emit("GET_USER_INFO", id);
    }

    const manageUser= (operation, id) =>{
        // console.log(operation, id, "worked!")
        if(operation === "KICK"){
            socketState.emit("KICK_FROM_GUILD", id);
        }else if(operation === "BAN"){
            socketState.emit("BAN_FROM_GUILD", id);
        }
    }

    const setGuild = (id) =>{
        socketState.emit("CHANGE_GUILD", id);
    }

    const toggleRole = (user_id, role_id)=>{
        let data={
            user_id, role_id
        }
        socketState.emit("TOGGLE_ROLE", data);
    }
    //discord commands
    //reducer - dispach operations
    const hideChannel = (name, _id)=>{
        dispatch({type: "HIDE_CHANNEL", payload: {_id, name}});
    }

    const showChannel = (_id)=>{
        dispatch({type: "SHOW_CHANNEL", payload: _id});
    }

    const showAllChannels = ()=>{
        dispatch({type: "SHOW_ALL_CHANNELS"});
    }

    const showOptionsBar = ()=>{
        dispatch({type: "SHOW_OPTIONS"});
    }

    const hideOptionsBar = ()=>{
        dispatch({type: "HIDE_OPTIONS"});
    }

    const showUsersStateBar = ()=>{
        dispatch({type: "SHOW_USERS_STATE"});
    }

    const hideUsersStateBar = ()=>{
        dispatch({type: "HIDE_USERS_STATE"});
    }

    const hideEmptyChannels = ()=>{
        dispatch({type: "EMPTY_CHANNELS"});
    }

    const hideBots = ()=>{
        dispatch({type: "HIDE_SHOW_BOTS"});
    }

    const closeModal = ()=>{
        dispatch({type: "CLOSE_MODAL"});
    }

    const openModal = (operation, user)=>{
        dispatch({type: "OPEN_MODAL", payload: {operation, user}});
    }

    const toggleDndChannels = ()=>{
        dispatch({type: "TOGGLE_DND_CHANNELS"});
    }

    const toggleDndUsers = ()=>{
        dispatch({type: "TOGGLE_DND_USERS"});
    }
    //reducer
    //SOCKET==================
    useEffect(()=>{//connection socket.io - discord server
        const socket = socketIOClient(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
        setSocketState(socket);
        socket.on(GENERIC_INFO, data=>{
            setDiscordGenericInfo(data);
        })
        socket.on("GUILDS", data=>{
            setGuilds(data);
        })
        socket.on("USERS_STATE_INFO", data=>{
            setUsersStateInfo(data);
        })
        socket.on("GRAB_USER_INFO",data=>{
            setUserInfo(data);
        })
        socket.on("USER_HAS_BEEN_KICKED",data=>{
            setBanKickInfo(data);
        })
        socket.on("USER_HAS_BEEN_BANNED",data=>{
            setBanKickInfo(data);
        })

        socket.on("TEST", data=>{//for testing purpose
            console.log(data);
        })
    },[]);
    //SOCKET==================

    // useEffect(()=>{
    //     console.log(discordGenericInfo);
    // },[discordGenericInfo]);

    // useEffect(()=>{
    //     console.log(usersStateInfo);
    // },[usersStateInfo]);

    // useEffect(()=>console.log(state), [state])

    useEffect(()=>{
        if(guilds.list){
            guilds.list.forEach((guild, index)=>{
                if(guild.id === guilds.selected){
                    setActive(index);
                }
            })
        }
        
    }, [guilds])

    return <AppContext.Provider value={
        {...discordGenericInfo, kickUser, muteUser, deafUser, dragUser, dragAllUsers, state, hideChannel, showChannel, showAllChannels,
        hideOptionsBar, showOptionsBar, hideEmptyChannels, hideBots, showUsersStateBar, hideUsersStateBar, usersStateInfo,
        userInfo, getUserInfo, closeModal, openModal, manageUser, banKickInfo, setBanKickInfo, guilds, setGuild,
        active, setActive, toggleDndChannels, toggleDndUsers, toggleRole}
        }>
        {children}
    </AppContext.Provider>
}

const useGlobalContext = ()=>{
    return useContext(AppContext);
}

export {AppProvider, useGlobalContext};