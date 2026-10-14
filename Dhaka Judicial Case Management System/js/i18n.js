const i18n = {
  currentLanguage: localStorage.getItem('language') || 'en',
  
  translations: {
    en: {
      appName: "Dhaka Judicial Case Management",
      dashboard: "Dashboard",
      caseRegistry: "Case Registry",
      fileNewCase: "File New Case",
      causeList: "Daily Cause List",
      judgesDirectory: "Judges & Courtrooms",
      
      // KPIs
      totalCases: "Total Cases",
      activeCases: "Active Cases",
      disposedCases: "Disposed Cases",
      todayHearings: "Today's Hearings",
      backlogRate: "Backlog Rate",
      
      // Form & Labels
      caseNumber: "Case Number",
      courtName: "Court Name",
      judgeName: "Assigned Judge",
      complainant: "Complainant / Plaintiff",
      accused: "Accused / Defendant",
      caseCategory: "Case Category",
      caseType: "Case Type",
      filingDate: "Filing Date",
      nextHearingDate: "Next Hearing Date",
      status: "Case Status",
      details: "Case Description",
      lawyers: "Legal Representation",
      lawyerPlaintiff: "Plaintiff's Lawyer",
      lawyerDefendant: "Defendant's Lawyer",
      action: "Actions",
      save: "Save Case Record",
      cancel: "Cancel",
      
      // Select Options & Categories
      civil: "Civil",
      criminal: "Criminal",
      family: "Family",
      writ: "Writ",
      
      pending: "Pending / Investigation",
      underTrial: "Under Trial",
      disposed: "Disposed",
      stayed: "Stayed",
      appealed: "Appealed",
      
      courtDistrict: "District & Sessions Judge Court",
      courtMetropolitan: "Metropolitan Sessions Judge Court",
      courtCMM: "Chief Metropolitan Magistrate Court",
      courtCJM: "Chief Judicial Magistrate Court",
      
      // Actions/Buttons
      searchPlaceholder: "Search by case number, parties, or judge...",
      allCourts: "All Courts",
      allStatuses: "All Statuses",
      filterCategory: "All Categories",
      viewDetails: "View Details",
      editCase: "Edit Case",
      reschedule: "Reschedule",
      updateStatus: "Update Status",
      addHearing: "Add Hearing",
      backToList: "Back to List",
      successFiling: "New case filed successfully!",
      successUpdate: "Case record updated successfully!",
      
      // Cause List
      causeListTitle: "Daily Cause List (দৈনিক কার্যতালিকা)",
      selectDate: "Select Date",
      courtRoom: "Courtroom",
      serialNumber: "SL No.",
      purpose: "Hearing Purpose",
      outcome: "Hearing Outcome",
      adjourn: "Adjourn Case",
      markDisposed: "Dispose Case",
      
      // Timeline
      timeline: "Case Milestone Timeline",
      stageFiling: "Case Filed",
      stageSummons: "Summons Issued",
      stageAppearance: "Accused Appearance",
      stageFraming: "Charge Framing",
      stageEvidence: "Witness Examination",
      stageArguments: "Final Arguments",
      stageJudgment: "Judgment Delivered",
      
      // Directory
      courtroomWorkload: "Workload Status",
      activeHearings: "Active Hearings",
      assignedCases: "Assigned Cases",
      roomNo: "Room No.",
      benchAssistant: "Bench Assistant (Peshkar)",
      contact: "Contact Email",
      judgeStatus: "Judge Status",
      active: "Active",
      onLeave: "On Leave"
    },
    bn: {
      appName: "ঢাকা বিচারিক মামলা ব্যবস্থাপনা",
      dashboard: "ড্যাশবোর্ড",
      caseRegistry: "মামলা রেজিস্ট্রি",
      fileNewCase: "নতুন মামলা দায়ের",
      causeList: "দৈনিক কার্যতালিকা",
      judgesDirectory: "বিচারক ও এজলাস",
      
      // KPIs
      totalCases: "মোট মামলা",
      activeCases: "চলমান মামলা",
      disposedCases: "নিষ্পত্তিকৃত মামলা",
      todayHearings: "আজকের শুনানি",
      backlogRate: "মামলা জট হার",
      
      // Form & Labels
      caseNumber: "মামলা নম্বর",
      courtName: "আদালতের নাম",
      judgeName: "নিযুক্ত বিচারক",
      complainant: "বাদী / নালিশকারী",
      accused: "বিবাদী / আসামি",
      caseCategory: "মামলার শ্রেণী",
      caseType: "মামলার ধরন",
      filingDate: "দায়েরের তারিখ",
      nextHearingDate: "পরবর্তী শুনানির তারিখ",
      status: "মামলার অবস্থা",
      details: "মামলার বিবরণ",
      lawyers: "আইনজীবী বিবরণ",
      lawyerPlaintiff: "বাদীর আইনজীবী",
      lawyerDefendant: "বিবাদীর আইনজীবী",
      action: "পদক্ষেপ",
      save: "মামলা রেকর্ড সংরক্ষণ করুন",
      cancel: "বাতিল করুন",
      
      // Select Options & Categories
      civil: "দেওয়ানি",
      criminal: "ফৌজদারি",
      family: "পারিবারিক",
      writ: "রিট",
      
      pending: "তদন্তাধীন / প্রক্রিয়াধীন",
      underTrial: "বিচারাধীন",
      disposed: "নিষ্পত্তিকৃত",
      stayed: "স্থগিত",
      appealed: "আপিলকৃত",
      
      courtDistrict: "জেলা ও দায়রা জজ আদালত",
      courtMetropolitan: "মহানগর দায়রা জজ আদালত",
      courtCMM: "মুখ্য মহানগর হাকিম আদালত",
      courtCJM: "মুখ্য বিচারিক হাকিম আদালত",
      
      // Actions/Buttons
      searchPlaceholder: "মামলা নম্বর, পক্ষসমূহ অথবা বিচারক দিয়ে অনুসন্ধান...",
      allCourts: "সব আদালত",
      allStatuses: "সব অবস্থা",
      filterCategory: "সব শ্রেণী",
      viewDetails: "বিস্তারিত দেখুন",
      editCase: "মামলা সম্পাদন",
      reschedule: "পুনঃতফসিল",
      updateStatus: "অবস্থা আপডেট",
      addHearing: "শুনানি যোগ করুন",
      backToList: "তালিকায় ফিরুন",
      successFiling: "নতুন মামলা সফলভাবে দায়ের করা হয়েছে!",
      successUpdate: "মামলার রেকর্ড সফলভাবে আপডেট করা হয়েছে!",
      
      // Cause List
      causeListTitle: "দৈনিক কার্যতালিকা",
      selectDate: "তারিখ নির্বাচন",
      courtRoom: "এজলাস কক্ষ",
      serialNumber: "ক্রমিক নং",
      purpose: "শুনানির উদ্দেশ্য",
      outcome: "শুনানির ফলাফল",
      adjourn: "শুনানি স্থগিত",
      markDisposed: "মামলা নিষ্পত্তি",
      
      // Timeline
      timeline: "মামলার মাইলফলক ঘটনাপ্রবাহ",
      stageFiling: "মামলা দায়ের",
      stageSummons: "সমন জারি",
      stageAppearance: "আসামির হাজিরা",
      stageFraming: "অভিযোগ গঠন",
      stageEvidence: "সাক্ষী গ্রহণ",
      stageArguments: "চূড়ান্ত যুক্তিখণ্ডন",
      stageJudgment: "রায় ঘোষণা",
      
      // Directory
      courtroomWorkload: "কাজের চাপ",
      activeHearings: "চলতি শুনানি",
      assignedCases: "অর্পিত মামলা",
      roomNo: "কক্ষ নম্বর",
      benchAssistant: "বেঞ্চ সহকারী (পেশকার)",
      contact: "যোগাযোগ ইমেইল",
      judgeStatus: "বিচারকের অবস্থা",
      active: "কর্মরত",
      onLeave: "ছুটিতে"
    }
  },
  
  t(key) {
    return this.translations[this.currentLanguage][key] || key;
  },
  
  setLanguage(lang) {
    if (lang === 'en' || lang === 'bn') {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      this.translatePage();
      
      // Custom event to trigger re-rendering of pages/charts when language changes
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }
  },
  
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
  }
};

// Export to window object for availability in other modules
window.i18n = i18n;
