
var upSlider = document.getElementById("UpChance");

function changeSliderText(text, slider) {
    var theSlider = document.getElementById(slider);
    var theText = document.getElementById(text);
    // theText.textContent = theSlider.attributes.;
}

console.log(upSlider);
var sliderUp = changeSliderText("UpText", "UpChance");

upSlider.addEventListener('input', sliderUp);