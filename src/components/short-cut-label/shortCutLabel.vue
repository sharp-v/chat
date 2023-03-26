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
    </div>
    <!-- panel -->
    <div class="panel" ref="panel">
        <!-- panel subscript -->
        <div class="panel-subscript" ref="subscript"></div>
        <div class="panel-items-wrapper" ref="panelItemWrapper">
            \
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
    },
    mounted() {
        this.setShortCutLabelStyle();
        this.setPanelPosition();
    },
    updated() {
        this.setShortCutLabelStyle();
        this.setpanelPosition();
    },
    methods: {
        onTouchStart() {
            clearTimeout(this.loop);
            this.loop = setTimeout(() => {
                this.setpanelPosition();
                this.configPanelVisiable(true);
            }, this.$props.triggerPanelTime);
        },
        onTouchEnd() {
            clearTimeout(this.loop);
        },
        onCopy(callback) {
            const copyText = this.dataValue
                ? this.dataValue
                : this.$refs.content.$el.innerText;
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
            const panelEl = this.$refs.panel.$el;
            if (visiable) {
                panelEl.style.visiable = 'initial';
                panelEl.style.opacity = 1;
            } else {
                panelEl.style.visiable = 'hidden';
                panelEl.style.opacity = 0;
            }
        },
        // 配置panel的项目
        configPanel() {
            // const defaultPanels = new Set(['copy']);
            // panelsMap为原panel的<id, item>映射关系
            const panelsMap = this.panels.reduce(
                (pre, item) => pre.set(item.id, item),
                new Map(),
            );
            // 最终panel 如果不自定义，则使用默认的或者直接添加配置数组
            const panels = !this.$props.isCustomizePanel ? this.panels : [];
            // 逐一配置
            this.$props.panelList.array.forEach((propItem, index) => {
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
        },
        varifyAvailableType(key, value) {
            if (typeof key !== 'string') throw TEXT;
            if (typeof value !== 'boolean') throw TEXT;
        },
        setShortCutLabelStyle() {
            //
        },
    },
};
</script>

<style></style>
