const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 8080
const server = http.createServer().listen(port, () => {} )

const five = require('johnny-five');
const board = new five.Board({port: '/dev/ttyACM0'});
const io = socketIo(server);

var arduinoBoard = {};
var outPuts = {};


board.on('ready', () => {

  var ledYellow = new five.Led({
    pin: "7",
    custom:{
      name:'yellow',
      color:'yellow',
      state:false
    }
  });
  var ledRed = new five.Led({
    pin: "8",
    custom:{
      name:'red',
      color:'red',
      state:false
    }
  });
  var ledGreen = new five.Led({
    pin: "9",
    custom:{
      name:'green',
      color:'green',
      state:false
    }
  });

  arduinoBoard.outPuts = {
    leds:[
      ledYellow,
      ledRed,
      ledGreen
    ],
  };

});


io.sockets.on('connection', socket => {

  if (board.isReady) {
    var status = getBoardStatus();
    io.emit('mount', status);
  }

  socket.on('message', (evento, [pinNum]) => {
    var result;
    if (evento === 'change') {
      switch (pinNum) {
        case '7':
        case '8':
        case '9':
        result =  arduinoBoard.outPuts.leds.find( ({ pin }) => pin == pinNum );
        result.toggle();
        break;
        default:
      }
      // console.log(result);
    }
    io.emit('statechanged', getBoardStatus());
  });

});


//arma el objeto que le damos a vue
function getBoardStatus(){
  var led;
  var states = {
    outputs:{
      leds:[]
    },
    inputs:{
      analogs:[]
    }
  };
  //leds
  arduinoBoard.outPuts.leds.forEach(function(led, i) {
    states.outputs.leds[i]=led.custom;
    states.outputs.leds[i].state=arduinoBoard.outPuts.leds[i].isOn;
    states.outputs.leds[i].pin=arduinoBoard.outPuts.leds[i].pin;
  });
  return states;
}
