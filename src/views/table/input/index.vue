<template>
  <div class="input-container">
    input-container
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
      this.$message('这是一条消息提示')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
