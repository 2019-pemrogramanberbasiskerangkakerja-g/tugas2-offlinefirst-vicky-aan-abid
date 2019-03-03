var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

connection.connect();

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// var tools = require("./tools.js");
// connection.query('SELECT * FROM accounts', function(error, results, fields) {
// 	for (var i = 0; i < results.length; i++) {
// 	    tools.addAccounts(results[i].username);
// 	}
// });

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				
				request.session.loggedin = true;
				request.session.username = username;
				response.send('Sukses!');
				// response.redirect('/home');
			} else {
				
				response.send('Gagal!');
			}			
			response.end();
		});

	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/get_from_db',function(req,res){
        connection.query("SELECT * from accounts",function(err,rows){
          res.json(rows[0]);
        });
});

app.get('/ping',function(req,res){
        res.json({"alive":"yes"});
});

app.get('/update',function(req,res){
        var ID=req.query.id;
        var content=req.query.data;
        var log=req.query.log;
    // for(var x=0;x<=ID;x++){
        /*Check if there is any row else put one row for all time*/
        connection.query("SELECT * from log WHERE id = '"+ID+"'", function(error, results, fields){
        		if (results.length == 0) {
     
                connection.query("INSERT into log(id,username,log) VALUES ('"+ID+"','"+content+"','"+log+"')",function(err,rows){
                    if(err)
                      {
                        console.log(err);
                        res.json({"error":"1"});
                      }
                      else
                        {
                          res.json({"yes":"1"});
                        }
                });
              } else {
              	connection.query("UPDATE log set log='"+log+"' where id='"+ID+"'",function(err,rows){
                    if(err)
                      {
                        console.log(err);
                        res.json({"error":"1"});
                      }
                    else
                      {
                        res.json({"yes":"1"});
                      }
                });
              }
        });
        
    // }
});
// app.get('/home', function(request, response) {
// 	if (request.session.loggedin) {
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

app.listen(3000,function(){
    console.log("I am live at PORT 3000.");
});