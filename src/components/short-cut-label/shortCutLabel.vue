<template>
    <div class="short-cut-label">
        <div
            class="short-cut-label-content"
            ref="content"
            @touchstart="onTouchStart($event)"
            @touchend="onTouchEnd($event)"
        >
            <slot v-if="!dataValue"></slot>
            <div v-else>{{ dataValue }}</div>
        </div>
        <!-- panel -->
        <div class="panel" ref="panel">
            <!-- panel subscript -->
            <div class="panel-subscript" ref="subscript"></div>
            <div class="panel-items-wrapper" ref="panelItemsWrapper">
                <!-- panel item -->
                <div
                    class="panel-item"
                    v-for="(item, index) in panels"
                    :key="index"
                    @click="
                        item.onClick(
                            $event,
                            configPaneVisiable,
                            onCopy,
                            item,
                            index,
                        )
                    "
                >
                    <!-- v-if='item.availableTypes.get(dataValue)' -->
                    <a :href="item.url" class="panel-item-container">
                        <i class="aidicon" ref="aidicons"></i>
                        <div class="item name">
                            {{ item.name }}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const TEXT = 'test';

const generateRandomString = (length = 8) => {
    let randomStr = '';
    const DEFAULT_GENERATE_SIZE = 8;
    const MAX_GENERATE_SIZE = 16;
    length = length > MAX_GENERATE_SIZE ? MAX_GENERATE_SIZE : length;
    length = length < 0 ? DEFAULT_GENERATE_SIZE : length;
    const charArr =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    while (length) {
        randomStr += charArr[~~(Math.random(charArr.length) * charArr.length)];
        --length;
    }
    return randomStr;
};

