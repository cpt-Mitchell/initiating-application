<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>姓名</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
               <label>{{form.userName || ''}}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>公司</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{form.companyName || ''}}</label>
              </div>
            </van-col>
          </van-row>
            <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>部门/工厂</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{form.deptName || ''}}</label>
              </div>
            </van-col>
          </van-row>
            <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>车间/业务组</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{form.workshop || ''}}</label>
              </div>
            </van-col>
          </van-row>
            <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>登记时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{form.washDate || ''}}</label>
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
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/DateTimeUtil'
export default {
  data() {
    return {
      userCode: '',
      userName: '',
      isLoading: false,
      form: {
      }
    }
  },
  components: { Footbar },
  methods: {
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交申请表'
      })
        .then(() => {
          let params = this.form
          request
            .post(API.anonymouseCommit, params)
            .then(res => {
              if (res.data.success) {
                alert('提交成功！')
                this.$router.go(-1)
              } else {
                alert(JSON.stringify('提交失败！' + res.data.msg))
              }
            })
            .catch(err => (this.isLoading = false))
        })
        .catch(() => {
          // on cancel
        })
    },
    init() { // 废弃
      let params = {
        userCode: this.userCode || ''
      }
      request
        .get(API.getPersonInfo, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
            this.form.userId = this.form.userCode || ''
            this.form.washDate = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.userCode = vuet.modules.home._LOGINUSER_.jobnumber || ''
    this.init()
    DingTalkApi.biz.navigation.setTitle({
      title: '员工洗车登记表'
    })
  }
}
</script>
<style lang="less" scoped>
</style>
