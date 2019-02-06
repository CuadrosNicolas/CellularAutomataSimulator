"use strict";

var canvas;
var context;

var WIDTH;
var HEIGHT;
    var newScript;
var nbCaseX;
var nbCaseY;

var mainGrid;
var gridNext;

var automaStateList;
var button;
var isLancer;

var updateHandler;
var drawHandler;
var isLaunched;


var generationInput;
var vitesseInput;
var sizeXInput;
var sizeYInput;
var automatTypeInput;
var seuilInput;
var gridTypeInput;
var clickTypeInput;

var enreNomInput;
var gridDescriptionList;

var updateGridFunction;
var actualGridDescription;
var DESCRIPTION;

var enregistrement;
var enregistrement_clic;

var posX1Input;
var posY1Input;

var posX2Input;
var posY2Input;

var zoneJava;
var actualAutomaClickChoice;

var printGrid = true;
var buttonPrint;

//fonction de base
function loadScript(url, callback)
{
    // Prépare l'ajoute du script au head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
 
    // Lance une callback à la fin de la tâche
    script.onreadystatechange = callback;
    script.onload = callback;
 
    // Ajoute le script
    head.appendChild(script);
}
function getClickType()
{
 return clickTypeInput.options[clickTypeInput.selectedIndex].text   
}
function updateList()
{
    clearAutomatSelect();
    if(getClickType() == "Automate")
        {
          for(var i =0;i<actualGridDescription.automaStateArray.length
           ;i++)
            {  
                var newOption = new Option(actualGridDescription.automaStateArray[i],actualGridDescription.automaStateArray[i]);
                automatTypeInput.options.add(newOption);
            }           
        }

        else
        {
             for(var i =0;i<actualGridDescription.formList.length
           ;i++)
            {  
                var newOption = new Option(actualGridDescription.formList[i],actualGridDescription.formList[i]);
                automatTypeInput.options.add(newOption);
            }           
        }     

}
function genererJava()
{
        zoneJava.textContent = genererJavaText();
}
function genererJavaText()
{
    var posX1  = parseInt(posX1Input.value,10);
    var posX2 = parseInt(posX2Input.value,10);
    
    var posY1 = parseInt(posY1Input.value,10);
    var posY2 = parseInt(posY2Input.value,10);
    
    var name = enreNomInput.value;
    
    var TEXT = "var tempF = new form('"+name+"',"+posX1+","+posY1+","+posX2+","+posY2+"); \n";
    
    for(var i = 0;i<=posX2-posX1;i++)
        {
            for(var j = 0;j<=posY2-posY1;j++)
                {
                    console.log(i+posX1  +"   " + j+posY1);
                    TEXT += "   tempF.ARRAY["+i+"]["+j+"] = '"+getState(i+posX1,j+posY1,mainGrid)+"'; \n ";

                }
        }
    TEXT += "addForm(tempF,gridDescriptionList['"+actualGridDescription.name+"']);";
    return TEXT;
    
}
function enregistrer()
{
    var script = '<script type="text/javascript">'+ genererJavaText() + '</script>';
    stripAndExecuteScript(script);
    updateList();
}

//change une forme
function changeFormAt(clickPosX,clickPosY,state)
{
    for(var i = 0;i<state.length;i++)
        {
            for(var j=0;j<state[i].length;j++)
                {
                changeCase(clickPosX+i,clickPosY+j,mainGrid,state[i][j]);                
                }
        }
}
function form(name,posX1,posY1,posX2,posY2)
{
    this.name = name;
    this.ARRAY = new Array();
    for(var i = 0;i<=posX2-posX1;i++)
        {
            this.ARRAY[i] = new Array;
            for(var j = 0;j<=posY2-posY2;j++)
                {
                    console.log(this.ARRAY[i][j]);
                }
        }
}
function addForm(FA,gridD)
{
    gridD.formList.push(FA.name);
    gridD.formArray[FA.name] = FA;
}
function lancer_enregistrer()
{
    enregistrement=true;
    enregistrement_clic=0;
}
function printGridFunc()
{
    if(printGrid)
        {
        printGrid=false;
            buttonPrint.textContent = "Afficher grille";
        }
    else
        {
        printGrid=true;
            buttonPrint.textContent = "Enlever grille";
        }
}












