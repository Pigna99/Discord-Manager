import React from 'react'
import {DragDropContext} from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {useGlobalContext} from '../context';

import VoiceChannelDraggable from './dnd-components/VoiceChannelDraggable';
import HiddenVoiceChannels from './HiddenVoiceChannels';

import { isChannelHidden } from '../utils';


function VoiceChannelsContainer() {
    const {available, voiceChannels, dragUser, state} = useGlobalContext();
  if(available){
    voiceChannels.sort((first, second)=>first.position - second.position);
    // console.log(voiceChannels)
  }
    return (
        <>
        <section className="corp">
        <DragDropContext onDragEnd={result=>dragUser(result)}>
          <DndProvider backend={HTML5Backend}>
          {
            available ? voiceChannels.map((channel, index)=>{
              if(isChannelHidden(channel.id, state.hiddenChannels)){
                return null;
              }else if(channel.users.length===0 && state.isHideEmptyChannels){
                return null;
              }else{
                return <VoiceChannelDraggable key={channel.id} channel={channel} index={index}/>}}) : <div>CARICAMENTO CANALI</div>
          }
          </DndProvider>
        </DragDropContext>
        </section>
        {
          state.hiddenChannels.length !== 0 && <section className="corp hidden"><HiddenVoiceChannels/></section>
        }
        </>
    )
}

export default VoiceChannelsContainer
