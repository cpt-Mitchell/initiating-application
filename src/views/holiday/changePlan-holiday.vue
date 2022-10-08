<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
     <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>姓名</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.employeeName || '' }}</label>
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
              <span>职务</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.job || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>职务等级</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.jobLevel || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>标准天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysStandard || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>可休天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysAllowed || '' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="sub-head" style="margin-bottom: 10px">
          <span>原休假计划</span>
        </div>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>开始时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{ form.startDateBefore || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>结束时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.endDateBefore || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>总天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysTotalBefore || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>周末天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysWeekendBefore || '' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="sub-head" style="margin-bottom: 10px">
        <span>调整后休假计划</span>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>开始时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  v-if="form.startDate === ''"
                  @click="handleSelectDate('startDate')"
                  :style="{ color: form.startDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label>
                <label v-else @click="handleSelectDate('startDate')">{{ form.startDate || '请选择日期' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>结束时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <!-- <label
                  v-if="form.endDate === ''"
                  @click="handleSelectDate('endDate')"
                  :style="{ color: form.endDate === '' ? '#2196f3' : '#c8c9cc' }"
                >请选择日期</label> -->
                <label>{{ form.endDate || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>总天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysTotal || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>周末天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysWeekend || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>调整原因</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.reason" row="3" autosize type="textarea" style="padding:0;" placeholder="请输入原因"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="24" class="label-header">
              <span>调整后休假计划与不能同时休假人员xxx/xxx的休假计划有冲突，但仍坚持申请调整的理由如下：</span>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>具体理由</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.specificReason" row="3" autosize type="textarea" style="padding:0;" placeholder="请输入原因"/>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <footbar>
        <van-row>
          <van-col span="12">
            <van-button type="info" style="height: 40px;width:100%" @click="submitData(false)">提交</van-button>
          </van-col>
          <van-col span="12">
            <van-button type="primary" style="height: 40px;width:100%" @click="jump">不能同休人员休假计划</van-button>
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
import { parseTime } from '@/utils/DateTimeUtil'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      isLoading: false,
      loadingText: '',
      form: {
        employeeName: '',
        dept: '',
        job: '',
        jobLevel: '',
        daysStandard: '',
        daysAllowed: '',
        startDateBefore: '',
        endDateBefore: '',
        daysTotalBefore: '',
        daysWeekendBefore: '',
        daysTotal: '',
        daysWeekend: '',
        startDate: '',
        endDate: '',
        reason: '',
        specificReason: ''
      },
      empId: ''
    }
  },
  components: { Footbar },
  methods: { // 088
    jump() {
      this.$router.push({
        path: '/holiday/notsame-holiday'
      })
    },
    getDaysBetween(date1,date2) {
      let  startDate = Date.parse(date1)
      let  endDate = Date.parse(date2)
      if (startDate>endDate){
          return 0
      }
      if (startDate==endDate){
          return 1
      }
      let days=(endDate - startDate)/(1*24*60*60*1000)
      this.form.daysTotal = days
    },
    handleSelectDate(val) {
      let that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd',
        value: that.form[val] || '', // 默认显示
        onSuccess: function (result) {
          that.form[val] = result.value
          if(that.form.startDate){
            // that.getDaysBetween(that.form.startDate,that.form.endDate)
            that.computedDays()
          }
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
          this.form.annualYear = parseTime(new Date(), '{y}')
          this.form.employeeId = this.empId
          request
            .post(API.adjustSave, params)
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
    computedDays() {
      let params = {
        startDate: this.form.startDate,
        days: this.form.daysAllowed
      }
      request
        .get(API.holidayGetData, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            let obj = res.data.data || {}
            obj.startDate = this.form.startDate
            this.form = Object.assign(this.form, obj)
            this.$forceUpdate()
          }
        })
        .catch(err => { })
    },
    init() {
      let params = {
        year: parseTime(new Date(), '{y}'),
        empId: this.empId
      }
      this.isLoading = true
      this.loadingText = '数据加载中'
      request
        .get(API.adjustGet, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
          }
          this.isLoading = false
        })
        .catch(err => {this.isLoading = false})
    }

  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '休假安排计划调整申请'
    })
    this.empId = vuet.modules.home._LOGINUSER_.userid || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
