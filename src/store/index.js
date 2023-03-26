import { createStore } from 'vuex';
import relation from './modules/relation';
import current from './modules/current';
import message from './modules/message';
import profile from './modules/profile';
// import individuals from './modules/individuals'
const store = createStore({
    modules: {
        relation,
        current,
        message,
        profile,
    },
});

export default store;
