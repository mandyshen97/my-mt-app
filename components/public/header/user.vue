<template>
  <div class="my-user">
    <!-- 已经登陆状态 -->
    <template v-if="user">
      欢迎您， <span class="username">{{ user }}</span> 
      [<nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <!-- 未登录状态 -->
    <template v-else>
      <nuxt-link to="/login" class="login">立即登录</nuxt-link>
      <nuxt-link to="/register" class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ""
    };
  }
};
</script>

<style lang="css"></style>
