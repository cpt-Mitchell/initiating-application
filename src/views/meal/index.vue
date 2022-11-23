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
      <van-row class="van-cell van-field">
        <van-col :span="12" align="left"> 申请人：{{ applyEmployee.userName }} </van-col>
        <van-col :span="12" align="right"> 申请日期：{{ form.applyDate.substring(0, 10) }} </van-col>
      </van-row>
      <van-cell-group>
        <!-- <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title van-field__label">
            <span>抢修部门</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.dept" class="van-field__control">
                <option value selected>请选择抢修部门</option>
                <template v-for="(option, index) in deptOption">
                  <option :key="index" :value="option">
                    {{ option }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </div> -->
        <van-field
          @click="changeDept"
          placeholder="请选择抢修部门"
          type="text"
          readonly
          v-model="form.deptName"
          label="抢修部门"
        />
        <!-- <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title van-field__label">
            <span>抢修工段</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.leaveType" class="van-field__control">
                <option value selected>请选择抢修工段</option>
                <template v-for="(option, index) in leaveTypeOpts">
                  <option :key="index" :value="option">
                    {{ option }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </div> -->
        <van-field
          @click="changePosition"
          placeholder="请选择抢修工段"
          type="text"
          readonly
          v-model="form.postName"
          label="抢修工段"
        />
        <van-field placeholder="请输入" type="text" v-model="form.deviceName" label="抢修设备" />
        <van-field
          style="color: #333"
          v-model="form.fdDate"
          placeholder="点击选择用餐日期"
          label="用餐日期"
          @click.native="beginDatePicker"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title van-field__label">
            <span>用餐餐次</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.mealType" class="van-field__control">
                <option value selected>请选择用餐餐次</option>
                <template v-for="(option, index) in mealTypeOption">
                  <option :key="index" :value="option">
                    {{ option }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <van-row style="padding: 0 15px">
          <van-col :span="4" style="padding: 4px 0;">
            <div class="color-label">
              <div style="font-size: 20px; font-weight: bold; padding-left: 10px">
                内部人员
              </div>
            </div>
          </van-col>
          <van-col :span="12">
            <van-field label-width="50" v-model="form.jxNumber1" type="number" label="江西菜" placeholder="请输入">
              <span slot="extra">份</span>
            </van-field>
            <van-field label-width="50" v-model="form.gxNumber1" type="number" label="广西菜" placeholder="请输入">
              <span slot="extra">份</span>
            </van-field>
          </van-col>
          <van-col :span="8">
            <div
              style="height: 88px; display: flex; flex-direction: column; align-items: center; justify-content: space-around;"
            >
              <div style="width: 100%">
                <van-button v-if="!text1" size="mini" type="info" @click="changePerson1">
                  选择抢修人员
                </van-button>
                <van-notice-bar
                  style="height: 30px"
                  color="#1989fa"
                  background="#ecf9ff"
                  @click="changePerson1"
                  v-else
                  scrollable
                  :text="text1"
                />
              </div>
              <div style="width: 100%">
                <van-button v-if="!text2" size="mini" type="info" @click="changePerson2">
                  选择抢修人员
                </van-button>
                <van-notice-bar
                  style="height: 30px"
                  color="#1989fa"
                  background="#ecf9ff"
                  @click="changePerson2"
                  v-else
                  scrollable
                  :text="text2"
                />
              </div>
            </div>
          </van-col>
        </van-row>
        <van-row style="padding: 0 15px">
          <van-col :span="4">
            <div class="color-label2">
              <div style="font-size: 20px; font-weight: bold; padding-left: 10px">
                外部人员
              </div>
            </div>
          </van-col>
          <van-col :span="20">
            <van-field label-width="50" v-model="form.jxNumber2" type="number" label="江西菜" placeholder="请输入">
              <span slot="extra">份</span>
            </van-field>
            <van-field label-width="50" v-model="form.gxNumber2" type="number" label="广西菜" placeholder="请输入">
              <span slot="extra">份</span>
            </van-field>
          </van-col>
        </van-row>
        <van-field
          v-model="form.dinnerPlace"
          type="textarea"
          label="送餐地点"
          placeholder="请填写送餐地点"
          rows="1"
          autosize
        />
        <van-field v-model="form.remark" type="textarea" label="备注" placeholder="请填写备注" rows="1" autosize />
      </van-cell-group>
      <!-- 选择部门 -->
      <department-picker
        :deptKeyWord="'厂'"
        :companyCode="'004,008'"
        :selected="applyDept.id ? [applyDept] : []"
        :display="deptPickerDisplay"
        @close="closeDeptPicker"
        @result="getDeptResultHandle"
      ></department-picker>
      <!-- 选择工段 -->
      <section-picker
        :deptCode="deptId"
        :selected="applyPosition.code ? [applyPosition] : []"
        :display="positionPickerDisplay"
        @close="closePositionPicker"
        @result="getPositionResultHandle"
      ></section-picker>
      <user-picker
        :multiple="true"
        :deptKeyWord="'厂'"
        :companyCode="'004,008'"
        :selected="applyUser1"
        :display="userPickerDisplay1"
        @close="closePicker1"
        @result="getUserResultHandle1"
      ></user-picker>
      <user-picker
        :multiple="true"
        :deptKeyWord="'厂'"
        :companyCode="'004,008'"
        :selected="applyUser2"
        :display="userPickerDisplay2"
        @close="closePicker2"
        @result="getUserResultHandle2"
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
import DepartmentPicker from '@/components/DepartmentPicker'
import SectionPicker from '@/components/SectionPicker'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/request'
import rest from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/DateTimeUtil'
import DevMockUser from '@/components/DevMockUser'
import { Toast } from 'vant'

export default {
  name: 'apply',
  data() {
    return {
      deptOption: [],
      mealTypeOption: [],
      isLoading: false,
      userPickerDisplay1: false,
      userPickerDisplay2: false,
      deptPickerDisplay: false,
      positionPickerDisplay: false,
      loadingText: '',
      applyEmployee: {},
      applyUser1: [],
      applyUser2: [],
      applyDept: {},
      applyPosition: {},
      deptId: '',
      isUploading: false,
      text1: '',
      text2: '',
      form: {
        applyDate: '',
        applyicant: '',
        mealType: '',
        deptName: '',
        deptId: '',
        postName: '',
        gx: [],
        jx: [],
        gxNumber: '',
        jxNumber: '',
        gxNumber1: '',
        jxNumber1: '',
        gxNumber2: '',
        jxNumber2: '',
        remark: '',
        deviceName: '',
        dinnerPlace: '',
        fdDate: ''
      }
    }
  },
  mounted() {
    let today = new Date()
    this.form.applyDate = parseTime(today)
    this.$nextTick(() => {
      this.applyInit()
    })
    this.getDept()
    this.getMealTypeOption()
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: '生产抢修用餐申请'
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
    // 'form.beginDate'(val) {
    //   if (val && this.form.endDate) {  
    //     this.getLeaveDays(val, this.form.endDate)
    //   }
    // },
    // 'form.endDate'(val) {
    //   if (val && this.form.beginDate) {
    //     this.getLeaveDays(this.form.beginDate, val)
    //   }
    // }
  },
  methods: {
    changeDept() {
      this.deptPickerDisplay = true
    },
    changePosition() {
      if (this.form.deptName && this.form.deptId) {
        this.deptId = this.form.deptId
        this.positionPickerDisplay = true
      } else {
        dAlert('请先选择抢修部门')
      }
    },
    // 获取抢修部门
    getDept() {
      request.get(`${API.getDept}`).then(res => {
        if (res.data.success) {
          this.deptOption = res.data.data || []
        } else {
          dAlert(res.data.msg)
        }
      })
    },
    // 获取用餐餐次
    getMealTypeOption() {
      request.get(`${API.getMealTypeOption}`).then(res => {
        if (res.data.success) {
          this.mealTypeOption = res.data.data || []
        } else {
          dAlert(res.data.msg)
        }
      })
    },
    closePicker1() {
      this.userPickerDisplay1 = false
    },
    closePicker2() {
      this.userPickerDisplay2 = false
    },
    closeDeptPicker() {
      this.deptPickerDisplay = false
    },
    closePositionPicker() {
      this.positionPickerDisplay = false
    },
    // 获取工段
    getPositionResultHandle(result) {
      let chooseArr = result.departments.length !== 0 ? result.departments[0] : {}
      this.form.postName = chooseArr.name
      this.form.postId = chooseArr.code
      // let position = result.departments.length !== 0 ? result.departments[0] : {}
      // this.applyPosition = Object.assign({}, position)
      // this.form.position = this.applyPosition.descShort
    },
    getDeptResultHandle(result) {
      let dept = result.departments.length !== 0 ? result.departments[0] : {}
      this.applyDept = Object.assign({}, dept)
      console.log(this.applyDept)
      if (this.applyDept.descShort.indexOf('厂') !== -1) {
        this.form.deptName = this.applyDept.descShort
        this.form.deptId = this.applyDept.deptId
      } else {
        dAlert('您选择的不是部门，请重新选择部门')
      }
    },
    getUserResultHandle1(result) {
      this.form.jx = []
      this.applyUser1 = result.users || []
      console.log(this.applyUser1)
      this.text1 = ''
      let textArr = []
      if (this.applyUser1.length > 0) {
        this.applyUser1.forEach(item => {
          let arr = {}
          textArr.push(item.name)
          arr.userName = item.name
          arr.userCode = item.id
          this.form.jx.push(arr)
        })
      }
      this.text1 = textArr.join(',')
    },
    getUserResultHandle2(result) {
      this.form.gx = []
      this.applyUser2 = result.users || []
      console.log(this.applyUser2)
      this.text2 = ''
      let textArr = []
      if (this.applyUser2.length > 0) {
        this.applyUser2.forEach(item => {
          let arr = {}
          textArr.push(item.name)
          arr.userName = item.name
          arr.userCode = item.id
          this.form.gx.push(arr)
        })
      }
      this.text2 = textArr.join(',')
    },
    changePerson1() {
      this.userPickerDisplay1 = true
    },
    changePerson2() {
      this.userPickerDisplay2 = true
    },
    beginDatePicker() {
      let now = new Date()
      let nowStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd',
        value: this.form.fdDate || nowStr,
        onSuccess: result => {
          this.form.fdDate = result.value || ''
        },
        onFail: function(err) {}
      })
    },
    applyInit() {
      this.isLoading = true
      this.loadingText = '数据加载中...'
      rest
        .get(API.DINGTALK_APPLICATION_LEAVE_FORM)
        .then(res => {
          this.isLoading = false
          let data = res.data.data || {}
          this.applyEmployee = data.info || {}
          this.form.applyicant = data.info.userName || ''
        })
        .catch(err => {
          this.isLoading = false
          dAlert('数据加载异常:' + (err.message || err.data.msg))
        })
    },
    submit() {
      this.form.gxNumber = Number(this.form.gxNumber1 || 0) + Number(this.form.gxNumber2 || 0)
      this.form.jxNumber = Number(this.form.jxNumber1 || 0) + Number(this.form.jxNumber2 || 0)
      console.log(this.form)
      if (!this.form.gxNumber && !this.form.jxNumber) {
        dAlert('请录入用餐份数')
      } else if (
        !this.form.mealType ||
        !this.form.deptName ||
        !this.form.postName ||
        !this.form.dinnerPlace ||
        !this.form.fdDate ||
        !this.form.deviceName ||
        !this.form.postId
      ) {
        dAlert('请检查是否录入完整再进行提交')
      } else {
        this.$dConfirm('确认提交当前数据吗？', () => {
          this.doSubmit()
        })
      }
    },
    doSubmit() {
      let that = this
      this.loadingText = '数据提交中...'
      this.isLoading = true
      request
        .post(`${API.postMealApply}`, this.form)
        .then(res => {
          this.isLoading = false
          if (res.data.success) {
            dAlert(res.data.msg, () => {
              that.$router.back()
            })
          } else {
            dAlert(res.data.msg)
          }
        })
        .catch(errr => (this.isLoading = false))
    }
  },
  components: {
    Footbar,
    UserPicker,
    DevMockUser,
    DepartmentPicker,
    SectionPicker
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
.color-label {
  height: 80px;
  color: #fbac11;
  display: flex;
  align-items: center;
  background-color: rgba(255, 246, 299, 1);
  border-radius: 10px;
}
.color-label2 {
  height: 80px;
  color: #fd6624;
  display: flex;
  align-items: center;
  background-color: rgba(255, 243, 238, 1);
  border-radius: 10px;
}
</style>
