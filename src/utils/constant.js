export const policyStatus = [
  {
    id: 0,
    'zh-TW': '已提交',
    'zh-CN': '已提交',
    'en': 'Submitted'
  },
  {
    id: 1,
    'zh-TW': '核保中',
    'zh-CN': '核保中',
    'en': 'Pending'
  },
  {
    id: 5,
    'zh-TW': '反邀约',
    'zh-CN': '反邀约',
    'en': 'Counteroffer'
  },
  {
    id: 2,
    'zh-TW': '已生效',
    'zh-CN': '已生效',
    'en': 'Inforce'
  },
  {
    id: 6,
    'zh-TW': '已拒絕',
    'zh-CN': '已拒绝',
    'en': 'Rejected'
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
    id: 7,
    'zh-TW': '已失效',
    'zh-CN': '已失效',
    'en': 'Lapse'
  }];

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
];

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
];

export const creditStatus = [
  {
    id: '-1',
    'zh-TW': '匯總',
    'zh-CN': '汇总',
    'en': 'summary'
  },
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
  }];

export const commissionPaymentStatus = [
  {
    id: '-1',
    role: 130000,
    'zh-TW': '待发放',
    'zh-CN': '待发放',
    'en': 'Generated'
  },
  {
    id: '0',
    role: 130001,
    'zh-TW': '待審核',
    'zh-CN': '待审核',
    'en': 'Audit'
  },
  {
    id: '2',
    role: 130002,
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
];

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
  }];

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
];

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
  }];

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
  'image/gif': 'photo',
  'image/jpeg': 'photo',
  'image/png': 'photo',
  'application/x-zip-compressed': 'rar'
};

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
];

export const numberAcronym = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th'];

export const homePageConfig = [
  { id: 1, 'name': 'home.creditSum', permissions: [110000] }, // 已收
  { id: 2, 'name': 'home.pendingCreditSum', permissions: [110001] }, // 待收
  { id: 3, 'name': 'home.paymentSum', permissions: [110002] }, // 已发放
  { id: 4, 'name': 'home.pendingPaymentSum', permissions: [110003] }, // 待发放
  // { id: 5, 'name': 'home.policyCount', permissions: [110005] }, // 签单数
  { id: 6, 'name': 'home.normalPolicyCount', permissions: [110006] }, // 成单数
  { id: 8, 'name': 'home.companyProfit', permissions: [110004] }, // 公司业绩收益
  { id: 9, 'name': 'home.channelProfit', permissions: [110008] }, // 渠道业绩趋势
  { id: 10, 'name': 'home.comparison', permissions: [110000, 110005] }, // 公司业绩同比
  { id: 11, 'name': 'home.channelPerformanceTop', permissions: [110008], roles: [1] }, // 渠道Top5
  { id: 12, 'name': 'home.channelPerformanceScale', permissions: [110008], roles: [1] }, // 渠道业绩分布
  { id: 13, 'name': 'home.news' }, // 最新动态
  { id: 14, 'name': 'home.balance', permissions: [110000, 110002, 110004, 110010] } // 收支分布
];

