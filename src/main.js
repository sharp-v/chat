import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import router from "./router/index";
app.use(router);
import store from "./store/index";
app.use(store);

import "normalize.css";
import "default-passive-events";

import "vant/lib/index.css";

import { Button } from "vant";
app.use(Button);

import { Cell, CellGroup } from "vant";
app.use(Cell);
app.use(CellGroup);

import { IndexBar, IndexAnchor } from "vant";
app.use(IndexBar);
app.use(IndexAnchor);
import { NavBar } from "vant";
app.use(NavBar);

import { ConfigProvider } from "vant";
app.use(ConfigProvider);

import { Icon } from "vant";
app.use(Icon);

import { Image as VanImage } from "vant";
app.use(VanImage);

import { Popup } from "vant";
app.use(Popup);

import { Toast } from "vant";
app.use(Toast);

import { Form, Field } from "vant";
app.use(Form);
app.use(Field);

import { Tab, Tabs } from "vant";
app.use(Tab);
app.use(Tabs);

import { Tabbar, TabbarItem } from "vant";
app.use(Tabbar);
app.use(TabbarItem);

import { Empty } from "vant";
app.use(Empty);

import { Search } from "vant";
app.use(Search);

import { DropdownMenu, DropdownItem } from "vant";
app.use(DropdownMenu);
app.use(DropdownItem);

import { Tag } from "vant";
app.use(Tag);

import { Badge } from "vant";
app.use(Badge);

import { Popover } from "vant";
app.use(Popover);

import { PullRefresh } from "vant";
app.use(PullRefresh);

import { Uploader } from "vant";
app.use(Uploader);

app.mount("#app");
