<template>
  <div class="home-menu">
    <!-- <van-cell value="个人年休假确认天数" @click="pageTo('/holiday/confirm-holiday')"/> -->
    <van-cell value="休假安排计划调整申请" @click="pageTo('/holiday/changePlan-holiday')"/>
    <van-cell value="不能同休人员休假计划" @click="pageTo('/holiday/notsame-holiday')"/>
    <van-cell value="个人年休假抵扣申请" @click="pageTo('/holiday/deduction-holiday')"/>
    <!-- <van-cell value="个人年休假安排计划" @click="pageTo('/holiday/plan-holiday')"/> -->
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
