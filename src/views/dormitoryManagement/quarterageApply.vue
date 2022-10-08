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
              <span>班次</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.shift || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>员工类别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.empCategory || '' }}</label>
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
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>是否打鼾</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label :style="{ color: form.isSnore === '请选择' ? '#2196f3' : '#c8c9cc' }" @click="snoreSelect">{{
                  form.isSnore == '1' ? '打鼾' : '不打鼾'
                }}</label>
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
                  >请选择日期</label
                >
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
import * as DingTalkApi from 'dingtalk-jsapi'
import vuet from '@/vuet'
import { Dialog } from 'vant'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      isLoading: false,
      form: {
        areaIdCompany: '',
        areaId: '',
        empName: '',
        sex: '',
        dept: '',
        shift: '',
        empCategory: '',
        position: '',
        phoneNumber: '',
        isSnore: '1',
        checkInDate: '',
        roomUse:''
      },
      option: ['不打鼾', '打鼾'],
      optionCompany: [],
      roomUserList: [],
      lists: []
    }
  },
  components: { Footbar },
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
        areaId:this.form.areaId
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
    init() {
      let params = {
        empName: this.userName || ''
        // empName: '李杭秀'
      }
      request
        .get(API.getEmployeeInfo, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
            // 初始化默认值
            this.form.isSnore = '1'
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.initCompany()
    this.init()
    DingTalkApi.biz.navigation.setTitle({
      title: '员工内宿申请'
    })
  }
}
</script>
<style lang="less" scoped>
</style>
