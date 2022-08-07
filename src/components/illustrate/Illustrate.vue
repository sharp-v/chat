<template>
  <div class="illustrate">
    <div class="item">
      <h3>注意：</h3>
      只适配部分移动端<br />
      未适配PC端<br />
      目前通信功能已经能用
    </div>
    <div class="item main-introduce">
      <h4>介绍</h4>
      <span> 模仿qq微信的一个用于聊天的应用</span>
    </div>
    <div class="item example">
      <h3 style="color: #fff">测试登录用户:</h3>
      (用户名,密码) <br />
      (panda,apanda)<br />
      (steve,steve)<br />
      (test,test)
    </div>
    <div class="item test">
      <h3>测试方式</h3>
      <strong>打开两个不同的浏览器</strong><br />
      分别登录两个账户<br />
      <strong
        ><i
          >(注意：不是在同一浏览器下新建标签页，原因：前端设置了一个浏览器只能登录一个账户)</i
        ></strong
      ><br />
    </div>
    <div class="item author">邮箱：2742340771@qq.com</div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.illustrate {
  position: fixed;
  bottom: 0;
  color: #ddd;
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
  background-image: linear-gradient(to top, #007adf 0%, #00ecbc 100%);
  background-image: linear-gradient(
    -120deg,
    #3d3393 -10%,
    #2b76b9 57%,
    #2cacd1 155%,
    #35eb93 1230%
  );
  font-size: 14px;
  max-height: 60vh;
  min-height: 30vh;
  width: 100vw;
  justify-content: center;
  align-items: flex-start;
}
.illustrate .main-text {
  font-size: 16px;
  font-weight: bolder;
  color: #fff;
}
.illustrate .item {
  float: left;
  width: 12em;
  height: 5em;
  padding: 1rem 1rem;
}
h1,
h2,
h3,
h4,
h5 {
  margin: 5px 0;
  font-weight: 900;
  color: #fafafa;
}
.van-cell__title.van-field__label {
  width: 42px;
}
</style>
