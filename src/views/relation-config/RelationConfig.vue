<template>
  <div class="relation-config">
    <van-nav-bar
      :title="relation ? relation.remark : '备注'"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
      class="nav-bar"
    ></van-nav-bar>
    <div class="main">
      <van-cell-group title="可更改项">
        <div v-for="(item, index) in relation" :key="index">
          <van-cell v-show="relConfigOption.get(index) != undefined">
            <template #title> {{ relConfigOption.get(index) }}</template>
            <template #value>
              <van-field
                v-if="index == 'remark'"
                rows="1"
                autosize
                :placeholder="relation.remark"
                v-model="relation.remark"
              />
              <van-popover
                v-if="index == 'reminderLevel'"
                v-model:show="showPopover"
                theme="dark"
                :actions="actions"
                @select="onSelect"
              >
                <template #reference>
                  <button class="reminder-config-button">
                    {{ reminderLevelOption.get(relation.reminderLevel) }}
                  </button>
                </template>
              </van-popover>
            </template>
          </van-cell>
        </div>
      </van-cell-group>
      <van-cell-group title="不可更改项">
        <div v-for="(item, index) in relation" :key="index">
          <van-cell v-show="relUnconfigOption.get(index) != undefined">
            <template #title> {{ relUnconfigOption.get(index) }}</template>
            <template #value>
              {{
                index == "createdAt" || index == "updatedAt"
                  ? new Date(Date.parse(item)).toLocaleString()
                  : item
              }}</template
            >
          </van-cell>
        </div>
      </van-cell-group>
    </div>
    <van-button type="primary" size="large" round @click="onSubmit"
      >保存提交</van-button
    >
  </div>
</template>

<script>
import { ref } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

const relUnconfigMap = new Map([
  ["contactId", "id"],
  ["createdAt", "创建时间"],
  ["updatedAt", "更新时间"],
]);
const relConfigMap = new Map([
  ["remark", "备注"],
  // ["relationGroupId", "分组"],
  ["reminderLevel", "提醒级别"],
]);
const reminderLevelMap = new Map([
  [0, "接收提醒"],
  [1, "接收不提醒"],
  [2, "不接收"],
]);

export default {
  setup() {
    const relation = ref();
    const relUnconfigOption = relUnconfigMap;
    const relConfigOption = relConfigMap;
    const reminderLevelOption = reminderLevelMap;
    const showPopover = ref(false);
    const actions = [
      { text: "接收提醒" },
      { text: "接收不提醒" },
      { text: "不接收" },
    ];
    const remark = ref();
    return {
      remark,
      actions,
      showPopover,
      relation,
      relUnconfigOption,
      relConfigOption,
      reminderLevelOption,
    };
  },
  computed: {
    ...mapState({
      access: (state) => state.current.access,
    }),
    ...mapGetters(["getRelation"]),
  },
  mounted() {
    this.relation = this.getRelation(this.access);
    this.remark = this.relation.remark;
  },
  methods: {
    ...mapActions(["setRelation"]),
    onSubmit() {
      this.setRelation({ key: this.access, relation: this.relation });
    },
    onSelect(action, index) {
      this.relation.reminderLevel = index;
    },
  },
};
</script>

<style>
.relation-config .reminder-config-button {
  color: rgb(50, 50, 51);
  box-shadow: rgba(100, 101, 102, 0.12) 0px 2px 12px 0px;
  border: none;
  width: 100%;
  border: 1px #aaa solid;
  background: #fff;
  overflow: hidden;
  font-size: 14px;
  border-radius: 10px;
}
.relation-config .van-cell,
.relation-config .van-cell .van-cell__title {
  display: flex;
  align-items: center;
}

.relation-config .van-cell .van-cell__value {
  display: flex;
  justify-content: flex-start;
}
.relation-config .van-cell .van-cell__value .van-cell {
  padding: 0;
}
</style>