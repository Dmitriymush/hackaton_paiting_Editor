const canvas = document.getElementById('canvas');
const colorInput = document.getElementById('color');
const lineSizeInput = document.getElementById('line-size');
const dropDownIcon = document.getElementById('dropdown');
const tools = document.querySelector('.tools');
const context = canvas.getContext('2d');
let isContentDown = false;
let mouseDown = false;
let color = 'black';
let coordinates = localStorage.getItem('coordinates') ? JSON.parse(localStorage.getItem('coordinates')) : [];
let coordsCopy;
let img = '';
let link = document.createElement('a');
let isImgEmpty = true;
let timer;
let lineWidth = 10;

context.fillStyle = color;
context.strokeStyle = color;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('mousedown', () => {
  mouseDown = true;
  isImgEmpty = false;
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
  if ( !coordinates ) {
    coordinates = [];
  }
  context.beginPath();
  coordinates.push('whitespace');
  coordsCopy = [...coordinates];
});

colorInput.addEventListener('change', (event) => {
  color = event.target.value;
  context.fillStyle = color;
  context.strokeStyle = color;
});

lineSizeInput.addEventListener('change', (event) => {
  if (event.target.value > 0) {
    lineWidth = event.target.value;
  }
});

dropDownIcon.addEventListener('click', (event) => {
  if ( event.target.id === 'dropdown' ) {
    dropDownIcon.style.transform = 'rotate(180deg)';
    isContentDown = !isContentDown;
    if (!isContentDown) {
      tools.style.transform = 'translateY(-215px)';
      dropDownIcon.style.transform = 'translateY(67px)';
    } else {
      tools.style.transform = 'translateY(0)';
    }
  }
});

function painter(event) {
  context.lineTo(event.clientX, event.clientY);
  context.stroke();

  context.beginPath();
  context.arc(event.clientX, event.clientY, lineWidth/2, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.moveTo(event.clientX, event.clientY);
}

canvas.addEventListener('mousemove', (event) => {
  if ( mouseDown ) {
    if ( !coordinates ) {
      coordinates = [];
    }
    coordinates.push([event.clientX, event.clientY]);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    painter(event);
  }
});

function save () {
  localStorage.setItem('coordinates', JSON.stringify(coordinates));
}

function deleteAll () {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.fillStyle = color;
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
}

function replay() {
  if ( !coordinates ) {
    return;
  }
  timer = setInterval(() => {
    if( !coordinates.length ) {
      clearInterval(timer);
      context.beginPath();
      return;
    }
    let coords = coordinates.shift();
    let event = {
      clientX: coords["0"],
      clientY: coords["1"]
    };

    painter(event);
  }, 30)
}

function downloadImg () {
  img = canvas.toDataURL();
  if ( img.length && !isImgEmpty) {
    link.setAttribute('href', img);
    link.setAttribute('download', 'Download.jpg');
    link.click();
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.code;
  console.log(key);
  switch (key) {
    case 'Enter':
      save();
      break;
    case 'Backspace':
      deleteAll();
      clearInterval(timer);
      break;
    case 'ShiftLeft':
      coordinates = JSON.parse(localStorage.getItem('coordinates'));
      deleteAll();
      // coordsCopy = [...coordinates];
      replay();
      // context.beginPath();
      break;
    case 'ShiftRight':
      coordinates = JSON.parse(localStorage.getItem('coordinates'));
      deleteAll();
      // coordsCopy = [...coordinates];
      replay();
      // context.beginPath();
      break;
    case 'ControlLeft':
      downloadImg();
      break;
    case 'ControlRight':
      downloadImg();
      break;
    case 'Escape':
      localStorage.clear();
      deleteAll();
      clearInterval(timer);
      break;
  }
});