export default {
    name: 'short-cut-label',
    props: {
        dataValue: {
            type: String,
            default: '',
        },
        dataType: {
            type: String,
            default: 'TEXT',
        },
        showPanelConfig: {
            type: Boolean,
            default: false,
        },
        panelList: {
            type: Array,
            default() {
                return [];
            },
        },
        isCustomizePanel: {
            type: Boolean,
            default: false,
        },
        triggerPanelTime: {
            type: Number,
            default: 300,
        },
        panelStyle: {
            type: Object,
            default() {
                return {};
            },
        },
        panelItemStyle: {
            type: Object,
            default() {
                return {};
            },
        },
        subScriptStyle: {
            type: Object,
            default() {
                return {};
            },
        },
        contentStyle: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            loop: null,
            screenWidth: document.documentElement.clientWidth,
            screenHeigh: document.documentElement.clientHeight,
            isShowPanel: false,
            panels: [
                {
                    id: 'copy',
                    name: '复制',
                    icon: 'copy',
                    avaliableTypes: new Map([['TEXT', true]]),
                    onClick: ($event, callback) => this.onCopy(callback),
                },
            ],
        };
    },
    watch: {
        // 控制panel显影
        showPanelConfig: {
            handle(val) {
                this.configPanelVisiable(val);
            },
        },
    },
    beforeMount() {
        // 配置捷径面板
        this.configPanel();
        window.addEventListener('click', (event) => this.autoTrigger(event));
    },
    beforeUnmount() {
        window.removeEventListener('click', (event) => this.autoTrigger(event));
    },
    mounted() {
        this.setShortCutLabelStyle();
        this.setPanelPosition();
    },
    updated() {
        this.setShortCutLabelStyle();
        this.setPanelPosition();
    },
    methods: {
        autoTrigger(event) {
            if (event.target.className !== 'short-cut-label-content') {
                this.configPanelVisiable(false);
            }
        },
        onTouchStart() {
            clearTimeout(this.loop);
            this.loop = setTimeout(() => {
                this.setPanelPosition();
                this.configPanelVisiable(true);
            }, this.$props.triggerPanelTime);
        },
        onTouchEnd() {
            clearTimeout(this.loop);
        },
        onCopy(callback) {
            const copyText = this.dataValue
                ? this.dataValue
                : this.$refs.content.innerText;
            navigator.clipboard
                .writeText(copyText)
                .then(() => true)
                .catch(() => false)
                .then((flag) => {
                    console.log(flag ? '复制成功' : '复制失败');
                })
                .finally(() => callback && callback());
        },
        configPanelVisiable(visiable = false) {
            const panelEl = this.$refs.panel;
            if (visiable) {
                panelEl.style.visibility = 'initial';
                panelEl.style.opacity = 1;
            } else {
                panelEl.style.visibility = 'hidden';
                panelEl.style.opacity = 0;
            }
        },
        // 配置panel的项目
        configPanel() {
            // panelsMap为原panel的<id, item>映射关系
            const panelsMap = this.panels.reduce(
                (pre, item) => pre.set(item.id, item),
                new Map(),
            );
            // 最终panel 如果不自定义，则使用默认的或者直接添加配置数组
            const panels = !this.$props.isCustomizePanel ? this.panels : [];
            // 逐一配置
            this.$props.panelList.forEach((propItem) => {
                this.configPanelItem(panels, panelsMap, propItem);
            });
            this.panels = panels;
        },
        /**
         * @description [处理panelItem的参数设置，并对参数进行类型检查]
         * @param {Object} panelItem panel的子项
         * @param {Object} propItem 传入组件的参数
         * @param {Boolean} force 是否检查必传项,默认false
         *  */
        handlePanelItemProps(panelItem, propItem, force = false) {
            if (propItem.name || force) {
                if (typeof propItem.name !== 'string') {
                    throw new Error(TEXT);
                } else {
                    panelItem.name = propItem.name;
                }
            }
            if (propItem.icon || force) {
                if (typeof propItem.icon === 'string') {
                    panelItem.icon = propItem.icon;
                } else {
                    throw new Error(TEXT);
                }
            }
            if (propItem.url || force) {
                if (typeof propItem.url === 'string') {
                    panelItem.url = propItem.url;
                } else {
                    throw new Error(TEXT);
                }
            }
            if (propItem.avaliableTypes || force) {
                this.setAvailableType(panelItem, propItem);
            }
            if (propItem.onClick) {
                if (typeof propItem.onClick === 'function') {
                    panelItem.onClick = propItem.onClick;
                } else {
                    throw new Error(TEXT);
                }
            } else {
                panelItem.onClick = () => {};
            }
            if (propItem.style) {
                if (typeof propItem.style === 'object') {
                    panelItem.style = propItem.style;
                } else {
                    throw new Error(TEXT);
                }
            }
        },
        /**
         * @description [对panels子项进行逐一配置]
         * @param {Array} panels 面板数组
         * @param {Map} panelsMap 面板Map
         * @param {Object} propItem 面板prop子项
         */
        configPanelItem(panels, panelsMap, propItem) {
            let panelItem;
            if (typeof propItem === 'object') {
                panelItem = panelsMap.get(propItem.id);
                if (!panelItem) {
                    if (!propItem.id) {
                        propItem.id = generateRandomString();
                    }
                    panelItem = {
                        id: propItem.id,
                    };
                }
                this.handlePanelItemProps(panelItem, propItem, true);
            } else if (typeof propItem === 'string') {
                panelItem = panelsMap.get(propItem.id);
            } else {
                throw TEXT;
            }
            panels.push(panelItem);
        },
        /**
         * 对panel内容是否显示进行设置,并对其输入参数进行类型检查
         * @param {Object} panelItem 面板子项
         * @param {Object} propItem 面板prop子项
         */
        setAvailableType(panelItem, propItem) {
            let configAvailableTypes = new Map();
            switch (true) {
                case propItem.avaliableTypes instanceof Map:
                    configAvailableTypes = propItem.avaliableTypes;
                    configAvailableTypes.forEach((value, key) => {
                        this.varifyAvailableType(key, value);
                    });
                    break;
                case propItem.avaliableTypes instanceof Array:
                    propItem.avaliableTypes.forEach((a_t_item) => {
                        if (typeof a_t_item === 'string') {
                            configAvailableTypes.set(a_t_item, true);
                        } else if (
                            a_t_item instanceof Array &&
                            a_t_item.length === 2
                        ) {
                            this.varifyAvailableType(a_t_item[0], a_t_item[1]);
                            configAvailableTypes.set(a_t_item[0], a_t_item[1]);
                        } else {
                            throw TEXT;
                        }
                    });
                    break;
                case propItem.avaliableTypes instanceof Object:
                    for (const [key, value] of Object.entries(
                        propItem.avaliableTypes,
                    )) {
                        this.varifyAvailableType(key, value);
                        configAvailableTypes.set(key, value);
                    }
                    break;
                default:
                    throw TEXT;
            }
            panelItem.avaliableTypes = configAvailableTypes;
        },
        /**
         * 验证avilableTypes 子项key value
         */
        varifyAvailableType(key, value) {
            if (typeof key !== 'string') throw TEXT;
            if (typeof value !== 'boolean') throw TEXT;
        },
        // 设置捷径样式
        setShortCutLabelStyle() {
            // 设置panelWrapper样式
            // const panelItemsWrapper = this.$refs.panelItemsWrapper;
            const panelItemsWrapperEl = this.$refs.panelItemsWrapper;
            const panelStyle = this.$props.panelStyle;
            this.setDomStyle(panelItemsWrapperEl, panelStyle);

            // 设置角标样式
            const subscriptEl = this.$refs.subscript;
            this.setDomStyle(subscriptEl, this.$props.subScriptStyle);

            const panelItemRefs = this.$refs.panelItemsWrapper.children;
            const panelItemStyle = this.$props.panelItemStyle;
            panelItemRefs.forEach((item, index) => {
                this.setDomStyle(item, panelItemStyle);
                const selfStyle = this.panels[index]?.style;
                this.setDomStyle(item, selfStyle);
            });

            this.setPanelIcon();

            const contentEl = this.$refs.content;
            const contentStyle = this.$props.contentStyle;
            this.setDomStyle(contentEl, contentStyle);
        },

        setDomStyle($el, styleObj = {}) {
            if (
                typeof styleObj !== 'object' ||
                JSON.stringify(styleObj) === '{}'
            )
                return;
            styleObj = this.getHumpStyleObjKey(styleObj);
            Object.entries(styleObj).forEach((item) => {
                const [key, value] = item;
                $el.style[key] = value;
            });
        },

        getHumpStyleObjKey(styleObj) {
            const toHump = (name) =>
                name.replace(/-[z-z]/g, (res) => res[1].toUpperCase());
            return Object.entries(styleObj).reduce((ret, item) => {
                const [key, value] = item;
                ret[toHump(key)] = value;
                return ret;
            }, {});
        },
        setPanelIcon() {
            const { aidicons } = this.$refs;
            if (aidicons) {
                const len = aidicons.length;
                this.panels.forEach((item, index) => {
                    if (index < len) {
                        this.$refs.aidicons[index].className += ' ' + item.icon;
                    }
                });
            }
        },
        setPanelPosition() {
            const panelEl = this.$refs.panel;
            const subscriptEl = this.$refs.subscript;
            const contentEl = this.$refs.content;
            this.setPanelVerticalPos(panelEl, subscriptEl, contentEl);
            this.setPanelHorizontalPos(panelEl, subscriptEl, contentEl);
        },
        setPanelVerticalPos(panelEl, subscriptEl, contentEl) {
            const contentDR = contentEl.getBoundingClientRect();
            const panelDR = panelEl.getBoundingClientRect();
            // const subscriptDR = subscriptEl.getBoundingClientRect();

            const panelPosCorrect = -12;
            if (contentDR.top > 2 * panelDR.height) {
                panelEl.style.top = `${-panelDR.height + panelPosCorrect}px`;
                panelEl.style.bottom = 'initial';

                subscriptEl.style.top = 'initial';
                subscriptEl.style.bottom = '-5px';
            } else {
                panelEl.style.top = 'initial';
            }
        },
        setPanelHorizontalPos(panelEl, subscriptEl, contentEl) {
            const contentDR = contentEl.getBoundingClientRect();
            const panelDR = panelEl.getBoundingClientRect();
            // const subscriptDR = subscriptEl.getBoundingClientRect();
            const subPosCorrect = -11;
            const expectPanelLeft = (contentDR - panelDR.width) / 2;
            panelEl.style.left = `${expectPanelLeft}px`;
            subscriptEl.style.left = `${panelDR.width / 2 + subPosCorrect}px`;
            if (contentDR.left + contentDR.width / 2 < contentDR.width / 2) {
                const minLeft = 0;
                panelEl.style.left = `${-contentDR.left}px`;
                const panelDR_changed = panelEl.getBoundingClientRect();
                subscriptEl.style.left =
                    panelDR_changed.left > minLeft
                        ? `${panelDR.width / 2 + subPosCorrect}px`
                        : `${
                              contentDR.left +
                              contentDR.width / 2 +
                              subPosCorrect
                          }px`;
            }
            if (
                this.screenWidth - contentDR.right + contentDR.width / 2 <
                contentDR.width / 2
            ) {
                const minRight = 0;
                panelEl.style.left = `${-(
                    panelDR.width -
                    (this.screenWidth - contentDR.left)
                )}px`;
                const panelDR_changed = panelEl.getBoundingClientRect();
                subscriptEl.style.left =
                    this.screenWidth - panelDR_changed.right > minRight
                        ? `${panelDR.width / 2 + subPosCorrect}px`
                        : `${
                              contentDR.left +
                              contentDR.width / 2 -
                              panelDR_changed.left +
                              subPosCorrect
                          }px`;
            }
        },
    },
};
</script>

