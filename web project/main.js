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

var columns = 0;
var rows = 0;
var height = 0;
var upChance = 25;
var downChance = 25;
var leftChance = 25;
var rightChance = 25;
var speed = 0;

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
    lowesSliderID = -1;
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
    columns = document.getElementById("columns").value;
    rows = document.getElementById("rows").value;
    height = document.getElementById("height").value;
    upChance = sliders[0].value;
    downChance = sliders[1].value;
    leftChance = sliders[2].value;
    rightChance = sliders[3].value;
    speed = document.getElementById("speed").value;
    console.log(columns)

    if (columns == "" || rows == "" || height == "" || speed == "") {
        alert("Hay valores sin asignar");
        return;
    }

    if (height >= rows) {
        alert("La altura de aparición debe ser menor que la cantidad de filas");
        return;
    }

    ctx.createImageData(columns, height);

}
