import './dashboard.css'
import React ,{useState, useEffect} from 'react'
import Cookies from 'js-cookie';
import { SERVER } from '../config'

import Selection1 from './selection1'
import Selection2 from './selection2'
import Selection3 from './selection3'


function Dashboard(){
    const [selection, setSelection] = useState(0)
    const [loading, setLoading] = useState(true)

    const [obtained1, setObtained1] = useState(null)
    const [obtained2, setObtained2] = useState(null)
    const [obtained3, setObtained3] = useState(null)

    const [tickets, setTickets] = useState([{id:1, message:'skdjfbkjsd fdjfbksjdf dsjfbkj dfjkbdf sdkjf sdkf dsf dskf'}, {id:3, message:'skdjfbkjsd fdjfbksjdf dsjfbkj dfjkbdf sdkjf sdkf dsf dskf'}])

    const select = (selected) => {
        const moveSelection = document.getElementById('shadow-selected');
        setSelection(selected);

        switch(selected){
            case 0:
                moveSelection.style.top = `${100 * selected}%`
                break;
            case 1:
                moveSelection.style.top = `${100 * selected}%`
                break;
            case 2:
                moveSelection.style.top = `${100 * selected}%`
                break;
        }
    }

    const setTabData = async (tab, sessionID) =>{
        // defiens tab we getting
        let fetchTab = null;

        // set which tab is needed
        fetchTab = (obtained1 === null && tab === 0) ? tab : (obtained2 === null && tab === 1) ? tab : (obtained3 === null && tab === 2) ? tab : fetchTab;

        // all tabs loaded return
        if(fetchTab === null){
            return
        }

        const url = new URL(`${SERVER}/data-request/`);
        url.searchParams.append('category', fetchTab);
        url.searchParams.append('session', sessionID);
        
        try {
            const response = await fetch(url, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            const data = await response.json();

            if(!data.success){
                alert('Something went Wrong');
                return
            }

            if(fetchTab === 0){
                setObtained1(data.info)
            }
            else if(fetchTab === 1){
                setObtained2(data.info)
            }
            else if(fetchTab === 2){
                setObtained3(data.info)
            }

            return;
    
          } catch (error) {
            console.error('Error during session validation:', error);
            return false;
          }
    }

    useEffect( ()=>{
        const sessionID = Cookies.get('SessionID');

        const fetchData = async () => {
            setLoading(true);
            await setTabData(selection, sessionID);
            setLoading(false);
        };
    
        fetchData();
    
        return () => {
        };

    },[selection])



    function hideNotice(){
        const notice = document.querySelector('.notice');
        notice.className = 'notice-disappear';

    }
    return(
        <body id='dashboard'>
            <div className='notice'>
                <p> Un-Deploys must be requested at least 1 month following the renewal date to be eligible for a refund </p>
                <span onClick={(e) =>hideNotice(e)} class="material-symbols-outlined">close</span>
            </div>
            <section className='left'>
                <ul className='column'>
                    <dl className={selection === 0 ? 'selected':null} onClick={() =>{select(0)}}>
                        <p>OverView</p>
                        <div id='shadow-selected'></div>
                    </dl>
                    <dl className={selection === 1 ? 'selected':null} onClick={() =>{select(1)}}>
                        <p>Tickets</p>
                    </dl>
                    <dl className={selection === 2 ? 'selected':null} onClick={() =>{select(2)}}>
                        <p>Profile</p>
                    </dl>
                    <div className='note'>
                        <p>For additional information please reach out to <strong>support@otima.com</strong></p>
                    </div>
                </ul>
            </section>
            <section className='right'>
                {selection===0 ? <Selection1 data={obtained1} /> :null}
                {selection===1 ? <Selection2 data={obtained2} /> :null}
                {selection===2 ? <Selection3 data={obtained3} /> :null}
            </section>
        </body>
    )

}

export default Dashboard;