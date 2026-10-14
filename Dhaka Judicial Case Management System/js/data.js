const defaultJudges = [
  {
    id: "J1",
    nameEn: "Justice Salauddin Ahmmed",
    nameBn: "বিচারক সালাউদ্দিন আহাম্মেদ",
    court: "courtDistrict",
    room: "302",
    peshkarEn: "Mizanur Rahman",
    peshkarBn: "মিজানুর রহমান",
    email: "salauddin@dhaka-courts.gov.bd",
    status: "active"
  },
  {
    id: "J2",
    nameEn: "Justice Shamim Ara",
    nameBn: "বিচারক শামীম আরা",
    court: "courtDistrict",
    room: "305",
    peshkarEn: "Aminul Islam",
    peshkarBn: "আমিনুল ইসলাম",
    email: "shamimara@dhaka-courts.gov.bd",
    status: "active"
  },
  {
    id: "J3",
    nameEn: "Metropolitan Sessions Judge K. M. Imrul Kayes",
    nameBn: "মহানগর দায়রা জজ কে. এম. ইমরুল কায়েস",
    court: "courtMetropolitan",
    room: "501",
    peshkarEn: "Rashedul Islam",
    peshkarBn: "রাশেদুল ইসলাম",
    email: "sessions.dhaka@dhaka-courts.gov.bd",
    status: "active"
  },
  {
    id: "J4",
    nameEn: "Chief Metropolitan Magistrate Md. Rezaul Karim",
    nameBn: "মুখ্য মহানগর হাকিম মোঃ রেজাউল করিম",
    court: "courtCMM",
    room: "CMM-201",
    peshkarEn: "Harun-ur-Rashid",
    peshkarBn: "হারুন-অর-রশিদ",
    email: "cmm.dhaka@dhaka-courts.gov.bd",
    status: "active"
  },
  {
    id: "J5",
    nameEn: "Metropolitan Magistrate Begum Yasmin Ara",
    nameBn: "মহানগর হাকিম বেগম ইয়াসমিন আরা",
    court: "courtCMM",
    room: "CMM-304",
    peshkarEn: "Farhad Hossain",
    peshkarBn: "ফরহাদ হোসেন",
    email: "y.ara@dhaka-courts.gov.bd",
    status: "active"
  },
  {
    id: "J6",
    nameEn: "Chief Judicial Magistrate Shahadat Hossain",
    nameBn: "মুখ্য বিচারিক হাকিম শাহাদাত হোসেন",
    court: "courtCJM",
    room: "CJM-102",
    peshkarEn: "Rafiqul Islam",
    peshkarBn: "রফিকুল ইসলাম",
    email: "cjm.dhaka@dhaka-courts.gov.bd",
    status: "onLeave"
  }
];

