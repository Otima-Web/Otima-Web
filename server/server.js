const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
const fs = require('fs');
const {google} = require('googleapis');
// var http = require('http');
// var url = require('url');
const db = require("./database.js")   
var mysql = require('mysql');
const crypto = require('crypto');

const PORT = process.env.PORT || 9999;

const app = express();

// const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT)

// nodemon run 'nodemon ./server.js' for auto updates
// pm2 start server.js

var transporter = nodemailer.createTransport({
  host: "ecngx348.inmotionhosting.com",
  port: "465",
  secure: true,
  auth: {
     user: "support@otimaweb.com", 
     pass: "850423Ab_INMOTION"
  }
});

app.use(cors());
app.use(bodyParser.json());


// handles Registering users
async function register(sql, values){
  const userData = await db.saveData(sql, values);

  // check if user was created
  if(userData === null){
    return res.json({success: false, sessionID: null})   
  }

  // get Session ID
  const session = await db.setSession(userData.insertId, null);

  return session;
}

// handles logging in users
async function login(sql){
  const userData = await db.retrieveData(sql);

    if(userData === null){
      return ({ success: false, sessionID: null, newSession:false, user: null}) 
    }
    else{
      const status =  await db.setSession(userData.ID, null);
      // return sessionID and if it was updated or not

      return ({ success: true, sessionID: status.sessionID, newSession: status.new, user: userData}) 
    }
}

app.post("/api/interest", async (req, res) => {
  const data = req.body.data; // This will contain the JSON data sent in the request

const templatePath = './clientEmail.html';
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

// Replace dynamic data
const personalizedHtml = htmlTemplate.replace('/NAME/', data.firstName);


  var receipt = {
    from: process.env.EMAIL,
    to: `${data.email}`,
    subject: 'Otima Web Team',
    html:personalizedHtml
  }
  var loggingData = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Otima Web (Interest Request)',
    html:`<p>Client Name: <strong>${data.firstName} ${data.lastName}</strong> </p>
    <p>Company: ${data.company}</p>
    <p>Email: ${data.email}</p>
    <p>Phone: ${data.phone}</p>`
}

  transporter.sendMail(loggingData, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response)
    }
  })

  transporter.sendMail(receipt, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response)
    }
})

  return res.json({'success':true}) 

});

// handle estimator on landing page
app.post("/api/text", async (req, res) => {
  const data = req.body.data; 

  let selected;
  if(data.selected.length===1){
    selected = parseInt(data.selected, 10);
  }
  else{
    selected = data.selected;
  }

  let options=[]
  let question='';
  let price = data.price;
  let domain = false;
  let complete = false;
  let maitnance = data.maitnance;
  let multiSelect = false;

  switch(data.question){
    case 1:
      options = ['< 1 Month', '1-3 Months', '1-3+ Months']
      question = 'Time Window for production build'
      
      if(selected === 0){
        price += 420;
      }
      else if(selected === 1){
        price += 1100;
      }
      else if(selected === 2){
        price += 600;
      }
      else if(selected === 3){
        price += 650;
      }
      break;

    case 2:
      options = ['Payments', 'Mobile Implementation', 'Automated Emails', 'OpenAI', 'Image Upload', 'User Handling', 'None']
      question = 'Which features are you looking to implement'
      multiSelect = true;

      if(selected === 0){
        price *= 1.2;
      }
      else if(selected === 1){
        price *= 1.1;
      }
      break;

    case 3:
      options = ['Yes', 'No']
      question = 'Do you have your own Domain aquired'
      
      for(let option in selected){
        option -= '0';

        if(option === 0){
          price += 100;
        }
        else if(option === 1){
          price += 40;
        }
        else if(option === 2){
          price += 65;
        }
        else if(option === 3){
          price += 70;
          maitnance += 100;
        }
        else if(option === 4){
          price += 100;
          maitnance += 20;
        }
      }

      break;

    case 4:
      if(selected === 1){
        maitnance += 30;
        price += 20;
      }
      complete = true;
      break;
  }

  return res.json({
    'success':true,
    'complete': complete,
    'question': question,
    'options': options,
    'price': Math.trunc(price),
    'maitnance': maitnance,
    'domain': domain,
    'multiSelect':multiSelect,
  }) 

});

app.post("/api/login", async (req, res) => {
  // returns sessionID or failed attempt to login
  try{
    const data = req.body.credentials

    const cryptPswrd = crypto.createHash('sha256').update(data.pswrd).digest('hex');
  
    const sql = `SELECT ID, 'First Name', Email, 'Last Name' FROM User WHERE Email = '${data.email}' AND Password = '${cryptPswrd}'`;
  
    const result  = await login(sql);

    return res.json(result);
  }
  catch(err){
    console.log(err)
    return res.json({success: false}) 
  }

});

app.post("/api/register", async (req, res) => {

  try{
    const data = req.body.data

    const cryptPswrd = crypto.createHash('sha256').update(data.pswrd).digest('hex');

    const values = [
      '',
      `${data.fn}`,
      `${data.ln}`,
      `${data.email}`,
      '',
      `${cryptPswrd}`,
      '',
    ];
  
    const sql = "INSERT INTO `User`(`ID`, `First_Name`, `Last_Name`, `Email`, `Google_ID`, `Password`, `Account Creation`, `Business`) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)";

    const session = await register(sql, values);

    if(!session.new){
      return res.json({ success: false, sessionID: null}) 
    }
    else{
      return res.json({ success: true, sessionID: session.sessionID}) 
    }
  }
  catch (error){
    console.log(error)
    return res.json({success: false, sessionID: null})   
  }

});

