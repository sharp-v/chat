<template>
  <div class="profile">
    <router-link to="/profile/user-info">
      <van-cell title="我的信息" is-link class="info">
        <template #icon>
          <avatar :avatarLink="getAvatar(user)" />
        </template>
      </van-cell>
    </router-link>
    <van-cell title="账户安全" is-link value="" class="other-item" @click="click()">
      <template #icon>
        <svg
          t="1631781393216"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5788"
          width="32"
          height="32"
        >
          <path
            d="M948.352 580.736c0 186.837333-322.304 382.890667-416.554667 436.266667a53.632 53.632 0 0 1-51.669333 0.725333C385.28 967.381333 64 782.08 64 580.693333V190.976a54.186667 54.186667 0 0 1 57.386667-54.186667c154.069333 8.704 292.352-79.36 354.090666-125.952a53.845333 53.845333 0 0 1 66.688 1.493334c57.728 47.317333 187.264 134.4 348.928 124.288a54.101333 54.101333 0 0 1 57.258667 54.186666v389.930667z"
            fill="#3ADBAF"
            p-id="5789"
          ></path>
        </svg>
      </template>
    </van-cell>
    <van-cell title="隐私设置" is-link value="" class="other-item" @click="click()">
      <template #icon>
        <svg
          t="1631781766797"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11189"
          width="32"
          height="32"
        >
          <path
            d="M518.033 722.585c-204.954 0-365.666-174.957-365.666-206.63 2.011-16.256 60.33-89.322 152.165-143.786l-24.802-24.802c-98.036 59.994-161.885 140.099-161.885 168.42 0 57.649 184.509 241.487 400.188 241.487 49.605 0 98.036-9.72 142.445-25.807l-26.98-26.981c-36.03 11.228-74.742 18.099-115.465 18.099z m0-448.452c-49.27 0-96.193 9.72-140.1 25.472l26.982 26.981c35.192-11.06 73.568-17.931 113.118-17.931 204.954 0 365.33 174.957 365.33 206.965 0 19.272-57.983 89.992-148.645 143.45l24.467 25.138c95.522-57.983 158.7-134.904 158.7-168.756 0-57.146-184.508-241.32-399.852-241.32z"
            p-id="11190"
          ></path>
          <path
            d="M582.888 652.87L376.593 445.235c-10.39 20.78-16.256 44.242-16.256 69.044 0 85.3 69.38 154.512 154.847 154.512 24.3 0 47.426-5.53 67.704-15.92z m86.975-138.59c0-85.636-69.38-154.847-154.511-154.847-22.792 0-44.577 4.86-64.185 13.741L655.451 579.47c9.217-19.775 14.412-42.063 14.412-65.19z m58.654 187.692l-25.472-25.64-66.196-66.866-215.679-217.69-52.118-52.453-25.473-25.808-45.247-45.583c-6.536-6.535-17.596-6.87-24.132 0-6.871 6.536-6.871 17.596-0.335 24.467l36.533 36.869h0.335l24.802 25.472 60.33 61L612.55 634.27l56.978 57.313 25.808 25.808 42.063 42.733c3.52 3.52 7.876 5.195 12.066 5.195 4.525 0 9.05-1.675 12.401-5.195 6.536-6.535 6.536-17.596 0-24.467l-33.349-33.684z"
            p-id="11191"
          ></path>
        </svg>
      </template>
    </van-cell>
    <van-cell
      title="退出登录"
      is-link
      value=""
      class="other-item"
      @click="logout()"
    >
      <template #icon>
        <svg
          t="1631782204958"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="37179"
          width="32"
          height="32"
        >
          <path
            d="M512 1024c282.784 0 512-229.216 512-512S794.784 0 512 0 0 229.216 0 512s229.216 512 512 512z"
            fill="#153568"
            p-id="37180"
          ></path>
          <path
            d="M606.816 342.528a22.624 22.624 0 0 1 12.544-19.52 25.856 25.856 0 0 1 24.384 0.384c77.12 43.264 124.288 121.184 124.256 205.248 0 132.192-114.624 239.36-256 239.36s-256-107.168-256-239.36c0-85.088 47.904-162.432 124.48-205.408 11.584-6.464 26.56-2.944 33.472 7.84 6.944 10.816 3.2 24.832-8.384 31.296-62.56 34.976-100.864 98.144-100.8 166.304 0 106.976 92.768 193.728 207.232 193.728s207.232-86.72 207.232-193.76c0-68.8-38.656-131.36-100.608-166.144a22.56 22.56 0 0 1-11.84-19.968zM544 278.4v179.2c0 12.384-14.336 22.4-32 22.4s-32-10.016-32-22.4V278.4c0-12.384 14.336-22.4 32-22.4s32 10.016 32 22.4z"
            fill="#49ECFF"
            p-id="37181"
          ></path>
        </svg>
      </template>
    </van-cell>
   
  </div>
  <router-view class="router-view" v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapState, mapGetters } from "vuex";

import Avatar from "../../components/items/Avatar.vue";
import {Toast} from 'vant'

import { TOKEN_NAME } from "common/config";
import { Dialog } from "vant";


export default {
  setup() {
    const profile = ref();
    return {
      profile,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.current.user,
    }),
    ...mapGetters(["getAvatar", "getProfile"]),
  },
  methods: {
    ...mapActions(["initUserProfile"]),
    getName() {
      if (this.profile && this.profile.nickName) {
        return this.profile.nickName;
      } else {
        return "我的信息";
      }
    },
    logout() {
      Dialog.confirm({
        title: "确认退出吗",
        message: "退出后，再次连接需要重新登录哦",
      })
        .then(() => {
          // on confirm
          this.$router.push("/login");
          localStorage.removeItem(TOKEN_NAME);
        })
        .catch(() => {
          // on cancel
        });
    },
    click(){
      Toast('待开发')
    }
  },
  mounted() {
    this.initUserProfile();
    this.profile = this.getProfile(this.user);
  },
  components: {
    Avatar,
  },
};
</script>

<style scoped>
.profile {
  padding: 1rem 2rem;
  padding-bottom: 50px;
}
.profile .van-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px #efefef solid;
}

.profile .van-cell.info {
  height: 20vh;
  padding: none !important;
}
.profile .other-item {
  padding: 1.4rem 0;
}
</style>