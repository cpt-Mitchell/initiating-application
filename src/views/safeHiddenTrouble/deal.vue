<template>
  <div :class="{ 'box-loading': isLoading }">
    <div class="card">
      <div class="card-part">
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违规人</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <!-- <input style="border:none;height:100%" v-model="name"></input> -->
              <van-field @input="openDialog" v-model="V_user.empName" placeholder="点击选择人员" />
              <van-popup v-model="showPicker" position="bottom">
                <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
              </van-popup>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>部门</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ V_user.deptName }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>岗位</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ V_user.jobName }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违规程度</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label @click="againsSelect">{{ form.againstLevel }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违规事实描述</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label
                ><van-field
                  v-model="form.content"
                  rows="3"
                  autosize
                  type="textarea"
                  style="padding: 0"
                  placeholder="请输入违规事实"
              /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>扣工资条款</span>
          </van-col>
          <van-col span="16" class="label-content" style="text-align: right">
            <van-button type="primary" style="vertical-align: middle; width: 130px" @click="showVi = true"
              >选择不按职级扣工资条款</van-button
            >
            <van-popup v-model="showVi" position="bottom">
              <van-picker show-toolbar :columns="ViList" @confirm="ViDeter" @cancel="showVi = false" />
            </van-popup>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>扣工资金额(元)</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label><van-field v-model="form.amount" style="padding: 0" placeholder="请输入扣款金额" /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违反的文件名称</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label
                ><van-field
                  v-model="form.againstFile"
                  autosize
                  type="textarea"
                  style="padding: 0"
                  placeholder="请输入违反的文件名称"
              /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>违反的文件条款及内容</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <van-field
                v-model="form.againstContent"
                autosize
                type="textarea"
                style="padding: 0"
                placeholder="请输入违规事实"
              />
            </div>
          </van-col>
        </van-row>
      </div>
      <template>
        <div class="sub-head">
          <span>附件上传</span>
        </div>
        <div class="card">
          <div class="card-part">
            <div class="info-row" style="margin: 6px 0 4px 0">
              <van-uploader
                v-model="fileList"
                :after-read="afterRead"
                :before-read="beforeRead"
                :before-delete="beforeDelete"
                :max-count="1"
                multiple
              >
                <template #preview-cover="{ file }">
                  <div class="preview-cover van-ellipsis">{{ file.name }}</div>
                </template></van-uploader
              >
            </div>
          </div>
        </div>
      </template>
      <div class="sub-head">
        <span>发现人</span>
      </div>
    </div>
    <div class="card-part">
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>姓名</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ user.empName }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>部门</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ user.deptName }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>岗位</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ user.jobName }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>发现日期</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <van-field
              @click="dateSelect"
              disabled
              v-model="form.discoverDate"
              style="padding: 0"
              placeholder="请点击选择日期"
            />
          </div>
        </van-col>
      </van-row>
    </div>

    <footbar>
      <van-row>
        <van-col span="24">
          <van-button type="primary" style="height: 40px; width: 100%" @click="submitData">提交</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>
