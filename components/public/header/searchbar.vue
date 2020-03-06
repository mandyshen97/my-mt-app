<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团"
        />
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家或地點"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search"></i>
          </button>
          <dl class="hotPlace" v-if="isHotPlace">
            <dt>热门搜索</dt>
            <dd
              v-for="(item, index) in $store.state.home.hotPlace
                ? $store.state.home.hotPlace.slice(0, 5)
                : []"
              :key="index"
            >
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
          <dl class="searchList" v-if="isSearchList">
            <dd v-for="(item, index) in searchList" :key="index">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            :href="'/products?keyword=' + encodeURIComponent(item.name)"
            v-for="(item, index) in $store.state.home.hotPlace
              ? $store.state.home.hotPlace.slice(0, 5)
              : []"
            :key="index"
            >{{ item.name }}</a
          >
        </p>
        <ul class="nav">
          <li><nuxt-link to="/" class="takeout">美团外卖</nuxt-link></li>
          <li><nuxt-link to="/" class="movie">猫眼电影</nuxt-link></li>
          <li><nuxt-link to="/" class="hotel">美团酒店</nuxt-link></li>
          <li><nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link></li>
          <li><nuxt-link to="/" class="business">商家入驻</nuxt-link></li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li>
            <i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li>
            <i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      search: "", // 搜索框内容是否为空
      isFocus: false, // 是否聚焦
      hotPlace: [],
      searchList: []
    };
  },
  computed: {
    // 热点地方
    isHotPlace: function() {
      // 已经聚焦 && 搜索内容为空 的时候显示热门地点
      return this.isFocus && !this.search;
    },
    // 搜索列表
    isSearchList: function() {
      // 已经聚焦 && 搜索内容不为空 的时候显示搜索列表
      return this.isFocus && this.search;
    }
  },
  methods: {
    focus: function() {
      this.isFocus = true;
    },
    blur: function() {
      //setInterval和setTimeout中传入函数时，函数中的this会指向window对象，所以用self现将this存起来
      let self = this;
      setTimeout(function() {
        self.isFocus = false;
      }, 200);
    },
    // 每输入一个字母都进行一次请求，显然浪费性能,所以引入lodash插件 debounce 函数防抖
    // 只有在最后一次点击的300ms后，真正的函数func才会触发
    input: _.debounce(async function() {
      let self = this;
      // 将后面的那个市字去掉， 因为第三方服务的限制，带着这个字就查不到
      let city = self.$store.state.geo.position.city.replace("市", "");
      // 先将搜索列表清空
      self.searchList = [];
      // 发送请求进行搜索
      let {
        status,
        data: { top }
      } = await self.$axios.get("/search/top", {
        params: {
          input: self.search,
          // city: '北京'
          city
        }
      });
      // 数据截取十条
      self.searchList = top.slice(0, 10);
    }, 300)
  }
};
</script>

<style></style>
