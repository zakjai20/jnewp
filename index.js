var path = require('path');
var fs   = require('fs');
var log  = console.log;

var DDP = {
    "/client" : {
        $_ : ["index.html"],
        "/js" : {
            $_ : ["index.js"]
        },
        "/css" : {
            $_ : ["style.css"]
        }
    },
    "/server" : {
        $_ : ["index.js"],
        "/lib" : {
            $_ : ["app.js"]
        }
    },
    "/downloads" : {
        $_ : []
    }
}
function JMDir(base,$p){
    var $pa = $p.split('/'),
        {length} = $pa,
        $sp = [];
        for(var i=0; i<length; i++){
            var $np = path.join(base, $pa.join('/'));
            if(fs.existsSync($np)){
                base =path.join(base,$pa.join('/'))
                for(var j=0; j<$sp.length; j++){
                    var $nnp = path.join(base, $sp.slice(0,j+1).join('/'))
                if(!fs.existsSync($nnp)){
                    fs.mkdirSync($nnp);
                }
            }
        }else{
            $sp.unshift($pa.pop());
        }
    }
}
function JMFile(base,$p){
    var file = path.join(base, $p);
    if(!fs.existsSync(file)){
        fs.writeFileSync(file,"","utf8");
    }
}
function getDF(base,obj,data={dirs:[],files:[]}){
    var keys = Object.keys(obj);
    keys.forEach((e)=>{
        if(e !== "$_"){
            var $base = path.join(base,e);
            data.dirs.push($base);
            JMDir(base,e);
            var files = obj[e].$_;
            if(files){
                files.forEach((e)=>{
                    data.files.push(path.join($base,e));
                    JMFile($base, e);
                })
            }
            if(typeof obj[e] === "object"){
                getDF($base,obj[e],data);
            }
        }
    })
    return data;
}
function create(){
    var data = [];
    var [base,obj,...objs] = [...arguments]
    if(!obj){
        obj = DDP;
    }
    objs.unshift(obj);
    objs.forEach((e)=>{
        data.push(getDF(base,e));
    });
    return data
}
module.exports = {JMDir,JMFile,create,getDF};