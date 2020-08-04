var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while(namespace.length){
			formParam += '['+namespace.shift()+']';
		}
		return {
			param :formParam,
			msg : msg,
			value : value
		};
	}
}));

app.use(flash());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});

app.use('/', routes);
app.use('/users', users);

app.listen(3000);
console.log('Server started at port 3000');