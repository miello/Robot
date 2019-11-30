const express = require('express');
const json = require('json');
const bodyParser = require('body-parser');
const math = require('mathjs');

const app = express();
app.use(bodyParser.json());

function euclid(a , b , c , d){
    var dx = c - a;
    var dy = d - b;
    return math.sqrt((dx) * dx + dy * dy).toFixed(3);
}

app.post("/distance" , (req , res , next) => {    
    var a = parseFloat(req.body.first_pos.x);
    var b = parseFloat(req.body.first_pos.y);
    var c = parseFloat(req.body.second_pos.x);
    var d = parseFloat(req.body.second_pos.y);
    res.set("Content-type","application/json");
    var p = euclid(a , b , c , d);
    res.status(200);
    res.json({distance: p}).end();
    return;
});

module.exports = app;