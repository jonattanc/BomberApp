"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_border_factor = 0.05;
const div_height = tile_height * 20.75 * (1 + 2 * div_border_factor);
const div_width = tile_width * 20 * (1 + 2 * div_border_factor);

const MENU_BG_COLOR = "#0e092c";
const MENU_SELECT_COLOR = "black";

const imagesUrl = "./frontend/assets/Images/"

const ZOOM_INCREASE = 0.4;
const ZOOM_WHEEL_FACTOR = 0.003;
const ZOOM_MAX = 3.5;
const ZOOM_MIN = 0.25;

const MIN_DRAG_MOVEMENT = 5;

const UNITS_ICON_SCALE = 0.25;
const UNITS_ICON_OFFSET_X = -0.63;
const UNITS_ICON_OFFSET_Y = 0.08;
const VETERAN_SCALE = 0.1;
const VETERAN_OFFSET_X = -0.71;
const VETERAN_OFFSET_Y = -0.13;
const HP_PX = "8px";
const HP_SHADOW = "2px";
const HP_OFFSET_X = -0.2;
const HP_OFFSET_Y = 0.18;

let mapSize = 20;
let map = new Array(400);
let extraBorderSpriteX = new Array(mapSize);
let extraBorderSpriteY = new Array(mapSize);
let isMenuOpen = false;
let isSubMenuOpen = false;
let selected = {menu: "None", tile: 0, players: 0, tribes: "Bardur", color: "Bardur"};
let selectedIndex = {players: 0, tribes: 0, color: 0};
let isSettingsVisible = false;

let players;

let zoomScale = 1;
let map_moving = false;

let binaryTile = new Uint32Array(3);
let binaryPos = 0;

let tribes = ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"];
let minLevel = { City: 1, CustomsHouse: 1, ForestTemple: 1, Forge: 1, IceBank: 1, IceTemple: 1, MountainTemple: 1, 
                    Sanctuary: 1, Sawmill: 1, Temple: 1, WaterTemple: 1, Windmill: 1 };
let maxLevel = { City: 7, CustomsHouse: 5, ForestTemple: 5, Forge: 8, IceBank: 9, IceTemple: 5, MountainTemple: 5, 
                    Sanctuary: 8, Sawmill: 8, Temple: 5, WaterTemple: 5, Windmill: 6 };
let maxHP = {warrior: 10, archer: 10, rider: 10, knight: 15, defender: 15, catapult: 10, swordsman: 15, mindbender: 10, giant: 40, polytaur: 15, dragonegg: 10, 
            mooni: 10, icearcher: 10, battlesled: 15, icefortress: 20, gaami: 30, navalon: 30, babydragon: 15, firedragon: 20, amphibian: 10, tridention: 15, crab: 40};
let veteranPossible = {warrior: true, archer: true, rider: true, knight: true, defender: true, catapult: true, swordsman: true, mindbender: false, giant: false, 
                polytaur: true, dragonegg: false, mooni: false, icearcher: false, battlesled: true, icefortress: true, gaami: false, navalon: false, babydragon: false, 
                firedragon: false, amphibian: true, tridention: true, crab: false};
