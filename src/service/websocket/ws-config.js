import { HOST } from 'common/config';

const config = {
    connectFlag: true,
    timeout: 200,
    timeoutObj: null,
    BASEURL: 'ws://' + HOST + '/api',
    api: '/chat',
    token: null,
};

export default config;
