export const DINTALK_API = true
export const CORP_ID = 'dingc44594930dc9ab4635c2f4657eb6378f'
export const API = {
  DINGTALK_JSAPI: 'dingtalk/jsApi/getJsApiConf', // 鉴权

  DINGTALK_USERID: 'dingtalk/user/getUserId',
  DINGTALK_USERINFO: 'dingtalk/user/getUserInfo',

  DINGTALK_OA_COMMON_SUBMITAPV: 'dingtalk/oa/common/transaction/submit', // 审核审批详情公共审批接口

  DINGTALK_DEPARTMENT_POSITION: 'dingtalk/common/position', // 职位/部门选择器接口
  DINGTALK_DEPARTMENT_EMPLOYEE: 'dingtalk/common/employee/', // 人员选择器接口：获取下属部门以及员工：第一个参数 部门的fdId 第二个参数是部门的deptId
  DINGTALK_DEPARTMENT_WORKER: 'dingtalk/common/worker/', // 人员选择器查岗位工
  DINGTALK_FIND_USER_BY_CODE: 'dingtalk/common/person/detail/', // 根据员工号查找员工详情
  DINGTALK_FIND_USER_BY_KEYWORDS: 'platform/org/dept/findUserInfoByKeyword',
  DINGTALK_FILEUPLOAD: 'dingtalk/common/fileupload', // 上传文件

  // 外出出差申请
  OUT_BUSINESS_TRIP_FIND_UNFINISH: 'dingtalk/trip/record/findNoFinish',
  OUT_BUSINESS_TRIP_FIND_SAVE: 'dingtalk/trip/record/save',

  // 员工异动申请
  DINGTALK_POSTMOVE_APPLY: 'dingtalk/postMove/apply', // 异动提交
  DINGTALK_POSTMOVE_SAVE: 'dingtalk/postMove/save', // 暂存
  DINGTALK_POSTMOVE_QUOTAS: 'dingtalk/postMove/quotas/', // 定编定员详情
  DINGTALK_POSTMOVE_PENDING: 'dingtalk/postMove/pending', // 查询已保存的待办
  DINGTALK_POSTMOVE_WORKER_DISTRIBUTION: 'dingtalk/postMove/worker/distribution/', // 获取发布范围

  DINGTALK_LEAVE_INITAPV: 'dingtalk/leave/initApv',
  DINGTALK_APPLICATION_LEAVE_FORM: 'dingtalk/leave/form', // 发起申请-请假表单初始化
  DINGTALK_APPLICATION_LEAVE_APPLY: 'dingtalk/leave/apply', // 发起申请提交
  DINGTALK_APPLICATION_LEAVE_EMPLOYEE_INFO: 'dingtalk/leave/employee/', // 发起申请-请假表单初始化参数id
  DINGTALK_APPLICATION_LEAVE_COUNT_DAYS: 'dingtalk/leave/count/days/', // 发起申请-请假表单初始化参数id

  // 安环
  findListBy: 'platform/safety-check/safety/safeDanger/findListBy',
  updateFixedCheckDutyMan: 'platform/safety-check/anonymous/phone/updateFixedCheckDutyMan',
  findDeptLIstByCompanyId: 'platform/safety-check/anonymous/phone/findDeptLIstByCompanyId',
  empData: 'platform/safety-check/anonymous/phone/empData',
  upload: 'platform/safety-check/anonymous/phone/upload', // 单个文件上传
  mutipleUpload: 'platform/safety-check/anonymous/phone/mutipleUpload', // 多个文件上传
  saveSafeDangerByPhone: 'platform/safety-check/anonymous/phone/saveSafeDangerByPhone',
  saveSafeAgainstByPhone: 'platform/safety-check/anonymous/phone/saveSafeAgainstByPhone',
  findName: 'platform/safety-check/anonymous/phone/findName',
  userData: 'platform/safety-check/anonymous/phone/userData',
  findClause: 'platform/safety-check/anonymous/phone/findClause',
  history: 'platform/safety-check/anonymous/phone/history',
  findListByDeptId: 'platform/safety-check/anonymous/phone/findListByDeptId',
  canUpdateMeter: 'platform/dormitory-management/ding/canUpdateMeter',

  // 宿舍管理
  getEmployeeInfo: 'platform/dormitory-management/ding/acc/getEmployeeInfo',
  dormitorySave: 'platform/dormitory-management/ding/acc/app/save',
  dormitoryFind: 'platform/dormitory-management/ding/acc/checkIn/find',
  applicationRoomMaterialConsuming: 'platform/dormitory-management/ding/applicationRoomMaterialConsuming',
  roomAdjustSave: 'platform/dormitory-management/ding/acc/roomAdjust/app/save',
  checkOutSave: 'platform/dormitory-management/ding/acc/checkOut/save',
  materialConsumingSave: 'platform/dormitory-management/ding/acc/room/materialConsuming/save',
  getQRcodeInfo: 'platform/dormitory-management/ding/cost/getQRcodeInfo',
  photoSave: 'platform/dormitory-management/ding/cost/meter/photo/save',
  materialConsumingGet: 'platform/dormitory-management/ding/acc/room/materialConsuming/get',
  materialConsumingApproval: 'platform/dormitory-management/ding/acc/room/materialConsuming/approval',
  areaList: 'platform/dormitory-management/ding/building/area/list',
  psShift: 'platform/dormitory-management/ding/base/baseShiftCategory/psShift',
  preregistrationGet: 'platform/dormitory-management/ding/acc/preregistration/get',
  roomAdjustGet: 'platform/dormitory-management/ding/acc/roomAdjust/app/get',
  roomAdjustConfirmReceiving: 'platform/dormitory-management/ding/acc/roomAdjust/app/confirmReceiving',
  preregistrationSave: 'platform/dormitory-management/ding/acc/preregistration/save',
  pendingApproval: 'platform/dormitory-management/ding/acc/roomAdjust/app/pendingApproval',
  approval: 'platform/dormitory-management/ding/acc/roomAdjust/app/approval',
  getById: 'platform/dormitory-management/ding//acc/roomAdjust/app/getById',
  readingSave: 'platform/dormitory-management/ding/cost/meter/reading/save',
  readingNext: 'platform/dormitory-management/ding/cost/meter/reading/next',
  roomUse: 'platform/dormitory-management/ding/baseUseCategory/roomUse',
  effective: 'platform/dormitory-management/ding/base/baseMaterial/effective',
  getMaterialByCode: 'platform/dormitory-management/ding/cost/getMaterialByCode',

  // 蒸煮控制
  checkSampleScan: 'platform/stewing/white/whiteDensity/checkSampleScan/oa',
  checkSampleSubmit: 'platform/stewing/white/whiteDensity/checkSampleSubmit/oa',

  // 设备巡检
  queryCheckDeviceList: 'platform/device/ding/checkRecord/queryCheckDeviceList/app',
  queryCheckDeviceInfo: 'platform/device/ding/checkRecord/queryCheckDeviceInfo/app',
  submitCheckDeviceInfo: 'platform/device/ding/checkRecord/submitCheckDeviceInfo/app',
  queryExceptionDeviceList: 'platform/device/ding/checkException/queryExceptionDeviceList/app',
  queryExceptionAduitOne: 'platform/device/ding/checkException/queryExceptionAduitOne/app',
  submitExceptionDeviceInfo: 'platform/device/ding/checkException/submitExceptionDeviceInfo/app',
  getUserIdentity: 'platform/device/ding/checkRecord/getUserIdentity/app',

  // 洗车登记
  getPersonInfo: 'platform/hwagain-wash-car/anonymouse/dept/getPersonInfo',
  anonymouseCommit: 'platform/hwagain-wash-car/anonymouse/commit',

  // 休假申请
  holidayGetData: 'platform/hwagain-annual-holiday/plan/getData',
  adjustGet: 'platform/hwagain-annual-holiday/plan/adjust/get',
  adjustSave: 'platform/hwagain-annual-holiday/plan/adjust/save',
  unableList: 'platform/hwagain-annual-holiday/plan/unable/list',
  deductionGet: 'platform/hwagain-annual-holiday/person/deduction/apply/getByDing',
  deductionSave: 'platform/hwagain-annual-holiday/person/deduction/apply/save',
  filesSave: 'platform/hwagain-annual-holiday/files/save',

  // 生产抢修用餐申请
  getDept: 'order/omRepair/findDeptName',
  getMealTypeOption: 'order/omRepair/findMealType',
  postMealApply: 'order/omRepair/save'
}

export default {
  DINTALK_API,
  CORP_ID,
  API
}
