var sliders = document.getElementsByClassName("chance-slider");
var sliderTexts = document.getElementsByClassName("result-text");
var totalPercentage = document.getElementById("TotalText")
var highestSliderID = 0
var highestSliderValue = 0
var lowestSliderID = 0
var lowestSliderValue = 0
var totalValue = 0;
var changingSliderID = 0;
var simCanvas = document.getElementById("simulation-canvas");
var simSlider = document.getElementById("SimulationTime");
var simStarter = document.getElementById("play");
var importer = document.getElementById("import");
var ctx = simCanvas.getContext("2d");
var sizeMultiplier = 10;
var maxInstantMovements = 4000;
var maxInstantMovementsFile = 4000;
var movementsDone = 0;
var currentSimLines;
var playingSim = false
var simulationFrame = 0

var columns = 0;
var rows = 0;
var height = 0;
var upChance = 25;
var downChance = 25;
var leftChance = 25;
var rightChance = 25;
var speed = 0;
var particleAmount = 0;
var currentFrame = 0;

var currentParticlePosX = 0;
var currentParticlePosY = 0;
var isParticleCreated = false;
var occupiedPositions = [];
var occupiedPositionsString = "";
var currentPositionString = "";
var file;
const reader = new FileReader();

var inputs = document.querySelectorAll("input")

inputs.forEach(element => {
    element.addEventListener("keypress", function (e) {
    var allowedChars = '0123456789';
    function contains(stringValue, charValue) {
        return stringValue.indexOf(charValue) > -1;
    }
    var invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
            || e.key === '.' && contains(e.target.value, '.');
    invalidKey && e.preventDefault();});
});

function onSliderChange(slider) {
    // checkSliderValues(slider);
    updateSlidersText()
}

function onChanceChange(text)
{
    if (text.value > 100) text.value = 100
    if (text.value < 0) text.value = 0

    if (text.id == "UpText")
    {
        sliders[0].value = text.value
    }
    if (text.id == "DownText")
    {
        sliders[1].value = text.value
    }
    if (text.id == "LeftText")
    {
        sliders[2].value = text.value
    }
    if (text.id == "RightText")
    {
        sliders[3].value = text.value
    }

    
    var total = 0
    for (let i = 0; i < sliders.length; i++)
    {
        total += parseInt(sliders[i].value)
    }
    if (total > 100)
    {
        totalPercentage.style.color = 'red';
    }
    else
    {
        totalPercentage.style.color = 'black';
    }
    totalPercentage.textContent = total
}

function updateSlidersText()
{
    var total = 0
    for (let i = 0; i < sliders.length; i++)
    {
        var currentText = sliderTexts[i];
        currentText.value = sliders[i].value;
        total += parseInt(sliders[i].value)
    }
    if (total > 100)
    {
        totalPercentage.style.color = 'red';
    }
    else
    {
        totalPercentage.style.color = 'black';
    }
    totalPercentage.textContent = total
}

function checkSliderValues(changingSlider)
{
    highestSliderID = -1;
    highestSliderValue = 0;
    lowestSliderID = -1;
    lowestSliderValue = 100;
    changingSliderID = getSliderID(changingSlider.id);
    totalValue = 0;
    for (let i = 0; i < sliders.length; i++) {
        totalValue += parseInt(sliders[i].value);
    }

    if(totalValue > 100)
    {
        for (let i = 0; i < sliders.length; i++) {
            var element = sliders[i];
            if (element.value > highestSliderValue)
            {
                if(i != changingSliderID)
                {
                    highestSliderID = i;
                    highestSliderValue = element.value;
                }
            }
        }
        sliders[highestSliderID].value -= (totalValue-100);
    }
    else
    {
        for (let i = 0; i < sliders.length; i++) {
            var element = sliders[i];
            if (element.value < lowestSliderValue)
            {
                if(i != changingSliderID)
                {
                    lowestSliderID = i;
                    lowestSliderValue = element.value;
                }
            }
        }
        sliders[lowestSliderID].value -= (totalValue-100);
    }

    // console.log(highestSliderID);
    // console.log(highestSliderValue);
    // console.log(totalValue);
    updateSlidersText();

}

