/*VARIABLES AND CONSTANTS*/


const DEBUG = false;
const Tabs = {
GAME: 0, 
PLAYERS: 1,
};

const Categories = {
MY_GAMES: 0, 
BOMBERS: 1,
DYNAMITE: 2,
OTHER: 3,
ARCHIVED: 4,
};

Object.freeze(Tabs);
Object.freeze(Categories);

const placeholder_games = ["Moon of Whales", "Nuclear Fiddlesticks", "Popcorn & Papercuts", "Mountain of Owo", "Silly Duh!"];
const placeholder_teams = ["Home", "Away", "Owls", "Sharks", "Bears", "Tigers", "Eagles"];
const placeholder_players = ["AttilaTheHun", "Jonc", "Luna", "Mysticul"];


let players = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
let null_players = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/*let allTheGamesArray = [{name: "Moon of Whales", polybot_id: 1234}, {name: "Mountain of Owo", polybot_id: 1235}];*/


/*ACTUAL CODE*/

window.onload = () => {

addPlayer();
addPlayer();
loadGames();

}

/*FUNCTIONS*/

/*Redirects to the Map screen and passes info about target game*/
function openGame(polybot_id){
window.name = polybot_id;
window.location.href = "/frontend/index.html";
if(DEBUG){
alert("polybot_id: " + polybot_id);
}
}


/*Prompt the user before deletion*/
function requestRemoval(element){
let result = confirm(`Are you sure you want to delete the game ${element.parentElement.getAttribute("game")}? All the data will be forever lost!`);
if(result){
removeGame(element);
}
}

/*Sends DELETE request to the database*/
function removeGame(element){
let serverResponse = deleteAPI(`games/${element.id}/`);
alert(`The game ${element.parentElement.getAttribute("game")} was deleted.`);
}

/*Initialize the game list*/
function loadGames(){
let allTheGamesArray = getAPI('/games/');
let game_list = document.getElementById("game-list");
for(let i = 0; i < allTheGamesArray.length; i++){
  
let game_item = document.createElement("li");
  game_item.appendChild(document.createTextNode  (allTheGamesArray[i].name));
  game_item.setAttribute("id", allTheGamesArray[i].polybot_id);

  game_item.setAttribute("game", allTheGamesArray[i].name); 
  game_item.setAttribute("class", "game-item"); 
  game_item.setAttribute("onclick", "openGame(this.id)");

  let remove_span = document.createElement("span");
  remove_span.innerHTML = '&times;';
  remove_span.setAttribute("class", "remove"); 
  remove_span.setAttribute("onclick", "event.stopPropagation();requestRemoval(this);")
  game_item.appendChild(remove_span);

game_list.appendChild(game_item);
}
}


/*Functions used to add a new game*/


/*Sends POST request to the database*/
function addGame(game){
if(DEBUG){
alert(`Name: ${game.name}\nMap size: ${game.map_size}\nPoly ID: ${game.polybot_id}\nPlayers: ${JSON.stringify(game.players)}\nType: ${game.game_type}\n`);
}
let serverResponse = postAPI('/games', game);
}



/*Verifies input in the form to prevent errors*/
function verifyInput(){
let game_name = document.getElementById("gname").value;
let map_size = document.getElementById("msize").value;
let polybot_id = document.getElementById("pebid").value;
let game_type = document.getElementById("gtype").value;

if(game_name == ""){
return alert("Please fill out Game name.");
}
if(map_size == ""){
return alert("Please fill out Map size.");
}
if(polybot_id == ""){
return alert("Please fill out PolyEloBot ID.");
}

let defined_players = [];

for(let i = 0; i < players.length;i++){
let player = players[i];
if(DEBUG){
console.log("player: " + player + " i: " + i);
}
if(player == null){
continue;
}
let player_name = document.getElementById(`name${i}`).value;
if(player_name.trim() == ""){
continue;
}else{
let player_color = document.getElementById(`color${i}`).value;
let player_tribe = document.getElementById(`tribe${i}`).value;
let player_team = document.getElementById(`team${i}`).value;
let defined_player = new Player(player_name, player_tribe, player_color, player_team);
defined_players.push(defined_player);	
}
}
let game = new Game(game_name, polybot_id, map_size, game_type, defined_players);
addGame(game);
openGame(game.polybot_id);
}




/*Shows the Add Game form*/
function showForm(){
let form = document.getElementById("add-game-form");
let game_name = document.getElementById("gname");
game_name.placeholder = `${randomArrayItem(placeholder_games)}`;
form.style.display = "block";
if(DEBUG){
console.log("form shown");
}
}

/*Hides the Add Game form*/
function hideForm(){
let form = document.getElementById("add-game-form");
form.style.display = "none";
if(DEBUG){
console.log("form hidden");
}
}

