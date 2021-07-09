import React from 'react'
import {Draggable} from 'react-beautiful-dnd';
import VoiceUser from '../VoiceUser';
import {getStyle} from '../../utils/dragDropAnimation'

import {useGlobalContext} from '../../context'


function VoiceUserDraggable({user, index}) {
    const {state} = useGlobalContext();
    return (
        <Draggable key={user.id} draggableId={user.id} index={index} isDragDisabled={!state.isDndUsers}>
            {(provided, snapshot) =>{
                return (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        style={getStyle(provided.draggableProps.style, snapshot)}>
                            <VoiceUser key={user.id} {...user}/>
                    </div>
                )
            }}
        </Draggable>
    )
}

export default VoiceUserDraggable
