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
                <label>{{ form.empName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>职务</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.empName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>标准天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.empName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>可休天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.empName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>开始时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  @click="handleSelectDate"
                  :style="{ color: form.checkOutDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>结束时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  @click="handleSelectDate"
                  :style="{ color: form.checkOutDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>总天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.empName" style="padding:0;" placeholder="请输入申请抵扣天数"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>周末天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.empName || '' }}</label>
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
export default {
  data() {
    return {
      applicatorNo: '',
      userName: '',
      isLoading: false,
      form: {
        areaIdCompany: '',
        areaId: '',
        empName: '',
        sex: '',
        dept: '',
        shift: '请选择',
        empCategory: '请选择',
        position: '',
        phoneNumber: '',
        isSnore: '1',
        checkInDate: '',
        roomUse: ''
      }
    }
  },
  components: { Footbar },
  methods: {
    handleSelectDate() {
      let that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd',
        // value: '2015-04-17 08:00', // 默认显示
        onSuccess: function (result) {
          that.form.checkOutDate = result.value
          that.$forceUpdate()
          // onSuccess将在点击完成之后回调
          /* {
            value: "2015-06-10 09:50"
        }
        */
        },
        onFail: function (err) { }
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交申请表'
      })
        .then(() => {
          let params = this.form
          // params.areaId = vuet.store.dormitory.areaId
          params.isPreReg = '1'
          params.applicator = this.userName
          params.applicatorNo = this.applicatorNo
          request
            .post(API.dormitorySave, params)
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
        empName: this.userName || ''
      }
      request
        .get(API.getEmployeeInfo, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.applicatorNo = vuet.modules.home._LOGINUSER_.jobnumber || ''
    DingTalkApi.biz.navigation.setTitle({
      title: '个人年休假安排计划'
    })
    // this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
