<template>
  <div class="user-info child-route">
    <van-nav-bar
      title="我的账户"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
      class="nav-bar"
    >
      <template #right>
        <van-icon name="more" size="24" />
      </template>
    </van-nav-bar>
    <div class="info-items main">
      <van-cell-group inset title="可修改项：">
        <van-field label="头像">
          <template #input>
            <van-uploader v-model="avatarFile" :after-read="afterReadAvatar" />
          </template> </van-field
        ><van-field label="背景图">
          <template #input>
            <van-uploader
              v-model="backImageFile"
              :after-read="afterReadBackImage"
            />
          </template>
        </van-field>
        <van-field v-model="user.nickName" label="昵称" />
        <van-field v-model="user.sign" type="text" label="签名" />
        <van-field v-model="user.phone" type="tel" label="手机号" />
        <van-field v-model="user.email" type="text" label="邮箱" />
      </van-cell-group>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="submit"
      >
        提交
      </van-button>
      <van-cell-group inset title="不可修改项：">
        <van-field v-model="user.id" type="text" label="ID" readonly />
        <van-field v-model="user.account" type="text" label="账户" readonly />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

import {
  uploadAvatar,
  uploadBackImage,
} from "../../../service/http/upload/index";
import { update } from "../../../service/http/account/index";
export default {
  setup() {
    const user = ref({
      id: "",
      nickName: "",
      phone: "",
      account: "",
      sign: "",
      createdAt: "",
      updatedAt: "",
      email: "",
      avatar: "",
      backImage: "",
    });
    const afterReadAvatar = (file) => {
      uploadAvatar(file.file).then((path) => {
        user.value.avatar = path;
      });
    };
    const afterReadBackImage = (file) => {
      uploadBackImage(file.file).then((path) => {
        user.value.backImage = path;
      });
    };
    const avatarFile = ref([
      {
        url: "",
        deletable: true,
        imageFit: "cover",
        previewSize: 120,
      },
    ]);
    const backImageFile = ref([
      {
        url: "",
        deletable: true,
        imageFit: "cover",
        previewSize: 120,
      },
    ]);
    return {
      user,
      afterReadAvatar,
      afterReadBackImage,
      avatarFile,
      backImageFile,
    };
  },
  computed: {
    ...mapState({
      access: (state) => state.current.user,
    }),
    ...mapGetters(["getAvatar", "getProfile", "getBackImage"]),
  },
  methods: {
    ...mapMutations(["profile"]),
    ...mapActions(["initUserProfile"]),
    submit() {
      console.log(this.user);
      update(this.user).then((flag) => {
        flag && this.profile({ key: this.access, profile: this.user });
      });
      console.log(this.user);
    },
  },
  mounted() {
    console.log(this.$route);
    this.user = this.getProfile(this.access);
    this.avatarFile[0].url = this.getAvatar(this.access);
    this.backImageFile[0].url = this.getBackImage(this.access);
  },
};
</script>

<style scoped>
.child-route {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
.user-info .info-items {
  padding: 50px 0;
  background: #fff;
  height: 120vh;
}
.user-info  .van-cell__title.van-field__label{
  width: 42px;
}
</style>