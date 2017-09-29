<template>
  <div>
    <section class="section">
      <div v-if="msg" class="notification is-primary">
        {{msg}}
      </div>
      <i v-if="msg === ''" v-bind:class="{ 'fa-spin': pressed }" class="fa fa-spinner fa-5x"></i>
    </section>
    <section class="section">
      <span class="tag is-info">{{timer}} seconds</span>
    </section>
    <section class="section">
      <div class="push-button content">
        <button id="button">
          <i class="fa fa-hand-o-down fa-5x"></i>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import Hammer from 'hammerjs'


export default {
  name: 'push-button',
  data() {
    return {
      data: null,
      msg: '',
      timeInterval: null,
      timer: 0,
      pressed: false,
      pushButtonDoneTopic: 'iotfinger/pushbutton/done'
    }
  },
  created() {
    this.$options.sockets[this.pushButtonDoneTopic] = (msg) => {
      this.msg = msg.data;
    }
  },
  mounted() {
    this.setupTouch();
  },
  methods: {
    setupTouch() {
      const button = document.getElementById('button');
      const mc = new Hammer(button);
      mc.on("press pressup", ev => {
        console.log(ev.type);
        if (ev.type === 'press') {
          this.press();
        }
        if (ev.type === 'pressup') {
          this.pressup();
        }
      });
    },
    press() {
      clearInterval(this.timeInterval);
      this.timer = 0;
      this.pressed = true;
      this.timeInterval = setInterval(() => {
        this.timer += 1;
      }, 1000);
    },
    pressup() {
      clearInterval(this.timeInterval);
      this.publish(this.timer);
      this.pressed = false;
    },
    publish(duration) {
      axios.post(`${process.env.SERVER_URL}/pushbutton/start`, { duration: duration })
        .then(response => {
          this.setMsg(response.statusText);
        }).catch(error => {
          this.setMsg(error);
        });
    },
    setMsg(msg) {
      this.msg = msg;
      setTimeout(() => { this.msg = ''; }, 3000);
    }
  }
}
</script>
<style>
.push-button button {
  background-color: Transparent;
  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
  outline: none;
}

.push-button-spinner {
  color: #fff;
  text-shadow: 1px 1px 1px #ccc;
  font-size: 1.5em;
}
</style>

