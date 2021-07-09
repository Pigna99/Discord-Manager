import React from 'react'
import VoiceChannelDroppable from './VoiceChannelDroppable'
import {useDrag} from 'react-dnd';
import {useGlobalContext} from '../../context'

function VoiceChannelDraggable({channel, index}) {
  const {state} = useGlobalContext();
    //useDrag: The channel is draggable and trasport the id.
    const [{isDragging}, drag] = useDrag(() => ({
        type: "CHANNEL",
        item: {id:channel.id},
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))

    return (
      
        <div
          ref={drag}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'auto',
          }}
          className="fix-flex"
          onDragStart={e => {
            if(state.isDndChannels === false){
              e.preventDefault();
              e.stopPropagation();
            }
          }} 
        >
          <VoiceChannelDroppable key={channel.id} channel={channel} index={index}/>
        </div>
        
    )
}

export default VoiceChannelDraggable