function include(fileName){
  document.write("<script type='text/javascript' src='"+fileName+"'></script>" );
}
//renvoie une copy de l'objet obj
function clone(obj)
{
    try
        {
           var copy = JSON.parse(JSON.stringify(obj));
        }
    catch(ex)
        {
            alert(ex.message);
        }
    return copy;
}
//renvoie un entier comprit entre 0 et 100 de façon speudo aléatoire
function getRandom()
{
    return Math.random()*100;   
}
//excécute une chaîne de caractère en tant qu'un script javascript
function stripAndExecuteScript(text) {
    var scripts = '';
    var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
        scripts += arguments[1] + '\n';
        return '';
    });

    if (window.execScript){
        window.execScript(scripts);
    } else {
        var head = document.getElementsByTagName('head')[0];
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.innerText = scripts;
        head.appendChild(scriptElement);
        head.removeChild(scriptElement);
    }
    return cleaned;
}
//excécute la zone de texte en tant javascript
function executeCodeZone()
{
    var textElement = document.getElementById('ZoneText');
    var script = '<script type="text/javascript">';
    script += textElement.value;
    script += '</script><strong>test</strong>';
    console.log(textElement.textContent);
    stripAndExecuteScript(script);
}

//vide la liste de type d'automate utiliser lors du clic de souris
function clearAutomatSelect()
{
        for(var i = automatTypeInput.options.length - 1 ; i >= 0 ; i--)
    {
        automatTypeInput.remove(i);
    }
}
//renvoie le seuil d'aléatoire de l'input
function getSeuil()
{
  return seuilInput.value;  
}
//renvoie le type de grille chosit par l'utilisateur
function getGridType()
{
    return gridTypeInput.options[gridTypeInput.selectedIndex].text;
}
//renvoie le type d'automate selectionné par l'utilisateur
function getSelectedAutomat()
{
    return automatTypeInput.options[automatTypeInput.selectedIndex].text;
}
function getGenerationInput()
{
    return generationInput.value;
}
//rajoute un type de grille au choix du type de grille
function addGridType(name)
{
    var newOption = new Option(name,name);
    gridTypeInput.options.add(newOption);
}
//change une case
function changeCaseAt(clickPosX,clickPosY,state)
{
    var x = Math.floor(clickPosX/mainGrid.caseSizeX);
    var y = Math.floor(clickPosY/mainGrid.caseSizeY);
    changeCase(x,y,mainGrid,state);
}
//fonction lors du clic de souris dans le canvas
function gridClick(el,event){
        var coords = getCoords(el,event);
    changeCaseAt(coords.x,coords.y,getSelectedAutomat());
}
function getCoords(el,event) {
  var ox = -el.offsetLeft,
  oy = -el.offsetTop;
  while(el=el.offsetParent){
    ox += el.scrollLeft - el.offsetLeft;
    oy += el.scrollTop - el.offsetTop;
  }
  return {x:event.clientX + ox , y:event.clientY + oy};
}
 
 
// Exemple d'utilisation :
 


//rempli le canvas d'une couleur blanche
function clear()
{
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,255)";
    context.moveTo(0,0);
    context.lineTo(WIDTH,0);
    context.lineTo(WIDTH,HEIGHT);
    context.lineTo(0,HEIGHT);
    context.lineTo(0,0);
    context.fill();
    context.closePath();
}



