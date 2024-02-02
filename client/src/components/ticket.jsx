import './ticket.css';
import React, {useState, useEffect} from 'react';
import { SERVER } from '../config';

function Ticket({id, message, status, setDropDown, dropDown, statusOptions}){
    const [selected, setSelected] = useState(status)
    let availableOptions = statusOptions.filter(option => option !== selected)

    function updateDropdown(){
        if(dropDown === id){
            setDropDown(null)
        }else{
            setDropDown(id)
        }
        return
    }

    function updateStatus(option){
        setSelected(option)
        updateDropdown()
    }

    return(
        <div id={id} className="card">
            <dl className="header">
                <h2>Ticket ID: {id}</h2>
                <div onClick={()=>{updateDropdown()}} className={status}>
                    <div className='toggle'>
                        <p className='status' id={`status-${id}`}> {selected} </p>
                        <span id={dropDown!==id ?'toggle-symbol':'toggled-symbol'} class="material-symbols-outlined">arrow_drop_down</span>
                    </div>
                    <div className={dropDown === id?'dropdown':'hide-dropdown'}>
                        {availableOptions.map((option) => (
                            <p onClick={()=>{updateStatus(option)}}>{option}</p>
                        ))}
                    </div>
                    
                </div>
            </dl>
            <p className="message">{message}</p>
        </div>
    )

}

export default Ticket;