<template>
  <div class="m-header">
    <el-row>
      <el-col>
        <top-bar />
      </el-col>
    </el-row>
    <el-row>
      <el-col>searchbar</el-col>
    </el-row>
  </div>
</template>

<script>
import topBar from "./topbar";
export default {
  components: {
    topBar
  }
};
</script>

<style lang="css"></style>
