<template>
  <div>

    <div v-for="out in outputs.leds" class="">
      <div class="container">
        <h3>{{out.name}}</h3>
      <label class="switch">{{out.status}}
          <input type="checkbox" @change='change' :checked="out.state" :value="out.pin"/>
          <span class="slider round"></span>
      </label>
      </div>
    </div>

    <br>

    <!-- <input type="range" min="0" max="1000" :value="analogReads.a0"> -->


  </div>
</template>
<style media="screen">
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
<script>

import io from 'socket.io-client';

export default {
  data() {
    return {
      socket : io('http://192.168.1.113:8080'),
      outputs:'',
      inputs:''
    }
  },
  methods: {
    change: function() {
      console.log(event.target.value);
      this.socket.send('change', [event.target.value]);
    },
  },
  mounted(){
    this.socket.on('mount', (data) => {
      console.log(data);
      this.outputs=data.outputs;
      // this.updatePanel(data);
    });
    this.socket.on('statechanged', (data) => {
      // this.updatePanel(data);
      this.outputs=data.outputs;
    });
    // this.socket.on('analogsemit', (data) => {
    //   this.analogReads=data;
    // });
  }
}
</script>
