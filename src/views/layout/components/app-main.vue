<template>
  <section id="appMain"
           :style="{height:height}"
           class="app-main">
    <vue-scroll :ops="scrollPanel"
                class="scrollbar-wrapper">
      <transition name="fade-transform"
                  mode="out-in">
        <router-view ref="children"
                     :key="key" />
      </transition>
    </vue-scroll>
  </section>
</template>

<script>
import vueScrollSetting from '@config/vue-scroll-setting'

export default {
  name: 'AppMain',
  data() {
    return {
      scrollPanel: vueScrollSetting,
      height: 'auto'
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {
    this.childrenData = this.$refs.children.$data
    // 根据自身位置变化设置高度
    const appMainRect = document.getElementById('appMain').getBoundingClientRect()
    this.height = `calc(100vh - ${appMainRect.top}px)`
  }
}
</script>

