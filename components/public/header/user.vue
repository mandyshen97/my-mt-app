<template>
  <div class="my-user">
    <!-- 已经登陆状态 -->
    <template v-if="user">
      欢迎您， <span class="username">{{ user }}</span> [<nuxt-link to="/exit"
        >退出</nuxt-link
      >]
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
      /**
       *什么时候请求接口'/users/getUser'获取user呢？有两种方式
          1. 在vuex中同步这种状态
          2. 不增加 SSR 负担，在组件中页面渲染完毕之后，再去调用接口'/users/getUser'
        这里使用异步获取,在mounted生命周期：组件挂载到页面，渲染完毕再去请求，达到异步获取的效果
       */
    };
  },
  async mounted() {
    // 请求接口,get后返回一个promise对象，可以利用.then的方式去处理，还可以用async
    const {
      status,
      data: { user }
    } = await this.$axios.get("/users/getUser");
    // getUser返回值是一个user和一个email，所以解构的时候，status是axios最外层的一个对象，是获取http前状态的
    // data里面的部分才是getUser真正返回的内容，也就是user和email
    if (status === 200) {
      this.user = user;
    }
  }
};
</script>

<style lang="scss"></style>
