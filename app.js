const root = document.querySelector('#root');
const $inputHex = document.querySelector('#hexValue');
const $rgbInputs = document.querySelectorAll('.rgb-input');
const $reverseButton = document.querySelector('.reverse-button');
const $labelHEX = document.querySelector('.label-hex');
const $labelRGB = document.querySelector('.label-rgb');

let error_enabled = false;
let hexValue, converted_rgb_value, color_brightness;

// ============ [ RGB TO HEX FUNCTION ] ============ //
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

// ============ [ HEX TO RGB FUNCTION ] ============ //
const hexToRgb = (color) => {
  color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
  r = color >> 16;
  g = color >> 8 & 255;
  b = color & 255;
  return [r, g, b];
}

// ============ [ Detecting color brightness to modify color contrass ] ============ //
function lightOrDark(color) {
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
    // console.log(r, g, b);
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
    // console.log(r, g, b);
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) return 'light';
  else return 'dark';
}

// ============ [ Root color Controller ] ============ //
function rootColorsController(event) {
  if(error_enabled) {
    root.style.setProperty('--base-color', '#999');
    return
  }
  if(event === 'light') {
    root.style.setProperty('--base-color', '#252525');
    root.style.setProperty('--input-bg-color', '#ffffff');
  } else {
    root.style.setProperty('--base-color', '#e6e6e6');
    root.style.setProperty('--input-bg-color', 'transparent');
  };
}

// ============ [ slicing hex color for length with # ] ============ //
function sliceHexColor(color) {
  let hex_value = '';
  if(color.includes('#')) {
    return hex_value = color.slice(1, 7)
  } 
  return hex_value = color.slice(0, 6)  
}

// ============ [ RGB to HEX Conversion ] ============ //
let redValue = 0;
let greenValue = 0;
let blueValue = 0;
$rgbInputs.forEach((input, index) => {
  input.addEventListener('input', e => {
    let thisElem = e.target;
    let thisElem_value = thisElem.value;
    let rgb_max_length = 3;
    let rgb_max_value = 255;
    let thisInputParent = thisElem.parentNode.parentNode;
    let input_alert = thisInputParent.querySelector('.input-alert');
    let nextSibling = e.target.nextElementSibling;

    if(thisElem_value > 255) {
      input_alert.innerHTML = `Input value cannot be more than ${rgb_max_value}`;
      input_alert.classList.remove('display--none');
      thisInputParent.classList.add('error');
    } else {
      input_alert.innerHTML = '';
      input_alert.classList.add('display--none');
      thisInputParent.classList.remove('error');
      if(thisElem_value.length >= rgb_max_length) {
        if(e.target.nextElementSibling){ 
          nextSibling.value = '';
          nextSibling.focus();
        }
      }

      if(thisElem.name === 'value-red') redValue = thisElem_value
      if(thisElem.name === 'value-green') greenValue = thisElem_value
      if(thisElem.name === 'value-blue') blueValue = thisElem_value
      
      console.log(redValue, greenValue, blueValue)

      let converted_rgb_to_hex = rgbToHex(+redValue, +greenValue, +blueValue);      
      $inputHex.value = sliceHexColor(converted_rgb_to_hex);
      color_brightness = lightOrDark(converted_rgb_to_hex);
      rootColorsController(color_brightness);
      root.style.setProperty('--base-bg-color', converted_rgb_to_hex);
    }
  })
})

// ============ [ Hex to RGB Conversion ] ============ //
$inputHex.addEventListener('input', (e) => {
  let thisInput = e.target;
  let thisInputParent = thisInput.parentNode;

  let input_type = thisInput.name;
  let input_value = sliceHexColor(thisInput.value);
  let input_max_value = 6;
  let input_min_value = 3;
  
  let input_alert = thisInputParent.querySelector('.input-alert');
  
  if(input_type === 'input-hex') {
    // checking if # is exists
    if(input_value.includes('#')) {
      input_min_value += 1
      input_max_value += 1
    };

    // checking min-length and max-length for errors
    if(input_value.length === input_min_value || input_value.length === input_max_value) {
      input_alert.innerHTML = ''
      input_alert.classList.add('display--none');
      thisInputParent.classList.remove('error');
      error_enabled = false;
    } else {
      input_alert.innerHTML = `Input Value cannot be less than ${input_min_value} and not more that ${input_max_value}`
      input_alert.classList.remove('display--none');
      thisInputParent.classList.add('error');
      error_enabled = true;
    }

    hexValue = input_value.includes('#') ? input_value : `#${input_value}`;    
    const [ r, g, b ] = hexToRgb(input_value)   
    $rgbInputs.forEach((input, index) => {
      if(index === 0) input.value = r;
      if(index === 1) input.value = g;
      if(index === 2) input.value = b;
    })
  }

  color_brightness = lightOrDark(hexValue);
  rootColorsController(color_brightness);
  root.style.setProperty('--base-bg-color', hexValue);
});

// ============ [ Reverse Fields ] ============ //

$reverseButton.addEventListener('click', (event) => {
  let thisParent = event.target.parentNode;
  thisParent.classList.toggle('reversed');
  if(thisParent.classList.contains('reversed')) {
    $labelHEX.innerHTML = 'RGB';
    $labelRGB.innerHTML = 'HEX';
  } else {
    $labelHEX.innerHTML = 'HEX';
    $labelRGB.innerHTML = 'RGB';
  }
  console.log(thisParent);
})