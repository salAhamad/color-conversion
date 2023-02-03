const colorInput = document.querySelector('#inputValue');
const root = document.querySelector('#root');
const rgbValue = document.querySelector('#rgbValue');
let hexValue,
    converted_rgb_value,
    color_brightness;


// const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
//   const hex = x.toString(16)
//   return hex.length === 1 ? '0' + hex : hex
// }).join('')

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const hexToRgb = (color) => {
  color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
  r = color >> 16;
  g = color >> 8 & 255;
  b = color & 255;
  console.log('inside: ', r, g, b);
  return [r, g, b].join(', ');
}


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

colorInput.addEventListener('input', (e) => {
  hexValue = e.target.value.includes('#') ? e.target.value : `#${e.target.value}`;
  converted_rgb_value = hexToRgb(hexValue)
  color_brightness = lightOrDark(hexValue);
  if(color_brightness === 'light') root.style.setProperty('--base-color', '#252525');
  else root.style.setProperty('--base-color', '#e6e6e6');
  
  rgbValue.innerHTML = converted_rgb_value;
  root.style.setProperty('--base-bg-color', hexValue);
})