const defaultCases = [
  {
    id: "case-01",
    caseNumber: "Title Suit No. 142/2024",
    court: "courtDistrict",
    category: "civil",
    complainantEn: "Md. Abdur Rahim",
    complainantBn: "মোঃ আব্দুর রহিম",
    accusedEn: "Government of Bangladesh & Others",
    accusedBn: "বাংলাদেশ সরকার এবং অন্যান্য",
    filingDate: "2024-04-12",
    nextHearingDate: "2026-08-11", // Set to today
    status: "underTrial",
    judgeId: "J1",
    lawyerPlaintiffEn: "Adv. Shah Alam",
    lawyerPlaintiffBn: "এডভোকেট শাহ আলম",
    lawyerDefendantEn: "Adv. Anisul Huq (GP)",
    lawyerDefendantBn: "এডভোকেট আনিসুল হক (জি.পি.)",
    detailsEn: "Land dispute regarding 10 decimals of commercial property in Tejgaon, Dhaka. Claiming declaration of title and permanent injunction.",
    detailsBn: "ঢাকার তেজগাঁওয়ে ১০ শতাংশ বাণিজ্যিক সম্পত্তির ভূমি বিরোধ সংক্রান্ত মামলা। স্বত্ত্ব ঘোষণা ও স্থায়ী নিষেধাজ্ঞার দাবি।",
    history: [
      { date: "2024-04-12", purposeEn: "Filing & Registration", purposeBn: "মামলা দায়ের ও নিবন্ধন", outcomeEn: "Admitted & Summons issued", outcomeBn: "গৃহীত এবং সমন জারি" },
      { date: "2024-07-15", purposeEn: "Defendant Appearance", purposeBn: "বিবাদীর হাজিরা", outcomeEn: "Written statement filed by Defendant", outcomeBn: "বিবাদী কর্তৃক লিখিত জবাব দাখিল" },
      { date: "2024-11-20", purposeEn: "Alternative Dispute Resolution", purposeBn: "বিকল্প বিরোধ নিষ্পত্তি", outcomeEn: "ADR failed, case proceeded", outcomeBn: "এডিআর ব্যর্থ, বিচার কার্যক্রম শুরু" },
      { date: "2025-03-10", purposeEn: "Issues Framing", purposeBn: "বিচার্য বিষয় গঠন", outcomeEn: "Issues framed, date fixed for witness", outcomeBn: "বিচার্য বিষয় গঠিত, সাক্ষীর তারিখ ধার্য" },
      { date: "2025-09-18", purposeEn: "Plaintiff's Evidence", purposeBn: "বাদীর সাক্ষ্যগ্রহণ", outcomeEn: "P.W. 1 examined, cross-examined", outcomeBn: "বাদী পক্ষের ১ম সাক্ষী পরীক্ষা ও জেরা সম্পন্ন" }
    ]
  },
  {
    id: "case-02",
    caseNumber: "C.R. Case No. 892/2025",
    court: "courtCMM",
    category: "criminal",
    complainantEn: "Standard Chartered Bank Ltd.",
    complainantBn: "স্ট্যান্ডার্ড চার্টার্ড ব্যাংক লিমিটেড",
    accusedEn: "Mr. Zahirul Islam Chowdhury",
    accusedBn: "জনাব জহিরুল ইসলাম চৌধুরী",
    filingDate: "2025-01-20",
    nextHearingDate: "2026-08-11", // Set to today
    status: "underTrial",
    judgeId: "J4",
    lawyerPlaintiffEn: "Adv. Barrister Tanjib-ul Alam",
    lawyerPlaintiffBn: "এডভোকেট ব্যারিস্টার তানজিব-উল আলম",
    lawyerDefendantEn: "Adv. Kamrul Islam",
    lawyerDefendantBn: "এডভোকেট কামরুল ইসলাম",
    detailsEn: "Cheque dishonor suit under section 138 of the Negotiable Instruments Act, 1881 for an amount of BDT 1,500,000.",
    detailsBn: "১৮৮১ সালের হস্তান্তরযোগ্য দলিল আইনের ১৩৮ ধারায় ১৫,০০,০০০ টাকার চেক প্রত্যাখ্যানের মামলা।",
    history: [
      { date: "2025-01-20", purposeEn: "Complaint Lodged", purposeBn: "অভিযোগ দায়ের", outcomeEn: "Cognizance taken, summons issued", outcomeBn: "আমলে নেওয়া হলো, সমন জারি" },
      { date: "2025-05-14", purposeEn: "Accused Bail Hearing", purposeBn: "আসামির জামিন শুনানি", outcomeEn: "Accused surrendered, granted bail", outcomeBn: "আসামি আত্মসমর্পণ করেছেন, জামিন মঞ্জুর" },
      { date: "2025-10-05", purposeEn: "Charge Framing", purposeBn: "অভিযোগ গঠন", outcomeEn: "Charge framed, accused pleaded not guilty", outcomeBn: "অভিযোগ গঠিত, আসামি নিজেকে নির্দোষ দাবি করেন" },
      { date: "2026-02-12", purposeEn: "Prosecution Witnesses", purposeBn: "বাদীপক্ষের সাক্ষী", outcomeEn: "PW-1 bank representative examined", outcomeBn: "১ম সাক্ষী (ব্যাংক প্রতিনিধি) পরীক্ষা সম্পন্ন" }
    ]
  },
  {
    id: "case-03",
    caseNumber: "Sessions Case No. 412/2023",
    court: "courtMetropolitan",
    category: "criminal",
    complainantEn: "State (Police Station: Gulshan)",
    complainantBn: "রাষ্ট্র (গুলশান থানা)",
    accusedEn: "Imtiaz Ahmad & Another",
    accusedBn: "ইমতিয়াজ আহমদ এবং অন্যান্য",
    filingDate: "2023-05-18",
    nextHearingDate: "2026-08-11", // Set to today
    status: "underTrial",
    judgeId: "J3",
    lawyerPlaintiffEn: "Adv. Abdullah Abu (PP)",
    lawyerPlaintiffBn: "এডভোকেট আব্দুল্লাহ আবু (পিপি)",
    lawyerDefendantEn: "Adv. Ehsanul Haque Shaji",
    lawyerDefendantBn: "এডভোকেট এহসানুল হক সমাজী",
    detailsEn: "Prosecution for murder under sections 302/34 of the Penal Code 1860. Incident occurred near Gulshan Lake.",
    detailsBn: "দণ্ডবিধি ১৮৬০-এর ৩০২/৩৪ ধারায় হত্যাকাণ্ড মামলা। গুলশান লেকের কাছে ঘটনাটি ঘটে।",
    history: [
      { date: "2023-05-18", purposeEn: "Charge Sheet Submission", purposeBn: "অভিযোগপত্র দাখিল", outcomeEn: "Case transferred to Metropolitan Sessions Court", outcomeBn: "মামলাটি মহানগর দায়রা জজ আদালতে স্থানান্তরিত" },
      { date: "2023-09-02", purposeEn: "Charge Hearing", purposeBn: "অভিযোগ শুনানি", outcomeEn: "Charges framed against both accused", outcomeBn: "উভয় আসামির বিরুদ্ধে অভিযোগ গঠন" },
      { date: "2024-02-14", purposeEn: "Prosecution Evidence", purposeBn: "বাদীপক্ষের সাক্ষ্যগ্রহণ", outcomeEn: "Doctor (PW-6) examined", outcomeBn: "চিকিৎসক (৬ষ্ঠ সাক্ষী) পরীক্ষা সম্পন্ন" },
      { date: "2025-06-11", purposeEn: "Investigating Officer (I.O.) Evidence", purposeBn: "তদন্ত কর্মকর্তার সাক্ষ্যগ্রহণ", outcomeEn: "I.O. (PW-12) examined and cross-examined", outcomeBn: "তদন্ত কর্মকর্তা (১২তম সাক্ষী) জেরা সম্পন্ন" }
    ]
  },
  {
    id: "case-04",
    caseNumber: "Writ Petition No. 7810/2024",
    court: "courtMetropolitan",
    category: "writ",
    complainantEn: "Human Rights and Peace for Bangladesh (HRPB)",
    complainantBn: "হিউম্যান রাইটস অ্যান্ড পিস ফর বাংলাদেশ (এইচআরপিবি)",
    accusedEn: "Secretary, Ministry of Environment & Others",
    accusedBn: "সচিব, পরিবেশ মন্ত্রণালয় এবং অন্যান্য",
    filingDate: "2024-09-01",
    nextHearingDate: "",
    status: "disposed",
    judgeId: "J3",
    lawyerPlaintiffEn: "Adv. Manzill Murshid",
    lawyerPlaintiffBn: "এডভোকেট মনজিল মোরশেদ",
    lawyerDefendantEn: "Adv. Attorney General for Bangladesh",
    lawyerDefendantBn: "এডভোকেট অ্যাটর্নি জেনারেল",
    detailsEn: "Public Interest Litigation (PIL) seeking directions to halt illegal encroachment and pollution of the Buriganga River.",
    detailsBn: "বুড়িগঙ্গা নদীর অবৈধ দখল ও দূষণ বন্ধে নির্দেশনা চেয়ে জনস্বার্থ মামলা (পিল)।",
    history: [
      { date: "2024-09-01", purposeEn: "Filing and Motion", purposeBn: "মামলা ও মোশন দায়ের", outcomeEn: "Rule Nisi issued, interim injunction granted", outcomeBn: "রুল জারি ও অন্তর্বর্তীকালীন নিষেধাজ্ঞা মঞ্জুর" },
      { date: "2025-01-10", purposeEn: "Compliance Report", purposeBn: "কমপ্লায়েন্স রিপোর্ট", outcomeEn: "Ministry submitted reports on brick kilns removal", outcomeBn: "ইটভাটা উচ্ছেদের বিষয়ে মন্ত্রণালয়ের প্রতিবেদন দাখিল" },
      { date: "2026-05-14", purposeEn: "Final Hearing", purposeBn: "চূড়ান্ত শুনানি", outcomeEn: "Rule made absolute with detailed structural guidelines", outcomeBn: "সুনির্দিষ্ট কাঠামোগত নির্দেশনাসহ রুল চূড়ান্ত ঘোষণা (নিষ্পত্তি)" }
    ]
  },
  {
    id: "case-05",
    caseNumber: "Family Suit No. 89/2025",
    court: "courtDistrict",
    category: "family",
    complainantEn: "Mrs. Nargis Akhter",
    complainantBn: "মিসেস নার্গিস আক্তার",
    accusedEn: "Md. Shoriful Islam",
    accusedBn: "মোঃ শরিফুল ইসলাম",
    filingDate: "2025-03-05",
    nextHearingDate: "2026-08-25",
    status: "underTrial",
    judgeId: "J2",
    lawyerPlaintiffEn: "Adv. Salma Ali",
    lawyerPlaintiffBn: "এডভোকেট সালমা আলী",
    lawyerDefendantEn: "Adv. Dewan Abu Obaida",
    lawyerDefendantBn: "এডভোকেট দেওয়ান আবু ওবায়দা",
    detailsEn: "Suit for dower money, past maintenance, and custody of two minor children.",
    detailsBn: "দেনমোহর, ভরণপোষণ এবং দুই নাবালক সন্তানের অভিভাবকত্ব চেয়ে মামলা।",
    history: [
      { date: "2025-03-05", purposeEn: "Filing", purposeBn: "মামলা দায়ের", outcomeEn: "Summons ordered", outcomeBn: "সমন জারির আদেশ" },
      { date: "2025-06-20", purposeEn: "Written Statement", purposeBn: "লিখিত জবাব", outcomeEn: "Defendant submitted response, mediation scheduled", outcomeBn: "বিবাদীর জবাব দাখিল, মধ্যস্থতার তারিখ নির্ধারিত" },
      { date: "2025-09-12", purposeEn: "Mediation Meeting", purposeBn: "মধ্যস্থতা সভা", outcomeEn: "Mediation unsuccessful, proceeding to trial", outcomeBn: "মধ্যস্থতা ব্যর্থ, বিচারে অগ্রগতি" }
    ]
  },
  {
    id: "case-06",
    caseNumber: "G.R. Case No. 1205/2025",
    court: "courtCMM",
    category: "criminal",
    complainantEn: "State (Police Station: Mirpur)",
    complainantBn: "রাষ্ট্র (মিরপুর থানা)",
    accusedEn: "Md. Rasel & Others",
    accusedBn: "মোঃ রাসেল এবং অন্যান্য",
    filingDate: "2025-06-11",
    nextHearingDate: "2026-08-11", // Set to today
    status: "pending",
    judgeId: "J5",
    lawyerPlaintiffEn: "Adv. Metropolitan APPO",
    lawyerPlaintiffBn: "এডভোকেট মহানগর এ.পি.পি.",
    lawyerDefendantEn: "Adv. Gazi MH Tamim",
    lawyerDefendantBn: "এডভোকেট গাজী এম এইচ তামিম",
    detailsEn: "Alleged theft and property damage charges under sections 379/427 of the Penal Code. Charge sheet is under investigation/review.",
    detailsBn: "দণ্ডবিধির ৩৭৯/৪২৭ ধারায় চুরির অভিযোগ এবং সম্পত্তির ক্ষতিসাধন। অভিযোগপত্র পর্যালোচনা ও তদন্তাধীন রয়েছে।",
    history: [
      { date: "2025-06-11", purposeEn: "First Information Report (FIR)", purposeBn: "এফআইআর/মামলা রুজু", outcomeEn: "Accused arrested and forwarded to court", outcomeBn: "আসামি গ্রেপ্তার এবং আদালতে প্রেরণ" },
      { date: "2025-06-15", purposeEn: "Bail Petition", purposeBn: "জামিনের আবেদন", outcomeEn: "Bail denied, accused sent to jail custody", outcomeBn: "জামিন নামঞ্জুর, আসামিকে কারাগারে প্রেরণ" }
    ]
  },
  {
    id: "case-07",
    caseNumber: "Artha Rin Suit No. 56/2023",
    court: "courtDistrict",
    category: "civil",
    complainantEn: "Sonali Bank PLC",
    complainantBn: "সোনালী ব্যাংক পিএলসি",
    accusedEn: "Messrs Bengal Traders & Its Proprietor",
    accusedBn: "মেসার্স বেঙ্গল ট্রেডার্স এবং এর মালিক",
    filingDate: "2023-01-15",
    nextHearingDate: "",
    status: "disposed",
    judgeId: "J1",
    lawyerPlaintiffEn: "Adv. Dr. Kazi Ershadul Alam",
    lawyerPlaintiffBn: "এডভোকেট ড. কাজী এরশাদুল আলম",
    lawyerDefendantEn: "Adv. AKM Fakhrul Islam",
    lawyerDefendantBn: "এডভোকেট এ.কে.এম. ফখরুল ইসলাম",
    detailsEn: "Loan recovery suit under the Artha Rin Adalat Ain, 2003. Total defaulted loan amount is BDT 45,000,000.",
    detailsBn: "অর্থঋণ আদালত আইন, ২০০৩-এর অধীনে ঋণ পুনরুদ্ধারের মামলা। খেলাপী ঋণের পরিমাণ ৪,৫০,০০,০০০ টাকা।",
    history: [
      { date: "2023-01-15", purposeEn: "Filing of Suit", purposeBn: "মামলা দায়ের", outcomeEn: "Summons issued in newspaper", outcomeBn: "পত্রিকায় সমন জারির আদেশ" },
      { date: "2023-07-20", purposeEn: "Hearing", purposeBn: "শুনানি", outcomeEn: "Defendant failed to appear, ex-parte order passed", outcomeBn: "বিবাদী অনুপস্থিত, একতরফা শুনানির আদেশ" },
      { date: "2024-03-05", purposeEn: "Judgment", purposeBn: "রায়", outcomeEn: "Decreed in favor of plaintiff, execution case filed", outcomeBn: "বাদীর পক্ষে ডিক্রি জারি, জারি মামলা রুজু (নিষ্পত্তি)" }
    ]
  },
  {
    id: "case-08",
    caseNumber: "C.R. Case No. 1045/2025",
    court: "courtCJM",
    category: "criminal",
    complainantEn: "Fatema Begum",
    complainantBn: "ফাতেমা বেগম",
    accusedEn: "Abdul Halim & 3 Others",
    accusedBn: "আব্দুল হালিম এবং ৩ জন",
    filingDate: "2025-05-30",
    nextHearingDate: "2026-09-02",
    status: "stayed",
    judgeId: "J6",
    lawyerPlaintiffEn: "Adv. Fahima Nasrin",
    lawyerPlaintiffBn: "এডভোকেট ফাহিমা নাসরিন",
    lawyerDefendantEn: "Adv. Abdur Rahman Rasel",
    lawyerDefendantBn: "এডভোকেট আব্দুর রহমান রাসেল",
    detailsEn: "Dowry Prohibition Act, 2018 suit alleging physical assault and demands of dowry of BDT 500,000.",
    detailsBn: "যৌতুক নিরোধ আইন, ২০১৮-এর অধীনে শারীরিক নির্যাতন ও ৫,০০,০০০ টাকা যৌতুকের দাবি সংক্রান্ত অভিযোগ।",
    history: [
      { date: "2025-05-30", purposeEn: "Complaint Filed", purposeBn: "অভিযোগ দায়ের", outcomeEn: "Judicial Inquiry ordered", outcomeBn: "বিচারিক তদন্তের নির্দেশ" },
      { date: "2025-09-10", purposeEn: "Inquiry Report Submission", purposeBn: "তদন্ত প্রতিবেদন দাখিল", outcomeEn: "Prima facie case established, warrant issued", outcomeBn: "প্রাথমিক সত্যতা প্রমাণিত, ওয়ারেন্ট জারি" },
      { date: "2026-01-18", purposeEn: "Stay Application", purposeBn: "স্থগিতাদেশ আবেদন", outcomeEn: "Proceedings stayed by High Court Division order", outcomeBn: "হাইকোর্ট বিভাগের আদেশে বিচার স্থগিত" }
    ]
  },
  {
    id: "case-09",
    caseNumber: "Criminal Misc. Case No. 9210/2026",
    court: "courtMetropolitan",
    category: "criminal",
    complainantEn: "The State",
    complainantBn: "রাষ্ট্র",
    accusedEn: "Sabbir Hossain",
    accusedBn: "সাব্বির হোসেন",
    filingDate: "2026-02-10",
    nextHearingDate: "2026-08-11", // Set to today
    status: "underTrial",
    judgeId: "J3",
    lawyerPlaintiffEn: "Adv. Rokon Uddin (PP)",
    lawyerPlaintiffBn: "এডভোকেট রোকন উদ্দিন (পিপি)",
    lawyerDefendantEn: "Adv. Shahdin Malik",
    lawyerDefendantBn: "এডভোকেট শাহদীন মালিক",
    detailsEn: "Narcotics Control Act, 2018 offense case. Accused arrested with illegal substances. Anticipatory and permanent bail petition arguments.",
    detailsBn: "মাদকদ্রব্য নিয়ন্ত্রণ আইন, ২০১৮-এর অধীন মামলা। অবৈধ মাদকসহ আসামি গ্রেপ্তার। স্থায়ী জামিন আবেদনের শুনানি।",
    history: [
      { date: "2026-02-10", purposeEn: "Case Transferred", purposeBn: "মামলা স্থানান্তর", outcomeEn: "Received for trial, bail extension petition", outcomeBn: "বিচারের জন্য গ্রহণ ও জামিন বৃদ্ধির আবেদন" },
      { date: "2026-05-02", purposeEn: "Evidence of Seizure Witness", purposeBn: "জব্দ তালিকার সাক্ষ্য", outcomeEn: "PW-1 and PW-2 cross-examined", outcomeBn: "১ম ও ২য় সাক্ষীর জেরা সম্পন্ন" }
    ]
  },
  {
    id: "case-10",
    caseNumber: "Title Suit No. 201/2025",
    court: "courtDistrict",
    category: "civil",
    complainantEn: "Alhaj Sheikh Mohammad Selim",
    complainantBn: "আলহাজ্ব শেখ মোহাম্মদ সেলিম",
    accusedEn: "Dhaka Improvement Trust (now RAJUK)",
    accusedBn: "ঢাকা ইমপ্রুভমেন্ট ট্রাস্ট (বর্তমানে রাজউক)",
    filingDate: "2025-07-02",
    nextHearingDate: "2026-09-12",
    status: "appealed",
    judgeId: "J2",
    lawyerPlaintiffEn: "Adv. AJ Mohammad Ali",
    lawyerPlaintiffBn: "এডভোকেট এ জে মোহাম্মদ আলী",
    lawyerDefendantEn: "Adv. RAJUK Panel Lawyer",
    lawyerDefendantBn: "এডভোকেট রাজউক প্যানেল ল-ইয়ার",
    detailsEn: "Suit challenging property acquisition notification and demanding compensation assessment at market value.",
    detailsBn: "সম্পত্তি অধিগ্রহণ নোটিশের চ্যালেঞ্জ ও বাজার মূল্যে ক্ষতিপূরণ নির্ধারণের দাবি।",
    history: [
      { date: "2025-07-02", purposeEn: "Filing and Application", purposeBn: "মামলা ও দরখাস্ত দায়ের", outcomeEn: "Admitted, temporary status-quo order", outcomeBn: "গৃহীত, অন্তর্বর্তীকালীন স্থিতিাবস্থা আদেশ" },
      { date: "2025-11-15", purposeEn: "W.S. Filing", purposeBn: "বিবাদী জবাব দাখিল", outcomeEn: "Written Statement received from RAJUK", outcomeBn: "রাজউক কর্তৃক লিখিত জবাব দাখিল" }
    ]
  }
];

