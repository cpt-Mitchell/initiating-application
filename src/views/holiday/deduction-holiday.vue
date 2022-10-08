<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
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
              <span>抵扣开始时间</span> 
            </van-col>
            <van-col span="16" class="label-content">
             <div>
                <label
                  v-if="form.startDate === ''"
                  @click="handleSelectDate('startDate')"
                  :style="{ color: form.startDate === '' ? '#c0c4cc' : '#c8c9cc' }"
                >请选择日期</label>
                <label v-else @click="handleSelectDate('startDate')">{{ form.startDate || '请选择日期' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>抵扣结束时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  v-if="form.endDate === ''"
                  @click="handleSelectDate('endDate')"
                  :style="{ color: form.endDate === '' ? '#c0c4cc' : '#c8c9cc' }"
                >请选择日期</label>
                <label v-else @click="handleSelectDate('endDate')">{{ form.endDate || '请选择日期' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请抵扣天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.daysDedution" style="padding:0 15px;" placeholder="请输入申请抵扣天数"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请理由</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.reason" row="3" autosize type="textarea" style="padding:0 15px;" placeholder="请输入原因"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>年度</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.annualYear || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>标准天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysAllowed || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>原可休天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysApproval || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>剩余可休天数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.daysRemaining || 0 }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <template>
          <div class="sub-head" style="margin-bottom: 10px">
            <span>上传附件</span>
          </div>
          <div class="card">
            <div class="card-part">
              <div class="last-row" style="margin: 6px 0 2px 0">
              <!-- :max-size="800 * 1024" -->
                <van-uploader
                  @oversize="onOversize"
                  v-model="fileList"
                  :after-read="afterRead"
                  :before-read="beforeRead"
                  :before-delete="beforeDelete"
                  :max-count="1"
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
import vuet from '@/vuet'
import { Dialog } from 'vant'
import * as DingTalkApi from 'dingtalk-jsapi'
import { parseTime } from '@/utils/DateTimeUtil'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      applicatorNo: '',
      userName: '',
      isLoading: false,
      form: {
        employeeName: '',
        dept: '',
        job: '',
        jobLevel: '',
        startDate: '',
        endDate: '',
        daysDedution: '',
        reason: ''
      },
      // fileList: [{url: 'https://img01.yzcdn.cn/vant/leaf.jpg',file:new File([],'哇啊',{})}],
      fileList: [],
      fileListPost: [],
      file: {
        fileId: '',
        filename: '',
        filePath: ''
      },
      fileMessage: {}
    }
  },
  components: { Footbar },
  methods: {
    onOversize(file) {
      alert('文件大小不能超过 800kb')
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
        .post(API.filesSave, formData, config)
        .then(res => {
          if (res.data) {
            this.fileMessage = res.data.data || {}
            let parma = {
              url: this.fileMessage.path,
              name: this.fileMessage.url
            }
            this.fileListPost.push(parma)
          } else {
            alert('上传失败，请重新上传！')
          }
        })
        .catch(err => (this.isLoading = false))
      // 此时可以自行将文件上传至服务器
      // this.uploadImage(file instanceof Array ? file : [file])
    },
    beforeRead(file) {
      // if (file.type !== 'image/jpeg') {
      //   Toast('请上传 jpg 格式图片')
      //   return false
      // }
      // this.uploadFileList = this.uploadFileList.concat(file)
      return true
    },
    beforeDelete(file, detail) {
      // this.uploadFileList = this.uploadFileList.filter((item, i) => i !== detail.index)
      return true
    },
    getDaysBetween(date1,date2){
      let  startDate = Date.parse(date1);
      let  endDate = Date.parse(date2);
      if (startDate > endDate){
        return 0
      }
      if (startDate == endDate){
        return 1
      }
      let days = (endDate - startDate) / (1*24*60*60*1000)
      this.form.daysDedution = days
      this.form.daysRemaining = this.form.daysApproval - days
    },
    handleSelectDate(val) {
      let that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd',
        value: that.form[val] || '', // 默认显示
        onSuccess: function (result) {
          that.form[val] = result.value
          if(that.form.startDate && that.form.endDate) {
            that.getDaysBetween(that.form.startDate,that.form.endDate)
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
        message: '是否提交申请表'
      })
        .then(() => {
          let params = this.form
          params.fileList = this.fileListPost
          params.daysIsolation = this.form.daysAllowed
          request
            .post(API.deductionSave, params)
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
    init() {
      let params = {
        year: parseTime(new Date(), '{y}'),
        empId: this.empId
        // empId: 'A203331'
      }
      request
        .get(API.deductionGet, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
            this.fileList = this.form.fileList || []
            this.fileList.forEach(item => {
              // item.url = 'https://img01.yzcdn.cn/vant/leaf.jpg'
              item.file = new File([],item.name,{})
            })
            if(this.form.startDate && this.form.endDate){
              this.getDaysBetween(this.form.startDate,this.form.endDate)
            }
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '个人年休假抵扣申请'
    })
    this.empId = vuet.modules.home._LOGINUSER_.userid || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
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
