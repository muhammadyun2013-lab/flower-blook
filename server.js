const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PORT = Number(process.env.PORT || 3000);
const rooms = new Map();
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir,{recursive:true});
const DEFAULT_QUESTIONS = [
  {
    "text": "Чему равен sin 30°?",
    "options": [
      "1/2",
      "√3/2",
      "1",
      "0"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен cos 60°?",
    "options": [
      "0",
      "√2/2",
      "1/2",
      "√3/2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен tg 45°?",
    "options": [
      "√3",
      "1",
      "0",
      "1/√3"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен ctg 45°?",
    "options": [
      "0",
      "√3",
      "1/2",
      "1"
    ],
    "correct": 3
  },
  {
    "text": "Чему равен sin 60°?",
    "options": [
      "1/2",
      "1",
      "√3/2",
      "√2/2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен cos 30°?",
    "options": [
      "√3/2",
      "1/2",
      "0",
      "1"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен tg 30°?",
    "options": [
      "√3",
      "√3/3",
      "1",
      "0"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен ctg 60°?",
    "options": [
      "1",
      "√3",
      "0",
      "√3/3"
    ],
    "correct": 3
  },
  {
    "text": "Чему равен sin 45° · cos 45°?",
    "options": [
      "1/4",
      "1",
      "1/2",
      "√2/2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен sin² 30° + cos² 30°?",
    "options": [
      "1",
      "1/2",
      "√3/2",
      "2"
    ],
    "correct": 0
  },
  {
    "text": "Если sin α = 3/5 и α острый, чему равен cos α?",
    "options": [
      "3/4",
      "4/5",
      "5/4",
      "2/5"
    ],
    "correct": 1
  },
  {
    "text": "Если cos α = 5/13 и α острый, чему равен sin α?",
    "options": [
      "5/12",
      "13/12",
      "12/13",
      "8/13"
    ],
    "correct": 2
  },
  {
    "text": "Если sin α = 4/5 и α острый, чему равен tg α?",
    "options": [
      "3/4",
      "5/3",
      "4/5",
      "4/3"
    ],
    "correct": 3
  },
  {
    "text": "Если tg α = 3/4 и α острый, чему равен ctg α?",
    "options": [
      "4/3",
      "3/4",
      "7/4",
      "1"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен 2 sin 30° + cos 60°?",
    "options": [
      "1",
      "3/2",
      "2",
      "1/2"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен cos 0° − sin 0°?",
    "options": [
      "0",
      "−1",
      "1",
      "2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен sin 90° + cos 90°?",
    "options": [
      "2",
      "0",
      "1",
      "−1"
    ],
    "correct": 2
  },
  {
    "text": "Как выразить tg α через sin α и cos α?",
    "options": [
      "cos α / sin α",
      "sin α · cos α",
      "1 / cos α",
      "sin α / cos α"
    ],
    "correct": 3
  },
  {
    "text": "Как выразить ctg α через sin α и cos α?",
    "options": [
      "cos α / sin α",
      "sin α / cos α",
      "sin α + cos α",
      "1 / sin α"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен sin 120°?",
    "options": [
      "−√3/2",
      "√3/2",
      "1/2",
      "−1/2"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен cos 120°?",
    "options": [
      "1/2",
      "√3/2",
      "−1/2",
      "−√3/2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен tg 135°?",
    "options": [
      "1",
      "−√3",
      "0",
      "−1"
    ],
    "correct": 3
  },
  {
    "text": "Чему равен sin 150°?",
    "options": [
      "1/2",
      "−1/2",
      "√3/2",
      "1"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен cos 180°?",
    "options": [
      "0",
      "−1",
      "1",
      "1/2"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен sin 210°?",
    "options": [
      "1/2",
      "−√3/2",
      "−1/2",
      "√3/2"
    ],
    "correct": 2
  },
  {
    "text": "Чему равен tg 225°?",
    "options": [
      "−1",
      "0",
      "√3",
      "1"
    ],
    "correct": 3
  },
  {
    "text": "Чему равен cos 300°?",
    "options": [
      "1/2",
      "−1/2",
      "√3/2",
      "−√3/2"
    ],
    "correct": 0
  },
  {
    "text": "Чему равен sin(90° − α)?",
    "options": [
      "sin α",
      "cos α",
      "−sin α",
      "−cos α"
    ],
    "correct": 1
  },
  {
    "text": "Чему равен 1 + tg² α?",
    "options": [
      "sin² α",
      "cos² α",
      "1/cos² α",
      "1/sin² α"
    ],
    "correct": 2
  },
  {
    "text": "Какой угол α от 0° до 90° имеет sin α = √2/2?",
    "options": [
      "30°",
      "60°",
      "90°",
      "45°"
    ],
    "correct": 3
  }
];
function persist(r){ const safe={...r,players:[],tokens:[],pending:{},usedGifts:{}}; fs.writeFileSync(path.join(dataDir,r.code+'.json'),JSON.stringify(safe,null,2)); }
function code(){let c;do{c=String(crypto.randomInt(100000,999999))}while(rooms.has(c));return c}
function token(){return crypto.randomBytes(24).toString('hex')}
function error(res,status,message){send(res,status,{error:message})}
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(data))}
function readBody(req){return new Promise((resolve,reject)=>{let chunks='';req.on('data',d=>{chunks+=d;if(chunks.length>800000)reject(new Error('Слишком большой запрос'))});req.on('end',()=>{try{resolve(JSON.parse(chunks||'{}'))}catch{reject(new Error('Неверный JSON'))}});req.on('error',reject)})}
function questionsSanitize(arr){if(!Array.isArray(arr)||arr.length<1||arr.length>150)throw Error('Добавьте от 1 до 150 вопросов');return arr.map(q=>{const text=String(q.text||'').trim().slice(0,350);const options=Array.isArray(q.options)?q.options.map(x=>String(x).trim().slice(0,150)):[];let correct=Number(q.correct);if(!text||options.length<2||options.length>6||options.some(x=>!x)||!Number.isInteger(correct)||correct<0||correct>=options.length)throw Error('Проверьте текст, ответы и правильный вариант');return {text,options,correct}})}
function advance(r){
 if(!r.started||r.ended)return;
 r.questionIndex++;
 r.pending={};
 r.usedGifts={};
 r.roundStartedAt=Date.now();
 if(!r.repeatQuestions && r.questionIndex>=r.questions.length){r.ended=true;r.started=false}
}
function getPlayer(r,t){return r.players.find(p=>p.token===t)}
function publicState(r,t){const p=getPlayer(r,t);const host=t===r.hostToken;const q=r.questions[r.questionIndex%r.questions.length];const pending=p && r.pending[p.id];return {code:r.code,title:r.title,started:r.started,ended:r.ended,host,playerId:p?.id||null,playerName:p?.name||null,questionIndex:r.questionIndex,questionDuration:r.questionDuration||20,roundStartedAt:r.roundStartedAt||Date.now(),repeatQuestions:!!r.repeatQuestions,questionCount:r.questions.length,question:r.started&&!r.ended&&(!p||!pending)?{text:q.text,options:q.options}:null,answerStatus:pending?{correct:true,giftChosen:false}:null,flowers:p?.flowers||0,totalFlowers:r.players.reduce((a,v)=>a+v.flowers,0),players:r.players.map(x=>({id:x.id,name:x.name,flowers:x.flowers,answered:x.answered})).sort((a,b)=>b.flowers-a.flowers),teacherImages:r.teacherImages,teacherIndex:Math.floor(r.players.reduce((a,v)=>a+v.flowers,0)/1000)%Math.max(1,r.teacherImages.length),questions:host?r.questions:undefined,hostToken:host?r.hostToken:undefined};}
for(const fn of fs.readdirSync(dataDir).filter(x=>/^\d{6}\.json$/.test(x))){try{let old=JSON.parse(fs.readFileSync(path.join(dataDir,fn),'utf8'));old.players=[];old.pending={};old.usedGifts={};old.started=false;old.ended=false;old.questionIndex=0;old.hostToken=token();rooms.set(old.code,old)}catch{}}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon'};
async function api(req,res,url){let b=await readBody(req);let action=url.pathname.split('/')[2];if(action==='create'){const qs=questionsSanitize(b.questions||DEFAULT_QUESTIONS);let r={code:code(),title:String(b.title||'Праздник цветов').trim().slice(0,80),questions:qs,teacherImages:[],hostToken:token(),players:[],pending:{},usedGifts:{},questionIndex:0,questionDuration:20,repeatQuestions:true,roundStartedAt:0,started:false,ended:false};rooms.set(r.code,r);persist(r);return send(res,200,{code:r.code,token:r.hostToken})}
let r=rooms.get(String(b.code||''));if(!r)return error(res,404,'Комната не найдена. Проверьте код.');let host=b.token===r.hostToken,p=getPlayer(r,b.token);
if(action==='join'){if(r.started)return error(res,409,'Игра уже началась. Попросите ведущего перезапустить её.');let name=String(b.name||'').trim().slice(0,24);if(!name)return error(res,400,'Введите имя');if(r.players.length>=100)return error(res,400,'Комната заполнена');let pl={id:crypto.randomUUID(),name,token:token(),flowers:0,answered:-1};r.players.push(pl);return send(res,200,{token:pl.token,...publicState(r,pl.token)})}
if(action==='state'){if(!host&&!p)return error(res,403,'Войдите в комнату');return send(res,200,publicState(r,b.token))}
if(action==='start'){if(!host)return error(res,403,'Только ведущий может начать');r.started=true;r.ended=false;r.questionIndex=0;r.roundStartedAt=Date.now();r.pending={};r.usedGifts={};r.players.forEach(p=>{p.flowers=0;p.answered=-1});return send(res,200,publicState(r,b.token))}
if(action==='next'){if(!host)return error(res,403,'Только ведущий');if(!r.started)return error(res,400,'Игра ещё не началась');advance(r);return send(res,200,publicState(r,b.token))}
if(action==='end'){if(!host)return error(res,403,'Только ведущий');r.ended=true;r.started=false;return send(res,200,publicState(r,b.token))}
if(action==='reset'){if(!host)return error(res,403,'Только ведущий');r.started=false;r.ended=false;r.questionIndex=0;r.pending={};r.usedGifts={};r.players.forEach(p=>{p.flowers=0;p.answered=-1});return send(res,200,publicState(r,b.token))}
if(action==='save'){if(!host||r.started)return error(res,403,'Настройки меняет ведущий до начала');r.questions=questionsSanitize(b.questions);r.questionDuration=Math.max(5,Math.min(180,Number(b.questionDuration)||20));r.repeatQuestions=b.repeatQuestions!==false;r.title=String(b.title||r.title).slice(0,80);if(Array.isArray(b.teacherImages)){if(b.teacherImages.length>20)return error(res,400,'Максимум 20 фотографий');if(b.teacherImages.some(x=>typeof x!=='string'||!/^data:image\/(png|jpeg|webp);base64,/.test(x)||x.length>500000))return error(res,400,'Фотографии должны быть JPEG, PNG или WebP до 350 КБ');r.teacherImages=b.teacherImages}persist(r);return send(res,200,publicState(r,b.token))}
if(action==='answer'){if(Date.now()>=r.roundStartedAt+(r.questionDuration||20)*1000)return error(res,409,'Время ответа вышло');if(!p||!r.started||r.ended)return error(res,403,'Ответ сейчас недоступен');if(p.answered===r.questionIndex)return error(res,409,'Вы уже ответили на этот вопрос');let idx=Number(b.answer),q=r.questions[r.questionIndex];if(!Number.isInteger(idx)||idx<0||idx>=q.options.length)return error(res,400,'Выберите ответ');if(idx!==q.correct){p.answered=r.questionIndex;return send(res,200,{correct:false,correctAnswer:q.options[q.correct]})}p.answered=r.questionIndex;r.pending[p.id]={index:r.questionIndex};return send(res,200,{correct:true})}
if(action==='gift'){if(!p||!r.started||!r.pending[p.id]||r.pending[p.id].index!==r.questionIndex)return error(res,403,'Сначала правильно ответьте на вопрос');let gift=Number(b.gift);if(!Number.isInteger(gift)||gift<0||gift>2)return error(res,400,'Выберите один из трёх подарков');delete r.pending[p.id];let items=[{type:'add',num:10,label:'+10 🌸'},{type:'add',num:20,label:'+20 🌸'},{type:'add',num:50,label:'+50 🌸'},{type:'double',label:'×2 цветов'},{type:'lose',num:10,label:'−10% цветов'},{type:'lose',num:25,label:'−25% цветов'}];let chosen=items[crypto.randomInt(items.length)],before=p.flowers;if(chosen.type==='add')p.flowers+=chosen.num;if(chosen.type==='double')p.flowers*=2;if(chosen.type==='lose')p.flowers=Math.max(0,p.flowers-Math.ceil(p.flowers*chosen.num/100));return send(res,200,{reward:chosen.label,before,after:p.flowers,change:p.flowers-before,totalFlowers:r.players.reduce((a,x)=>a+x.flowers,0)})}
return error(res,404,'Неизвестное действие')}
setInterval(()=>{for(const r of rooms.values()){if(r.started&&!r.ended&&Date.now()>=r.roundStartedAt+(r.questionDuration||20)*1000+4000)advance(r)}},500);
http.createServer(async(req,res)=>{try{let u=new URL(req.url,'http://localhost');if(u.pathname.startsWith('/api/')){if(req.method!=='POST')return error(res,405,'Требуется POST');return await api(req,res,u)}if(req.method!=='GET')return error(res,405,'Метод не поддерживается');let name=u.pathname==='/'?'index.html':u.pathname.slice(1);let file=path.resolve(__dirname,'public',name);if(!file.startsWith(path.join(__dirname,'public')+path.sep))return error(res,403,'Запрещено');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})}catch(e){error(res,400,e.message||'Ошибка')}}).listen(PORT,'0.0.0.0',()=>console.log(`Flower Quiz: http://localhost:${PORT}`));
