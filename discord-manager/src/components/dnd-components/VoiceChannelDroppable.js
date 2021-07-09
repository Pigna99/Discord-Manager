import React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import VoiceChannel from '../VoiceChannel';
import {useDrop} from 'react-dnd';
import {useGlobalContext} from '../../context/index'


function VoiceChannelDroppable({channel, index}) {
  const {dragAllUsers} = useGlobalContext();
  //usedrop: the Channel accept a draggable channel and take is id!
  const [{isOver}, drop] = useDrop(() => ({
    accept: "CHANNEL",
    drop: (item) => dragAllUsers(item.id, channel.id),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])
    return (
    <div ref={drop} className="flex-container">
      <Droppable key={channel.id} droppableId={channel.id}>
        {(provided, snapshot)=>{
          return (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex-container">
              <VoiceChannel {...channel} index={index} prov={provided} isHover={snapshot.isDraggingOver || isOver}/>
            </div>
          )
        }}
      </Droppable>
    </div>)    
}

export default VoiceChannelDroppable
