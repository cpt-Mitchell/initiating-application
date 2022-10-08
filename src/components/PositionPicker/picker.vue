<template>
  <div class="position-picker" :class="{'box-loading':isLoading}">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{fontSize:'.36rem'}"
      spinner="spinner"
      :text="loadingText"
    />
    <van-row class="picker-header">
      <van-col span="12" align="left">员工岗位选择</van-col>
      <van-col span="12" align="right">
        <van-button style="min-width:30px;" type="default" size="small" @click="$emit('close');">关闭</van-button>
        <van-button
          style="min-width:30px;"
          type="primary"
          size="small"
          @click="selectBackHandle"
        >返回上级</van-button>
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
        :class="[index==0?'picker-item-first':'']"
        v-for="(item,index) in (showList.jobList || [])"
        :key="'p_'+index"
      >
        <!-- <van-col class="item-radio" span="1">
          <van-flex class="select-control-row" :key="index">
            <van-radio :value="item.code" v-model="selectedId" @change="positionSelect(item)"></van-radio>
          </van-flex>
        </van-col>-->
        <van-col class="item-radio" span="2" align="center">
          <div class="select-control-row" :key="index">
            <van-checkbox v-model="item.picked" @click.native="positionSelect(item)"></van-checkbox>
          </div>
          <!-- <div class="select-control-row" :key="index" v-else>
            <van-radio :value="item.id" v-model="item.picked" @change="usersSelect(item)"></van-radio>
          </div>-->
        </van-col>
        <van-col
          style="padding-left:15px;"
          span="22"
          class="item-name"
          :class="[index+1!=showList.jobList.length?'picker-item-bottom':'', item.fdId == selectedId ? 'selected' : '' ]"
        >{{item.name}}</van-col>
        <!-- <van-col class="item-operate" :class="[index+1!=list.length?'picker-item-bottom':'' ]">下级</van-col> -->
      </van-row>
      <van-row
        class="picker-item"
        :class="[index==0?'picker-item-first':'']"
        v-for="(item,index) in (showList.deptList || [])"
        :key="'d_'+index"
      >
        <!-- <van-col class="item-radio" span="1">
                  <van-flex class="select-control-row" :key="index">
                      <van-radio disabled :value="item.id" v-model="selectedId"></van-radio>
                  </van-flex>
        </van-col>-->
        <van-col
          style="padding-left:15px;"
          span="20"
          class="item-name"
          :class="[index+1!=showList.deptList.length?'picker-item-bottom':'' ]"
        >{{item.descShort}}</van-col>
        <van-col
          class="item-operate"
          :class="[index+1!=showList.deptList.length?'picker-item-bottom':'' ]"
          @click.native="showNextDept(item)"
        >下级</van-col>
      </van-row>
    </div>
    <van-row span="4" class="picker-footer">
      <van-col span="16">
        <span
          style="display:block;width:100%;overflow:auto;white-space:nowrap;-webkit-overflow-scrolling: touch;"
        >已选择：{{deptPositionName}}</span>
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
  data() {
    return {
      isLoading: false,
      loadingText: '加载中...',
      selectedId: '',
      listArr: [],
      showList: {},
      selectedPosition: {},
      deptPositionName: '',
      navList: []
    }
  },
  watch: {
    listArr(val) {
      if (val.length > 0) {
        this.showList = val[val.length - 1]
      }
    },
    selectedPosition(val) {
      let arr = this.navList.map(item => item.descShort)
      arr.push(val.name)
      this.deptPositionName = arr.join('-')
    }
  },
  methods: {
    submit() {
      this.$emit('submit', {
        departments: this.navList,
        position: this.selectedPosition,
        name: this.deptPositionName
      })
      this.$emit('close')
    },
    // 选择职位
    positionSelect(item) {
      if (this.selectedPosition && this.selectedPosition.picked) {
        this.selectedPosition.picked = false
      }
      item.picked = true
      this.selectedPosition = item
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
            this.listArr.push(data)
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
