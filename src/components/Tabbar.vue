<template>
  <van-tabbar v-model="active" z-index="9">
    <van-tabbar-item icon="chat" :badge="getTotal()" to="/message"
      >消息</van-tabbar-item
    >
    <van-tabbar-item icon="friends" to="/relation">瓜葛</van-tabbar-item>
    <van-tabbar-item icon="browsing-history" to="/space">空间</van-tabbar-item>
    <van-tabbar-item icon="setting" to="/profile">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { ref } from "vue";
import { mapState } from "vuex";

export default {
  setup() {
    const active = ref(-1);
    return {
      active,
    };
  },
  computed: {
    ...mapState({
      total: (state) => state.message.unReadTotal,
    }),
  },
  methods: {
    getTotal() {
      if (this.total > 99) {
        return "99+";
      } else if (this.total > 0) {
        return this.total;
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
</style>