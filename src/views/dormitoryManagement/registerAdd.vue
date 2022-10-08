<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>员工姓名</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.empName" style="padding:0;" placeholder="请输入员工姓名"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>性别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label
                  :style="{ color: form.sex === '请选择' ? '#2196f3' : '#c8c9cc' }"
                  @click="sexSelect"
                >{{form.sex || '请选择'}}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>部门</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <van-field v-model="form.dept" style="padding:0;" placeholder="请输入部门"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>岗位</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <van-field v-model="form.position" style="padding:0;" placeholder="请输入岗位"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>班次</span>
            </van-col>
            <van-col span="16" class="label-content">
               <div>
                <label
                :style="{ color: form.shift === '请选择' ? '#2196f3' : '#c8c9cc' }"
                @click="shiftSelect">{{ form.shift || '请选择' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>员工类别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                :style="{ color: form.empCategory === '请选择' ? '#2196f3' : '#c8c9cc' }"
                @click="empCategorySelect">{{ form.empCategory || '请选择' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>手机号码</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.phoneNumber" style="padding:0;" placeholder="请输入手机号码"/>
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
        shift: '',
        empCategory: '',
        position: '',
        phoneNumber: ''
      },
      sexOption: ['男', '女'],
      empCategoryOption: ['岗位工', '管培生', '管理人员'],
      shiftOption: []
    }
  },
  components: { Footbar },
  methods: {
    sexSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.sexOption,
        onSuccess: function (result) {
          // alert(JSON.stringify(result))
          that.form.sex = that.sexOption[result.buttonIndex]
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    empCategorySelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.empCategoryOption,
        onSuccess: function (result) {
          // alert(JSON.stringify(result))
          that.form.empCategory = that.empCategoryOption[result.buttonIndex]
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    shiftSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.shiftOption,
        onSuccess: function (result) {
          // alert(JSON.stringify(result))
          that.form.shift = that.shiftOption[result.buttonIndex]
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    getShift() {
      let params = {}
      request
        .get(API.psShift, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            let lists = res.data.data || []
            lists.forEach(item => {
              this.shiftOption.push(item.shortName)
            })
          }
        })
        .catch(err => { })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交申请表'
      })
        .then(() => {
          let params = this.form
          params.areaId = vuet.store.dormitory.areaId
          request
            .post(API.preregistrationSave, params)
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
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.getShift()
  }
}
</script>
<style lang="less" scoped>
</style>
