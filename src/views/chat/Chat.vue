<template>
    <div class="chat">
        <van-nav-bar
            :title="relation ? relation.remark : '备注'"
            left-text="返回"
            left-arrow
            @click-left="$router.go(-1)"
            @click-right="$router.push('/relation-config')"
            class="nav-bar"
        >
            <template #right>
                <van-icon name="more" size="24" />
            </template>
        </van-nav-bar>
        <div class="main">
            <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh">
      </van-pull-refresh> -->
            <div class="content">
                <div v-for="(item, index) in getMessage(access)" :key="index">
                    <message-container :message="wrapperMessage(item, index)" />
                </div>
            </div>
        </div>
        <van-field
            class="input-message-item blur-bg"
            v-model="content"
            center
            clearable
            placeholder="键盘回车建或点击右侧按钮发送消息"
            @focus="focus($event)"
            @keyup.enter="enter()"
            @update:model-value="update()"
            @click="click()"
        >
            <template #button>
                <button class="send-message-button" @click="sendMessage">
                    发送
                </button>
            </template>
            <template #label>
                <button class="more-message-button" @click="more()">
                    <svg
                        t="1631719738192"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4493"
                        width="128"
                        height="128"
                    >
                        <path
                            d="M511.979978 20.021899C240.362897 20.021899 20.162052 240.222744 20.162052 511.839825s220.200845 491.817926 491.817926 491.817926S1003.797904 783.456906 1003.797904 511.839825 783.617081 20.021899 511.979978 20.021899L511.979978 20.021899zM786.13984 506.333803l0 15.136556L785.999687 521.470358c-2.102299 32.79587-29.392148 58.764273-62.728609 58.764273L580.374785 580.234632l0 205.765056-78.005318 0L502.369467 785.859534c-32.815892-2.122321-58.764273-29.372126-58.764273-62.708588l0-142.916315L237.840138 580.234632l0-78.005318 0.140153 0c2.122321-32.815892 29.372126-58.784295 62.708588-58.784295l142.896293 0 0-142.916315 0-62.868763 78.005318 0 0 0.160175c32.815892 2.102299 58.764273 29.372126 58.764273 62.708588l0 142.916315 205.785077 0L786.13984 506.333803 786.13984 506.333803zM786.13984 506.333803"
                            p-id="4494"
                            fill="#1296db"
                        ></path>
                    </svg>
                </button>
            </template>
        </van-field>
    </div>
    <short-cut-lable></short-cut-lable>
</template>

<script>
import { ref } from 'vue';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { Toast } from 'vant';

import shortCutLable from '../../../components/short-cut-lable/';

import { RELATION, USER_TYPE, MAX_SCROLL_VALUE } from '../../common/config';
import MessageContainer from './children/MessageContainer.vue';

export default {
    name: 'chat',
    setup() {
        const count = ref(0);
        const loading = ref(false);
        const unReadCount = ref(0);
        const onRefresh = () => {
            setTimeout(() => {
                Toast('待开发,bug++');
                loading.value = false;
                count.value++;
            }, 1000);
        };

        const relation = ref();
        const content = ref('');
        const TYPE = RELATION.TYPE;

        return {
            relation,
            content,
            TYPE,
            count,
            loading,
            onRefresh,
            unReadCount,
        };
    },
    computed: {
        ...mapState({
            access: (state) => state.current.access,
            map: (state) => state.message.map,
            length: (state) => state.message.map.size,
        }),
        ...mapGetters([
            'getRelation',
            'getMessage',
            'getProfile',
            'getMessageTime',
            'getUnReadCount',
        ]),
    },
    methods: {
        ...mapMutations(['messageRead', 'updateActiveList']),
        ...mapActions(['initProfile', 'commitMessage', 'initMessage']),
        sendMessage() {
            const message = {
                userId: this.relation.userId,
                main: {
                    sendId: this.relation.userId,
                    receiveId: this.relation.contactId,
                    sendType: this.relation.type,
                    content: this.content,
                },
                state: null,
                createdAt: Date.now(),
            };
            const key = this.access;
            this.commitMessage({ key, message });
            this.content = '';
            this.toBottomSmooth();
        },
        getUser(message) {
            let isMine = false;
            let key = JSON.stringify({
                id: message.main.sendId,
                type: USER_TYPE,
            });
            const relation = this.getRelation(key);
            let name = relation ? relation.remark : null;
            isMine = message.main.sendId == message.userId;
            return { name, key, isMine };
        },
        wrapperMessage(message, index) {
            const user = this.getUser(message);
            return {
                id: message.id,
                state: message.state,
                type: message.main.type,
                name: user.name,
                isMine: user.isMine,
                content: message.main.content,
                sendId: message.main.sendId,
                url: message.main.url,
                key: user.key,
                senderKey: message.senderKey,
                index,
            };
        },
        toBottom() {
            window.scrollTo({
                top: MAX_SCROLL_VALUE,
                behavior: 'auto',
            });
        },
        toBottomSmooth() {
            window.scrollTo({
                top: MAX_SCROLL_VALUE,
                behavior: 'smooth',
            });
        },
        focus(event) {
            event;
            this.toBottomSmooth();
        },
        enter() {
            this.sendMessage();
            this.toBottomSmooth();
        },
        update() {
            // this.toBottomSmooth();
        },
        click() {
            this.toBottomSmooth();
        },
        more() {
            Toast('待开发,目前仅支持发送单行文字消息');
        },
    },
    mounted() {
        this.initMessage(this.access);
        this.relation = this.getRelation(this.access);
        this.toBottom();
        this.unReadCount = this.getUnReadCount(this.access);
    },
    updated() {
        this.toBottomSmooth();
    },

    beforeUnmount() {
        this.messageRead(this.access);
        this.updateActiveList(this.access);
    },
    components: {
        MessageContainer,
        shortCutLable,
    },
};
</script>

<style>
:root {
    --van-field-label-width: 20px;
    --van-field-label-margin-right: 10px;
}
.chat {
    /* overflow-y: scroll;
  scroll-behavior: smooth; */
    font-size: 20px;
}

.chat .main {
    padding-top: 10vh;
    padding-bottom: 15vh;
}

.chat .input-message-item {
    position: fixed;
    bottom: 0;
    box-shadow: 0px 5px 10px #aaa;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.chat .input-message-item .send-message-button {
    color: #333;
    box-shadow: rgb(100 101 102 / 12%) 0px 1px 1px 0px;
    border: none;
    padding: 0 4vw;
    background: #fff;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}
.chat .input-message-item .send-message-button:focus {
    box-shadow: rgb(100 101 102 / 12%) 0px 2px 12px 0px;
    border: 2px #999 solid;
}

.chat .input-message-item .van-field__body {
    display: flex;
    justify-content: center;
    align-items: center;
}
.chat .input-message-item .van-field__body input:focus {
    border: 1px #999 solid;
}
.chat .input-message-item .van-field__body input {
    background: hsla(0, 0%, 100%) !important;
    backdrop-filter: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
    text-indent: 0.6em;
    font-size: 16px;
}
.chat .input-message-item .more-message-button,
.chat .input-message-item .send-message-button,
.chat .input-message-item .van-field__body input {
    border: 1px #ccc solid;
    border-radius: 7px;
    height: 2.2rem;
    line-height: 2.2rem;
    font-size: 14px;
}

.chat .input-message-item button.more-message-button {
    padding: none;
    margin-left: -15px;
    box-shadow: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border: none;
    color: #eee;
}
.chat .input-message-item button.more-message-button svg {
    height: 2rem;
    width: 2rem;
}
</style>
