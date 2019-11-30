const express = require('express');
const json = require('json');
const bodyParser = require('body-parser');
const math = require('mathjs');
const map = require('hashmap');
const app = express();

app.use(bodyParser.json());

class pair{
    constructor(a , b){
        this.a = a;
        this.b = b;
    }
}

var pos = new map(Int32Array,pair);

function euclid(a , b , c , d){
    var dx = c - a;
    var dy = d - b;
    return math.sqrt((dx) * dx + dy * dy).toFixed(3);
}
 
function manhattan(a, b, c, d){
    return math.abs(c-a) + math.abs(d-b);
}
 
app.post("/distance" , (req , res , next) => {  
    var a,b,c,d;
//first pos
    try {
        var tmp = req.body.first_pos.toString().split("#");
        a = pos[tmp[1]].x;
        b = pos[tmp[1]].y;
    } catch (e) {
        a = parseFloat(req.body.first_pos.x);
        b = parseFloat(req.body.first_pos.y);
    }
//second pos
    try {
        var tmp = req.body.second_pos.toString().split("#");
        c = pos[tmp[1]].x;
        d = pos[tmp[1]].y;
    } catch (e) {
        c = parseFloat(req.body.second_pos.x);
        d = parseFloat(req.body.second_pos.y);
    }
    var type = "euclidean";
    try {
        type = req.body.metric.toString();
    } catch (e){

    }
    res.set("Content-type","application/json");
    var p;
    if(type == "euclidean") p = euclid(a , b , c , d);
    else if(type == "manhuttan") p = manhattan(a, b, c, d);
    else{
        res.status(400).end();
        return;
    }
    res.status(200);
    res.json({distance: p}).end();
});

app.put("/robot/:id/position" , (request , response) => {
    const id = parseInt(this.toString());
    console.log(id);
    var x = parseFloat(request.body.position.x);
    var y = parseFloat(request.body.position.y);
    pos[id] = new pair(x , y);
    response.status(204).end();
});

app.get("/robot/:id/position" , (request , response) =>{
    var x = parseInt(this.toString());
    if(pos.get(x) === undefined){
        response.status(404).end();
        return;
    }
    var px = pos[x].a;
    var py = pos[x].b;
    response.status(200).end();
    response.json({position: {x: px , y: py}}).end();
});

module.exports = app;