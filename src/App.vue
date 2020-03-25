<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive> -->
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view></router-view>
    <!-- <van-tabbar fixed v-model="active" @change="onChange"> -->
    <van-tabbar fixed v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="good-job-o" url="/cart">购物车</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      active: 0
    }
  }
}
</script>
