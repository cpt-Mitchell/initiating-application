<template>
  <div style="height: 100%;" :class="{ 'box-loading': isLoading }">
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
        <van-field style="color:#333" v-model="form.title" label="标题" placeholder="请输入标题" />
      </van-cell-group>
      <div class="card">
        <van-row>
          <van-col span="24">
            <span class="card-header-title">调动信息</span>
          </van-col>
        </van-row>
      </div>
      <van-row class="card card-part">
        <van-col span="24">
          <table class="table">
            <colgroup>
              <col style="width:20%" />
              <col style="width:17%" />
              <col style="width:40%" />
              <col style="width:23%" />
            </colgroup>
            <thead>
              <tr>
                <th>姓名</th>
                <th>调整类别</th>
                <th>岗位</th>
                <th>生效时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in tableList">
                <template>
                  <tr :key="'before_' + index">
                    <td rowspan="2">
                      <span @click="userPermissionPickerHandle(true, false, index)">
                        {{ item.employeeName || '点击选择' }}
                      </span>
                      <br />
                      <a @click="delRow(index)" style="color:#ff0000">删除</a>
                    </td>
                    <td>{{ item.before.type }}</td>
                    <td style="text-align:left">{{ item.before.displayName }}</td>
                    <td rowspan="2" @click="datePicker(item)">
                      <span>{{ item.effect || '点击选择' }}</span>
                    </td>
                  </tr>
                  <tr :key="'after_' + index">
                    <td>{{ item.after.type }}</td>
                    <td
                      style="border-right:1px solid #ccc"
                      :style="{ 'text-align': item.after.displayName ? 'left' : '' }"
                      @click="positionPickerHandle(item, index)"
                    >
                      <span>{{ item.after.displayName || '点击选择' }}</span>
                    </td>
                  </tr>
                </template>
              </template>
              <tr>
                <td colspan="4" style="font-size:14px;font-weight:bold;padding:0;">
                  <van-button size="small" type="default" style="height:26px;width:100%;font-size:18px;" @click="addRow"
                    >+</van-button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </van-col>
      </van-row>
      <div class="card" v-if="overdraftPositions && overdraftPositions.length > 0">
        <van-row>
          <van-col span="24">
            <span class="card-header-title">超编信息</span>
          </van-col>
        </van-row>
      </div>
      <van-row class="card card-part" v-if="overdraftPositions && overdraftPositions.length > 0">
        <van-col span="24">
          <table class="table">
            <colgroup>
              <col style="width:20%" />
              <col style="width:57%" />
              <col style="width:23%" />
            </colgroup>
            <thead style="background:#d0bb00">
              <tr>
                <th>姓名</th>
                <th>临时超编原因</th>
                <th>到期日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in overdraftPositions" :key="item.fdId">
                <td>{{ item.employeeName }}</td>
                <td>
                  <div class="van-cell van-field" style="color: rgb(51, 51, 51);padding:0;">
                    <div class="van-cell__value">
                      <div class="van-field__body">
                        <select v-model="item.reason" class="van-field__control" style="font-size:13px">
                          <option value="" selected>请选择超编原因</option>
                          <option v-for="(option, index) in quotasOPts" :key="index" :value="option">
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </td>
                <td @click="datePicker(item, 6)">
                  <span>{{ item.effect || '点击选择' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </van-col>
      </van-row>
      <div class="card" v-if="distributeDeptNames.length > 0">
        <van-row>
          <van-col span="18">
            <span class="card-header-title">发布范围</span>
          </van-col>
          <van-col align="right" span="6">
            <a style="font-size:.38rem;padding-right:8px;" @click="getDistribution">更新</a>
          </van-col>
        </van-row>
        <van-row class="card card-part">
          <van-col span="24">
            <p style="margin: 0;padding: 0 10px;font-size: .38rem;line-height:1.5">
              {{ distributeDeptNames.join(';') }}
            </p>
          </van-col>
        </van-row>
      </div>
    </div>
    <position-picker :display="showPositionPicker" @close="closePicker" @result="getPositionName"></position-picker>
    <user-picker
      :multiple="userMultiple"
      :selected="singleUser ? [singleUser] : []"
      :display="showUserPicker"
      @close="closePicker"
      @result="userPermissionResultHandle"
    ></user-picker>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button type="info" style="height: 40px;width:100%" @click="submitForm(false)">保存</van-button>
        </van-col>
        <van-col span="12">
          <van-button type="primary" style="height: 40px;width:100%" @click="submitForm(true)">提交</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import PositionPicker from '@/components/PositionPicker'
// import DepartmentPicker from '@/components/DepartmentPicker'
import UserPicker from '@/components/UserPicker'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import vuet from '@/vuet'
import moment from 'moment'
const userColumnJson = {
  employeeName: '',
  employeeId: '',
  effect: '',
  transferType: '',
  before: {
    type: '调动前',
    companyId: '',
    supvLvlId: '',
    companyName: '',
    departmentId: '',
    departmentName: '',
    displayName: '',
    jobId: '',
    jobName: ''
  },
  after: {
    type: '调动后',
    companyId: '',
    companyName: '',
    departmentId: '',
    departmentName: '',
    displayName: '',
    jobId: '',
    jobName: ''
  }
}
const userColumnJsonStr = JSON.stringify(userColumnJson)
export default {
  data() {
    return {
      showPositionPicker: false,
      showUserPicker: false,
      userMultiple: false,
      isWorker: false, // 只查询岗位工
      isLoading: false,
      loadingText: '',
      userObj: {},
      tableList: [JSON.parse(userColumnJsonStr)],
      distributeDepts: [],
      distributeDeptBeforeIds: [], // 调动前部门id集合
      distributeDeptAfterIds: [], // 调动后部门id集合
      distributeDeptNames: [], // 调动后需通知的部门名称
      distributeDeptIds: [], // 调动后需通知的部门ID
      finalDistributeType: '',
      currentSelectIndex: -1,
      overdraftPositions: [], // 定编超额人员及岗位
      singleUser: null, // 表格选人单选暂存对象
      form: {
        title: ''
      },
      quotasOPts: [
        '管培生岗位学习',
        '有员工离职，提前调入熟悉工作',
        '有员工借调其它岗位，需临时补充人员',
        '岗位之间人员互调',
        '有员工请长假，需临时补充人员'
      ],
      requireRule: [
        {
          validate: val => !!val,
          message: ' '
        }
      ]
    }
  },
  watch: {
    distributeDepts(val) {
      let beforeIds = [],
        afterIds = []
      val.forEach(item => {
        beforeIds.indexOf(item.beforeDeptId) === -1 && beforeIds.push(item.beforeDeptId)
        afterIds.indexOf(item.afterDeptId) === -1 && afterIds.push(item.afterDeptId)
      })
      this.distributeDeptBeforeIds = beforeIds
      this.distributeDeptAfterIds = afterIds
      this.$nextTick(() => {
        this.getDistribution()
      })
    }
  },
  async mounted() {
    if (vuet.modules.home._LOGINUSER_.userid) {
      this.userObj = vuet.modules.home._LOGINUSER_
    }
    this.findPendingApply()
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: '员工调动发起'
    })
  },
  methods: {
    // 检查调动信息完整性
    validateRow(obj) {
      let flag = true
      if (!obj.employeeName) {
        this.$dAlert('请填写完当前记录行中的姓名栏位！')
        flag = false
      } else if (!obj.before.jobName) {
        this.$dAlert('请填写完当前记录行中的调整前岗位栏位！')
        flag = false
      } else if (!obj.after.jobName) {
        this.$dAlert('请填写完当前记录行中的调整后岗位栏位！')
        flag = false
      } else if (!obj.effect) {
        this.$dAlert('请填写完当前记录行中的生效时间栏位！')
        flag = false
      }
      return flag
    },
    // 增加调动信息行数
    addRow() {
      let currentObj = this.tableList[this.tableList.length - 1]
      // 当前数据有为填完项时不允许新增
      if (currentObj && !this.validateRow(currentObj)) {
        return false
      }
      this.tableList.push(JSON.parse(userColumnJsonStr))
    },
    delRow(index) {
      dConfirm('确定删除该行数据吗？', () => {
        this.overdraftPositions = this.overdraftPositions.filter(
          op => op.employeeId !== this.tableList[index].employeeId
        )
        this.tableList = this.tableList.filter((it, i) => i !== index)
        this.getTransType() // 重新计算调动类型
      })
    },
    // 点击选择人员，记下当前点击索引以便后面设置当前点击行的值
    userPermissionPickerHandle(isWorker, isMultiple, index) {
      this.currentSelectIndex = index
      this.userMultiple = isMultiple
      this.isWorker = isWorker
      if (!isMultiple) {
        // 当前单选时，为表格里面选择员工功能，需记下当前点击对象，用于再次打开选择器回显
        if (this.tableList[this.currentSelectIndex].employeeId) {
          this.singleUser = {
            id: this.tableList[this.currentSelectIndex].employeeName,
            name: this.tableList[this.currentSelectIndex].employeeId
          }
        }
      }
      this.showUserPicker = true
    },
    // 记下当前点击索引以便后面设置当前点击行的值
    positionPickerHandle(item, index) {
      if (item.employeeName) {
        this.showPositionPicker = true
        this.currentSelectIndex = index
        return false
      }
      this.$dAlert('请先选择调动人员再选择职位')
    },
    // 选择器返回结果回调函数
    userPermissionResultHandle(result) {
      this.isWorker = false // 关闭后重置参数
      const { departments, users } = result
      if (users.length === 0) {
        return false
      }
      if (this.userMultiple) {
        // 如果是多选在本界面则为发布范围选择
      } else {
        this.singleUser = null // 每次选完之后把此对象清空
        // 否则为表格选择人员操作
        let user = users[0] // 获取返回结果

        let findResult = this.tableList.find(it => it.employeeId === user.id)
        if (findResult) {
          this.$dAlert('同一个员工岗位只能调动一次')
          return false
        }

        let deptPositionNames = departments.map(item => item.descShort)
        deptPositionNames.push(user.position)

        this.tableList[this.currentSelectIndex].employeeName = user.name
        this.tableList[this.currentSelectIndex].employeeId = user.id

        this.tableList[this.currentSelectIndex].before.jobName = user.position
        this.tableList[this.currentSelectIndex].before.jobId = user.positionCode
        this.tableList[this.currentSelectIndex].before.supvLvlId = user.supvLvlId
        this.tableList[this.currentSelectIndex].before.companyName = departments[0].descShort
        this.tableList[this.currentSelectIndex].before.companyId = departments[0].deptId
        this.tableList[this.currentSelectIndex].before.departmentId = departments[departments.length - 1].deptId
        this.tableList[this.currentSelectIndex].before.departmentName = departments[departments.length - 1].desc
        this.tableList[this.currentSelectIndex].before.displayName = deptPositionNames.join('-')

        let userColumnObj = JSON.parse(userColumnJsonStr)
        this.tableList[this.currentSelectIndex].after = userColumnObj.after // 重置after值

        this.overdraftPositions = this.overdraftPositions.filter(op => op.employeeId === user.id)
      }
    },
    // 关闭选择器
    closePicker() {
      this.showPositionPicker = false
      this.showUserPicker = false
    },
    // 选择器返回结果回调函数
    getPositionName({ departments, position, name }) {
      const workerPositionCode = '0014,0016,0017,0036'
      if (departments.length === 0) return
      if (!position.code) return
      if (this.tableList[this.currentSelectIndex].after) {
        this.tableList[this.currentSelectIndex].after.jobName = position.name
        this.tableList[this.currentSelectIndex].after.jobId = position.code
        this.tableList[this.currentSelectIndex].after.companyName = departments[0].descShort
        this.tableList[this.currentSelectIndex].after.companyId = departments[0].deptId
        this.tableList[this.currentSelectIndex].after.departmentId = departments[departments.length - 1].deptId
        this.tableList[this.currentSelectIndex].after.departmentName = departments[departments.length - 1].desc
        this.tableList[this.currentSelectIndex].after.displayName = name
        if (!workerPositionCode.includes(this.tableList[this.currentSelectIndex].before.supvLvlId)) {
          let afterDept = this.tableList[this.currentSelectIndex].after.departmentName
          let beforeDept = this.tableList[this.currentSelectIndex].before.departmentName
          afterDept = afterDept.split('-')
          beforeDept = beforeDept.split('-')
          if (afterDept.length > 2) {
            afterDept = afterDept.slice(0, 2)
          }
          if (beforeDept.length > 2) {
            beforeDept = beforeDept.slice(0, 2)
          }
          if (afterDept.toString() !== beforeDept.toString()) {
            this.$dAlert('管理人员只能在本部门内调动')
            this.tableList[this.currentSelectIndex].after = {
              type: '调动后',
              companyId: '',
              companyName: '',
              departmentId: '',
              departmentName: '',
              displayName: '',
              jobId: '',
              jobName: ''
            }
            return false
          }
        }
        this.getTransType()
        this.getPositionQuotas(position) // 查询职位定编定额 是否超员
      }
    },
    // 超编信息保存
    getPositionQuotas({ code = '', name = '' }) {
      request
        .get(API.DINGTALK_POSTMOVE_QUOTAS + code)
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || {}
            if (data.fdId && data.level - data.allpost <= 0) {
              let idx = this.overdraftPositions.findIndex(
                op => op.employeeId === this.tableList[this.currentSelectIndex].employeeId
              )
              let _obj = {
                employeeId: this.tableList[this.currentSelectIndex].employeeId,
                employeeName: this.tableList[this.currentSelectIndex].employeeName,
                positionName: name, // 这个字段没用到，调整后的职位名称
                effect: '', // 到期时间
                reason: '', // 超编原因
                level: data.level, // 定编人数
                allpost: data.allpost // 现有人数
              }
              if (idx === -1) {
                this.overdraftPositions.push(_obj)
              } else {
                this.overdraftPositions[idx] = _obj
              }
            }
          } else {
            this.$dAlert(res.data.msg)
          }
        })
        .catch(err => (this.isLoading = false))
    },
    // 日期选择
    /**
     * validMonths是超编时用到的，超编到期时间，现在最长时间为当前时间后的6个月
     */
    datePicker(item, validMonths) {
      const that = this
      let now = new Date()
      let nowStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd',
        value: item.effect || nowStr, // 默认显示
        onSuccess: function(result) {
          if (validMonths && moment(result.value).isBefore(moment(new Date()))) {
            that.$dAlert('预计超编到期日期与当前日期至少要相差一天')
            return false
          }
          if (validMonths) {
            let _date = moment()
              .add(validMonths, 'M')
              .format('YYYY-MM-DD')
            if (!moment(result.value).isBefore(moment(_date))) {
              that.$dAlert('预计超编到期日期和录入日期之间相差不能超过6个月')
              return false
            }
          }
          item.effect = result.value
        },
        onFail: function(err) {}
      })
    },
    // 查询发布范围
    getDistribution() {
      if (this.distributeDeptAfterIds.length === 0) {
        this.distributeDeptNames = []
        this.distributeDeptIds = []
        return false
      }
      request
        .get(
          `${API.DINGTALK_POSTMOVE_WORKER_DISTRIBUTION}/${this.distributeDeptBeforeIds.join(
            ','
          )}/${this.distributeDeptAfterIds.join(',')}`
        )
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || {}
            this.distributeDeptNames = data.names
            this.distributeDeptIds = data.ids
          }
        })
        .catch(err => (this.isLoading = false))
    },
    // 计算调动类型
    getTransType() {
      let deptArr = []
      let computeTransferType = (before, idx) => {
        let endResult = ''
        switch (idx) {
          case 0:
            endResult = '跨公司调动'
            break
          case 1:
            endResult = '跨部门（厂）调动'
            break
          case 2:
            if (before.indexOf('车间') !== -1) {
              endResult = '本厂不同车间调动'
            } else {
              endResult = '部门内部调动'
            }
            break
          case 3:
            endResult = '车间内调动'
            break
          default:
            endResult = '车间内调动'
        }
        return endResult
      }
      // 当前存在的调动类型
      let diffTypeArr = []
      for (let j = 0; j < this.tableList.length; j++) {
        const it = this.tableList[j]

        // 所选人员调整前部门数组
        let beforeDept = it.before.displayName.split('-')
        if (beforeDept.length > 0) {
          beforeDept.slice(beforeDept.length - 1, 1)
        }

        // 所选人员调整后部门数组
        let afterDept = it.after.displayName.split('-')
        if (afterDept.length > 0) {
          afterDept.slice(afterDept.length - 1, 1)
        }

        let result = ''
        for (let i = 0; i < beforeDept.length; i++) {
          const bf = beforeDept[i]
          // 对比调整前后部门职位，得到不同的部门名称
          if (bf !== afterDept[i] && !result) {
            // 找到不同之后返回不再继续查找
            result = computeTransferType(bf, i)
            it.transferType = result
            diffTypeArr.push(result)
            deptArr.push({
              transferType: result,
              afterDeptId: it.after.departmentId,
              after: afterDept[i],
              before: beforeDept[i],
              beforeDeptId: it.before.departmentId
            })
          }
        }
      }
      this.distributeDepts = deptArr
      // let transferDeptName = {}
      let transferType = '' // 当前存在的做高级别调动类型
      if (diffTypeArr.indexOf('跨公司调动') !== -1) {
        transferType = '跨公司调动'
        // transferDeptName = deptArr[diffTypeArr.indexOf('跨公司调动')]
      } else if (diffTypeArr.indexOf('跨部门（厂）调动') !== -1) {
        transferType = '跨部门（厂）调动'
        // transferDeptName = deptArr[diffTypeArr.indexOf('跨部门（厂）调动')]
      } else if (diffTypeArr.indexOf('部门内部调动') !== -1) {
        transferType = '部门内部调动'
        // transferDeptName = deptArr[diffTypeArr.indexOf('部门内部调动')]
      } else if (diffTypeArr.indexOf('本厂不同车间调动') !== -1) {
        transferType = '本厂不同车间调动'
        // transferDeptName = deptArr[diffTypeArr.indexOf('本厂不同车间调动')]
      } else {
        transferType = '车间内调动'
        // transferDeptName = deptArr[diffTypeArr.indexOf('车间内调动')]
      }
      this.finalDistributeType = transferType
      // return {
      //   transferType,
      //   transferDeptName
      // }
    },
    // 检查超编信息是否填写完整
    checkQuotasInfo() {
      let flag = true
      this.overdraftPositions.forEach(item => {
        let result = this.tableList.find(emp => {
          return emp.employeeId === item.employeeId
        })
        if (result) {
          result.overReason = item.reason
          result.overDueDate = item.effect
        }
        if (!item.reason || !item.effect) {
          flag = false
        }
      })
      return flag
    },
    submitForm(isSubmit) {
      this.getTransType() // 重新计算调动类型
      if (!this.form.title) {
        this.$dAlert('请输入标题')
        return false
      }
      if (!this.checkQuotasInfo()) {
        this.$dAlert('临时超编理由或预计超编到期日期不能为空')
        return false
      }
      // 判断列表内容是否填写完整
      let currentObj = this.tableList[this.tableList.length - 1]
      if (!this.validateRow(currentObj)) {
        return false
      }
      if (!this.finalDistributeType) {
        this.$dAlert('调动类别为空！')
        return false
      }
      let api = API[isSubmit ? 'DINGTALK_POSTMOVE_APPLY' : 'DINGTALK_POSTMOVE_SAVE']
      let params = {
        transferType: this.finalDistributeType,
        title: this.form.title,
        department: {
          ids: this.distributeDeptIds.join(','), // 按部门分发的id列表，逗号分割
          names: this.distributeDeptNames.join(',') // 部门的名称列表也是逗号分割
        },
        list: this.tableList
      }
      this.isLoading = true
      this.loadingText = '数据提交中'
      request
        .post(api, params)
        .then(res => {
          let errCode = res.data.errorCode
          this.isLoading = false
          this.$dAlert(res.data.msg, () => {
            if (errCode) {
              this.$router.back()
            }
          })
        })
        .catch(err => (this.isLoading = false))
    },
    // 初始化页面查询上次暂存数据
    findPendingApply() {
      this.isLoading = true
      this.loadingText = '数据加载中'
      request
        .get(API.DINGTALK_POSTMOVE_PENDING)
        .then(res => {
          this.isLoading = false
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || {}
            if (data.fdId) {
              this.initTableData(data)
            }
          } else {
            this.$dAlert(res.data.msg)
          }
        })
        .catch(err => (this.isLoading = false))
    },
    initTableData(data) {
      // department: {
      //   ids: this.distributeDeptIds.join(','), // 按部门分发的id列表，逗号分割
      //   names: this.distributeDeptNames.join(',') // 部门的名称列表也是逗号分割
      // },
      // 部门权限回显
      this.distributeDeptNames = (data.department.names || '').split(',')
      this.distributeDeptIds = (data.department.ids || '').split(',')
      // data.department = data.department || {}
      // data.department.ids = data.department.ids || ''
      // data.department.names = data.department.names || ''
      // let deptIds = data.department.ids.split(',')
      // let deptNames = data.department.names.split(',')
      // this.departPermission = deptIds.map((item, index) => {
      //   return {
      //     descShort: deptNames[index],
      //     fdId: item
      //   }
      // })
      // 表单主体回显
      this.form = {
        fdId: data.fdId,
        title: data.title
      }
      // 表格列表数据回显
      let tableList = []
      data.list = data.list || []
      data.list.forEach(item => {
        item.before.type = '调动前'
        item.after.type = '调动后'
        tableList.push(item)
      })
      this.tableList = tableList
      this.overdraftPositions = []
      // 查询出来的超编信息重新写入页面
      this.tableList.forEach(it => {
        if (it.overReason) {
          this.overdraftPositions.push({
            employeeId: it.employeeId,
            employeeName: it.employeeName,
            effect: it.overDueDate,
            reason: it.overReason
          })
        }
      })
    }
  },
  components: {
    Footbar,
    PositionPicker,
    UserPicker
  }
}
</script>

<style>
input.van-field__control {
  font-size: 13px;
}
.van-cell__title {
  font-size: 14px;
}
</style>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 200px;
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
      padding: 5px;
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
</style>
