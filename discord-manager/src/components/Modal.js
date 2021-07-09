import React from 'react'
import {useGlobalContext} from '../context'


function Modal() {
    const {state, closeModal, manageUser} = useGlobalContext();
    return (
        <div className={"sidebar-under modal " + (state.isModal ? 'sidebar-visible' : '')} onClick={closeModal}>
            <section className={"modal-container " +(state.isModal ? '' : 'modal-container-shift')} onClick={(ev)=>{ev.stopPropagation()}}>
                {state.modalContent.modalText}
                <div className="buttons-section">
                    {
                        state.modalContent.modalFunction === "DENIED" ? '' : <button className="btn kick" onClick={()=>{manageUser(state.modalContent.modalFunction, state.modalContent.id);closeModal()}}>{state.modalContent.modalFunction}</button>
                    }
                    <button onClick={closeModal} className="btn">Cancel</button>
                </div>
            </section>
        </div>
    )
}

export default Modal
