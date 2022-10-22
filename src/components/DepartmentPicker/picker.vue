<template>
  <div class="position-picker" :class="{ 'box-loading': isLoading }">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <van-row class="picker-header">
      <van-col span="12" align="left">公司部门选择</van-col>
      <van-col span="12" align="right">
        <van-button style="min-width:30px;" type="default" size="small" @click="$emit('close')">关闭</van-button>
        <van-button style="min-width:30px;" type="primary" size="small" @click="selectBackHandle">返回上级</van-button>
      </van-col>
    </van-row>
    <van-row class="picker-header">
      <van-col span="4">当前：</van-col>
      <van-col span="20">
        <current-select-nav :data="navList" @navClick="navToShow"></current-select-nav>
      </van-col>
    </van-row>
    <div class="picker-items">
      <van-row
        class="picker-item"
        :class="[index == 0 ? 'picker-item-first' : '']"
        v-for="(item, index) in showList.deptList || []"
        :key="'d_' + index"
      >
        <van-col class="item-radio" span="2" align="center">
          <div class="select-control-row" :key="index">
            <van-checkbox v-model="item.picked" @click.native="departmentSelect(item)"></van-checkbox>
          </div>
        </van-col>
        <!-- <van-col class="item-radio" span="2">
          <mu-flex class="select-control-row" :key="index" v-if="multiple">
            <mu-checkbox :value="item.fdId" v-model="item.picked" @change="departmentSelect(item)"></mu-checkbox>
          </mu-flex>
          <mu-flex class="select-control-row" :key="index" v-else>
            <mu-radio :value="item.fdId" v-model="selectedDeptId" @change="departmentSelect(item)"></mu-radio>
          </mu-flex>
        </van-col>-->
        <van-col
          style="padding-left:15px;"
          span="16"
          class="item-name"
          :class="[index + 1 != showList.deptList.length ? 'picker-item-bottom' : '']"
          >{{ item.descShort }}</van-col
        >
        <van-col
          class="item-operate"
          span="6"
          :class="[index + 1 != showList.deptList.length ? 'picker-item-bottom' : '']"
          @click="showNextDept(item)"
          >下级</van-col
        >
      </van-row>
    </div>
    <van-row span="4" class="picker-footer">
      <van-col span="16">
        <span style="display:block;width:100%;overflow:auto;white-space:nowrap;-webkit-overflow-scrolling: touch;"
          >已选择{{ selectedDepartments.length }}个</span
        >
      </van-col>
      <van-col span="8" align="right">
        <van-button type="primary" size="small" @click="submit">确定</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import CurrentSelectNav from './current-select-nav'
