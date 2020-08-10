// 
let clicks = 0;
let image_url="";

function moveToWrite() {
    let title = document.getElementById("write_input").value;
    window.localStorage.setItem('temp', title); //제목 데이터 저장
    location.href='write_article.html';
}
  
function loadTitle() { //메인에서 적은 임시 제목 가져오기
  document.getElementById('title_write').value = window.localStorage.getItem('temp');
}

function writeButton() {
  let para = CKEDITOR.instances.editor1.getData();
  let title = document.getElementById('title_write').value;
  console.log("title:"+title);
  console.log("article:"+para);
  addList(title, para);
  let arr = JSON.parse(window.localStorage.getItem('list'));
  location.href='index.html';
}

function editButton() { //edit에서 수정 확정
  let para = CKEDITOR.instances.editor2.getData();
  let title = document.getElementById('title_write').value;
  editList(title, para);
  let arr = JSON.parse(window.localStorage.getItem('list'));
  location.href='show_article.html';
}

function addList(title, para) {
  if(window.localStorage.getItem('list') == null) { //리스트가 비어있다면 초기화
    window.localStorage.setItem('list', JSON.stringify([]));
  }
  let arr = JSON.parse(window.localStorage.getItem('list'));
  let obj = {};
  obj.title = title;
  obj.para = para;
  obj.date = new Date();
  obj.like = 0;
  
  arr.push(obj);
  window.localStorage.setItem('list', JSON.stringify(arr));
}

function editList(title, para) {
  let arr = JSON.parse(window.localStorage.getItem('list'));
  let obj = Object(arr);
  let i = findList();
  let temp_obj = {};
  temp_obj.title = title;
  temp_obj.para = para;
  temp_obj.date = new Date();
  temp_obj.like = obj[i].like;
  obj.splice(i, 1, temp_obj);
  window.localStorage.setItem('list', JSON.stringify(arr));
}

function findImageTag(text) { //원글에서 이미지 태그 찾아서 이미지 src만 반환, 없으면 false
  let idx = text.indexOf('<img');
  if(idx != -1) {
    // console.log(text.substring(text.indexOf('<img')));
    let str1 = text.substring(idx);
    let str2 = str1.substring(str1.indexOf('src='));
    str1 = str2.substring(str2.indexOf('"')+1, str2.indexOf('"', 10));
    return str1;
  } else {
    return false;
  }
}

function loadList() { //메인에서 글 불러오는 함수
  let arr = JSON.parse(window.localStorage.getItem('list'));
  // console.log(arr);
  let c=0;
  let container = document.createElement('div');
  container.setAttribute('class', 'container');
  for(let i=arr.length-1; i>=0; i--) {
    if(c%3==0) {
      container = document.createElement('div');
      container.setAttribute('class', 'container');
    }
    // let like = arr[i].like; 메인에서 보일 필요가 없다.
    let article = document.getElementById("art");
    let img = document.createElement("img");
    if(!findImageTag(arr[i].para)) {
      img.setAttribute("src", "https://loremflickr.com/g/320/240/paris?lock="+Math.floor(Math.random()*200));
    } else {
      img.setAttribute("src", findImageTag(arr[i].para));
    }
    //랜덤이미지, 로딩이 느리므로 로컬로 저장해서 쓰는게 나을듯.
    let tt = document.createElement("h3");
    tt.innerHTML = arr[i].title;
    tt.setAttribute("id", "index_article_title");
    let p = document.createElement("p");
    p.setAttribute("id", "index_article_p");
    let para = arr[i].para.replace(/(<([^>]+)>)/ig,""); //정규식을 통해 태그 빼고 텍스트만 가져오기
    if(para.length > 40) {
      para = para.substring(0, 40)+"...";
    }
    p.innerHTML = para;
    // p.innerHTML = arr[i].para;
    let newDiv = document.createElement("div");
    newDiv.appendChild(img);
    newDiv.appendChild(tt);
    newDiv.appendChild(p);
    newDiv.setAttribute("class", "articles")
    newDiv.setAttribute("onclick", "moveShow()");
    newDiv.setAttribute("style", "cursor: pointer");
    container.appendChild(newDiv);
    article.appendChild(container);
    c++;
  }
}

function findList() { 
  let arr = JSON.parse(window.localStorage.getItem('list'));
  for(let i=0; i<arr.length; i++) {
    if(arr[i].title == window.localStorage.getItem('temp')) {
      console.log("find!"+arr[i].title);
      return i;
    }
  }
}

function moveShow() {
  document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    while(target.nodeName != 'DIV') {
      target = target.parentNode;
    }
    target = target.childNodes[1];
    // console.log("target:"+target.innerHTML);
    window.localStorage.setItem('temp', target.innerHTML);
  }, false);
  location.href='show_article.html';
}

// 수정버튼 클릭 시 기능 구현
function editClicked() { //show to edit
  // let arr = JSON.parse(window.localStorage.getItem('list'));
  // let obj = Object(arr);
  // let i = findList();
  location.href='edit_article.html';
}

