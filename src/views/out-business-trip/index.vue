<template>
  <div class="out-bussiness-trip-content" style="height: 100%;" :class="{ 'box-loading': isLoading }">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <div>
      <van-cell-group>
        <van-field style="color:#333" v-model="applyEmployee.name" label="外出人" disabled>
          <van-button slot="button" size="small" type="info" @click="changePerson">变更外出人</van-button>
        </van-field>
        <user-picker
          searchBelongCompany
          :currentCompany="myCompany"
          :selected="applyUser.id ? [applyUser] : []"
          :display="userPickerDisplay"
          @close="closePicker"
          @result="getUserResultHandle"
        ></user-picker>
        <van-field style="color:#333" v-model="applyEmployee.dept" label="部门" disabled />
        <van-field style="color:#333" v-model="applyEmployee.position" label="职务" disabled />
        <van-field style="color:#333" v-model="applyEmployee.location" label="目的地" placeholder="请输入目的地" />
        <van-field
          style="color:#333"
          v-model="applyEmployee.startTime"
          placeholder="点击选择日期"
          label="计划外出时间"
          disabled
          @click.native="datePicker('startTime')"
        />
        <van-field
          style="color:#333"
          v-model="applyEmployee.endTime"
          placeholder="点击选择日期"
          label="计划返回时间"
          disabled
          @click.native="datePicker('endTime')"
        />
        <van-field
          v-model="applyEmployee.reason"
          type="textarea"
          label="外出事由"
          placeholder="请填写外出事由"
          rows="1"
          autosize
        />
      </van-cell-group>
    </div>
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="!isLoading ? submit() : null"
            :disabled="isLoading"
            style="width:100%;height:40px;"
            type="primary"
            >提交</van-button
          >
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import UserPicker from '@/components/UserPicker'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { mapModules } from 'vuet'
export default {
  mixins: [
    mapModules({
      home: 'home'
    })
  ],
  name: 'apply',
  data() {
    return {
      isLoading: false,
      loadingText: '',
      myCompany: '',
      applyUser: {},
      userPickerDisplay: false,
      applyEmployee: {
        name: '',
        location: '',
        startTime: '',
        endTime: '',
        reason: ''
      }
    }
  },
  mounted() {
    this.applyInit()
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: this.$route.name
    })
  },
  methods: {
    changePerson() {
      this.userPickerDisplay = true
      this.applyEmployee.startTime = ''
      this.applyEmployee.endTime = ''
    },
    closePicker() {
      this.userPickerDisplay = false
    },
    getUserResultHandle(result) {
      let user = result.users.length !== 0 ? result.users[0] : {}
      this.applyUser = Object.assign({}, user)
      this.applyEmployee.name = user.name
      this.applyEmployee.position = user.position
      this.applyEmployee.dept = user.department
      this.applyEmployee.empNo = user.id
      // request.get(API.DINGTALK_APPLICATION_LEAVE_EMPLOYEE_INFO + user.id).then(res => {
      //   if (res.data && res.data.data.userID) {
      //     this.applyEmployee = res.data.data || {}
      //     let workTimeArr = (this.applyEmployee.workTime || '').split(',')
      //     this.putAmPmBeginAndEnd(workTimeArr)
      //   } else {
      //     dAlert('获取人员信息失败')
      //   }
      // })
    },
    dateValidate() {
      if (this.applyEmployee.startTime && this.applyEmployee.endTime) {
        let beginTime = new Date(this.applyEmployee.startTime.replace(/-/g, '/')).getTime()
        let endTime = new Date(this.applyEmployee.endTime.replace(/-/g, '/')).getTime()
        if (beginTime - endTime > 0) {
          dAlert('外出开始时间必须小于外出结束时间！')
          return false
        }
      }
      return true
    },
    datePicker(key) {
      const that = this
      let now = new Date()
      let nowStr =
        now.getFullYear() +
        '-' +
        (now.getMonth() + 1) +
        '-' +
        now.getDate() +
        ' ' +
        now.getHours() +
        ':' +
        now.getMinutes() +
        ':' +
        now.getSeconds()
      dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm:ss',
        value: this.applyEmployee.startTime || nowStr,
        onSuccess: function(result) {
          that.applyEmployee[key] = result.value
          if (!that.dateValidate()) {
            that.applyEmployee[key] = ''
          }
        },
        onFail: function(err) {}
      })
    },
    applyInit() {
      this.isLoading = true
      this.loadingText = '数据加载中...'
      request
        .get(API.OUT_BUSINESS_TRIP_FIND_UNFINISH)
        .then(res => {
          this.isLoading = false
          let data = res.data || {}
          this.applyEmployee = data.data || {}
          if (this.applyEmployee.fdId) {
            this.$dAlert('您当前有未完成的外出申请，不允许发起新的外出', () => {
              this.$router.back()
            })
          }
        })
        .catch(err => {
          this.isLoading = false
          dAlert('数据加载异常:' + (err.message || err.data.msg))
        })
    },
    submit() {
      if (!this.applyEmployee.name) {
        this.$dAlert('当前外出申请异常')
        return false
      }
      if (!this.applyEmployee.location) {
        this.$dAlert('当前外出申请异常')
        return false
      }
      if (!this.applyEmployee.startTime) {
        this.$dAlert('请选择计划外出时间')
        return false
      }
      if (!this.applyEmployee.endTime) {
        this.$dAlert('请选择计划返回时间')
        return false
      }
      if (!this.applyEmployee.reason) {
        this.$dAlert('请填写外出事由')
        return false
      }
      this.$dConfirm('确认保存当前数据吗？', () => {
        this.doSubmit()
      })
    },
    resetForm() {
      this.startTime = ''
      this.endTime = ''
      this.applyEmployee = {
        location: '',
        startTime: '',
        endTime: '',
        reason: ''
      }
    },
    doSubmit() {
      let that = this
      let url = API.OUT_BUSINESS_TRIP_FIND_SAVE
      this.applyEmployee.empNo = this.applyEmployee.empNo || this.home._LOGINUSER_.userid
      let params = this.applyEmployee
      this.loadingText = '数据提交中...'
      this.isLoading = true
      request
        .post(url, params)
        .then(res => {
          this.isLoading = false
          let errCode = res.data.errorCode
          dAlert(res.data.msg, () => {
            if (errCode) {
              that.resetForm()
              that.$router.back()
            }
          })
        })
        .catch(err => {
          dAlert(err.data.msg)
          this.isLoading = false
        })
    }
  },
  components: {
    Footbar,
    UserPicker
  }
}
</script>

<style lang="less">
.out-bussiness-trip-content {
  .van-field__label {
    max-width: 105px;
  }
}
</style>