let Buttons = {
    terrains: ["Clouds", "DeepWater", "ShallowWater", "Ground", "Forest", "Mountain", "Ice"],
    Clouds: ["Clouds", "Rainbow"],
    DeepWater: ["DeepWater", "Ruin", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    ShallowWater: ["ShallowWater", "Fish", "Port", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "WaterTemple", "IceTemple"],
    Ground: ["Ground", "Roads", "Ruin", "Village", "City", "Fruit", "Crop", "Farm", "Windmill", "Sawmill", "CustomsHouse", "Sanctuary", "Forge", "IceBank", "POF", 
            "GOP", "GB", "AOP", "ET", "TOW", "EOG", "Temple"],
    Forest: ["Forest", "Roads", "Ruin", "Animal", "Lumber hut", "Sanctuary", "ForestTemple"],
    Mountain: ["Mountain", "Ruin", "Metal", "Mine", "Sanctuary", "MountainTemple"],
    Ice: ["Ice", "Ruin", "Port", "Fish", "Whale", "Outpost", "IceBank", "POF", "GOP", "GB", "AOP", "ET", "TOW", "EOG", "IceTemple", "WaterTemple"],
    Units: ["warrior", "archer", "rider", "knight", "defender", "catapult", "swordsman", "mindbender", "giant", "polytaur", "dragonegg", "mooni", 
            "icearcher", "battlesled", "icefortress", "gaami", "navalon", "babydragon", "firedragon", "amphibian", "tridention", "crab"],
    FixedMenu: ["ShowMenu", "ZoomIn", "ZoomOut", "Settings"], 
    Misc: ["skull", "HPUp", "HPDown", "HP", "Veteran", "Ice", "capture", "BorderGrow", "LevelUp", "LevelDown", "Castle", "Workshop", "Wall", "ship0", "ship1", "ship2"],
    Resources: ["Chop", "Destruction", "Gather", "Destroy"]
};
let Folders = {
    terrains: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "player.tribe", "player.tribe", "player.tribe", "Miscellaneous"],
    Clouds: ["Miscellaneous", "Miscellaneous"], 
    DeepWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "player.tribe", "player.tribe", "player.tribe", "player.tribe", 
                "player.tribe", "player.tribe", "player.tribe", "Buildings", "Buildings"], 
    ShallowWater: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "player.tribe", "player.tribe", "player.tribe", "player.tribe", 
                    "player.tribe", "player.tribe", "player.tribe", "Buildings", "Buildings"], 
    Ground: ["player.tribe", "Miscellaneous", "Miscellaneous", "Miscellaneous", "City", "player.tribe", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings", 
            "Buildings", "Buildings", "Buildings", "Buildings", "player.tribe", "player.tribe", "player.tribe", "player.tribe", "player.tribe", "player.tribe", 
            "player.tribe", "Buildings"], 
    Forest: ["player.tribe", "Miscellaneous", "Miscellaneous", "player.tribe", "Miscellaneous", "Buildings", "Buildings"], 
    Mountain: ["player.tribe", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "Buildings"],
    Ice: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Buildings", "player.tribe", "player.tribe", 
            "player.tribe", "player.tribe", "player.tribe", "player.tribe", "player.tribe", "Buildings", "Buildings"],
    Units: ["unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", "unit", 
            "unit", "unit", "unit"],
    FixedMenu: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous"],
    Misc: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous", 
            "Miscellaneous", "player.tribe", "Miscellaneous", "Miscellaneous", "unit", "unit", "unit"],
    Resources: ["Miscellaneous", "Miscellaneous", "Miscellaneous", "Miscellaneous"]
};
let OffsetX = { // Positive value moves sprite to the left
    Clouds: [0, -0.2], 
    DeepWater: [0.051, -0.18, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    ShallowWater: [0, -0.15, -0.05, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185], 
    Ground: [0, 0, -0.18, -0.2, 0, -0.12, 0, 0, -0.1, -0.15, -0.28, -0.1, -0.26, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185], 
    Forest: [0, 0, -0.18, -0.35, -0.32, -0.1, -0.185], 
    Mountain: [0.08, -0.18, -0.1, -0.25, -0.1, -0.185],
    Ice: [0, -0.16, -0.05, -0.15, -0.23, -0.31, -0.18, -0.1, -0.08, -0.1, -0.1, -0.08, -0.09, -0.11, -0.185, -0.185],
    Units: [-0.19, -0.12, -0.21, -0.2, -0.2, -0.22, -0.2, -0.17, -0.23, -0.2, -0.19, -0.21, -0.17, -0.2, -0.22, -0.2, -0.18, -0.2, -0.2, -0.21, -0.22, -0.22],
    WaterUnits: [-0.22, -0.2, -0.23],
    Misc: {Castle: -0.4, Workshop: -0.18, Wall: 0, Selection: 0, SelectionSup: 0, Border: -0.01}
};
let OffsetY = { // Positive value moves sprite up // Ice increases about 0.05 from water
    Clouds: [0, 0.1], 
    DeepWater: [-0.06, 0, -0.18, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    ShallowWater: [-0.14, -0.07, -0.12, 0.025, 0.4, 0.04, 0.38, 0.06, 0.19, 0.14, 0.63, 0.2, 0, 0.15], 
    Ground: [-0.07, -0.05, 0.05, -0.1, 0.64, 0.1, 0, 0.03, 0, 0.05, 0.11, 0.4, 0, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, -0.02], 
    Forest: [0.06, 0, 0.03, -0.15, -0.12, 0.4, 0.07], 
    Mountain: [0.2, 0.05, 0.1, -0.15, 0.4, 0.12],
    Ice: [-0.09, 0.02, -0.07, -0.07, -0.18, 0.03, 0.45, 0.08, 0.42, 0.1, 0.23, 0.18, 0.67, 0.24, 0.15, 0],
    Units: [0.27, 0.34, 0.25, 0.25, 0.32, 0.29, 0.32, 0.29, 0.28, 0.32, 0.3, 0.22, 0.29, 0.25, 0.21, 0.2, 0.33, 0.3, 0.3, 0.35, 0.35, 0.36],
    WaterUnits: [0.26, 0.3, 0.19],
    Misc: {Castle: -0.01, Workshop: 0, Wall: 0, Selection: -0.05, SelectionSup: -0.05, Border: 0.01}
}
let Scales = {
    Clouds: [1, 0.6], 
    DeepWater: [1.1, 0.65, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    ShallowWater: [1, 0.75, 0.9, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65], 
    Ground: [1, 1, 0.65, 0.6, 1, 0.8, 1, 1, 0.8, 0.7, 0.45, 0.8, 0.5, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65], 
    Forest: [1, 1, 0.65, 0.35, 0.5, 0.8, 0.65], 
    Mountain: [1.13, 0.65, 0.7, 0.45, 0.8, 0.65],
    Ice: [0.99, 0.65, 0.9, 0.75, 0.55, 0.37, 0.65, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.65, 0.65],
    Units: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    WaterUnits: [0.7, 0.7, 0.7],
    Misc: {Castle: 0.35, Workshop: 0.4, Wall: 1, Selection: 1, SelectionSup: 1, Border: 1}
};

let mousePos = { };
let marginPos = { };
let mouseScrollListeners = [];
let sprites = [];

onload = function() {

    players = new Array(6);
    players[0] = new Player(0, 0);
    players[1] = new Player(1, 1);
    players[2] = new Player(2, 2);
    players[3] = new Player(3, 3);
    players[4] = new Player(4, 4);
    players[5] = new Player(5, 5);

    document.getElementById("mapDiv").style.height = `${div_height}px`;
    document.getElementById("mapDiv").style.width = `${div_width}px`;
    document.getElementById("mapDiv").style.marginTop = `${window.innerHeight * 0.1}px`;

    // Create map as array of tiles
    for (let x = 20; x >= 1; x--) {
        for (let y = 1; y <= 20; y++) {
            map[getIndex (x , y)] = new Tile(getIndex (x , y));
        }
    }
    for(let i = 0; i < mapSize; i++) {
        extraBorderSpriteY[i] = new Sprite(imagesUrl + `Tribes/Aimo/BorderY.png`, getIndex(i + 1, 20), `BorderY${i}`, false);
        extraBorderSpriteY[i].imgElement.setAttribute("width", sprite_width * Scales.Misc.Border);
        extraBorderSpriteY[i].posTop += tile_height / 2;
        extraBorderSpriteY[i].posLeft += tile_width / 2;
        extraBorderSpriteY[i].imgElement.style.top = `${extraBorderSpriteY[i].posTop - sprite_width * OffsetY.Misc.Border}px`;
        extraBorderSpriteY[i].imgElement.style.left = `${extraBorderSpriteY[i].posLeft - sprite_width * OffsetX.Misc.Border}px`;
    }
    for(let i = 0; i < mapSize; i++) {
        extraBorderSpriteX[i] = new Sprite(imagesUrl + `Tribes/Aimo/BorderX.png`, getIndex(1, i + 1), `BorderX${i}`, false);
        extraBorderSpriteX[i].imgElement.setAttribute("width", sprite_width * Scales.Misc.Border);
        extraBorderSpriteX[i].posTop += tile_height / 2;
        extraBorderSpriteX[i].posLeft -= tile_width / 2;
        extraBorderSpriteX[i].imgElement.style.top = `${extraBorderSpriteX[i].posTop - sprite_width * OffsetY.Misc.Border}px`;
        extraBorderSpriteX[i].imgElement.style.left = `${extraBorderSpriteX[i].posLeft - sprite_width * OffsetX.Misc.Border}px`;
    }

    // Create all buttons, except for main menu and players
    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        selected[Object.keys(Buttons)[i]] = Buttons[Object.keys(Buttons)[i]][0];

        for (let j = 0; j < Buttons[Object.keys(Buttons)[i]].length; j++) {
            createButton(Object.keys(Buttons)[i], Buttons[Object.keys(Buttons)[i]][j], j);
        }
    }

    // Create players buttons
    for (let i = 0; i < players.length; i++) {
        createButton("players", i, i);
        document.getElementById(`btnplayers${i}`).addEventListener('click', function(){
            attPlayers(selected.players);
        });
    }

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

    // Create settings menu
    for(let i = 0; i < 6; i++) {
        let field = document.createElement("fieldset");
        field.setAttribute("id", `settingsField${i}`);
        document.getElementById(`settingsDiv`).appendChild(field);
        let legend = document.createElement("legend");
        legend.setAttribute("id", `settingsLegend${i}`);
        legend.innerHTML = `Player ${i+1}`
        field.appendChild(legend);

        let labelTribe = document.createElement("label");
        labelTribe.setAttribute("id", `labelTribe${i}`);
        labelTribe.setAttribute("for", `tribe`);
        labelTribe.innerHTML = "Tribe: ";
        field.appendChild(labelTribe);

        let selectTribe = document.createElement("select");
        selectTribe.setAttribute("id", `selectTribe${i}`);
        selectTribe.setAttribute("name", `tribe${i}`);
        tribes.forEach(function (item, index){
            let option = document.createElement("option");
            option.setAttribute("value", index);
            option.innerHTML = item;
            selectTribe.appendChild(option);
        });
        selectTribe.value = i;
        field.appendChild(selectTribe);

        field.appendChild(document.createElement("br"));

        let labelColor = document.createElement("label");
        labelColor.setAttribute("id", `labelColor${i}`);
        labelColor.setAttribute("for", `color`);
        labelColor.innerHTML = "Color: ";
        field.appendChild(labelColor);

        let selectColor = document.createElement("select");
        selectColor.setAttribute("id", `selectColor${i}`);
        selectColor.setAttribute("name", `color${i}`);
        tribes.forEach(function (item, index){
            let option = document.createElement("option");
            option.setAttribute("value", index);
            option.innerHTML = item;
            selectColor.appendChild(option);
        });
        selectColor.value = i;
        field.appendChild(selectColor);
    }

    // Set main menu and fixed menu click events
    document.getElementById(`btnterrains`).addEventListener('click', function(){ selectMainMenu("terrains"); });
    document.getElementById(`btnonterrains`).addEventListener('click', function(){ selectMainMenu("onterrains"); });
    document.getElementById(`btnUnits`).addEventListener('click', function(){ selectMainMenu("Units"); });
    document.getElementById(`btnMisc`).addEventListener('click', function(){ selectMainMenu("Misc"); attMiscMenu(true); });
    document.getElementById(`btnResources`).addEventListener('click', function(){ selectMainMenu("Resources"); });
    document.getElementById(`btnFixedMenuShowMenu`).addEventListener('click', function(){ menuButtonClick(); });
    document.getElementById(`btnFixedMenuZoomIn`).addEventListener('click', function(){ ZoomIn(); });
    document.getElementById(`btnFixedMenuZoomOut`).addEventListener('click', function(){ ZoomOut(); });
    document.getElementById(`btnFixedMenuSettings`).addEventListener('click', function(){ Settings(); });

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
    document.getElementById(`btnplayers${selectedIndex.players}`).click();



    saveBits(255, 8); // 1111 1111
    saveBits(255, 8); // 1111 1111
    saveBits(255, 8); // 1111 1111
    saveBits(255, 8); // 1111 1111

    saveBits(255, 8); // 1111 1111
    saveBits(255, 8); // 1111 1111
    saveBits(255, 8); // 1111 1111
    saveBits(15, 4); // 1111
    saveBits(43, 6); // 1010 +11
    saveBits(15, 4); // 1111

    binaryPos = 0;

    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(8)}`);

    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(8)}`);
    console.log(`*${binaryPos}: ${loadBits(4)}`);
    console.log(`*${binaryPos}: ${loadBits(6)}`);
    console.log(`*${binaryPos}: ${loadBits(4)}`);
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

    if(menu == "players") {
        img.setAttribute("src", imagesUrl + `Tribes/${players[index].tribe}/${players[index].tribe}.png`);
    }
    else if(Folders[menu][index] == "player.tribe"){
        img.setAttribute("src", imagesUrl + `Tribes/${players[0].tribe}/${item}.png`);
    }
    else if(Folders[menu][index] == "unit"){
        img.setAttribute("src", imagesUrl + `Tribes/${players[0].tribe}/Units/${players[0].color}/${item}.png`);
    }
    else if(Folders[menu][index] == "Buildings"){
        img.setAttribute("src", imagesUrl + `Buildings/${item}/${item}5.png`);
    }
    else if(Folders[menu][index] == "City"){
        img.setAttribute("src", imagesUrl + `Tribes/${players[0].tribe}/City/City7.png`);
    }
    else{
        img.setAttribute("src", imagesUrl + `${Folders[menu][index]}/${item}.png`);
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

class Player {
    constructor(tribeIndex, colorIndex) {
        this.tribeIndex = tribeIndex;
        this.colorIndex = colorIndex;
        this.tribe = tribes[tribeIndex];
        this.color = tribes[colorIndex];
    }
}

class Tile {
    constructor(index) {
        this.index = index;
        this.x = getX(index);
        this.y = getY(index);

        this.terrainIndex = 0; // Terrain type
        this.terrain = "Clouds";
        this.terrainTribeIndex = 0; // Terrain tribe
        this.terrainTribe = "Bardur";

        this.onterrainIndex = 0; // What is on terrain
        this.onterrain = "Clouds";

        this.hasUnit = false; // Has unit
        this.UnitIndex = 0; // Unit
        this.Unit = "";
        this.UnitTribeIndex = 0;
        this.UnitTribe = "Bardur";
        this.UnitColorIndex = 0;
        this.UnitColor = "Bardur";
        this.UnitPlayer = 0; // Player which owns the unit
        this.UnitHP = 10; // Unit HP
        this.UnitIsVeteran = false; // Is unit veteran
        this.UnitIsFrozen = false; // Is unit frozen
        this.shipLevel = 3; // boat, ship, battleship, none

        this.buildingLevel = 1; // Building level
        this.hasCastle = false; // Has city castle
        this.hasWorkshop = false; // Has workshop
        this.hasWall = false; // Has walls

        this.territoryPlayer = 0; // Player who owns the territory
        this.territoryCity = 0; // City index which tile belongs
        this.borderGrow = false; // City has border grow

        this.isColored = false; // Has color mark
        this.coloredIndex = 0; // Color mark index
        this.hasSymbol = false; // Has symbol
        this.symbolIndex = 0; // Symbol index
        this.symbolColor = 0; // Symbol color

        this.hasRoads = false; // Has Roads

        this.terrainSprite = new Sprite(imagesUrl + "Miscellaneous/Clouds.png", index, "terrains", true);
        this.roadSprite = new Array(8);
        for(let i = 0; i < 8; i++) {
            this.roadSprite[i] = new Sprite(imagesUrl + `Miscellaneous/Roads/Roads${i}.png`, index, `Roads${i}`, false);
            this.roadSprite[i].imgElement.setAttribute("width", sprite_width * Scales.Ground[1]);
            this.roadSprite[i].imgElement.style.top = `${this.roadSprite[i].posTop - sprite_width * OffsetY.Ground[1]}px`;
            this.roadSprite[i].imgElement.style.left = `${this.roadSprite[i].posLeft - sprite_width * OffsetX.Ground[1]}px`;
        }

        this.borderXSprite = new Sprite(imagesUrl + `Tribes/Bardur/BorderX.png`, index, `BorderX`, false);
        this.borderXSprite.imgElement.setAttribute("width", sprite_width * Scales.Misc.Border);
        this.borderXSprite.imgElement.style.top = `${this.borderXSprite.posTop - sprite_width * OffsetY.Misc.Border}px`;
        this.borderXSprite.imgElement.style.left = `${this.borderXSprite.posLeft - sprite_width * OffsetX.Misc.Border}px`;
        this.borderYSprite = new Sprite(imagesUrl + `Tribes/Bardur/BorderY.png`, index, `BorderY`, false);
        this.borderYSprite.imgElement.setAttribute("width", sprite_width * Scales.Misc.Border);
        this.borderYSprite.imgElement.style.top = `${this.borderYSprite.posTop - sprite_width * OffsetY.Misc.Border}px`;
        this.borderYSprite.imgElement.style.left = `${this.borderYSprite.posLeft - sprite_width * OffsetX.Misc.Border}px`;

        this.selectionSprite = new Sprite(imagesUrl + "Miscellaneous/Selection.png", index, "Selection", false);
        this.onterrainSprite = new Sprite(imagesUrl + "Miscellaneous/Clouds.png", index, "onterrains", true);
        this.castleSprite = new Sprite(imagesUrl + "Tribes/Bardur/Castle.png", index, "Castle", false);
        this.workshopSprite = new Sprite(imagesUrl + "Miscellaneous/Workshop.png", index, "Workshop", false);
        this.wallSprite = new Sprite(imagesUrl + "Miscellaneous/Wall.png", index, "Wall", false);
        this.UnitSprite = new Sprite(imagesUrl + "Miscellaneous/Clouds.png", index, "Units", false);
        this.selectionSupSprite = new Sprite(imagesUrl + "Miscellaneous/SelectionSup.png", index, "SelectionSup", false);
        this.UnitIconSprite = new Sprite(imagesUrl + "UnitsIcon/Bardur/warrior.png", index, "UnitsIcon", false);
        this.UnitVeteranSprite = new Sprite(imagesUrl + "Miscellaneous/Veteran.png", index, "Veteran", false);

        this.HPtext = document.createElement("p");
        this.HPtext.innerHTML = 10;
        this.HPtext.style.textShadow = `-1px 0 ${HP_SHADOW} black, 1px 0 ${HP_SHADOW} black, 0 -1px ${HP_SHADOW} black, 0 1px ${HP_SHADOW} black`;
        this.HPtext.style.color = "white";
        this.HPtext.style.fontSize = HP_PX;
        this.HPtext.style.position = "absolute"
        this.HPtext.style.top = `${getTop(getX(index) , getY(index)) - sprite_width * HP_OFFSET_Y}px`;
        this.HPtext.style.left = `${getLeft(getX(index) , getY(index)) - sprite_width * HP_OFFSET_X}px`;
        this.HPtext.style.display = 'none';
        document.getElementById("mapDiv").appendChild(this.HPtext);
    }
    updateTerrain(newIndex, tribeIndex) {
        if(this.onterrain == "City") {
            this.removeCity();
        }
        else {
            for (let m = this.x - 1; m <= this.x + 1; m++) {
                for (let n = this.y - 1; n <= this.y + 1; n++) {
                    if(m >= 1 && m <= 20 && n >= 1 && n <= 20){
                            map[getIndex(m, n)].attBorderSprite();
                    }
                }
            }
        }
        this.terrainIndex = newIndex;
        this.terrain = Buttons.terrains[this.terrainIndex];
        this.terrainTribeIndex = tribeIndex;
        this.terrainTribe = tribes[tribeIndex];
        this.buildingLevel = 1;
        this.terrainSprite.redraw("terrains", this.index, this.terrainIndex);
        if (this.terrain == "Clouds") {
            this.updateOnTerrain(0, this.terrainTribeIndex);
        }
    }
    updateOnTerrain(newIndex, tribeIndex) {
        if(this.onterrain == "City") {
            this.removeCity();
        }
        else {
            for (let m = this.x - 1; m <= this.x + 1; m++) {
                for (let n = this.y - 1; n <= this.y + 1; n++) {
                    if(m >= 1 && m <= 20 && n >= 1 && n <= 20){
                            map[getIndex(m, n)].attBorderSprite();
                    }
                }
            }
        }
        this.onterrainIndex = newIndex;
        this.onterrain = Buttons[this.terrain][this.onterrainIndex];
        this.terrainTribeIndex = tribeIndex;
        this.terrainTribe = tribes[tribeIndex];
        this.buildingLevel = 1;
        if (newIndex == 0 && this.terrain != "Clouds") {
            this.onterrainSprite.imgElement.style.display = 'none';
        }
        else {
            this.onterrainSprite.redraw(this.terrain, this.index, this.onterrainIndex);
            this.onterrainSprite.imgElement.style.display = 'inline';
        }
        if(this.onterrain == "City") {
            this.territoryCity = this.index;
            this.territoryPlayer = selected.players;
            this.attCityTerritory(true, false);
        }
    }
    updateUnit(type, newIndex, player) {
        if (type == "") {
            this.UnitSprite.imgElement.style.display = 'none';
            this.UnitIconSprite.imgElement.style.display = 'none';
            this.HPtext.style.display = 'none';
            this.shipLevel = 3;
            this.hasUnit = false;
        }
        else {
            this.UnitIndex = newIndex;
            this.Unit = Buttons[type][newIndex];
            this.UnitTribeIndex = players[player].tribeIndex;
            this.UnitTribe = tribes[this.UnitTribeIndex];
            this.UnitColorIndex = players[player].colorIndex;
            this.UnitColor = tribes[this.UnitColorIndex];
            this.UnitPlayer = player;
            this.UnitIconSprite.imgElement.setAttribute("src", imagesUrl + `UnitsIcon/${this.UnitColor}/${this.Unit}.png`);
            this.UnitHP = maxHP[this.Unit];
            this.HPtext.innerHTML = this.UnitHP;
            this.UnitIconSprite.imgElement.style.display = 'inline';
            this.UnitSprite.imgElement.style.display = 'inline';
            this.HPtext.style.display = 'inline';
            this.hasUnit = true;

            if((this.terrain == "ShallowWater" || this.terrain == "DeepWater") && this.Unit != "navalon" && this.Unit != "babydragon" && 
                this.Unit != "firedragon" && this.Unit != "amphibian" && this.Unit != "tridention" && this.Unit != "crab")
            {
                this.attShip(0, this.UnitPlayer);
            }
            else {
                this.attShip(3, this.UnitPlayer);
                this.UnitSprite.redraw("Units", this.index, newIndex);
            }
        }
        this.attFrozen(false);
        this.attVeteran(false);
    }
    attShip(level, player) {
        this.shipLevel = level;
        if (level != 3) {
            this.UnitSprite.imgElement.setAttribute("src", imagesUrl + `Tribes/${players[player].tribe}/Units/${players[player].color}/ship${level}.png`);
            this.UnitSprite.imgElement.setAttribute("width", sprite_width * Scales.WaterUnits[level]);
            this.UnitSprite.imgElement.style.top = `${this.UnitSprite.posTop - sprite_width * OffsetY.WaterUnits[level]}px`;
            this.UnitSprite.imgElement.style.left = `${this.UnitSprite.posLeft - sprite_width * OffsetX.WaterUnits[level]}px`;
        }
    }
    removeCity() {
        this.borderGrow = false;
        this.hasCastle = false;
        this.hasWorkshop = false;
        this.hasWall = false;
        this.castleSprite.imgElement.style.display = "none";
        this.workshopSprite.imgElement.style.display = "none";
        this.wallSprite.imgElement.style.display = "none";
        this.attCityTerritory(false, true);
    }
    attRoads(value) {
        this.hasRoads = value;
    
        for(let i = getX(this.index) - 1; i <= getX(this.index) + 1; i++){
            if(i >= 1 && i <= 20) {
                for(let j = getY(this.index) - 1; j <= getY(this.index) + 1; j++){
                    if(j >= 1 && j <= 20) { // Update all 3x3 tiles
                        this.attSingleRoad(i, j);
                    }
                }
            }
        }
    }
    attSingleRoad(i, j) {
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
    attBorderSprite() {
        if(this.x == 1) {
            if (this.territoryCity != 0 && this.terrain != "Clouds") {
                extraBorderSpriteX[getY(this.index) - 1].setVisibility(true);
                extraBorderSpriteX[getY(this.index) - 1].imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderX.png`;
            }
            else {
                extraBorderSpriteX[getY(this.index) - 1].setVisibility(false);
            }
        }
        let visibility = false;
        if (this.x + 1 <= 20) {
            if (this.territoryCity != 0) {
                if (this.territoryCity != map[getIndex(this.x + 1, this.y)].territoryCity && this.terrain != "Clouds") {
                    visibility = true;
                    this.borderXSprite.imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderX.png`;
                }
            }
            else if (map[getIndex(this.x + 1, this.y)].territoryCity != 0 && map[getIndex(this.x + 1, this.y)].terrain != "Clouds") {
                visibility = true;
                this.borderXSprite.imgElement.src = imagesUrl + `Tribes/${players[map[getIndex(this.x + 1, this.y)].territoryPlayer].color}/BorderX.png`;
            }
        }
        else if (this.territoryCity != 0) {
            visibility = true;
            this.borderXSprite.imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderX.png`;
        }
        this.borderXSprite.setVisibility(visibility);
        
        if (this.y == 20) {
            if (this.territoryCity != 0 && this.terrain != "Clouds") {
                extraBorderSpriteY[getX(this.index) - 1].setVisibility(true);
                extraBorderSpriteY[getX(this.index) - 1].imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderY.png`;
            }
            else {
                extraBorderSpriteY[getX(this.index) - 1].setVisibility(false);
            }
        }
        visibility = false;
        if (this.y - 1 >= 1) {
            if (this.territoryCity != 0) {
                if (this.territoryCity != map[getIndex(this.x, this.y - 1)].territoryCity && this.terrain != "Clouds") {
                    visibility = true;
                    this.borderYSprite.imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderY.png`;
                }
            }
            else if (map[getIndex(this.x, this.y - 1)].territoryCity != 0 && map[getIndex(this.x, this.y - 1)].terrain != "Clouds") {
                visibility = true;
                this.borderYSprite.imgElement.src = imagesUrl + `Tribes/${players[map[getIndex(this.x, this.y - 1)].territoryPlayer].color}/BorderY.png`;
            }
        }
        else if (this.territoryCity != 0) {
            visibility = true;
            this.borderYSprite.imgElement.src = imagesUrl + `Tribes/${players[this.territoryPlayer].color}/BorderY.png`;
        }
        this.borderYSprite.setVisibility(visibility);
    }
    attCityTerritory(status, setBorderGrow) {
        for (let m = this.x - 2; m <= this.x + 2; m++) {
            for (let n = this.y - 2; n <= this.y + 2; n++) {
                if(m >= 1 && m <= 20 && n >= 1 && n <= 20){
                    if ((status && (m > this.x - 2 && m < this.x + 2 && n > this.y - 2 && n < this.y + 2)) || (status && setBorderGrow)) {
                        if(map[getIndex(m, n)].territoryCity == 0) {
                            map[getIndex(m, n)].territoryCity = this.index;
                            map[getIndex(m, n)].territoryPlayer = this.territoryPlayer;
                        }
                    }
                    else if(map[getIndex(m, n)].territoryCity == this.index) {
                        map[getIndex(m, n)].territoryCity = 0;
                    }
                }
            }
        }

        let l = 2;
        if (setBorderGrow || this.borderGrow) {
            l++;
        }
        for (let m = this.x - l; m <= this.x + l; m++) {
            for (let n = this.y - l; n <= this.y + l; n++) {
                if(m >= 1 && m <= 20 && n >= 1 && n <= 20){
                        map[getIndex(m, n)].attBorderSprite();
                }
            }
        }

        this.borderGrow = setBorderGrow;
    }
    attBuilding(level) {
        if(Folders[this.terrain][this.onterrainIndex] == "Buildings"){
            this.buildingLevel = level;
            this.onterrainSprite.imgElement.setAttribute("src", imagesUrl + `Buildings/${Buttons[this.terrain][this.onterrainIndex]}/${Buttons[this.terrain][this.onterrainIndex]}${this.buildingLevel}.png`);
        }
        else if(Folders[this.terrain][this.onterrainIndex] == "City"){
            this.buildingLevel = level;
            this.onterrainSprite.imgElement.setAttribute("src", imagesUrl + `Tribes/${this.terrainTribe}/City/City${this.buildingLevel}.png`);
        }
    }
    attVeteran(bool) {
        this.UnitIsVeteran = bool;
        if (bool) {
            this.UnitVeteranSprite.imgElement.style.display = 'inline';
        }
        else {
            this.UnitVeteranSprite.imgElement.style.display = 'none';
        }
    }
    attFrozen(bool) {
        this.UnitIsFrozen = bool;
        if (bool) {
            this.UnitSprite.imgElement.style.webkitFilter = "sepia(100%) hue-rotate(190deg) brightness(110%) saturate(400%)";
        }
        else {
            this.UnitSprite.imgElement.style.webkitFilter = "";
        }
    }
    attCastle(bool) {
        this.hasCastle = bool;
        if(bool) {
            this.castleSprite.imgElement.src = imagesUrl + `Tribes/${this.terrainTribe}/Castle.png`;
            this.castleSprite.imgElement.style.display = "inline";
        }
        else {
            this.castleSprite.imgElement.style.display = "none";
        }
    }
    attWorkshop(bool) {
        this.hasWorkshop = bool;
        if(bool) {
            this.workshopSprite.imgElement.style.display = "inline";
        }
        else {
            this.workshopSprite.imgElement.style.display = "none";
        }
    }
    attWall(bool) {
        this.hasWall = bool;
        if(bool) {
            this.wallSprite.imgElement.style.display = "inline";
        }
        else {
            this.wallSprite.imgElement.style.display = "none";
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
        if (type == "UnitsIcon") {
            this.imgElement.setAttribute("width", sprite_width * UNITS_ICON_SCALE);
            this.imgElement.style.top = `${this.posTop - sprite_width * UNITS_ICON_OFFSET_Y}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * UNITS_ICON_OFFSET_X}px`;
        }
        else if (type == "Veteran") {
            this.imgElement.setAttribute("width", sprite_width * VETERAN_SCALE);
            this.imgElement.style.top = `${this.posTop - sprite_width * VETERAN_OFFSET_Y}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * VETERAN_OFFSET_X}px`;
        }
        else if(type == "Roads"){
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
    redraw(menu, index, elmIndex){
        if(Folders[menu][elmIndex] == "player.tribe"){
            this.imgElement.setAttribute("src", imagesUrl + `Tribes/${map[index].terrainTribe}/${Buttons[menu][elmIndex]}.png`);
        }
        else if(Folders[menu][elmIndex] == "unit"){
            this.imgElement.setAttribute("src", imagesUrl + `Tribes/${map[index].UnitTribe}/Units/${map[index].UnitColor}/${Buttons[menu][elmIndex]}.png`);
        }
        else if(Folders[menu][elmIndex] == "Buildings"){
            this.imgElement.setAttribute("src", imagesUrl + `Buildings/${Buttons[menu][elmIndex]}/${Buttons[menu][elmIndex]}${map[index].buildingLevel}.png`);
        }
        else if(Folders[menu][elmIndex] == "City"){
            this.imgElement.setAttribute("src", imagesUrl + `Tribes/${map[index].terrainTribe}/City/City${map[index].buildingLevel}.png`);
        }
        else{
            this.imgElement.setAttribute("src", imagesUrl + `${Folders[menu][elmIndex]}/${Buttons[menu][elmIndex]}.png`);
        }
        if(menu == "terrains"){
            this.imgElement.setAttribute("width", sprite_width * Scales[map[index].terrain][0]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[Buttons[menu][elmIndex]][0]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[Buttons[menu][elmIndex]][0]}px`;
        }
        else {
            this.imgElement.setAttribute("width", sprite_width * Scales[menu][elmIndex]);
            this.imgElement.style.top = `${this.posTop - sprite_width * OffsetY[menu][elmIndex]}px`;
            this.imgElement.style.left = `${this.posLeft - sprite_width * OffsetX[menu][elmIndex]}px`;
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
        console.log(`X: ${x} Y: ${y}`);
        console.log(`Xr: ${rotateX(x, y)} Yr: ${rotateY(x, y)}`);
        console.log(`Xtile: ${Xtile} Ytile: ${Ytile}`);
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
            map[selected.tile].updateTerrain(selectedIndex["terrains"], selectedIndex.tribes);
            map[selected.tile].updateOnTerrain(0, selectedIndex.tribes);
            map[selected.tile].attRoads(false);
        break;
        case "onterrains":
            if(Buttons[selected["terrains"]][selectedIndex[selected["terrains"]]] == "Roads"){
                if(map[selected.tile].terrain != selected["terrains"] || map[selected.tile].terrainTribe != selected.tribes){ // If terrain type is different
                    map[selected.tile].updateTerrain(selectedIndex["terrains"], selectedIndex.tribes); 
                    map[selected.tile].updateOnTerrain(0, selectedIndex.tribes);
                }
                map[selected.tile].attRoads(true);
            }
            else{
                map[selected.tile].updateTerrain(selectedIndex["terrains"], selectedIndex.tribes); 
                map[selected.tile].updateOnTerrain(selectedIndex[selected["terrains"]], selectedIndex.tribes);
                if(map[selected.tile].onterrain == "Village" || 
                    map[selected.tile].onterrain == "City" || 
                    map[selected.tile].onterrain == "Port" || 
                    map[selected.tile].onterrain == "Outpost") {
                    map[selected.tile].attRoads(true);
                }
                else {
                    map[selected.tile].attRoads(false);
                }
            }
        break;
        case "Units":
            map[selected.tile].updateUnit("Units", selectedIndex["Units"], selected.players);
        break;
        case "Misc":
            attMiscMenu(true);
        break;
        case "Resources":
            if(selected.Resources == "Chop" && map[selected.tile].terrain == "Forest") {
                document.getElementById(`btnplayers${map[selected.tile].UnitPlayer}`).click();
                map[selected.tile].terrainIndex = 3;
                map[selected.tile].terrain = Buttons.terrains[3];
                map[selected.tile].terrainSprite.redraw("terrains", selected.tile, 3);
                map[selected.tile].updateOnTerrain(0, map[selected.tile].terrainTribeIndex);
            }
            else if(selected.Resources == "Destruction") {
                map[selected.tile].updateOnTerrain(0, map[selected.tile].terrainTribeIndex);
                map[selected.tile].attRoads(false);
            }
            else if(selected.Resources == "Gather") {
                if(map[selected.tile].onterrain == "Crop") {
                    map[selected.tile].updateOnTerrain(7, map[selected.tile].terrainTribeIndex); // Farm
                }
                else if(map[selected.tile].onterrain == "Forest") {
                    map[selected.tile].updateOnTerrain(4, map[selected.tile].terrainTribeIndex); // Lumber hut
                }
                else if(map[selected.tile].onterrain == "Metal") {
                    map[selected.tile].updateOnTerrain(3, map[selected.tile].terrainTribeIndex); // Mine
                }
                else if(map[selected.tile].onterrain == "Ruin" ||
                        map[selected.tile].onterrain == "Fruit" ||
                        map[selected.tile].onterrain == "Fish" ||
                        map[selected.tile].onterrain == "Whale" ||
                        map[selected.tile].onterrain == "Animal"
                ) {
                    map[selected.tile].updateOnTerrain(0, map[selected.tile].terrainTribeIndex);
                }
            }
            else if(selected.Resources == "Destroy") {
                if(map[selected.tile].onterrain == "Farm") {
                    map[selected.tile].updateOnTerrain(6, map[selected.tile].terrainTribeIndex); // Crop
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
                    map[selected.tile].updateOnTerrain(0, map[selected.tile].terrainTribeIndex);
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
        document.getElementById("playersDiv").style.height = "0%";
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
        document.getElementById("playersDiv").style.height = "10%";
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
        document.getElementById(`btnterrains`).src = imagesUrl + `Tribes/${selected.tribes}/${selected["terrains"]}.png`;
    }
    else {
        document.getElementById(`btnterrains`).src = imagesUrl + `Miscellaneous/${selected["terrains"]}.png`;
    }
}

function attMiscMenu(attTribe) {
    if(map[selected.tile].hasUnit) {
        document.getElementById(`btnMiscskull`).style.display = "inline";
        document.getElementById(`btnMiscHPUp`).style.display = "inline";
        document.getElementById(`btnMiscHPDown`).style.display = "inline";
        document.getElementById(`btnMiscHP`).style.display = "inline";
        document.getElementById(`btnMiscIce`).style.display = "inline";
        if(veteranPossible[map[selected.tile].Unit]){
            document.getElementById(`btnMiscVeteran`).style.display = "inline";
        }
        else {
            document.getElementById(`btnMiscVeteran`).style.display = "none";
        }
        if (attTribe) {
            document.getElementById(`btnplayers${map[selected.tile].UnitPlayer}`).click();
        }
        for(let i = 0; i < 3; i++) {
            if(map[selected.tile].shipLevel == 3 || map[selected.tile].shipLevel == i) {
                document.getElementById(`btnMiscship${i}`).style.display = "none";
            }
            else {
                document.getElementById(`btnMiscship${i}`).style.display = "inline";
            }
        }
    }
    else {
        document.getElementById(`btnMiscskull`).style.display = "none";
        document.getElementById(`btnMiscHPUp`).style.display = "none";
        document.getElementById(`btnMiscHPDown`).style.display = "none";
        document.getElementById(`btnMiscHP`).style.display = "none";
        document.getElementById(`btnMiscIce`).style.display = "none";
        document.getElementById(`btnMiscVeteran`).style.display = "none";
        document.getElementById(`btnMiscship0`).style.display = "none";
        document.getElementById(`btnMiscship1`).style.display = "none";
        document.getElementById(`btnMiscship2`).style.display = "none";
    }
    if(map[selected.tile].onterrain == "City") {
        document.getElementById(`btnMiscCastle`).src = imagesUrl + `Tribes/${map[selected.tile].terrainTribe}/Castle.png`;
        document.getElementById(`btnMiscLevelUp`).style.display = "inline";
        document.getElementById(`btnMiscLevelDown`).style.display = "inline";
        document.getElementById(`btnMiscBorderGrow`).style.display = "inline";
        document.getElementById(`btnMiscCastle`).style.display = "inline";
        document.getElementById(`btnMiscWorkshop`).style.display = "inline";
        document.getElementById(`btnMiscWall`).style.display = "inline";
        if(map[selected.tile].hasUnit && map[selected.tile].UnitPlayer != map[selected.tile].territoryPlayer) {
            document.getElementById(`btnMisccapture`).style.display = "inline";
        }
        else {
            document.getElementById(`btnMisccapture`).style.display = "none";
        }
    }
    else if(Folders[map[selected.tile].terrain][map[selected.tile].onterrainIndex] == "Buildings"){
        document.getElementById(`btnMiscLevelUp`).style.display = "inline";
        document.getElementById(`btnMiscLevelDown`).style.display = "inline";
        document.getElementById(`btnMiscBorderGrow`).style.display = "none";
        document.getElementById(`btnMiscCastle`).style.display = "none";
        document.getElementById(`btnMiscWorkshop`).style.display = "none";
        document.getElementById(`btnMiscWall`).style.display = "none";
        document.getElementById(`btnMisccapture`).style.display = "none";
    }
    else {
        document.getElementById(`btnMiscLevelUp`).style.display = "none";
        document.getElementById(`btnMiscLevelDown`).style.display = "none";
        document.getElementById(`btnMiscBorderGrow`).style.display = "none";
        document.getElementById(`btnMiscCastle`).style.display = "none";
        document.getElementById(`btnMiscWorkshop`).style.display = "none";
        document.getElementById(`btnMiscWall`).style.display = "none";
        document.getElementById(`btnMisccapture`).style.display = "none";
    }
}
function MiscClick(item) {
    switch (item) {
        case "skull":
            map[selected.tile].updateUnit("", 0, selected.players);
            attMiscMenu(false);
        break;
        case "HPUp":
            if (map[selected.tile].UnitHP < maxHP[map[selected.tile].Unit] || 
                (map[selected.tile].UnitHP < maxHP[map[selected.tile].Unit] + 5 && map[selected.tile].UnitIsVeteran)) {
                map[selected.tile].UnitHP++;
                map[selected.tile].HPtext.innerHTML = map[selected.tile].UnitHP;
            }
        break;
        case "HPDown":
            if (map[selected.tile].UnitHP > 1) {
                map[selected.tile].UnitHP--;
                map[selected.tile].HPtext.innerHTML = map[selected.tile].UnitHP;
            }
        break;
        case "HP":
            let max = maxHP[map[selected.tile].Unit];
            if(map[selected.tile].UnitIsVeteran) {
                max += 5;
            }
            let newHP = prompt(`new HP (1 to ${max})`, map[selected.tile].UnitHP);
            if (newHP >= 1 && newHP <= max) {
                map[selected.tile].UnitHP = newHP;
                map[selected.tile].HPtext.innerHTML = map[selected.tile].UnitHP;
            }
        break;
        case "Veteran":
            if(map[selected.tile].UnitIsVeteran) {
                map[selected.tile].UnitHP = maxHP[map[selected.tile].Unit];
                map[selected.tile].attVeteran(false);
            }
            else {
                map[selected.tile].UnitHP = maxHP[map[selected.tile].Unit] + 5;
                map[selected.tile].attVeteran(true);
            }
            map[selected.tile].HPtext.innerHTML = map[selected.tile].UnitHP;
        break;
        case "Ice":
            map[selected.tile].attFrozen(!map[selected.tile].UnitIsFrozen);
        break;
        case "capture":
            map[selected.tile].terrainTribe = map[selected.tile].UnitTribe;
            map[selected.tile].terrainSprite.imgElement.setAttribute("src", imagesUrl + `Tribes/${map[selected.tile].UnitTribe}/${Buttons["Ground"][0]}.png`);
            map[selected.tile].onterrainSprite.imgElement.setAttribute("src", imagesUrl + `Tribes/${map[selected.tile].UnitTribe}/City/City${map[selected.tile].buildingLevel}.png`);
            attMiscMenu(false);
        break;
        case "LevelUp":
            if(map[selected.tile].buildingLevel < maxLevel[map[selected.tile].onterrain]) {
                map[selected.tile].attBuilding(map[selected.tile].buildingLevel + 1);
            }
        break;
        case "LevelDown":
            if(map[selected.tile].buildingLevel > minLevel[map[selected.tile].onterrain]) {
                map[selected.tile].attBuilding(map[selected.tile].buildingLevel - 1);
            }
        break;
        case "BorderGrow":
            map[selected.tile].attCityTerritory(true,  !map[selected.tile].borderGrow);
        break;
        case "Castle":
            map[selected.tile].attCastle(!map[selected.tile].hasCastle);
        break;
        case "Workshop":
            map[selected.tile].attWorkshop(!map[selected.tile].hasWorkshop);
        break;
        case "Wall":
            map[selected.tile].attWall(!map[selected.tile].hasWall);
        break;
        case "ship0":
            map[selected.tile].attShip(0, map[selected.tile].UnitPlayer);
            attMiscMenu(false);
        break;
        case "ship1":
            map[selected.tile].attShip(1, map[selected.tile].UnitPlayer);
            attMiscMenu(false);
        break;
        case "ship2":
            map[selected.tile].attShip(2, map[selected.tile].UnitPlayer);
            attMiscMenu(false);
        break;
        default:

        break;
    }
}

function attPlayers(index) {
    selectedIndex.tribes = players[index].tribeIndex;
    selected.tribes = players[index].tribe;
    selectedIndex.color = players[index].colorIndex;
    selected.color = players[index].color;

    updateTerrainIcon();

    for (let i = 0; i < Object.keys(Buttons).length; i++) { 
        if(Object.keys(Buttons)[i] != "tribes"){
            for (let j = 0; j < Buttons[Object.keys(Buttons)[i]].length; j++) {
                if(Folders[Object.keys(Buttons)[i]][j] == "player.tribe"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = imagesUrl + `Tribes/${players[index].tribe}/${Buttons[Object.keys(Buttons)[i]][j]}.png`;
                }
                else if(Folders[Object.keys(Buttons)[i]][j] == "unit"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = imagesUrl + `Tribes/${players[index].tribe}/Units/${players[index].color}/${Buttons[Object.keys(Buttons)[i]][j]}.png`;
                }
                else if(Folders[Object.keys(Buttons)[i]][j] == "City"){
                    document.getElementById(`btn${Object.keys(Buttons)[i]}${Buttons[Object.keys(Buttons)[i]][j]}`).src = imagesUrl + `Tribes/${players[index].tribe}/City/City7.png`;
                }
            }
        }
    }

    if (selected.menu == "Misc" && map[selected.tile].hasUnit == true) {
        map[selected.tile].UnitTribeIndex = selectedIndex.tribes;
        map[selected.tile].UnitTribe = selected.tribes;
        map[selected.tile].UnitColorIndex = selectedIndex.color;
        map[selected.tile].UnitColor = selected.color;
        map[selected.tile].UnitPlayer = selected.players;
        if(map[selected.tile].shipLevel != 3) {
            map[selected.tile].attShip(map[selected.tile].shipLevel, map[selected.tile].UnitPlayer);
        }
        else {
            map[selected.tile].UnitSprite.imgElement.src = imagesUrl + `Tribes/${selected.tribes}/Units/${selected.color}/${map[selected.tile].Unit}.png`;
        }
        attMiscMenu(false);
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
function Settings() {
    if(isSettingsVisible) {
        isSettingsVisible = false;
        document.getElementById(`settingsDiv`).style.display = 'none';
        document.getElementById(`mapDiv`).style.display = 'inline';

        for(let i = 0; i < 6; i++) {
            if(document.getElementById(`selectTribe${i}`).value != players[i].tribeIndex){
                players[i].tribeIndex = document.getElementById(`selectTribe${i}`).value;
                players[i].tribe = tribes[players[i].tribeIndex];
                document.getElementById(`btnplayers${i}`).setAttribute("src", imagesUrl + `Tribes/${players[i].tribe}/${players[i].tribe}.png`);
            }
            if(document.getElementById(`selectColor${i}`).value != players[i].colorIndex){
                players[i].colorIndex = document.getElementById(`selectColor${i}`).value;
                players[i].color = tribes[players[i].colorIndex];
            }
        }
    }
    else {
        isSettingsVisible = true;
        document.getElementById(`settingsDiv`).style.display = 'inline';
        document.getElementById(`mapDiv`).style.display = 'none';
    }
}

function updateAllTiles(index) {
    
}
function updateSingleTile(index) {
    loadTile(index);
    map[index].attSingleRoad(getX(index), getY(index));
}
function saveTile(index) {
    binaryPos = 0;

    saveBits(map[index].terrainIndex, 3);
    saveBits(map[index].terrainTribeIndex, 5);

    saveBits(map[index].onterrainIndex, 5);

    saveBits(map[index].hasUnit, 1);
    saveBits(map[index].UnitIndex, 5);
    saveBits(map[index].UnitPlayer, 5);
    saveBits(map[index].UnitHP, 6);
    saveBits(map[index].UnitIsVeteran, 1);
    saveBits(map[index].UnitIsFrozen, 1);
    saveBits(map[index].shipLevel, 2);

    saveBits(map[index].buildingLevel, 4);
    saveBits(map[index].hasCastle, 1);
    saveBits(map[index].hasWorkshop, 1);
    saveBits(map[index].hasWall, 1);

    saveBits(map[index].territoryPlayer, 5);
    saveBits(map[index].territoryCity, 10);
    saveBits(map[index].borderGrow, 1);

    saveBits(map[index].isColored, 1);
    saveBits(map[index].coloredIndex, 5);
    saveBits(map[index].hasSymbol, 1);
    saveBits(map[index].symbolIndex, 5);
    saveBits(map[index].symbolColor, 5);

    saveBits(map[index].hasRoads, 1);
}
function loadTile(index) {
    binaryPos = 0;

    map[index].terrainIndex = loadBits(3);
    map[index].terrainTribeIndex = loadBits(5);

    map[index].onterrainIndex = loadBits(5);
    map[index].updateTerrain(map[index].terrainIndex, map[index].terrainTribeIndex);
    map[index].updateOnTerrain(map[index].onterrainIndex, map[index].terrainTribeIndex);

    map[index].hasUnit = loadBits(1);
    map[index].UnitIndex = loadBits(5);
    map[index].UnitPlayer = loadBits(5);
    if (map[index].hasUnit) {
        map[index].updateUnit("Units", map[index].UnitIndex, map[index].UnitPlayer);
    }
    else {
        map[index].updateUnit("", 0, map[index].UnitPlayer);
    }
    map[index].UnitHP = loadBits(6);
    map[index].HPtext.innerHTML = map[index].UnitHP;
    map[index].attVeteran(loadBits(1));
    map[index].attFrozen(loadBits(1));
    map[index].attShip(loadBits(2), map[index].UnitPlayer);

    map[index].attBuilding(loadBits(4));
    map[index].attCastle(loadBits(1));
    map[index].attWorkshop(loadBits(1));
    map[index].attWall(loadBits(1));

    map[index].territoryPlayer = loadBits(5);
    map[index].territoryCity = loadBits(10);
    map[index].borderGrow = loadBits(1);

    map[index].isColored = loadBits(1);
    map[index].coloredIndex = loadBits(5);
    map[index].hasSymbol = loadBits(1);
    map[index].symbolIndex = loadBits(5);
    map[index].symbolColor = loadBits(5);

    map[index].hasRoads = loadBits(1);
}
function saveBits(data, size) {

    if (Math.floor(binaryPos/32) != Math.floor((binaryPos + size)/32)) {

        let overflow = (binaryPos + size) % 32;
        let data1 = data >> overflow;
        binaryTile[Math.floor(binaryPos/32)] |= data1;

        data = data ^ (data1 << overflow);
        binaryPos += size - overflow;
        size = overflow;
    }

    binaryTile[Math.floor(binaryPos/32)] |= data << (Math.ceil(binaryPos/32) * 32 - size - binaryPos);
    binaryPos += size;
}
function loadBits(size) {
    let data = 0;

    if (Math.floor(binaryPos/32) != Math.floor((binaryPos + size)/32) && (binaryPos + size) % 32 != 0) {
        let overflow = (binaryPos + size) % 32;

        let selector = 0xFFFFFFFF >>> (binaryPos % 32);
        data |= (binaryTile[Math.floor(binaryPos/32)] & selector) << overflow;

        binaryPos += size - overflow;
        size = overflow;
    }

    let selector = 0xFFFFFFFF >>> (binaryPos % 32);
    data |= (binaryTile[Math.floor(binaryPos/32)] & selector) >>> (Math.ceil(binaryPos/32) * 32 - size - binaryPos);

    binaryPos += size;
    return data;
}