import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      hidden: true,
      component: () => import('@/views'),
      redirect: '/apps',
      children: [
        {
          path: '/apps',
          name: '竹林公司工作应用',
          hidden: true,
          meta: {
            keepAlive: true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "apps" */ '@/views/apps')
        },
        {
          path: '/leave',
          name: '请假申请',
          meta: {
            background: 'on-clock'
          },
          component: () => import(/* webpackChunkName: "leave-index" */ '../views/leave/index.vue')
        },
        {
          path: '/out-business-trip',
          name: '外出申请',
          hidden: false,
          meta: {
            background: 'for-leave'
          },
          component: () => import(/* webpackChunkName: "out-business-trip" */ '../views/out-business-trip/index.vue')
        },
        {
          path: '/mobilizing/staff',
          name: '员工异动',
          meta: {
            background: 'location'
          },
          component: () => import(/* webpackChunkName: "mobilizing-staff" */ '../views/mobilizing/staff.vue')
        },
        {
          path: '/safety_environmental/index',
          name: '安环检查',
          meta: {
            background: 'safety-envir'
          },
          component: () =>
            import(/* webpackChunkName: "safety_environmental-staff" */ '../views/safety_environmental/index.vue')
        },
        {
          path: '/safeHiddenTrouble/recordDetail',
          name: '【安全隐患】记录表',
          meta: {
            // background: 'on-clock'
          },
          hidden: true,
          component: () =>
            import(/* webpackChunkName: "positionQuery-companySelect" */ '@/views/safeHiddenTrouble/recordDetail')
        },
        {
          path: '/environmentalProtection/recordDetail',
          name: '【环保隐患】记录表',
          meta: {},
          hidden: true,
          component: () => import('@/views/environmentalProtection/recordDetail')
        },
        {
          path: '/safeHiddenTrouble/deal',
          name: '安全违规处理单',
          meta: {},
          hidden: true,
          component: () => import('@/views/safeHiddenTrouble/deal')
        },
        {
          path: '/environmentalProtection/deal',
          name: '环保违规处理单',
          meta: {},
          hidden: true,
          component: () => import('@/views/environmentalProtection/deal')
        },
        // 宿舍管理
        {
          path: '/dormitoryManagement/index',
          name: '宿舍管理',
          meta: {
            background: 'dormitory'
          },
          component: () => import('../views/dormitoryManagement/index.vue')
        },
        {
          path: '/dormitoryManagement/registerForecas',
          name: '预注册员工申请住宿',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/registerForecas')
        },
        {
          path: '/dormitoryManagement/registerAdd',
          name: '新增预注册员工的基本信息',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/registerAdd')
        },
        {
          path: '/dormitoryManagement/quarterageApply',
          name: '员工内宿申请',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/quarterageApply')
        },
        {
          path: '/dormitoryManagement/AdjustDormitory',
          name: '员工申请调整宿舍',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/AdjustDormitory')
        },
        {
          path: '/dormitoryManagement/AdjustDormitoryAuditList',
          name: '员工申请调整宿舍(后勤管理审核)列表',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/AdjustDormitoryAuditList')
        },
        {
          path: '/dormitoryManagement/AdjustDormitoryAudit',
          name: '员工申请调整宿舍(后勤管理审核)',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/AdjustDormitoryAudit')
        },
        {
          path: '/dormitoryManagement/result',
          name: '员工宿舍调整申请(接收备查界面)',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/result')
        },
        {
          path: '/dormitoryManagement/withdrawApply',
          name: '员工退宿申请',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/withdrawApply')
        },
        {
          path: '/dormitoryManagement/receiveApply',
          name: '员工申请领用宿舍物资',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/receiveApply')
        },
        {
          path: '/dormitoryManagement/utilityBills',
          name: '记录水电表抄数',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/utilityBills')
        },
        {
          path: '/dormitoryManagement/utilityBills2',
          name: '记录水电表抄数',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/utilityBills2')
        },
        {
          path: '/dormitoryManagement/audit',
          name: '审核宿舍物资领用或维修申请单',
          meta: {},
          hidden: true,
          component: () => import('@/views/dormitoryManagement/audit')
        },
  // 蒸煮控制
        {
          path: '/cooking/index',
          name: '蒸煮控制',
          meta: {
            background: 'cook'
          },
          component: () => import('../views/cooking/index.vue')
        },
        {
          path: '/cooking/sacnCode',
          name: '蒸煮控制',
          meta: {},
          hidden: true,
          component: () => import('../views/cooking/sacnCode.vue')
        },
// 设备巡检
        {
          path: '/equipment/index',
          name: '设备巡检目录',
          meta: {
            background: 'check'
          },
          component: () => import('../views/equipment/index.vue')
        },
        {
          path: '/equipment/inspectionCard',
          name: '【设备管理系统】主界面',
          meta: {},
          hidden: true,
          component: () => import('../views/equipment/inspectionCard.vue')
        },
        {
          path: '/equipment/detection',
          name: '设备巡检',
          meta: {},
          hidden: true,
          component: () => import('../views/equipment/detection.vue')
        },
        {
          path: '/equipment/detectionDetails',
          name: '设备巡检详情',
          meta: {},
          hidden: true,
          component: () => import('../views/equipment/detectionDetails.vue')
        },
        {
          path: '/equipment/toAudit',
          name: '设备异常审核操作',
          meta: {},
          hidden: true,
          component: () => import('../views/equipment/toAudit.vue')
        },
        {
          path: '/equipment/equipmentAudit',
          name: '设备异常审核',
          meta: {},
          hidden: true,
          component: () => import('../views/equipment/equipmentAudit.vue')
        },
        // 员工洗车登记表 
        {
          path: '/washCar/record',
          name: '员工洗车登记',
          meta: {
            background: 'work-record'
          },
          hidden: true,
          component: () => import('../views/washCar/record.vue')
        },
        //年休假申请
        {
          path: '/holiday/index',
          name: '年休假申请',
          meta: {
            background: 'for-leave'
          },
          component: () => import('../views/holiday/index.vue')
        },
        {
          path: '/holiday/confirm-holiday',
          name: '个人年休假确认天数',
          meta: {
          },
          hidden: true,
          component: () => import('../views/holiday/confirm-holiday.vue')
        },
        {
          path: '/holiday/changePlan-holiday',
          name: '休假安排计划调整申请表',
          meta: {
          },
          hidden: true,
          component: () => import('../views/holiday/changePlan-holiday.vue')
        },
        {
          path: '/holiday/notsame-holiday',
          name: '不能同休人员休假计划',
          meta: {
          },
          hidden: true,
          component: () => import('../views/holiday/notsame-holiday.vue')
        },
        {
          path: '/holiday/deduction-holiday',
          name: '个人年休假抵扣申请',
          meta: {
          },
          hidden: true,
          component: () => import('../views/holiday/deduction-holiday.vue')
        },
        {
          path: '/holiday/plan-holiday',
          name: '个人年休假安排计划',
          meta: {
          },
          hidden: true,
          component: () => import('../views/holiday/plan-holiday.vue')
        },
      ]
    }
  ]
})
