"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_height = tile_height * 20.75;
const div_width = tile_width * 20;

const MENU_BG_COLOR = "#0e092c";
const MENU_SELECT_COLOR = "black";

let isMenuOpen = false;
let isSubMenuOpen = false;
let selected = {menu: "None"};
let misc = "Miscellaneous";
let mainMenuBtns = ["terrains", "onterrains", "units", "miscs"];

let Buttons = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Clouds", "DeepWater", "ShallowWater", "Ground", "Forest", "Mountain"],
    Clouds: ["Clouds", "Rainbow"],
    DeepWater: ["DeepWater", "Ruin", "Whale"],
    ShallowWater: ["ShallowWater", "Fish", "Port"],
    Ground: ["Ground", "Ruin", "Village", "Fruit", "Crop", "Farm", "Outpost"],
    Forest: ["Forest", "Ruin", "Animal", "Lumber hut"],
    Mountain: ["Mountain", "Ruin", "Metal", "Mine"],
    WaterUnits: ["boat", "ship", "battleship", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"],
    LandUnits: ["warrior", "archer", "rider", "knight", "defender", "catapult", "swordsman", "mindbender", "giant", "polytaur", "dragonegg", 
                "mooni", "icearcher", "battlesled", "icefortress", "gaami", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"]
}
let Folders = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "selected.tribes", "selected.tribes", "selected.tribes"],
    Clouds: ["Miscellaneous", "Miscellaneous"], 
    DeepWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous"], 
    ShallowWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous"], 
    Ground: ["selected.tribes", "Miscellaneous", "Miscellaneous", "selected.tribes", "Miscellaneous", "Miscellaneous", "Miscellaneous"], 
    Forest: ["selected.tribes", "Miscellaneous", "selected.tribes", "Miscellaneous"], 
    Mountain: ["selected.tribes", "Miscellaneous", "Miscellaneous", "Miscellaneous"],
    WaterUnits: ["selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes"],
    LandUnits: ["selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes"]
}
let OffsetX = {
    tribes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    terrains: [0, 0, 0, 0, 0, 0],
    Clouds: [0, 0], 
    DeepWater: [0, 0, 0], 
    ShallowWater: [0, 0, 0], 
    Ground: [0, 0, 0, 0, 0, 0, 0], 
    Forest: [0, 0, 0, 0], 
    Mountain: [0, 0, 0, 0],
    WaterUnits: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    LandUnits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
let OffsetY = {
    tribes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    terrains: [0, 0, 0, 0, 0, 0],
    Clouds: [0, 0], 
    DeepWater: [0, 0, 0], 
    ShallowWater: [0, 0, 0], 
    Ground: [0, 0, 0, 0, 0, 0, 0], 
    Forest: [0, 0, 0, 0], 
    Mountain: [0, 0, 0, 0],
    WaterUnits: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    LandUnits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
let Scales = {
    tribes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    terrains: [1, 1, 1, 1, 1, 1],
    Clouds: [1, 1], 
    DeepWater: [1, 1, 1], 
    ShallowWater: [1, 1, 1], 
    Ground: [1, 1, 1, 1, 1, 1, 1], 
    Forest: [1, 1, 1, 1], 
    Mountain: [1, 1, 1, 1],
    WaterUnits: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    LandUnits: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}

let mousePos = { };
let marginPos = { };
let mouseScrollListeners = [];
let sprites = [];

onload = function() {
    document.getElementById("mapDiv").style.height = `${div_height}px`;
    document.getElementById("mapDiv").style.width = `${div_width}px`;

    // Create map as array of tiles
    let map = new Array(400);
    for (let x = 20; x >= 1; x--) {
        for (let y = 1; y <= 20; y++) {
            map[getIndex (x , y)] = new Tile(getIndex (x , y));
        }
    }

    // Create all buttons, except for main menu
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        selected[Object.keys(Buttons)[i]] = Buttons[Object.keys(Buttons)[i]][0];

        for (let j = 0; j < Buttons[Object.keys(Buttons)[i]].length; j++) {
            createButton(Object.keys(Buttons)[i], Buttons[Object.keys(Buttons)[i]][j], j);
        }
    }

    // Set tribe buttons click events
    Buttons.tribes.forEach(function (item, index){
        document.getElementById(`btntribes${item}`).addEventListener('click', function(){
            attTribes(selected.tribes);
        });
    });

    // Set main menu click events
    document.getElementById(`btnterrains`).addEventListener('click', function(){ selectMainMenu("terrains"); });
    document.getElementById(`btnonterrains`).addEventListener('click', function(){ selectMainMenu("onterrains"); });
    document.getElementById(`btnUnits`).addEventListener('click', function(){ selectMainMenu("Units"); });
    document.getElementById(`btnmiscs`).addEventListener('click', function(){ selectMainMenu("miscs"); });

    onmouseup = function clickEvent(e) {
        mouseScrollListeners.forEach(function (item, index){
                document.getElementById(item.targetMenu).removeEventListener('mousemove', item.handler);
        });
    }

    // Add horizontal scroll to divs
    addMenuScrollHandlers("mainMenuDiv");
    addMenuScrollHandlers("WaterUnitsDiv");
    addMenuScrollHandlers("LandUnitsDiv");
    addMenuScrollHandlers("miscsDiv");
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        addMenuScrollHandlers(Object.keys(Buttons)[i] + "Div");
    }

    // Click on menus to open them
    menuButtonClick();
    document.getElementById(`btnterrains`).click();
    document.getElementById(`btnterrains${selected.terrains}`).click();
    document.getElementById(`btntribes${selected.tribes}`).click();
};