app.post("/api/google-signin", async (req, res) => {
// Signin with google
  try{
    const data = req.body.data

    const values = [
      '',
      `${data.given_name}`,
      `${data.family_name}`,
      `${data.email}`,
      `${data.sub}`,
      ``,
      '',
    ];
  
    const loginSQL = `SELECT ID, 'First Name', Email, 'Last Name' FROM User WHERE Google_ID = '${data.sub}' `;
    const registerSQL = 'INSERT INTO `User`(`ID`, `First_Name`, `Last_Name`, `Email`, `Google_ID`, `Password`, `Account Creation`, `Business`) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)';

    const loginResult  = await login(loginSQL);



    if(loginResult.success){
      return res.json(loginResult)
    }
    else{
      const session = await register(registerSQL, values);

      if(!session.new){
        return res.json({ success: false, sessionID: null}) 
      }
      else{
        return res.json({ success: true, sessionID: session.sessionID}) 
      }
    }
  }
  catch (error){
    console.log(error)
  }

  return res.json({'success':true}) 

});

app.post("/api/appointment", async (req, res) => {
// Book appointment (send email to user with Zoom Link)

  try{

  }
  catch (error){
    console.log(error)
  }

  return res.json({'success':true}) 

});

app.get("/api/sessionValidation", async (req, res) => {
// check if session is valid or not
  const sessionID = req.query.session;

  const sql = `SELECT user_id FROM Sessions WHERE sessionID = '${sessionID}'`;

  const response = await db.checkSession(sql);

  return res.json({'success':response.success}) ;
});

// Data request, takes in sessionID and category (number) for what data u want
app.get("/api/data-request", async (req, res) => {
  // check if session is valid or not
    const sessionID = req.query.session;
    const category = parseInt(req.query.category, 10);
    let request = null;

    if(category === 0){
      request = `User.ID,
      User.First_Name,
      User.Last_Name,
      User.Business,
      User.Email,
      CONVERT(CONCAT('[', GROUP_CONCAT(
        DISTINCT JSON_OBJECT(
          'id', Project.ID,
          'user', Project.Account,
          'domain', Project.Domain,
          'Upfront_Fee', Project.Upfront_Fee,
          'price', Project.Maintenance,
          'renewal', Project.Renewal
        )
      ), ']') USING utf8mb4) AS projects`;
      
    }else if(category === 1){
      request = `CONVERT(CONCAT('[', GROUP_CONCAT(
        DISTINCT JSON_OBJECT(
        'id', Tickets.id,
        'user', Tickets.user_id,
        'message', Tickets.message,
        'status', Tickets.status
      )
    ), ']') USING utf8mb4) AS tickets`;

    }else if(category === 2){
      request = `User.First_Name, User.Last_Name, User.Email, User.Business, User.Account_Creation, User.email_confirmed`;
    }

    const data = `
    SELECT
      ${request}
    FROM
      User
    LEFT JOIN
      Sessions ON User.id = Sessions.user_id
    LEFT JOIN
      Tickets ON User.id = Tickets.user_id
    LEFT JOIN
      Project ON User.id = Project.Account
    WHERE
      Sessions.sessionID = '${sessionID}'
    GROUP BY
      User.id
      ${category === 1 ? 'HAVING COUNT(DISTINCT Tickets.id) > 0': ''}
      ${category === 0 ? 'HAVING COUNT(DISTINCT Project.ID) > 0': ''}
  `;

    const requestedData = await db.retrieveData(data);

    if(requestedData === null){
      return {success:true, info:null}
    }

    if(category === 0){
      formattedResult = {
      id: requestedData.ID,
      first: requestedData.First_Name,
      last: requestedData.Last_Name,
      email:requestedData.Email,
      business: requestedData.Business,
      projects: JSON.parse(requestedData.projects)
    };
      
    }else if(category === 1){
      formattedResult = requestedData

    }else if(category === 2){      
      formattedResult = requestedData
    }

    return res.json({success:true, info:formattedResult});
  });

app.delete("/api/logout", async (req, res) =>{
  const sessionID = req.body.sessionID;

  //  delete session
  const success = await db.deleteSession(sessionID);

  

  return res.json({success: success})
});

// given ticket return if successfully requested
app.post("/api/ticket-submition", async (req,res) =>{
    const sessionID = req.body.sessionID;
    const message = req.body.message

    const sql = 'CALL Ticket_Submition(?, ?)';
    const values = [sessionID, message];

    const response = await db.saveData(sql, values);

    if(response.affectedRows > 0){
      return res.json({success:true})
    }
    else{
      return res.json({success:false})
    }

});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// constantly check for expired sessions
setInterval(function() {
      const sql = 'DELETE FROM `Sessions` WHERE `Creation` < NOW() - INTERVAL 2 HOUR';

      const ruotineCleaning = mysql.createConnection({
        "database": "b9f34c5_OtimaWeb",
        "user": "b9f34c5_Admin",
        "password": "OTIMAWEB_admin",
        "host": "198.46.91.127",
        // "debug": true
      });
  
      ruotineCleaning.query(sql, function(err) {
        ruotineCleaning.end()

        if (err) {
          console.log('Query failed:', err);
        } else {
          console.log('Query successful');
        }
      });
},60000);

