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
    <van-row class="picker-header"> </van-row>
    <van-row class="picker-header">
      <van-col span="12" align="left">公司员工选择</van-col>
      <van-col span="12" align="right">
        <van-button style="min-width: 30px" type="default" size="small" @click="$emit('close')">关闭</van-button>
      </van-col>
    </van-row>
    <van-row class="picker-header"> </van-row>
    <div class="picker-items">
      <van-row
        class="picker-item"
        :class="[index == 0 ? 'picker-item-first' : '']"
        v-for="(item, index) in showList || []"
        :key="'p_' + index"
      >
        <van-col class="item-radio" span="3" align="center">
          <div class="select-control-row" :key="index">
            <van-checkbox :value="item.empId" v-model="item.picked" @click.native="usersSelect(item)"></van-checkbox>
          </div>
        </van-col>
        <van-col
          style="padding-left: 10px"
          span="7"
          class="item-name"
          :class="[
            index + 1 != showList.length ? 'picker-item-bottom' : '',
            item.empId == selectedId ? 'selected' : ''
          ]"
          >{{ item.empName }}</van-col
        >
        <van-col
          style="
            padding-left: 10px;
            text-align: right;
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
          span="14"
          class="item-name"
          :class="[
            index + 1 != showList.length ? 'picker-item-bottom' : '',
            item.empId == selectedId ? 'selected' : ''
          ]"
          >{{ item.longDeptName }}</van-col
        >
      </van-row>
    </div>
    <van-row class="picker-footer">
      <van-col span="16">
        <span
          style="display: block; width: 100%; overflow: auto; white-space: nowrap; -webkit-overflow-scrolling: touch"
          >已选择{{ selectedUsers.length }}个</span
        >
      </van-col>
      <van-col span="8" style="text-align: right">
        <van-button type="primary" size="small" @click="submit">确定</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { API } from '@/api'
import request from '@/utils/httpUtil'
export default {
  props: {
    currentCompany: {
      type: String,
      default: function() {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    deptId: {
      type: String,
      default: () => ''
    },
    selected: {
      type: Array,
      defaultValue: []
    }
  },
  data() {
    return {
      isLoading: false,
      loadingText: '加载中...',
      selectedId: '',
      showList: [],
      selectedUsers: [],
      selectedUserIds: []
    }
  },
  watch: {
    selectedUsers(val) {
      this.selectedUserIds = (val || []).map(item => item.empId)
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.selectedUsers)
      this.$emit('close')
    },
    // 选择人员
    usersSelect(item = {}) {
      let flag = false,
        index = -1
      this.selectedUsers.forEach((it, i) => {
        if (item.empId === it.empId) {
          flag = true
          index = i
        }
      })
      if (this.multiple) {
        item.picked = flag
        if (!flag) {
          this.selectedUsers.push(item)
        } else if (index !== -1) {
          this.selectedUsers.splice(index, 1)
        }
      } else {
        if (this.selectedUsers.length !== 0) {
          this.selectedUsers[0].picked = false
        }
        item.picked = true
        this.selectedUsers = [item]
      }
    },
    // 查询公司列表
    getList() {
      let params = {
        deptId: this.deptId || ''
      }
      request
        .get(API.findListByDeptId, { params }) // 查询明细表
        .then(res => {
          if (res.data) {
            let resdata = res.data.data || []
            this.showList = resdata.map(item => {
              if (this.selectedUserIds.indexOf(item.empId) !== -1) {
                item.picked = true
              } else {
                item.picked = false
              }
              return item
            })
          }
        })
        .catch(err => {})
    }
  },
  mounted() {
    this.selectedUserIds = (this.selected || []).map(item => item.empId)
    this.selectedUsers = this.selected || []
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@list-item-height: 42px;

.position-picker {
  position: fixed;
  top: -10px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f0f2f5;
  z-index: 8888;
  .van-button__text {
    font-size: 12px;
  }
  .van-col {
    font-size: 0.36rem;
  }
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
    height: calc(100vh - 105px);
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
