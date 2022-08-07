<template>
  <div class="space">
    <van-empty :image="require('assets/default/empty-image.png')" description="待开发" />
  </div>
</template>

<script>
export default {
  name: "space",
  beforeCreate() {
    console.log("space create");
  },
};
</script>

<style>
</style>