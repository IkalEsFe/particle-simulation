var sliders = document.getElementsByClassName("chance-slider");
var highestSliderID = 0
var highestSliderValue = 0
var totalValue = 0;
var changingSliderID = 0;


function changeSliderText(text, slider) {
    console.log(slider);
    var theText = document.getElementById(text);
    theText.textContent = slider.value;
    checkSliderValues(slider);
}

function checkSliderValues(changingSlider)
{
    highestSliderID = -1;
    highestSliderValue = 0;
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
    }
    else
    {
        for (let i = 0; i < sliders.length; i++) {
            var element = sliders[i];
            if (element.value < highestSliderValue)
            {
                if(i != changingSliderID)
                {
                    highestSliderID = i;
                    highestSliderValue = element.value;
                }
            }
        }
    }

    console.log(highestSliderID);
    console.log(highestSliderValue);
    console.log(totalValue);
    sliders[highestSliderID].value -= (totalValue-100);

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