import './section4.css'
import React, {useState} from 'react';

const SERVER = 'http://localhost:8080/api'

function Section4(){
    const [fn, setfn] = useState('');
    const [ln, setln] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [brief, setBrief] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false)
    const handleSubmit = event =>{
        event.preventDefault();

        const data={
            firstName: fn,
            lastName: ln,
            company: company,
            email: email,
            phone:phone
        }
        setLoading(true);
        try{
            fetch(`${SERVER}/interest`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
              })
              .then((res) => res.json())
              .then((data)=>{
                if(data.success){
                    setLoading(false);
                    setSuccess(true)
                }
              });
        }
        catch{
            alert("Something went wrong on our end. Please try again later")
            return;
        }
        setLoading(false);
    }

    return(
        <section id='section4l'>
            <div className='sector'>
                {success?
                <div>
                    <h2>We got it!</h2>
                    <p><strong>Next Step</strong>, Make sure to check you inbox and schedule a meeting with us.</p>
                </div>
                :
                <form className='contact-form' onSubmit={handleSubmit} action="">
                    <input type="text" onChange={(e)=>{setCompany(e.target.value)}} value={company} placeholder='Company Name' required/>
                    <div className='name'>
                        <input type="text" onChange={(e)=>{setfn(e.target.value)}} value={fn}  placeholder='First Name' required/>
                        <input type="text" onChange={(e)=>{setln(e.target.value)}} value={ln} placeholder='Last Name' required/>
                    </div>
                    <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email} placeholder='Email' required />
                    <input type="text" onChange={(e)=>{setPhone(e.target.value)}} value={phone} placeholder='Phone #' required />
                    <textarea name="" onChange={(e) =>{setBrief(e.target.value)}} value={brief} id="" cols="30" rows="6" placeholder='Brief Us' required/>
                    <button className='submit-btn'>Send</button>
                </form>
                }
                {loading?
                    <div className='loading'>
                        <span class="material-symbols-outlined">progress_activity</span>
                    </div>:
                    null
                
                }
            </div>

            <div className='title-sector'>
                <h2>Contact <br /> Us</h2>
                <p>lets get you started</p>
                <a href="">561-990-6831</a>
                <a href="">support@otimaweb.com</a>
            </div>
        </section>
    )
}

export default Section4;