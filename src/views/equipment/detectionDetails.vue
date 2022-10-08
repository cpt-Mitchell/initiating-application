<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <van-row class="card card-part info-row">
        <van-col span="8" class="label-header">
          <span>巡检设备：</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{deviceName}}</label>
          </div>
        </van-col>
      </van-row>
      <div class="card" v-for="(item,index) in formData" :key="index">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>巡检项目</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{item.component}}:{{item.checkItem}}</label>
                <!-- <van-field v-model="item.checkItem" style="padding:0;" placeholder="项目名称"/> -->
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>正常标准</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label>{{item.normalStandard}}</label>
              </div>
            </van-col>
          </van-row>
           <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>巡检结果</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
              <van-radio-group v-model="item.checkResult">
               <van-row>
                  <van-col span="12">
                    <van-radio class="checkBox-square" name="正常" shape="square">正常</van-radio>
                  </van-col>
                  <van-col span="12">
                    <van-radio class="checkBox-square" name="异常" shape="square">异常</van-radio>
                  </van-col>
               </van-row>
              </van-radio-group>
              </div>
            </van-col>
          </van-row>
           <van-row v-if="item.checkResult === '异常'" class="info-row">
            <van-col span="8" class="label-header">
              <span>异常情况</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field v-model="item.exceptionNote" rows="2" autosize type="textarea" style="padding:0;" placeholder="请输入异常情况"/>
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
      applicatorNo: '',
      userName: '',
      isLoading: false,
      data:[],
      formData:[],
      deviceName: '',
      form: {
        checkItem: '',
        normalStandard: '',
        checkResult: '',
        exceptionNote: ''
      },
    }
  },
  components: { Footbar },
  methods: {
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否确认提交'
      })
        .then(() => {
          this.formData.forEach(item => {
            if(item.checkResult === '异常'&&!item.exceptionNote){
              return this.$dAlert('请填写异常情况！')
            }
          })
          let params = this.data
          request
            .post(`${API.submitCheckDeviceInfo}?dingUsername=${this.userName}&dingUserId${this.applicatorNo}`, params)
            .then(res => {
              if (res.data.success) {
                this.$dAlert('提交成功！')
                this.$router.go(-1)
              } else {
                this.$dAlert(JSON.stringify('提交失败！' + res.data.msg))
              }
            })
            .catch(err => (this.isLoading = false))
        })
        .catch(() => {
          this.$dAlert('已取消')
        })
    },
    init() { // 废弃
      let params = {
        deviceBirthId: this.$route.query.deviceBirthId || ''
      }
      request
        .get(API.queryCheckDeviceInfo, { params }) // 查询登录人信息
        .then(res => {
          if (res.data.success) {
            this.data = res.data.data || []
            this.deviceName = res.data.data.deviceName || ''
            this.formData = res.data.data.listDetail || []
          }else{
            this.$dAlert(res.data.msg)
          }
        })
        .catch(err => { 
          this.$dAlert(res.data.msg)
        })
    }
  },
  mounted() {
    this.userName = vuet.modules.home._LOGINUSER_.name || ''
    this.applicatorNo = vuet.modules.home._LOGINUSER_.jobnumber || ''
    DingTalkApi.biz.navigation.setTitle({
      title: '设备巡检记录页面'
    })
    this.init()
  }
}
</script>
<style lang="less" scoped>
  .checkBox-square{
    
  }
</style>
