"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_border_factor = 0.05;
const div_height = tile_height * 20.75 * (1 + 2 * div_border_factor);
const div_width = tile_width * 20 * (1 + 2 * div_border_factor);

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

let zoomScale = 1;
let map_moving = false;

let minLevel = { City: 1, CustomsHouse: 1, ForestTemple: 1, Forge: 1, IceBank: 1, IceTemple: 1, MountainTemple: 1, 
                    Sanctuary: 1, Sawmill: 1, Temple: 1, WaterTemple: 1, Windmill: 1 };
let maxLevel = { City: 7, CustomsHouse: 5, ForestTemple: 5, Forge: 8, IceBank: 9, IceTemple: 5, MountainTemple: 5, 
                    Sanctuary: 8, Sawmill: 8, Temple: 5, WaterTemple: 5, Windmill: 6 };
let maxHP = {boat: 10, ship: 10, battleship: 10, warrior: 10, archer: 10, rider: 10, knight: 15, defender: 15, catapult: 10, swordsman: 15, mindbender: 10, giant: 40,
            polytaur: 15, dragonegg: 10, mooni: 10, icearcher: 10, battlesled: 15, icefortress: 20, gaami: 30, navalon: 30, babydragon: 15, firedragon: 20,
            amphibian: 10, tridention: 15, crab: 40};
