<template>
  <div class="application-app-box">
    <div>
      <template v-for="(app, index) in $router.options.routes[0].children">
        <div class="mu-paper" :key="index" v-if="!app.hidden" @click="goRoute(app.name)">
          <i :class="'app-icon app-' + app.meta.background + '-icon'"></i>
          <span style="position: relative; top: 0.12rem">{{ app.name }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import * as DingTalkApi from 'dingtalk-jsapi'
export default {
  name: 'application-apps',
  methods: {
    goRoute(name) {
      this.$router.push({
        name: name
      })
    }
  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '发起申请'
    })
  }
}
</script>

<style lang="less" scoped>
.application-app-box {
  height: 100vh;
  background: #fff;

  & > div {
    padding: 0.25rem .1rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .mu-paper {
      height: 2.5rem;
      width: 2.1rem;
      margin-right: 0.18rem;
      margin-bottom: 0.2rem;
      margin-left: 0.18rem;
      text-align: center;
      font-size: 0.34rem;

      .app-icon {
        width: 1.8rem;
        height: 1.8rem;
        margin: 0 auto;
        display: block;
      }
    }
  }
}

.img-items {
  padding: 10px;
  margin: 0 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

#container {
  width: 100%;
  height: 200px;
}

.option {
  padding: 0px 5px;
}
</style>
