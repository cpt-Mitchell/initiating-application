<template>
  <div style="height: 100%" :class="{ 'box-loading': isLoading || isUploading }">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <vue-element-loading
      :active="isUploading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <div>
      <dev-mock-user />
      <van-cell-group>
        <van-field style="color: #333" v-model="applyEmployee.userName" label="请假人" disabled>
          <van-button v-if="!oldRecordId" slot="button" size="small" type="info" @click="changePerson">
            变更请假人
          </van-button>
        </van-field>
        <van-field style="color: #333" v-model="applyEmployee.deptName" label="所属部门" disabled />
        <van-field style="color: #333" v-model="applyEmployee.posiName" label="职务" disabled />
        <van-field style="color: #333" v-model="applyEmployee.sex" label="性别" disabled />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title van-field__label">
            <span>请假类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                :disabled="oldRecordId"
                v-model="form.leaveType"
                class="van-field__control"
                @change="leaveTypeChange"
              >
                <option value selected>请选择请假类型</option>
                <template v-for="(option, index) in leaveTypeOpts">
                  <option
                    :key="index"
                    :value="option"
                    v-if="
                      option !== '隐私病假'
                        ? !applyEmployee.deptName.includes('销售公司') && option === '病假'
                          ? false
                          : true
                        : false
                    "
                  >
                    {{ option }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)" v-if="form.leaveType == '丧假'">
          <div class="van-cell__title van-field__label">
            <span>户口类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select :disabled="oldRecordId" v-model="form.leaveCategory" class="van-field__control">
                <option value="" selected>请选择户口类型</option>
                <option v-for="(option, index) in ['城市', '农村']" :key="index" :label="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- <div class="van-cell van-field" style="color: rgb(51, 51, 51)" v-if="form.leaveType == '特殊事假'">
          <div class="van-cell__title van-field__label">
            <span>请假类别</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.leaveCategory" class="van-field__control">
                <option value="" selected>请选择请假类别</option>
                <option v-for="(option, index) in leaveSpecTypeOPts" :key="index" :label="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div> -->
        <van-field
          style="color: #333"
          v-model="form.beginDate"
          placeholder="点击选择日期"
          label="开始时间"
          disabled
          @click.native="beginDatePicker"
        />
        <van-field
          style="color: #333"
          v-model="form.endDate"
          placeholder="点击选择日期"
          label="结束时间"
          disabled
          @click.native="endDatePicker"
        />
        <van-field
          v-if="
            (isDayMember || ['岗位工', '组长', '班长'].includes(applyEmployee.posiName)) &&
            form.beginDate &&
            form.endDate
          "
          v-model="form.leaveDayCnt"
          type="number"
          label="请假天数"
          placeholder="请填写请假天数"
        />
        <van-field
          v-model="leaveDays.workDays"
          :disabled="!(isDayMember || ['岗位工', '组长', '班长'].includes(applyEmployee.posiName))"
          type="number"
          label="工作日天数"
          placeholder="请填写工作日天数"
        />
        <van-field
          v-model="leaveDays.sumDays"
          :disabled="!(isDayMember || ['岗位工', '组长', '班长'].includes(applyEmployee.posiName))"
          type="number"
          label="合计天数"
          placeholder="请填写合计天数"
        />
        <!-- <div
          class="van-cell van-field"
          style="color: rgb(51, 51, 51)"
          v-if="!['岗位工', '组长', '班长'].includes(applyEmployee.posiName) && form.beginDate && form.endDate"
        >
          <div class="van-cell__value">
            <div class="van-field__body">
              <div class="form-item-box sum-days">
                <span>工作日({{ leaveDays.workDays || 0 }})</span>
                <span>节假日({{ leaveDays.holiDays || 0 }})</span>
                <span>双休日({{ leaveDays.weekend || 0 }})</span>
                <span>合计({{ leaveDays.sumDays || 0 }})</span>
              </div>
            </div>
          </div>
        </div> -->
        <van-field
          v-model="form.leaveReason"
          type="textarea"
          label="请假事由"
          placeholder="请填写请假事由"
          rows="1"
          autosize
        />
      </van-cell-group>
      <template v-if="form.leaveType && evidenceObj[form.leaveType]">
        <div class="sub-head">
          <van-row>
            <van-col span="24">
              <span>证明材料</span>
            </van-col>
          </van-row>
        </div>
        <van-cell-group>
          <table class="table">
            <colgroup>
              <col style="width: 40%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
            </colgroup>
            <thead>
              <tr>
                <th>材料名称</th>
                <th>上传</th>
                <th colspan="2">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, listIndex) in evidenceList">
                <template v-for="(item1, i) in item.list">
                  <tr
                    v-if="
                      form.leaveType === '丧假' &&
                      ((form.leaveCategory === '城市' && item.key !== '死亡证明(村委会出具证明)') ||
                        (form.leaveCategory === '农村' && item.key !== '死亡证明(殡仪馆)'))
                    "
                    :key="i + item.key"
                  >
                    <td :rowspan="item.list.length" v-if="i == 0">{{ item.key }}</td>
                    <td style="text-align: center" :rowspan="item.list.length" v-if="i == 0">
                      <div class="images-box">
                        <div class="add-btn-paper primary mu-paper upl-box" :z-depth="1">
                          <!-- capture="camera" -->
                          <input type="file" accept="image/*" @change="_onChange($event, i, listIndex)" />上传
                        </div>
                      </div>
                    </td>
                    <td style="text-align: center">
                      <div class="images-box" v-if="item1.fullUrl">
                        <div class="add-btn-paper info mu-paper upl-box" @click="viewImage(item1.fullUrl)">查阅</div>
                      </div>
                    </td>
                    <td style="text-align: center">
                      <div class="images-box" @click="deleteFileByType(item.list, i)" v-if="item1.fullUrl">
                        <div class="add-btn-paper danger mu-paper upl-box">删除</div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="form.leaveType !== '丧假'" :key="i + item.key">
                    <td :rowspan="item.list.length" v-if="i == 0">{{ item.key }}</td>
                    <td style="text-align: center" :rowspan="item.list.length" v-if="i == 0">
                      <div class="images-box">
                        <div class="add-btn-paper primary mu-paper upl-box" :z-depth="1">
                          <!-- capture="camera" -->
                          <input type="file" accept="image/*" @change="_onChange($event, i, listIndex)" />上传
                        </div>
                      </div>
                    </td>
                    <td style="text-align: center">
                      <div class="images-box" v-if="item1.fullUrl">
                        <div class="add-btn-paper info mu-paper upl-box" @click="viewImage(item1.fullUrl)">查阅</div>
                      </div>
                    </td>
                    <td style="text-align: center">
                      <div class="images-box" @click="deleteFileByType(item.list, i)" v-if="item1.fullUrl">
                        <div class="add-btn-paper danger mu-paper upl-box">删除</div>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </van-cell-group>
      </template>
      <user-picker
        searchBelongCompany
        :currentCompany="myCompany"
        :selected="applyUser.id ? [applyUser] : []"
        :display="userPickerDisplay"
        @close="closePicker"
        @result="getUserResultHandle"
      ></user-picker>
    </div>
    <footbar>
      <van-row>
        <!-- <mu-col>
                <mu-button full-width color="success" :disabled="isLoading" style="height: 40px" @click="!isLoading?submit(false):null">保存</mu-button>
        </mu-col>-->
        <van-col span="24">
          <van-button
            @click="!isLoading && !isUploading ? submit() : null"
            :disabled="isLoading || isUploading"
            style="width: 100%; height: 40px"
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
import { parseTime } from '@/utils/DateTimeUtil'
import DevMockUser from '@/components/DevMockUser'
import { Toast } from 'vant'