function addMenuScrollHandlers(menu) {
    document.getElementById(menu).onmousedown = function clickEvent(e) {
        mousePos[menu] = e.clientX;
        marginPos[menu] = document.getElementById(menu).children[0].style.marginLeft.replace("px",'')|0;
        document.getElementById(menu).addEventListener('mousemove', mouseMoveHandler);
        mouseScrollListeners.push({targetMenu: menu, handler: mouseMoveHandler});
    }

    let mouseMoveHandler = function(e) {
        let mousePosDX = e.clientX - mousePos[menu];

        let elements = document.getElementById(menu).children;
        let elementsSize = 0;
        for (let i = 0; i < elements.length; i++){
            elementsSize += elements[i].offsetWidth + 1;
        }

        let selectedPos = marginPos[menu] + mousePosDX;
        let limInf = document.getElementById(menu).offsetWidth - elementsSize;

        if(limInf < 0){
            if(selectedPos >= 0){
                document.getElementById(menu).children[0].style.marginLeft = `0px`;
            }
            else if (selectedPos <= limInf){
                document.getElementById(menu).children[0].style.marginLeft = `${limInf}px`;
            }
            else{
                document.getElementById(menu).children[0].style.marginLeft = `${selectedPos}px`;
            }
        }  
    };
}

function createButton(menu, item, index){
    let img = document.createElement("img");
    img.setAttribute("id", `btn${menu}${item}`);

    if(Folders[menu][index] == "selected.tribes"){
        img.setAttribute("src", `Images/${selected.tribes}/${item}.png`);
    }
    else{
        img.setAttribute("src", `Images/${Folders[menu][index]}/${item}.png`);
    }
    img.setAttribute("height", "80%");
    img.addEventListener('click', function(){
        document.getElementById(`btn${menu}${selected[menu]}`).style.backgroundColor = MENU_BG_COLOR;
        document.getElementById(`btn${menu}${item}`).style.backgroundColor = MENU_SELECT_COLOR;
        selected[menu] = item;
    });
    img.ondragstart = function() { return false; };
    document.getElementById(`${menu}Div`).appendChild(img);
    sprites[item] = new Sprite(img.getAttribute("src"), 1, 0, 0);
}

class Tile {
    constructor(index) {
        this.index = index;
        this.x = getX(index);
        this.y = getY(index);
        this.tribe = "Bardur";
        this.sprite = new Sprite("Images/Miscellaneous/Clouds.png", 1, 0, 0);

        this.terrain_img = document.createElement("img");
        this.terrain_img.setAttribute("id", index);
        this.terrain_img.setAttribute("src", "Images/Miscellaneous/Clouds.png");
        this.terrain_img.setAttribute("width", sprite_width);
        this.terrain_img.setAttribute("style", `position: absolute;  top: ${getTop(this.x , this.y)}px;  left: ${getLeft(this.x , this.y)}px;`);
        this.terrain_img.ondragstart = function() { return false; };
        document.getElementById("mapDiv").appendChild(this.terrain_img);
    }
};

