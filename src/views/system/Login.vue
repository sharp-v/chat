<template>
  <div class="login">
    <van-tabs v-model:active="active" color="#1989fa">
      <van-tab title="登录">
        <van-form @submit="onLoginSubmit">
          <van-cell-group inset>
            <van-field
              v-model="account"
              name="account"
              label="账号"
              placeholder="账号"
              :rules="[{ required: true, message: '请填写账号' }]"
            />
            <van-field
              v-model="loginPassword"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              autocomplete
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="注册">
        <van-form @submit="onRegisterSubmit">
          <van-cell-group inset>
            <van-field
              v-model="account"
              name="account"
              label="账号"
              placeholder="账号"
              :rules="[{ required: true, message: '请填写账号' }]"
            />
            <van-field
              v-model="registerPassword"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              autocomplete
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              注册
            </van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
  </div>
  <Illustrate />
</template>

<script>
import { ref } from "vue";
import { mapActions } from "vuex";
import { login, register } from "http/system/base";
import Illustrate from "components/illustrate/Illustrate.vue";
export default {
  setup() {
    const account = ref("panda");
    const loginPassword = ref("apanda");
    const registerPassword = ref("");
    const active = ref(0);
    return {
      account,
      loginPassword,
      registerPassword,
      active,
    };
  },
  methods: {
    ...mapActions(["initProfile", "initRelation"]),
    onLoginSubmit(values) {
      login(values).then((res) => {
        if (res) {
          this.initRelation();
          this.$router.push("/message");
        }
      });
    },
    onRegisterSubmit(values) {
      register(values).then((res) => {
        res && (this.active.value = 1);
      });
    },
  },
  components: {
    Illustrate,
  },
};
</script>

<style></style>
