export const policyStatus = [
  {
    id: 0,
    'zh-TW': '已提交',
    'zh-CN': '已提交',
    'en': 'Submitted'
  },
  {
    id: 1,
    'zh-TW': '申請中',
    'zh-CN': '申请中',
    'en': 'Pending'
  },
  {
    id: 2,
    'zh-TW': '已生效',
    'zh-CN': '已生效',
    'en': 'Inforce'
  },
  {
    id: 3,
    'zh-TW': '延期',
    'zh-CN': '延期',
    'en': 'Postpone'
  },
  {
    id: 4,
    'zh-TW': '保留',
    'zh-CN': '保留',
    'en': 'Reserved'
  },
  {
    id: 5,
    'zh-TW': '還價',
    'zh-CN': '还价',
    'en': 'Counteroffer'
  },
  {
    id: 6,
    'zh-TW': '已拒絕',
    'zh-CN': '已拒绝',
    'en': 'Rejected'
  },
  {
    id: 7,
    'zh-TW': '已失效',
    'zh-CN': '已失效',
    'en': 'Lapse'
  }]

export const riderBenefitStatus = [
  {
    id: 0,
    'zh-TW': '已生效',
    'zh-CN': '已生效',
    'en': 'Inforce'
  },
  {
    id: 1,
    'zh-TW': '已失效',
    'zh-CN': '已失效',
    'en': 'Lapse'
  }
]

export const commissionStatus = [
  {
    id: 0,
    'zh-TW': '審核中',
    'zh-CN': '审核中',
    'en': 'Pending'
  },
  {
    id: 1,
    'zh-TW': '已到賬',
    'zh-CN': '已到账',
    'en': 'Received'
  },
  {
    id: 2,
    'zh-TW': '已提交',
    'zh-CN': '已提交',
    'en': 'Clear'
  }
]

export const creditStatus = [
  {
    id: 0,
    'zh-TW': '待收',
    'zh-CN': '待收',
    'en': 'Generated'
  },
  {
    id: 1,
    'zh-TW': '已到賬',
    'zh-CN': '已到账',
    'en': 'Received'
  },
  // {
  //   id: 2,
  //   'zh-TW': '已拒絕',
  //   'zh-CN': '已拒绝',
  //   'en': 'Rejected'
  // },
  {
    id: 2,
    'zh-TW': '已外發',
    'zh-CN': '已外发',
    'en': 'Clear'
  }]

export const commissionPaymentStatus = [
  {
    id: '-1',
    'zh-TW': '待发放',
    'zh-CN': '待发放',
    'en': 'Generated'
  },
  {
    id: '0',
    'zh-TW': '待審核',
    'zh-CN': '待审核',
    'en': 'Audit'
  },
  {
    id: '2',
    'zh-TW': '待結清',
    'zh-CN': '待结清',
    'en': 'Approved'
  }
  // ,
  // {
  //   id: '3',
  //   'zh-TW': '已結清',
  //   'zh-CN': '已结清',
  //   'en': 'Clear'
  // }
]

export const currencyArray = [
  {
    id: 0,
    desc: 'USD'
  },
  {
    id: 1,
    desc: 'HKD'
  },
  {
    id: 2,
    desc: 'CNY'
  }]

export const insurancePolicyTrace = [
  { id: 0, 'zh-TW': '創建保單', 'zh-CN': '创建保单', 'en': 'Created' },
  { id: 1, 'zh-TW': '修改保單', 'zh-CN': '修改保单', 'en': 'Modified' },
  { id: 2, 'zh-TW': '保單已結清', 'zh-CN': '保单已结清', 'en': 'Clear' },
  { id: 3, 'zh-TW': '刪除保單', 'zh-CN': '删除保单', 'en': 'Deleted' },
  { id: 4, 'zh-TW': '生成待收帳記錄', 'zh-CN': '生成待收帐记录', 'en': 'Credit Generated' },
  { id: 5, 'zh-TW': '重新生成待收帳記錄', 'zh-CN': '重新生成待收帐记录', 'en': 'Credit Regenerated' },
  { id: 6, 'zh-TW': '修改外發賬單', 'zh-CN': '修改外发账单', 'en': 'Credit Modified' },
  { id: 7, 'zh-TW': '支付外發賬單', 'zh-CN': '支付外发账单', 'en': 'Credit Payable' },
  { id: 8, 'zh-TW': '生成待發放記錄', 'zh-CN': '生成待发放记录', 'en': 'Payment Generated' },
  { id: 9, 'zh-TW': '重新生成待發放記錄', 'zh-CN': '重新生成待发放记录', 'en': 'Payment Regenerated' },
  { id: 10, 'zh-TW': '待發賬單已合併', 'zh-CN': '待发账单已合并', 'en': 'Payment Merged' },
  { id: 11, 'zh-TW': '待發賬單審核通過', 'zh-CN': '待发账单审核通过', 'en': 'Payment Approved' },
  { id: 12, 'zh-TW': '待發賬單審核不通過', 'zh-CN': '待发账单审核不通过', 'en': 'Payment Rejected' },
  { id: 13, 'zh-TW': '待發賬單已結清', 'zh-CN': '待发账单已结清', 'en': 'Payment Clear' }
]

export const premiumPlan = [
  // {
  //   id: 0,
  //   'zh-TW': 'Annual',
  //   'zh-CN': 'Annual',
  //   'en': 'Annual'
  // },
  {
    id: 1,
    'zh-TW': 'Regular',
    'zh-CN': 'Regular',
    'en': 'Regular'
  },
  {
    id: 2,
    'zh-TW': 'Single',
    'zh-CN': 'Single',
    'en': 'Single'
  },
  {
    id: 3,
    'zh-TW': 'AnnualRenewal',
    'zh-CN': 'AnnualRenewal',
    'en': 'AnnualRenewal'
  },
  {
    id: 4,
    'zh-TW': 'Quarterly',
    'zh-CN': 'Quarterly',
    'en': 'Quarterly'
  },
  {
    id: 5,
    'zh-TW': 'HalfYearly',
    'zh-CN': 'HalfYearly',
    'en': 'HalfYearly'
  }]

export const fileType = {
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'application/msword': 'word',
  'application/vnd.ms-excel': 'excel',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
  'video/avi': 'video',
  'video/mpeg4': 'video',
  'video/mp4': 'video',
  'video/x-ms-wmv': 'video',
  'audio/mp3': 'audio',
  'image/gif': 'img',
  'image/jpeg': 'img',
  'image/png': 'img',
  'application/x-zip-compressed': 'rar'
}

export const expensesType = [
  {
    id: 0,
    'zh-TW': '交通费',
    'zh-CN': '交通費',
    'en': 'Traffic'
  },
  {
    id: 1,
    'zh-TW': '住宿費',
    'zh-CN': '住宿费',
    'en': 'Accommodations'
  },
  {
    id: 2,
    'zh-TW': '手續費',
    'zh-CN': '手续费',
    'en': 'Fee'
  },
  {
    id: 3,
    'zh-TW': '其他',
    'zh-CN': '其他',
    'en': 'Misc'
  }
]

export const numberAcronym = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th']

