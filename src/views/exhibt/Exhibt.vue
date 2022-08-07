<template>
  <div class="exhibt">
    <van-nav-bar
      :title="title()"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="toRelationConifg()"
      class="nav-bar"
    >
      <template #right>
        <van-icon name="more" size="24" />
      </template>
    </van-nav-bar>
    <div class="main">
      <van-image fit="cover" class="background" :src="getBackImage(access)" />
      <div class="avatar-wrapper">
        <div class="avatar-item">
          <avatar :avatarLink="getAvatar(access)" size="80" />
        </div>
      </div>
      <div class="profile-items">
        <div
          class="profile"
          v-for="(value, index) in profile ? profile : []"
          :key="index"
        >
          <van-cell icon="user-circle-o" v-show="value">
            <template #title>
              <span> {{ index }} : {{ value }} </span>
            </template>
          </van-cell>
        </div>
      </div>
      <div class="buttons">
        <van-button
          class="button"
          plain
          type="primary"
          v-if="
            !relation ||
            (relation.type != TYPE.FRIEND && relation.type != TYPE.GROUP)
          "
          @click="addRelation()"
          >{{
            profile && profile.ownId != undefined ? newGroupWord : newFriendWord
          }}
        </van-button>
        <van-button class="button" type="primary" @click="toChat()"
          >发消息</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

import { Toast } from "vant";

import Avatar from "../../components/items/Avatar.vue";

import { RELATION } from "../../common/config";

export default {
  setup() {
    const profile = ref();
    const relation = ref();
    const TYPE = RELATION.TYPE;
    return {
      profile,
      relation,
      TYPE,
    };
  },
  data() {
    return {
      newFriendWord: "添加好友",
      newGroupWord: "申请加群",
    };
  },
  computed: {
    ...mapState({
      access: (state) => state.current.access,
    }),
    ...mapGetters(["getProfile", "getRelation", "getAvatar", "getBackImage"]),
  },
  methods: {
    ...mapActions(["initProfile"]),
    title() {
      if (this.relation) {
        return this.relation.remark;
      } else if (this.profile) {
        return this.profile.nickName;
      } else {
        return "备注";
      }
    },
    toChat() {
      console.log(this.access);
      this.$router.push("/chat");
    },
    addRelation() {
      console.log(this.access);
      console.log(this.getProfile(this.access));
      Toast("待开发");
    },
    toRelationConifg() {
      if (this.getRelation(this.access)) {
        this.$router.push("/relation-config");
      } else {
        Toast('暂时不能设置')
      }
    },
  },
  mounted() {
    this.profile = this.getProfile(this.access);
    !this.profile ? this.initProfile(this.access) : null;
    this.relation = this.getRelation(this.access);
  },
  components: {
    Avatar,
  },
};
</script>

<style >
:root {
  --van-cell-background-color: transparent;
  --van-cell-text-color: none;
}
.exhibt {
  /* background-image: linear-gradient(60deg, #29323c 0%, #485563 100%); */
}
.exhibt .buttons {
  position: fixed;
  bottom: 3vh;
  display: flex;
  width: 100vw;
  flex-direction: row;
  justify-content: space-evenly;
  z-index: 3;
}
.exhibt .buttons .button {
  flex: 1;
  margin: 0 20px;
}
.exhibt .background-image {
  width: 100vw;
  height: 40vh;
}
.exhibt .avatar-wrapper {
  position: relative;
  left: 1.6rem;
  top: -3.5rem;
  width: 0;
  height: 0;
}

.exhibt .avatar-item {
  margin: 0;
  position: relative;
  height: 82px;
  width: 82px;
  border-radius: 50%;
  border: 3px #1989fa solid;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.exhibt .main .profile-items {
  margin-top: -1rem;
  padding-top: 3rem;
  padding-bottom: 50vh;
  background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
  color: #eee !important;
}
</style>