// edit시 제목과 내용을 불러오는 기능
function loadEdit() {
  // document.getElementById('title_write').value = window.localStorage.getItem('temp');
  // let arr = JSON.parse(window.localStorage.getItem('list'));
  // // let nodes = document.getElementsByClassName('cke_editable cke_editable_themed cke_contents_ltr cke_show_borders');
  // let nodes = document.getElementsByTagName('iframe');
  // console.log(nodes);
  // let innderBody = nodes.item(1);
  // let i = findList();
  // innderBody.innerHTML = arr[i].para;
  // let obj = Object(arr);
}

// 삭제버튼 클릭 시 기능 구현
function delClicked() {
  let sure = confirm("정말 삭제하시겠습니까?");
  if(sure) {
    let arr = JSON.parse(window.localStorage.getItem('list'));
    let obj = Object(arr);
    let i = findList();
    obj.splice(i, 1);
    console.log(obj);
    window.localStorage.setItem('list', JSON.stringify(arr));
    alert('삭제가 완료되었습니다.');
    location.href='index.html';
  }
  else {
  }
}


function likeClicked() {
  let arr = JSON.parse(window.localStorage.getItem('list'));
  let obj = Object(arr);
  let i = findList();
  obj[i].like++;
  // clicks += 1;
  window.localStorage.setItem('list', JSON.stringify(arr));
  document.getElementById("like_count").innerHTML = obj[i].like;
}

function showArticle() {
  let arr = JSON.parse(window.localStorage.getItem('list'));
  let i = findList();
  let article = document.getElementById('article');
  let img = document.createElement("img");
  if(!findImageTag(arr[i].para)) { //기본 이미지가 없으면 기본이미지 삽입
    img.setAttribute("src", "https://loremflickr.com/g/320/240/paris?lock="+Math.floor(Math.random()*200));
  }  else {
    img.setAttribute("src", findImageTag(arr[i].para));
  }
  //랜덤이미지, 로딩이 느리므로 로컬로 저장해서 쓰는게 나을듯.
  img.setAttribute("id", "photo");
  let tt = document.createElement("h2");
  tt.setAttribute("id", "title");
  tt.innerHTML = arr[i].title;
  let p = document.createElement("p");
  p.innerHTML = arr[i].para;
  let likeBtn = document.createElement("button");
  likeBtn.setAttribute("id", "like_button");
  likeBtn.setAttribute("onclick", "likeClicked()");
  likeBtn.innerHTML = "♥︎ Like";
  likeBtn.setAttribute("style", "cursor: pointer");
  let likeCount = document.createElement("span");
  likeCount.setAttribute("id", "like_count");
  likeCount.innerHTML = arr[i].like;
  let editDel = document.createElement("div");
  editDel.setAttribute("id", "editDel");
  let editBtn = document.createElement("button");
  editBtn.innerHTML = "edit";
  editBtn.setAttribute("id", "edit_button");
  editBtn.setAttribute("onclick", "editClicked()");
  editBtn.setAttribute("style", "cursor: pointer");
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "delete";
  delBtn.setAttribute("id", "del_button");
  delBtn.setAttribute("onclick", "delClicked()");
  delBtn.setAttribute("style", "cursor: pointer");
  editDel.appendChild(editBtn);
  editDel.appendChild(delBtn);
  let newDiv = document.createElement("div");
  // newDiv.setAttribute("id", "article")
  newDiv.appendChild(img);
  newDiv.appendChild(tt);
  newDiv.appendChild(p);
  newDiv.appendChild(likeBtn);
  newDiv.appendChild(likeCount);
  newDiv.appendChild(editDel);
  // newDiv.setAttribute("onclick", "moveShow()");
  // newDiv.setAttribute("style", "cursor: pointer");
  article.appendChild(newDiv);
  // arr[i]
}

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById('headerH1').style.display = 'inline';
    document.getElementById('headerH2').style.display = 'inline';
    document.getElementById('header').style.height = '50px';
    document.getElementById('header').style.border = "1px solid black";
  } else {
    document.getElementById('headerH1').style.display = 'block';
    document.getElementById('headerH2').style.display = 'block';
    document.getElementById('header').style.height = '150px';
    document.getElementById('header').style.border = "0px solid black";
  }
}

//User location
$.getJSON('http://ip-api.com/json', function(data){
var lat = data.lat;
var lon = data.lon;
var units = "metric";

$("#city").html(data.city + ", " + data.country)
console.log(data);
//Open weather API request
$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=' + units + '&APPID=e95d958a11128b11ad3eb0fa101dae38', function(json){
console.log(json);
$("#temperature-celcius").html(json.main.temp + ' C&deg');
$("#temperature-farenheit").html((json.main.temp * 1,8 + 32) + ' F&deg');
$("#humidity").html(json.main.humidity + ' %');
$("#overall").html(json.weather[0].main);
});
});
