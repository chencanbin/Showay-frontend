export default {
  route: {
    home: '首頁',
    product: '產品',
    company: '合作機構',
    productCommission: '產品傭金',
    channelCommission: '渠道傭金',
    client: '客戶',
    insurancePolicy: '保單',
    clientInfo: '客戶資料',
    commission: '傭金',
    commissionCredit: '到賬記錄',
    paymentAudit: '發放記錄',
    cleared: '已結清記錄',
    audit: '保單審計',
    document: '文檔',
    internalDocument: '內部文檔',
    companyDocument: '公司文檔',
    system: '系統',
    user: '用戶',
    role: '角色'
  },
  common: {
    action: '操作',
    add: '添加',
    delete: '刪除',
    edit: '修改',
    view: '查看',
    export: '導出',
    reset: '重置',
    success: '操作成功',
    prompt: '提示',
    status: '狀態',
    confirmButton: '確定',
    cancelButton: '取消',
    submitButton: '提交',
    saveButton: '保存',
    remarks: '備註',
    remarks_placeholder: '請輸入備註',
    year: '第{0}年',
    after_i_year: '第{0}年之後',
    after_15_year: '15年以後',
    calculatedAmount: '應收',
    amount: '實收',
    profit: '收益',
    exchangeRate: '匯率',
    commission_rate: '傭金率',
    approve: '批準',
    reject: '拒絕',
    tooltip: {
      close: '是否需要關閉此窗口?'
    },
    company_placeholder: '請選擇供應商'
  },
  navbar: {
    logOut: '退出登錄',
    password: '修改密碼',
    oldPassword: '旧密码',
    newPassword: '新密码',
    confirmPassword: '密码确认',
    password_tip: {
      oldPassword: '舊密碼必須填',
      password: '新密碼必須填',
      password_confirm: '密碼確認必須填',
      enter_password_again: '請再次輸入密碼',
      difference_password: '兩次輸入密碼不壹致'
    },
    screenfull: '全屏',
    theme: '換膚',
    size: '布局大小',
    calendar: '續保日歷',
    credit: '待收',
    payment: '待發'
  },
  login: {
    title: '系統登錄',
    logIn: '登錄',
    username: '賬號',
    password: '密碼'
  },
  home: {
    creditSum: '已到賬',
    pendingCreditSum: '預計待收',
    pendingPaymentSum: '預計待發',
    policyCount: '總成單數',
    news: '最新動態',
    fileName: '文件名稱',
    companyProfit: '公司收益趨勢',
    channelProfitTrend: '{0} 收益趨勢',
    month: '按月統計',
    quarter: '按季統計',
    year: '按年統計',
    sale: '銷售額',
    comparison: '公司業績同比',
    count: '出單量',
    channelPerformanceTop: '渠道業績Top5',
    channelPerformanceScale: '渠道業績比例分布'
  },
  product: {
    company: {
      search_company_placeholder: '搜索(公司縮寫|公司名)',
      levelTab: {
        level1: '壹級',
        level2: '二級'
      },
      table_header: {
        acronym: '公司縮寫',
        name: '公司名',
        level: '級別',
        creationDay: '創建時間',
        contractEffectiveDate: '簽約時間',
        phone: '聯繫電話',
        email: '電子郵件',
        website: '系統地址',
        address: '聯繫地址',
        action: '操作'
      },
      set: {
        add_title: '添加公司',
        edit_title: '編輯公司',
        add_contact_title: '添加聯繫人',
        edit_contact_title: '編輯聯繫人',
        name_en: '公司名(英文)',
        name_zh: '公司名(中文)',
        acronym: '公司縮寫',
        contractEffectiveDate: '簽約時間',
        secondary: '二級供應商',
        phone: '聯繫電話',
        email: '電子郵件',
        website: '系統地址',
        address: '聯繫地址',
        contacts: '聯繫人',
        contacts_name: '姓名',
        contacts_title: '職位',
        contacts_phone: '電話',
        contacts_email: '電子郵件',
        contacts_address: '地址',
        verify_message: {
          name_en: '公司名(英文)必須填',
          name_zh: '公司名(中文)必須填',
          acronym: '公司縮寫必須填'
        }
      },
      tooltip: {
        delete: '此操作將永久刪除該供應商, 是否繼續?'
      }
    },
    commission: {
      commission_table_list: {
        no_commission_table: '無傭金表',
        status: '狀態',
        status_info: '未發布',
        status_success: '已發布',
        status_warning: '有改動',
        product_count: '產品數'
      },
      tooltip: {
        delete: '此操作將永久刪除該傭金表, 是否繼續?',
        export: '導出的部分不包含未發布的內容, 是否繼續導出?',
        download: '導出文件需要較多時間, 是否繼續導出?'
      },
      commission_table: {
        title: '{0} 傭金策略表',
        text: '{0}傭金策略表',
        search_placeholder: '請輸入搜索內容',
        basic_tab: '基礎傭金表',
        override_tab: 'Override傭金表',
        overall_tab: '總傭金表',
        effectDateTitle: '傭金生效時間',
        effectDate: '生效時間',
        override_setting: '設置Override',
        publish_button: '發布',
        edit_status: {
          modifying: '正在修改.....',
          saving: '正在保存.....',
          latest_save: '最近保存 {0}'
        },
        col_header: {
          product_name: '產品名稱',
          ENG_name: 'ENG name',
          product_id: '產品編號',
          period: '年期',
          ffyap: 'FFYAP',
          year: '第{0}年',
          after_15_year: '15年以後'
        }
      },
      view: {
        search: '搜索 (編號 | 中文 | 英文)',
        basic_tab: '基礎傭金表',
        overall_tab: '總傭金表',
        table_header: {
          acronym: '編號',
          name: '產品名稱(中文)',
          enName: '產品名稱(英文)',
          period: '年期'
        },
        title: '{0} 傭金表',
        year: '第{0}年',
        after_15_year: '15年以後'
      },
      add: {
        title: '添加傭金表',
        company: '供應商',
        template: '傭金模板',
        template_placeholder: '請選擇傭金模板(不選默認創建空白傭金表)',
        company_rule_message: '請選擇供應商',
        generate_commission_rate: '生成傭金率'
      }
    },
    channel: {
      no_channel_policy: '無渠道傭金策略',
      reference_time_title: '選擇參考時間',
      search_channel_placeholder: '搜索 (姓名 | 賬號)',
      table_header: {
        name: '用戶名',
        account: '賬號',
        superior: '上級',
        create_time: '創建時間',
        effectiveDate: '有效時間',
        remarks: '備註'
      },
      policy_button: '渠道策略',
      tooltip: {
        delete: '此操作將永久刪除該渠道賬號, 是否繼續?',
        delete_channel_commission_table: '此操作將永久刪除該渠道傭金表, 是否繼續?'
      },
      view: {
        search: '搜索 (供應商 | 產品)',
        title: '渠道傭金預覽',
        company: '供應商',
        product: '產品名稱'
      },
      set: {
        add_title: '添加渠道傭金策略表',
        edit_title: '編輯渠道傭金策略表',
        edit_commission_policy_title: '編輯傭金策略',
        name: '供應商 / 產品',
        term: '年期',
        save_dialog_title: '渠道傭金生效時間 / 備註',
        effectiveDate: '生效時間',
        remarks_placeholder: '請輸入備註',
        tooltip: {
          close: '是否需要關閉次頁面?'
        },
        add_policy: {
          title: '添加策略',
          type: '類型',
          all: '所有',
          company: '供應商',
          product: '產品',
          term: '年期',
          userDefined: '自定義年期',
          type_placeholder: '請選擇策略類型',
          company_placeholder: '請選擇公司',
          product_placeholder: '請選擇產品',
          term_placeholder: '請選擇年期',
          user_defined_placeholder: '請選擇自定義年期',
          verify_message: {
            type: '請選擇策略類型',
            term: '年期必須選',
            userDefined: '自定義年期必須選',
            commission_rate: '請輸入傭金率',
            commission_rate_exceed: '傭金率不能超過100',
            commission_rate_is_number: '傭金率必須為數字'
          }
        }
      }
    }
  },
  user: {
    name: '用戶名',
    acronym: '縮寫',
    account: '賬號',
    role: '權限',
    effectiveDate: '有效時間',
    create_time: '創建時間',
    superior: '上級',
    tooltip: {
      delete: '此操作將永久刪除該賬號，是否繼續？',
      delete_superior: '此操作將永久刪除該渠道上級, 是否繼續?'
    },
    set: {
      add_channel_title: '創建渠道',
      edit_channel_title: '編輯渠道',
      add_channel_superior: '添加渠道上级',
      edit_channel_superior: '编辑渠道上级',
      add_title: '創建用戶',
      edit_title: '編輯用戶',
      name: '請輸入用戶名',
      account: '請輸入賬號',
      acronym: '請輸入縮寫',
      role: '請選擇賬戶角色',
      effectiveDate: '請輸入有效時間',
      superior: '請選擇賬戶上級',
      none_superior: '無上級',
      verify_message: {
        name: '姓名必須填',
        account: '賬號必須填'
      }
    }
  },
  role: {
    name: '角色名',
    create_time: '創建時間'
  },

  client: {
    info: {
      search: '搜索(客戶姓名 | 證件號)',
      name: '客戶姓名',
      enName: '英文名',
      idNumber: '證件號',
      locale: '國家/地區',
      sex: '性別',
      birthday: '出生日期',
      phone: '電話號碼',
      email: '電子郵箱',
      male: '男',
      female: '女',
      commonly_use_country: '常用國家',
      all_country: '所有國家',
      tooltip: {
        delete: '此操作將永久刪除該客戶, 是否繼續?'
      },
      set: {
        add_title: '添加客戶資料',
        edit_title: '編輯客戶資料',
        name: '請輸入客戶姓名',
        enName: '請輸入英文名',
        idNumber: '請輸入證件號',
        locale: '請選擇國家/地區',
        birthday: '請選擇出生日期',
        phone: '請輸入電話號碼',
        email: '請輸入電子郵箱'
      }
    },
    insurance_policy: {
      search: '請輸入搜索內容',
      date_filter: '根據申請日期過濾',
      number: '保單號',
      submitDate: '申請日期',
      policyStatus: '保單狀態',
      applicant_name: '申請人',
      beneficiary_name: '受保人',
      company_name: '保險公司',
      product_name: '產品',
      sn: '內部編號',
      currency: '幣種',
      channel_name: '渠道',
      agent_name: '簽單員',
      amountInsured: '保額',
      premium: '保費',
      premiumPlan: '續費計劃',
      issueDate: '生效時間',
      channel: '渠道',
      company: '供應商',
      product: '產品',
      riderBenefits: '副險',
      riderBenefits_title: '副險列表',
      riderBenefits_product: '產品',
      riderBenefits_status: '副險狀態',
      detail_title: '保險詳情',
      renewal: '續保',
      renewed: '已續保',
      renewal_time: '續保時間',
      renewal_title: '續保記錄',
      no_renewal_record: '無續保記錄',
      term: '年期',
      renewal_calendar: '續保日歷',
      tooltip: {
        delete: '此操作將永久刪除該保單, 是否繼續?',
        delete_riderBenefit: '此操作將刪除該副險, 是否繼續?',
        delete_renew_record: '此操作將刪除該續費記錄, 是否繼續?',
        reset: '此操作將重置保單, 是否繼續?'
      },
      set: {
        add_riderBenefits_title: '添加副險',
        edit_riderBenefits_title: '編輯副險',
        add_title: '添加保單',
        edit_title: '編輯保單',
        channel_expense: '渠道支出',
        company_expense: '公司支出',
        expense_item: '支出项目',
        riderBenefits_status: '請選擇副險狀態',
        number: '請輸入保單號',
        submitDate: '選擇申請日期',
        policyStatus: '請選擇保單狀態',
        applicant_name: '請選擇申請人',
        beneficiary_name: '請選擇受保人',
        currency: '請選中幣種',
        company_name: '請選擇供應商',
        product_name: '請輸入產品名或產品編號',
        sn: '請輸入內部編號',
        channel_name: '請選擇渠道',
        agent_name: '請選擇簽單員',
        amountInsured: '請輸入保額',
        premium: '請輸入保費',
        premiumPlan: '請選擇續保計劃',
        issueDate: '選擇生效日期',
        term: '請選擇年期'
      }
    }
  },
  commission: {
    credit: {
      search: '搜索(保單號 | 投保人)',
      batchPay: '批量外發',
      start: '開始日期',
      end: '結束日期',
      switch_sort: '切換排序',
      count: '條',
      year: '期序',
      years: '第{0}期',
      calculatedAmountInHkd: '應收等額港幣',
      calculated_count: '預計待收總數',
      calculated_amount_total: '預計待收總額',
      calculated_selected_count: '已選預計待收總數',
      calculated_selected_sum: '已選預計待收總額',
      amount_count: '已到賬總數',
      amount_total: '已到賬總額',
      amount_selected_count: '已選已到賬總數',
      amount_selected_sum: '已選已到賬總額',
      cleared_count: '已結清總數',
      cleared_total: '已結清總額',
      cleared_selected_count: '已選已結清總數',
      cleared_selected_sum: '已選已結清總額',
      pay: '外發',
      rollback: '退回待發',
      tooltip: {
        batchPay: '是否批量處理已選中的記錄?'
      },
      set: {
        edit_credit_title: '編輯到賬記錄',
        audit_title: '到賬審核',
        exchangeRate: '請輸入匯率'
      }
    },
    payment: {
      search: '搜索',
      channel: '渠道',
      calculatedTotalInHkd: '預計應發總額',
      predictedTotalInHkd: '預計實發總額',
      amountInHkd: '實發總額',
      chequeNumber: '支票號碼',
      chequeCopy: '支票掃描件',
      chequeIssueDate: '簽發時間',
      premiumInHkd: '保費等額港幣',
      calculatedAmountInHkd: '預計應發',
      predictedAmountInHkd: '預計實發',
      amount: '應發',
      calculatedAmount: '預發',
      generated_commission: '待發放傭金',
      audit_commission: '待審核傭金',
      generated_list: '待發放列表',
      audit_list: '待審核列表',
      submit_audit: '提交審核',
      cleared_title: '結清傭金',
      payment_detail: '支付詳情',
      tooltip: {
        audit: '此操作會將選中的渠道傭金記錄提交審核, 是否繼續?'
      },
      set: {
        chequeNumber: '請輸入支票號碼'
      }
    }
  },
  audit: {
    search: '請輸入搜索內容',
    detail: '審計列表',
    detail_title: '保單審計列表',
    doer: '操作者'
  },
  document: {
    company_file: '公司文檔',
    internal_file: '內部文檔',
    advertising: '推廣',
    tooltip: {
      delete: '此操作將永久刪除該文件, 是否繼續?'
    },
    add_button: '添加文件夾',
    add_title: '添加文件夾',
    edit_title: '編輯文件',
    file_name: '文件名',
    upload_tips: '將文件拖到此處，或點擊上傳',
    upload_error: '請上傳20M以下的文件',
    set: {
      file_name: '請輸入文件名'
    }
  }
}
