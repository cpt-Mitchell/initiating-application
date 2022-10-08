<template>
  <div v-if="isDev">
    <van-field v-model="code" placeholder="请输入员工号" clearable />
    <van-field v-model="mockName" placeholder="请输入员工姓名" clearable />
    <!-- <van-field v-model="str" placeholder="token" clearable /> -->
    <br />
    <van-button type="primary" @click="getToken">生成token</van-button>
  </div>
</template>
<script>
import axios from 'axios'
import { mapModules } from 'vuet'
export default {
  mixins: [
    mapModules({
      home: 'home'
    })
  ],
  data() {
    return {
      str: '',
      code: '',
      mockName: '',
      user: {},
      isDev: process.env.VUE_APP_ISDEV == 'true'
    }
  },
  methods: {
    getToken() {
      axios
        .get(
          'https://www.hwagain.com/apitest/auth/user/mock/' +
            this.code +
            '/' +
            (this.mockName || '%E9%BB%8E%E6%98%8C%E7%9B%9B') +
            '/1440000'
        )
        .then(res => {
          alert(JSON.stringify(res.data))
          this.str = res.data || ''
          this.home.SETTOKEN(res.data)
        })
        .catch(e => {
          this.home.SETTOKEN('')
        })
    }
  },
  mounted() {
    console.log(process.env.VUE_APP_ISDEV)
    this.user = this.home._LOGINUSER_
  }
}
</script>
