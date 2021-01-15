"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_height = tile_height * 20.75;
const div_width = tile_width * 20;

const MENU_BG_COLOR = "#0e092c";
const MENU_SELECT_COLOR = "black";

const ZOOM_INCREASE = 0.4;
const ZOOM_WHEEL_FACTOR = 0.003;
const ZOOM_MAX = 3.5;
const ZOOM_MIN = 0.25;

const MIN_DRAG_MOVEMENT = 5;

let map = new Array(400);
let isMenuOpen = false;
let isSubMenuOpen = false;
let selected = {menu: "None", tile: 0};
let selectedIndex = {};
let misc = "Miscellaneous";
let mainMenuBtns = ["terrains", "onterrains", "units", "miscs"];

let zoomScale = 1;
let map_moving = false;

let Buttons = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Clouds", "DeepWater", "ShallowWater", "Ground", "Forest", "Mountain", "Ice"],
    Clouds: ["Clouds", "Rainbow"],
    DeepWater: ["DeepWater", "Ruin", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    ShallowWater: ["ShallowWater", "Fish", "Port", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    Ground: ["Ground", "Ruin", "Village", "City", "Fruit", "Crop", "Farm", "Windmill", "Sawmill", "CustomsHouse", "Sanctuary", "Forge", "IceBank", "POF", "GOP",
            "GB", "AOP", "ET", "TOW", "EOG", "Temple"],
    Forest: ["Forest", "Ruin", "Animal", "Lumber hut", "Sanctuary", "ForestTemple"],
    Mountain: ["Mountain", "Ruin", "Metal", "Mine", "Sanctuary", "MountainTemple"],
    Ice: ["Ice", "Ruin", "Port", "Fish", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "IceTemple", "WaterTemple"],
    WaterUnits: ["boat", "ship", "battleship", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"],
    LandUnits: ["warrior", "archer", "rider", "knight", "defender", "catapult", "swordsman", "mindbender", "giant", "polytaur", "dragonegg", 
                "mooni", "icearcher", "battlesled", "icefortress", "gaami", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"],
    FixedMenu: ["ShowMenu", "ZoomIn", "ZoomOut"]
}
let Folders = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "selected.tribes", "selected.tribes", "selected.tribes", "Miscellaneous"],
    Clouds: ["Miscellaneous", "Miscellaneous"], 
    DeepWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"], 
    ShallowWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", 
                    "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"], 
    Ground: ["selected.tribes", "Miscellaneous", "Miscellaneous", "City", "selected.tribes", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings", "Buildings", 
            "Buildings", "Buildings", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes",
             "selected.tribes", "Buildings"], 
    Forest: ["selected.tribes", "Miscellaneous", "selected.tribes", "Miscellaneous", "Buildings", "Buildings"], 
    Mountain: ["selected.tribes", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings"],
    Ice: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", 
            "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"],
    WaterUnits: ["selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes"],
    LandUnits: ["selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes"],
    FixedMenu: ["Others", "Others", "Others"]
}
let OffsetX = { // Positive value moves sprite to the left
    Clouds: [0, -0.2], 
    DeepWater: [0.051, -0.18, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    ShallowWater: [0, -0.15, -0.05, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    Ground: [0, -0.18, -0.2, 0, -0.12, 0, 0, 0, -0.08, -0.28, 0, -0.26, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185], 
    Forest: [0, -0.18, -0.35, -0.32, 0, -0.185], 
    Mountain: [0.08, -0.18, -0.1, -0.25, 0, -0.185],
    Ice: [0, -0.16, -0.05, -0.15, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185],
    WaterUnits: [-0.22, -0.2, -0.23, -0.18, -0.2, -0.2, -0.21, -0.22, -0.22],
    LandUnits: [-0.19, -0.12, -0.21, -0.2, -0.2, -0.22, -0.2, -0.17, -0.24, -0.2, -0.19, -0.21, -0.17, -0.2, -0.22, -0.2, -0.18, -0.2, -0.2, -0.21, -0.22, -0.22]
}
let OffsetY = { // Positive value moves sprite up // Ice increases about 0.05 from water
    Clouds: [0, 0.1], 
    DeepWater: [-0.06, 0, -0.18, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    ShallowWater: [-0.14, -0.07, -0.12, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    Ground: [-0.07, 0.05, -0.1, 0.64, 0.1, 0, 0.03, 0.05, 0.08, 0.11, 0.6, 0, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, -0.02], 
    Forest: [0.06, 0.03, -0.15, -0.12, 0.6, 0.07], 
    Mountain: [0.2, 0.05, 0.1, -0.15, 0.6, 0.12],
    Ice: [-0.09, 0.02, -0.07, -0.07, -0.18, 0.03, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, 0.15, 0],
    WaterUnits: [0.26, 0.3, 0.19, 0.28, 0.25, 0.25, 0.3, 0.3, 0.31],
    LandUnits: [0.27, 0.34, 0.25, 0.25, 0.32, 0.29, 0.32, 0.29, 0.3, 0.32, 0.3, 0.22, 0.29, 0.25, 0.21, 0.2, 0.33, 0.3, 0.3, 0.35, 0.35, 0.36]
}
let Scales = {
    Clouds: [1, 0.6], 
    DeepWater: [1.1, 0.65, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    ShallowWater: [1, 0.75, 0.9, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    Ground: [1, 0.65, 0.6, 1, 0.8, 1, 1, 0.8, 0.8, 0.45, 1, 0.5, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65], 
    Forest: [1, 0.65, 0.35, 0.5, 1, 0.65], 
    Mountain: [1.13, 0.65, 0.7, 0.45, 1, 0.65],
    Ice: [0.99, 0.65, 0.9, 0.75, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65],
    WaterUnits: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    LandUnits: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7]
}

let mousePos = { };
let marginPos = { };
let mouseScrollListeners = [];
let sprites = [];

onload = function() {
    document.getElementById("mapDiv").style.height = `${div_height}px`;
    document.getElementById("mapDiv").style.width = `${div_width}px`;
    document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1}px`;

    // Create map as array of tiles
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
    
    // Set main menu and fixed menu click events
    document.getElementById(`btnterrains`).addEventListener('click', function(){ selectMainMenu("terrains"); });
    document.getElementById(`btnonterrains`).addEventListener('click', function(){ selectMainMenu("onterrains"); });
    document.getElementById(`btnUnits`).addEventListener('click', function(){ selectMainMenu("Units"); });
    document.getElementById(`btnmiscs`).addEventListener('click', function(){ selectMainMenu("miscs"); });
    document.getElementById(`btnFixedMenuShowMenu`).addEventListener('click', function(){ menuButtonClick(); });
    document.getElementById(`btnFixedMenuZoomIn`).addEventListener('click', function(){ ZoomIn(); });
    document.getElementById(`btnFixedMenuZoomOut`).addEventListener('click', function(){ ZoomOut(); });

    // Add horizontal scroll to divs
    onmouseup = function clickEvent(e) {
        mouseScrollListeners.forEach(function (item, index){
                document.getElementById(item.targetMenu).removeEventListener('mousemove', item.handler);
        });
    }
    let fontouchend = function(e) {
        mouseScrollListeners.forEach(function (item, index){
                document.getElementById(item.targetMenu).removeEventListener('touchmove', item.handler);
        });
    }
    addEventListener('touchend', fontouchend);

    addMenuScrollHandlers("mainMenuDiv");
    addMenuScrollHandlers("WaterUnitsDiv");
    addMenuScrollHandlers("LandUnitsDiv");
    addMenuScrollHandlers("miscsDiv");
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        addMenuScrollHandlers(Object.keys(Buttons)[i] + "Div");
    }

    // Add map zoom and scroll
    document.getElementById("mapDiv").onwheel = zoomWheel;

    document.getElementById("mapDiv").onmousedown = function clickEvent(e) {
        mousePos["mapDivX"] = e.clientX;
        mousePos["mapDivY"] = e.clientY;
        map_moving = false;

        marginPos["mapDivX"] = document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0;
        marginPos["mapDivY"] = (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1);
        document.getElementById("mapDiv").addEventListener('mousemove', mouseMoveMapHandler);
        mouseScrollListeners.push({targetMenu: "mapDiv", handler: mouseMoveMapHandler});
    }
    document.getElementById("mapDiv").ontouchstart = function clickEvent(e) {
        let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        let touch = evt.touches[0] || evt.changedTouches[0];
        mousePos["mapDivX"] = touch.pageX;
        mousePos["mapDivY"] = touch.pageY;
        map_moving = false;

        marginPos["mapDivX"] = document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0;
        marginPos["mapDivY"] = (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1);
        document.getElementById("mapDiv").addEventListener('touchmove', mouseMoveMapHandler);
        mouseScrollListeners.push({targetMenu: "mapDiv", handler: mouseMoveMapHandler});
    }

    let mouseMoveMapHandler = function(e) {
        let mousePosDX = 0;
        let mousePosDY = 0;

        if(e.type == 'touchmove'){
            let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            mousePosDX = touch.pageX - mousePos["mapDivX"];
            mousePosDY = touch.pageY - mousePos["mapDivY"];
        } else {
            mousePosDX = e.clientX - mousePos["mapDivX"];
            mousePosDY = e.clientY - mousePos["mapDivY"];
        }

        if(Math.abs(mousePosDX) >= MIN_DRAG_MOVEMENT || Math.abs(mousePosDY) >= MIN_DRAG_MOVEMENT){
            map_moving = true;
        }
        if(map_moving){
            let selectedPosX = marginPos["mapDivX"] + mousePosDX;
            let selectedPosY = marginPos["mapDivY"] + mousePosDY;
            let limInfX = window.innerWidth - div_width * (1 + zoomScale) / 2;
            let limInfY = window.innerHeight * 0.6 - div_height * (1 + zoomScale) / 2;
            let limSupX = - div_width * (1 - zoomScale) / 2;
            let limSupY = - div_height * (1 - zoomScale) / 2;

            if(selectedPosX >= limSupX || window.innerWidth > div_width * zoomScale){
                document.getElementById("mapDiv").style.marginLeft = `${limSupX}px`;
            }
            else if (selectedPosX <= limInfX){
                document.getElementById("mapDiv").style.marginLeft = `${limInfX}px`;
            }
            else{
                document.getElementById("mapDiv").style.marginLeft = `${selectedPosX}px`;
            }

            if(selectedPosY >= limSupY || window.innerHeight * 0.6 > div_height * zoomScale){
                document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1 + limSupY}px`;
            }
            else if (selectedPosY <= limInfY){
                document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1 + limInfY}px`;
            }
            else{
                document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1 + selectedPosY}px`;
            }
        }
    };

    // Click on menus to open them
    menuButtonClick();
    document.getElementById(`btnterrains`).click();
    document.getElementById(`btnterrains${selected.terrains}`).click();
    document.getElementById(`btntribes${selected.tribes}`).click();
};

