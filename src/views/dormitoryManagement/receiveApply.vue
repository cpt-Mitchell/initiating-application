<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
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
              <span>类别</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <label
                  :style="{ color: form.consumingType === '请选择' ? '#2196f3' : '#c8c9cc' }"
                  @click="consumingTypeSelect"
                >{{form.consumingType=='1'?'更换维修':'物资领用'}}</label>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row">
            <van-col span="8" class="label-header">
              <span>项目</span>
            </van-col>
            <van-col span="10" class="label-content">
              <div>
                <van-field v-model="form.item" :disabled="form.consumingType=='0'&&form.areaId=='1331049951992442881'?true:false" style="padding:0;" placeholder="请输入项目"/>
              </div>
            </van-col>
            <van-col span="6" class="label-content">
              <div>
                <van-button v-if="form.consumingType=='1'" type="primary" size="mini" @click="handleSelectItem">选择物资</van-button>
                <van-button v-if="form.consumingType=='0'" type="primary" size="mini" @click="handleQrcode">扫码</van-button>
              </div>
            </van-col>
          </van-row>
          <van-row class="info-row" v-if="form.consumingType=='0'">
            <van-col span="8" class="label-header">
              <span>领用数量</span>
            </van-col>
            <van-col span="16" class="label-content">
              <div>
                <van-field name="stepper" style="padding:0;">
                  <template #input>
                    <van-stepper v-model="form.consumingQty" />
                  </template>
                </van-field>
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
                <label>{{ form.empName || '' }}</label>
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
        consumingType: '',
        item: '',
        reason: '',
        empName: '',
        createdTime: '',
        consumingQty: 1
      },
      dingUserid: '',
      option: ['物资领用', '更换维修'],
      itemList: [],
      lists: [],
      materialId: ''
    }
  },
  components: { Footbar },
  methods: {
    handleQrcode() {
      let that = this
      dd.biz.util.scan({
        type: 'qrCode', // type 为 all、qrCode、barCode，默认是all。
        onSuccess: function(data) {
          let params = {
            code: data.text || ''
          }
          request
            .get(API.getMaterialByCode, { params })
            .then(res => {
              if (res.data) {
                that.form.item = res.data.data.materialName || ''
                that.form.unitPrice = res.data.data.unitPrice || 0
                that.$forceUpdate()
              }
            })
            .catch(err => (that.isLoading = false))
        },
        onFail: function(err) {}
      })
    },
    consumingTypeSelect() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择类别', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.option,
        onSuccess: function (result) {
          that.form.consumingType = result.buttonIndex
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    handleSelectDate() {
      let that = this
      dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm',
        // value: '2015-04-17 08:00', // 默认显示
        onSuccess: function (result) {
          that.date = result.value
          // onSuccess将在点击完成之后回调
          /* {
            value: "2015-06-10 09:50"
        }
        */
        },
        onFail: function (err) { }
      })
    },
    handleSelectItem() {
      let that = this
      dd.device.notification.actionSheet({
        title: '请选择项目', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.itemList,
        onSuccess: function (result) {
          // that.form.roomUse = that.roomUserList[result.buttonIndex]
          that.form.item = that.lists[result.buttonIndex].materialName
          that.form.unitPrice = that.lists[result.buttonIndex].unitPrice
          that.$forceUpdate()
        },
        onFail: function (err) { }
      })
    },
    selectItemList() {
      let params = {
        dingUserid: this.dingUserid
      }
      request
        .get(API.effective, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.lists = res.data.data || []
            this.lists.forEach(item => {
              this.itemList.push(item.materialName)
            })
          }
        })
        .catch(err => { })
    },
    submitData() {
      Dialog.confirm({
        title: '提交',
        message: '是否提交宿舍物资申领表'
      })
        .then(() => {
          let params = this.form
          params.creator = vuet.modules.home._LOGINUSER_.name || ''
          params.areaCode = vuet.store.dormitory.areaId || ''
          request
            .post(API.materialConsumingSave, params)
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
      if (this.materialId) {
        let params = {
          materialId: this.materialId
        }
        request
          .get(API.applicationRoomMaterialConsuming, { params }) // 查询登录人信息
          .then(res => {
            if (res.data) {
              this.form = res.data.data || {}
              this.form = Object.assign(this.form, this.form.checkInMsg)
            } else {
              dAlert(res.data.msg)
            }
          })
          .catch(err => {
            dAlert(err.msg)
          })
      } else {
        let params = {
          areaId: vuet.store.dormitory.areaId,
          phoneNumber: this.phoneNumber
        }
        request
          .get(API.dormitoryFind, { params }) // 查询登录人信息
          .then(res => {
            if (res.data) {
              this.form = res.data.data || {}
              this.form = Object.assign(this.form, this.form.checkInMsg)
              this.form.consumingType = '1'
            } else {
              dAlert(res.data.msg)
            }
          })
          .catch(err => {
            dAlert(err.msg)
          })
      }
    }

  },
  mounted() {
    DingTalkApi.biz.navigation.setTitle({
      title: '宿舍物资领用/维修申请'
    })
    this.phoneNumber = vuet.modules.home._LOGINUSER_.mobile || ''
    this.dingUserid = vuet.modules.home._LOGINUSER_.jobnumber || ''
    // this.form.empName = vuet.modules.home._LOGINUSER_.name || ''
    this.selectItemList()
    let url = window.location.href
    let xx = url.split('materialId=') || []
    this.materialId = xx[1] || ''
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
