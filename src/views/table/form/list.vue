<template>
  <div class="list-container">
    列表页
    <el-button :plain="true" @click="open">打开消息提示</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  filters: {},
  created () {
  },
  mounted () {
  },
  updated () {
  },
  destroyed () {
  },
  activated () { // keepAlive启用
  },
  deactivated () { // keepAlive停用
  },
  methods: {
    open () {
      this.$router.push({
        path: '/table/form/detail',
        query: {
          id: '15585'
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
