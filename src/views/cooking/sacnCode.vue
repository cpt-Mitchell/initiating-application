<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>扫二维码</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>
                  <van-button type="primary" size="mini" @click="handleQrcode">扫码</van-button>
                </label>
              </div>
            </van-col>
          </van-row>
            <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>取样时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{date}}</label>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <footbar>
        <van-row>
          <van-col span="24">
            <van-button type="primary" style="height: 40px; width: 100%" @click="submitData">提交</van-button>
          </van-col>
        </van-row>
      </footbar>
    </div>
  </div>
</template>
<script>
import Footbar from '@/components/Footbar'
import vuet from '@/vuet'
import { Dialog } from 'vant'
// import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
// import { parseTime } from '@/utils/DateTimeUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      isLoading: false,
      date: '',
      userNo: '',
      userName: ''
    }
  },
  components: { Footbar },
  methods: {
    handleQrcode() {
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function (data) {
          let params = {
            scanCode: data.text || ''
          }
          request
            .get(API.checkSampleScan, { params })
            .then(res => {
              if (res.data) {
                that.date = res.data.data || ''
              }
            })
            .catch(err => (that.isLoading = false))
        },
        onFail: function (err) {
        }
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '确定提交取样数据吗？'
      })
        .then(() => {
          let params = {
            sampleTime: this.date,
            userName: this.userName,
            userNo: this.userNo
          }
          request
            .get(API.checkSampleSubmit, { params })
            .then(res => {
              if (res.data.success) {
                alert('提交成功！')
              } else {
                alert(JSON.stringify('提交失败！' + res.data.msg))
              }
            })
            .catch(err => (this.isLoading = false))
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  mounted() {
    // alert(JSON.stringify(vuet.modules.home._LOGINUSER_))
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.userNo = vuet.modules.home._LOGINUSER_.userid || ''
  }
}
</script>
