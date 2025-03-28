var sliders = document.getElementsByClassName("chance-slider");
var sliderTexts = document.getElementsByClassName("result-text");
var highestSliderID = 0
var highestSliderValue = 0
var lowestSliderID = 0
var lowestSliderValue = 0
var totalValue = 0;
var changingSliderID = 0;
var simCanvas = document.getElementById("simulation-canvas");
var ctx = simCanvas.getContext("2d");
var sizeMultiplier = 10;

var columns = 0;
var rows = 0;
var height = 0;
var upChance = 25;
var downChance = 25;
var leftChance = 25;
var rightChance = 25;
var speed = 0;
var particleAmount = 0;

var currentParticlePosX = 0;
var currentParticlePosY = 0;
var isParticleCreated = false;
var occupiedPositions = []

function onSliderChange(slider) {
    console.log(slider);
    checkSliderValues(slider);
}

function updateSlidersText()
{
    for (let i = 0; i < sliders.length; i++)
    {
        var currentText = sliderTexts[i];
        currentText.textContent = sliders[i].value;
    }
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

    console.log(highestSliderID);
    console.log(highestSliderValue);
    console.log(totalValue);
    updateSlidersText();

}

var getSliderID = function(slider)
{
    console.log(slider);
    if (slider == "UpChance") {
        console.log("Return 0");
        return 0;
    }
    else if (slider == "DownChance") {
        console.log("Return 1");
        return 1;
    }
    else if (slider == "LeftChance") {
        console.log("Return 2");
        return 2;
    }
    else if (slider == "RightChance") {
        console.log("Return 3");
        return 3;
    }
    console.log("Outside");
    return 0;
}


function generateSimulation()
{
    // ctx.imageSmoothingEnabled = false;
    columns = parseInt(document.getElementById("columns").value);
    rows = parseInt(document.getElementById("rows").value);
    height = parseInt(document.getElementById("height").value);
    upChance = parseInt(sliders[0].value);
    downChance = parseInt(sliders[1].value);
    leftChance = parseInt(sliders[2].value);
    rightChance = parseInt(sliders[3].value);
    speed = parseInt(document.getElementById("speed").value);
    particleAmount = parseInt(document.getElementById("amount").value);
    if (speed == "") speed = 0

    if (columns == "" || rows == "" || height == "" || amount == "") {
        alert("Hay valores sin asignar");
        return;
    }

    if (height >= rows) {
        alert("La altura de aparición debe ser menor que la cantidad de filas");
        return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    isParticleCreated = false;
    simCanvas.width = columns*sizeMultiplier;
    simCanvas.height = rows*sizeMultiplier;
    downChance = downChance+upChance;
    leftChance = leftChance+downChance;
    rightChance = rightChance+leftChance;
    simulateParticles();
}

const simulateParticles = async () => {
    while (particleAmount >= 0)
    {
        if (!isParticleCreated)
        {
            if (speed == 0)
            {
                await delay(1)
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
            var randomMovement = Math.floor(Math.random()*100)
            if(randomMovement < upChance)
                moveParticleUp();
            else if(randomMovement < downChance)
                moveParticleDown();
            else if(randomMovement < leftChance)
                moveParticleLeft();
            else if(randomMovement < rightChance)
                moveParticleRight();
        }
        
        if (speed > 0)
        {
            await simulationDelay();
        }
    }
};


const simulationDelay = async () => {
    await delay(1000/speed);
};

const delay = ms => new Promise(res => setTimeout(res, ms));

function moveParticleUp()
{
    if (!isPositionOccupied(currentParticlePosX, currentParticlePosY-1)) 
    {
        if (currentParticlePosY-1 < 0)
        {
            removePixel(currentParticlePosX, currentParticlePosY);
            occupiedPositions.push([currentParticlePosX, currentParticlePosY])
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
        console.log("Up position occupied");
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleDown()
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
        console.log("Down position occupied");
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleLeft()
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
        console.log("Left position occupied");
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}
function moveParticleRight()
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
        console.log("Right position occupied");
        occupiedPositions.push([currentParticlePosX, currentParticlePosY])
        isParticleCreated = false;
    }
}


function isPositionOccupied(xPos, yPos)
{
    for (let i = 0; i < occupiedPositions.length; i++) {
        if (occupiedPositions[i][0] == xPos && occupiedPositions[i][1] == yPos) {
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
