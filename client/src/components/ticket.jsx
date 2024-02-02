import './ticket.css';
import React, {useState} from 'react';
import { SERVER } from '../config';

function Ticket({id, message, status, setDropDown, dropDown}){

    function updateDropdown(){
        if(dropDown === id){
            setDropDown(null)
        }else{
            setDropDown(id)
        }

        // set new drop down selection

        return
    }

    function updateStatus(){
        updateDropdown();
                
    }

    return(
        <div id={id} className="card">
            <dl className="header">
                <h2>Ticket ID: {id}</h2>
                <div onClick={()=>{updateStatus()}} className={status}>
                    <div className='toggle'>
                        <p className='status'>{status}</p>
                        <span id={dropDown!==id ?'toggle-symbol':'toggled-symbol'} class="material-symbols-outlined">arrow_drop_down</span>
                    </div>
                    <div className={dropDown === id?'dropdown':'hide-dropdown'}>
                        <p>Resolve</p>
                        <p>Discard</p>
                    </div>
                    
                </div>
            </dl>
            <p className="message">{message}</p>
        </div>
    )

}

export default Ticket;