<style lang='less'>
a.panel-item-container,
a.panel-item-container:hover,
a.panel-item-container:focus,
a.panel-item-container:active {
    text-decoration: none;
    background: inherit;
    color: inherit;
    width: 100%;
    height: 100%;
    display: block;
}

.short-cut-label {
    display: inline-block;
    position: relative;
    z-index: 99;
}

.short-cut-label-content {
    display: inline-block;
    position: relative;
    z-index: 0;
}
.panel {
    visibility: hidden;
    font-size: 12px;
    display: flex;
    transition: 0.3s;
    opacity: 0;
    position: absolute;
    z-index: 1;

    font-size: 16px;

    margin: 15rpx auto;
    .panel-subscript,
    .panel-items-wrapper {
        background: #4c4c4c;
        color: #eee;
    }

    .panel-subscript {
        display: block;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
        position: absolute;
        z-index: 0;
    }
    .panel-items-wrapper {
        display: flex;
        font: inherit;
        max-width: 70vw;
        overflow: hidden;
        position: relative;
        z-index: 1;
        .panel-item {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            font-size: inherit;
            padding: 16rpx 8rpx;
            position: relative;
            min-width: 2em;
            &:first-child {
                padding-left: 20rpx;
            }
            i {
                margin: 0;
                color: inherit;
            }
            .item-name {
                font-size: inherit;
                white-space: nowrap;
            }
        }
    }
}
</style>
