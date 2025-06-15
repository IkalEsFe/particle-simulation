var file;
var columns = 0;
var rows = 0;
var particleAmount = 0;
var currentParticlePosX = 0;
var currentParticlePosY = 0;
var currentPositionString = 0;
var occupiedPositionsString = 0;
var upChance = 25;
var downChance = 25;
var leftChance = 25;
var rightChance = 25;
var height = 0;
var freeSpawnPositions = [];
var occupiedPositions;
var currentFrame;
var isParticleCreated = false;
var buffer = ""

onmessage = (e) =>{

    data = e.data;
    columns = data["columns"]
    rows = data["rows"]
    particleAmount = data["particleAmount"]
    upChance = data["upChance"]
    downChance = data["downChance"]
    leftChance = data["leftChance"]
    rightChance = data["rightChance"]
    height = data["height"]
    isParticleCreated = false
    freeSpawnPositions = emptyArray()
    for (let i = 0; i < columns; i++) {
        freeSpawnPositions.push(i)
    }
    occupiedPositions = emptyArray()
    occupiedPositionsString = ""
    currentFrame = 0;
    simulateFile()
}

const simulateFile = async () => {
    buffer = `${columns},${rows}`
    while (particleAmount >= 0)
    {
        buffer += `\nFrame ${currentFrame}`
        if (!isParticleCreated)
        {
            
            if(particleAmount == 0)
            {
                particleAmount--;
            }

            if(particleAmount > 0)
            {
                if (freeSpawnPositions.length == 0)
                {
                    height++
                    if (height >= rows)
                    {
                        particleAmount = 0;
                        return;
                    }
                    freeSpawnPositions = emptyArray()
                    for (let i = 0; i < columns; i++) {
                        freeSpawnPositions.push(i)
                    }
                }
                particleAmount--;
                currentParticlePosY = rows-height;
                currentParticlePosX = freeSpawnPositions[Math.floor(Math.random() * freeSpawnPositions.length)]
                currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
                isParticleCreated = true;
            }
        }
        else
        {
            // if (movementsDone >= maxInstantMovementsFile)
            // {
            //     movementsDone = 0;
            //     await delay(10);
            // }
            // movementsDone++;
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
        buffer += `\n${occupiedPositionsString}${currentPositionString}`
        postMessage({ type: "updateStatus", message: `Generando frame: ${currentFrame}` });
        if (currentFrame % 5000 === 0)
        {
            postMessage({type: "buffer", message: buffer})
            buffer = ""
        }
        currentFrame++;
    }
    
    postMessage({type: "buffer", message: buffer})
    buffer = ""
    postMessage({type: "done", message: "yippie"})
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
        placeParticle()
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
        placeParticle()

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
        placeParticle()
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
        placeParticle()
    }
}

function placeParticle()
{
    currentPositionString = `(${currentParticlePosX},${currentParticlePosY})`;
    if (currentParticlePosY == rows-height)
    {
        var i = freeSpawnPositions.indexOf(currentParticlePosX)
        freeSpawnPositions.splice(i, 1)
    }
    occupiedPositions.push([currentParticlePosX, currentParticlePosY])
    occupiedPositionsString += currentPositionString;
    isParticleCreated = false;
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

function emptyArray() { return [] }
