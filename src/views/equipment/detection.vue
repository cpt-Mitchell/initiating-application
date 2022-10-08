<template>
  <div>
    <div class="card card-part">
      <table class="m-table">
        <tr class="tabel-header tabel-header-white">
          <th style="width: 20%" class="right-border">序号</th>
          <th style="width: 80%" class="right-border">设备名称</th>
        </tr>
        <tbody>
          <tr v-for="(item, index) in dataList" :key="index">
            <td class="right-border top-border-solid">{{ index + 1 }}</td>
            <td
              class="right-border top-border-solid"
              style="text-align: left;color:#1989fa"
              @click="checkQrCode(item.deviceBirthId)"
            >
              {{ item.deviceName }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button type="primary" style="height: 40px; width: 100%;" @click="handleQrcode">巡检扫码</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>
<script>
import Footbar from '@/components/Footbar'
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
      userName: '',
      dataList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    checkQrCode(id) {
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let datas = data.text.split(',') || []
          let scanCode = datas[0] || ''
          console.log(scanCode)
          if (id == scanCode) {
            that.$router.push({
              path: '/equipment/detectionDetails',
              query: {
                deviceBirthId: scanCode
              }
            })
          } else {
            that.$dAlert('当前设备和列表设备不匹配。')
          }
        },
        onFail: function(err) {}
      })
    },
    handleQrcode() {
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let datas = data.text.split(',') || []
          let scanCode = datas[0] || ''
          let params = {
            deviceBirthId: scanCode || ''
          }
          request
            .get(API.queryCheckDeviceInfo, { params }) // 查询登录人信息
            .then(res => {
              let resData = res.data || {}
              console.log(res)
              if (resData.success) {
                if (resData.data.checkTaskId) {
                  that.$router.push({
                    path: '/equipment/detectionDetails',
                    query: {
                      deviceBirthId: scanCode
                    }
                  })
                } else {
                  Dialog.confirm({
                    title: '提交',
                    message: '该设备不属于本次巡检任务设备，是否要记录巡检情况？'
                  })
                    .then(() => {
                      that.$router.push({
                        path: '/equipment/detectionDetails',
                        query: {
                          deviceBirthId: scanCode
                        }
                      })
                    })
                    .catch(() => {
                      that.$dAlert('取消成功')
                    })
                }
              } else {
                that.$dAlert(res.data.msg)
              }
            })

          // let sacnCodeData = that.dataList.filter(item => item.deviceBirthId === scanCode)
          // if(sacnCodeData && sacnCodeData.length<0){

          // }else{
          //   if(typeof(scanCode)=='string') return that.$dAlert('该二维码不属于设备巡检二维码，请扫正确的设备巡检二维码！')
          //   let params = {
          //     deviceBirthId: scanCode || ''
          //   }
          //   request
          //     .get(API.queryCheckDeviceInfo, { params }) // 查询登录人信息
          //     .then(res => {
          //       if (res.success) {
          //         Dialog.confirm({
          //           title: '提交',
          //           message: '该设备不属于本次巡检任务设备，是否要记录巡检情况？'
          //         })
          //           .then(() => {
          //             that.$router.push({
          //               path:'/equipment/detectionDetails',
          //               query:{
          //                 deviceBirthId:scanCode
          //               }
          //             })
          //           })
          //           .catch(() => {
          //             that.$dAlert('取消成功')
          //           })
          //       }else{
          //         that.$dAlert(res.data.msg)
          //       }
          //     })
          //     .catch(err => {
          //       that.$dAlert(res.data.msg)
          //     })
          // }
        },
        onFail: function(err) {}
      })
    },
    computedCode() {},
    init() {
      let params = {
        theDate: this.date
      }
      request
        .get(API.queryCheckDeviceList, { params })
        .then(res => {
          if (res.data) {
            this.dataList = res.data.data || []
          }
        })
        .catch(err => (this.isLoading = false))
    }
  },
  components: {
    Footbar
  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '今天巡检任务'
    })
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
.title-header {
  text-align: left;
}
.title-content {
  padding-left: 4px;
  color: #666666;
  word-wrap: break-word;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: rgba(0, 0, 0, 0.1);
}
</style>
