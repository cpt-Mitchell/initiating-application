<template>
  <div :class="{ 'box-loading': isLoading }">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <div class="card">
      <div class="sub-head" style="margin-bottom: 10px">
        <span>隐患记录</span>
      </div>
      <div class="card-part">
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>公司</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="companySelect">
              <label :style="{ color: form.companyName ? '' : '#666' }">{{ form.companyName || '请选择公司' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>部门/车间</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="deptSelect">
              <label :style="{ color: form.deptName ? '' : '#666' }">{{ form.deptName || '请选择部门/车间' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>隐患类别</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div @click="safeTypeSelect">
              <label :style="{ color: form.safeType ? '' : '#666' }">{{ form.safeType || '请选择隐患类别' }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>具体位置</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label><van-field v-model="form.place" style="padding: 0" placeholder="请输入位置"/></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>内容</span>
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
                  placeholder="请输入内容"
              /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="last-row">
          <van-col span="8" class="label-header">
            <span>发现日期</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>
                <van-field
                  @click="dateSelect"
                  disabled
                  v-model="form.discoverDate"
                  style="padding: 0"
                  placeholder="请点击选择日期"
                />
              </label>
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
            <div class="last-row" style="margin: 6px 0 0 0">
              <van-uploader
                v-model="fileLists"
                :after-read="afterRead"
                :before-read="beforeRead"
                :before-delete="beforeDelete"
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
    </div>
    <div class="card">
      <div class="sub-head" style="margin-bottom: 10px">
        <span>发现人</span>
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
        <van-row class="last-row">
          <van-col span="8" class="label-header">
            <span>岗位</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label>{{ user.jobName }}</label>
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
</template>
<script>
import { mapModules } from 'vuet'
import Footbar from '@/components/Footbar'
// import { Dialog } from 'vant'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
// import vuet from '@/vuet'
import { API } from '@/api'
import Compressor from 'compressorjs'
export default {
  mixins: [
    mapModules({
      home: 'recordDetail'
    })
  ],
  name: 'add-result',
  data() {
    return {
      isLoading: false,
      form: {
        companyName: '',
        discoverDate: '',
        deptName: '',
        place: '',
        content: '',
        safeType: ''
      },
      user: {
        empName: '',
        deptName: '',
        jobName: ''
      },
      departmentList: [],
      departmentLists: [],
      fileLists: [], // 上传组件v-modal
      file: {
        fdId: '',
        fileName: '',
        filePath: ''
      },
      userName: '',
      option: ['赣州纸业', '赣州纸品', '崇左纸业'],
      safeTypeList: ['安全隐患', '环保隐患']
    }
  },
  components: { Footbar },
  watch: {
    fileLists (val) {
      console.log(val)
      let fileList = val
      const formData = new FormData()
      let count = 0
      for (let index = 0; index < fileList.length; index++) {
        const item = fileList[index]
        // eslint-disable-next-line no-new
        new Compressor(item.file, {
          quality: 0.1,
          success: result => {
            // The third parameter is required for server
            formData.append('files', result, result.name)
            count++
            if (count === fileList.length) {
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
                    console.log(this.isDelete)
                    this.isDelete === true ? this.$dAlert('删除成功') : this.$dAlert('上传成功')
                    this.isDelete = false
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
    }
  },
  methods: {
    afterRead(fileList) {
      if (fileList instanceof Array) {
      } else {
        fileList = [fileList]
      }
    },
    beforeDelete(file, detail) {
      if (this.fileLists.length >= 2) this.isDelete = true
      if (this.fileLists.length) {
        this.fileLists = this.fileLists.filter((item, i) => i !== detail.index)
      } else {
        this.file = {
          fdId: '',
          fileName: '',
          filePath: ''
        }
      }
      return true
    },
    beforeRead(files) {
      return true
    },

    companySelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择公司', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function(result) {
          that.form.companyName = that.option[result.buttonIndex]
          that.queryDept()
        },
        onFail: function(err) {}
      })
    },
    safeTypeSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择隐患类别', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.safeTypeList,
        onSuccess: function(result) {
          that.form.safeType = that.safeTypeList[result.buttonIndex]
        },
        onFail: function(err) {}
      })
    },
    queryDept() {
      let that = this
      let params = {
        companyId:
          this.form.companyName === '赣州纸业' ? '16000' : this.form.companyName === '赣州纸品' ? '19000' : '22747'
      }
      request
        .get(API.findDeptLIstByCompanyId, { params })
        .then(res => {
          if (res.data) {
            let resdata = res.data.data || []
            this.departmentLists = resdata
            let arr = []
            resdata.forEach(item => {
              arr.push(item.deptName)
            })
            that.departmentList = arr || []
          }
        })
        .catch(err => (that.isLoading = false))
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
        otherButtons: this.departmentList,
        onSuccess: function(result) {
          that.form.deptName = that.departmentList[result.buttonIndex]
        },
        onFail: function(err) {}
      })
    },
    submitData() {
      this.$dConfirm('是否提交【安全/环保隐患】记录表', () => {
        let params = {
          companyName: this.form.companyName,
          companyId:
            this.form.companyName === '赣州纸业' ? '16000' : this.form.companyName === '赣州纸品' ? '19000' : '22747',
          deptName: this.form.deptName,
          place: this.form.place,
          content: this.form.content,
          discoverDate: this.form.discoverDate,
          discover: this.user.empName,
          discoverDept: this.user.deptName,
          discoverJobName: this.user.jobName,
          safeType: this.form.safeType
        }
        let paramsD = {}
        if (this.file.fdId) {
          paramsD.fdId = this.file.fdId
          paramsD.fileName = this.file.fileName
          paramsD.filePath = this.file.filePath
        }
        this.departmentLists.forEach(item => {
          if (item.deptName === this.form.deptName) {
            params.deptId = item.deptId || ''
            params.factory = item.factory || ''
            params.workshop = item.workshop || ''
          }
        })
        let obj = {}
        obj.companyId = params.companyId
        obj.companyName = params.companyName
        obj.deptId = params.deptId
        obj.deptName = params.deptName
        obj.factory = params.factory
        obj.workshop = params.workshop
        obj.safeType = params.safeType
        obj.place = params.place
        obj.content = params.content
        obj.discoverDate = params.discoverDate
        obj.discover = params.discover
        obj.discoverDept = params.discoverDept
        obj.discoverJobName = params.discoverJobName
        // this.$dAlert(JSON.stringify(paramsD))
        request
          .post(`${API.saveSafeDangerByPhone}?fileName=${paramsD.fileName}&filePath=${paramsD.filePath}`, obj)
          .then(res => {
            if (res.data.success) {
              this.$dAlert('提交成功！')
              this.$router.push({ name: '安环检查' })
              // this.form = res.data.data || {}
            } else {
              this.$dAlert(JSON.stringify('提交失败！' + res.data.msg))
            }
          })
          .catch(err => (this.isLoading = false))
      })
    },
    init() {
      let params = {
        companyId: '16000',
        dangerType: '安全隐患',
        // season: '3',
        fdYear: '2020'
      }
      request
        .get(API.findListBy, { params })
        .then(res => {
          if (res.data) {
            // this.$dAlert(JSON.stringify(res.data.data))
            this.form = res.data.data || {}
          }
        })
        .catch(err => (this.isLoading = false))
    }
  },
  mounted() {
    // this.init()
    DingTalkApi.ui.webViewBounce.disable()
    DingTalkApi.biz.navigation.setTitle({
      title: '【安全/环保隐患】记录表'
    })
    request
      .get(API.empData)
      .then(res => {
        if (res.data) {
          // this.$dAlert(JSON.stringify(res.data.data))
          let resdata = res.data.data || []
          this.user = resdata
        }
      })
      .catch(err => (this.isLoading = false))
  }
}
</script>
<style scoped>
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
