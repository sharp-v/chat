import { Notify } from 'vant';
import { createRouter, createWebHistory } from 'vue-router';
import { TOKEN_NAME } from '../common/config';
import { token_code } from '../common/code';

const Login = () => import('views/system/Login');
const Message = () => import('views/message/Message');
const Relation = () => import('views/relation/Relation');
const Space = () => import('views/space/Space');

const Profile = () => import('views/profile/Profile');
const UserInfo = () => import('views/profile/childRoute/UserInfo');

const Exhibt = () => import('views/exhibt/Exhibt');
const Chat = () => import('views/chat/Chat');
const RelationConfig = () => import('views/relation-config/RelationConfig');

const routes = [
    {
        path: '/',
        component: Login,
        // meta: {
        //   main: true
        // }
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/message',
        component: Message,
        meta: {
            main: true,
        },
    },
    {
        path: '/relation',
        component: Relation,
        meta: {
            main: true,
        },
    },
    {
        path: '/space',
        component: Space,
        meta: {
            main: true,
        },
    },
    {
        path: '/profile',
        component: Profile,
        meta: {
            main: true,
            childRoute: true,
        },
        children: [
            {
                path: 'user-info',
                component: UserInfo,
            },
        ],
    },
    {
        path: '/exhibt',
        component: Exhibt,
    },
    {
        path: '/chat',
        component: Chat,
    },
    {
        path: '/relation-config',
        component: RelationConfig,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 外部路由集合
const externalRouteSet = new Set(['/login']);

// 主路由
// const mainRouteSet = new Set(['/message','/relation','/chat','/space',])

router.beforeEach(async (to, from) => {
    if (externalRouteSet.has(from.path) && !localStorage.getItem(TOKEN_NAME)) {
        Notify(token_code.error);
        return false;
    }
});

export default router;
