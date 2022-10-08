<template>
  <div class="home-menu">
    <van-cell value="设备巡检模块" @click="pageTo('/equipment/inspectionCard',false)"/>
    <!-- <van-cell value="设备维修模块" @click="pageTo('/equipment/detectionDetails')"/>
    <van-cell value="维修验收模块" @click="pageTo('/cooking/sacnCode')"/> -->
    <van-cell value="待确认扣工资" @click="pageTo('/cooking/sacnCode')"/>
    <van-cell value="设备异常待审核" @click="pageTo('/equipment/inspectionCard',true)"/>
     <!-- <van-cell value="卡片界面" @click="pageTo('/equipment/inspectionCard')"/> -->
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
    pageTo(url, val) {
      this.$router.push({
        path: url,
        query: {
          isAbnormal: val
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
