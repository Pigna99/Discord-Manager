const isChannelHidden = (id, channels)=>{
    for(let i=0; i< channels.length; i++){
      if(id === channels[i]._id){
        return true;
      }
    }
    return false;
}


const getColor = (state)=>{
  switch (state) {
      case "online":
          return "rgb(59, 226, 59)";
      case "idle":
          return "rgb(223, 161, 27)";
      case "dnd":
          return "rgb(223, 27, 27)";
      case "offline":
          return "rgb(67, 80, 67)";
      default:
          break;
  }
}

 
const getOnlinePlatform= (clientStatus)=>{
  if(clientStatus === null){
      return "offline";
  }
  let string="";
  if(clientStatus.desktop){
      string += "desktop-" + getStatus(clientStatus.desktop);
  }
  if(clientStatus.web){
      string += "web-" + getStatus(clientStatus.web);
  }
  if(clientStatus.mobile){
      string += "mobile-" + getStatus(clientStatus.mobile);
  }
  return string;
}

const getStatus = (status)=>{
  switch (status) {
      case "online":
          return "online ";
      case "idle":
          return "idle ";
      case "dnd":
          return "dnd ";
      default:
          return "offline ";
  }
}

const formatTime = (time)=>{
    const hours = time.getHours()-1;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    // console.log(`${hours}:${minutes}:${seconds}`)
    let time_text='';
    if(minutes===0){
        return seconds;
    }else if(minutes!==0){
        if(seconds<10){
            time_text = `0${seconds}`;
        }else{
            time_text = `${seconds}`;
        }
        if(hours=== 0){
            return `${minutes}:`+time_text;
        }else if (hours!==0 && minutes<10){
            time_text = `0${minutes}:`+time_text;
        }else if (hours!==0 && minutes>10){
            time_text = `${minutes}:`+time_text;
        }
    }
    return `${hours}:`+time_text;
}


export {isChannelHidden, getColor, getOnlinePlatform, formatTime};