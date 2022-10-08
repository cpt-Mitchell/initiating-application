<template>
  <div :class="{ 'box-loading': isLoading }">
    <!-- <div class="sub-head">
      <van-row style="height:1rem;line-height:1rem">
        <van-col align="left" span="12">
          <span>隐患记录</span>
        </van-col>
        <van-col align="right" span="12"> </van-col>
      </van-row>
    </div>-->
    <div class="card">
      <div class="card-header">
        <van-row>
          <van-col span="24">
            <span style="font-size: 15px; color: #1db5e6">隐患记录</span>
          </van-col>
        </van-row>
      </div>
      <div class="card-part">
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>公司</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label @click="companySelect">{{ form.companyName }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>部门/车间</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label @click="deptSelect">{{ form.deptName }}</label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>具体位置</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label><van-field v-model="form.place" style="padding: 0" placeholder="请输入位置" /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>内容</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label
                ><van-field v-model="form.content" autosize type="textarea" style="padding: 0" placeholder="请输入内容"
              /></label>
            </div>
          </van-col>
        </van-row>
        <van-row class="info-row">
          <van-col span="8" class="label-header">
            <span>发现日期</span>
          </van-col>
          <van-col span="16" class="label-content">
            <div>
              <label
                ><van-field
                  @click="dateSelect"
                  disabled
                  v-model="form.discoverDate"
                  style="padding: 0"
                  placeholder="请点击选择日期"
              /></label>
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
      form: {
        companyName: '',
        discoverDate: '',
        deptName: '',
        place: '',
        content: ''
      },
      user: {
        empName: '',
        deptName: '',
        jobName: ''
      },
      departmentList: [],
      departmentLists: [],
      fileList: [], // 上传组件v-modal
      file: {
        fileId: '',
        fileName: '',
        filePath: ''
      },
      userName: '',
      isLoading: false,
      option: ['赣州纸业', '赣州纸品', '崇左纸业']
    }
  },
  components: { Footbar },

  methods: {
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
    companySelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择公司', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function (result) {
          that.form.companyName = that.option[result.buttonIndex]
          that.queryDept()
        },
        onFail: function (err) { }
      })
    },
    queryDept() {
      let that = this
      let params = {
        companyId: this.form.companyName === '赣州纸业' ? '16000' : this.form.companyName === '赣州纸品' ? '19000' : '22747'
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
        onSuccess: function (result) {
          // alert(JSON.stringify(result))
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
    deptSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择部门', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.departmentList,
        onSuccess: function (result) {
          that.form.deptName = that.departmentList[result.buttonIndex]
        },
        onFail: function (err) { }
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交【安全隐患】记录表'
      })
        .then(() => {
          let params = {
            companyName: this.form.companyName,
            companyId: this.form.companyName === '赣州纸业' ? '16000' : this.form.companyName === '赣州纸品' ? '19000' : '22747',
            deptName: this.form.deptName,
            place: this.form.place,
            content: this.form.content,
            discoverDate: this.form.discoverDate,
            discover: this.user.empName,
            discoverDept: this.user.deptName,
            discoverJobName: this.user.jobName,
            safeType: '环保隐患'
          }
          if (this.file.fileId) {
            params.fileId = this.file.fileId
            params.fileName = this.file.fileName
            params.filePath = this.file.filePath
            params.pictureUrl = this.file.filePath
          }
          this.departmentLists.forEach(item => {
            if (item.deptName = this.form.deptName) {
              params.deptId = item.deptId
              params.factory = item.factory
              params.workshop = item.workshop
            }
          })
          alert(JSON.stringify(params))
          request
            .get(API.saveSafeDangerByPhone, { params })
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
            // alert(JSON.stringify(res.data.data))
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
      title: '【环保隐患】记录表'
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
