var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'db4free.net',
	user     : 'tugaspbkk',
	password : 'Wahyu2701',
	database : 'nodelogin'
});
var localconnection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

connection.connect();
localconnection.connect();

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
    connection.query("SELECT * from accounts order by id desc",function(err,results){
      res.json(results);
    });
});

app.get('/ping',function(req,res){
    res.json({"alive":"yes"});
});

app.get('/update',function(req,res){
    var ID=req.query.id;
    var content=req.query.data;
    var log=req.query.log;
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
});

app.get('/addinsql',function(req,res){
    var ID=req.query.id;
    var user=req.query.user;
    var pass=req.query.pass;
    localconnection.query("INSERT into accounts(id,username,password) VALUES ('"+ID+"','"+user+"','"+pass+"')", function(error, results, fields){
    });
});

app.listen(3000,function(){
    console.log("I am live at PORT 3000.");
});