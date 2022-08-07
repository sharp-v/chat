<template>
  <router-view v-slot="{ Component, route }">
    <!-- <transition name="van-slide-right"> -->
    <keep-alive include="message,relation,space">
      <component
        :is="Component"
        :key="route.meta.usePathKey ? route.path : undefined"
      />
    </keep-alive>
    <!-- </transition> -->
  </router-view>
  <tabbar v-if="$route.meta.main"></tabbar>
</template>

<script>
import { mapActions } from "vuex";

import Tabbar from "./components/Tabbar.vue";

export default {
  name: "App",
  components: {
    Tabbar,
  },
  methods: {
    ...mapActions(["initRelation"]),
  },
  mounted() {},
};
</script>

<style>
@import url("./common/common.css");
</style>