onresize = function() {
    adjustMapPosition();
}
function adjustMapPosition(){
    if(window.innerWidth > div_width * zoomScale){
        let limSupX = - div_width * (1 - zoomScale) / 2;
        document.getElementById("mapDiv").style.marginLeft = `${limSupX}px`;
    }
    if(window.innerHeight * 0.6 > div_height * zoomScale){
        let limSupY = - div_height * (1 - zoomScale) / 2;
        document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1 + limSupY}px`;
    }
}

function addMenuScrollHandlers(menu) {
    document.getElementById(menu).onmousedown = function clickEvent(e) {
        mousePos[menu] = e.clientX;

        marginPos[menu] = document.getElementById(menu).children[0].style.marginLeft.replace("px",'')|0;
        document.getElementById(menu).addEventListener('mousemove', mouseMoveHandler);
        mouseScrollListeners.push({targetMenu: menu, handler: mouseMoveHandler});
    }
    document.getElementById(menu).ontouchstart = function clickEvent(e) {
        let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        let touch = evt.touches[0] || evt.changedTouches[0];
        mousePos[menu] = touch.pageX;

        marginPos[menu] = document.getElementById(menu).children[0].style.marginLeft.replace("px",'')|0;
        document.getElementById(menu).addEventListener('touchmove', mouseMoveHandler);
        mouseScrollListeners.push({targetMenu: menu, handler: mouseMoveHandler});
    }

    let mouseMoveHandler = function(e) {
        let mousePosDX = 0;

        if(e.type == 'touchmove'){
            let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            mousePosDX = touch.pageX - mousePos[menu];
        } else {
            mousePosDX = e.clientX - mousePos[menu];
        }

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
    else if(Folders[menu][index] == "Buildings"){
        img.setAttribute("src", `Images/Buildings/${item}/${item}5.png`);
    }
    else if(Folders[menu][index] == "City"){
        img.setAttribute("src", `Images/${selected.tribes}/City/City7.png`);
    }
    else{
        img.setAttribute("src", `Images/${Folders[menu][index]}/${item}.png`);
    }
    img.setAttribute("height", "80%");
    img.addEventListener('click', function(){
        document.getElementById(`btn${menu}${selected[menu]}`).style.backgroundColor = MENU_BG_COLOR;
        document.getElementById(`btn${menu}${item}`).style.backgroundColor = MENU_SELECT_COLOR;
        selected[menu] = item;
        selectedIndex[menu] = index;
    });
    selectedIndex[menu] = 0;
    img.ondragstart = function() { return false; };
    img.oncontextmenu= function() { return false; };
    document.getElementById(`${menu}Div`).appendChild(img);
}

class Tile {
    constructor(index) {
        this.index = index;
        this.terrainSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "terrains", true);
        this.onterrainSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "onterrains", false);
        this.UnitSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "Units", false);
    }
};

class Sprite{
    constructor(imgSrc, index, type, visible){
        this.posTop = getTop(getX(index) , getY(index));
        this.posLeft = getLeft(getX(index) , getY(index));

        this.imgElement = document.createElement("img");
        this.imgElement.setAttribute("id", type + index);
        this.imgElement.setAttribute("src", imgSrc);
        this.imgElement.setAttribute("width", sprite_width);
        this.imgElement.setAttribute("style", `position: absolute;  top: ${this.posTop}px;  left: ${this.posLeft}px;`);
        this.imgElement.ondragstart = function() { return false; };
        this.imgElement.oncontextmenu= function() { return false; };
        if(!visible){
            this.imgElement.style.display = "none";
        }
        document.getElementById("mapDiv").appendChild(this.imgElement);
    }
    redraw(menu, index){
        if(Folders[menu][index] == "selected.tribes"){
            this.imgElement.setAttribute("src", `Images/${selected.tribes}/${Buttons[menu][index]}.png`);
        }
        else if(Folders[menu][index] == "Buildings"){
            this.imgElement.setAttribute("src", `Images/Buildings/${Buttons[menu][index]}/${Buttons[menu][index]}1.png`);
        }
        else if(Folders[menu][index] == "City"){
            this.imgElement.setAttribute("src", `Images/${selected.tribes}/City/City3.png`);
        }
        else{
            this.imgElement.setAttribute("src", `Images/${Folders[menu][index]}/${Buttons[menu][index]}.png`);
        }
        if(menu == "terrains"){
            this.imgElement.setAttribute("width", sprite_width * Scales[selected.terrains][0]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[selected.terrains][0]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[selected.terrains][0]}px`;
        }
        else {
            this.imgElement.setAttribute("width", sprite_width * Scales[menu][index]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[menu][index]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[menu][index]}px`;
        }
    }
}

document.getElementById("mapDiv").onclick = function clickEvent(e) {
    if(!map_moving){
        let rect = e.currentTarget.getBoundingClientRect();

        let x = (e.clientX - rect.left) / zoomScale;
        let y = -(e.clientY - rect.top - tile_height * 10 * zoomScale) / zoomScale;

        let Xtile = Math.ceil(rotateX(x, y) / (sprite_width / 2));
        let Ytile = Math.ceil(rotateY(x, y) / (sprite_width / 2));

        if(Xtile >= 1 && Xtile <= 20 && Ytile >= 1 && Ytile <= 20){
            selected.tile = getIndex(Xtile, Ytile);
            attSelectedTile();
        }
        // console.log(`X: ${x} Y: ${y}`);
        // console.log(`Xr: ${rotateX(x, y)} Yr: ${rotateY(x, y)}`);
        // console.log(`Xtile: ${Xtile} Ytile: ${Ytile}`);
    }
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

function attSelectedTile(){
    switch(selected.menu){
    case "terrains":
        map[selected.tile].terrainSprite.redraw("terrains", selectedIndex["terrains"]); // Update terrain
        document.getElementById(`onterrains${selected.tile}`).style.display = 'none'; // Make what is on terrain invisible
    break;
    case "onterrains":
        map[selected.tile].terrainSprite.redraw("terrains", selectedIndex["terrains"]); // Update terrain
        map[selected.tile].onterrainSprite.redraw(selected["terrains"], selectedIndex[selected["terrains"]]); // Update what is on terrain
        document.getElementById(`onterrains${selected.tile}`).style.display = 'inline'; // Make what is on terrain visible
    break;
    case "Units":
        if(selected.terrains == "DeepWater" || selected.terrains == "ShallowWater"){ // Check type of unit
            map[selected.tile].UnitSprite.redraw("WaterUnits", selectedIndex["WaterUnits"]); // Update water unit
        }
        else{
            map[selected.tile].UnitSprite.redraw("LandUnits", selectedIndex["LandUnits"]); // Update land unit
        }
        document.getElementById(`Units${selected.tile}`).style.display = 'inline'; // Make unit visible
    break;
    default:

    break;
    }
}

function menuButtonClick() {
    if(isMenuOpen){
        document.getElementById("mainMenuDiv").style.height = "0%";
        document.getElementById("miscsDiv").style.height = "0%";
        for (let i = 0; i < Object.keys(Buttons).length; i++) { 
            if(Object.keys(Buttons)[i] != "FixedMenu"){
                document.getElementById(Object.keys(Buttons)[i] + "Div").style.height = "0%";
            }
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
        setMenuHeight("0%");
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_BG_COLOR;
        isSubMenuOpen = false;
        selected.menu = "None";
    }
    else {
        if(selected.menu != "None"){
            setMenuHeight("0%");
            document.getElementById(`btn${selected.menu}`).style.backgroundColor = MENU_BG_COLOR;
        }
        selected.menu = newMenuSelection;
        document.getElementById("tribesDiv").style.height = "10%";
        setMenuHeight("10%");
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_SELECT_COLOR;
        isSubMenuOpen = true;
    }
}
function setMenuHeight(newHeight){
    if(selected.menu == "onterrains"){
        document.getElementById(`${selected.terrains}Div`).style.height = newHeight;
    }
    else if (selected.menu == "Units") {
        if(selected.terrains == "DeepWater" || selected.terrains == "ShallowWater"){
            document.getElementById(`WaterUnitsDiv`).style.height = newHeight;
        }
        else if (selected.terrains != "Clouds"){
            document.getElementById(`LandUnitsDiv`).style.height = newHeight;
        }
    }
    else{
        document.getElementById(`${selected.menu}Div`).style.height = newHeight;
    }
}

function attTribes(tribe) {
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        if(Object.keys(Buttons)[i] != "tribes"){
            for (let j = 0; j < Buttons[Object.keys(Buttons)[i]].length; j++) {
                if(Folders[Object.keys(Buttons)[i]][j] == "selected.tribes"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = `Images/${tribe}/${Buttons[Object.keys(Buttons)[i]][j]}.png`;
                }
                else if(Folders[Object.keys(Buttons)[i]][j] == "City"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = `Images/${tribe}/City/City7.png`;
                }
            }
        }
    }
}

function ZoomIn(){
    if(zoomScale + ZOOM_INCREASE < ZOOM_MAX){
        zoomScale += ZOOM_INCREASE;
    }
    else{
        zoomScale = ZOOM_MAX;
    }
    document.getElementById("mapDiv").style.transform = `scale(${zoomScale})`;
    adjustMapPosition();
}
function ZoomOut(){
    if(zoomScale - ZOOM_INCREASE > ZOOM_MIN){
        zoomScale -= ZOOM_INCREASE;
    }
    else{
        zoomScale = ZOOM_MIN;
    }
    document.getElementById("mapDiv").style.transform = `scale(${zoomScale})`;
    adjustMapPosition();
}
function zoomWheel(event) {
    event.preventDefault();
    let newZoomScale = zoomScale + event.deltaY * -ZOOM_WHEEL_FACTOR;
    zoomScale = Math.min(Math.max(ZOOM_MIN, newZoomScale), ZOOM_MAX);
    document.getElementById("mapDiv").style.transform = `scale(${zoomScale}, ${zoomScale})`;
  }