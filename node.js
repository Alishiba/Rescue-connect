const http = require('http')
const fs = require('fs')
const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/University")
		.then(function(){
			console.log("Database Connected")
		})
const studentschema = new mongoose.Schema({name: String, regno: Number, cgpa:Number});
const studentmodel = mongoose.model('studentsn', studentschema)