let Buttons = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Clouds", "DeepWater", "ShallowWater", "Ground", "Forest", "Mountain", "Ice"],
    Clouds: ["Clouds", "Rainbow"],
    DeepWater: ["DeepWater", "Ruin", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    ShallowWater: ["ShallowWater", "Fish", "Port", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    Ground: ["Ground", "Roads", "Ruin", "Village", "City", "Fruit", "Crop", "Farm", "Windmill", "Sawmill", "CustomsHouse", "Sanctuary", "Forge", "IceBank", "POF", "GOP",
            "GB", "AOP", "ET", "TOW", "EOG", "Temple"],
    Forest: ["Forest", "Roads", "Ruin", "Animal", "Lumber hut", "Sanctuary", "ForestTemple"],
    Mountain: ["Mountain", "Ruin", "Metal", "Mine", "Sanctuary", "MountainTemple"],
    Ice: ["Ice", "Ruin", "Port", "Fish", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "IceTemple", "WaterTemple"],
    Units: ["boat", "ship", "battleship", "warrior", "archer", "rider", "knight", "defender", "catapult", "swordsman", "mindbender", "giant", "polytaur", 
                "dragonegg", "mooni", "icearcher", "battlesled", "icefortress", "gaami", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"],
    FixedMenu: ["ShowMenu", "ZoomIn", "ZoomOut"], 
    Misc: ["skull", "HPUp", "HPDown", "HP", "Veteran", "capture", "LevelUp", "LevelDown", "Castle", "Workshop", "Wall"],
    Resources: ["Chop", "Destruction", "Gather", "Destroy"]
};
let Folders = {
    tribes: ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"],
    terrains: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "selected.tribes", "selected.tribes", "selected.tribes", "Miscellaneous"],
    Clouds: ["Miscellaneous", "Miscellaneous"], 
    DeepWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"], 
    ShallowWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", 
                    "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"], 
    Ground: ["selected.tribes", "Miscellaneous", "Miscellaneous", "Miscellaneous", "City", "selected.tribes", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings", 
            "Buildings", "Buildings", "Buildings", "Buildings", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
            "selected.tribes", "selected.tribes", "Buildings"], 
    Forest: ["selected.tribes", "Miscellaneous", "Miscellaneous", "selected.tribes", "Miscellaneous", "Buildings", "Buildings"], 
    Mountain: ["selected.tribes", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings"],
    Ice: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "selected.tribes", "selected.tribes", 
            "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "Buildings", "Buildings"],
    Units: ["selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes", 
                "selected.tribes", "selected.tribes", "selected.tribes", "selected.tribes"],
    FixedMenu: ["Miscellaneous", "Miscellaneous", "Miscellaneous"],
    Misc: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "selected.tribes", "Miscellaneous", 
            "Miscellaneous"],
    Resources: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous"]
};
let OffsetX = { // Positive value moves sprite to the left
    Clouds: [0, -0.2], 
    DeepWater: [0.051, -0.18, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    ShallowWater: [0, -0.15, -0.05, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    Ground: [0, 0, -0.18, -0.2, 0, -0.12, 0, 0, 0, -0.08, -0.28, 0, -0.26, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185], 
    Forest: [0, 0, -0.18, -0.35, -0.32, 0, -0.185], 
    Mountain: [0.08, -0.18, -0.1, -0.25, 0, -0.185],
    Ice: [0, -0.16, -0.05, -0.15, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185],
    Units: [-0.22, -0.2, -0.23, -0.19, -0.12, -0.21, -0.2, -0.2, -0.22, -0.2, -0.17, -0.24, -0.2, -0.19, -0.21, -0.17, -0.2, -0.22, -0.2, -0.18, -0.2, -0.2, -0.21, -0.22, -0.22],
    Misc: {Castle: -0.4, Workshop: -0.18, Wall: 0, Selection: 0, SelectionSup: 0}
};
let OffsetY = { // Positive value moves sprite up // Ice increases about 0.05 from water
    Clouds: [0, 0.1], 
    DeepWater: [-0.06, 0, -0.18, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    ShallowWater: [-0.14, -0.07, -0.12, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    Ground: [-0.07, -0.05, 0.05, -0.1, 0.64, 0.1, 0, 0.03, 0.05, 0.08, 0.11, 0.6, 0, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, -0.02], 
    Forest: [0.06, 0, 0.03, -0.15, -0.12, 0.6, 0.07], 
    Mountain: [0.2, 0.05, 0.1, -0.15, 0.6, 0.12],
    Ice: [-0.09, 0.02, -0.07, -0.07, -0.18, 0.03, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, 0.15, 0],
    Units: [0.26, 0.3, 0.19, 0.27, 0.34, 0.25, 0.25, 0.32, 0.29, 0.32, 0.29, 0.3, 0.32, 0.3, 0.22, 0.29, 0.25, 0.21, 0.2, 0.33, 0.3, 0.3, 0.35, 0.35, 0.36],
    Misc: {Castle: -0.01, Workshop: 0, Wall: 0, Selection: -0.05, SelectionSup: -0.05}
}
let Scales = {
    Clouds: [1, 0.6], 
    DeepWater: [1.1, 0.65, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    ShallowWater: [1, 0.75, 0.9, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    Ground: [1, 1, 0.65, 0.6, 1, 0.8, 1, 1, 0.8, 0.8, 0.45, 1, 0.5, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65], 
    Forest: [1, 1, 0.65, 0.35, 0.5, 1, 0.65], 
    Mountain: [1.13, 0.65, 0.7, 0.45, 1, 0.65],
    Ice: [0.99, 0.65, 0.9, 0.75, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65],
    Units: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    Misc: {Castle: 0.35, Workshop: 0.4, Wall: 1, Selection: 1, SelectionSup: 1}
};

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

    // Set misc buttons click events
    Buttons.Misc.forEach(function (item, index){
        document.getElementById(`btnMisc${item}`).addEventListener('click', function(){
            MiscClick(item);
        });
    });

    // Change terrain icon click events
    Buttons.terrains.forEach(function (item, index){
        document.getElementById(`btnterrains${item}`).addEventListener('click', function(){
            updateTerrainIcon();
        });
    });
    
    // Set main menu and fixed menu click events
    document.getElementById(`btnterrains`).addEventListener('click', function(){ selectMainMenu("terrains"); });
    document.getElementById(`btnonterrains`).addEventListener('click', function(){ selectMainMenu("onterrains"); });
    document.getElementById(`btnUnits`).addEventListener('click', function(){ selectMainMenu("Units"); });
    document.getElementById(`btnMisc`).addEventListener('click', function(){ selectMainMenu("Misc"); attMiscMenu(); });
    document.getElementById(`btnResources`).addEventListener('click', function(){ selectMainMenu("Resources"); });
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
            adjustMapPosition(marginPos["mapDivX"] + mousePosDX, marginPos["mapDivY"] + mousePosDY);
        }
    };

    // Click on menus to open them
    menuButtonClick();
    document.getElementById(`btnterrains`).click();
    document.getElementById(`btnterrains${selected.terrains}`).click();
    document.getElementById(`btntribes${selected.tribes}`).click();
};

onresize = function() {
    adjustMapPosition(document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0, 
                    (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1));
}

function adjustMapPosition(selectedPosX, selectedPosY){
    let limInfX = window.innerWidth - div_width * (1 + zoomScale) / 2;
    let limInfY = window.innerHeight * 0.6 - div_height * (1 + zoomScale) / 2;
    let limSupX = - div_width * ((1 - zoomScale) / 2);
    let limSupY = - div_height * ((1 - zoomScale) / 2);

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
        this.hasRoads = false;

        this.terrain = "Clouds";
        this.terrainIndex = 0;
        this.tribeTerrain = "Bardur";

        this.onterrain = "Clouds";
        this.onterrainIndex = 0;

        this.Unit = "";
        this.UnitIndex = 0;
        this.tribeUnit = "Bardur";
        this.hasUnit = false;

        this.buildingLevel = 1;
        this.hasCastle = false;
        this.hasWorkshop = false;
        this.hasWall = false;

        this.terrainSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "terrains", true);
        this.roadSprite = new Array(8);
        for(let i = 0; i < 8; i++) {
            this.roadSprite[i] = new Sprite(`Images/Miscellaneous/Roads/Roads${i}.png`, index, `Roads${i}`, false);
            this.roadSprite[i].imgElement.setAttribute("width", sprite_width * Scales.Ground[1]);
            this.roadSprite[i].imgElement.style.top = `${this.roadSprite[i].posTop - sprite_width * OffsetY.Ground[1]}px`;
            this.roadSprite[i].imgElement.style.left = `${this.roadSprite[i].posLeft - sprite_width * OffsetX.Ground[1]}px`;
        }
        this.selectionSprite = new Sprite("Images/Miscellaneous/Selection.png", index, "Selection", false);
        this.onterrainSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "onterrains", false);
        this.castleSprite = new Sprite("Images/Bardur/Castle.png", index, "Castle", false);
        this.workshopSprite = new Sprite("Images/Miscellaneous/Workshop.png", index, "Workshop", false);
        this.wallSprite = new Sprite("Images/Miscellaneous/Wall.png", index, "Wall", false);
        this.UnitSprite = new Sprite("Images/Miscellaneous/Clouds.png", index, "Units", false);
        this.selectionSupSprite = new Sprite("Images/Miscellaneous/SelectionSup.png", index, "SelectionSup", false);
    }
    updateTerrain(newIndex) {
        this.terrainIndex = newIndex;
        this.tribeTerrain = selected.tribes;
        this.terrain = Buttons.terrains[this.terrainIndex];
        this.terrainSprite.redraw("terrains", this.terrainIndex);
    }
    updateOnTerrain(newIndex) {
        this.onterrainIndex = newIndex;
        this.onterrain = Buttons[this.terrain][this.onterrainIndex];
        this.onterrainSprite.redraw(this.terrain, this.onterrainIndex);
        if(newIndex == 0) {
            this.onterrainSprite.imgElement.style.display = 'none';
        }
        else {
            this.onterrainSprite.imgElement.style.display = 'inline';
        }
    }
    updateUnit(type, newIndex) {
        if(type == "") {
            this.UnitSprite.imgElement.style.display = 'none';
            this.hasUnit = false;
        }
        else {
            this.UnitSprite.redraw(type, newIndex);
            this.UnitSprite.imgElement.style.display = 'inline';
            this.UnitIndex = newIndex;
            this.tribeUnit = selected.tribes;
            this.Unit = Buttons[type][newIndex];
            this.hasUnit = true;
        }
    }
    removeCity() {
        this.hasCastle = false;
        this.hasWorkshop = false;
        this.hasWall = false;
        this.castleSprite.imgElement.style.display = "none";
        this.workshopSprite.imgElement.style.display = "none";
        this.wallSprite.imgElement.style.display = "none";
    }
    attRoads(value) {
        this.hasRoads = value;
    
        for(let i = getX(this.index) - 1; i <= getX(this.index) + 1; i++){
            if(i >= 1 && i <= 20) {
                for(let j = getY(this.index) - 1; j <= getY(this.index) + 1; j++){
                    if(j >= 1 && j <= 20) { // Update all 3x3 tiles
                        
                        let k = 0; // Road array index
                        let roadFound = false;
                        for(let m = -1; m <= 1; m++){
                            for(let n = -1; n <= 1; n++){
                                if(m != 0 || n != 0) { // Skip middle tile
                                    if(i+m >= 1 && i+m <= 20 && j+n >= 1 && j+n <= 20){
                                        map[getIndex(i, j)].roadSprite[k].setVisibility(map[getIndex(i+m, j+n)].hasRoads && map[getIndex(i, j)].hasRoads);
                                        if(map[getIndex(i+m, j+n)].hasRoads) {
                                            roadFound = true;
                                        }
                                    }
                                    k++;
                                }
                            }
                        }
                        if(roadFound == false && 
                            map[getIndex(i, j)].hasRoads && 
                            map[getIndex(i, j)].onterrain != "Village" && 
                            map[getIndex(i, j)].onterrain != "City" && 
                            map[getIndex(i, j)].onterrain != "Port" && 
                            map[getIndex(i, j)].onterrain != "Outpost") {
                            map[getIndex(i, j)].roadSprite[4].setVisibility(true);
                        }
    
                    }
                }
            }
        }
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
        if(type == "Roads"){
            this.imgElement.setAttribute("width", sprite_width * Scales[selected.terrains][0]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[selected.terrains][0]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[selected.terrains][0]}px`;
        }
        else if (type == "Castle" || type == "Workshop" || type == "Wall" || type == "Selection" || type == "SelectionSup") {
            this.imgElement.setAttribute("width", sprite_width * Scales["Misc"][type]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY["Misc"][type]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX["Misc"][type]}px`;
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
            this.imgElement.setAttribute("src", `Images/${selected.tribes}/City/City1.png`);
        }
        else{
            this.imgElement.setAttribute("src", `Images/${Folders[menu][index]}/${Buttons[menu][index]}.png`);
        }
        if(menu == "terrains"){
            this.imgElement.setAttribute("width", sprite_width * Scales[selected.terrains][0]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[Buttons[menu][index]][0]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[Buttons[menu][index]][0]}px`;
        }
        else {
            this.imgElement.setAttribute("width", sprite_width * Scales[menu][index]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[menu][index]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[menu][index]}px`;
        }
    }
    setVisibility(isVisible) {
        if(isVisible) {
            this.imgElement.style.display = "inline";
        }
        else {
            this.imgElement.style.display = "none";
        }
    }
}

