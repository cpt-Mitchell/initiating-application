<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-header">
          <van-row>
            <van-col span="24">
              <span style="font-size:15px;color:#1db5e6">员工信息</span>
            </van-col>
          </van-row>
        </div>
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
              <span>性别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.sex || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>部门</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.dept || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>岗位</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.position || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>手机号码</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.phoneNumber || '' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="sub-head" style="margin-bottom: 10px">
          <span>现住宿信息</span>
        </div>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>入住日期</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{ form.checkInDate || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>楼号</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.dormitoryName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>楼层</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.storeyName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>房号</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.roomNo || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>床号</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.bedNo || '' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="sub-head" style="margin-bottom: 10px">
        <span>退宿信息</span>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>退宿日期</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  v-if="form.checkOutDate === ''"
                  @click="handleSelectDate"
                  :style="{ color: form.checkOutDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label>
                <label v-else @click="handleSelectDate">{{ form.checkOutDate }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>原因</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.reason" row="3" autosize type="textarea" style="padding:0;" placeholder="请输入原因"/>
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
      isLoading: false,
      form: {
        empName: '',
        sex: '',
        dept: '',
        position: '',
        shift: '',
        empCategory: '',
        phoneNumber: '',
        dormitoryName: '',
        storeyName: '',
        roomNo: '',
        isSnore: '请选择',
        bedNo: '',
        checkInReason: '',
        checkInDate: '',
        checkOutDate: '',
        reason: ''
      },
      phoneNumber: '',
      option: ['是', '否']
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
        message: '是否提交表'
      })
        .then(() => {
          let params = this.form
          request
            .post(API.checkOutSave, params)
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
    init() {
      let params = {
        areaId: vuet.store.dormitory.areaId,
        phoneNumber: this.phoneNumber
      }
      request
        .get(API.dormitoryFind, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
            this.form = Object.assign(this.form, this.form.checkInMsg)
          }
        })
        .catch(err => { })
    }

  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '员工退宿申请'
    })
    this.phoneNumber = vuet.modules.home._LOGINUSER_.mobile || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
