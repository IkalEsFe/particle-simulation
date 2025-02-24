var sliders = document.getElementsByClassName("chance-slider");
var highestSliderID = 0
var highestSliderValue = 0
var totalValue = 0;


function changeSliderText(text, slider) {
    var theText = document.getElementById(text);
    theText.textContent = slider.value;
    checkSliderValues(slider);
}

function checkSliderValues(changingSlider)
{
    highestSliderID = 0;
    highestSliderValue = 0;
    totalValue = 0;
    for (let i = 0; i < sliders.length; i++) {
        const element = sliders[i];
        if (element.value > highestSliderValue && i != getSliderID(changingSlider.id))
        {
            highestSliderID = i;
            highestSliderValue = element.value;
        }
        totalValue += parseInt(element.value);
    }
    console.log(highestSliderID);
    console.log(highestSliderValue);
    console.log(totalValue);
    sliders[highestSliderID].value -= (totalValue-100);

}

var getSliderID = function(slider)
{
    if (slider == "UpSlider") {
        return 0;
    }
    else if (slider == "DownSlider") {
        return 1;
    }
    else if (slider == "LeftSlider") {
        return 2;
    }
    else if (slider == "RightSlider") {
        return 3;
    }
}