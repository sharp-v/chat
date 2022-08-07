<template>
  <div class="message">
    <search></search>
    <van-empty
      v-if="activeList.length == 0"
      description="没有消息"
      :image="require('assets/default/empty-image.png')"
    />
    <van-cell
      v-for="(item, index) in activeList"
      :key="index"
      :title="getName(item)"
      :label="getString(item)"
      @click="toChat(item)"
    >
      <template #icon>
        <avatar size="3rem" :avatarLink="getAvatar(item)" />
      </template>
      <template #value>
        <van-badge
          v-if="getUnReadCount(item) > 0"
          :content="getUnReadCount(item)"
          max="99"
        />
      </template>
    </van-cell>
  </div>
</template>

<script>
import Search from "components/search/Search";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import Avatar from "../../components/items/Avatar.vue";

import wsConnection from "service/websocket/index";
wsConnection.initWebSocket();

export default {
  name: "message",
  computed: {
    ...mapState({
      activeList: (state) => state.message.activeList,
      rmap: (state) => state.relation.map,
      mmap: (state) => state.message.map,
    }),
    ...mapGetters([
      "getLatestMessage",
      "getRelation",
      "getUnReadCount",
      "getProfile",
      "getAvatar",
    ]),
  },
  methods: {
    ...mapActions(["initProfile", "initRelation"]),
    ...mapMutations(["setAccess"]),
    toChat(item) {
      this.setAccess(item);
      this.$router.push("/chat");
    },
    getName(item) {
      let name = this.rmap ? this.getRelation(item) : "";
      if (name) {
        return name.remark;
      } else {
        this.initRelation();
      }
    },
    getString(item) {
      const message = this.getLatestMessage(item);
      if (message) {
        const string = message.main.content;
        if (string.length > 10) {
          return string.substring(0, 10) + "......";
        }
        return string;
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.rmap.size > 0 ? null : this.initRelation();
    // this.mmap.size > 0 ? null : console.log("0");
  },
  components: {
    Search,
    Avatar,
  },
};
</script>

<style>
.message {
  padding-bottom: 50px;
}
</style>