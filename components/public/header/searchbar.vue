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
            <dd v-for="(item, index) in hotPlace" :key="index">{{ item }}</dd>
          </dl>
          <dl class="searchList" v-if="isSearchList">
            <dd v-for="(item, index) in searchList" :key="index">{{ item }}</dd>
          </dl>
        </div>
        <p class="suggest">
          推荐
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
export default {
  data() {
    return {
      search: "",// 搜索框内容是否为空
      isFocus: false,// 是否聚焦
      hotPlace: ["故宮", "故宮", "故宮", "故宮"],
      searchList: ["美食", "美食", "美食", "美食", "美食"]
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
      let self = this
      setTimeout(function(){
        self.isFocus = false
      },200)
    },
    input:function(){
      // todo
    }
  }
};
</script>

<style></style>
