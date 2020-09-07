<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <vue-scroll :ops="scrollPanel" class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </vue-scroll>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './logo'
import SidebarItem from './sidebar-item'
import variables from '@styles/variables.scss'
import vueScrollSetting from '@config/vue-scroll-setting'


export default {
  components: { SidebarItem, Logo },
  data () {
    return {
      sidebar: true,
      scrollPanel: vueScrollSetting
    }
  },
  watch: {

  },
  computed: {
    routes () {
      return this.$store.getters.routes
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route

      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }


      return path
    },
    showLogo () {
      return true
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar
    }
  }
}
</script>
