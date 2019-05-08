export default {
  route: {
    home: 'Dashboard',
    product: 'Plan',
    company: 'Partner',
    productCommission: 'Plan Commission Rates',
    channelCommission: 'Channel Commission Rates',
    client: 'Client',
    insurancePolicy: 'Policy',
    clientInfo: 'Client Info',
    commission: 'Commissions',
    commissionCredit: 'Credit',
    paymentAudit: 'Payroll',
    cleared: 'Cleared',
    audit: 'Policy Timeline',
    document: 'Document',
    internalDocument: 'Private',
    companyDocument: 'Partner',
    system: 'System',
    user: 'User',
    role: 'Role'
  },
  common: {
    action: '',
    add: 'Add',
    delete: 'Delete',
    edit: 'Modify',
    view: 'View',
    export: 'Export',
    reset: 'Reset',
    success: 'Done!',
    prompt: 'Note',
    status: 'Status',
    confirmButton: 'OK',
    cancelButton: 'Cancel',
    submitButton: 'Submit',
    saveButton: 'Save',
    remarks: 'Remarks',
    remarks_placeholder: 'Remarks',
    year: '{0} year',
    after_i_year: '{0} onward',
    after_15_year: '15th onward',
    calculatedAmount: 'Calulated',
    amount: 'Credited',
    profit: 'profit',
    exchangeRate: 'Exchange Rate',
    commission_rate: 'Commission Rate',
    approve: 'Approve',
    reject: 'Reject',
    tooltip: {
      close: 'Are you sure you want to close the window?'
    },
    company_placeholder: 'Select or enter partner(s)'
  },
  navbar: {
    logOut: 'Logout',
    password: 'Change password',
    oldPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    password_tip: {
      oldPassword: 'Empty current password',
      newPassword: 'Empty new password',
      password_confirm: 'Empty confirmative new password',
      enter_password_again: 'Repeat your password',
      difference_password: 'Passwords not match!'
    },
    screenfull: 'Enter full screen',
    theme: 'Theme',
    size: 'Layouts',
    calendar: 'Renewal Calendar',
    credit: 'Pending Deposit',
    payment: 'Pending Payroll'
  },
  login: {
    title: '',
    logIn: 'Login',
    username: 'ID',
    password: 'Password'
  },
  home: {
    creditSum: 'Credited',
    pendingCreditSum: 'Pending Credit',
    pendingPaymentSum: 'Pending Payroll',
    policyCount: 'Policy Count',
    news: 'Latest',
    fileName: 'Filename',
    companyProfit: 'Profit',
    channelProfitTrend: '{0} Profit',
    month: 'Monthly',
    quarter: 'Quarterly',
    year: 'Annually',
    sale: 'Amount',
    comparison: 'Last Year',
    count: 'Policy Count',
    channelPerformanceTop: 'AFYP Top 5',
    channelPerformanceScale: 'AFYP Pie Chart'
  },
  product: {
    company: {
      search_company_placeholder: 'Search',
      levelTab: {
        level1: 'Insurance Company',
        level2: 'Agency'
      },
      table_header: {
        acronym: 'Acronym',
        name: 'Name',
        level: 'Category',
        creationDay: 'Creation Date',
        contractEffectiveDate: 'Effective Date',
        phone: 'Phone',
        email: 'Email',
        website: 'Website',
        address: 'Address',
        action: ''
      },
      set: {
        add_title: 'Add Partner',
        edit_title: 'Modify Partner',
        add_contact_title: 'Add Contacts',
        edit_contact_title: 'Modify Contacts',
        name_en: 'En Name',
        name_zh: 'Zh Name',
        acronym: 'Acronym',
        contractEffectiveDate: 'Efffective Date',
        secondary: 'Agency',
        phone: 'Phone',
        email: 'Email',
        website: 'Website',
        address: 'Address',
        contacts: 'Contacts',
        contacts_name: 'Name',
        contacts_title: 'Title',
        contacts_phone: 'Phone',
        contacts_email: 'Email',
        contacts_address: 'Address',
        verify_message: {
          name_en: 'Empty English Name',
          name_zh: 'Empty Chinese Name',
          acronym: 'Empty Acronym'
        }
      },
      tooltip: {
        delete: 'Are you sure you want to delete the partner?'
      }
    },
    commission: {
      commission_table_list: {
        no_commission_table: 'No data',
        status: 'Status',
        status_info: 'Draft',
        status_success: 'Published',
        status_warning: 'Modified',
        product_count: 'Plans included'
      },
      tooltip: {
        delete: 'Are you sure you want to delete the commission table?',
        export: 'Won\'t export unpublished content, continue?',
        download: 'It might take long time to export, continue?'
      },
      commission_table: {
        title: '{0} Commission Table',
        text: '{0} Commission Table',
        search_placeholder: 'Search',
        basic_tab: 'Basic Rates',
        override_tab: 'Overrides',
        overall_tab: 'Overall Rates',
        effectDateTitle: 'Effective Date',
        effectDate: 'Effective Date',
        override_setting: 'Override',
        publish_button: 'Publish',
        edit_status: {
          modifying: 'Editing...',
          saving: 'Saving...',
          latest_save: 'Last saved {0}'
        },
        col_header: {
          product_name: 'Plan',
          ENG_name: 'English Name',
          product_id: 'Acronym',
          period: 'Term',
          ffyap: 'FFYAP',
          year: '{0}',
          after_15_year: '15th on'
        }
      },
      view: {
        search: 'Search',
        basic_tab: 'Basic Rates',
        overall_tab: 'Overall Rates',
        table_header: {
          acronym: 'Acronym',
          name: 'Chinese Name',
          enName: 'English Name',
          period: 'Term'
        },
        title: '{0} Commission Table',
        year: '{0}',
        after_15_year: '15th on'
      },
      add: {
        title: 'Add Commission Table',
        company: 'Partner',
        template: 'Template',
        template_placeholder: 'Select a template or create a blank one',
        company_rule_message: 'Select a partner',
        generate_commission_rate: 'Include Rates'
      }
    },
    channel: {
      no_channel_policy: 'No data',
      reference_time_title: 'Select a Date',
      search_channel_placeholder: 'Search',
      table_header: {
        name: 'Name',
        account: 'Login',
        superior: 'Superior',
        create_time: 'Creation Date',
        effectiveDate: 'Effective Date',
        remarks: 'Remarks'
      },
      policy_button: 'Channel Policies',
      tooltip: {
        delete: 'Are you sure you want to delete the channel?',
        delete_channel_commission_table: 'Are you sure you want to delete the channel commission table?'
      },
      view: {
        search: 'Search',
        title: 'Preview Channel Commission Table',
        company: 'Co.',
        product: 'Plan'
      },
      set: {
        add_title: 'Add Channel',
        edit_title: 'Modify Channel',
        edit_commission_policy_title: 'Modify Channel Commission Policies',
        name: 'Partner/Plan',
        term: 'Term',
        save_dialog_title: 'Saving Channel Commission Policy',
        effectiveDate: 'Effective Date',
        remarks_placeholder: 'Remarks',
        tooltip: {
          close: 'About to close the window, continue?'
        },
        add_policy: {
          title: 'Add Channel Commission Policy',
          type: 'Type',
          all: 'Any',
          company: 'Partner',
          product: 'Plan',
          term: 'Term',
          userDefined: 'Customizable terms',
          type_placeholder: 'Policy type',
          company_placeholder: 'Select a partner',
          product_placeholder: 'Select a plan',
          term_placeholder: 'Set term',
          user_defined_placeholder: 'Set customizable number of terms',
          verify_message: {
            type: 'Empty type',
            term: 'Empty term',
            userDefined: 'Empty customizable terms',
            commission_rate: 'Empty rate',
            commission_rate_exceed: 'Rate MUST be between 0 and 100',
            commission_rate_is_number: 'Rate MUST be a valid decimal'
          }
        }
      }
    }
  },
  user: {
    name: 'Name',
    acronym: 'Acronym',
    account: 'Login',
    role: 'Role',
    effectiveDate: 'EffectiveDate',
    create_time: 'Creation Date',
    superior: 'Superior',
    tooltip: {
      delete: 'Are you sure you want to delete the account？',
      delete_superior: 'Are you sure you want to delete the channel superior？'
    },
    set: {
      add_channel_title: 'Add Channel',
      edit_channel_title: 'Modify Channel',
      add_channel_superior: 'Add Channel Superior',
      edit_channel_superior: 'Modify Channel Superior',
      add_title: 'Add User',
      edit_title: 'Modify User',
      name: 'Name',
      account: 'Login',
      acronym: 'Acronym',
      role: 'Select role(s)',
      effectiveDate: 'Select effectiveDate',
      superior: 'Select a superior',
      none_superior: 'None Superior',
      verify_message: {
        name: 'Empty name',
        account: 'Empty login'
      }
    }
  },
  role: {
    name: 'Name',
    create_time: 'Creation Date'
  },
  client: {
    info: {
      search: 'Search',
      name: 'Name',
      enName: 'EN Name',
      idNumber: 'ID Number',
      locale: 'Country/Region',
      sex: 'Gender',
      birthday: 'DOB',
      phone: 'Phone Number',
      email: 'Email',
      male: 'Male',
      female: 'Female',
      commonly_use_country: 'Frequently Used',
      all_country: 'All',
      tooltip: {
        delete: 'Are you sure you want to delete the client info?'
      },
      set: {
        add_title: 'Add Client Info',
        edit_title: 'Modify Client Info',
        name: 'Name',
        enName: 'English name',
        idNumber: 'ID number',
        locale: 'Country/Region',
        birthday: 'Date of birth',
        phone: 'Phone number',
        email: 'Email address'
      }
    },
    insurance_policy: {
      search: 'Search',
      date_filter: 'Filter by Issue Date',
      number: 'Number',
      submitDate: 'Submit Date',
      policyStatus: 'Status',
      applicant_name: 'Applicant',
      beneficiary_name: 'Insured',
      company_name: 'Partner',
      product_name: 'Plan',
      sn: 'S/N',
      currency: 'Currency',
      channel_name: 'Channel',
      agent_name: 'Agent',
      amountInsured: 'Amount Insured',
      premium: 'Premium',
      premiumPlan: 'Payment Plan',
      issueDate: 'Issue Date',
      channel: 'Channel',
      company: 'Co.',
      product: 'Plan',
      riderBenefits: 'Riders',
      riderBenefits_title: 'Riders',
      riderBenefits_product: 'Plan',
      riderBenefits_status: 'Status',
      detail_title: 'Details',
      renewal: 'Renew',
      renewed: 'Renewed',
      renewal_time: 'Renewal Date',
      renewal_title: 'Renewal Record',
      no_renewal_record: 'No data',
      term: 'Term',
      renewal_calendar: 'Renewal Calendar',
      tooltip: {
        delete: 'Are you sure you want to delete the insurance policy?',
        delete_riderBenefit: 'Are you sure you want to delete the rider?',
        delete_renew_record: 'Are you sure you want to delete the renewal record?',
        reset: 'Are you sure you want to reset the insurance policy? All associated credits, payroll will be regenerated.'
      },
      set: {
        add_riderBenefits_title: 'Add Rider',
        edit_riderBenefits_title: 'Modify Rider',
        add_title: 'Add Insurance Policy',
        edit_title: 'Modify Insurance Policy',
        channel_expense: 'Channel Expense',
        company_expense: 'Company Expense',
        expense_item: 'Expense Item',
        riderBenefits_status: 'Select a status',
        number: 'Insurance policy number',
        submitDate: 'Submit Date',
        policyStatus: 'Select a status',
        applicant_name: 'Select an applicant',
        beneficiary_name: 'Select an insured',
        currency: 'Select a currency',
        company_name: 'Select a partner',
        product_name: 'Enter to search a plan',
        sn: 'Serial number',
        channel_name: 'Select a channel',
        agent_name: 'Select an agent',
        amountInsured: 'Amount insured',
        premium: 'Premium',
        premiumPlan: 'Payment plan',
        issueDate: 'Issue date',
        term: 'Term'
      }
    }
  },
  commission: {
    credit: {
      search: 'Search',
      batchPay: 'Batch add to payroll',
      start: 'Start',
      end: 'Finish',
      switch_sort: 'Sort by...',
      count: '',
      year: 'Term',
      years: '{0}',
      calculatedAmountInHkd: 'HKD Equivalent',
      calculated_count: 'Number of Pending Credits',
      calculated_amount_total: 'Amount of Pending Credits',
      calculated_selected_count: 'Selected Number',
      calculated_selected_sum: 'Selected Amount',
      amount_count: 'Credited Number',
      amount_total: 'Credited Amount',
      amount_selected_count: 'Selected Number',
      amount_selected_sum: 'Selected Amount',
      cleared_count: 'Cleared Number',
      cleared_total: 'Cleared Amount',
      cleared_selected_count: 'Selected',
      cleared_selected_sum: 'Selected Amount',
      pay: 'Add to Payroll',
      rollback: 'Reject',
      tooltip: {
        batchPay: 'About to add to payroll in batch, continue?'
      },
      set: {
        edit_credit_title: 'Modify Amount Credited',
        audit_title: 'Approve Credit',
        exchangeRate: 'Empty exchange rate'
      }
    },
    payment: {
      search: 'Search',
      channel: 'Channel',
      calculatedTotalInHkd: 'Calculated Sum of Amount Due',
      predictedTotalInHkd: 'Sum of Amount Due',
      amountInHkd: 'Amount Paid',
      chequeNumber: 'Cheque Number',
      chequeCopy: 'Cheque Copy',
      chequeIssueDate: 'Issue Date',
      premiumInHkd: 'HKD Equivalent',
      calculatedAmountInHkd: 'Calculated Amount Due',
      predictedAmountInHkd: 'Amount Due',
      amount: 'Amount Paid',
      calculatedAmount: 'Amount Due',
      generated_commission: 'Amount Due',
      audit_commission: 'Approve Payroll',
      generated_list: 'Payroll Due',
      audit_list: 'Payroll Due',
      submit_audit: 'Submit',
      cleared_title: 'Clear',
      payment_detail: 'Payment Detail',
      tooltip: {
        audit: 'About to submit the payroll, continue?'
      },
      set: {
        chequeNumber: 'Empty cheque number'
      }
    }
  },
  audit: {
    search: 'Search',
    detail: 'Timeline',
    detail_title: 'Insurance Policy Timeline',
    doer: 'Doer'
  },
  document: {
    company_file: 'Partner',
    internal_file: 'Private',
    advertising: 'Promotion',
    tooltip: {
      delete: 'Are you sure you want to delete the file?'
    },
    add_button: 'Add Folter',
    add_title: 'Add Folder',
    edit_title: 'Rename',
    file_name: 'Filename',
    upload_tips: 'Drag and drop files here to click to upload',
    upload_error: 'File size MUST be below 20 MB',
    set: {
      file_name: 'Empty filename'
    }
  }
}
