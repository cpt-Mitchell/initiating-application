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
      <van-col span="12" align="left">工段选择</van-col>
      <van-col span="12" align="right">
        <van-button style="min-width:30px;" type="default" size="small" @click="$emit('close')">关闭</van-button>
      </van-col>
    </van-row>
    <div class="picker-items">
      <van-row
        class="picker-item"
        :class="[index == 0 ? 'picker-item-first' : '']"
        v-for="(item, index) in listArr || []"
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
          span="22"
          class="item-name"
          :class="[index + 1 != listArr.length ? 'picker-item-bottom' : '']"
          >{{ item.name }}</van-col
        >
        <!-- <van-col
          class="item-operate"
          span="6"
          :class="[index + 1 != showList.deptList.length ? 'picker-item-bottom' : '']"
          @click="showNextDept(item)"
          >下级</van-col
        > -->
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
// import CurrentSelectNav from './current-select-nav'
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
    // 根据部门查询工段
    deptCode: {
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
      // showList: {},
      selectedDepartments: [],
      selectedDepartmentIds: [],
      deptPositionName: '',
      navList: []
      // selectedDeptId: ''
    }
  },
  watch: {
    // listArr(val) {
    //   if (val.length > 0) {
    //     this.showList = val[val.length - 1]
    //   }
    // },
    selectedDepartments(val) {
      this.selectedDepartmentIds = val.map(item => item.fdId)
    }
  },
  methods: {
    submit() {
      this.$emit('submit', {
        departments: this.selectedDepartments,
        names: this.selectedDepartments.map(item => item.descShort)
      })
      this.$emit('close')
    },
    // 选择工段
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
    // 查询工段列表
    getList() {
      this.isLoading = true
      request
        .get(API.DINGTALK_DEPARTMENT_SECTION + this.deptCode)
        .then(res => {
          let success = res.data.success
          if (success) {
            let data = res.data.data || []
            this.listArr = data
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
    this.selectedDepartmentIds = this.selected.map(item => item.code)
    console.log(this.selectedDepartmentIds)
    this.selectedDepartments = this.selected || []
    this.getList()
  },
  components: {}
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