// Database Management Class
class CaseDatabase {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem('dhaka_cases')) {
      localStorage.setItem('dhaka_cases', JSON.stringify(defaultCases));
    }
    if (!localStorage.getItem('dhaka_judges')) {
      localStorage.setItem('dhaka_judges', JSON.stringify(defaultJudges));
    }
  }

  getCases() {
    return JSON.parse(localStorage.getItem('dhaka_cases')) || [];
  }

  saveCases(cases) {
    localStorage.setItem('dhaka_cases', JSON.stringify(cases));
  }

  getJudges() {
    return JSON.parse(localStorage.getItem('dhaka_judges')) || [];
  }

  saveJudges(judges) {
    localStorage.setItem('dhaka_judges', JSON.stringify(judges));
  }

  getCaseById(id) {
    return this.getCases().find(c => c.id === id);
  }

  getJudgeById(id) {
    return this.getJudges().find(j => j.id === id);
  }

  addCase(newCase) {
    const cases = this.getCases();
    // Auto case ID
    const nextId = "case-" + String(cases.length + 1).padStart(2, '0');
    newCase.id = nextId;
    newCase.history = [{
      date: newCase.filingDate,
      purposeEn: "Case Filing & Initiation",
      purposeBn: "মামলা দায়ের ও প্রাথমিক পদক্ষেপ",
      outcomeEn: "Registered in system",
      outcomeBn: "সিস্টেমে নিবন্ধিত করা হলো"
    }];
    
    cases.push(newCase);
    this.saveCases(cases);
    
    // Update judge workload
    this.updateJudgeWorkload(newCase.judgeId);
    return newCase;
  }

  updateCase(updatedCase) {
    const cases = this.getCases();
    const index = cases.findIndex(c => c.id === updatedCase.id);
    if (index !== -1) {
      const oldJudgeId = cases[index].judgeId;
      cases[index] = updatedCase;
      this.saveCases(cases);
      
      // Update workload for both old and new judges
      if (oldJudgeId !== updatedCase.judgeId) {
        this.updateJudgeWorkload(oldJudgeId);
        this.updateJudgeWorkload(updatedCase.judgeId);
      }
      return true;
    }
    return false;
  }

  deleteCase(id) {
    let cases = this.getCases();
    const targetCase = cases.find(c => c.id === id);
    if (targetCase) {
      const judgeId = targetCase.judgeId;
      cases = cases.filter(c => c.id !== id);
      this.saveCases(cases);
      this.updateJudgeWorkload(judgeId);
      return true;
    }
    return false;
  }

  addHearing(caseId, date, purposeEn, purposeBn, outcomeEn, outcomeBn, nextHearingDate) {
    const cases = this.getCases();
    const cIndex = cases.findIndex(c => c.id === caseId);
    if (cIndex !== -1) {
      cases[cIndex].history.push({
        date,
        purposeEn,
        purposeBn,
        outcomeEn,
        outcomeBn
      });
      if (nextHearingDate) {
        cases[cIndex].nextHearingDate = nextHearingDate;
      }
      this.saveCases(cases);
      return true;
    }
    return false;
  }

  updateJudgeWorkload(judgeId) {
    if (!judgeId) return;
    const cases = this.getCases();
    const judges = this.getJudges();
    const activeCasesCount = cases.filter(c => c.judgeId === judgeId && c.status !== 'disposed').length;
    
    const jIndex = judges.findIndex(j => j.id === judgeId);
    if (jIndex !== -1) {
      judges[jIndex].workload = activeCasesCount;
      this.saveJudges(judges);
    }
  }

  getDashboardData() {
    const cases = this.getCases();
    const total = cases.length;
    const active = cases.filter(c => c.status !== 'disposed').length;
    const disposed = cases.filter(c => c.status === 'disposed').length;
    
    // Today's date (formatted as YYYY-MM-DD local time)
    const todayStr = "2026-08-11"; // Mocked to match current local time
    const todayHearings = cases.filter(c => c.nextHearingDate === todayStr).length;
    
    const backlogRate = total > 0 ? Math.round((active / total) * 100) : 0;
    
    // Group by courts
    const courtCounts = {
      courtDistrict: 0,
      courtMetropolitan: 0,
      courtCMM: 0,
      courtCJM: 0
    };
    cases.forEach(c => {
      if (courtCounts[c.court] !== undefined) {
        courtCounts[c.court]++;
      }
    });

    // Group by status
    const statusCounts = {
      pending: 0,
      underTrial: 0,
      disposed: 0,
      stayed: 0,
      appealed: 0
    };
    cases.forEach(c => {
      if (statusCounts[c.status] !== undefined) {
        statusCounts[c.status]++;
      }
    });

    return {
      total,
      active,
      disposed,
      todayHearings,
      backlogRate,
      courtCounts,
      statusCounts
    };
  }

  // Get cause list for a specific date and court
  getCauseList(dateStr, courtFilter = "all") {
    const cases = this.getCases();
    return cases.filter(c => {
      const matchDate = c.nextHearingDate === dateStr;
      const matchCourt = courtFilter === "all" || c.court === courtFilter;
      return matchDate && matchCourt;
    });
  }
}

// Instantiate database globally
window.db = new CaseDatabase();
