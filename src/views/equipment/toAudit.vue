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
              @click="checkQrCode(item.deviceBirthId, item.id)"
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
    checkQrCode(deviceBirthId, id) {
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let datas = data.text.split(',') || []
          let scanCode = datas[0] || ''
          if (deviceBirthId == scanCode) {
            that.$router.push({
              path: '/equipment/equipmentAudit',
              query: {
                deviceBirthId: scanCode,
                id: id
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
          let sacnCodeData = that.dataList.filter(item => item.deviceBirthId === scanCode)
          if (sacnCodeData && sacnCodeData.length > 0) {
            that.$router.push({
              path: '/equipment/equipmentAudit',
              query: {
                deviceBirthId: scanCode,
                id: sacnCodeData[0].id || ''
              }
            })
          } else {
            that.$dAlert('该设备没有在异常列表中，请重新扫其它设备二维码！')
          }
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
        .get(API.queryExceptionDeviceList, { params })
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
      title: '设备异常待审任务'
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