document.getElementById("mapDiv").onclick = function clickEvent(e) {
    if(!map_moving){
        let rect = e.currentTarget.getBoundingClientRect();

        let x = (e.clientX - rect.left) / zoomScale - div_border_factor * div_width;
        let y = -(e.clientY - rect.top - tile_height * 10 * zoomScale) / zoomScale + div_border_factor * div_height;

        let Xtile = Math.ceil(rotateX(x, y) / (sprite_width / 2));
        let Ytile = Math.ceil(rotateY(x, y) / (sprite_width / 2));

        if(Xtile >= 1 && Xtile <= 20 && Ytile >= 1 && Ytile <= 20){
            if(selected.menu == "Misc"){
                map[selected.tile].selectionSprite.imgElement.style.display = "none";
                map[selected.tile].selectionSupSprite.imgElement.style.display = "none";
                map[getIndex(Xtile, Ytile)].selectionSprite.imgElement.style.display = "inline";
                map[getIndex(Xtile, Ytile)].selectionSupSprite.imgElement.style.display = "inline";
            }
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
    return (tile_height / 2) * (19 - (x-1) + (y-1)) + div_border_factor * div_height;
}
function getLeft (x , y) {
    return (tile_width / 2) * (0 + (x-1) + (y-1)) + div_border_factor * div_width;
}

function attSelectedTile(){
    switch(selected.menu){
        case "terrains":
            map[selected.tile].updateTerrain(selectedIndex["terrains"]);
            map[selected.tile].updateOnTerrain(0);
            map[selected.tile].attRoads(false);
            map[selected.tile].removeCity();
        break;
        case "onterrains":
            if(Buttons[selected["terrains"]][selectedIndex[selected["terrains"]]] == "Roads"){
                if(map[selected.tile].terrain != selected["terrains"] || map[selected.tile].tribeTerrain != selected.tribes){ // If terrain type is different
                    map[selected.tile].updateTerrain(selectedIndex["terrains"]); 
                    map[selected.tile].updateOnTerrain(0);
                }
                map[selected.tile].attRoads(true);
            }
            else{
                map[selected.tile].updateTerrain(selectedIndex["terrains"]); 
                map[selected.tile].updateOnTerrain(selectedIndex[selected["terrains"]]);
                if(map[selected.tile].onterrain == "Village" || 
                    map[selected.tile].onterrain == "City" || 
                    map[selected.tile].onterrain == "Port" || 
                    map[selected.tile].onterrain == "Outpost") {
                    map[selected.tile].attRoads(true);
                }
                else {
                    map[selected.tile].attRoads(false);
                }
                map[selected.tile].removeCity();
            }
        break;
        case "Units":
            map[selected.tile].updateUnit("Units", selectedIndex["Units"]);
        break;
        case "Misc":
            attMiscMenu();
        break;
        case "Resources":
            if(selected.Resources == "Chop" && map[selected.tile].terrain == "Forest") {
                document.getElementById(`btntribes${map[selected.tile].tribeTerrain}`).click();
                map[selected.tile].updateTerrain(3);
                map[selected.tile].updateOnTerrain(0);
            }
            else if(selected.Resources == "Destruction") {
                map[selected.tile].updateOnTerrain(0);
                map[selected.tile].attRoads(false);
                map[selected.tile].removeCity();
            }
            else if(selected.Resources == "Gather") {
                if(map[selected.tile].onterrain == "Crop") {
                    map[selected.tile].updateOnTerrain(7); // Farm
                }
                else if(map[selected.tile].onterrain == "Forest") {
                    map[selected.tile].updateOnTerrain(4); // Lumber hut
                }
                else if(map[selected.tile].onterrain == "Metal") {
                    map[selected.tile].updateOnTerrain(3); // Mine
                }
                else if(map[selected.tile].onterrain == "Ruin" ||
                        map[selected.tile].onterrain == "Fruit" ||
                        map[selected.tile].onterrain == "Fish" ||
                        map[selected.tile].onterrain == "Whale" ||
                        map[selected.tile].onterrain == "Animal"
                ) {
                    map[selected.tile].updateOnTerrain(0);
                }
            }
            else if(selected.Resources == "Destroy") {
                if(map[selected.tile].onterrain == "Farm") {
                    map[selected.tile].updateOnTerrain(6); // Crop
                }
                else if(map[selected.tile].onterrain == "Outpost" ||
                        map[selected.tile].onterrain == "IceBank" ||
                        map[selected.tile].onterrain == "POF" ||
                        map[selected.tile].onterrain == "GOP" ||
                        map[selected.tile].onterrain == "GB" ||
                        map[selected.tile].onterrain == "AOP" ||
                        map[selected.tile].onterrain == "ET" ||
                        map[selected.tile].onterrain == "TOW" ||
                        map[selected.tile].onterrain == "EOG" ||
                        map[selected.tile].onterrain == "WaterTemple" ||
                        map[selected.tile].onterrain == "IceTemple" ||
                        map[selected.tile].onterrain == "Port" ||
                        map[selected.tile].onterrain == "Windmill" ||
                        map[selected.tile].onterrain == "Sawmill" ||
                        map[selected.tile].onterrain == "CustomsHouse" ||
                        map[selected.tile].onterrain == "Sanctuary" ||
                        map[selected.tile].onterrain == "Forge" ||
                        map[selected.tile].onterrain == "Temple" ||
                        map[selected.tile].onterrain == "Lumber hut" ||
                        map[selected.tile].onterrain == "ForestTemple" ||
                        map[selected.tile].onterrain == "Mine" ||
                        map[selected.tile].onterrain == "MountainTemple" ) {
                    map[selected.tile].updateOnTerrain(0);
                }
            }
        break;
        default:

        break;
    }
}

function menuButtonClick() {
    if(isMenuOpen){
        document.getElementById("mainMenuDiv").style.height = "0%";
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
    if(selected.menu == "Misc"){
        map[selected.tile].selectionSprite.imgElement.style.display = "inline";
        map[selected.tile].selectionSupSprite.imgElement.style.display = "inline";
    }
    else {
        map[selected.tile].selectionSprite.imgElement.style.display = "none";
        map[selected.tile].selectionSupSprite.imgElement.style.display = "none";
    }
}
function setMenuHeight(newHeight){
    if(selected.menu == "onterrains"){
        document.getElementById(`${selected.terrains}Div`).style.height = newHeight;
    }
    else{
        document.getElementById(`${selected.menu}Div`).style.height = newHeight;
    }
}
function updateTerrainIcon() {
    if(selected["terrains"] == "Ground" || selected["terrains"] == "Forest" || selected["terrains"] == "Mountain"){
        document.getElementById(`btnterrains`).src = `Images/${selected.tribes}/${selected["terrains"]}.png`;
    }
    else {
        document.getElementById(`btnterrains`).src = `Images/Miscellaneous/${selected["terrains"]}.png`;
    }
}

function attMiscMenu() {
    if(map[selected.tile].hasUnit) {
        document.getElementById(`btnMiscskull`).style.display = "inline";
        document.getElementById(`btnMiscHPUp`).style.display = "inline";
        document.getElementById(`btnMiscHPDown`).style.display = "inline";
        document.getElementById(`btnMiscHP`).style.display = "inline";
        document.getElementById(`btnMiscVeteran`).style.display = "inline";
        document.getElementById(`btntribes${map[selected.tile].tribeUnit}`).click();
    }
    else {
        document.getElementById(`btnMiscskull`).style.display = "none";
        document.getElementById(`btnMiscHPUp`).style.display = "none";
        document.getElementById(`btnMiscHPDown`).style.display = "none";
        document.getElementById(`btnMiscHP`).style.display = "none";
        document.getElementById(`btnMiscVeteran`).style.display = "none";
    }
    if(map[selected.tile].onterrain == "City") {
        document.getElementById(`btnMiscCastle`).src = `Images/${map[selected.tile].tribeTerrain}/Castle.png`;
        document.getElementById(`btnMiscLevelUp`).style.display = "inline";
        document.getElementById(`btnMiscLevelDown`).style.display = "inline";
        document.getElementById(`btnMiscCastle`).style.display = "inline";
        document.getElementById(`btnMiscWorkshop`).style.display = "inline";
        document.getElementById(`btnMiscWall`).style.display = "inline";
        if(map[selected.tile].hasUnit && map[selected.tile].tribeUnit != map[selected.tile].tribeTerrain) {
            document.getElementById(`btnMisccapture`).style.display = "inline";
        }
        else {
            document.getElementById(`btnMisccapture`).style.display = "none";
        }
    }
    else if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "Buildings"){
        document.getElementById(`btnMiscLevelUp`).style.display = "inline";
        document.getElementById(`btnMiscLevelDown`).style.display = "inline";
        document.getElementById(`btnMiscCastle`).style.display = "none";
        document.getElementById(`btnMiscWorkshop`).style.display = "none";
        document.getElementById(`btnMiscWall`).style.display = "none";
        document.getElementById(`btnMisccapture`).style.display = "none";
    }
    else {
        document.getElementById(`btnMiscLevelUp`).style.display = "none";
        document.getElementById(`btnMiscLevelDown`).style.display = "none";
        document.getElementById(`btnMiscCastle`).style.display = "none";
        document.getElementById(`btnMiscWorkshop`).style.display = "none";
        document.getElementById(`btnMiscWall`).style.display = "none";
        document.getElementById(`btnMisccapture`).style.display = "none";
    }
}
function MiscClick(item) {
    switch (item) {
        case "skull":
            map[selected.tile].hasUnit = false;
            map[selected.tile].UnitSprite.imgElement.style.display = "none";
            attMiscMenu();
        break;
        case "HPUp":

        break;
        case "HPDown":

        break;
        case "HP":

        break;
        case "Veteran":

        break;
        case "capture":
            map[selected.tile].tribeTerrain = map[selected.tile].tribeUnit;
            map[selected.tile].terrainSprite.imgElement.setAttribute("src", `Images/${map[selected.tile].tribeUnit}/${Buttons["Ground"][0]}.png`);
            map[selected.tile].onterrainSprite.imgElement.setAttribute("src", `Images/${map[selected.tile].tribeUnit}/City/City${map[selected.tile].buildingLevel}.png`);
            attMiscMenu();
        break;
        case "LevelUp":
            if(map[selected.tile].buildingLevel < maxLevel[map[selected.tile].onterrain]) {
                map[selected.tile].buildingLevel++;
                if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "Buildings"){
                    map[selected.tile].onterrainSprite.imgElement.setAttribute("src", `Images/Buildings/${Buttons[map[selected.tile].terrain][map[selected.tile].onterrainIndex]}/${Buttons[map[selected.tile].terrain][map[selected.tile].onterrainIndex]}${map[selected.tile].buildingLevel}.png`);
                }
                else if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "City"){
                    map[selected.tile].onterrainSprite.imgElement.setAttribute("src", `Images/${map[selected.tile].tribeTerrain}/City/City${map[selected.tile].buildingLevel}.png`);
                }
            }
        break;
        case "LevelDown":
            if(map[selected.tile].buildingLevel > minLevel[map[selected.tile].onterrain]) {
                map[selected.tile].buildingLevel--;
                if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "Buildings"){
                    map[selected.tile].onterrainSprite.imgElement.setAttribute("src", `Images/Buildings/${Buttons[map[selected.tile].terrain][map[selected.tile].onterrainIndex]}/${Buttons[map[selected.tile].terrain][map[selected.tile].onterrainIndex]}${map[selected.tile].buildingLevel}.png`);
                }
                else if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "City"){
                    map[selected.tile].onterrainSprite.imgElement.setAttribute("src", `Images/${map[selected.tile].tribeTerrain}/City/City${map[selected.tile].buildingLevel}.png`);
                }
            }
        break;
        case "Castle":
            if(map[selected.tile].hasCastle) {
                map[selected.tile].hasCastle = false;
                map[selected.tile].castleSprite.imgElement.style.display = "none";
            }
            else {
                map[selected.tile].hasCastle = true;
                map[selected.tile].castleSprite.imgElement.src = `Images/${map[selected.tile].tribeTerrain}/Castle.png`;
                map[selected.tile].castleSprite.imgElement.style.display = "inline";
            }
        break;
        case "Workshop":
            if(map[selected.tile].hasWorkshop) {
                map[selected.tile].hasWorkshop = false;
                map[selected.tile].workshopSprite.imgElement.style.display = "none";
            }
            else {
                map[selected.tile].hasWorkshop = true;
                map[selected.tile].workshopSprite.imgElement.style.display = "inline";
            }
        break;
        case "Wall":
            if(map[selected.tile].hasWall) {
                map[selected.tile].hasWall = false;
                map[selected.tile].wallSprite.imgElement.style.display = "none";
            }
            else {
                map[selected.tile].hasWall = true;
                map[selected.tile].wallSprite.imgElement.style.display = "inline";
            }
        break;
        default:

        break;
    }
}