var getSliderID = function(slider)
{
    if (slider == "UpChance") {
        return 0;
    }
    else if (slider == "DownChance") {
        return 1;
    }
    else if (slider == "LeftChance") {
        return 2;
    }
    else if (slider == "RightChance") {
        return 3;
    }
    return 0;
}

function setSimulationMoment(slider)
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var value = 0
    if (slider == true)
    {
        value = parseInt(simSlider.value)
        simulationFrame = value
        if (playingSim) togglePlay()
    }
    else
    {
        value = simulationFrame+1
        // console.log(value)
        // console.log(simSlider.max)
        if (value > parseInt(simSlider.max))
        {
            value = parseInt(simSlider.max)
            simulationFrame = value
            if (playingSim) togglePlay()
        }
    }
    var moment = parseInt(value)*2
    var frame = currentSimLines[moment+1]
    var pixels = frame.split(")")
    pixels.pop()
    // console.log(pixels)
    pixels.forEach(pixel => {
        var dividedPixel = pixel.split("(")
        pixel = dividedPixel[1]
        coords = pixel.split(",")
        createPixel(coords[0], coords[1])
    });
}

function togglePlay()
{
    if (playingSim)
    {
        simStarter.value = "Play"
        playingSim = false
    }
    else
    {
        value = parseInt(simSlider.max)
        if (simulationFrame >= value)
        {
            simulationFrame = 0
        }
        // console.log(value)
        // console.log(simulationFrame)
        simStarter.value = "Pause"
        playingSim = true
        playSimulation()
    }
}

const playSimulation = async () => {
    speed = parseInt(document.getElementById("speed").value);
    var framesToAdd = 1
    if (speed > 1000)
    {
        framesToAdd = Math.round(speed/1000)
    }
    while (playingSim) {
        setSimulationMoment(false)
        simSlider.value = simulationFrame
        simulationFrame += framesToAdd
        await simulationDelay()
    }
}

function loadSimulation()
{
    const selectedFile = importer.files[0];
    if (selectedFile == null)
    {
        alert("No hay ningún archivo seleccionado")
        return
    }
    reader.readAsText(selectedFile)
    reader.addEventListener(
    "load",
        () => {
            // this will then display a text file
            var lines = reader.result.split("\n")
            var options = lines[0].split(",")
            columns = options[0]
            rows = options[1]
            var scale = parseInt(document.getElementById("scale").value)
            console.log(scale)
            sizeMultiplier = scale
            simCanvas.width = columns*sizeMultiplier;
            simCanvas.height = rows*sizeMultiplier;
            lines.shift()
            var frame = lines[lines.length-2]
            var frameNum = parseInt(frame.replace(/^\D+/g, ''));
            simSlider.max = frameNum
            currentSimLines = lines
        },
        false,
    );
    simulationFrame = 0
    simSlider.disabled = false
    simStarter.disabled = false
}

function emptyArray()
{
    return []
}

function createSimulationTextfile()
{
    simulationSetup();
    simulateFile();
}

function downloadSimulation()
{
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "simulation.txt";
    link.click();
    URL.revokeObjectURL(link.href);
}

function generateSimulation()
{
    // ctx.imageSmoothingEnabled = false;
    simulationSetup();
    simulateParticles();
}

