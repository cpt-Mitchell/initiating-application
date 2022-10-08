<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-header">
          <van-row>
            <van-col span="24">
              <span style="font-size:15px;color:#1db5e6">审核信息</span>
            </van-col>
          </van-row>
        </div>
        <div class="card-part">
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
              <span>项目</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.item" style="padding:0;" placeholder="请输入项目"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请理由</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="form.reason" row="3" autosize type="textarea" style="padding:0;" placeholder="请输入原因"/>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请人</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.creator || '' }}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请日期</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.createdTime || '' }}</label>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="sub-head" style="margin-bottom: 10px">
          <span>后勤管理员审核信息</span>
        </div>
      </div>
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>申请事宜<br>核实情况</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.checkinResult || '' }}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>费用承担</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.costAssumeMode || '' }}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>承担人</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.costUnderTaker || '' }}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>领用数量</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.constsumingQty || '' }}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>物资单价</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{ form.unitPrice || '' }}</label>
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
import { API } from '@/api'
export default {
  data() {
    return {
      isLoading: false,
      form: {
        dormitoryName: '',
        storeyName: '',
        roomNo: '',
        reason: '',
        creator: '',
        createdTime: '',
        checkinResult: '',
        costAssumeMode: '',
        costUnderTaker: '',
        constsumingQty: '',
        unitPrice: '',
        item: ''
      },
      phoneNumber: '',
      option: ['是', '否']
    }
  },
  components: { Footbar },
  methods: {
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交调整宿舍表'
      })
        .then(() => {
          let params = this.form
          request
            .post(API.materialConsumingApproval, params)
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
    init() {
      let params = {
        id: '1336109388658143234'
      }
      request
        .get(API.materialConsumingGet, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.form = res.data.data || {}
            this.form = Object.assign(this.form, this.form.checkInMsg)
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.phoneNumber = vuet.modules.home._LOGINUSER_.mobile || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
