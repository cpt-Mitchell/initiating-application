<template>
  <div>
    <div :class="{ 'box-loading': isLoading }" style="height: 100vh; overflow: auto">
      <div class="card">
        <div class="card card-part">
          <table class="m-table">
            <tr class="tabel-header">
              <th colspan="4">申请调整宿舍明细</th>
            </tr>
            <tr class="tabel-header tabel-header-white">
              <th style="width: 25%" class="right-border">申请人</th>
              <th style="width: 30%" class="right-border">申请时间</th>
              <th style="width: 30%" class="right-border">申请编号</th>
              <th style="width: 15%">操作</th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="right-border top-border-solid">{{ item.empName }}</td>
                <td class="right-border top-border-solid">{{ item.confirmReceivingTime | filterTime }}</td>
                <td class="right-border top-border-solid">
                  {{ item.roomAdjustAppId }}
                </td>
                <td
                  class="top-border-solid"
                  @click="
                    $router.push({
                      path: '/dormitoryManagement/AdjustDormitoryAudit',
                      query: { roomAdjustAppId: item.roomAdjustAppId }
                    })
                  "
                  style="color: #409EFF"
                >
                  审核
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vuet from '@/vuet'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/DateTimeUtil'
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      phoneNumber: ''
    }
  },
  components: {},
  filters: {
    filterTime(val) {
      if (val) return val.substring(0, 9)
    }
  },
  methods: {
    init() {
      let params = {
        areaId: vuet.store.dormitory.areaId || '',
        // areaId: '1331049951992442881',
        phoneNumber: this.phoneNumber
      }
      request
        .get(API.pendingApproval, { params }) // 查询登录人信息
        .then(res => {
          console.log(res)
          if (res.data.success) {
            this.tableData = res.data.data || []
          } else {
            alert(res.data.msg)
          }
        })
        .catch(err => {})
    }
  },
  mounted() {
    this.phoneNumber = vuet.modules.home._LOGINUSER_.mobile || ''
    this.init()
  }
}
</script>
<style lang="less" scoped></style>
