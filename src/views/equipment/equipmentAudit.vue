<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>设备名称</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.deviceName }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>要求审核<br/>完成时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label>{{ form.needTime }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>异常情况</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.exceptionItem" rows="2" autosize type="textarea" style="padding:0;"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>审核结果</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                 <label @click="auditSelect">{{ form.auditResult || '请选择审核结果' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <div v-if="form.auditResult==='立即维修'" style="line-height: 30px" class="sub-head">
          <span>立即维修申请</span>
        </div>
        <div v-if="form.auditResult==='立即维修'" class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>维修项目</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.maintainItem" style="padding: 0" placeholder="请输入维修项目" />
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>计划维修<br/>开始时间</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div @click="selectDate">
                 <label>{{ form.planStartTime || '请选择时间' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>计划工时</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.planHour" style="padding:0;" placeholder="请输入计划工时"/>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <footbar>
        <van-row>
          <van-col span="24">
            <van-button type="primary" style="height: 40px; width: 100%" @click="submitData">审核完成提交</van-button>
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
import { API } from '@/api'
export default {
  data() {
    return {
      applicatorNo: '',
      userName: '',
      isLoading: false,
      data:[],
      formData:[],
      form: {
        itemName: '',
        needTime: '',
        exceptionNote: '',
        auditResult: '',
        maintainItem: '',
        planStartTime: '',
        auditSelect: '',
      },
      auditOption:['非设备隐患','保全工自行处理','立即维修','单机停机维修','车间生产停机维修','大修时维修']
    }
  },
  components: { Footbar },
  methods: {
    selectDate() {
      let that = this
      dd.biz.util.datetimepicker({
          format: 'yyyy-MM-dd HH:mm',//注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
          // value: '', //默认显示日期
          onSuccess : function(result) {
            that.form.planStartTime = result.value+':'+'00'
            that.$forceUpdate()
          },
          onFail: function(err) {}
      })
    },
    auditSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择审核结果', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.auditOption,
        onSuccess: function (result) {
          that.form.auditResult = that.auditOption[result.buttonIndex]
          that.$forceUpdate()
          // onSuccess将在点击button之后回调
          /* {
            buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1
        } */
        },
        onFail: function (err) { }
      })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否确认提交'
      })
        .then(() => {
          let params = this.form
          request
            .post(`${API.submitExceptionDeviceInfo}?dingUsername=${this.userName}`, params)
            .then(res => {
              if (res.data.success) {
                this.$dAlert('提交成功！')
                this.$router.go(-1)
              } else {
                this.$dAlert(JSON.stringify('提交失败！' + res.data.msg))
              }
            })
            .catch(err => (this.isLoading = false))
        }).catch(() => {
          this.$dAlert('已取消')
        })
    },
    init() { // 废弃
      let params = {
        id: this.$route.query.id || ''
      }
      request
        .get(API.queryExceptionAduitOne, { params }) // 查询登录人信息
        .then(res => {
          if (res.data.success) {
            this.form = res.data.data || {}
          } else {
            this.$dAlert(res.data.msg)
          }
        }).catch(err => {
          this.$dAlert(res.data.msg)
        })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.applicatorNo = vuet.modules.home._LOGINUSER_.jobnumber || ''
    DingTalkApi.biz.navigation.setTitle({
      title: '设备异常审核'
    })
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
