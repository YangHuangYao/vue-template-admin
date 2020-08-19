<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: 'oiswswsws',
      arryy: [1, 2, 2, 3, 5],
      sgs: 'df'
    }
  },
  created() {
    const self = this,
      flag =
        self.sgs === 'df'
          ? 'sdfsdf0'
          : self.sgs === 'dd'
          ? 'drd'
          : self.sgs === 'dd'
          ? 'drd'
          : false
    if (this.msg === 'oiooop') {
      console.log(this.msg)
    }
  },
  sdds() {
    let sdf
  }
}
</script>
