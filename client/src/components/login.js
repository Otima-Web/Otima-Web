import * as jose from 'jose'
import './login.css'
import React, {useState, useEffect} from 'react'
const SERVER = 'http://localhost:8080/api'

function Login({loggedIn, setLoading, setName, setLoggedIn}){
    const [fn, setFN] = useState('')
    const [ln, setLN] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')


    useEffect(() =>{
        if(!loggedIn){
            window.google.accounts.id.initialize({
                client_id: '131856816778-kgbf58dn5r2uql5fgdvmmrvcmb40ded4.apps.googleusercontent.com',
                callback: responseGoogle
              });
              window.google.accounts.id.renderButton(
                  document.getElementById('buttonDiv'),
                  {theme: "filled", size: "large"}
              )
              window.google.accounts.id.prompt();
        }
      }, [window.performance.navigation.type]) 

    const responseGoogle = response =>{
        try{
            setLoading(true);
            const code = response;

            const data = jose.decodeJwt(code.credential)
            console.log(data)
            setName(data.name);

            fetch(`${SERVER}/login/`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
              })
              .then((res) => res.json())
              .then((data)=>{
                setLoggedIn(true);
                console.log(data)
              });
        }
        catch{
            alert("Something went wrong on our end. Please try again later")
            return;
        }
    }

    function register(){

    }


    return(
        <section id='login'>
            <form className='manual' action="">
                <div className='name'>
                <div className='input'>
                    <label className={fn !== "" ? 'placeholder':'placeholder-empty'}> <p>First Name</p> </label>
                    <input type="text" onChange={(e)=>{setFN(e.target.value)}} value={fn} required/>
                </div>
                    <div className='input'>
                    <label className={ln !== "" ? 'placeholder':'placeholder-empty'}> <p>Last Name</p> </label>
                    <input type="text" onChange={(e)=>{setLN(e.target.value)}} value={ln} required/>
                </div>
                </div>
                <div className='input'>
                    <label className={email !== "" ? 'placeholder':'placeholder-empty'}> <p>Email</p> </label>
                    <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email} required/>
                </div>
                <div className='input' id={password !== confirmation ? 'error' : null}>
                    <label className={password !== "" ? 'placeholder':'placeholder-empty'}> <p>Password</p> </label>
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} required/>
                </div>
                <div className='input' id={password !== confirmation ? 'error' : null}>
                    <label className={confirmation !== "" ? 'placeholder':'placeholder-empty'}> <p>Confirm Password</p> </label>
                    <input type="password" onChange={(e)=>{setConfirmation(e.target.value)}} value={confirmation} required/>
                </div>
                
                <input type="submit" value='Register' className='submit-btn' />
            </form>
            <div className='alternate'><dl className='line'></dl> or <dl className='line'></dl></div>
            <div id='buttonDiv'></div>
        </section>
    )

}

export default Login;