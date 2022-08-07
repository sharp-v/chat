<template>
  <div class="message-container">
    <div class="time">
      {{ getMessageTime(access, message.index) }}
    </div>
    <div class="wrapper-message">
      <div class="name" :class="{ right: message.isMine }">
        <div class="text">
          {{ message.isMine ? "我" : message.name }}
        </div>
      </div>
      <div :class="{ isMine: message.isMine }" class="wrapper-content">
        <div class="message-avatar" v-if="!message.isMine">
          <avatar size="36px" :avatarLink="getAvatar(message.senderKey)" />
        </div>
        <div class="content">
          {{ message.content }}
        </div>
        <div class="message-avatar" v-if="message.isMine">
          <avatar size="36px" :avatarLink="getAvatar(message.senderKey)" />
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import Avatar from "../../../components/items/Avatar.vue";

export default {
  computed: {
    ...mapState({
      access: (state) => state.current.access,
    }),
    ...mapGetters([
      "getRelation",
      "getMessage",
      "getProfile",
      "getMessageTime",
      "getAvatar",
    ]),
  },
  methods: {
    ...mapActions(["initProfile", "commitMessage"]),
  },
  props: {
    message: {
      type: Object,
      default: () => {
        return {
          id: -1,
          state: 0,
          messageId: -1,
          type: 0,
          name: "",
          isMine: false,
          content: "",
          url: "",
          key: {
            id: "",
            type: "",
          },
          index: 0,
        };
      },
    },
  },
  mounted() {
  },
  components: {
    Avatar,
  },
};
</script>

<style scoped>
.message-container {
  font-size: 14px;
  padding: 0 10px;
}

.time {
  display: flex;
  justify-content: center;
  text-align: center;
}

.name {
  font-size: 12px;
  color: #333;
}
.name .text {
  width: 48px;
  text-align: center;
}

.wrapper-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wrapper-message .name {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.wrapper-message .name.right {
  justify-content: flex-end;
}

.wrapper-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 100%;
  color: #fff;
}

.content {
  max-width: 75%;
  padding: 10px;
  background: linear-gradient(-180deg, #265583 0%, #929ead 98%),
    radial-gradient(
      at top left,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  background-blend-mode: screen;
  border-radius: 1em;
  word-break: break-word;
}

.isMine {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
}
.isMine .content {
  background-image: linear-gradient(60deg, #2af598 -40%, #009efd 100%);
}
</style>