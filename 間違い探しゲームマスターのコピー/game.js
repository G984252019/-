let timer = null;
const MAX = 3;
let count = 0;
let eTime;

const APPLICATION_KEY = "0ecabbbf57e15560e1cf53111791ad1cbec5a1e856c63c0787a1db92e4bad852";
const CLIENT_KEY = "9acaae1fd72a6f449f2102acbbe6af32b7bc1b483c2ed7cbe088d6e32d435e6e";
const ncmb = new NCMB(APPLICATION_KEY,CLIENT_KEY);
const DBName = "GameClass";

let TestClass = ncmb.DataStore(DBName);


function init() {
  if (timer == null) {
    start = new Date();
    time();
    gameStart();
  }
}

function gameStart() {
  let size = 5;
  let qNum = Math.floor(Math.random()*q.length);

  for(let i=0; i<size*size; i++){
    let s = document.createElement("span");
    s.textContent = q[qNum][0];
    s.setAttribute("id", "num"+i);
    s.addEventListener('click', function(){
      if(this.textContent == q[qNum][1]){
        // alert("正解");
        correct.play();
        count++;
        while(cells.firstChild){
          cells.removeChild(cells.firstChild);
        }
        if(count==MAX){
          alert("ゲームクリア!!");
          clearTimeout(timer);
          save();
          load();
        }else{
          gameStart();
        }
      }else{
        wrong.play();
      }
    });

    cells.appendChild(s);
    if(i % size == size -1){
      const br = document.createElement("br");
      cells.appendChild(br);
    }
  }
  let p = Math.floor(Math.random()*size*size);
  let ans = document.getElementById("num" + p);
  ans.textContent = q[qNum][1];
}



function time() {
  let now = new Date();
  eTime = parseInt((now.getTime() - start.getTime())/1000);
  score.textContent = eTime + "秒";
  timer = setTimeout("time()", 1000);

}

// データの保存
function save(){
  let test = new TestClass();
  let key = "message";
  const text = document.getElementById('message');
  let value = timer-1;
  test.set(key, parseInt(value));
  test.save()
  .then(function(){
    console.log("成功");
  })
  .catch(function(err){
    console.log("エラー発生:"+ err);
  });
}

// データの読み込み
function load(){
  TestClass
  .order("message")
  .fetchAll()
  .then(function(results){
      if(eTime<results[0].message){
        alert("ハイスコア更新！！" );
      }else{
        alert("ハイスコア目指して、再チャレンジしよう！！");
      }
  })
  .catch(function(err){
    console.log("エラー発生:"+ err);
  });
}