export default {
  name: 'apply',
  data() {
    return {
      oldRecordId: '',
      isLoading: false,
      userPickerDisplay: false,
      loadingText: '',
      applyEmployee: {},
      applyUser: {},
      // files: [],
      myCompany: '',
      leaveDays: {},
      workTimes: {},
      // uploadFilesInfo: [],
      privateDiseaseFlowId: '',
      isUploading: false,
      form: {
        leaveType: '',
        leaveReason: '',
        beginDate: '',
        endDate: '',
        leaveCategory: ''
      },
      leaveTypeOpts: [],
      isDayMember: false,
      evidenceObj: {
        '病假': {
          '病休证明': '',
          '病情处理证明': '',
          '住院证明': '',
          '病历': ''
        },
        '丧假': {
          '直系亲属证明': '',
          '死亡证明(医疗机构)': '',
          '死亡证明(殡仪馆)': '',
          '死亡证明(村委会出具证明)': ''
        },
        '婚假': {
          '结婚证': ''
        },
        '产假': {
          '保育档案': ''
        },
        '陪产护理假': {
          '结婚证': '',
          '保育档案': ''
        }
      }
    }
  },
  mounted() {
    // 当有oldRecordId传入的时候表示是请假核准，请假核准不可修改请假人和请假类型，其他的都能修改
    this.oldRecordId = this.$route.query.oldRecordId
    this.$nextTick(() => {
      this.applyInit(this.oldRecordId ? this.getOldRecordData : null)
    })
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: this.$route.name + (this.oldRecordId ? '(核准)' : '')
    })
  },
  computed: {
    evidenceList() {
      if (!this.evidenceObj[this.form.leaveType]) {
        return []
      } else {
        let arr = []
        for (let key in this.evidenceObj[this.form.leaveType]) {
          arr.push({
            key,
            list: [{ origin: '', destination: '', url: '', module: '', fullUrl: '' }]
          })
        }
        return arr
      }
    }
  },
  watch: {
    'form.beginDate'(val) {
      if (val && this.form.endDate) {
        this.getLeaveDays(val, this.form.endDate)
      }
    },
    'form.endDate'(val) {
      if (val && this.form.beginDate) {
        this.getLeaveDays(this.form.beginDate, val)
      }
    }
  },
  methods: {
    // 通过recordId查询oa已申请过的请假信息
    getOldRecordData(employee) {
      request
        .post(API.DINGTALK_LEAVE_INITAPV, {
          RowId: this.oldRecordId
        })
        .then(res => {
          this.isLoading = false
          let data = res.data
          if (data.errorCode === 0) {
            let leaveObj = data.leave || {}
            if (employee.userID !== leaveObj.zdUserID) {
              // 正常情况不会弹出这个提示，这个核准申请是在钉钉oa审核审批代办列表跳转到此页面，
              // 只有申请人列表才会有此代办
              dAlert('请假核准需本人亲自申请！', () => {
                // 如果通过非正常操作进入此页面则判断当前登录人userId和recordId申请人userId对比
                // 不匹配则退回，注意此处用history.back是直接回退上一页面，而不是跳转oa审核审批代办url
                // 是防止用户在钉钉上需点2次左上角返回才能退出系统
                // 申请成功后的返回也是一个道理
                window.history.back()
              })
              return false
            }
            this.form.leaveType = leaveObj.qjTypebf
            this.form.leaveReason = leaveObj.qjReason
            this.form.beginDate = parseTime(leaveObj.qjBeginDate, '{y}-{m}-{d} {h}:{i}')
            this.form.endDate = parseTime(leaveObj.qjEndDate, '{y}-{m}-{d} {h}:{i}')
            this.form.leaveCategory = leaveObj.houseHold
            this.form.leaveDayCnt = leaveObj.qjCount
            this.leaveDays = {
              workDays: leaveObj.qjCount || 0,
              holiDays: leaveObj.qjjrCount || 0,
              weekend: leaveObj.qjweekCount || 0,
              sumDays: leaveObj.qjtotalCount || 0
            }
          }
        })
        .catch(err => (this.isLoading = false))
    },
    leaveTypeChange() {
      this.form.leaveCategory = ''
    },
    viewImage(url) {
      dd.biz.util.previewImage({
        urls: [url], // 图片地址列表
        current: url, // 当前显示的图片链接
        onSuccess: function (result) {
        },
        onFail: function (err) { }
      })
    },
    deleteFileByType(list = [], i) {
      if (i === 0) {
        list[i] = { origin: '', destination: '', url: '', module: '', fullUrl: '' }
      } else {
        list.splice(i, 1)
      }
      this.$forceUpdate()
    },
    closePicker() {
      this.userPickerDisplay = false
    },
    getLeaveDays(begin, end) {
      request.get(`${API.DINGTALK_APPLICATION_LEAVE_COUNT_DAYS}${begin}/${end}`).then(res => {
        let errorCode = res.data.errorCode
        if (errorCode) {
          let arr = (res.data.data || '').split(',')
          this.leaveDays = {
            workDays: arr[0] || 0,
            holiDays: arr[1] || 0,
            weekend: arr[2] || 0,
            sumDays: arr[3] || 0
          }
        } else {
          dAlert(res.data.msg)
        }
      })
    },
    getUserResultHandle(result) {
      let user = result.users.length !== 0 ? result.users[0] : {}
      this.applyUser = Object.assign({}, user)
      request.get(API.DINGTALK_APPLICATION_LEAVE_EMPLOYEE_INFO + user.id).then(res => {
        if (res.data && res.data.data.userID) {
          this.applyEmployee = res.data.data || {}
          let workTimeArr = (this.applyEmployee.workTime || '').split(',')
          this.form = {
            leaveType: '',
            leaveReason: '',
            beginDate: '',
            endDate: '',
            leaveCategory: ''
          }
          this.putAmPmBeginAndEnd(workTimeArr)
        } else {
          dAlert('获取人员信息失败')
        }
      })
    },
    changePerson() {
      this.userPickerDisplay = true
    },
    dateValidate(val) {
      if (!val && !this.form.beginDate) {
        return false
      }
      if (this.form.beginDate && this.form.endDate) {
        let beginTime = new Date(this.form.beginDate.replace(/-/g, '/')).getTime()
        let endTime = new Date(this.form.endDate.replace(/-/g, '/')).getTime()
        if (beginTime - endTime > 0) {
          dAlert('请假开始时间必须小于请假结束时间！')
          return false
        }
      }
      return true
    },
    beginDatePicker() {
      /**
       * 1、补请假或提前请假的都以半天起步请。
       * 2、当天录入请假的，录入的请假开始时间是应控制整半点请假（注意时间校正），结束时间，按请假班次对接的下班时间来算。注意请假天数的算法。
       * 3、岗位工可以手工录入时间，请假天数让他们自己手工录入。
       */
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
        now.getMinutes()
      dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm',
        value: this.form.beginDate || nowStr,
        onSuccess: (result) => {
          // 每次选择日期都重置计算天数
          this.leaveDays.workDays = ''
          this.leaveDays.sumDays = ''
          let arrDateTime = result.value.split(' ')
          let arrTime = arrDateTime[1].split(':')
          let hours = arrTime[0]
          let minutes = arrTime[1]
          // 岗位工请假时间随便选，其他职位按上班时间请假，提前或补请假只能以半天为单位请假
          if (this.isDayMember || ['岗位工', '组长', '班长'].includes(this.applyEmployee.posiName)) {
            this.form.beginDate = result.value
          } else {
            if (parseTime(now, '{y}-{m}-{d}') !== result.value.substring(0, 10)) {
              if (parseInt(hours) < parseInt(this.workTimes.endAm.hours)) {
                hours = this.workTimes.beginAm.hours
                minutes = this.workTimes.beginAm.minutes
              } else if (parseInt(hours) === parseInt(this.workTimes.endAm.hours)) {
                if (parseInt(minutes) <= parseInt(this.workTimes.endAm.minutes)) {
                  hours = this.workTimes.beginAm.hours
                  minutes = this.workTimes.beginAm.minutes
                } else {
                  hours = this.workTimes.beginPm.hours
                  minutes = this.workTimes.beginPm.minutes
                }
              } else {
                hours = this.workTimes.beginPm.hours
                minutes = this.workTimes.beginPm.minutes
              }
            } else {
              // 当前小时小于上午上班开始时间小时，则取上午上班开始时间小时数
              if (hours < this.workTimes.beginAm.hours) {
                hours = this.workTimes.beginAm.hours
                minutes = this.workTimes.beginAm.minutes
              } else if (hours >= this.workTimes.endAm.hours && hours < this.workTimes.beginPm.hours) { // 当前小时大于上午上班结束时间小时且小于下午上班开始小时数，则取上午上班结束时间小时数
                // 当小时数等于上午上班结束时间且分钟数大于等于上午上班结束时间，则小时和分钟数取下午上班开始小时和分钟
                if (hours === this.workTimes.endAm.hours && minutes >= this.workTimes.endAm.minutes) {
                  minutes = this.workTimes.beginPm.minutes
                  hours = this.workTimes.beginPm.hours
                } else if (hours === this.workTimes.endAm.hours && minutes % 30 !== 0) {
                  hours = this.workTimes.endAm.hours
                  minutes -= minutes % 30
                } else {
                  minutes = this.workTimes.endAm.minutes
                  hours = this.workTimes.endAm.hours
                }
              } else if (hours >= this.workTimes.beginPm.hours && hours <= this.workTimes.endPm.hours) { // 当前小时大于等于下午上班开始时间且小于下班下午结束时间
                if (hours === this.workTimes.endPm.hours && minutes === this.workTimes.endPm.minutes) {
                  minutes = this.workTimes.endPm.minutes
                } else {
                  minutes -= minutes % 30
                }
              } else if (hours > this.workTimes.endPm.hours) {
                hours = this.workTimes.endPm.hours
                minutes = this.workTimes.endPm.minutes
              } else {
                minutes -= minutes % 30
              }
              if ((minutes + '').length === 1) {
                minutes = '0' + minutes
              }
            }
          }
          const d = new Date(result.value)
          if (d.getDay() === 1 && parseInt(hours) <= parseInt(this.workTimes.endAm.hours) && parseInt(minutes) <= parseInt(this.workTimes.endAm.minutes)) {
            arrDateTime[0] = parseTime(new Date(d.getTime() - 2 * 24 * 60 * 60 * 1000), '{y}-{m}-{d}')
            hours = this.workTimes.beginAm.hours
            minutes = this.workTimes.beginAm.minutes
          }
          let dtime = arrDateTime[0] + ' ' + hours + ':' + minutes
          if (
            this.form.endDate &&
            new Date(this.form.endDate.replace(/-/g, '/') + ':00').getTime() <=
            new Date(dtime.replace(/-/g, '/') + ':00').getTime()
          ) {
            this.form.beginDate = ''
            this.$dAlert('请假开始时间不能小于或等于请假结束时间')
          } else {
            this.form.beginDate = dtime
          }
          console.log(this.form.beginDate)
        },
        onFail: function (err) { }
      })
    },
    endDatePicker() {
      /**
       * 1、补请假或提前请假的都以半天起步请。
       * 2、当天录入请假的，录入的请假开始时间是应控制整半点请假（注意时间校正），结束时间，按请假班次对接的下班时间来算。注意请假天数的算法。
       * 3、岗位工可以手工录入时间，请假天数让他们自己手工录入。
       */
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
        now.getMinutes()
      dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm',
        value: this.form.endDate || nowStr,
        onSuccess: (result) => {
          // 每次选择日期都重置计算天数
          this.leaveDays.workDays = ''
          this.leaveDays.sumDays = ''
          let arrDateTime = result.value.split(' ')
          let arrTime = arrDateTime[1].split(':')
          let hours = arrTime[0]
          let minutes = arrTime[1]
          if (this.isDayMember || ['岗位工', '组长', '班长'].includes(this.applyEmployee.posiName)) {
            this.form.endDate = result.value
          } else {
            if (parseTime(now, '{y}-{m}-{d}') !== result.value.substring(0, 10)) {
              if (parseInt(hours) < parseInt(this.workTimes.beginPm.hours)) {
                hours = this.workTimes.endAm.hours
                minutes = this.workTimes.endAm.minutes
              } else if (parseInt(hours) === parseInt(this.workTimes.beginPm.hours)) {
                if (parseInt(minutes) <= parseInt(this.workTimes.beginPm.minutes)) {
                  hours = this.workTimes.endAm.hours
                  minutes = this.workTimes.endAm.minutes
                } else {
                  hours = this.workTimes.endPm.hours
                  minutes = this.workTimes.endPm.minutes
                }
              } else {
                hours = this.workTimes.endPm.hours
                minutes = this.workTimes.endPm.minutes
              }
            } else {
              // 当前小时小于上午上班开始时间小时，则取上午上班开始时间小时数
              if (hours < this.workTimes.beginAm.hours) {
                hours = this.workTimes.beginAm.hours
                minutes = this.workTimes.beginAm.minutes
              } else if (hours >= this.workTimes.endAm.hours && hours < this.workTimes.beginPm.hours) { // 当前小时大于上午上班结束时间小时且小于下午上班开始小时数，则取上午上班结束时间小时数
                // 当小时数等于上午上班结束时间且分钟数大于等于上午上班结束时间，则小时和分钟数取下午上班开始小时和分钟
                if (hours === this.workTimes.endAm.hours && minutes >= this.workTimes.endAm.minutes) {
                  minutes = this.workTimes.endAm.minutes
                  hours = this.workTimes.endAm.hours
                } else if (hours === this.workTimes.endAm.hours && minutes % 30 !== 0) {
                  hours = this.workTimes.endAm.hours
                  minutes -= minutes % 30
                } else {
                  minutes = this.workTimes.endAm.minutes
                  hours = this.workTimes.endAm.hours
                }
              } else if (hours >= this.workTimes.beginPm.hours && hours <= this.workTimes.endPm.hours) { // 当前小时大于等于下午上班开始时间且小于下班下午结束时间
                if (hours === this.workTimes.endPm.hours && minutes === this.workTimes.endPm.minutes) {
                  minutes = this.workTimes.endPm.minutes
                } else {
                  minutes -= minutes % 30
                }
              } else if (hours > this.workTimes.endPm.hours) {
                hours = this.workTimes.endPm.hours
                minutes = this.workTimes.endPm.minutes
              } else {
                minutes -= minutes % 30
              }
              if ((minutes + '').length === 1) {
                minutes = '0' + minutes
              }
            }
          }
          const d = new Date(result.value)
          if (d.getDay() === 5 && parseInt(hours) >= parseInt(this.workTimes.endPm.hours) && parseInt(minutes) >= parseInt(this.workTimes.endPm.minutes)) {
            arrDateTime[0] = parseTime(new Date(d.getTime() + 2 * 24 * 60 * 60 * 1000), '{y}-{m}-{d}')
            hours = this.workTimes.endPm.hours
            minutes = this.workTimes.endPm.minutes
          }
          let dtime = arrDateTime[0] + ' ' + hours + ':' + minutes
          if (
            this.form.beginDate &&
            new Date(this.form.beginDate.replace(/-/g, '/') + ':00').getTime() >=
            new Date(dtime.replace(/-/g, '/') + ':00').getTime()
          ) {
            this.form.endDate = ''
            this.$dAlert('请假结束时间不能小于或等于请假开始时间')
          } else {
            this.form.endDate = dtime
          }
        },
        onFail: function (err) { }
      })
    },
    putAmPmBeginAndEnd(workTimeArr) {
      let beginAm = this.getHoursAndMinutes(workTimeArr[0])
      let endAm = this.getHoursAndMinutes(workTimeArr[1])
      let beginPm = this.getHoursAndMinutes(workTimeArr[2])
      let endPm = this.getHoursAndMinutes(workTimeArr[3])
      this.workTimes = {
        beginAm: {
          hours: beginAm.hours,
          minutes: beginAm.minutes
        },
        endAm: {
          hours: endAm.hours,
          minutes: endAm.minutes
        },
        beginPm: {
          hours: beginPm.hours,
          minutes: beginPm.minutes
        },
        endPm: {
          hours: endPm.hours,
          minutes: endPm.minutes
        }
      }
    },
    getHoursAndMinutes(time) {
      let arr = (time || '').split(':')
      return {
        hours: arr[0] || '',
        minutes: arr[1] || ''
      }
    },
    applyInit(cb) {
      this.isLoading = true
      this.loadingText = '数据加载中...'
      request
        .get(API.DINGTALK_APPLICATION_LEAVE_FORM)
        .then(res => {
          this.isLoading = false
          let data = res.data.data || {}
          this.privateDiseaseFlowId = data.privateDisease || ''
          this.leaveTypeOpts = data.type ? data.type.normal || [] : []
          this.leaveSpecTypeOPts = data.type ? data.type.special || [] : []
          this.applyEmployee = data.info || {}
          cb && cb(this.applyEmployee)
          let workTimeArr = (this.applyEmployee.workTime || '').split(',')
          this.putAmPmBeginAndEnd(workTimeArr)
          this.myCompany = (this.applyEmployee.deptName || '').split('>')[0]
          this.$nextTick(() => {
            this.checkIsDayMember()
          })
        })
        .catch(err => {
          this.isLoading = false
          dAlert('数据加载异常:' + (err.message || err.data.msg))
        })
    },
    _onChange: function (event, idx, listIndex) {
      event.preventDefault()
      let target = event.target
      let files = target.files
      files = Array.prototype.slice.call(files, 0)
      this.$nextTick(() => {
        this.isUploading = true // 弹出正在上传
        this.uploadImage(files, listIndex)
      })
    },
    uploadImage(files, listIndex) {
      const uploadReqeust = (params, cb) => {
        request
          .post(API.DINGTALK_FILEUPLOAD, params, {
            // onUploadProgress: (p) => {
            //     cb && cb(Math.round((p.loaded * 100) / p.total));
            // },
          })
          .then(res => {
            cb && cb(res)
          })
          .catch(err => {
            this.isUploading = false // 弹出上传失败
            Toast('上传失败，请重试！')
          })
      }
      files.forEach(item => {
        let formData = new FormData()
        formData.append('file', item)
        uploadReqeust(
          formData,
          res => {
            this.isUploading = false // 上传完成
            let errorCode = res.data.errorCode
            if (errorCode) {
              let obj = this.evidenceList[listIndex] // 类型层级list
              let curentFileIndex = !obj.list[obj.list.length - 1].fullUrl ? obj.list.length - 1 : obj.list.length
              obj.list[curentFileIndex] = res.data.data
              obj.list[curentFileIndex].module = obj.key
              this.$forceUpdate()
            } else {
              Toast('上传失败，请重试！')
              // if (!errorCode) this.$refs['bar-text-' + barIndex][0].class += ' error'
            }
          }
        )
      })
    },
    checkRepeat(cb) {
      // 二次请假不需要检测重复日期请假
      if (this.oldRecordId) {
        cb && cb()
        return false
      }
      this.loadingText = '正在检测请假日期'
      this.isLoading = true
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '判断请假重复',
        task: '判断请假重复',
        payload: {
          txtqjBeginDateReal: this.form.beginDate.substring(0, 10),
          txtqjEndDateReal: this.form.endDate.substring(0, 10)
        }
      }
      request
        .post(API.DINGTALK_OA_COMMON_SUBMITAPV, params)
        .then(res => {
          this.isLoading = false
          if (res.data.errorCode === 0) {
            let data = res.data || {}
            try {
              let count = data.data.data.count
              if (count === 0) {
                this.$nextTick(() => {
                  cb && cb()
                })
              } else {
                dAlert('已有相同时间段的请假单')
              }
            } catch (e) {
              dAlert('请假申请日期检测异常')
            }
          } else {
            dAlert(res.data.msg || '请假申请日期检测失败')
          }
        })
        .catch(err => (this.isLoading = false))
    },
    checkIsDayMember() {
      let params = {
        'formid': '_',
        'apvResult': '同意',
        'module': 'OA请假',
        'task': '请假人员班次',
        'payload': {
          'user_id': this.applyEmployee.userID
        }
      }
      request
        .post(API.DINGTALK_OA_COMMON_SUBMITAPV, params)
        .then(res => {
          if (res.data.errorCode === 0) {
            let data = res.data || {}
            this.isDayMember = data.data.form.RunNo.includes('日班')
          } else {
            this.isDayMember = false
          }
          console.log(this.form.endDate)
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetForm() {
      this.beginDate = ''
      this.endDate = ''
      this.form = {
        leaveType: '',
        leaveReason: '',
        beginDate: '',
        endDate: ''
      }
    },
    submit() {
      if (!this.applyEmployee || !this.applyEmployee.workFlowID) {
        this.$dAlert('当前请假异常，workFlowID为空，请联系开发人员')
        return false
      }
      if (!this.form.leaveType) {
        this.$dAlert('请选择请假类型')
        return false
      } else {
        if (this.form.leaveType === '特殊事假' && !this.form.leaveCategory) {
          this.$dAlert('请选择请假类别')
          return false
        }
      }
      if (!this.form.beginDate) {
        this.$dAlert('请选择请假开始时间')
        return false
      }
      if (!this.form.endDate) {
        this.$dAlert('请选择请假结束时间')
        return false
      }
      if ((this.isDayMember || ['岗位工', '组长', '班长'].includes(this.applyEmployee.posiName)) && !this.form.leaveDayCnt) {
        this.$dAlert('请假天数不能为空或者等于0')
        return false
      }
      if (!this.form.leaveReason) {
        this.$dAlert('请填写请假事由')
        return false
      }
      let fileList = []
      let uploadedTypes = []
      this.evidenceList.forEach(item => {
        item.list.forEach(file => {
          if (file.url) {
            uploadedTypes.push(item.key)
            fileList.push(Object.assign({}, file))
          }
        })
      })
      if (this.oldRecordId) {
        if (fileList.length === 0) {
          this.$dAlert('请上传证明材料')
          return false
        } else if (this.form.leaveType === '病假' && !(uploadedTypes.includes('病休证明') && (uploadedTypes.includes('病情处理证明') || uploadedTypes.includes('住院证明') || uploadedTypes.includes('病历')))) {
          this.$dAlert('请按要求上传相应证明材料')
          return false
        } else if (this.form.leaveType === '丧假') {
          if (!(uploadedTypes.includes('直系亲属证明') && uploadedTypes.includes('死亡证明(医疗机构)'))) {
            this.$dAlert('请上传直系亲属证明和死亡证明(医疗机构)')
            return false
          }
          if (this.form.leaveCategory === '农村' && !uploadedTypes.includes('死亡证明(村委会出具证明)')) {
            this.$dAlert('请上传死亡证明(村委会出具证明)')
            return false
          } else if (this.form.leaveCategory === '城市' && !uploadedTypes.includes('死亡证明(殡仪馆)')) {
            this.$dAlert('请上传死亡证明(殡仪馆)')
            return false
          }
        } else if (this.form.leaveType === '婚假' && !uploadedTypes.includes('结婚证')) {
          this.$dAlert('请上传结婚证')
          return false
        }
      }
      if (this.form.leaveType === '产假' && !uploadedTypes.includes('保育档案')) {
        this.$dAlert('请上传保育档案')
        return false
      } else if (this.form.leaveType === '陪产护理假' && !(uploadedTypes.includes('结婚证') && uploadedTypes.includes('保育档案'))) {
        this.$dAlert('请上传结婚证和保育档案')
        return false
      }
      // 属“丧假”、“病假”、“婚假”未上传材料的，应在界面上显示提示,提示内容：未提供材料，请在结束时间5个工作日提供材料进行核销！
      if (['病假', '丧假', '婚假'].includes(this.form.leaveType) && fileList.length === 0) {
        dAlert('未提供材料，请在结束时间5个工作日提供材料进行核销！', () => {
          this.checkRepeat(() => {
            this.$dConfirm('确认保存当前数据吗？', () => {
              this.doSubmit(fileList)
            })
          })
        })
      } else {
        this.checkRepeat(() => {
          this.$dConfirm('确认保存当前数据吗？', () => {
            this.doSubmit(fileList)
          })
        })
      }
    },
    doSubmit(fileList) {
      let that = this
      let url = API.DINGTALK_APPLICATION_LEAVE_APPLY
      let params = {
        type: this.form.leaveType || '',
        beginDate: this.form.beginDate || '',
        endDate: this.form.endDate || '',
        reason: this.form.leaveReason || '',
        specialType: this.form.leaveCategory || '', // 丧假户口类型
        attachmentList: fileList || [],
        proposer: this.applyEmployee.userID,
        proposerName: this.applyEmployee.userName,
        workFlowID: this.applyEmployee.workFlowID,
        oldRecordId: this.oldRecordId ? this.oldRecordId : (fileList || []).length > 0 ? '有' : ''
      }
      if (!(this.isDayMember && ['岗位工', '组长', '班长'].includes(this.applyEmployee.posiName))) {
        params = Object.assign({}, params, {
          leaveCnt: this.leaveDays.workDays || 0,
          holidayCnt: this.leaveDays.holiDays || 0,
          weekendCnt: this.leaveDays.weekend || 0,
          amount: this.leaveDays.sumDays || 0
        })
      } else {
        params = Object.assign({}, params, {
          leaveCnt: this.form.leaveDayCnt || 0,
          holidayCnt: 0,
          weekendCnt: 0,
          amount: this.form.leaveDayCnt || 0
        })
      }
      // 隐私病假已移除，没有此类型
      // if (params.type === '隐私病假') {
      //   params.workFlowID = this.privateDiseaseFlowId
      // }
      this.loadingText = '数据提交中...'
      this.isLoading = true
      request
        .post(url, params)
        .then(res => {
          this.isLoading = false
          let errCode = res.data.errorCode
          dAlert(res.data.msg, () => {
            if (errCode) {
              // 是核准申请单时，返回到oa审核审批代办列表
              if (this.oldRecordId) {
                window.history.back()
              } else {
                that.resetForm()
                that.$router.back()
              }
            }
          })
          if (res.data) {
            this.dutyList = res.data || []
          }
        })
        .catch(errr => (this.isLoading = false))
    }
  },
  components: {
    Footbar,
    UserPicker,
    DevMockUser
  }
}
</script>

<style lang="less" scoped>
.form-item-box {
  // padding: 0 10px;
  // margin: 0 10px 10px 10px;
  font-size: 0.36rem;
  color: #555;
  width: 100%;

  &.sum-days {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    // border-bottom: 1px solid #a0a8a94d;
    text-align: center;

    span {
      flex-grow: 1;
    }
  }
}

.table {
  text-align: center;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.32rem;
  border: 1px solid #ccc;

  thead {
    color: #fff;
    background: #04cc82;
  }

  td {
    padding-left: 2px;
    padding-right: 2px;
    line-height: 0.46rem;
    word-break: break-all;

    input {
      width: 100%;
      // padding: 5px;
      border: 1px solid #a3a3a3;
      outline: none;
      background: transparent;
      line-height: 26px;
      box-shadow: none;
      border-radius: 3px;
      height: 28px;

      &:focus {
        color: #8b8791;
      }
    }
  }

  th,
  td {
    padding: 5px;
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;

    &:last-child {
      border-right: none;
    }
  }

  tbody > tr:last-child {
    border-bottom: 1px solid #ccc;
  }
}
.upl-box {
  background: #fff;
  box-shadow: 1px 2px 2px #d5d5d5;
}
.upload-masker {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  // justify-content: center;
  align-items: center;

  .upload-progress-bar {
    width: 0;
    height: 5px;
    background: #61affe;
    border-radius: 3px;
    transition: width 0.2s ease-in;
  }

  .upload-progress-bar-text {
    font-size: 0.32rem;
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;

    // margin-top:0px;
    &.error {
      color: #f44333;
    }
  }
}

.images-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .mu-paper {
    // width: 50px;
    width: 100%;
    height: 26px;
    text-align: center;
    position: relative;
    &.primary {
      background-color: #04cc82;
    }
    &.danger {
      background-color: #f44333;
    }
    &.info {
      background-color: #61affe;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }

    &.add-btn-paper {
      line-height: 26px;
      text-align: center;
      font-size: 12px;
      color: white;
      border-radius: 3px;
      position: relative;

      input[type='file'] {
        font-size: 0;
        opacity: 0;
        width: 100%;
        filter: alpha(opacity=0);
        position: absolute;
        height: 100%;
        right: -1px;
        top: -1px;
        cursor: pointer;
      }
    }

    .file-delete {
      position: absolute;
      right: -5px;
      top: -5px;
      background: #f44333;
      border-radius: 50%;
      color: #fff;
      width: 15px;
      height: 15px;
      line-height: 13px;
      display: inline-block;
      font-size: 11px;
    }
  }
}
</style>