function attTribes(tribe) {
    updateTerrainIcon();

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

    if (selected.menu == "Misc" && map[selected.tile].hasUnit == true) {
        map[selected.tile].tribeUnit = selected.tribes;
        map[selected.tile].UnitSprite.imgElement.src = `Images/${selected.tribes}/${map[selected.tile].Unit}.png`;
        attMiscMenu();
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
    adjustMapPosition(document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0, 
                    (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1));
}
function ZoomOut(){
    if(zoomScale - ZOOM_INCREASE > ZOOM_MIN){
        zoomScale -= ZOOM_INCREASE;
    }
    else{
        zoomScale = ZOOM_MIN;
    }
    document.getElementById("mapDiv").style.transform = `scale(${zoomScale})`;
    adjustMapPosition(document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0, 
                    (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1));
}
function zoomWheel(event) {
    event.preventDefault();
    let newZoomScale = zoomScale + event.deltaY * -ZOOM_WHEEL_FACTOR;
    zoomScale = Math.min(Math.max(ZOOM_MIN, newZoomScale), ZOOM_MAX);
    document.getElementById("mapDiv").style.transform = `scale(${zoomScale}, ${zoomScale})`;
    adjustMapPosition(document.getElementById("mapDiv").style.marginLeft.replace("px",'')|0, 
                    (document.getElementById("mapDiv").style.marginTop.replace("px",'')|0) - (window.innerHeight * 0.1));
  }