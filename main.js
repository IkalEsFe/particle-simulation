var sliders = document.getElementsByClassName("chance-slider");
var sliderTexts = document.getElementsByClassName("result-text");
var totalPercentage = document.getElementById("TotalText")
var simCanvas = document.getElementById("simulation-canvas");
var simSlider = document.getElementById("SimulationTime");
var simStarter = document.getElementById("play");
var importer = document.getElementById("import");
var generatingText = document.getElementById("generating");
var ctx = simCanvas.getContext("2d");
var sizeMultiplier = 10;
var currentSimLines;
var playingSim = false
var simulationFrame = 0
const simWorker = new Worker("worker.js")
var fileParts = []

var columns = 0;
var rows = 0;
var height = 0;
var upChance = 25;
var downChance = 25;
var leftChance = 25;
var rightChance = 25;
var speed = 0;

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
    // reader.readAsText(selectedFile)
    // reader.addEventListener(
    // "load",
    //     () => {
    //         // this will then display a text file
    //         var lines = reader.result.split("\n")
    //         var options = lines[0].split(",")
    //         columns = options[0]
    //         rows = options[1]
    //         var scale = parseInt(document.getElementById("scale").value)
    //         console.log(scale)
    //         sizeMultiplier = scale
    //         simCanvas.width = columns*sizeMultiplier;
    //         simCanvas.height = rows*sizeMultiplier;
    //         lines.shift()
    //         var frame = lines[lines.length-2]
    //         var frameNum = parseInt(frame.replace(/^\D+/g, ''));
    //         simSlider.max = frameNum
    //         currentSimLines = lines
    //     },
    //     false,
    // );
    // simulationFrame = 0
    // simSlider.disabled = false
    // simStarter.disabled = false

    const CHUNK_SIZE = 1024 * 1024; // 1MB por bloque
    const decoder = new TextDecoder("utf-8");
    let offset = 0;
    let leftover = "";
    let lines = [];

    function processChunk(text) {
        const combined = leftover + text;
        const parts = combined.split("\n");
        leftover = parts.pop(); // la última puede estar incompleta
        lines.push(...parts);
    }

    function readNextChunk() {
        const slice = selectedFile.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();

        reader.onload = () => {
            const text = decoder.decode(reader.result, { stream: true });
            processChunk(text);

            offset += CHUNK_SIZE;
            if (offset < selectedFile.size) {
                readNextChunk();
            } else {
                if (leftover) lines.push(leftover);
                finalizeLoad(lines);
            }
        };

        reader.onerror = () => {
            alert("Error al leer el archivo.");
        };

        reader.readAsArrayBuffer(slice);
    }

    readNextChunk();
}

function finalizeLoad(lines) {
    var options = lines[0].split(",");
    columns = parseInt(options[0]);
    rows = parseInt(options[1]);
    
    var scale = parseInt(document.getElementById("scale").value);
    sizeMultiplier = scale;
    simCanvas.width = columns * sizeMultiplier;
    simCanvas.height = rows * sizeMultiplier;

    lines.shift();
    var frame = lines[lines.length - 2];
    var frameNum = parseInt(frame.replace(/^\D+/g, ''));
    simSlider.max = frameNum;
    currentSimLines = lines;

    simulationFrame = 0;
    simSlider.disabled = false;
    simStarter.disabled = false;
}

function createSimulationTextfile()
{
    simulationSetup();
    var values = {
        "columns": columns,
        "rows": rows,
        "particleAmount": particleAmount,
        "upChance": upChance,
        "downChance": downChance,
        "leftChance": leftChance,
        "rightChance": rightChance,
        "height": height,
    }
    values = JSON.parse(JSON.stringify(values));
    simWorker.postMessage(values)
}

simWorker.onmessage = (e) =>
{
    const data = e.data;
    if (data.type === "updateStatus") 
    {
        generatingText.textContent = data.message;
    }
    else if (data.type === "buffer")
    {
        fileParts.push(data.message)
    }
    else if (data.type === "done") 
    {
        file = new Blob(fileParts, { type: "text/plain" });
        generatingText.textContent = ""
        downloadSimulation()
    }
}

function downloadSimulation()
{
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "simulation.txt";
    link.click();
    URL.revokeObjectURL(link.href);
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
    fileParts = emptyArray()
    downChance = downChance+upChance;
    leftChance = leftChance+downChance;
    rightChance = rightChance+leftChance;
}

function emptyArray() { return [] }

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