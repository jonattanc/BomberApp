"use strict";

const sprite_width = 50;
const tile_height = 0.58 * sprite_width;
const tile_width = 0.98 * sprite_width;
const div_height = tile_height * 20.75;
const div_width = tile_width * 20;

const MENU_BG_COLOR = "#0e092c";
const MENU_SELECT_COLOR = "black";

let isMenuOpen = true;
let isSubMenuOpen = true;
let selected = {menu: "None", tribes: "Bardur", terrains: "Clouds", onterrains: "animal"};
let misc = "Miscellaneous";
let menus = ["terrain", "unit", "misc"];
let tribes = ["Bardur", "Luxidoor", "Kickoo", "Zebasi", "Imperius", "Elyrion", "Yadakk", "Hoodrick", "Polaris", "Aimo", "Oumaji", "Quetzali", "Vengir", "Xinxi", "Aquarion"]
let tribesFolder = ["item", "item", "item", "item", "item", "item", "item", "item", "item", "item", "item", "item", "item", "item", "item"]
let tribesOffsetX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let tribesOffsetY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let tribesScale = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let terrains = ["Clouds", "DeepWater", "ShallowWater", "ground", "forestground", "mountain"];
let terrainsFolder = ["misc", "misc", "misc", "selected.tribes", "selected.tribes", "selected.tribes"];
let terrainsOffsetX = [0, 0, 0, 0, 0, 0];
let terrainsOffsetY = [0, 0, 0, 0, 0, 0];
let terrainsScale = [1, 1, 1, 1, 1, 1];
let onterrains = ["animal", "fruit", "crop"];
let onterrainsFolder = ["selected.tribes", "selected.tribes", "misc"];
let onterrainsOffsetX = [0, 0, 0];
let onterrainsOffsetY = [0, 0, 0];
let onterrainsScale = [1, 1, 1];
let mousePos = { };
let marginPos = { };
let mouseScrollListeners = [];
let sprites = [];

onload = function() {
    document.getElementById("mapDiv").style.height = `${div_height}px`;
    document.getElementById("mapDiv").style.width = `${div_width}px`;

    let map = new Array(400);
    for (let x = 20; x >= 1; x--) {
        for (let y = 1; y <= 20; y++) {
            map[getIndex (x , y)] = new Tile(getIndex (x , y));
        }
    }

    tribes.forEach(function (item, index){
        createButton("tribes", item, index, tribesFolder);
        document.getElementById(`btn${item}`).addEventListener('click', function(){
            attTribes(selected.tribes);
        });
    });
    terrains.forEach(function (item, index){
        createButton("terrains", item, index, terrainsFolder);
    });
    onterrains.forEach(function (item, index){
        createButton("onterrains", item, index, onterrainsFolder);
    });

    if(isMenuOpen) {
        isMenuOpen = false;
        menuButtonClick();
    }
    if(isSubMenuOpen) {
        isSubMenuOpen = false;
        terrainsClick();
        if(selected.tribes != "None"){
            document.getElementById(`btn${selected.terrains}`).click();
        }
    }
    document.getElementById(`btn${selected.tribes}`).click();

    addMenuScrollHandlers("mainMenuDiv");
    addMenuScrollHandlers("tribesDiv");
    addMenuScrollHandlers("terrainsDiv");
    addMenuScrollHandlers("onterrainsDiv");
    addMenuScrollHandlers("unitsDiv");
    addMenuScrollHandlers("miscsDiv");
    document.getElementById(`btnterrains`).addEventListener('click', function(){ selectMenu("terrains"); });
    document.getElementById(`btnonterrains`).addEventListener('click', function(){ selectMenu("onterrains"); });
    document.getElementById(`btnunits`).addEventListener('click', function(){ selectMenu("units"); });
    document.getElementById(`btnmiscs`).addEventListener('click', function(){ selectMenu("miscs"); });

    onmouseup = function clickEvent(e) {
        mouseScrollListeners.forEach(function (item, index){
                document.getElementById(item.targetMenu).removeEventListener('mousemove', item.handler);
        });
    }
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

function createButton(menu, item, index, folder){
    let img = document.createElement("img");
    img.setAttribute("id", `btn${item}`);
    img.setAttribute("src", `Images/${ eval(folder[index]) }/${item}.png`);
    img.setAttribute("height", "80%");
    img.addEventListener('click', function(){
        document.getElementById(`btn${selected[menu]}`).style.backgroundColor = MENU_BG_COLOR;
        document.getElementById(`btn${item}`).style.backgroundColor = MENU_SELECT_COLOR;
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
            if(selected.terrains == "ground" || selected.terrains == "forestground" || selected.terrains == "mountain"){
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
        document.getElementById("tribesDiv").style.height = "0%";
        document.getElementById("terrainsDiv").style.height = "0%";
        document.getElementById("onterrainsDiv").style.height = "0%";
        document.getElementById("unitsDiv").style.height = "0%";
        document.getElementById("miscsDiv").style.height = "0%";
        isMenuOpen = false;
    }
    else {
        document.getElementById("mainMenuDiv").style.height = "10%";
        isMenuOpen = true;
    }
}

function selectMenu(newMenuSelection) {
    if(selected.menu == newMenuSelection){
        selected.menu = "None";
        document.getElementById("tribesDiv").style.height = "0%";
        document.getElementById(`${newMenuSelection}Div`).style.height = "0%";
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_BG_COLOR;
        isSubMenuOpen = false;
    }
    else {
        if(selected.menu != "None"){
            document.getElementById(`${selected.menu}Div`).style.height = "0%";
            document.getElementById(`btn${selected.menu}`).style.backgroundColor = MENU_BG_COLOR;
        }
        document.getElementById("tribesDiv").style.height = "10%";
        document.getElementById(`${newMenuSelection}Div`).style.height = "10%";
        document.getElementById(`btn${newMenuSelection}`).style.backgroundColor = MENU_SELECT_COLOR;
        selected.menu = newMenuSelection;
        isSubMenuOpen = true;
    }
}

function terrainsClick() {
    selectMenu("terrains");
}

function onterrainsClick() {
    selectMenu("onterrains");
}

function unitsClick() {
    selectMenu("units");
}

function miscsClick() {
    selectMenu("miscs");
}

function attTribes(tribe) {
    document.getElementById("btnground").src = `Images/${tribe}/ground.png`;
    document.getElementById("btnforestground").src = `Images/${tribe}/forestground.png`;
    document.getElementById("btnmountain").src = `Images/${tribe}/mountain.png`;
    document.getElementById("btnanimal").src = `Images/${tribe}/animal.png`;
    document.getElementById("btnfruit").src = `Images/${tribe}/fruit.png`;
}