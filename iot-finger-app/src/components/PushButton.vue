<template>
  <div class="push-button">
    <div v-if="msg" class="notification is-primary">
      {{msg}}
    </div>
    <button @mousedown="mousedown($event)" @mouseup="mouseup($event)">
      <icon name="hand-o-down" scale="10"></icon>
    </button>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon';
import axios from 'axios';

export default {
  name: 'push-button',
  data() {
    return {
      data: null,
      msg: '',
      mouseDownTimeStamp: null
    }
  },
  components: {
    Icon
  },
  methods: {
    mousedown(event){
      this.mouseDownTimeStamp = event.timeStamp;
    },
    mouseup(event){
      const duration = ( event.timeStamp - this.mouseDownTimeStamp ) / 1000;
      this.msg = duration;
      publish(duration);
    },
    publish(duration) {
      axios.post(`${process.env.SERVER_URL}/pushbutton/start`, {duration: duration})
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
</style>

