"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_height = tile_height * 20.75;
const div_width = tile_width * 20;

const MENU_BG_COLOR = "#111";
const MENU_SELECT_COLOR = "black";

let isMenuOpen = true;
let isSubMenuOpen = true;
let selectedMenu = "None";
let selectedTribe = "Bardur";
let menus = ["terrain", "unit", "misc"];
let tribes = ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Ai-Mo", "Oumaji", "Quetzali", "Vengir", "Xin-xi", "Aquarion"]
let terrains = ["cloud", "city", "ground", "mountain", "forest", "game", "fruit", "farm"];

onload = function() {
    document.getElementById("map_div").style.height = div_height + "px";
    document.getElementById("map_div").style.width = div_width + "px";

    let map = new Array(400);

    for (let x = 20; x >= 1; x--) {
        for (let y = 1; y <= 20; y++) {
            map[getIndex (x , y)] = new Tile(getIndex (x , y));
        }
    }

    tribes.forEach(createTribeButton);

    if(isMenuOpen) {
        isMenuOpen = false;
        menuButtonClick();
    }
    if(isSubMenuOpen) {
        isSubMenuOpen = false;
        terrainClick();
        if(selectedTribe != "None"){
            document.getElementById("btn" + selectedTribe).click();
        }
    }
};

function createTribeButton(tribe){
    let img = document.createElement("img");
    img.setAttribute("id", "btn" + tribe);
    img.setAttribute("src", "Images/Tribes/" + tribe + "/" + tribe + " head.png");
    img.setAttribute("height", "80%");
    img.addEventListener('click', function(){
        document.getElementById("btn" + selectedTribe).style.backgroundColor = MENU_BG_COLOR;
        document.getElementById("btn" + tribe).style.backgroundColor = MENU_SELECT_COLOR;
        selectedTribe = tribe;
        attSubMenu(tribe);
    });
    document.getElementById("menu_tribes").appendChild(img);
}

class Tile {
    constructor(index) {
        this.index = index;
        this.x = getX(index);
        this.y = getY(index);
        this.tribe = "Bardur";
        this.unit = new Unit();

        this.terrain_img = document.createElement("img");
        this.terrain_img.setAttribute("id", index);
        this.terrain_img.setAttribute("src", "Images/Miscellaneous/Clouds.png");
        this.terrain_img.setAttribute("width", sprite_width);
        this.terrain_img.setAttribute("style", "position: absolute;  top: " + getTop(this.x , this.y) + "px;  left: " + getLeft(this.x , this.y) + "px;");
        document.getElementById("map_div").appendChild(this.terrain_img);
    }
};

class Unit {
    constructor() {
        this.tribe = "Bardur";
        this.type = "Warrior";
        this.hp = 10;
        this.level = 1;
    }
};

document.getElementById("map_div").onclick = function clickEvent(e) {
    let rect = e.currentTarget.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = -(e.clientY - rect.top - tile_height * 10);

    let Xtile = Math.ceil(rotateX(x, y) / (sprite_width / 2));
    let Ytile = Math.ceil(rotateY(x, y) / (sprite_width / 2));

    if(Xtile >= 1 && Xtile <= 20 && Ytile >= 1 && Ytile <= 20){
        document.getElementById(getIndex(Xtile, Ytile)).src = "Images/Miscellaneous/Shallow water.png";
    }
    console.log("X: " + x + " Y: " + y);
    console.log("Xr: " + rotateX(x, y) + " Yr: " + rotateY(x, y));
    console.log("Xtile: " + Xtile + " Ytile: " + Ytile);
  }
function rotateX (x, y) {
    let r = Math.sqrt(x**2 + y**2);
    let a = Math.atan2(y, x);
    let a2 = a - Math.atan2(tile_width, tile_height);
    
    return r * Math.cos(a2);
}
function rotateY (x, y) {
    let r = Math.sqrt(x**2 + y**2);
    let a = Math.atan2(y, x);
    let a2 = a + Math.atan2(tile_width, tile_height);
    
    return r * Math.cos(a2);
}
function getX (index) {
    return Math.floor(index / 20) + 1;
}
function getY (index) {
    return index % 20 + 1;
}
function getIndex (x , y) {
    return (x-1) * 20 + (y-1);
}
function getTop (x , y) {
    return (tile_height / 2) * (19 - (x-1) + (y-1));
}
function getLeft (x , y) {
    return (tile_width / 2) * (0 + (x-1) + (y-1));
}

function menuButtonClick() {
    if(isMenuOpen){
        document.getElementById("menu").style.height = "0%";
        document.getElementById("menu_tribes").style.height = "0%";
        document.getElementById("menu_content").style.height = "0%";
        isMenuOpen = false;
    }
    else {
        document.getElementById("menu").style.height = "10%";
        isMenuOpen = true;
    }
}

function toggleSubMenu(state) {
    if(state){
        document.getElementById("menu_tribes").style.height = "10%";
        document.getElementById("menu_content").style.height = "10%";
        isSubMenuOpen = true;
    }
    else {
        document.getElementById("menu_tribes").style.height = "0%";
        document.getElementById("menu_content").style.height = "0%";
        isSubMenuOpen = false;
    }
}

function selectMenu(index) {

    if(selectedMenu == index){
        selectedMenu = "None";
        toggleSubMenu(false);
        document.getElementById(index + "Menu").style.backgroundColor = MENU_BG_COLOR;
    }
    else {
        if(selectedMenu != "None"){
            document.getElementById(selectedMenu + "Menu").style.backgroundColor = MENU_BG_COLOR;
        }
        selectedMenu = index;
        toggleSubMenu(true);
        document.getElementById(index + "Menu").style.backgroundColor = MENU_SELECT_COLOR;
    }
}

function terrainClick() {

    selectMenu("terrain");
}

function unitClick() {
    selectMenu("unit");
}

function miscClick() {
    selectMenu("misc");
}

function attSubMenu(tribe) {
    document.getElementById("groundMenu").src = "Images/Tribes/" + tribe + "/" + tribe + " ground.png";
    document.getElementById("mountainMenu").src = "Images/Tribes/" + tribe + "/" + tribe + " mountain.png";
}