//definition automate
function automateType(color,state,v)
{
    this.color = color;
    this.state = state;
    this.value = v;
}
//definition case de la grille
function gridCase(posX,posY,sizeX,sizeY,autoType)
{
    this.conteinedAutomat = new automateType("rgba(255,0,255,255)","DEAD",0);
    this.conteinedAutomat = automaStateList[autoType];
    this.posX = posX;
    this.posY = posY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
}
//definition de la grille
function grid(sizeX,sizeY)
{
    this.caseSizeX = WIDTH/sizeX;
    this.caseSizeY = HEIGHT/sizeY;
    this.ID = 0;
    this.caseGrid = new Array();
    for(var i =0;i<sizeX;i++)
        this.caseGrid[i] = new Array();
    for(var i = 0;i<sizeX;i++)
    {
        for(var j=0;j<sizeY;j++)
        {
            this.caseGrid[i][j] = new gridCase(i*this.caseSizeX,j*this.caseSizeY,this.caseSizeX,this.caseSizeY,"DEAD");
        }
    }
    this.size = new Object();
    this.sizeX =sizeX;
    this.sizeY = sizeY;
}
//definition de la description de grille
function gridDescription(updateFunction,aleatFunction,automaStateArray,automaColorArray,automaValueArray,name,description)
{
    this.updateFunction = updateFunction;
    this.aleatFunction = aleatFunction;
    this.automaStateArray = new Array();
    this.automaStateArray = automaStateArray;

    this.automaColorArray = new Array();
    this.automaColorArray = automaColorArray;

    this.automaValueArray = new Array();
    this.automaValueArray = automaValueArray;
    
    this.name = name;
    this.description = description;
    
    
    
    
    this.formArray = new Object();
    this.formList = new Array();
    
    
}
//fonction relative à une grille
function clearGrid(GRID,state)
{
      for(var i = 0;i<GRID.sizeX;i++)
    {
        for(var j=0;j<GRID.sizeY;j++)
        {
            GRID.caseGrid[i][j].conteinedAutomat = automaStateList[state];
        }
    }  
}
//renvoie l'automate situé dans la case (x,y) de la grille GRID
function getAuto(x,y,GRID)
{
    var TEMP;
    if(x<0 || y<0 || x>=GRID.sizeX || y>=GRID.sizeY)
        TEMP = 0;
    else
        TEMP = GRID.caseGrid[x][y].conteinedAutomat.value;
    
    return TEMP;
}
//renvoie l'état de l'automate situé dans la case (x,y) de la grille GRID
function getState(x,y,GRID)
{
    var TEMP;
    if(x<0 || y<0 || x>=GRID.sizeX || y>=GRID.sizeY)
        TEMP = 0;
    else
        TEMP = GRID.caseGrid[x][y].conteinedAutomat.state;
    
    return TEMP;
}
//change l'état de l'automate situé dans la case (x,y) de la grille GRID
function changeCase(x,y,GRID,STATE)
{
    if(x<0 || y<0 || x>=GRID.sizeX || y>=GRID.sizeY)
        return 0;
    else
        GRID.caseGrid[x][y].conteinedAutomat = automaStateList[STATE];
}
//renvoi la somme des voisins en état "state" en réalisant la somme de leurs valeurs
function nbVoisin(i,j,GRID,state)
{
    var out = 0;
    for(var x=i-1;x<=i+1;x=x+1)
        {
            for(var y = j-1;y<=j+1;y=y+1)
                {
                    if(!(x==i && y==j) && state==getState(x,y,GRID))
                        {
                                out+=1;
                        }
                }
        }
    return out;
}
function nbVoisinValue(i,j,GRID,value){
    var out = 0;
    for(var x=i-1;x<=i+1;x=x+1)
        {
            for(var y = j-1;y<=j+1;y=y+1)
                {
                    if(!(x==i && y==j) && getAuto(x,y,GRID))
                        {
                                out+=1;
                        }
                }
        }
    return out;
}

