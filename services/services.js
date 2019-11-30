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
    return parseFloat(math.sqrt(dx * dx + dy * dy).toFixed(4));
}
 
function manhattan(a, b, c, d){
    return math.abs(c-a) + math.abs(d-b);
}
 
app.post("/distance" , (req , res , next) => {  
    var a,b,c,d;
//first pos
    try {
        var tmp = req.body.first_pos.toString().split("#");
        a = pos[tmp[1]].a;
        b = pos[tmp[1]].b;
    } catch (e) {
        a = parseFloat(req.body.first_pos.x);
        b = parseFloat(req.body.first_pos.y);
    }
//second pos
    try {
        var tmp = req.body.second_pos.toString().split("#");
        c = pos[tmp[1]].a;
        d = pos[tmp[1]].b;
    } catch (e) {
        c = parseFloat(req.body.second_pos.x.toString());
        d = parseFloat(req.body.second_pos.y.toString());
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
    // console.log(typeof p);
    res.status(200);
    res.json({distance: p}).end();
});

app.put("/robot/:id/position" , (request , response) => {
    const id = parseInt(request.params.id);
    var x = parseFloat(request.body.position.x);
    var y = parseFloat(request.body.position.y);
    pos.set(id , new pair(x , y));
    response.status(204).end();
});

app.get("/robot/:id/position" , (request , response) =>{
    const id = parseInt(request.params.id);
    if(pos.get(id) == undefined){
        response.status(404).end();
        return;
    }
    var px = pos.get(id);
    response.status(200);
    response.json({position: {x: px.a , y: px.b}}).end();
});

app.post("/nearest" , (req , res , next) => {
    var a = parseFloat(req.body.ref_position.x);
    var b = parseFloat(req.body.ref_position.y);
    var dist = -1;
    var id = -1;
    for (var pair of pos) {
        var l = parseFloat(pair.value.x);
        var r = parseFloat(pair.value.y);
        // console.log(l , r);
        var pl = euclid(l , r , a , b);
        if(dist == -1){
            dist = pl;
            id = pair.key;
        }
        else if(pl < dist){
            dist = pl;
            id = pair.key;
        }
    }
    var ans = [];
    if(id != -1){
        ans.push(id);
    }
    res.status(200);
    res.json({robot_ids: ans}).end();
    return;
});

app.post("/closestpair", (req, res, nest) =>{
    var x = [];
    var y = [];
    for(var[key,val] of pos){
        x.push(val.x);
        y.push(val.y);
    }
    var dist = -1;
    for(i = 0 ; i < x.length ; i++){
        for(j = i + 1 ; j < x.length ; j++){
            if(dist == -1){
                dist = euclid(x[i], y[i], x[j], y[j]);
            }
            else{
                if(euclid(x[i], y[i], x[j], y[j]) < dist){
                    dist = euclid(x[i] , y[i] , x[j] , y[j]);
                }
            }
        }
    }
    if(dist == -1){
        res.status(424);
        return;
    }
    res.status(200);
    res.json({distance: dist}).end();
    return;
});

module.exports = app;