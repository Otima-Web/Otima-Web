import React,{useState, useEffect} from "react";
import Ticket from "../components/ticket";
import './section2.css'
import Cookies from 'js-cookie';
import { ThreeDots } from 'react-loading-icons'

import { SERVER } from '../config';

const options = ["Requested", "Resolved", "Discarded"]

function Selection2({ data }) {
    const [dropDown, setDropDown] = useState(null);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    
    async function handleTicket(e){
      e.preventDefault()
      const sessionID = Cookies.get('SessionID');

      try{
        setLoading(true)
        fetch(`${SERVER}/ticket-submition`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: message, sessionID: sessionID})
          })
          .then((res) => res.json())
          .then((data)=>{
            if(data.success){
              setLoading(false)
              data.unshift({message: message, id:2})
              setMessage('')

              setInterval(()=>{
                setSent(true)
              }, 100)
              setSent(false)
            }
          });
      }
      catch{
        alert("Something went wrong on our end. Please try again later")
        return;
    }
        return false;
    }

    return (
      <section id="tickets">
        {sent && 
        <div className="notify-sent">
          <h2>Ticket Submitted</h2>
        </div>}
        <div className={data === null ? 'loading' : 'loaded'}>
            <form className="new-ticket" onSubmit={(e)=>{handleTicket(e)}}>
              {loading && 
                <div className="sending">
                  <ThreeDots id="loading" stroke="whitesmoke" fill='#584082' speed={1.15}/>
                </div>}
              <h2>Submit Ticket</h2>
              <textarea  className="text" placeholder="Write Request" value={message} onChange={(e)=>{setMessage(e.target.value)}} required></textarea>
              <input className="ticket-btn" type="submit" value={'Send'} />
            </form>
            <div className="tickets">
              {data !== null && data.length>0 && (
                <React.Fragment>
                  {data.map((ticket) => (
                      <Ticket key={ticket.id} id={ticket.id} user={ticket.user} message={ticket.message} status={ticket.status}
                      dropDown={dropDown} setDropDown={setDropDown} statusOptions={options}/>
                  ))}
              </React.Fragment>
              )}
              {data !== null && data.length === 0 && <h4 className="empty-text">No tickets</h4>}
              {data === null && <div className="empty-text"><ThreeDots stroke="whitesmoke" fill='#584082' speed={1.15}/></div>}
            </div>
          </div>
      </section>
    );
  }
  

export default Selection2;