var mysql = require('mysql');
var randomstring = require("randomstring");

function saveData(sql, values) {
  return new Promise((resolve, reject) => {
    const database = mysql.createConnection({
      "database": "b9f34c5_OtimaWeb",
      "user": "b9f34c5_Admin",
      "password": "OTIMAWEB_admin",
      "host": "198.46.91.127"
      // "debug": true
    });

    database.connect(async (err) => {
      if (err) {
        console.error('error connecting: ' + err.stack);
        reject(err);
        return;
      }

      database.query(sql, values, (err, results) => {
        if (err) {
          console.error(err);
          resolve(null);

        } else {
          resolve(results);
        }
        // Close the database connection
        database.end();
      });
    });
  });
}
  
function retrieveData(sql) {
  return new Promise((resolve, reject) => {
  let success = false;

    database = mysql.createConnection({
      "database": "b9f34c5_OtimaWeb",
      "user": "b9f34c5_Admin",
      "password": "OTIMAWEB_admin",
      "host": "198.46.91.127",
      // "debug":true
    });
  
    database.connect(async function(err) {
      if(err){
        reject(err)
      }
      else{
        database.query(sql, (err, results) => {
          if (err) {
            console.log(err)
            resolve([]);

          } else {
            if(results.length === 0){
              resolve([]);
            }else{
              resolve(results[0]);
            }
          }
        });
      }
      database.end();
    }); 
  });
}

function setSession(userID, newSessionID){
  // update session value if valid, create new one if not
  return new Promise((resolve, reject) => {
  let token;

  if(newSessionID === null){
    token = randomstring.generate(40);
  }else{
    token = newSessionID;
  }

  const values = [
    `${userID}`,
    `${token}`
    ];

  const update = `UPDATE Sessions SET sessionID = '${token}', Creation = CURRENT_TIMESTAMP WHERE user_id = ${userID}`;
  const add = 'INSERT INTO `Sessions`(`user_id`, `sessionID`, `Creation`) VALUES (?,?,NOW())';

  database =  mysql.createConnection({
    "database": "b9f34c5_OtimaWeb",
    "user": "b9f34c5_Admin",
    "password": "OTIMAWEB_admin",
    "host": "198.46.91.127",
    // "debug":true
  });

  database.connect(async (err) => {
    if(err){
      console.error('error connecting: ' + err.stack);
      return;
    }
    
    else{
      database.query(update, (err, results) => {
        if (err) {
          console.error(err)
          database.end();
          resolve(null)

        } else {
          if(results.changedRows >=1){
            resolve({new:true, sessionID:token})
            database.end();
          }
          else{
            database.query(add, values, (err, results) => {
              if (err) {
                console.error(err)
                resolve(null)
      
              } else {
                if(results){
                  database.end();
                  resolve({new:true, sessionID:token})
                }
              }
            });
          }
        }
      });
    }
  }); 
});
}

function checkSession(sql){
  return new Promise((resolve, reject) =>{
    database = mysql.createConnection({
      "database": "b9f34c5_OtimaWeb",
      "user": "b9f34c5_Admin",
      "password": "OTIMAWEB_admin",
      "host": "198.46.91.127",
      // "debug":true
    });
  
    database.connect(async (err) => {
      if(err){
        console.error('error connecting: ' + err.stack);
        reject(err);
        database.end();
      }
      
      else{
        database.query(sql, (err, results) => {
          if (err) {
            resolve({success:false})
            database.end();
          } 
          else {
            if(results.length > 0){
              resolve({success:true, userID:results[0].user_id})
              database.end();
            }else{
              resolve({success:false})
              database.end();

            }
          }
        });
      }
    }); 
  })
}

// return if successfully deleted session or not
function deleteSession(sessionID){
  return new Promise((resolve, reject) => {  
    const remove = `DELETE FROM Sessions WHERE sessionID = '${sessionID}'`;
  
    database =  mysql.createConnection({
      "database": "b9f34c5_OtimaWeb",
      "user": "b9f34c5_Admin",
      "password": "OTIMAWEB_admin",
      "host": "198.46.91.127",
      // "debug":true
    });
  
    database.connect(async (err) => {
      if(err){
        console.error('error connecting: ' + err.stack);
        return;
      }
      
      else{  
        database.query(remove, (err, results) => {
          if (err) {
            console.error(err)
            database.end();
            resolve(null)
  
          } else {
            if(results.affectedRows >=1){
              resolve(true)
            }
            else{
              resolve(false)
            }
            database.end();
          }
        });
      }
    }); 
  }); 
}

module.exports = { saveData, retrieveData, setSession, checkSession, deleteSession };