<template>
    <van-image round :width="size" :height="size" :src="avatarLink" />
</template>

<script>
export default {
    props: {
        avatarLink: {
            type: String,
            default: require('assets/default/avatar.jpg'),
        },
        size: {
            type: String,
            default: '80',
        },
    },
    mounted() {},
};
</script>

<style scoped>
.avatar {
    position: relative;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