import { API } from '@/api'
import request from '@/utils/httpUtil'
export default {
  props: {
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    selected: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 所要查询的公司范围(例如：查华劲人纸品和赣州纸业，则传"011,004"，查询本公司代码为"1")
    companyCode: {
      type: String,
      default: () => ''
    },
    // 根据部门关键字查询范围(例如：只查询带"厂"字部门及其下级，则传"厂")
    deptKeyWord: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      isLoading: false,
      loadingText: '加载中...',
      selectedId: '',
      listArr: [],
      showList: {},
      selectedDepartments: [],
      selectedDepartmentIds: [],
      deptPositionName: '',
      navList: []
      // selectedDeptId: ''
    }
  },
  watch: {
    listArr(val) {
      if (val.length > 0) {
        this.showList = val[val.length - 1]
      }
    },
    selectedDepartments(val) {
      this.selectedDepartmentIds = val.map(item => item.fdId)
    }
  },
  methods: {
    submit() {
      this.$emit('submit', {
        // departments: this.navList,
        departments: this.selectedDepartments,
        names: this.selectedDepartments.map(item => item.descShort)
      })
      this.$emit('close')
    },
    // 选择职位
    departmentSelect(item) {
      let flag = false,
        index = -1
      this.selectedDepartments.forEach((it, i) => {
        if (item.fdId !== it.fdId) {
          flag = true
          index = i
        }
      })
      if (this.multiple) {
        if (flag) {
          this.selectedDepartments.push(item)
          item.picked = true
        } else if (index !== -1) {
          this.selectedDepartments.splice(index, 1)
          item.picked = false
        }
      } else {
        if (this.selectedDepartments.length !== 0) {
          this.selectedDepartments[0].picked = false
        }
        item.picked = true
        this.selectedDepartments = [item]
      }
    },
    // 返回上一层
    selectBackHandle() {
      if (this.listArr.length > 1) {
        this.navList.pop()
        this.listArr.pop()
      }
    },
    // 点导航部门跳转显示
    navToShow(index) {
      if (index === -1) {
        this.listArr.splice(1, this.listArr.length - 1)
        this.navList = []
      } else {
        this.listArr.splice(index + 2, this.listArr.length - 1)
        this.navList.splice(index + 1, this.navList.length - 1)
      }
    },
    // 选择部门下级
    showNextDept(item) {
      this.navList.push(item) // 当前点击部门存入导航集合
      this.isLoading = true
      this.showList = []
      request
        .get(API.DINGTALK_DEPARTMENT_POSITION + '/' + item.fdId)
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || []
            data.deptList = (data.deptList || []).map(item => {
              if (this.selectedDepartmentIds.indexOf(item.fdId) !== -1) {
                item.picked = true
              }
              return item
            })
            if (this.deptKeyWord && data.deptList.length > 0) {
              let chooseArr = []
              data.deptList.forEach(item => {
                if (item.desc.indexOf(this.deptKeyWord) !== -1) {
                  chooseArr.push(item)
                }
              })
              data.deptList = chooseArr
            }
            this.listArr.push(data)
            this.isLoading = false
          } else {
            dAlert(res.data.msg || '查询错误！')
          }
        })
        .catch(err => (this.isLoading = false))
    },
    // 查询公司列表
    getList() {
      this.isLoading = true
      request
        .get(API.DINGTALK_DEPARTMENT_POSITION)
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || []
            console.log(data)
            data.deptList = (data.deptList || []).map(item => {
              if (this.selectedDepartmentIds.indexOf(item.fdId) !== -1) {
                item.picked = true
              }
              return item
            })
            this.listArr.push(data)
            if (this.companyCode && data.deptList.length > 0) {
              let chooseArr = []
              let arr = []
              arr.push(data)
              arr[arr.length - 1].deptList.forEach(item => {
                if (this.companyCode.indexOf(item.company) !== -1) {
                  chooseArr.push(item)
                }
              })
              this.listArr[this.listArr.length - 1].deptList = chooseArr
            }
            // if (!this.navList[0].descShort && data.length !== 0) {
            //   this.navList[0].descShort = (data.deptList[0].desc || '').split('-')[0]
            //   this.currentCompany = this.navList[0].descShort
            // }
            console.log(data)
            this.isLoading = false
          } else {
            dAlert(res.data.msg || '查询错误！')
          }
        })
        .catch(err => (this.isLoading = false))
    }
  },
  mounted() {
    this.listArr = []
    this.selectedDepartmentIds = this.selected.map(item => item.fdId)
    console.log(this.selectedDepartmentIds)
    this.selectedDepartments = this.selected || []
    this.getList()
  },
  components: {
    CurrentSelectNav
  }
}
</script>

<style lang="less" scoped>
  @list-item-height: 42px;
.position-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f0f2f5;
  z-index: 8888;

  .btn-link {
    text-decoration: none;
    color: #2196f3;
  }
  .select-control-row {
    padding: 10px 0;
  }

  .picker-header {
    margin-top: 10px;
    background: #fff;
    font-size: 0.32rem;
    color: #666;
    text-align: left;
    line-height: 1.2rem;
    padding: 0 10px;
  }

  .picker-items {
    height: calc(100vh - 156px);
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .picker-item {
      background: #fff;
      color: #333;
      padding: 0 10px;

      .col {
        padding: 10px 0;
      }

      .item-radio {
        padding-left: 10px;
      }

      .item-name {
        padding-right: 20px;
        height: @list-item-height;
        line-height: @list-item-height;
      }

      .item-operate {
        color: #2196f3;
        padding-left: 10px;
        border-left: 1px solid #efefef;
        height: @list-item-height;
        line-height: @list-item-height;
      }

      &.selected {
        .item-name {
          color: #2196f3;
        }
      }

      &.picker-item-first {
        // margin-top: 10px;
        border-top: 1px solid #efefef;
      }

      .picker-item-bottom {
        border-bottom: 1px solid #efefef;
      }
    }
  }

  .picker-footer {
    border-top: 1px solid #efefef;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 46px;
    background: #fff;
    line-height: 46px;
    padding: 0 20px;
  }
}
</style>
