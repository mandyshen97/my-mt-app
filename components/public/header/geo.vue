<template>
  <div class="m-geo">
    <!-- 图标 -->
    <!-- store是vuex实例，state获取状态的，geo模块名称，position模块下的变量 -->
    <i class="el-icon-location">{{ this.$store.state.geo.position.city }}</i>
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>
<script>
export default {
  mounted(){
    console.log(this.$store)
  }
};
</script>
<style lang="css"></style>
