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
                <van-field @blur="checkUser(form.empName)" v-model="form.empName" style="padding:0;" placeholder="请输入员工姓名"/>
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
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>是否打鼾</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  :style="{ color: form.isSnore === '请选择' ? '#2196f3' : '#c8c9cc' }"
                  @click="snoreSelect"
                >{{form.isSnore=='1'?'打鼾':'不打鼾'}}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>入住日期</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  v-if="form.checkInDate === ''"
                  @click="handleSelectDate"
                  :style="{ color: form.checkInDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label>
                <label v-else @click="handleSelectDate">{{ form.checkInDate }}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>公司宿舍</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label @click="selectArea">{{ form.areaIdCompany || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>用途类别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label @click="roomUseSelect">{{form.roomUse || ''}}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="card-part">
          <DevMockUser></DevMockUser>
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
import DevMockUser from '@/components/DevMockUser'
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
      },
      option: ['不打鼾', '打鼾'],
      sexOption: ['男', '女'],
      empCategoryOption: ['岗位工', '管培生', '管理人员'],
      shiftOption: [],
      optionCompany: [],
      lists: []
    }
  },
  components: { Footbar, DevMockUser },
  methods: {
    selectArea() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择类别', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.optionCompany,
        onSuccess: function (result) {
          that.form.areaId = that.lists[result.buttonIndex].areaId
          that.form.areaIdCompany = that.lists[result.buttonIndex].company
          that.initRoomUser()
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
    snoreSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择是否打鼾', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function (result) {
          // alert(JSON.stringify(result))
          that.form.isSnore = result.buttonIndex
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    roomUseSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择用途类别', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.roomUserList,
        onSuccess: function (result) {
          that.form.roomUse = that.roomUserList[result.buttonIndex]
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    handleSelectDate() {
      let that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd',
        // value: '2015-04-17 08:00', // 默认显示
        onSuccess: function (result) {
          that.form.checkInDate = result.value
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
    checkUser(val) {
      let params = {
        areaId: vuet.store.dormitory.areaId || '1331049951992442881',
        name: val
      }
      request
        .get(API.preregistrationGet, { params }) // 查询登录人信息
        .then(res => {
          if (res.data.data) {
            this.userName = val
            this.init()
          } else {
            // alert('暂无信息，请跳转到“新增预注册员工的基本信息”页面')
            // this.$router.push({
            //   path: '/dormitoryManagement/registerAdd'
            // })
          }
        })
        .catch(err => { })
    },
    initCompany() {
      let params = {}
      request
        .get(API.areaList, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.lists = res.data.data || []
            this.lists.forEach(item => {
              this.optionCompany.push(item.company)
            })
          }
        })
        .catch(err => { })
    },
    initRoomUser() {
      let params = {
        areaId: this.form.areaId
      }
      request
        .get(API.roomUse, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.roomUserList = res.data.data || []
          }
        })
        .catch(err => { })
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
    this.getShift()
    this.initCompany()
    DingTalkApi.biz.navigation.setTitle({
      title: '预注册员工内宿申请'
    })
    // this.init()1
  }
}
</script>
<style lang="less" scoped>
</style>
