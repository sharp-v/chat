<template>
  <div class="search">
    <van-search
      v-model="value"
      shape="round"
      show-action
      :placeholder="searchOption[optionValue].text + '搜索'"
      @focus="focus()"
      @blur="blur()"
    >
      <template #left>
        <van-popover
          v-model:show="showPopover"
          theme="dark"
          :actions="searchOption"
          @select="onSelect"
          placement="bottom-start"
        >
          <template #reference>
            <button type="primary" class="search-button">选项</button>
          </template>
        </van-popover>
      </template>
      <template #action>
        <button @click="onSearch" class="search-button">搜索</button>
      </template>
    </van-search>
    <div class="search-result" v-show="searchFocus" @click="closeSearch()">
      <div class="results" v-show="showResult">
        <van-cell-group
          title="用户"
          v-if="result.users && result.users.length > 0"
        >
          <van-cell
            :title="item.nickName"
            :value="item.account"
            v-for="(item, index) in result.users"
            :key="index"
            @click.stop="toExhibt(item)"
          />
        </van-cell-group>
        <van-cell-group
          title="群组"
          v-if="result.groups && result.groups.length > 0"
        >
          <van-cell
            :title="item.name"
            :value="item.ownId"
            v-for="(item, index) in result.groups"
            :key="index"
            @click.stop="toExhibt(item)"
          />
        </van-cell-group>
      </div>
      <div class="close-tips">(点击空白处退出搜索)</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapMutations } from "vuex";

import { Toast } from "vant";
import { GROUP_TYPE, USER_TYPE } from "../../common/config";

import { queryByKeyWord } from "../../service/http/query";

const QUERY_TYPE = {
  KEY_WORD: 0,
  ACCOUNT: 1,
  GROUP: 2,
  LOCAL: 3,
};

export default {
  setup() {
    const showPopover = ref(false);
    const value = ref("");
    const result = ref("");
    const searchFocus = ref(false);
    const showResult = ref(false);
    const optionValue = ref(QUERY_TYPE.KEY_WORD);
    const searchOption = [
      { text: "关键字", value: QUERY_TYPE.KEY_WORD },
      { text: "账户", value: QUERY_TYPE.ACCOUNT },
      { text: "群组", value: QUERY_TYPE.GROUP },
      { text: "本地", value: QUERY_TYPE.LOCAL },
    ];

    return {
      showPopover,
      value,
      result,
      searchFocus,
      optionValue,
      searchOption,
      showResult,
    };
  },
  methods: {
    ...mapMutations(["setAccess"]),
    onSelect(action, index) {
      this.optionValue = this.searchOption[index].value;
    },
    onSearch() {
      console.log("search");
      this.openSearch();
      switch (this.optionValue) {
        case QUERY_TYPE.KEY_WORD:
          queryByKeyWord(this.value).then((res) => {
            this.result = res;
            this.showResult = true;
          });
          break;
        case QUERY_TYPE.ACCOUNT:
          Toast("功能待完成");
          break;
        case QUERY_TYPE.GROUP:
          Toast("功能待完成");
          break;
        case QUERY_TYPE.LOCAL:
          Toast("功能待完成");
          break;
      }
    },
    focus() {
      this.openSearch();
    },
    blur() {
      this.closeSearch();
    },
    openSearch() {
      console.log("open");
      this.searchFocus = true;
    },
    closeSearch() {
      console.log("close");
      this.searchFocus = false;
    },
    toExhibt(item) {
      const key = JSON.stringify({
        id: item.id,
        type: item.ownId ? GROUP_TYPE : USER_TYPE,
      });
      this.setAccess(key);
      this.$router.push("/exhibt");
    },
  },
};
</script>

<style >
.search-button {
  border-radius: 50px;
  height: 34px ;
  padding: 0 2vw;
}

.search-button {
  color: rgb(50, 50, 51);
  box-shadow: rgba(100, 101, 102, 0.12) 0px 2px 12px 0px;
  border: none;
  padding: 0 4vw;
  background: #fff;
  overflow: hidden;
  font-size: 14px;
}
.search-button:active,
.search-button:focus {
  background: #fff;
  color: rgb(25, 137, 250);
}

.search-result {
  position: fixed;
  top: 68px;
  height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 2;
}

.search .search-result .close-tips {
  display: flex;
  justify-content: center;
  padding: 5vh 0;
  color: #999;
}
</style>