export const permission = [
  { id: 1, label: '首页', action: [{ id: 100001, name: 'Dashboard' }] },
  {
    label: '产品',
    children: [
      {
        'id': 2,
        label: '合作机构',
        action: [{ id: 100006, name: 'ListInsuranceCompany' }],
        children: [
          {
            id: 16,
            label: '添加',
            action: [
              { id: 100005, name: 'CreateInsuranceCompany' }]
          },
          {
            id: 17,
            label: '修改',
            action: [
              { id: 100008, name: 'UpdateInsuranceCompany' }]
          },
          {
            id: 18,
            label: '编辑联系人',
            action: [
              { id: 100122, name: 'CreateContact' },
              { id: 100123, name: 'ListContact' },
              { id: 100125, name: 'UpdateContact' },
              { id: 100126, name: 'DeleteContact' }
            ]
          },
          {
            id: 19,
            label: '删除',
            action: [
              { id: 100009, name: 'DeleteInsuranceCompany' }]
          }]
      },
      {
        'id': 3,
        label: '产品佣金',
        action: [{ id: 100006, name: 'ListInsuranceCompany' }, { id: 100016, name: 'ListCommissionTable' }],
        children: [
          { 'id': 20, label: '添加', action: [{ id: 100015, name: 'CreateCommissionTable' }, { id: 100006, name: 'ListInsuranceCompany' }, { id: 100016, name: 'ListCommissionTable' }] },
          { 'id': 21, label: '查看', action: [{ id: 100017, name: 'ShowCommissionTable' }] },
          { 'id': 22, label: '修改', action: [{ id: 100018, name: 'UpdateCommissionTable' }, { id: 100021, name: 'ShowDraft' }, { id: 100022, name: 'UpdateCommissionTableDraft' }, { id: 100023, name: 'SaveDraft' }] },
          { 'id': 23, label: '导出', action: [{ id: 100020, name: 'ExportCommissionTable' }] },
          { 'id': 24, label: '删除', action: [{ id: 100019, name: 'DeleteCommissionTable' }] }
        ]
      },
      {
        'id': 4,
        label: '渠道佣金',
        action: [{ id: 100082, name: 'ListUser' }, { id: 100030, name: 'ListChannelCommissionTable' }],
        children: [
          { 'id': 25, label: '添加', action: [{ id: 100029, name: 'CreateChannelCommissionTable' }, { id: 100082, name: 'ListUser' }] },
          { 'id': 26, label: '修改', action: [{ id: 100032, name: 'UpdateChannelCommissionTable' }] },
          { 'id': 27, label: '删除', action: [{ id: 100033, name: 'DeleteChannelCommissionTable' }] }
        ]
      }
    ]
  },
  {
    label: '客户',
    children: [
      {
        'id': 5,
        label: '保单',
        action: [{ id: 100045, name: 'ListInsurancePolicy' }, { id: 100041, name: 'ShowClient' }],
        children: [
          { 'id': 28, label: '添加', action: [{ id: 100044, name: 'CreateInsurancePolicy' }, { id: 100082, name: 'ListUser' }, { id: 100006, name: 'ListInsuranceCompany' }, { id: 100011, name: 'ListProduct' }] },
          { 'id': 29, label: '修改', action: [{ id: 100044, name: 'UpdateInsurancePolicy' }, { id: 100082, name: 'ListUser' }, { id: 100006, name: 'ListInsuranceCompany' }, { id: 100011, name: 'ListProduct' }] },
          { 'id': 30, label: '副险', action: [{ id: 100044, name: 'UpdateInsurancePolicy' }] },
          { 'id': 31, label: '续保', action: [{ id: 100051, name: 'RenewInsurancePolicy' }, { id: 100052, name: 'ListInsurancePolicyRenewal' }, { id: 100053, name: 'UpdateInsurancePolicyRenewal' }, { id: 100054, name: 'DeleteInsurancePolicyRenewal' }] },
          { 'id': 32, label: '保单文件', action: [{ id: 100133, name: 'DownloadPolicyDocument' }] },
          { 'id': 33, label: '修改保单文件', action: [{ id: 100135, name: 'RenamePolicyDocument' }] },
          { 'id': 34, label: '上传保单文件', action: [{ id: 100132, name: 'UploadPolicyDocument' }] },
          { 'id': 35, label: '删除保单文件', action: [{ id: 100134, name: 'DeletePolicyDocument' }] },
          { 'id': 36, label: '邮件通知', action: [{ id: 100128, name: 'ListEmailTemplate' }] },
          { 'id': 37, label: '重置', action: [{ id: 100050, name: 'ResetInsurancePolicy' }] },
          { 'id': 38, label: '删除', action: [{ id: 100048, name: 'DeleteInsurancePolicy' }] },
          { 'id': 39, label: '公司支出', action: [{ id: 100112, name: 'CreateExpense' }, { id: 100113, name: 'ListExpense' }, { id: 100114, name: 'ShowExpense' }, { id: 100115, name: 'UpdateExpense' }, { id: 100116, name: 'DeleteExpense' }] },
          { 'id': 40, label: '渠道支出', action: [{ id: 100117, name: 'CreateChannelExpense' }, { id: 100118, name: 'ListChannelExpense' }, { id: 100119, name: 'ShowChannelExpense' }, { id: 100120, name: 'UpdateChannelExpense' }, { id: 100121, name: 'DeleteChannelExpense' }] },
          { 'id': 41, label: '添加客户', action: [{ id: 100039, name: 'CreateClient' }] }
        ]
      },
      {
        'id': 6,
        label: '客户资料',
        action: [{ id: 100040, name: 'ListClient' }],
        children: [
          { 'id': 42, label: '添加', action: [{ id: 100039, name: 'CreateClient' }] },
          { 'id': 43, label: '修改', action: [{ id: 100042, name: 'UpdateClient' }, { id: 100041, name: 'ShowClient' }] },
          { 'id': 44, label: '删除', action: [{ id: 100043, name: 'DeleteClient' }] }
        ]
      }
    ]
  },
  {
    label: '佣金',
    children: [
      {
        'id': 7,
        label: '到账记录',
        action: [{ id: 100055, name: 'ListCommissionCredit' }, { id: 100060, name: 'GetFilteredCreditSum' }],
        children: [
          { 'id': 45, label: '修改', action: [{ id: 100056, name: 'ShowCommissionCredit' }, { id: 100057, name: 'UpdateCommissionCredit' }] },
          { 'id': 46, label: '审核', action: [{ id: 100058, name: 'RejectCredit' }, { id: 100059, name: 'ClearCredit' }] }
        ]
      },
      {
        'id': 8,
        label: '发放记录',
        action: [{ id: 100067, name: 'ListMergedPayment' }],
        children: [
          { 'id': 47, label: '待发放', paymentStatus: [{ id: 130000, name: 'Generated' }] },
          { 'id': 48, label: '待审核', paymentStatus: [{ id: 130001, name: 'Rejected' }] },
          { 'id': 49, label: '待结清', paymentStatus: [{ id: 130002, name: 'Approved' }] },
          { 'id': 50, label: '提交审核', action: [{ id: 100068, name: 'ShowMergedPayment' }, { id: 100069, name: 'CreateMergedPayment' }] },
          { 'id': 51, label: '审核', action: [{ id: 100068, name: 'ShowMergedPayment' }, { id: 100070, name: 'RejectMergedPayment' }, { id: 100071, name: 'ApproveMergedPayment' }] },
          { 'id': 50, label: '结清', action: [{ id: 100072, name: 'ClearMergedPayment' }] }
        ]
      },
      { 'id': 9, label: '已结清记录', paymentStatus: [{ id: 130003, name: 'Clear' }] }
    ]
  },
  {
    id: 10,
    label: '保单审计',
    action: [{ id: 100045, name: 'ListInsurancePolicy' }],
    children: [
      { 'id': 52, label: '详情', action: [{ id: 100049, name: 'TraceInsurancePolicy' }] }
    ]
  },
  {
    label: '文档',
    children: [
      {
        'id': 11,
        label: '内部文档',
        action: [{ id: 100078, name: 'DownloadPrivateDocument' }],
        children: [
          { 'id': 53, label: '上传', action: [{ id: 100077, name: 'UploadPrivateDocument' }] },
          { 'id': 54, label: '下载', action: [{ id: 100078, name: 'DownloadPrivateDocument' }] },
          { 'id': 55, label: '修改', action: [{ id: 100080, name: 'RenamePrivateDocument' }] },
          { 'id': 56, label: '删除', action: [{ id: 100079, name: 'DeletePrivateDocument' }] }
        ]
      },
      {
        'id': 12,
        label: '公司文档',
        action: [{ id: 100074, name: 'DownloadInsuranceCompanyDocument' }],
        children: [
          { 'id': 57, label: '上传', action: [{ id: 100073, name: 'UploadInsuranceCompanyDocument' }] },
          { 'id': 58, label: '下载', action: [{ id: 100074, name: 'DownloadInsuranceCompanyDocument' }] },
          { 'id': 59, label: '修改', action: [{ id: 100076, name: 'RenameInsuranceCompanyDocument' }] },
          { 'id': 60, label: '删除', action: [{ id: 100075, name: 'DeleteInsuranceCompanyDocument' }] }
        ]
      }
    ]
  },
  {
    label: '系统',
    children: [
      {
        'id': 13,
        label: '用户',
        action: [{ id: 100082, name: 'ListUser' }],
        children: [
          { 'id': 61, label: '添加', action: [{ id: 100081, name: 'CreateUser' }] },
          { 'id': 62, label: '修改', action: [{ id: 100083, name: 'ShowUser' }, { id: 100084, name: 'UpdateUser' }] },
          { 'id': 63, label: '重置密码', action: [{ id: 100003, name: 'ResetPassword' }] },
          { 'id': 64, label: '删除', action: [{ id: 100085, name: 'DeleteUser' }] },
          { 'id': 65, label: '渠道上级列表', action: [{ id: 100108, name: 'ListChannelHierarchy' }] },
          { 'id': 66, label: '添加渠道上级', action: [{ id: 100107, name: 'CreateChannelHierarchy' }] },
          { 'id': 67, label: '修改渠道上级', action: [{ id: 100109, name: 'ShowChannelHierarchy' }, { id: 100110, name: 'UpdateChannelHierarchy' }] },
          { 'id': 68, label: '删除渠道上级', action: [{ id: 100111, name: 'DeleteChannelHierarchy' }] }
        ]
      },
      {
        'id': 14,
        label: '角色',
        action: [{ id: 100088, name: 'ListRole' }],
        children: [
          { 'id': 69, label: '添加', action: [{ id: 100087, name: 'CreateUser' }] },
          { 'id': 70, label: '修改', action: [{ id: 100089, name: 'ShowRole' }, { id: 100090, name: 'UpdateRole' }] },
          { 'id': 71, label: '删除', action: [{ id: 100091, name: 'DeleteRole' }] }
        ]
      },
      {
        'id': 15,
        label: '模板',
        action: [{ id: 100128, name: 'ListEmailTemplate' }],
        children: [
          { 'id': 72, label: '添加', action: [{ id: 100127, name: 'CreateEmailTemplate' }] },
          { 'id': 73, label: '修改', action: [{ id: 100129, name: 'ShowEmailTemplate' }, { id: 100130, name: 'UpdateEmailTemplate' }] },
          { 'id': 74, label: '删除', action: [{ id: 100131, name: 'DeleteEmailTemplate' }] }
        ]
      },
      {
        'id': 75,
        label: '续保日历',
        action: [{ id: 100105, name: 'ShowRenewalCalendar' }],
        children: [
          { 'id': 76, label: '修改续保状态', action: [{ id: 100106, name: 'UpdateRenewalCalendar' }] },
          { 'id': 77, label: '发送续保提醒' }
        ]
      }
    ]
  }
];