class Sprite{
    constructor(imgSrc, scale, offsetX, offsetY){
        this.imgSrc = imgSrc;
        this.scale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

document.getElementById("mapDiv").onclick = function clickEvent(e) {
    let rect = e.currentTarget.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = -(e.clientY - rect.top - tile_height * 10);

    let Xtile = Math.ceil(rotateX(x, y) / (sprite_width / 2));
    let Ytile = Math.ceil(rotateY(x, y) / (sprite_width / 2));

    if(Xtile >= 1 && Xtile <= 20 && Ytile >= 1 && Ytile <= 20){
        if(selected.menu == "terrains"){
            if(selected.terrains == "Ground" || selected.terrains == "Forest" || selected.terrains == "Mountain"){
                document.getElementById(getIndex(Xtile, Ytile)).src = `Images/${selected.tribes}/${selected.terrains}.png`;
            }
            else{
                document.getElementById(getIndex(Xtile, Ytile)).src = `Images/Miscellaneous/${selected.terrains}.png`;
            }
        }
    }
    console.log(`X: ${x} Y: ${y}`);
    console.log(`Xr: ${rotateX(x, y)} Yr: ${rotateY(x, y)}`);
    console.log(`Xtile: ${Xtile} Ytile: ${Ytile}`);
  }
function rotateX (x, y) {
    let r = Math.sqrt(x**2 + y**2);
    let a = Math.atan2(y, x) - Math.atan2(tile_width, tile_height);
    return r * Math.cos(a);
}
function rotateY (x, y) {
    let r = Math.sqrt(x**2 + y**2);
    let a = Math.atan2(y, x) + Math.atan2(tile_width, tile_height);
    return r * Math.cos(a);
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
        document.getElementById("mainMenuDiv").style.height = "0%";
        document.getElementById("miscsDiv").style.height = "0%";
        for (let i = 0; i < Object.keys(Buttons).length; i++) { 
            document.getElementById(Object.keys(Buttons)[i] + "Div").style.height = "0%";
        }

        isMenuOpen = false;
    }
    else {
        document.getElementById("mainMenuDiv").style.height = "10%";
        isMenuOpen = true;
    }
}

function selectMainMenu(newMenuSelection) {
    if(selected.menu == newMenuSelection){
        document.getElementById("tribesDiv").style.height = "0%";
        if(selected.menu == "onterrains"){
            document.getElementById(`${selected.terrains}Div`).style.height = "0%";
        }
        else if (selected.menu == "Units") {
            if(selected.terrains == "DeepWater" || selected.terrains == "ShallowWater"){
                document.getElementById(`WaterUnitsDiv`).style.height = "0%";
            }
            else if (selected.terrains != "Clouds"){
                document.getElementById(`LandUnitsDiv`).style.height = "0%";
            }
        }
        else{
            document.getElementById(`${selected.menu}Div`).style.height = "0%";
        }
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_BG_COLOR;

        selected.menu = "None";
        isSubMenuOpen = false;
    }
    else {
        if(selected.menu != "None"){
            if(selected.menu == "onterrains"){
                document.getElementById(`${selected.terrains}Div`).style.height = "0%";
            }
            else if (selected.menu == "Units") {
                if(selected.terrains == "DeepWater" || selected.terrains == "ShallowWater"){
                    document.getElementById(`WaterUnitsDiv`).style.height = "0%";
                }
                else if (selected.terrains != "Clouds"){
                    document.getElementById(`LandUnitsDiv`).style.height = "0%";
                }
            }
            else{
                document.getElementById(`${selected.menu}Div`).style.height = "0%";
            }
            document.getElementById(`btn${selected.menu}`).style.backgroundColor = MENU_BG_COLOR;
        }

        document.getElementById("tribesDiv").style.height = "10%";
        if(newMenuSelection == "onterrains"){
            document.getElementById(`${selected.terrains}Div`).style.height = "10%";
        }
        else if (newMenuSelection == "Units") {
            if(selected.terrains == "DeepWater" || selected.terrains == "ShallowWater"){
                document.getElementById(`WaterUnitsDiv`).style.height = "10%";
            }
            else if (selected.terrains != "Clouds"){
                document.getElementById(`LandUnitsDiv`).style.height = "10%";
            }
        }
        else{
            document.getElementById(`${newMenuSelection}Div`).style.height = "10%";
        }
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_SELECT_COLOR;

        selected.menu = newMenuSelection;
        isSubMenuOpen = true;
    }
}

function attTribes(tribe) {
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        if(Object.keys(Buttons)[i] != "tribes"){
            for (let j = 0; j < Buttons[Object.keys(Buttons)[i]].length; j++) {
                if(Folders[Object.keys(Buttons)[i]][j] == "selected.tribes"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = `Images/${tribe}/${Buttons[Object.keys(Buttons)[i]][j]}.png`;
                }
            }
        }
    }
}