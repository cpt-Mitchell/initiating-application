<template>
  <div>
    <!-- 设备异常待审核任务 -->
    <div v-if="$route.query.isAbnormal=='true'?true:''" class="card-model">
      <van-row @click="pageTo('/equipment/toAudit')">
        <van-row class="main-title">设备巡检模块</van-row>
        <van-row class="secondary-title">(待处理工作<span style="color:red">{{earCheckCount}}</span>项)</van-row>
      </van-row>
    </div>
    <!-- 设备巡检 -->
    <div v-else class="card-model">
      <van-row @click="pageTo('/equipment/detection')">
        <van-row class="main-title">设备巡检模块</van-row>
        <van-row class="secondary-title">(待处理工作<span style="color:red">{{cdrCheckCount}}</span>项)</van-row>
      </van-row>
    </div>
  </div>
</template>
<script>
// import Footbar from '@/components/Footbar'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import { Dialog } from 'vant'
import { parseTime } from '@/utils/DateTimeUtil'
import vuet from '@/vuet'
import { API } from '@/api'
export default {
  name: 'detection',
  data() {
    return {
      date: parseTime(new Date(), '{y}-{m}-{d}'),
      jobnumber: '',
      cdrCheckCount: 0,
      earCheckCount: 0,
      data: {}
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
      pageTo(url) {
      this.$router.push({
        path: url,
      })
    },
    init() {
      let params = {
        // dingUserId: this.jobnumber
      }
      request
        .get(API.getUserIdentity, { params })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data || {}
            this.cdrCheckCount = data.cdrCheckCount || 0      
            this.earCheckCount = data.earCheckCount || 0
          }
        })
        .catch(err => (this.isLoading = false))
    }
  },
  components:{},
  mounted() {
    console.log(this.$route.query.isAbnormal)
    DingTalkApi.biz.navigation.setTitle({
      title: this.$route.query.isAbnormal?'设备管理系统主界面':'设备管理系统主界面'
    })
    this.jobnumber = vuet.modules.home._LOGINUSER_.jobnumber || ''
    this.init()
  },
}
</script>
<style lang="less" scoped>
.card-model {
  text-align: center;
  padding: 5px 5px;
  margin: 8px 40px;
  background-color: #c8ddf1;
  border-radius: 5px;
  line-height: 1.5;
  font-size: 0.34rem;
}
.main-title{
  font-size: 20px;
}
.title-header{
  text-align: left;
}
.title-content{
  padding-left:4px;
  color: #666666;
  word-wrap: break-word;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: rgba(0, 0, 0, 0.1);
}
</style>
