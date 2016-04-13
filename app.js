var express = require("express");
var tedious = require("tedious");
var sql = require("mssql");

var creds = null;
var j = 0;

console.log('starting');

var app = express();
var creds = {}

if(process.env.VCAP_SERVICES) {
    creds = JSON.parse(process.env.VCAP_SERVICES)['user-provided'][0].credentials;
} else {
    creds = {
	"server": "someotherserver.pivotal.io",
	"port": 1433,
	"user": "someuser",
	"password": "tiger",
	"database": "" // <-- default
    }
}

app.get("/", function(req, res) { 
	res.contentType("text/html");

	sql.connect(creds).then(function() {
		new sql.Request().query('select getdate() as d').then(function(recordset) {
			res.end('<h1>' + recordset[0].d + '</h1>');
		}).catch(function(err) {
		});
	    });
    });

app.listen(process.env.PORT || 8080, "0.0.0.0");
