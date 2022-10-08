<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>扫二维码</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>
                  <van-button type="primary" size="mini" @click="handleQrcode">扫码</van-button>
                </label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>楼号</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.dormitoryName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>楼层</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.storeyName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>房号</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.roomNo || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>水/电表</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.meterName || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>上次表数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.lastRead  || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>本次表数</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>
                  <van-field
                    v-model="form.quantity"
                    rows="1"
                    autosize
                    type="textarea"
                    style="padding: 0"
                    placeholder="请输入读表数"
                  />
                </label>
              </div>
            </van-col>
          </van-row>
        </div>
        <template>
          <div class="sub-head" style="margin-bottom: 10px">
            <span>表数照片</span>
          </div>
          <div class="card">
            <div class="card-part">
              <div class="last-row" style="margin: 6px 0 2px 0">
                <van-uploader
                  v-model="fileList"
                  :after-read="afterRead"
                  :before-read="beforeRead"
                  :before-delete="beforeDelete"
                  :max-count="1"
                  multiple
                >
                  <template #preview-cover="{ file }">
                    <!-- <div class="preview-cover van-ellipsis">{{ file.name }}</div> -->
                  </template>
                </van-uploader>
              </div>
            </div>
          </div>
        </template>
        <div class="sub-head" style="margin-bottom: 10px">
          <span>处理人</span>
        </div>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>月份</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label @click="selectDate">{{ yearMonth }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>抄表人</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ creator || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>抄表日期</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ createdTime || '' }}</label>
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
  </div>
</template>
<script>
import Footbar from '@/components/Footbar'
import vuet from '@/vuet'
import { Dialog } from 'vant'
import * as DingTalkApi from 'dingtalk-jsapi'
import request from '@/utils/httpUtil'
import { parseTime } from '@/utils/DateTimeUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      isLoading: false,
      form: {
        dormitoryName: '',
        storeyName: '',
        roomNo: '',
        meterName: '',
        quantity: ''
      },
      yearMonth: '',
      creator: '',
      createdTime: '',
      fileList: [], // 上传组件v-modal
      file: {
        fileId: '',
        fileName: '',
        filePath: ''
      }
    }
  },
  components: { Footbar },
  methods: {
    selectDate() {
      let that = this
      dd.biz.util.datepicker({
        format: 'yyyy-MM', // 注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
        value: '', // 默认显示日期
        onSuccess: function(result) {
          that.yearMonth = result.value
          // onSuccess将在点击完成之后回调
          /* {
            value: "2015-02-10"
        }
        */
        },
        onFail: function(err) {}
      })
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
        .post(API.photoSave, formData, config)
        .then(res => {
          if (res.data) {
            // alert(JSON.stringify(res.data))
            this.file = res.data.data || {}
            alert('上传成功')
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
    handleQrcode() {
      // let params = {
      //   code: 'vTdkZlgL49H8J9XJvDmKhJIoinwx0OgdMw2DoHrYEeE4lNz33nH1ElCY00pzjgMEXcWlD7TpFkD14xS7SxChYA=='
      // }
      // request
      //   .get(API.getQRcodeInfo, { params })
      //   .then(res => {
      //     if (res.data) {
      //       let Obj = res.data.data.roomMsg || {}
      //       this.form = Object.assign(res.data.data, Obj)
      //       this.getPreMonth()
      //     }
      //   })
      //   .catch(err => (this.isLoading = false))
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let params = {
            code: data.text || ''
          }
          request
            .get(API.getQRcodeInfo, { params })
            .then(res => {
              if (res.data) {
                let Obj = res.data.data.roomMsg || {}
                that.form = Object.assign(res.data.data, Obj)
                that.getPreMonth()
              }
            })
            .catch(err => (that.isLoading = false))
        },
        onFail: function(err) {}
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交水电表抄数记录表'
      })
        .then(() => {
          let params = this.form
          params.areaId = vuet.store.dormitory.areaId
          params.creator = this.creator
          params.photoId = this.file.fileId
          params.hasRead = true
          // params.createdTime = this.createdTime
          params.month = this.yearMonth.substring(5, 7)
          params.year = this.yearMonth.substring(0, 4)
          request
            .post(API.readingSave, params)
            .then(res => {
              if (res.data.success) {
                alert('提交成功！')
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
    getPreMonth() {
      let date = parseTime(new Date(), '{y}-{m}-{d}')
      let arr = date.split('-')
      let year = arr[0] // 获取当前日期的年份
      let month = arr[1] // 获取当前日期的月份
      let day = arr[2] // 获取当前日期的日
      let days = new Date(year, month, 0)
      days = days.getDate() // 获取当前日期中月的天数
      let year2 = year
      let month2 = parseInt(month) - 1
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      let t2 = year2 + '-' + month2
      this.yearMonth = t2
    }
  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '水/电/天然气重抄表'
    })
    this.creator = vuet.modules.home._LOGINUSER_.name || ''
    this.createdTime = parseTime(new Date(), '{y}-{m}-{d}')
  }
}
</script>
