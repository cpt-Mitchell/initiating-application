<template>
  <div class="home-menu">
    <!-- <van-cell :value="`区域选择(${company})`" @click="selectArea"/> -->
    <van-cell value="预注册员工内宿申请" @click="pageTo('/dormitoryManagement/registerForecas')"/>
    <van-cell value="员工内宿申请" @click="pageTo('/dormitoryManagement/quarterageApply')"/>
    <van-cell value="员工宿舍调整申请" @click="pageTo('/dormitoryManagement/AdjustDormitory')"/>
    <van-cell value="员工退宿申请" @click="pageTo('/dormitoryManagement/withdrawApply')"/>
    <van-cell value="宿舍物资领用/维修申请" @click="pageTo('/dormitoryManagement/receiveApply')"/>
    <!-- <van-cell value="员工申请调整宿舍(后勤管理审核)" @click="pageTo('/dormitoryManagement/AdjustDormitoryAuditList')"/>
    <van-cell value="确认接收员工宿舍调整申请结果" @click="pageTo('/dormitoryManagement/result')"/> -->
    <van-cell value="水/电/天然气抄表" @click="pageTo('/dormitoryManagement/utilityBills')"/>
    <van-cell value="水/电/天然气重抄表" @click="pageTo2('/dormitoryManagement/utilityBills2')"/>
    <!-- <van-cell value="审核宿舍物资领用或维修申请单" @click="pageTo('/dormitoryManagement/audit')"/> -->
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import vuet from '@/vuet'
import { API } from '@/api'
export default {
  data() {
    return {
      areaId: '1331049951992442881',
      company: '赣州纸业',
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
    },
    pageTo2(url) {
      let params = {
        areaId: vuet.store.dormitory.areaId || ''
      }
      request
        .get(API.canUpdateMeter, { params }) // 查询登录人信息
        .then(res => {
          if (res.data.success) {
            this.$router.push({
              path: url,
              query: {
                areaId: this.areaId
              }
            })
          } else {
            alert('您没有权限操作！')
          }
        })
        .catch(err => { })
    },
    selectArea() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择类别', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function (result) {
          that.areaId = that.lists[result.buttonIndex].areaId
          that.company = that.lists[result.buttonIndex].company
          vuet.store.dormitory.company = that.company
          vuet.store.dormitory.areaId = that.areaId
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    init() {
      let params = {}
      request
        .get(API.areaList, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.lists = res.data.data || []
            this.lists.forEach(item => {
              this.option.push(item.company)
            })
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.init()
    if (vuet.store.dormitory.company) {
      this.company = vuet.store.dormitory.company || ''
      this.areaId = vuet.store.dormitory.areaId || ''
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
