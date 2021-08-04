export default {
  route: {
    home: '首頁',
    product: '產品',
    company: '合作機構',
    companyContact: '聯繫人列錶',
    productCommission: '產品傭金',
    productBasicCommission: '基础佣金',
    channelCommission: '渠道傭金',
    client: '客戶',
    insurancePolicy: '保單',
    riderBenefits: '副險列錶',
    policyFile: '保單文件',
    clientInfo: '客戶資料',
    commission: '傭金',
    commissionCredit: '到賬記錄',
    paymentAudit: '發放記錄',
    cleared: '已結清記錄',
    audit: '保單審計',
    document: '文檔',
    internalDocument: '內部文檔',
    companyDocument: '公司文檔',
    system: '係統',
    user: '用戶',
    role: '角色',
    template: '模闆',
    training: '培訓',
    course: '課程',
    broker: '經紀公司'
  },
  common: {
    action: '操作',
    add: '添加',
    delete: '刪除',
    edit: '修改',
    view: '查看',
    download: '下載',
    export: '導出',
    reset: '重置',
    success: '操作成功',
    prompt: '提示',
    status: '狀態',
    confirmButton: '確定',
    cancelButton: '取消',
    submitButton: '提交',
    returnButton: '返回',
    saveButton: '保存',
    remarks: '備註',
    remarks_placeholder: '請輸入備註',
    year: '第{0}年',
    after_i_year: '第{0}年之後',
    after_15_year: '15年以後',
    calculatedAmount: '應收',
    amount: '實收',
    profit: '收益',
    expenses: '支出',
    exchangeRate: '匯率',
    commission_rate: '傭金率',
    approve: '批準',
    reject: '拒絕',
    tooltip: {
      close: '是否需要關閉此窗口?'
    },
    password_verify: '身份認證',
    reset_password: '重置密碼',
    password_verify_text: '此操作需要驗證身份才能繼續進行',
    company_placeholder: '請選擇供應商',
    medium: '中號',
    small: '小號',
    mini: '極小',
    no_data: '暫無資料'
  },
  navbar: {
    logOut: '退出登錄',
    password: '修改密碼',
    oldPassword: '舊密碼',
    newPassword: '新密碼',
    confirmPassword: '密碼確認',
    password_tip: {
      oldPassword: '舊密碼必須填',
      password: '新密碼必須填',
      password_confirm: '密碼確認必須填',
      enter_password_again: '請再次輸入密碼',
      difference_password: '兩次輸入密碼不壹緻'
    },
    screenfull: '全屏',
    theme: '換膚',
    size: '佈局大小',
    calendar: '續保日歷',
    credit: '待收',
    payment: '待發'
  },
  login: {
    title: '係統登錄',
    logIn: '登錄',
    username: '賬號',
    password: '密碼',
    password_placeholder: '請輸入你的密碼'
  },
  home: {
    creditSum: '已到賬',
    paymentSum: '已發放',
    pendingCreditSum: '預計到賬',
    pendingPaymentSum: '預計發放',
    policyCount: '總簽單數',
    normalPolicyCount: '成單數',
    news: '最新動態',
    balance: '收支分佈',
    fileName: '文件名稱',
    companyProfit: '公司收益趨勢',
    channelProfitTrend: '{0} 渠道業績趨勢',
    channelProfit: '渠道業績趨勢',
    month: '月度',
    quarter: '季度',
    year: '年度',
    sale: '數額',
    comparison: '公司業績同比',
    count: '出單量',
    channelPerformanceTop: '渠道業績Top5',
    channelPerformanceScale: '渠道業績比例分佈'
  },
  product: {
    company: {
      search_company_placeholder: '搜索(公司縮寫|公司名)',
      levelTab: {
        level1: '一級',
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
        website: '係統地址',
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
        website: '係統地址',
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
        no_commission_table: '無傭金錶',
        status: '狀態',
        status_info: '未發佈',
        status_success: '已發佈',
        status_warning: '有改動',
        product_count: '產品數'
      },
      tooltip: {
        delete: '此操作將永久刪除該傭金錶, 是否繼續?',
        export: '導出的部分不包含未發佈的內容, 是否繼續導出?',
        download: '導出文件需要較多時間, 是否繼續導出?'
      },
      commission_table: {
        title: '{0} 傭金策略錶',
        text: '{0}傭金策略錶',
        search_placeholder: '請輸入搜索內容',
        basic_tab: '基礎傭金錶',
        override_tab: 'Override傭金錶',
        overall_tab: '總傭金錶',
        effectDateTitle: '設置傭金錶生效時間',
        effectDate: '生效時間',
        override_setting: '設置Override',
        row_above: '嚮上插入一行',
        row_below: '嚮下插入一行',
        remove_row: '移除整行',
        publish_button: '發佈',
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
        basic_tab: '基礎傭金錶',
        overall_tab: '總傭金錶',
        table_header: {
          acronym: '編號',
          name: '產品名稱(中文)',
          enName: '產品名稱(英文)',
          period: '年期'
        },
        title: '{0} 傭金錶',
        year: '第{0}年',
        after_15_year: '15年以後'
      },
      add: {
        title: '添加傭金錶',
        company: '供應商',
        broker: '經紀公司',
        template: '傭金模闆',
        template_placeholder: '請選擇傭金模闆(不選默認創建空白傭金錶)',
        broker_rule_message: '請選擇經紀公司',
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
      commission_policy_button: '傭金策略',
      tooltip: {
        delete: '此操作將永久刪除該渠道賬號, 是否繼續?',
        delete_channel_commission_table: '此操作將永久刪除該渠道傭金錶, 是否繼續?'
      },
      view: {
        search: '搜索 (供應商 | 產品)',
        title: '渠道傭金預覽',
        company: '供應商',
        product: '產品名稱',
        exclude_product: '排除產品',
        exclude_company: '排除供應商'
      },
      set: {
        add_title: '添加渠道傭金策略錶',
        edit_title: '編輯渠道傭金策略錶',
        edit_commission_policy_title: '編輯傭金策略',
        priority: '優先級',
        name: '供應商 / 產品',
        term: '年期',
        save_dialog_title: '渠道傭金生效時間 / 備註',
        effectiveDate: '生效時間',
        remarks_placeholder: '請輸入備註',
        tooltip: {
          close: '是否需要關閉次頁麵?'
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
    email: '電子郵箱',
    locked: '鎖定',
    tooltip: {
      delete: '此操作將永久刪除該賬號，是否繼續？',
      delete_superior: '此操作將永久刪除該渠道上級, 是否繼續?'
    },
    set: {
      add_channel_title: '創建渠道',
      edit_channel_title: '編輯渠道',
      add_channel_superior: '添加渠道上級',
      edit_channel_superior: '編輯渠道上級',
      add_title: '創建用戶',
      edit_title: '編輯用戶',
      name: '請輸入用戶名',
      account: '請輸入賬號',
      acronym: '請輸入縮寫',
      role: '請選擇賬戶角色',
      effectiveDate: '請輸入有效時間',
      superior: '請選擇賬戶上級',
      email: '請輸入電子郵箱',
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
  template: {
    title: '模闆名',
    subject: '主題',
    tooltip: {
      delete: '此操作將永久刪除該模闆, 是否繼續?'
    },
    set: {
      add_template: '添加模闆',
      edit_template: '編輯模闆'
    }
  },
  client: {
    info: {
      search: '搜索(客戶姓名 | 證件號)',
      type: '類型',
      individual: '個人',
      organization: '機構',
      name: '客戶名',
      enName: '英文名',
      idNumber: '證件號',
      locale: '國家/地區',
      sex: '性別',
      birthday: '出生日期',
      established_time: '成立時間',
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
        organization_id: '輸入商業登記證 或 公司註冊證明書號',
        idNumber: '請輸入證件號',
        locale: '請選擇國家/地區',
        birthday: '請選擇出生日期',
        established_time: '請選擇成立日期',
        phone: '請輸入電話號碼',
        email: '請輸入電子郵箱'
      }
    },
    insurance_policy: {
      search: '請輸入搜索內容',
      basic_info: '基礎信息',
      date_filter: '根據申請日期過濾',
      number: '保單號',
      submitDate: '申請日期',
      policyStatus: '保單狀態',
      applicant_name: '申請人',
      insured_name: '受保人',
      beneficiary_name: '受益人',
      relationship: '關係',
      percentage: '比例',
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
      premiumDate: '保費時間',
      channel: '渠道',
      company: '供應商',
      product: '產品',
      riderBenefits: '副險',
      riderBenefits_title: '副險列錶',
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
      renewal_notification: '續保提醒',
      email_notification: '郵件通知',
      policy_file: '保單文件',
      tooltip: {
        delete: '此操作將永久刪除該保單, 是否繼續?',
        delete_riderBenefit: '此操作將刪除該副險, 是否繼續?',
        delete_renew_record: '此操作將刪除該續費記錄, 是否繼續?',
        reset: '此操作將重置保單, 是否繼續?'
      },
      set: {
        add_riderBenefits_title: '添加副險',
        edit_riderBenefits_title: '編輯副險',
        insurance_policy_detail: '保單詳情',
        add_beneficiary: '添加受益人',
        add_title: '添加保單',
        edit_title: '編輯保單',
        channel_expense: '渠道支出',
        company_expense: '公司支出',
        expense_item: '支出項目',
        riderBenefits_status: '請選擇副險狀態',
        number: '請輸入保單號',
        submitDate: '選擇申請日期',
        premiumDate: '選擇保費時間',
        policyStatus: '請選擇保單狀態',
        applicant_name: '請選擇申請人',
        insured_name: '請選擇受保人',
        beneficiary_name: '請選擇受益人',
        percentage: '比例必須填',
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
      generated_list: '待發放列錶',
      audit_list: '待審核列錶',
      submit_audit: '提交審核',
      cleared_title: '結清傭金',
      payment_detail: '支付詳情',
      payment_date: '發放時間',
      check_detail: '支票詳情',
      tooltip: {
        audit: '此操作會將選中的渠道傭金記錄提交審核, 是否繼續?',
        approve: '審核通過之後, 將無法再修改發放金額, 是否繼續?',
        reject: '拒絕審核之後, 這些記錄將回到待發放列錶, 需要重新提交審核, 是否繼續?',
        clear: '請確認上述信息是否正確, 一旦確認, 將無法再繼續編輯支票內容, 是否繼續?'
      },
      set: {
        chequeNumber: '請輸入支票號碼',
        payment_date: '請選擇發放時間'
      }
    }
  },
  audit: {
    search: '請輸入搜索內容',
    detail: '審計列錶',
    detail_title: '保單審計列錶',
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
    upload_error: '請上傳100M以下的文件',
    set: {
      file_name: '請輸入文件名'
    }
  },
  sendEmail: {
    title: '發送郵件',
    button: '發送',
    to: '收件人',
    subject: '主題',
    content: '內容',
    attachment: '附件',
    select_attachment: '選擇文件',
    select_template_title: '選擇模闆',
    template: '郵箱模闆',
    placeholder: '佔位符',
    send_success: '郵件已發送', // Message is sent
    set: {
      template: '請選擇郵件模闆'
    }
  },
  course: {
    title: '課程名稱',
    quota: '可預約數量',
    coverImage: '封麵',
    attachments: '附件',
    description: '培訓地址',
    deadline: '培訓時間',
    type: '培訓類型',
    core: '核心分數',
    elective: '非核心分數',
    other: '其他分數',
    online: '線上',
    offline: '線下',
    set: {
      add_title: '創建課程',
      edit_title: '修改課程',
      title: '請輸入課程名稱',
      attachments: '請上傳課程附件',
      coverImage: '請上傳課程封麵',
      quota: '請輸入可預約數'
    },
    tooltip: {
      delete: '是否刪除該課程'
    }
  },
  broker: {
    name: '經紀公司',
    email: '郵箱',
    name_en: '經紀公司(英文)',
    name_zh: '經紀公司(中文)',
    set: {
      add_title: '創建經紀公司',
      edit_title: '修改經紀公司',
      name_en: '經紀公司(英文)',
      name_zh: '經紀公司(中文)',
      email: '請輸入郵箱',
    },
    verify_message: {
      name_en: '經紀公司名(英文)必須填',
      name_zh: '經紀公司名(中文)必須填',
      email: '電子郵箱必須填'
    },
    tooltip: {
      delete: '是否刪除該經紀公司'
    }
  }
}
