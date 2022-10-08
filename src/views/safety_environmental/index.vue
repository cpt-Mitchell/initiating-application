<template>
  <div class="home-menu">
    <van-cell value="【安全/环保隐患】记录表" @click="pageTo('/safeHiddenTrouble/recordDetail')" />
    <!-- <van-cell value="【环保隐患】记录表" @click="pageTo('/environmentalProtection/recordDetail')" /> -->
    <!-- <van-cell value="【安全违规】处理单" @click="pageTo('/safeHiddenTrouble/deal')" /> -->
    <van-cell value="【环保违规】处理单" @click="pageTo('/environmentalProtection/deal')" />
  </div>
</template>

<script>
export default {
  methods: {
    pageTo(url) {
      this.$router.push(url)
    }
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