//DESSIN
function drawGridLine(sizeX,sizeY)
{
    var echantX = WIDTH/sizeX;
    var echantY = HEIGHT/sizeY;
    context.beginPath();
    for(var y=0;y<=HEIGHT;y+=echantY)
        {
            context.moveTo(0,y);
            context.lineTo(WIDTH,y);
        }
    for(var x =0;x<=WIDTH;x+= echantX)
        {
            context.moveTo(x,0);
            context.lineTo(x,HEIGHT);
        }
    context.stroke();
    context.closePath();
    
}
//dessine une case CASE
function drawCase(CASE)
{
    context.beginPath();
    context.fillStyle = CASE.conteinedAutomat.color;
    context.moveTo(CASE.posX,CASE.posY);
    context.lineTo(CASE.posX+CASE.sizeX,CASE.posY);
    context.lineTo(CASE.posX+CASE.sizeX,CASE.posY + CASE.sizeY);
    context.lineTo(CASE.posX,CASE.posY+CASE.sizeY);
    context.fill();
    context.closePath();
}
//dessine une grille
function drawGrid(GRID)
{
    for(var i=0;i<GRID.sizeX;i++)
    {
        for(var j=0;j<GRID.sizeY;j++)
            {
                drawCase(GRID.caseGrid[i][j]);
            }
    }
}
//dessine la grille principale puis ses bordures
function draw()
{
    drawGrid(mainGrid);
    if(printGrid)
    drawGridLine(mainGrid.sizeX,mainGrid.sizeY);
}



///DEFINITION DES FONCTIONS D'AUTOMATE
function aleatGameOfLife()
{
    for(var i = 0;i<mainGrid.sizeX;i++)
        {
            for(var j = 0;j<mainGrid.sizeY;j++)
                {
                    var STATE = "";
                    var temp = getRandom();
                    if(temp > getSeuil())
                        STATE = "ALIVE";
                    else
                        STATE = "DEAD";
                    changeCase(i,j,mainGrid,STATE)
                }
        }
}
function updateAsGameOfLife()
{
    
    gridNext = clone(mainGrid);
      for(var i = 0;i<mainGrid.sizeX;i++)
    {
        for(var j=0;j<mainGrid.sizeY;j++)
        {
           var sum = 0;
            var s = getState(i,j,mainGrid);
            if(s!=0)
                {
            if(getState(i,j,mainGrid) == "DEAD")
                {
                    sum = nbVoisin(i,j,mainGrid,"ALIVE");
                    if(sum == 3)
                        {
                            changeCase(i,j,gridNext,"ALIVE");
                        }


                }
                else
                    {
                    
                    sum = nbVoisin(i,j,mainGrid,"ALIVE");
                        if(sum < 2 || sum > 3)
                            {
                                changeCase(i,j,gridNext,"DEAD");                            
                            }
                    }
                }
        }
    }
    mainGrid = clone(gridNext);
}
function aleatWireWorld()
{
    for(var i = 0;i<mainGrid.sizeX;i++)
        {
            for(var j = 0;j<mainGrid.sizeY;j++)
                {
                    var STATE = "VIDE";
                    changeCase(i,j,mainGrid,STATE)
                }
        }    
}
function updateAsWireWorld()
{
    
    gridNext = clone(mainGrid);
      for(var i = 0;i<mainGrid.sizeX;i++)
    {
        for(var j=0;j<mainGrid.sizeY;j++)
        {
           var sum = 0;
            var s = getState(i,j,mainGrid);
            if(s!=0)
                {
            if(getState(i,j,mainGrid) == "CONDUCTEUR")
                {
                    sum = nbVoisin(i,j,mainGrid,"TETE");
                    if(sum == 1 || sum==2)
                        {
                            changeCase(i,j,gridNext,"TETE");
                        }
                }
            if(getState(i,j,mainGrid) == "TETE")
                {
                            changeCase(i,j,gridNext,"QUEUE");
                }
            if(getState(i,j,mainGrid) == "QUEUE")
                {
                            changeCase(i,j,gridNext,"CONDUCTEUR");
                }
                    
                }
        }
    }
    mainGrid = clone(gridNext);
}

