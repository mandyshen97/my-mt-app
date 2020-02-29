<template>
  <div class="m-menu">
    <!-- 一级分类的DOM结构 -->
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item, index) in menu" :key="index" @mouseenter="enter">
        <i :class="item.type" />
        {{ item.name }}
        <span class="arrow"></span>
      </dd>
    </dl>
    <!-- 二级分类的DOM结构 -->
    <!-- 因为全部分类下的分类项和分类项下的组件是并行结构
    也就是我要是鼠标移入到分类项下的组件部分，就算做成移出了全部分类,这样的话，依照之前的原理，mouseleave触发事件令 kind值为空，组件就会不显示,也就是说，我没法实现：移动到分类项下的组件,所以要解决这个问题,给分类项下的组件绑定事件    -->
    <div
      class="detail"
      v-if="kind"
      @mouseenter="temEnter"
      @mouseleave="temLeave"
    >
      <!-- 在每个子分类下面这样遍历 -->
      <template v-for="(item, index) in curdetail.child">
        <h4 :key="index">{{ item.title }}</h4>
        <span v-for="v in item.child" :key="v">
          {{ v }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: "", // 一级分类
      // 数据结构
      menu: [
        {
          type: "food",
          name: "美食",
          id: 11,
          child: [
            {
              title: "美食",
              child: ["火锅", "汉堡", "小龙虾", "烤冷面", "小可爱"]
            }
          ]
        },
        {
          type: "takeout",
          name: "外卖",
          id: 12,
          child: [
            {
              title: "外卖",
              child: ["麻辣烫", "烤肉拌饭", "板面", "炒面", "小可爱2号"]
            }
          ]
        },
        {
          type: "hotel",
          name: "酒店",
          id: 13,
          child: [
            {
              title: "酒店管理",
              child: ["七天", "汉庭", "如家", "南郊", "小可爱3号"]
            },
            {
              title: "酒店管理",
              child: ["六天", "34填1", "1如家", "2南郊", "3小可爱3号"]
            },
            {
              title: "酒店管理",
              child: ["9七天", "5汉庭", "4如家", "6南郊", "4小可爱3号"]
            }
          ]
        }
      ]
    };
  },
  computed: {
    // （2）计算属性curdetail,当kind改变，重新计算curdetail的值
    curdetail: function() {
      // 设置过滤器，取到所有 type 和 kind 相等数据中的第一个
      let res = this.menu.filter(item => item.type === this.kind)[0];
      return res;
      // 此时的curdetail中存储的值 就是x对应menu中的数据，然后在dom中进行渲染
    }
  },
  methods: {
    // （1）当鼠标划过全部分类部分，触发事件@mouseenter="enter"->enter, enter事件改变kind值为鼠标划过当前i元素(比如说叫x) 的className值
    enter: function(e) {
      this.kind = e.target.querySelector("i").className;
    },
    //（3）然后鼠标离开全部分类大框后绑定事件，@mouseleave="mouseleave"，mouseleave事件：让kind值为空，实现鼠标离开后，分类项下的组件不显示
    mouseleave() {
      let self = this;
      //延时的原因：我们鼠标移动到分类项下的组件时,必然：先触发mouseleave事件，然后kind就为'',因为之前设置组件显示：v-if="kind",所以此时分类项下的组件又不显示了，就很矛盾，所以这里设置了延迟
      self._timer = setTimeout(function() {
        self.kind = "";
      }, 150);
    },
    // （4）如果从全部分类出来，移入到子分类，就将定时器清除，kind不设置为''，子分类继续显示
    temEnter: function() {
      clearTimeout(this._timer);
    },
    // （5）如果从全部分类一出来，不是移入子分类，那就将kind改变为空，不显示子分类
    temLeave: function() {
      this.kind = "";
    }
  }
};
</script>

<style lang="css"></style>