function simulationSetup()
{
    columns = parseInt(document.getElementById("columns").value);
    rows = parseInt(document.getElementById("rows").value);
    height = parseInt(document.getElementById("height").value);
    upChance = parseInt(sliders[0].value);
    downChance = parseInt(sliders[1].value);
    leftChance = parseInt(sliders[2].value);
    rightChance = parseInt(sliders[3].value);
    speed = parseInt(document.getElementById("speed").value);
    particleAmount = parseInt(document.getElementById("amount").value);
    currentFrame = 0;
    if (speed == "") speed = 0

    if (columns == "" || rows == "" || height == "" || amount == "") {
        alert("Hay valores sin asignar");
        return;
    }

    if (height >= rows) {
        alert("La altura de aparición debe ser menor que la cantidad de filas");
        return;
    }
    occupiedPositions = emptyArray()
    occupiedPositionsString = ""
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    isParticleCreated = false;
    simCanvas.width = columns*sizeMultiplier;
    simCanvas.height = rows*sizeMultiplier;
    downChance = downChance+upChance;
    leftChance = leftChance+downChance;
    rightChance = rightChance+leftChance;
}

const simulateFile = async () => {
    file = new Blob([columns + "," + rows], { type: "text/plain" })
    while (particleAmount >= 0)
    {
        file = new Blob([file, "\nFrame "+currentFrame])
        if (!isParticleCreated)
        {
            
            if(particleAmount == 0)
            {
                particleAmount--;
            }

            if(particleAmount > 0)
            {
                particleAmount--;
                currentParticlePosY = rows-height;
                currentParticlePosX = Math.floor(Math.random() * columns)
                currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
                isParticleCreated = true;
            }
        }
        else
        {
            if (movementsDone >= maxInstantMovementsFile)
            {
                movementsDone = 0;
                await delay(10);
            }
            movementsDone++;
            var randomMovement = Math.floor(Math.random()*100)
            if(randomMovement < upChance)
                moveParticleUpFile();
            else if(randomMovement < downChance)
                moveParticleDownFile();
            else if(randomMovement < leftChance)
                moveParticleLeftFile();
            else if(randomMovement < rightChance)
                moveParticleRightFile();
        }
        file = new Blob([file, "\n"+occupiedPositionsString+currentPositionString], { type: "text/plain"})
        currentFrame++;
    }
    downloadSimulation()
}

const simulateParticles = async () => {
    while (particleAmount >= 0)
    {
        if (!isParticleCreated)
        {
            if(particleAmount == 0)
            {
                particleAmount--;
            }

            if(particleAmount > 0)
            {
                particleAmount--;
                currentParticlePosY = rows-height;
                currentParticlePosX = Math.floor(Math.random() * columns)
                createPixel(currentParticlePosX, currentParticlePosY)
                isParticleCreated = true;
            }
        }
        else
        {
            if (movementsDone >= maxInstantMovements && speed == 0)
            {
                movementsDone = 0;
                await delay(1);
            }
            movementsDone++;
            var randomMovement = Math.floor(Math.random()*100)
            if(randomMovement < upChance)
                moveParticleUpRealTime();
            else if(randomMovement < downChance)
                moveParticleDownRealTime();
            else if(randomMovement < leftChance)
                moveParticleLeftRealTime();
            else if(randomMovement < rightChance)
                moveParticleRightRealTime();
        }
        
        if (speed > 0)
        {
            await simulationDelay();
        }
    }
    console.log("done!");
};