<script>
import { mapModules } from 'vuet'
import Footbar from '@/components/Footbar'
import { Dialog } from 'vant'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import vuet from '@/vuet'
import { API } from '@/api'
export default {
  mixins: [
    mapModules({
      home: 'recordDetail'
    })
  ],
  name: 'add-result',
  data() {
    return {
      columns: [],
      showPicker: false,
      showVi: false,
      violationsList: [], // 违规条款信息
      ViList: [], // 违规选择
      form: {
        company: '',
        discoverDate: '',
        againstLevel: '',
        content: '',
        againstContent: '',
        amount: '',
        againstFile: ''
      },
      V_user: {
        empName: '',
        deptName: '',
        jobName: ''
      },
      user: {
        empName: '',
        deptName: '',
        jobName: ''
      },
      fileList: [], // 上传组件v-modal
      file: {
        fileId: '',
        fileName: '',
        filePath: ''
      },
      companyObject: {},
      userName: '',
      isLoading: false,
      option: ['赣州纸业', '赣州纸品', '崇左纸业'],
      againsList: ['轻微', '一般', '严重']
    }
  },
  components: { Footbar },

  methods: {
    onConfirm(value) {
      let that = this
      let params = {
        name: value
      }
      request
        .get(API.userData, { params })
        .then(res => {
          if (res.data) {
            let resdata = res.data.data || {}
            this.V_user = resdata
            this.queryDeptId(resdata.companyCode)
          }
        })
        .catch(err => (that.isLoading = false))
      this.showPicker = false
    },
    queryDeptId(value) {
      let that = this
      let params = {
        code: value
      }
      request
        .get(API.history, { params })
        .then(res => {
          if (res.data) {
            let resdata = res.data.data || {}
            this.companyObject = resdata[0]
          }
        })
        .catch(err => (that.isLoading = false))
      this.showPicker = false
    },
    ViDeter(val) {
      let arr = this.violationsList.filter(f => {
        return f.wjContent == val
      })
      if (arr.length) {
        this.form.amount = arr[0].kMoney
        this.form.againstFile = arr[0].fileName
        this.form.againstContent = arr[0].wjContent
      }
      console.log(this.form)
      this.showVi = false
    },
    openDialog(val) {
      if (val.length >= 2) {
        let that = this
        let params = {
          name: val
        }
        request
          .get(API.findName, { params })
          .then(res => {
            if (res.data) {
              let resdata = res.data.data || []
              let arr = []
              resdata.forEach(item => {
                arr.push(item.empName)
              })
              that.columns = arr || []
            }
          })
          .catch(err => (that.isLoading = false))
        this.showPicker = true
      }
    },
    afterRead(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      request
        .post(API.upload, formData, config)
        .then(res => {
          if (res.data.data) {
            this.file = res.data.data || {}
            alert(JSON.stringify(this.file))
          } else {
            alert('上传失败，' + res.data.msg)
          }
        })
        .catch(err => (this.isLoading = false))
      // 此时可以自行将文件上传至服务器
      // this.uploadImage(file instanceof Array ? file : [file])
    },
    beforeDelete(file, detail) {
      // this.uploadFileList = this.uploadFileList.filter((item, i) => i !== detail.index)
      return true
    },
    beforeRead(file) {
      // if (file.type !== 'image/jpeg') {
      //   Toast('请上传 jpg 格式图片')
      //   return false
      // }
      // this.uploadFileList = this.uploadFileList.concat(file)
      return true
    },
    dateSelect() {
      const that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd', // 注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
        value: '', // 默认显示日期
        onSuccess: function (result) {
          alert(JSON.stringify(result))
          that.form.discoverDate = result.value
          // onSuccess将在点击完成之后回调
          /* {
            value: "2015-02-10"
        }
        */
        },
        onFail: function (err) { }
      })
    },
    againsSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择违规程度', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.againsList,
        onSuccess: function (result) {
          that.form.againstLevel = that.againsList[result.buttonIndex]
        },
        onFail: function (err) { }
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交安全违规处理单'
      })
        .then(() => {
          let params = {
            companyId: this.companyObject.companyId,
            deptName: this.V_user.longDeptName,
            factory: this.V_user.deptName,
            deptId: this.V_user.deptId,
            againstLevel: this.form.againstLevel,
            content: this.form.content,
            discoverDate: this.form.discoverDate,
            discover: this.user.empName,
            discoverDept: this.user.deptName,
            discoverJobName: this.user.jobName,
            againstType: '安全违规',
            againstMan: this.V_user.empName,
            jobName: this.V_user.jobName,
            againstFile: this.form.againstFile,
            againstContent: this.form.againstContent,
            amount: this.form.amount
          }
          let params_d = {}
          if (this.file.fileId) {
            params_d.fileId = this.file.fileId
            params_d.fileName = this.file.fileName
            params_d.filePath = this.file.filePath
            params_d.pictureUrl = this.file.filePath
          }
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
          obj_params.againstMan = params.againstMan
          obj_params.jobName = params.jobName
          obj_params.againstFile = params.againstFile
          obj_params.againstContent = params.againstContent
          obj_params.amount = params.amount
          obj_params.detailsList = this.dataList
          alert(JSON.stringify(params))
          request
            .post(`${API.saveSafeAgainstByPhone}?fileId=${params_d.fileId}&fileName=${params_d.fileName}&filePath=${params_d.pictureUrl}&pictureUrl=${params_d.filePath}`, obj_params)
            .then(res => {
              if (res.data.success) {
                alert('提交成功！')
                this.$router.push({ name: '安环检查' })
                // this.form = res.data.data || {}
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
    this.jobName = vuet.modules.home._LOGINUSER_.position || ''
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: '安全违规处理单'
    })
    request
      .get(API.empData)
      .then(res => {
        if (res.data) {
          // alert(JSON.stringify(res.data.data))
          let resdata = res.data.data || []
          this.user = resdata
        }
      })
      .catch(err => { })
    request
      .get(API.findClause)
      .then(res => {
        if (res.data) {
          // alert(JSON.stringify(res.data.data))
          let resdata = res.data.data || []
          let arr = []
          this.violationsList = resdata
          resdata.forEach(item => {
            arr.push(item.wjContent)
          })
          this.ViList = arr
        }
      })
      .catch(err => { })
  }
}
</script>
