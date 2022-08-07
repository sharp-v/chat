<template>
  <div class="relation">
    <search></search>
    <van-cell title="系统公告" is-link value="内容" @click="click" />
    <van-cell title="通知消息" is-link value="内容" @click="click" />
    <van-tabs v-model:active="active" color="#1989fa">
      <van-tab title="好友">
        <van-cell
          v-for="(item, index) in map"
          :title="item[1].remark"
          v-show="item[1].type == TYPE.FRIEND"
          :key="index"
          @click="toExhibt(item[0])"
        >
          <template #icon>
            <avatar size="3rem" :avatarLink="getAvatar(item[0])" />
          </template>
        </van-cell>
      </van-tab>
      <van-tab title="群组">
        <van-cell
          v-for="(item, index) in map"
          :title="item[1].remark"
          v-show="item[1].type == TYPE.GROUP"
          :key="index"
          @click="toExhibt(item[0])"
        ></van-cell>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { Toast } from "vant";
import { RELATION, TOKEN_NAME } from "common/config";
import Avatar from "../../components/items/Avatar.vue";
import Search from "components/search/Search";

export default {
  name: "relation",
  setup() {
    const value = ref("");
    const active = ref(2);
    const TYPE = RELATION.TYPE;
    return { value, active, TYPE };
  },
  computed: {
    ...mapState({
      map: (state) => state.relation.map,
      access: (state) => state.current.access,
    }),
    ...mapGetters(["getProfile", "getAvatar"]),
  },
  methods: {
    ...mapActions(["initProfile", "initRelation"]),
    ...mapMutations(["setAccess"]),
    toExhibt(item) {
      this.setAccess(item);
      this.initProfile(item);
      this.$router.push("/exhibt");
    },
    click() {
      Toast("系统公告和通知消息，待开发");
    },
  },
  beforeRouteEnter() {
    if (!localStorage.getItem(TOKEN_NAME)) {
      return false;
    }
  },
  mounted() {
    this.initRelation();
  },
  components: {
    Search,
    Avatar,
  },
};
</script>

<style>
.relation {
  padding-bottom: 50px;
}
.relation .van-tabs .van-cell__title {
  display: flex !important;
  align-items: center !important;
  padding-left: 10px;
}
</style>