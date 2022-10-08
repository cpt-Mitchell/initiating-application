<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card-part">
          <van-row class="info-row">
            <van-col span="4" class="label-header">
              <span>姓名</span>
            </van-col>
            <van-col span="20" class="label-content" style="text-align:center">
              <div>
                <span>休假安排计划</span>
              </div>
            </van-col>
          </van-row>
          <!-- <van-row class="info-row">
            <van-col span="4" class="label-header">
              <span>王淑云</span>
            </van-col>
            <van-col span="20" class="label-content">
              <div class="tags-content">
                <van-tag type="primary">
                  <span>调整后休假计划<br>7月11日-8月2日</span>
                </van-tag>
              </div>
            </van-col>
          </van-row> -->
          <van-row v-for="(item,index) in personalList" :key="index" class="info-row">
            <van-col span="4" class="label-header">
              <span>{{item.employeeName}}</span>
            </van-col>
            <van-col span="20" class="label-content">
              <div :class="item.align + ' tags-content'">
                <van-tag :color="item.color">
                  <span style="text-align:center">{{item.result}}<br>{{item.startDate | formatterDate}} - {{item.endDate | formatterDate}}</span>
                </van-tag>
              </div>
            </van-col>
          </van-row>
          <van-row>
            <van-row class="explain-title">说明:</van-row>
            <div class="explain">
              <span class="explain-index">1、</span>
              <span class="explain-color warning"></span>
              <span class="explain-text">：15天年休假</span>
            </div>
            <div class="explain">
              <span class="explain-index">2、</span>
              <span class="explain-color default"></span>
              <span class="explain-text">：10天年休假</span>
            </div>
            <div class="explain">
              <span class="explain-index">3、</span>
              <span class="explain-color yellow"></span>
              <span class="explain-text">：5天年休假</span>
            </div>
            <div class="explain">
              <span class="explain-index">4、</span>
              <span class="explain-color danger"></span>
              <span class="explain-text">：非标准天数年休假</span>
            </div>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
        areaIdCompany: '',
        areaId: '',
        empName: '',
      },
      empId: '',
      personalList: ''
    }
  },
  components: { },
  filters: {
    formatterDate(val) {
      return parseTime(new Date(val), '{m}月{d}日')
    }
  },
  methods: {
    computedTagPlace(item,index) {
      let year = new Date().getFullYear
      if (item.areaCode === 'gz') {
        if (new Date(item.startDate) < new Date(`${year}-07-20`)) {
          this.personalList[index].align = 'left'
        } else if(new Date(item.startDate) > new Date(`${year}-08-10`)) {
          this.personalList[index].align = 'right'
        } else {
          this.personalList[index].align = 'center'
        }
      } else if (item.areaCode === 'zl') {
        if (new Date(item.startDate) < new Date(`${year}-01-19`)) {
          this.personalList[index].align = 'left'
        } else if(new Date(item.startDate) > new Date(`${year}-02-09`)) {
          this.personalList[index].align = 'right'
        } else {
          this.personalList[index].align = 'center'
        }
      } else {
        if (new Date(item.startDate) < new Date(`${year}-08-10`)) {
          this.personalList[index].align = 'left'
        } else if(new Date(item.startDate) > new Date(`${year}-08-20`)) {
          this.personalList[index].align = 'right'
        } else {
          this.personalList[index].align = 'center'
        }
      }
    },
    init() {
      let params = {
        year: parseTime(new Date(), '{y}'),
        // empId: this.empId
        empId: 'A203331'
      }
      request
        .get(API.unableList, { params }) // 查询登录人信息
        .then(res => {
          if (res.data) {
            this.personalList = res.data.data || []
            this.personalList.forEach((item,index) => {
              this.computedTagPlace(item,index)
              if (item.daysApproval === '5') {
                item.color = '#ffff00'
              } else if (item.daysApproval === '10') {
                item.color = '#0087ff'
              } else if (item.daysApproval === '15') {
                item.color = '#ff915f'
              } else {
                item.color = '#ff0008'
              }
            })
            console.log(this.personalList)
          }
        })
        .catch(err => { })
    }
  },
  mounted() {
    this.empId = vuet.modules.home._LOGINUSER_.userid || ''
    DingTalkApi.biz.navigation.setTitle({
      title: '不能同休人员休假计划'
    })
    this.init()
  }
}
</script>
<style lang="less" scoped>
.tags-content{
  padding-left:5px;
}
.left {
  text-align: left;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
.explain-title {
  width:100%;
  font-size:20px;
}
.explain {
  padding: 5px 10px;
  width:200%;
  .explain-index {
    display: inline-block;
  }
  .explain-color {
    width: 50px;
    height:2vh;
    display: inline-block;
  }
  .explain-text {
    display: inline-block;
  }
  .warning {
    background-color: #ff915f;
  }
  .default {
    background-color: #0087ff;
  }
  .yellow {
    background-color: #ffff00
  }
  .danger {
    background-color: #ff0008
  }
}
</style>