/*Switches between tabs inside the form*/
function switchTab(tab){
let game_tab = document.getElementById("game-tab");
let players_tab = document.getElementById("players-tab");
let game_information = document.getElementById("game-information");
let player_information = document.getElementById("player-information");
if(tab == Tabs.GAME){
players_tab.classList.remove('selected-tab');
game_tab.classList.add('selected-tab');		
player_information.style.display = "none";
game_information.style.display = "block";
if(DEBUG){
console.log("tab switched to GAME");
}
}else if(tab == Tabs.PLAYERS){
game_tab.classList.remove('selected-tab');
players_tab.classList.add('selected-tab');
game_information.style.display = "none";
player_information.style.display = "block";
if(DEBUG){
console.log("tab switched to PLAYERS");
}
}
}

/*Adds another player to the form*/
function addPlayer(){
if(null_players.length == 0){
if(DEBUG){
console.log("max players reached");
}
return;
}
let player_list = document.getElementById("player-list");
let player_number = null_players[0];
null_players.shift();
players[player_number] = player_number;
if(DEBUG){
console.log("player added: " + player_number);
}
let player = document.createElement("div");
player.setAttribute("id", `player${player_number}`);
player.setAttribute("class", "player");
player.setAttribute("player", `${player_number}`);
player.innerHTML = `
<div class="column">
<div>
<label for="name${player_number}">Name</label>
</div>
<div>
<input type="text" id="name${player_number}" name="name${player_number}" placeholder="${randomArrayItem(placeholder_players)}">
</div>
</div>`;
player.innerHTML += `<div class="column">
<div>
<label for="tribe${player_number}">Tribe</label>
</div>
<div>
<select  id="tribe${player_number}" name="tribe${player_number}">
<option value="unknown">Unknown</option>
<optgroup label="Regular Tribes">
      <option value="xinxi">Xin-Xi</option>
      <option value="imperius">Imperius</option>
 <option value="bardur" selected>Bardur</option>
      <option value="kickoo">Kickoo</option>
<option value="oumaji">Oumaji</option>
<option value="hoodrick">Hoodrick</option>
<option value="luxidoor">Luxidoor</option>
<option value="vengir">Vengir</option>
<option value="zebasi">Zebasi</option>
<option value="aimo">Ai-Mo</option>
<option value="quetzali">Quetzali</option>
<option value="yadakk">Yădakk</option>
</optgroup>
<optgroup label="Special Tribes">
<option value="aquarion">Aquarion</option>
<option value="elyrion">∑∫ỹriȱŋ</option>
<option value="polaris">Polaris</option>
</optgroup>
</select>
</div>
</div>`;
player.innerHTML += `<div class="column">
<div>
<label for="color${player_number}">Color</label>
</div>
<div>
<select  id="color${player_number}" name="color${player_number}">
      <option valeu="unknown">Unknown</option>
      <option value="xinxi">Xinxi (Red)</option>
      <option value="imperius">Imperius (Blue)</option>
<option value="bardur">Bardur (Black)</option>
      <option value="oumaji">Oumaji (Yellow)</option>
      <option value="kickoo">Kickoo (Lime)</option>
<option value="hoodrick">Hoodrick (SaddleBrown)</option>
      <option value="luxidoor">Luxidoor (DarkViolet)</option>
<option value="vengir">Vengir (White)</option>
      <option value="zebasi">Zebasi (Orange)</option>
<option value="aimo">Aimo (Aquamarine)</option>
      <option value="quetzali">Quetzali (SeaGreen)</option>
<option value="yadakk">Yadakk (DarkRed)</option>
      <option value="aquarion">Aquarion (LightCoral)</option>
<option value="elyrion">Elyrion (DeepPink)</option>
<option value="polaris">Polaris (AntiqueWhite)</option>
</select>
</div>
</div>`;
player.innerHTML += `<div class="column">
<div>
<label for="team${player_number}">Team</label>
</div>
<div>
<input type="text" id="team${player_number}" name="team${player_number}" placeholder="${randomArrayItem(placeholder_teams)}">
</div>
</div>`;
player.innerHTML += `<div class="column">
<div>
<label for="remove${player_number}">Remove</label>
</div>
<div>
<button type="button" id="remove${player_number}" remove="${player_number}" class="remove-player" onclick="removePlayer(this)">&times;</button>
</div>
</div>`;

player_list.appendChild(player);
}

/*Removes player from the form*/
function removePlayer(element){
let id = element.getAttribute("remove");
players[id] = null;
null_players.push(id);
let player = document.getElementById(`player${id}`);
player.remove(); 
if(DEBUG){
console.log("player removed: " + id);
}
}


/*Other fuctions*/

function randomArrayItem(array){
let item = array[Math.floor(Math.random() * array.length)];
return item;
}


/*CLASSES*/

/*For creating Game object*/
class Game{
constructor(name, polybot_id, map_size, game_type, players){
this.name = name;
this.polybot_id = polybot_id;
this.map_size = map_size;
this.map = [];
this.game_type = game_type;
this.players = players;
}
}

/*For creating Player objects*/
class Player{
constructor(name, tribe, color, team){
this.name = name;
this.tribe = tribe;
this.color = color;
this.team = (team == "") ? "none" : team;
this.hasArchery = false;
this.hasAquatism = false;
this.hasMeditation = false;
}
}