const simulationDelay = async () => {
    if (speed > 1000)
    {
        await delay(1)
    }
    else
    {
        await delay(1000/speed);
    }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

function moveParticleUpRealTime()
{
    if (!isPositionOccupied(currentParticlePosX, currentParticlePosY-1)) 
    {
        if (currentParticlePosY-1 < 0)
        {
            removePixel(currentParticlePosX, currentParticlePosY);
            isParticleCreated = false;
        }
        else
        {
            removePixel(currentParticlePosX, currentParticlePosY);
            currentParticlePosY--;
            createPixel(currentParticlePosX, currentParticlePosY);
        }
    }
    else
    {
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleDownRealTime()
{
    if (!isPositionOccupied(currentParticlePosX, currentParticlePosY+1)) 
    {
        if (currentParticlePosY+1 >= rows)
        {
            occupiedPositions.push([currentParticlePosX, currentParticlePosY])
            isParticleCreated = false;
        }
        else
        {
            removePixel(currentParticlePosX, currentParticlePosY);
            currentParticlePosY++;
            createPixel(currentParticlePosX, currentParticlePosY);
        }
    }
    else
    {
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleLeftRealTime()
{
    if (!isPositionOccupied(currentParticlePosX-1, currentParticlePosY)) 
    {
        removePixel(currentParticlePosX, currentParticlePosY);
        if (currentParticlePosX-1 < 0)
        {
            currentParticlePosX = columns-1;
        }
        else
        {
            currentParticlePosX--;
        }
        createPixel(currentParticlePosX, currentParticlePosY);
    }
    else
    {
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleRightRealTime()
{
    if (!isPositionOccupied(currentParticlePosX+1, currentParticlePosY)) 
    {
        removePixel(currentParticlePosX, currentParticlePosY);
        if (currentParticlePosX+1 >= columns)
        {
            currentParticlePosX = 0;
        }
        else
        {
            currentParticlePosX++;
        }
        createPixel(currentParticlePosX, currentParticlePosY);
    }
    else
    {
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}


function moveParticleUpFile()
{
    if (!isPositionOccupied(currentParticlePosX, currentParticlePosY-1)) 
    {
        if (currentParticlePosY-1 < 0)
        {
            currentPositionString = "";
            isParticleCreated = false;
        }
        else
        {
            currentParticlePosY--;
            currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        }
    }
    else
    {
        console.log("Up position occupied");
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        occupiedPositionsString += currentPositionString;
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleDownFile()
{
    if (!isPositionOccupied(currentParticlePosX, currentParticlePosY+1)) 
    {
        if (currentParticlePosY+1 >= rows)
        {
            currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
            occupiedPositionsString += currentPositionString;
            occupiedPositions.push([currentParticlePosX, currentParticlePosY])
            isParticleCreated = false;
        }
        else
        {
            currentParticlePosY++;
            currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        }
    }
    else
    {
        console.log("Down position occupied");
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        occupiedPositionsString += currentPositionString;
        isParticleCreated = false;
    }
}
function moveParticleLeftFile()
{
    if (!isPositionOccupied(currentParticlePosX-1, currentParticlePosY)) 
    {
        if (currentParticlePosX-1 < 0)
        {
            currentParticlePosX = columns-1;
        }
        else
        {
            currentParticlePosX--;
        }
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
    }
    else
    {
        console.log("Left position occupied");
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        occupiedPositionsString += currentPositionString;
        isParticleCreated = false;
    }
}
function moveParticleRightFile()
{
    if (!isPositionOccupied(currentParticlePosX+1, currentParticlePosY)) 
    {
        if (currentParticlePosX+1 >= columns)
        {
            currentParticlePosX = 0;
        }
        else
        {
            currentParticlePosX++;
        }
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
    }
    else
    {
        console.log("Right position occupied");
        currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        occupiedPositionsString += currentPositionString;
        isParticleCreated = false;
    }
}


function isPositionOccupied(xPos, yPos)
{
    for (let i = 0; i < occupiedPositions.length; i++) {
        if (occupiedPositions[i][0] == xPos && occupiedPositions[i][1] == yPos) {
            console.log(currentFrame)
            console.log(occupiedPositions[i])
            return true
        }
    }
    return false;
}


function createPixelRaw(xPos, yPos, r, g, b, a) {
    var id = ctx.createImageData(sizeMultiplier, sizeMultiplier);
    for(var i=0;i<id.data.length/4;i++)
    {
        id.data[4*i] = r;
        id.data[4*i+1] = g;
        id.data[4*i+2] = b;
        id.data[4*i+3] = a;
    }
    ctx.putImageData(id,xPos*sizeMultiplier,yPos*sizeMultiplier);
}
function createPixel(xPos, yPos) {
    createPixelRaw(xPos, yPos, 255, 0, 0, 255)
}

function removePixel(xPos, yPos) {
    createPixelRaw(xPos, yPos, 0, 0, 0, 0)
}
