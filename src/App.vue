<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  watch: {
    $route (newValue) {
      return newValue
    }
  },
  created () {

  },
  mounted () {
    const self = this
    window.onbeforeunload = function () {
      const n = window.event.screenX - window.screenLeft
      const b = n > document.documentElement.scrollWidth - 20
      if ((b && window.event.clientY < 0) || window.event.altKey) {
        console.log('是关闭而非刷新')
      } else { // 刷新
        if (self.$route.path !== '/login') {
          self.$utils.storage.set({ type: 'local', key: 'currentPage', data: self.$route.fullPath })
        }
      }
    }
  },
  methods: {

  }
}
</script>

