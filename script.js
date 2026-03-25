let user="", score=0, current=0, time=10, timer;
let leaderboard=JSON.parse(localStorage.getItem("leaderboard")) || [];
let questions=[];

// Text-based quiz questions
const allQuestions = {
  math: [
    {q:"What is 12 × 8?", a:["96","88","100","108"], c:0},
    {q:"Solve for x: 2x + 7 = 15", a:["4","3","5","6"], c:0},
    {q:"The square root of 144 is?", a:["12","14","16","10"], c:0},
    {q:"What is 15% of 200?", a:["25","30","20","35"], c:1},
    {q:"If a triangle has angles 50° and 60°, what is the third angle?", a:["70°","80°","90°","60°"], c:1},
    {q:"What is 7² + 3²?", a:["58","49","59","62"], c:2},
    {q:"A rectangle has length 8 and width 6. Area?", a:["48","14","36","28"], c:0},
    {q:"If 5x = 45, x = ?", a:["5","9","8","7"], c:1},
    {q:"10 + 2 × 6 =", a:["32","72","22","28"], c:3},
    {q:"50 ÷ 2 + 3 =", a:["28","25","26","30"], c:0}
  ],
  general: [
    {q:"Which planet is known as the Red Planet?", a:["Mars","Venus","Jupiter","Saturn"], c:0},
    {q:"Which animal is called the King of the Jungle?", a:["Tiger","Lion","Elephant","Leopard"], c:1},
    {q:"Which country has the Eiffel Tower?", a:["Italy","Germany","France","Spain"], c:2},
    {q:"Largest ocean on Earth?", a:["Atlantic","Indian","Arctic","Pacific"], c:3},
    {q:"Chemical symbol for water?", a:["O2","H2O","CO2","NaCl"], c:1},
    {q:"What is the tallest mountain on Earth?", a:["K2","Everest","Kangchenjunga","Lhotse"], c:1},
    {q:"Which bird is a symbol of peace?", a:["Eagle","Dove","Owl","Sparrow"], c:1},
    {q:"Which element has atomic number 1?", a:["Hydrogen","Helium","Oxygen","Carbon"], c:0},
    {q:"Which planet is closest to the Sun?", a:["Mercury","Venus","Earth","Mars"], c:0},
    {q:"Which is the fastest land animal?", a:["Cheetah","Lion","Horse","Tiger"], c:0}
  ]
};

// Button event listeners
document.getElementById("startBtn").addEventListener("click",()=>{
  user = document.getElementById("name").value.trim();
  if(!user) return alert("Enter your name");
  document.getElementById("login").style.display="none";
  document.getElementById("category").style.display="block";
});

document.getElementById("mathBtn").addEventListener("click", ()=>chooseCategory("math"));
document.getElementById("generalBtn").addEventListener("click", ()=>chooseCategory("general"));
document.getElementById("restartBtn").addEventListener("click", restart);

// Functions
function chooseCategory(cat){
  questions = allQuestions[cat];
  document.getElementById("category").style.display="none";
  document.getElementById("quiz").style.display="block";
  current=0; score=0;
  loadQuestion();
}

function loadQuestion(){
  clearInterval(timer); time=10;
  const q = questions[current];
  document.getElementById("question").innerText = q.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.a.forEach((ans,i)=>{
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = ()=>selectAnswer(i);
    answersDiv.appendChild(btn);
  });

  document.getElementById("time").innerText=time;
  document.getElementById("progress").style.width="100%";

  timer=setInterval(()=>{
    time--;
    document.getElementById("time").innerText=time;
    document.getElementById("progress").style.width=(time/10*100)+"%";
    if(time<=0){ clearInterval(timer); showCorrect(); setTimeout(next,1500); }
  },1000);
}

function selectAnswer(i){
  clearInterval(timer);
  const correct = questions[current].c;
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach((b,index)=>{
    if(index===correct) b.classList.add("correct");
    else if(index===i) b.classList.add("wrong");
    b.disabled=true;
  });
  if(i===correct) document.getElementById("correctSound").play(), score++;
  else document.getElementById("wrongSound").play();
  setTimeout(next,1500);
}

function showCorrect(){
  const correct = questions[current].c;
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach((b,i)=>{ if(i===correct) b.classList.add("correct"); else b.classList.add("wrong"); });
}

function next(){ current++; if(current<questions.length) loadQuestion(); else finish(); }

function finish(){
  document.getElementById("quiz").style.display="none";
  document.getElementById("result").style.display="block";
  document.getElementById("scoreText").innerText = user+" Score: "+score+"/"+questions.length;

  leaderboard.push({name:user, score});
  leaderboard.sort((a,b)=>b.score-b.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  let boardHTML="";
  leaderboard.forEach(p=>{ boardHTML += `<div class="leaderboard-item"><span>${p.name}</span><span>${p.score}</span></div>`; });
  document.getElementById("leaderboard").innerHTML = boardHTML;

  const sticker = document.getElementById("sticker");
  if(score===questions.length) sticker.innerText="🏆 GOLD STICKER (Perfect!)";
  else if(score>=questions.length/2) sticker.innerText="🥈 SILVER STICKER";
  else sticker.innerText="🥉 BRONZE STICKER";
}

function restart(){
  score=0; current=0;
  document.getElementById("result").style.display="none";
  document.getElementById("login").style.display="block";
}