function UpdateGameoflifeMaj(){
    gridNext = clone(mainGrid)
    for(var i=0; i<mainGrid.sizeX;i++){
        for(var j=0; j<mainGrid.sizeY;j++){
            var sum = 0;
            var s = getState(i,j,mainGrid);
            if(s!=0){
                sum=nbVoisin(i,j,mainGrid, "ALIVE");
                if(sum>4){
                    changeCase(i,j,gridNext,"ALIVE");
                }
                else if(sum<4){
                    changeCase(i,j,gridNext,"DEAD");
                }
            }
        }
    }
    mainGrid=clone(gridNext);
}

function UpdateQuadLife(){
    gridNext = clone(mainGrid);
    for(var i=0; i<mainGrid.sizeX;i++){
        for(var j=0; j<mainGrid.sizeY; j++){
            var sum1=0;
            var sum2=0;
            var sum3=0;
            var sum4=0;
            var sumAlive=0;
            var s = getState(i,j,mainGrid);
            var n = getAuto(i,j,mainGrid);
            if(s!=0){
                if( n==1 ){
                    sumAlive=nbVoisinValue(i,j,mainGrid,1);
                    if(sumAlive!=2 && sumAlive!= 3){
                        changeCase(i,j,gridNext,"DEAD")
                    }
                }
                if(n==0){
                    sumAlive=nbVoisinValue(i,j,mainGrid,1);
                    if(sumAlive==3){
                        sum1=nbVoisin(i,j,mainGrid,"ALIVE_YELLOW");
                        sum2=nbVoisin(i,j,mainGrid,"ALIVE_RED");
                        sum3=nbVoisin(i,j,mainGrid,"ALIVE_GREEN");
                        sum4=nbVoisin(i,j,mainGrid,"ALIVE_BLUE");
                        if(sum1>1){changeCase(i,j,gridNext,"ALIVE_YELLOW")}
                        else if(sum2>1){changeCase(i,j,gridNext,"ALIVE_RED")}
                        else if(sum3>1){changeCase(i,j,gridNext,"ALIVE_GREEN")}
                        else if(sum4>1){changeCase(i,j,gridNext,"ALIVE_BLUE")}
                        else if(sum1==0){changeCase(i,j,gridNext,"ALIVE_YELLOW")}
                        else if(sum2==0){changeCase(i,j,gridNext,"ALIVE_RED")}
                        else if(sum3==0){changeCase(i,j,gridNext,"ALIVE_GREEN")}
                        else if(sum4==0){changeCase(i,j,gridNext,"ALIVE_BLUE")}
                    }
                }
            }
        }
    }
    mainGrid=clone(gridNext)
}

function aleatQuadLife(){
    for(var i = 0;i<mainGrid.sizeX;i++)
        {
            for(var j = 0;j<mainGrid.sizeY;j++)
                {
                    var STATE = "";
                    var temp = getRandom();
                    var temp2= getRandom();
                    if(temp > getSeuil()){
                        if(temp2>75){
                            STATE="ALIVE_YELLOW";
                        }else if(temp2<=75 && temp2>50){
                            STATE="ALIVE_GREEN";
                        }else if(temp2<=50 && temp2>25){
                            STATE="ALIVE_RED";
                        }else{
                            STATE="ALIVE_BLUE";
                        }
                    }
                    else{
                        STATE = "DEAD";
                    }
                    changeCase(i,j,mainGrid,STATE)
                }
        }
}

///FONCTION DE GESTION
function lancer()
{
    if(isLaunched==false)
        {
    updateHandler = setInterval(updateGRID,vitesseInput.value);
            isLaunched=true;
            button.textContent = "STOPER";
        }
    else
        {
           clearInterval(updateHandler);
            isLaunched=false;
        button.textContent = "LANCER";
        }
}
//passe un nombre i(entree dans le menu par l'utilisateur) de generation à la grille
function passer()
{
    if(isLaunched)
        {
            lancer();
        }
    var gen = getGenerationInput();
    for(var i= 0;i<gen;i++)
        updateGRID();
        
}
//remplie la grille de la valeur par défaut(premier type déclaré) du type de grille choisit
function effacer()
{
    clearGrid(mainGrid,actualGridDescription.automaStateArray[0]);
}
//remplie la grille avec la fonction d'aleatoire de sa description
function ALEAT()
{
    actualGridDescription.aleatFunction();
}
//met à jour la grille avec la fonction de mise à jour de sa description
function updateGRID()
{
    actualGridDescription.updateFunction();
}


