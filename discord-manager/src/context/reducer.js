import {} from './actions';

const reducer = (state, {type, payload})=>{
    switch (type) {
        case "HIDE_CHANNEL":
            return {...state, hiddenChannels: [...state.hiddenChannels, payload]};
        case "SHOW_CHANNEL":
            let channels = state.hiddenChannels.filter((channel)=>channel._id!==payload);
            return {...state, hiddenChannels: [...channels]};
        case "SHOW_ALL_CHANNELS":
            return {...state, hiddenChannels:[]};
        case "SHOW_OPTIONS":
            return {...state, isOptionsBar:true};
        case "HIDE_OPTIONS":
            return {...state, isOptionsBar:false};
        case "EMPTY_CHANNELS":
            return {...state, isHideEmptyChannels:!state.isHideEmptyChannels};
        case "HIDE_SHOW_BOTS":
            return {...state, isHideBots:!state.isHideBots};
        case "SHOW_USERS_STATE":
            return {...state, isUsersStateBar:true};
        case "HIDE_USERS_STATE":
            return {...state, isUsersStateBar:false};
        case "CLOSE_MODAL":
            return {...state, isModal:false};
        case "TOGGLE_DND_CHANNELS":
            return {...state, isDndChannels:!state.isDndChannels};
        case "TOGGLE_DND_USERS":
            return {...state, isDndUsers:!state.isDndUsers};
        case "OPEN_MODAL":
            const {operation, user} = payload;
            // let text = "Are you sure you want to " + operation + ' "' + user.displayName + '" ' + "from the guild?";
            if(user.kickable === false && operation ==="KICK"){
                let text = <p>{"You can't "} <span style={{color:"red"}}>{`${operation} `}</span> {" this user! Try to change the permissions of the Discord Manager Bot."}</p>;
                return {...state, isModal:true, modalContent:{...state.modalContent, modalText:text, modalFunction:"DENIED"}};
            }
            if(user.bannable === false && operation ==="BAN"){
                let text = <p>{"You can't "} <span style={{color:"red"}}>{`${operation} `}</span> {" this user! Try to change the permissions of the Discord Manager Bot."}</p>;
                return {...state, isModal:true, modalContent:{...state.modalContent, modalText:text, modalFunction:"DENIED"}};
            }
            let text = <p>{"Are you sure you want to "}<span style={{color:"red"}}>{`${operation} `}</span><span style={{color:"grey"}}>{user.displayName}</span> {" from the guild?"}</p>;
            return {...state, isModal:true, modalContent:{...state.modalContent, modalText:text, modalFunction:operation, id:user.id}};
        default:
            return state;
    }
}

export default reducer;