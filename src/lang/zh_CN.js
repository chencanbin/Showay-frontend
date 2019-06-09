export default {
  route: {
    home: '首页',
    product: '产品',
    company: '合作机构',
    productCommission: '产品佣金',
    channelCommission: '渠道佣金',
    client: '客户',
    insurancePolicy: '保单',
    clientInfo: '客户资料',
    commission: '佣金',
    commissionCredit: '到账记录',
    paymentAudit: '发放记录',
    cleared: '已结清记录',
    audit: '保单审计',
    document: '文档',
    internalDocument: '内部文档',
    companyDocument: '公司文档',
    system: '系统',
    user: '用户',
    role: '角色',
    template: '模板'
  },
  common: {
    action: '操作',
    add: '添加',
    delete: '删除',
    edit: '修改',
    view: '查看',
    export: '导出',
    reset: '重置',
    success: '操作成功',
    prompt: '提示',
    status: '状态',
    confirmButton: '确定',
    cancelButton: '取消',
    submitButton: '提交',
    saveButton: '保存',
    remarks: '备注',
    remarks_placeholder: '请输入备注',
    year: '第{0}年',
    after_i_year: '第{0}年之后',
    after_15_year: '15年以后',
    calculatedAmount: '应收',
    amount: '实收',
    profit: '收益',
    expenses: '支出',
    exchangeRate: '汇率',
    commission_rate: '佣金率',
    approve: '批准',
    reject: '拒绝',
    tooltip: {
      close: '是否需要关闭此窗口?'
    },
    password_verify: '身份认证',
    reset_password: '重置密码',
    password_verify_text: '此操作需要验证身份才能继续进行',
    company_placeholder: '请选择供应商',
    medium: '中号',
    small: '小号',
    mini: '极小',
    no_data: '暂无数据'
  },
  navbar: {
    logOut: '退出登录',
    password: '修改密码',
    oldPassword: '旧密码',
    newPassword: '新密码',
    confirmPassword: '密码确认',
    password_tip: {
      oldPassword: '旧密码必须填',
      password: '新密码必须填',
      password_confirm: '密码确认必须填',
      enter_password_again: '请再次输入密码',
      difference_password: '两次输入密码不一致'
    },
    screenfull: '全屏',
    theme: '换肤',
    size: '布局大小',
    calendar: '续保日历',
    credit: '待收',
    payment: '待发'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    password_placeholder: '请输入您的密码'
  },
  home: {
    creditSum: '已到账',
    paymentSum: '已發放',
    pendingCreditSum: '预计到账',
    pendingPaymentSum: '预计发放',
    policyCount: '总签单数',
    normalPolicyCount: '成单数',
    news: '最新动态',
    balance: '收支分布',
    fileName: '文件名称',
    companyProfit: '公司收益趋势',
    channelProfitTrend: '{0} 渠道业绩趋势',
    channelProfit: '渠道业绩趋势',
    month: '月度',
    quarter: '季度',
    year: '年度',
    sale: '数额',
    comparison: '公司业绩同比',
    count: '出单量',
    channelPerformanceTop: '渠道业绩Top5',
    channelPerformanceScale: '渠道业绩比例分布'
  },
  product: {
    company: {
      search_company_placeholder: '搜索(公司缩写|公司名)',
      levelTab: {
        level1: '一级',
        level2: '二级'
      },
      table_header: {
        acronym: '公司缩写',
        name: '公司名',
        level: '级别',
        creationDay: '创建时间',
        phone: '联系电话',
        email: '电子邮件',
        website: '系统地址',
        address: '联系地址',
        contractEffectiveDate: '签约时间',
        action: '操作'
      },
      set: {
        add_title: '添加公司',
        edit_title: '编辑公司',
        add_contact_title: '添加联系人',
        edit_contact_title: '编辑联系人',
        name_en: '公司名(英文)',
        name_zh: '公司名(中文)',
        acronym: '公司缩写',
        phone: '联系电话',
        email: '电子邮件',
        website: '系统地址',
        address: '联系地址',
        contacts: '联系人',
        contacts_name: '姓名',
        contacts_title: '职位',
        contacts_phone: '电话',
        contacts_email: '电子邮件',
        contacts_address: '地址',
        contractEffectiveDate: '签约时间',
        secondary: '二级供应商',
        verify_message: {
          name_en: '公司名(英文)必须填',
          name_zh: '公司名(中文)必须填',
          acronym: '公司缩写必须填'
        }
      },
      tooltip: {
        delete: '此操作将永久删除该供应商, 是否继续?'
      }
    },
    commission: {
      commission_table_list: {
        no_commission_table: '无佣金表',
        status: '状态',
        status_info: '未发布',
        status_success: '已发布',
        status_warning: '有改动',
        product_count: '产品数'
      },
      tooltip: {
        delete: '此操作将永久删除该佣金表, 是否继续?',
        export: '导出的部分不包含未发布的内容, 是否继续导出?',
        download: '导出文件需要较多时间, 是否继续导出?'
      },
      commission_table: {
        title: '{0} 佣金策略表',
        text: '{0}佣金策略表',
        search_placeholder: '请输入搜索内容',
        basic_tab: '基础佣金表',
        override_tab: 'Override佣金表',
        overall_tab: '总佣金表',
        effectDateTitle: '设置佣金表生效时间',
        effectDate: '生效时间',
        override_setting: '设置Override',
        publish_button: '发布',
        edit_status: {
          modifying: '正在修改.....',
          saving: '正在保存.....',
          latest_save: '最近保存 {0}'
        },
        col_header: {
          product_name: '产品名称',
          ENG_name: 'ENG name',
          product_id: '产品编号',
          period: '年期',
          ffyap: 'FFYAP',
          year: '第{0}年',
          after_15_year: '15年以后'
        }
      },
      view: {
        search: '搜索 (编号 | 中文 | 英文)',
        basic_tab: '基础佣金表',
        overall_tab: '总佣金表',
        table_header: {
          acronym: '编号',
          name: '产品名称(中文)',
          enName: '产品名称(英文)',
          period: '年期'
        },
        title: '{0} 佣金表',
        year: '第{0}年',
        after_15_year: '15年以后'
      },
      add: {
        title: '添加佣金表',
        company: '供应商',
        template: '佣金模板',
        template_placeholder: '请选择佣金模板(不选默认创建空白佣金表)',
        company_rule_message: '请选择供应商',
        generate_commission_rate: '生成佣金率'
      }
    },
    channel: {
      no_channel_policy: '无渠道佣金策略',
      reference_time_title: '选择参考时间',
      search_channel_placeholder: '搜索 (姓名 | 账号)',
      table_header: {
        name: '用户名',
        account: '账号',
        superior: '上级',
        create_time: '创建时间',
        effectiveDate: '有效时间',
        remarks: '备注'
      },
      policy_button: '渠道策略',
      commission_policy_button: '佣金策略',
      tooltip: {
        delete: '此操作将永久删除该渠道账号, 是否继续?',
        delete_channel_commission_table: '此操作将永久删除该渠道佣金表, 是否继续?'
      },
      view: {
        search: '搜索 (供应商 | 产品)',
        title: '渠道佣金预览',
        company: '供应商',
        product: '产品名称'
      },
      set: {
        add_title: '添加渠道佣金策略表',
        edit_title: '编辑渠道佣金策略表',
        edit_commission_policy_title: '编辑佣金策略',
        priority: '优先级',
        name: '供应商 / 产品',
        term: '年期',
        save_dialog_title: '渠道佣金生效时间 / 备注',
        effectiveDate: '生效时间',
        remarks_placeholder: '请输入备注',
        tooltip: {
          close: '是否需要关闭次页面?'
        },
        add_policy: {
          title: '添加策略',
          type: '类型',
          all: '所有',
          company: '供应商',
          product: '产品',
          term: '年期',
          userDefined: '自定义年期',
          type_placeholder: '请选择策略类型',
          company_placeholder: '请选择公司',
          product_placeholder: '请选择产品',
          term_placeholder: '请选择年期',
          user_defined_placeholder: '请选择自定义年期',
          verify_message: {
            type: '请选择策略类型',
            term: '年期必须选',
            userDefined: '自定义年期必须选',
            commission_rate: '请输入佣金率',
            commission_rate_exceed: '佣金率不能超过100',
            commission_rate_is_number: '佣金率必须为数字'
          }
        }
      }
    }
  },
  user: {
    name: '用户名',
    acronym: '缩写',
    account: '账号',
    role: '权限',
    effectiveDate: '有效时间',
    create_time: '创建时间',
    superior: '上级',
    email: '电子邮箱',
    tooltip: {
      delete: '此操作将永久删除该账号, 是否继续?',
      delete_superior: '此操作将永久删除该渠道上级, 是否继续?'
    },
    set: {
      add_channel_title: '创建渠道',
      edit_channel_title: '编辑渠道',
      add_channel_superior: '添加渠道上级',
      edit_channel_superior: '编辑渠道上级',
      add_title: '创建用户',
      edit_title: '编辑用户',
      name: '请输入用户名',
      account: '请输入账号',
      acronym: '请输入缩写',
      role: '请选择账户角色',
      effectiveDate: '请输入有效时间',
      superior: '请选择账户上级',
      email: '请输入电子邮箱',
      none_superior: '无上级',
      verify_message: {
        name: '姓名必须填',
        account: '账号必须填'
      }
    }
  },
  role: {
    name: '角色名',
    create_time: '创建时间'
  },
  template: {
    title: '模板名',
    subject: '主题',
    tooltip: {
      delete: '此操作将永久删除该模板, 是否继续?'
    },
    set: {
      add_template: '添加模板',
      edit_template: '编辑模板'
    }
  },
  client: {
    info: {
      search: '搜索(客户姓名 | 证件号)',
      type: '类型',
      individual: '个人',
      organization: '机构',
      name: '客户名',
      enName: '英文名',
      idNumber: '证件号',
      locale: '国家/地区',
      sex: '性别',
      birthday: '出生日期',
      established_time: '成立时间',
      phone: '电话号码',
      email: '电子邮箱',
      male: '男',
      female: '女',
      commonly_use_country: '常用国家',
      all_country: '所有国家',
      tooltip: {
        delete: '此操作将永久删除该客户, 是否继续?'
      },
      set: {
        add_title: '添加客户资料',
        edit_title: '编辑客户资料',
        name: '请输入客户姓名',
        enName: '请输入英文名',
        organization_id: '輸入商业登记号 或 公司注册证明书号',
        idNumber: '请输入证件号',
        locale: '请选择国家/地区',
        birthday: '请选择出生日期',
        established_time: '请选择成立日期',
        phone: '请输入电话号码',
        email: '请输入电子邮箱'
      }
    },
    insurance_policy: {
      search: '请输入搜索内容',
      basic_info: '基础信息',
      date_filter: '根据申请日期过滤',
      number: '保单号',
      submitDate: '申请日期',
      policyStatus: '保单状态',
      applicant_name: '申请人',
      insured_name: '受保人',
      beneficiary_name: '收益人',
      relationship: '关系',
      percentage: '比例',
      company_name: '保险公司',
      product_name: '产品',
      sn: '内部编号',
      currency: '币种',
      channel_name: '渠道',
      agent_name: '签单员',
      amountInsured: '保额',
      premium: '保费',
      premiumPlan: '续费计划',
      issueDate: '生效时间',
      premiumDate: '续费时间',
      channel: '渠道',
      company: '供应商',
      product: '产品',
      riderBenefits: '副险',
      riderBenefits_title: '副险列表',
      riderBenefits_product: '产品',
      riderBenefits_status: '副险状态',
      detail_title: '保险详情',
      renewal: '续保',
      renewed: '已续保',
      renewal_time: '续保时间',
      renewal_title: '续保记录',
      no_renewal_record: '无续保记录',
      term: '年期',
      renewal_calendar: '续保日历',
      renewal_notification: '续保提醒',
      email_notification: '邮件通知',
      policy_file: '保单文件',
      tooltip: {
        delete: '此操作将永久删除该保单, 是否继续?',
        delete_riderBenefit: '此操作将删除该副险, 是否继续?',
        delete_renew_record: '此操作将删除该续费记录, 是否继续?',
        reset: '此操作将重置保单, 是否继续?'
      },
      set: {
        add_riderBenefits_title: '添加副险',
        edit_riderBenefits_title: '编辑副险',
        insurance_policy_detail: '保单详情',
        add_beneficiary: '添加收益人',
        add_title: '添加保单',
        edit_title: '编辑保单',
        channel_expense: '渠道支出',
        company_expense: '公司支出',
        expense_item: '支出项目',
        riderBenefits_status: '请选择副险状态',
        number: '请输入保单号',
        submitDate: '选择申请日期',
        premiumDate: '选择续费時間',
        policyStatus: '请选择保单状态',
        applicant_name: '请选择申请人',
        insured_name: '请选择受保人',
        beneficiary_name: '请选择收益人',
        percentage: '比例必须填',
        currency: '请选中币种',
        company_name: '请选择供应商',
        product_name: '请输入产品名或产品编号',
        sn: '请输入内部编号',
        channel_name: '请选择渠道',
        agent_name: '请选择签单员',
        amountInsured: '请输入保额',
        premium: '请输入保费',
        premiumPlan: '请选择续保计划',
        issueDate: '选择生效日期',
        term: '请选择年期'
      }
    }
  },
  commission: {
    credit: {
      search: '搜索(保单号 | 投保人)',
      batchPay: '批量外发',
      start: '开始日期',
      end: '结束日期',
      switch_sort: '切换排序',
      count: '条',
      year: '期序',
      years: '第{0}期',
      calculatedAmountInHkd: '应收等额港币',
      calculated_count: '预计待收总数',
      calculated_amount_total: '预计待收总额',
      calculated_selected_count: '已选预计待收总数',
      calculated_selected_sum: '已选预计待收总额',
      amount_count: '已到账总数',
      amount_total: '已到账总额',
      amount_selected_count: '已选已到账总数',
      amount_selected_sum: '已选已到账总额',
      cleared_count: '已结清总数',
      cleared_total: '已结清总额',
      cleared_selected_count: '已选已结清总数',
      cleared_selected_sum: '已选已结清总额',
      pay: '外发',
      rollback: '退回待发',
      tooltip: {
        batchPay: '是否批量处理已选中的记录?'
      },
      set: {
        edit_credit_title: '编辑到账记录',
        audit_title: '到账审核',
        exchangeRate: '请输入汇率'
      }
    },
    payment: {
      search: '搜索',
      channel: '渠道',
      calculatedTotalInHkd: '预计应发总额',
      predictedTotalInHkd: '预计实发总额',
      amountInHkd: '实发总额',
      chequeNumber: '支票号码',
      chequeCopy: '支票扫描件',
      chequeIssueDate: '签发时间',
      premiumInHkd: '保费等额港币',
      calculatedAmountInHkd: '预计应发',
      predictedAmountInHkd: '预计实发',
      amount: '应发',
      calculatedAmount: '预发',
      generated_commission: '待发放佣金',
      audit_commission: '待审核佣金',
      generated_list: '待发放列表',
      audit_list: '待审核列表',
      submit_audit: '提交审核',
      cleared_title: '结清佣金',
      payment_detail: '支付详情',
      payment_date: '发放时间',
      check_detail: '支票详情',
      tooltip: {
        audit: '此操作会将选中的渠道佣金记录提交审核, 是否继续?',
        approve: '审核通过之后, 将无法再修改发放金额, 是否继续?',
        reject: '拒绝审核之后, 这些记录将回到待发放列表, 需要重新提交审核, 是否继续?',
        clear: '请确认上述信息是否正确, 一旦确认, 将无法再继续编辑支票内容, 是否继续?'
      },
      set: {
        chequeNumber: '请输入支票号码',
        payment_date: '请选择发放时间'
      }
    }
  },
  audit: {
    search: '请输入搜索内容',
    detail: '审计列表',
    detail_title: '保单审计列表',
    doer: '操作者'
  },
  document: {
    company_file: '公司文档',
    internal_file: '内部文档',
    advertising: '推广',
    tooltip: {
      delete: '此操作将永久删除该文件, 是否继续?'
    },
    add_button: '添加文件夹',
    add_title: '添加文件夾',
    edit_title: '编辑文件',
    file_name: '文件名',
    upload_tips: '将文件拖到此处，或点击上传',
    upload_error: '请上传20M以下的文件',
    set: {
      file_name: '请输入文件名'
    }
  },
  sendEmail: {
    title: '发送邮件',
    button: '发送',
    to: '收件人',
    subject: '主题',
    content: '内容',
    attachment: '附件',
    select_attachment: '选择文件',
    select_template_title: '选择模板',
    template: '邮箱模板',
    placeholder: '占位符',
    send_success: '邮件已发送', // Message is sent
    set: {
      template: '请选择邮件模板'
    }
  }
}