//dessine les différents composants du canvas
function updateFrame()
{
    clear();
    draw();
}



//definit les différentes descriptions de grille
function defineGridDescription()
{

    //definition du game of life
    var temp = ["DEAD","ALIVE"];
    var tempColor=["rgba(255,255,255,255)","rgba(0,0,0,255)"];
    var tempValue=[0,1];
    
    var name = "game of life";
    var descriptionG = "<text>Jeu de la vie : </br>Etats  </br></text><ul ><li >Mort (case blanche)</li><li >Vivant (case noir)</li></ul><text>Regles </br></text><ul ><li >Une cellule morte possedant exactement trois voisines vivantes devient vivante (elle nait).</li><li >Une cellule vivante possedant deux ou trois voisines vivantes le reste, sinon elle meurt.</li></ul> <text>fonction aleatoire : genere une grille avec des cellules soit mortes soit vivantes selon le seuil</br></text><text><a href='https://fr.wikipedia.org/wiki/Jeu_de_la_vie'>Lien utile</a> </br></text>";
                    
                    
                    
    gridDescriptionList[name] = new gridDescription(updateAsGameOfLife,aleatGameOfLife,temp,tempColor,tempValue,name,descriptionG);  
    addGridType(name);
    


    //definition wireWorld
    var tempW = ["VIDE","CONDUCTEUR","TETE","QUEUE"];
    var tempColorW = ["rgba(255,255,255,255)","rgba(0,255,0,255)","rgba(0,0,255,255)","rgba(255,0,0,255)"];
    var tempValueW = [0,0,1,0];
    var nameW="wire world";
    var descriptionW = "<text>Wireworld :</br>Cet automate a pour bute de simuler les comportements de differents composants electroniques</br> </br> Etats : </text><ul><li>Vide (case blanche</li><li>Conducteur (case verte)</li><li>Tete d'electron (bleu)</li><li>Queue d'electron (rouge)</li></ul><text>Regles : </text><ul><li>Une cellule vide reste vide</li><li>Une tete d'électron devient une queue d'electron</li><li>Une queue d'electron devient un conducteur</li><li>Un conducteur devient une tete d'electron si une ou deux des cellules voisines sont des tetes d'electron.</li></ul><text>fonction aleatoire : rempli la grille de case vide </br></text><text><a href='https://fr.wikipedia.org/wiki/Wireworld'>Lien utile</a></text>";
    gridDescriptionList[nameW] = new gridDescription(updateAsWireWorld,aleatWireWorld,tempW,tempColorW,tempValueW,nameW,descriptionW);  
    addGridType(nameW);
    
    //definition Game of life Majority
    var tempM = ["DEAD","ALIVE"];
    var tempColorM=["rgba(255,255,255,255)","rgba(0,0,0,255)"];
    var tempValueM=[0,1];
    
    var nameM = "Regle de la majorite";
    var descriptionM ="";
    
    gridDescriptionList[nameM] = new gridDescription(UpdateGameoflifeMaj,aleatGameOfLife,tempM,tempColorM,tempValueM,nameM,descriptionM);  
    addGridType(nameM);
    
    //definition QuadLife
    var tempQ = ["DEAD","ALIVE_GREEN","ALIVE_RED","ALIVE_YELLOW","ALIVE_BLUE"];
    var tempColorQ=["rgba(255,255,255,255)","rgba(0,205,0,255)","rgba(255,48,48,255)","rgba(255,215,0,255)","rgba(0,0,139,255)"];
    var tempValueQ=[0,1,1,1,1];
    
    var nameQ= "QuadLife";
    var descriptionQ = "";
    
    gridDescriptionList[nameQ]= new gridDescription(UpdateQuadLife,aleatQuadLife,tempQ,tempColorQ,tempValueQ,nameQ,descriptionQ);
    addGridType(nameQ)
}
//genere la grille (et le menu) par rapport au type de grille choisit(associé à une description de grille)
function generer()
{
    var gridType = getGridType();
    actualGridDescription = gridDescriptionList[gridType];
    
    if(isLaunched)
        {
            lancer();
        }
    for(var i =0;i<actualGridDescription.automaStateArray.length
       ;i++)
        {
            if(automaStateList[actualGridDescription.automaStateArray[i]]==null)
            automaStateList[actualGridDescription.automaStateArray[i]] = new automateType(actualGridDescription.automaColorArray[i],actualGridDescription.automaStateArray[i],actualGridDescription.automaValueArray[i]);   
        }
    DESCRIPTION.innerHTML = actualGridDescription.description;
    nbCaseX = sizeXInput.value;
    nbCaseY = sizeYInput.value;
    mainGrid = new grid(nbCaseX,nbCaseY); 
    updateList();
    
}
window.onload=function()
{
    
    
        posX1Input = document.getElementById("posX1Input");
    posY1Input = document.getElementById("posY1Input");    

    posX2Input = document.getElementById("posX2Input");
    posY2Input = document.getElementById("posY2Input");  
    
    clickTypeInput = document.getElementById("clickTypeInput");
    
    enreNomInput= document.getElementById("nomInput");
    
    zoneJava = document.getElementById("zoneJava");

     enregistrement=false;
    gridDescriptionList = new Object();
    actualGridDescription = new Object();
    automaStateList = new Object();   
    
    
    
    
    gridDescriptionList = new Object();
    actualGridDescription = new Object();
    automaStateList = new Object();
    
    generationInput = document.getElementById("goToGenerationInput");
    vitesseInput = document.getElementById("vitesseInput");
    sizeXInput = document.getElementById("sizeXInput");
    sizeYInput = document.getElementById("sizeYInput");
    automatTypeInput = document.getElementById("clickAutomatInput");
    seuilInput = document.getElementById("seuilInput");
    gridTypeInput = document.getElementById("gridTypeInput");
    DESCRIPTION = document.getElementById("DESCRIPTION");
    button = document.getElementById("launcher");
    canvas=document.getElementById("canvas");
    buttonPrint = document.getElementById("printGrid");
    isLaunched =false;
    
    defineGridDescription();

    if(!canvas)
        {alert("Impossible de récupérer le canvas");return;}
    
     context = canvas.getContext('2d');
    if(!context)
        {
            alert("Impossible de récupérer le context du canvas");
            return;
        }
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    actualGridDescription = gridDescriptionList[getGridType()];
    generer();
    drawHandler= setInterval(updateFrame,20);
    canvas.addEventListener('click',function(e){
        if(!enregistrement)
            {
                if(getClickType()=="Automate")
                    {
                        gridClick(this,e);
                    }
                else
                    {
                            var coords = getCoords(this,e);    
                            var x = Math.floor(coords.x/mainGrid.caseSizeX);
                            var y = Math.floor(coords.y/mainGrid.caseSizeY);
                            changeFormAt(x,y,actualGridDescription.formArray[getSelectedAutomat()].ARRAY);
                    }
            }
        else
            {
                            var coords = getCoords(this,e);    
                            var x = Math.floor(coords.x/mainGrid.caseSizeX);
                            var y = Math.floor(coords.y/mainGrid.caseSizeY);
                if(enregistrement_clic==0)
                    {
                            posX1Input.value = x.toString();
                            posY1Input.value = y;
                    }
                else
                    {
                            posX2Input.value = x;
                            posY2Input.value = y;
                    }
                enregistrement_clic++;
                if(enregistrement_clic>=2)
                    enregistrement=false;
            }
    } 
                           );
    
    
    
    loadScript("forme_aut.js",function(){
    console.log("Script charge!");});
    
}