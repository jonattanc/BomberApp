function openGame(element){
window.location.href = "https://jonattanc.github.io/BomberApp/";
}

function addGame(){
let game_name = document.getElementById("gname").value;
let map_size = document.getElementById("msize").value;
alert(game_name + " Karel " + map_size);
}

function removeGame(element){
let serverResponse = deleteAPI(`games/${element.id}/`);
alert(`The game ${element.parentElement.getAttribute("game")} was deleted.`);
}

function requestRemoval(element){
let result = confirm(`Are you sure you want to delete the game ${element.parentElement.getAttribute("game")}? All the data will be forever lost!`);
if(result){
removeGame(element);
}
}

function loadGames(){
let allTheGamesArray = getAPI('/games/');
let game_list = document.getElementById("game-list");
for(let i = 0; i < allTheGamesArray.length; i++){
  

let game_item = document.createElement("li");
  game_item.appendChild(document.createTextNode  (allTheGamesArray[i].name));
  game_item.setAttribute("id", allTheGamesArray[i].id);


  game_item.setAttribute("game",   allTheGamesArray[i].name); 
  game_item.setAttribute("class", "game-item"); 
  game_item.setAttribute("onclick", "openGame()")

  let remove_span = document.createElement("span");
  remove_span.innerHTML = '&times;';
  remove_span.setAttribute("class", "remove"); 
  remove_span.setAttribute("onclick", "event.stopPropagation();requestRemoval(this);")
  game_item.appendChild(remove_span);

game_list.appendChild(game_item);
}
}

function showForm(){
let form = document.getElementById("add-game-form");
form.style.display = "block";
}

function hideForm(){
let form = document.getElementById("add-game-form");
form.style.display = "none";
}

window.onload = loadGames();