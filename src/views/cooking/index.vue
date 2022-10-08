<template>
  <div class="home-menu">
    <van-cell value="取样检测" @click="pageTo('/cooking/sacnCode')"/>
  </div>
</template>

<script>
// import request from '@/utils/httpUtil'
// import { API } from '@/api'
export default {
  data() {
    return {
      option: [],
      lists: []
    }
  },
  methods: {
    pageTo(url) {
      this.$router.push({
        path: url,
        query: {
          areaId: this.areaId
        }
      })
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.home-menu {
  height: 100vh;
  background-color: #fff;
  .van-cell {
    padding: 13px 16px;
  }
}
</style>
