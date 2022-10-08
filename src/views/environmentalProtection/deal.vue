<template>
  <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
    <div class="card">
      <div class="card-part">
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>部门/车间</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="deptSelect">
              <label :style="{ color: form.department ? '' : '#666' }">{{
                form.department || '请选择部门/车间'
              }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违规事实描述</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>
                <van-field
                  v-model="form.content"
                  rows="1"
                  autosize
                  type="textarea"
                  style="padding: 0"
                  placeholder="请输入违规事实"
                />
              </label>
            </div>
          </van-col>
        </van-row>
        <van-row class="last-row">
          <van-col span="8" class="label-header">
            <span>违规程度</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="againsSelect">
              <label :style="{ color: form.againstLevel ? '' : '#666' }">{{
                form.againstLevel || '请选择违规程度'
              }}</label>
            </div>
          </van-col>
        </van-row>
      </div>
      <template>
        <div class="sub-head" style="margin-bottom: 10px">
          <span>附件上传</span>
        </div>
        <div class="card">
          <div class="card-part">
            <div class="last-row" style="margin: 6px 0 2px 0">
              <van-uploader
                v-model="fileList"
                :after-read="afterRead"
                :before-read="beforeRead"
                :before-delete="beforeDelete"
                capture="camera"
                multiple
              >
                <template #preview-cover="{ file }">
                  <div class="preview-cover van-ellipsis">{{ file.name }}</div>
                </template>
              </van-uploader>
            </div>
          </div>
        </div>
      </template>
      <div class="sub-head" style="margin-bottom: 10px">
        <span>发现人</span>
      </div>
    </div>
    <div class="card">
      <div class="card-part">
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>姓名</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ user.empName || '-' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>部门</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ user.deptName || '-' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>岗位</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ user.jobName || '-' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="last-row">
          <van-col span="8" class="label-header">
            <span>发现日期</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="dateSelect">
              <label :style="{ color: form.discoverDate ? '' : '#666' }">
                {{ form.discoverDate || '请点击选择日期' }}
              </label>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="sub-head" style="margin-bottom: 15px">
      <span>责任追究明细</span>
      <button
        style="
          float: right;
          color: #fff;
          background-color: #07c160;
          border: 1px solid #07c160;
          padding: 5px 15px;
          font-size: 14px;
          border-radius: 2px;
        "
        id="add"
        type="primary"
        size="small"
        @click="dutydialog"
      >
        增加
      </button>
    </div>
    <div class="card card-part">
      <table class="m-table">
        <tr class="tabel-header">
          <th colspan="4">值班明细</th>
        </tr>
        <tr class="tabel-header tabel-header-white">
          <th style="width: 22%" class="right-border">姓名</th>
          <th style="width: 30%" class="right-border">岗位</th>
          <th style="width: 28%" class="right-border">扣工资(元)</th>
          <th style="width: 20%">操作</th>
        </tr>
        <tbody>
          <tr v-for="(item, index) in dataList" :key="index">
            <td class="right-border top-border-solid">{{ item.empName }}</td>
            <td class="right-border top-border-solid" style="text-align: left">{{ item.jobName }}</td>
            <td class="right-border top-border-solid">
              <div>
                <van-field v-model="item.amount" autosize type="text" style="padding: 0 3px" placeholder="请输入金额" />
              </div>
            </td>
            <td class="top-border-solid" @click="deleteOne(index)" style="color: red">删除</td>
          </tr>
        </tbody>
      </table>
    </div>
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button type="primary" style="height: 40px; width: 100%" @click="submitData">提交</van-button>
        </van-col>
      </van-row>
    </footbar>
    <duty-picker
      searchBelongCompany
      :currentCompany="myCompany"
      :deptId="deptId"
      :multiple="true"
      :selected="selected"
      :display="dutyPickerDisplay"
      @close="closePicker"
      @result="getUserResultHandle"
    ></duty-picker>
  </div>
</template>
<script>
import DutyPicker from '@/components/DutyPicker'
import Footbar from '@/components/Footbar'
import { Dialog } from 'vant'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import vuet from '@/vuet'
import { API } from '@/api'
import Compressor from 'compressorjs'
export default {
  data() {
    return {
      value: '',
      showPicker: false,
      dutyPickerDisplay: false,
      myCompany: '',
      applyUser: {},
      form: {
        department: '',
        discoverDate: '',
        againstLevel: '',
        content: '',
        againstContent: '',
        amount: '',
        againstFile: ''
      },
      dataList: [],
      deptNameList: [],
      selectList: [], // 明细列表
      deptId: '16021',
      companyObject: {},
      fileList: [], // 上传组件v-modal
      file: {
        fileId: '',
        fileName: '',
        filePath: ''
      },
      user: {
        empName: '',
        deptName: '',
        jobName: ''
      },
      selected: [],
      userName: '',
      isLoading: false,
      option: [],
      againsList: ['轻微', '一般', '严重']
    }
  },
  components: { Footbar, DutyPicker },

  methods: {
    afterRead(fileList) {
      if (fileList instanceof Array) {
      } else {
        fileList = [fileList]
      }
      const formData = new FormData()
      let count = 0
      for (let index = 0; index < fileList.length; index++) {
        const item = fileList[index]
        new Compressor(item.file, {
          quality: 0.6,
          success: result => {
            // The third parameter is required for server
            formData.append('files', result, result.name)
            count++
            if (count == fileList.length) {
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
              request
                .post(API.mutipleUpload, formData, config)
                .then(res => {
                  if (res.data.success) {
                    this.file = res.data.data || {}
                    this.$dAlert('上传成功')
                  } else {
                    this.$dAlert('上传失败，请重新上传！')
                  }
                })
                .catch(err => (this.isLoading = false))
            }
          },
          error(err) {
            console.log(err.message)
          }
        })
      }
    },
    beforeDelete(file, detail) {
      this.fileList.splice(detail.index, 1)
      if (this.fileList.length) this.afterRead()
      // this.uploadFileList = this.uploadFileList.filter((item, i) => i !== detail.index)
      return true
    },
    beforeRead(file) {
      return true
    },
    dutydialog() {
      this.dutyPickerDisplay = true
    },
    closePicker() {
      this.dutyPickerDisplay = false
    },
    deleteOne(index) {
      this.dataList.splice(index, 1)
    },
    getUserResultHandle(val) {
      this.selected = val
      this.dataList = val
    },
    dateSelect() {
      const that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd', // 注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
        value: '', // 默认显示日期
        onSuccess: function(result) {
          // this.$dAlert(JSON.stringify(result))
          that.form.discoverDate = result.value
          // onSuccess将在点击完成之后回调
          /* {
            value: "2015-02-10"
        }
        */
        },
        onFail: function(err) {}
      })
    },
    deptSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择部门', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function(result) {
          that.form.department = that.option[result.buttonIndex]
          that.queryDetail(that.form.department)
        },
        onFail: function(err) {}
      })
    },
    queryDetail(val) {
      let arr = this.deptNameList.filter(f => {
        return f.deptName === val
      })
      if (arr.length) this.deptId = arr[0].deptId
      // this.$dAlert(JSON.stringify(this.deptId))
    },
    againsSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择违规程度', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.againsList,
        onSuccess: function(result) {
          that.form.againstLevel = that.againsList[result.buttonIndex]
        },
        onFail: function(err) {}
      })
    },
    queryCompanyId(code) {
      let params = {
        code: code
      }
      request
        .get(API.history, { params }) // 查询个人信息
        .then(res => {
          if (res.data) {
            // this.$dAlert(JSON.stringify(res.data.data))
            let resdata = res.data.data || []
            if (resdata.length) {
              this.companyObject = resdata[0]
              this.queryCompany(resdata[0].companyId)
            }
          }
        })
        .catch(err => {})
    },
    queryCompany(code) {
      let params = {
        companyId: code
      }
      request
        .get(API.findDeptLIstByCompanyId, { params }) // 查询部门
        .then(res => {
          if (res.data) {
            // this.$dAlert(JSON.stringify(res.data.data))
            let resdata = res.data.data || []
            let arr = []
            this.deptNameList = resdata
            resdata.forEach(item => {
              arr.push(item.deptName)
            })
            this.option = arr
          }
        })
        .catch(err => {})
    },
    money() {
      this.dataList.forEach(item => {
        if (item.amount) {
          return true
        } else {
          return false
        }
      })
    },
    submitData() {
      const that = this
      let isTrue = null
      isTrue = that.dataList.some(item => {
        if (!item.amount) {
          return true
        }
      })
      if (isTrue) {
        this.$dAlert('请输入扣款')
        return false
      }
      that.$dConfirm('是否提交环保违规处理单', () => {
        let arr = []
        that.dataList.forEach(item => {
          let str = ''
          str = item.empId + '|' + item.amount
          arr.push(str)
        })
        let string = arr.toString()
        let obj = that.deptNameList.filter(f => {
          return f.deptName === that.form.department
        })
        let params = {
          companyId: that.companyObject.companyId,
          againstLevel: that.form.againstLevel,
          content: that.form.content,
          discoverDate: that.form.discoverDate,
          discover: that.user.empName,
          discoverDept: that.user.deptName,
          discoverJobName: that.user.jobName,
          againstType: '环保违规',
          dutyListStr: string
          // againstFile: that.form.againstFile,
          // againstContent: that.form.againstContent,
          // amount: that.form.amount
        }
        if (obj.length) {
          params.deptName = obj[0].deptName
          params.factory = obj[0].deptName
          params.deptId = obj[0].deptId
        }
        let params_d = {}
        if (that.file.fdId) {
          params_d.fdId = that.file.fdId
          params_d.fileName = that.file.fileName
          params_d.filePath = that.file.filePath
        }
        that.dataList.forEach(item => {
          item.userId = item.empId
          item.userName = item.empName
        })
        let obj_params = {}
        obj_params.companyId = params.companyId
        obj_params.againstType = params.againstType
        obj_params.againstLevel = params.againstLevel
        obj_params.content = params.content
        obj_params.deptId = params.deptId
        obj_params.deptName = params.deptName
        obj_params.factory = params.factory
        obj_params.discoverDate = params.discoverDate
        obj_params.discover = params.discover
        obj_params.discoverDept = params.discoverDept
        obj_params.discoverJobName = params.discoverJobName
        obj_params.detailsList = that.dataList
        // that.$dAlert(JSON.stringify(obj_params))
        request
          .post(`${API.saveSafeAgainstByPhone}?fileName=${params_d.fileName}&filePath=${params_d.filePath}`, obj_params)
          .then(res => {
            if (res.data.success) {
              that.$dAlert('提交成功！')
              that.$router.push({ name: '安环检查' })
            } else {
              that.$dAlert(JSON.stringify('提交失败！' + res.data.msg))
            }
          })
          .catch(err => (that.isLoading = false))
      })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.jobName = vuet.modules.home._LOGINUSER_.position || ''
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: '环保违规处理单'
    })
    request
      .get(API.empData) // 查询登录人信息
      .then(res => {
        if (res.data) {
          // this.$dAlert(JSON.stringify(res.data.data))
          let resdata = res.data.data || []
          this.user = resdata
          this.queryCompanyId(resdata.companyCode)
        }
      })
      .catch(err => {})
  }
}
</script>
<style scoped>
.tabel-header-white {
  background-color: #ffffff;
  color: #2196f3;
}
td {
  padding: 5px;
}
</style>
