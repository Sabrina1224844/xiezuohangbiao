/* =====================================================
   写作航标 · 应用文模板库（融合版数据）
   -----------------------------------------------------
   主干：15 体裁版模板库结构（高考英语应用文模板库）
   融合：23 类体裁万能模板总表（提炼自陶然128题）的句子，
        重复或高度类似者已删除，各体裁独有句子已并入。
   23 版独有体裁（祝贺信 / 记叙文日记 / 议论文 / 图表作文）
   作为补充体裁追加在列表末尾，如不需要可直接删除对应对象。
   -----------------------------------------------------
   结构（数组式，便于手改）：
   open   开头句式   [英文, 中文提示]
   mid    中间句型组 [组名, [[英文, 中文], ...]]
   close  结尾句式   [英文, 中文提示]
   tips   写作要诀（可选）
   common 跨体裁万能句（见 TPL_COMMON）
   ===================================================== */

window.TPL_COMMON = [
  ['表达写信目的', [
    ["I'm writing to tell you / invite you / thank you / ask you ...", '我写信是为了……（全体裁第一句式）'],
    ["Knowing (that) you ..., I'm writing to ...", '得知你……，我写信来……（非谓语开头升级版）'],
    ['The purpose of my letter is to ...', '我写信的目的是……']
  ]],
  ['开头寒暄', [
    ['How is everything going? / How have you been (recently)?', '你最近怎么样？'],
    ['Nice / Glad to hear from you!', '很高兴收到你的来信'],
    ['Hope this letter / email finds you well.', '见信佳'],
    ["I'm glad / delighted to know / learn / hear that ...", '得知……我很高兴']
  ]],
  ['主体分层', [
    ['First(ly) / First of all → Besides / What\'s more / In addition / Moreover → Last but not least', '主体务必 2-3 层，每层一个要点'],
    ['One sentence, one message; use attributive clauses (which / where) and non-finite verbs (doing / done) to lengthen sentences.', '一句话一个信息，长句靠定语从句与非谓语撑起来']
  ]],
  ['列举理由', [
    ['First and foremost, ... Besides, ... Last but not least, ...', '三段式列举'],
    ['There are several reasons accounting for my choice.', '原因如下'],
    ['What makes it special is that ...', '……的特别之处在于']
  ]],
  ['请求与期望', [
    ['I would appreciate it if you could ...', '如果你能……我将不胜感激'],
    ['I would be grateful if you could do me a favor.', '若你能帮个忙，不胜感激'],
    ['Your early reply will be highly appreciated.', '如蒙早复，不胜感激']
  ]],
  ['礼貌收尾', [
    ['Thank you for your time and consideration.', '感谢您的时间与考虑'],
    ['I am looking forward to hearing from you soon.', '盼望早复'],
    ['Looking forward to your (early) reply.', '期待你的（早日）回复'],
    ['If you have any (further) questions, feel free to ask / let me know.', '有问题随时问我'],
    ['Best wishes (and have fun)!', '祝好']
  ]],
  ['衔接过渡', [
    ["What's more / Moreover / In addition, ...", '此外'],
    ['However / Nevertheless, ...', '然而'],
    ['As a result / Therefore, ...', '因此']
  ]],
  ['复合式写作（先礼后事）', [
    ['I am very delighted to receive your letter in which you ...', '复合式开场：引述来信'],
    ['First of all, I want to express my heartfelt gratitude for ...', '复合式第一功能（情感）先完成'],
    ['By the way, ...', '承上启下，转入第二功能'],
    ["Thank you very much again. Your earliest reply would be appreciated.", '再谢 + 盼复']
  ]]
];

window.TPL_GENRES = [

/* ================= ① 邀请信（15主干 + 23①） ================= */
{ id:'invite', name:'邀请信', en:'Invitation',
  scene:'邀请某人参加活动、讲座、聚会、比赛等',
  open:[
    ["I'm writing to invite you to take part in / attend ...", '我写信邀请你参加……（第一模板句）'],
    ['You must have heard of the upcoming Music Festival to be held in our school. Since you take much interest in music, I am writing to invite you to participate in it.', '悬念式开头：先提活动，再点对方兴趣，最后发出邀请（原句）'],
    ['I have some exciting news for you!', '悬念式（轻松口吻）'],
    ['On behalf of ..., I would like to invite you to ...', '代表……发出邀请（正式）'],
    ['It is a great honor for us to invite you to join us in ...', '十分荣幸邀请您……']
  ],
  mid:[
    ['活动信息（时间地点）', [
      ['It will be held in the library next Monday from 3:30 to 5:00 p.m.', '被动 + 时间 + 地点，一句写完（原句）'],
      ['It will start from ... and last for ...', '活动从……开始，为期……（必备句式）']
    ]],
    ['活动内容与主题', [
      ['The festival will provide various activities.', '活动内容（原句）'],
      ['The theme of the show is environmental protection.', '活动主题（原句）'],
      ['A wide range of activities will be organized, including ...', '丰富环节列举']
    ]],
    ['为何邀请对方', [
      ['I know you take good pictures and you\'ve always wanted to do something for environmental protection.', '扣对方特长 / 兴趣，显诚意（原句）'],
      ['We believe your presence will inspire all of us.', '强调对方重要性']
    ]],
    ['需要对方做什么', [
      ['You can send your photos to intlphotoshow@gmschool.com.', '投稿 / 回复 / 准备事项（原句）'],
      ['I have to remind you to wear comfortable shoes and bring a pair of gloves.', '温馨提示（户外类加分句，原句）']
    ]]
  ],
  close:[
    ["I'd be more than delighted if you could come and share this joyful moment with me.", '你再来的话我会非常高兴（原句）'],
    ['Would you like to come? / Could you come and give us some guidance?', '简短问句式邀请收尾（原句）'],
    ['We are looking forward to your coming / participation.', '期待你的到来（原句）'],
    ['If you are interested, please let me know.', '如有兴趣请告知（原句）'],
    ['Your presence will add color to our activity.', '你的到来将为活动增色']
  ],
  tips:['扣对方兴趣 / 特长发出邀请，比干巴巴的模板句更显诚意。'] },

/* ================= ② 建议信（15主干 + 23②） ================= */
{ id:'advice', name:'建议信', en:'Suggestions',
  scene:'对活动、学习、生活、改进等提建议',
  open:[
    ['I\'m sorry to know you are troubled by cellphone overuse. As a heavy cellphone user myself, I totally understand the stress you are feeling.', '先共情，再写信（建议信第一要务是情商，原句）'],
    ['It\'s great to know that you have begun to learn Chinese! You say you find Chinese difficult to learn.', '引述对方困难（原句）'],
    ['In response to your request, I am writing to offer my suggestions.', '正式版表目的（原句）'],
    ["I'm writing to offer (you) some suggestions on ...", '我写信就……提些建议（模板句）'],
    ["When it comes to ..., I cannot relate to you more.", '说到……，我太有同感了（共情开场）'],
    ['While I understand your intention behind this method, I believe it may cause some problems.', '委婉提不同意见（对老师 / 外教，原句）']
  ],
  mid:[
    ['给建议（可执行）', [
      ['I suggest (that) you (should) do ... / I suggest doing ...', '我建议你……'],
      ["You'd better do ... / It is wise / advisable to do ...", '你最好……'],
      ['Why not do ...? / It would be better if you could ...', '委婉建议备选'],
      ['You can arrange students with similar language levels together, or switch group members every two weeks.', '两条建议用 or 并列（原句）']
    ]],
    ['说明理由与效果', [
      ['In this way, students can benefit from diverse interactions.', '每条建议后跟效果（原句）'],
      ['Only in this way can you ...', '只有这样你才能……（倒装）'],
      ['It is of great benefit to ...', '这对……大有好处']
    ]],
    ['写作三步法', [
      ['(共情理解) → (指出具体问题) → (给出可执行建议)', '书中方法论：建议不空谈，每条配做法或理由']
    ]]
  ],
  close:[
    ['I hope these tips can be of some help, and that your life will get back to normal soon.', '希望建议有用 + 祝愿（原句）'],
    ['I wish you every success in learning the language!', '祝你成功（原句）'],
    ['If you have any further questions, feel free to ask. Good luck!', '交际兜底（原句）'],
    ['Thank you for considering my suggestions.', '（对上级 / 老师）感谢考虑（原句）'],
    ['I hope my suggestions can be of some help (to you).', '希望建议对你有帮助（模板句）']
  ],
  tips:['书中「三步法」：共情理解 → 指出具体问题 → 给出可执行建议。'] },

/* ================= ③ 推荐信（15主干 + 23③） ================= */
{ id:'recommend', name:'推荐信', en:'Recommendation',
  scene:'推荐人、书、电影、景点、产品等给第三方',
  open:[
    ["Knowing you want to see an exhibition about Chinese culture, I'd like to recommend one to you.", '知需求 → 给推荐（原句）'],
    ['I am writing to recommend ... to you.', '我写信向你推荐……（模板句）'],
    ['I am delighted to hear that you want to take a course about Chinese traditional culture. I am writing to recommend one on Beijing Opera.', '推荐课程（原句）'],
    ['I am writing to reply to your enquiry about a remarkable cultural city with a long history.', '推荐城市（原句）']
  ],
  mid:[
    ['对象基本信息', [
      ['The course, which lasts for two weeks, contains two sections.', '定语从句补充时长（原句）'],
      ['... , which lasts for ..., contains / covers ...', '（推荐课程 / 活动）为期……，内容包括……']
    ]],
    ['推荐理由（2-3 条）', [
      ['I think Chinese stamps would be a nice choice.', '观点句 + 原因展开（原句）'],
      ['The reason why I recommend it is that ...', '我推荐它的原因是……'],
      ['What impresses me most is that ...', '最打动我的是……'],
      ['It enjoys a high reputation for its ...', '它以……享有盛誉']
    ]],
    ['适合对方', [
      ['It would be a good chance for you to meet people from around the world.', '扣对方获益（原句）'],
      ['It is such a good choice that you can\'t miss it.', '不容错过'],
      ['Not only is it ..., but it also ...', '优点倒装并举']
    ]]
  ],
  close:[
    ['I hope my introduction is helpful. Please let me know if you have further questions.', '稳妥收尾（原句）'],
    ["You won't be disappointed, I promise!", '自信式收尾（原句）'],
    ['If you are into more details, feel free to contact me. Enjoy your trip!', '细节可再问（原句）'],
    ['I am sure you will enjoy it as much as I did.', '你一定会喜欢（15版）'],
    ['I hope my recommendation is helpful.', '希望推荐有用（模板句）']
  ],
  tips:[] },

/* ================= ④ 介绍类（15主干 + 23④⑤） ================= */
{ id:'intro', name:'介绍 / 自我介绍', en:'Introduction & Self-intro',
  scene:'介绍事物、活动、文化、人物，或在新环境结识、面试、竞选等介绍自己',
  open:[
    ["I'm very glad to know that you are interested in the changes in Beijing. Let me tell you some of the developments during the past few years.", '扣对方兴趣点（原句）'],
    ["In your email, you mentioned you wanted to know my greatest harvest in the past year, so now I'm very delighted to share it with you.", '回应来信问题（原句）'],
    ["I'm writing to share with you an ongoing creative culture competition.", '介绍活动（原句）'],
    ['Confucius, born in 551 BC, is one of China\'s most influential educators.', '写人：同位语 + 最高级，一句定位人物（原句）'],
    ['Of all the people I have encountered in my life, the person I admire most is my English teacher.', '写人：范围 + 最高级（原句）'],
    ['My name is Li Hua, a boy of eighteen, presently attending Beijing Hongxing Middle School.', '自我介绍：主干 + 插入语叠加（原句）']
  ],
  mid:[
    ['事物介绍逻辑链', [
      ['Located / Situated in ..., sth. offers ...', '坐落于……，提供 / 拥有……'],
      ["It's a second-floor south-facing apartment, 70 square meters in area.", '多形容词 + 插入语，一句多信息（原句）'],
      ['The Chinese characters on the piece are "天道酬勤", meaning "Hard work pays off."', '文化符号类：meaning... 作注释（原句）'],
      ['... , which makes it a special one.', '……，这使它很特别（定从收尾）']
    ]],
    ['人物介绍', [
      ['His teachings have a profound impact on Chinese society for over two thousand years.', '成就影响：have an impact on...（原句）'],
      ['She is the one who constantly encourages us to break barriers and to be extraordinary.', '品质事例：定从写人（原句）'],
      ['We owe all of our success to her.', '我们把成功归功于她（原句）']
    ]],
    ['自我介绍', [
      ['I am an outgoing and enthusiastic person who enjoys ...', '性格 + 爱好（定从）'],
      ['I have won several prizes in ..., which proves my ability.', '能力与获奖证明'],
      ['I am confident in promoting communication under diverse cultural backgrounds.', '竞选 / 申请中的自信表达（原句）']
    ]]
  ],
  close:[
    ['Just come and have a look yourself!', '亲自来看看吧（原句）'],
    ['I am looking forward to your visit. / Waiting for your coming!', '期待来访（原句）'],
    ['If you have any questions, please feel free to let me know.', '交际兜底（原句）'],
    ['Do write and tell me about it.', '邀请对方也分享（原句）'],
    ['I would like to express my deepest gratitude to her.', '写人收尾：表达感激（原句）']
  ],
  tips:['介绍必有逻辑链：从大到小、从内到外、从位置到环境。写人公式：身份定位 → 事迹 / 品质 → 对我的影响。'] },

/* ================= ⑤ 申请信（15主干 + 23⑧） ================= */
{ id:'apply', name:'申请信', en:'Application',
  scene:'申请职位、奖学金、活动名额、交换生 / 志愿者等',
  open:[
    ["I'm writing to apply for the position of ... / apply to become a volunteer for ...", '申请信第一模板句'],
    ["I'm Li Hua, presently a student of Senior 3. I'm writing to apply for working as an intern at your charitable foundation.", '身份 + 申请目的（原句）'],
    ['To whom it may concern, I have learned that English volunteer guides for the Forbidden City are wanted.', '信息来源式开头（原句）'],
    ['I read the announcement of the summer camp that you have posted on the Internet and I am interested in it.', '看到公告来申请（原句）'],
    ['Learning that you are recruiting ..., I would like to submit my application.', '得知招聘，提交申请']
  ],
  mid:[
    ['表明胜任', [
      ['I believe I am qualified for the position.', '总起句（原句）'],
      ['I have been on several exchange programmes in America, so I am confident with my communication skills in English.', '优势一：语言沟通（原句）'],
      ['As a fan of Chinese ancient history, I am sure my knowledge will prove helpful when I introduce the Forbidden City to foreign guests.', '优势二：知识储备（原句）'],
      ['I once worked as ..., which equipped me with relevant experience.', '优势三：相关经历']
    ]],
    ['性格与能力补充', [
      ['Being outgoing and responsible, I get along well with others.', '非谓语写性格'],
      ['As an active member of the Student Union, I am skilled at organizing activities.', '学生会经历背书']
    ]],
    ['承诺与期待', [
      ['If accepted, I will devote myself to the work and live up to your expectations.', '承诺式'],
      ['I am longing to join you and I would be grateful if you could offer me the opportunity.', '渴望 + 求机会（原句）']
    ]]
  ],
  close:[
    ['I would appreciate it if you could take my application into favorable consideration.', '恳请考虑（15版）'],
    ['Your prompt reply will be highly appreciated.', '盼速复（正式，原句）'],
    ['Thank you for your time and consideration. I look forward to your reply.', '申请信标配（原句）'],
    ['I would be grateful if you could give me an opportunity to prove myself.', '给个证明自己的机会']
  ],
  tips:['书中「个人优势」三板斧：语言能力 → 相关知识 → 实践 / 性格，每条优势配证据。'] },

/* ================= ⑥ 感谢信（15主干 + 23⑨） ================= */
{ id:'thanks', name:'感谢信', en:'Thank-you Letter',
  scene:'感谢帮助、款待、指导、礼物等',
  open:[
    ["I'm writing to express my (heartfelt) gratitude / thanks for ...", '感谢信第一模板句'],
    ["I'm writing to thank you for recommending Ms. Smith.", '点明谢什么（原句）'],
    ['On behalf of the class, I am writing these few lines to express our heartfelt gratitude to you for your instruction and inspiration in the past three years.', '代表集体 + 郑重感谢（毕业谢师，原句）'],
    ["When I look at those pictures, I just can't help thinking of you.", '睹物思人式（情感拉满，原句）'],
    ['Words fail me to convey my heartfelt thanks for ...', '言语难以表达谢意']
  ],
  mid:[
    ['回忆具体帮助', [
      ['It was your timely help that pulled me through the difficult time.', '强调句写帮助（15版）'],
      ['Without your generous assistance, I could not have ...', '虚拟语气：没有你就没有……'],
      ['Looking back on our high-school days, we just can\'t help thinking of you.', '回忆杀（原句）']
    ]],
    ['帮助的影响', [
      ['It is of great help to me, because I\'ve learned to overcome the bottleneck of my reading.', '谢要落到具体改变（原句）'],
      ['Your help not only ... but also restored my confidence.', '帮助 + 重建信心'],
      ['Thanks to you, I have learned that ...', '因你而学会……（感悟）']
    ]],
    ['表达回报', [
      ['I hope to do something in return to show my appreciation.', '希望回报（15版）'],
      ['I am looking forward to treating you to ...', '期待回请']
    ]]
  ],
  close:[
    ['Thanks again for what you have done for me.', '再次感谢（原句）'],
    ['May you be blessed in everything you do!', '愿你诸事顺遂（高分祝愿句，原句）'],
    ['We wish you joy and happiness in the new stage of life!', '人生新阶段祝愿（原句）'],
    ['On behalf of my class, I would like to thank you again for teaching us English!', '代表集体再谢（原句）'],
    ['Your help has made a great difference to me.', '你的帮助对我影响巨大（15版）']
  ],
  tips:['感谢信 = 感谢原因 + 具体细节 + 情感升华，切忌只写 Thanks 一句。'] },

/* ================= ⑦ 道歉信（15主干 + 23⑩） ================= */
{ id:'apology', name:'道歉信', en:'Apology Letter',
  scene:'因迟到、爽约、损坏物品、失误等致歉',
  open:[
    ["I'm (terribly) sorry that I can't ...", '道歉信第一模板句（熟人）'],
    ['I am writing with sincere regret to inform you that I am not able to make the trip to Beijing as scheduled.', '郑重致歉（正式，原句）'],
    ['I am writing to express my sincere apology to you for ...', '正式致歉（15版）'],
    ['I feel terribly sorry for not replying to your last email in time.', '为迟复致歉（原句）'],
    ['Please accept my deepest apology for ...', '请接受我最深的歉意']
  ],
  mid:[
    ['解释原因（客观简短，不找借口）', [
      ['My uncle will come to Beijing from America on Saturday afternoon.', '客观陈述（原句）'],
      ['The reason is that ... / It is a painful decision for me.', '解释原因（模板句）'],
      ['To my regret, something urgent occurred, leaving me no time to ...', '突发情况（非谓语收尾）']
    ]],
    ['补救方案（道歉信的灵魂）', [
      ['I have bought the latest CD of Jay Chou for you as a birthday present and I will give it to you on Monday.', '补偿行为（原句）'],
      ['To make up for my fault, I would like to ...', '弥补方案'],
      ['I promise to ... so as to avoid similar mistakes.', '保证不再犯']
    ]]
  ],
  close:[
    ['Sorry again for the inconvenience, and I am looking forward to your reply.', '再次致歉（原句）'],
    ['I wish you a happy birthday and hope everything will go well.', '祝愿对方活动照常圆满（原句）'],
    ['Shall we make it another time?', '另约时间（原句）'],
    ['I hope you can accept my apology and understand my situation.', '望理解（15版）']
  ],
  tips:['书中「道歉信的情商」：认错 → 原因 → 补救 → 再致意，语气诚恳不卑微。'] },

/* ================= ⑧ 投诉信（15主干 + 23⑫） ================= */
{ id:'complaint', name:'投诉信', en:'Complaint',
  scene:'对商品质量、服务、环境等提出投诉并要求解决',
  open:[
    ["I'm writing to express my disappointment / dissatisfaction about ...", '投诉信第一模板句'],
    ['I am writing this letter to express my deep disappointment for my shopping experience on your website, because your goods failed to live up to my expectations.', '失望 + 原因（书中模板首句）'],
    ['I feel obliged to express my dissatisfaction with ...', '不得不表达不满'],
    ['I regret to tell you that ... failed to meet my expectations.', '辜负期望']
  ],
  mid:[
    ['摆问题（事实 → 问题 → 后果）', [
      ['When I received the package today, it was clearly damaged due to unknown reasons, which resulted in several stained and unreadable books.', '时间 + 问题 + 后果，定从收尾（原句）'],
      ["What's worse, ... added to my disappointment.", '问题递进'],
      ['The ... was far from what was described.', '货不对板']
    ]],
    ['提诉求（明确、合理、可执行）', [
      ['I hope you can arrange a replacement and make sure it is carefully packed this time.', '要求换货 + 包装（原句）'],
      ['I strongly demand a full refund / a replacement.', '要求退款 / 换货'],
      ['It is your responsibility to guarantee the quality.', '强调责任']
    ]]
  ],
  close:[
    ['Also, I would appreciate a reply ASAP (as soon as possible).', '要求尽快答复（原句）'],
    ['I look forward to a satisfactory solution.', '期待满意解决方案'],
    ['I am looking forward to your prompt reply and proper solution.', '盼答复与解决（15版）'],
    ['Your early action to fix this will be highly appreciated.', '望尽早处理（15版）']
  ],
  tips:['投诉三件套：事实（订单 / 时间）→ 问题 → 诉求；语气坚定但克制。'] },

/* ================= ⑨ 咨询信（15主干 + 23⑥） ================= */
{ id:'inquiry', name:'咨询信', en:'Inquiry',
  scene:'询问课程、活动、商品、住宿、报名等信息',
  open:[
    ["I'm writing to ask if ... / consult you about ...", '写信咨询……（模板句）'],
    ['I am very interested in the summer camp for international students offered by your university.', '自我介绍 + 兴趣由来（对机构，原句）'],
    ["I'm writing to follow up the article that you kindly agreed to write last month.", '询问进度（原句）'],
    ["I'd like to know something about my arrangements.", '咨询安排（原句）'],
    ['I would appreciate it if you could provide some information about ...', '望提供信息（15版）']
  ],
  mid:[
    ['礼貌提问（问题清单 2-3 个）', [
      ['Could you (please) tell me ...? / I wonder if you could ...', '礼貌提问句'],
      ['Would it be possible for me to ...?', '我是否可能……？'],
      ['First, I would like to know whether ... Besides, I am concerned about ... Last but not least, I wonder if ...', '分层提问：每问一层']
    ]],
    ['说明背景（给对方戴高帽）', [
      ['We are currently preparing the contents for the upcoming issue, and your article is one of the highlights we are looking forward to.', '咨询背景 + 抬高对方（原句）'],
      ['I am a ... who plans to ...', '说明自身情况']
    ]]
  ],
  close:[
    ['Thank you for taking the time to read my email.', '感谢抽时间读信（原句）'],
    ['I would appreciate it a lot if you could give me an early reply.', '盼早复（咨询信标配，原句）'],
    ['For further information, you can log on to the school website.', '（答复类咨询）指引查询渠道（原句）'],
    ['Thank you in advance for your help.', '预先致谢（15版）']
  ],
  tips:['核心：问题清单 2-3 个，用间接疑问句显礼貌。'] },

/* ================= ⑩ 求助信（15主干 + 23⑦） ================= */
{ id:'help', name:'求助信', en:'Asking for Help',
  scene:'请求帮助、指导、解答、借物等',
  open:[
    ["I'm writing to ask for your help.", '求助信第一模板句'],
    ["I'm Li Hua from your English writing class last term. I'm writing to ask for your help.", '自报家门 + 直说求助（原句）'],
    ['Word came that our school is going to hold a class meeting related to Chinese traditional culture. I sincerely hope that you could offer me some advice.', '背景 + 求助（原句）'],
    ['Faced with ..., I have no choice but to turn to you.', '面对困难，只能求助（15版）']
  ],
  mid:[
    ['陈述困难', [
      ['Choosing the speech content is exactly the problem I am facing now.', '「这正是我目前遇到的问题」（原句，书中标注建议记忆）'],
      ['I find it difficult to ... / What troubles me most is ...', '我觉得……很难 / 最困扰我的是……'],
      ['Besides, I\'m a little worried about my English pronunciation.', '补充第二个困难（原句）']
    ]],
    ['具体所求 + 体谅对方', [
      ['Could you offer to give some professional advice? / Could you help me polish it?', '求助动作要具体：改稿 / 推荐 / 指导（原句）'],
      ["Given your busy schedule, I'd be very appreciative if you offer to give some advice.", '先体谅再提要求，显情商（原句）'],
      ['Any help from you would be a great relief to me.', '任何帮助都是解脱']
    ]]
  ],
  close:[
    ['I would be very grateful if you could offer me a hand. Looking forward to your reply.', '求助信标配收尾（原句）'],
    ['I will take your advice into consideration. I really appreciate your help.', '会认真考虑你的建议（原句）'],
    ['Thank you for your kindness!', '简短致谢（原句）'],
    ['I would be more than grateful if you could help me out.', '若能帮我走出困境，感激不尽（15版）']
  ],
  tips:[] },

// ───── 15主干体裁（续）─────
{ id:'notice', name:'通知/启事', en:'Notice & Announcement',
  scene:'活动通知、招募、会议、比赛等正式告知；含书面通知与口头通知两种',
  open:[
    ['Notice is hereby given that ... will be held.', '兹定于……举行……（书面通知）'],
    ['In order to enrich students\' school life, the Student Union is going to invite all the students to a film.', '目的状语开头（原句）'],
    ['A volunteer team will be organized to help the children of the migrant workers.', '被动句宣布事项（原句）'],
    ['Good afternoon, everyone! May I have your attention, please?', '口头通知开场（原句）'],
    ['Hello, everyone. I have something important to tell you.', '口头通知备选开场（原句）']
  ],
  mid:[
    ['活动安排（时间地点）', [
      ['The activity will take place in ... on ...', '活动将于何时何地举行'],
      ['The film will be shown in the lecture hall of the Art Building on July 15th, from 8 a.m. to 11 a.m.', '被动+地点+时间，一句写完（原句）'],
      ['The activity will start on July 15 and end on August 5.', '起止时间（原句）'],
      ['The schedule includes ..., ... and ....', '环节罗列']
    ]],
    ['参与与集合方式', [
      ['Anyone who wants to join should sign up at ... before ...', '报名方式与截止时间'],
      ['Those who are interested please sign up at the Student Union office before Friday.', '有意者请于周五前报名（定制）'],
      ['The school bus will pick you up at the school gate at 2 p.m.', '集合时间地点（原句）'],
      ['The purpose of this visit is to let the children there feel the American culture.', '点明活动目的（原句）']
    ]],
    ['注意事项', [
      ['Do remember to bring ... with you.', '务必携带……'],
      ['Please arrive 10 minutes earlier to avoid being late.', '提前到场'],
      ['Please remember to arrive on time and take your student ID.', 'please 祈使句写要求（定制）']
    ]]
  ],
  close:[
    ['Everybody is welcome. / All are welcome!', '通知万能收尾（原句）'],
    ['We are looking forward to your participation.', '期待参与（原句）'],
    ['Your active participation will be greatly appreciated.', '积极参与将不胜感激'],
    ['For more information, please contact us at ...', '附上联系方式'],
    ['That\'s all. Thank you for your attention.', '口头通知收尾（原句）'],
    ['Wish you a good time. See you then!', '口头通知祝愿式收尾（原句）']
  ],
  tips:['书面通知格式三件套：标题 Notice 居中 → 正文 → 右下角落款 Students\' Union + 日期，格式分不能丢。', '口头通知：May I have your attention 开场、That\'s all 收尾，语气亲切。'] },

{ id:'speech', name:'演讲稿/欢迎辞', en:'Speech & Welcome',
  scene:'升旗仪式、比赛、会议、毕业典礼等场合发言；含欢迎辞与竞选稿',
  open:[
    ['Good morning, everyone. It is a great honor to stand here to deliver a speech on ...', '演讲稿第一模板句'],
    ['Dear teachers and fellow students, I feel privileged to deliver a speech on ...', '正式版开场'],
    ['I feel greatly honored to have the chance to share my views on ...', '分享观点开场'],
    ['Good morning, dear judges. I am Candidate No. 1.', '竞选稿开场（原句）'],
    ['Ladies and gentlemen, welcome to ...!', '欢迎辞开场'],
    ['Good morning. It is a great pleasure to see all our friends from New Zealand gathering here.', '欢迎辞正式版（原句）']
  ],
  mid:[
    ['提出观点', [
      ['As we all know, ... plays a vital role in our life.', '道理式引入'],
      ['When it comes to ..., opinions vary from person to person.', '引出争议话题'],
      ['In my view, ... is of great significance.', '亮明观点'],
      ['Of the wide range of jobs around us, I will choose to be a teacher.', '范围中锁定主题（原句）']
    ]],
    ['论证与举例', [
      ['From my own experience, sport is an effective way to develop essential life skills.', '由事及理（原句）'],
      ['Only by ... can we ....', '倒装强调做法'],
      ['For example, ... shows the power of ....', '举例论证']
    ]],
    ['欢迎辞：介绍安排与互动', [
      ['Our school offers a wide variety of art programmes. The drama club is among the best.', '概括→具体（原句）'],
      ['You will get a chance to watch their shows. We are looking forward to appreciating your wonderful performance as well!', '主客互动是欢迎辞特色（原句）']
    ]],
    ['竞选稿：优势与决心', [
      ['I am confident in promoting communication under diverse cultural backgrounds.', 'be confident in doing（原句）'],
      ['It is high time that we took action to ....', '号召行动']
    ]]
  ],
  close:[
    ['That\'s all. Thank you for your listening / attention.', '演讲稿标配收尾'],
    ['I sincerely hope my words will inspire you to ....', '希望演讲带来改变'],
    ['Let\'s join hands and work together for ....', '携手共创'],
    ['Not only will I spare no efforts to learn my lessons, but I will also develop some qualities required to be a good teacher. Thank you!', '倒装表决心（原句）'],
    ['We hope you can enjoy the Art Festival as much as we do.', '欢迎辞祝愿（原句）'],
    ['Best wishes and have fun!', '欢迎辞收尾（原句）']
  ],
  tips:['演讲稿结构：开场点题 → 观点+论证 → 呼吁收尾；欢迎辞重主客互动；竞选稿重优势与决心。'] },

{ id:'contribute', name:'约稿/投稿', en:'Contribution',
  scene:'向他人约稿、发布征稿通知，或主动向刊物投稿',
  open:[
    ['I\'d like to ask you to write an article for our school\'s English newspaper.', '约稿第一模板句（原句）'],
    ['The "Foreign Cultures" section in our newspaper is very popular among us students.', '介绍栏目背景（原句）'],
    ['The English Salon of our school website is now welcoming all the students to share stories with the theme of "The Most Touching Story in My Life".', '征稿通知开头（原句）'],
    ['I am writing to submit my article titled ...', '投稿开场'],
    ['Hearing that your magazine is collecting essays on ..., I am sending mine.', '非谓语投稿开场']
  ],
  mid:[
    ['约稿：写清要求', [
      ['You are expected to write something about ... within 500 words.', '主题+字数要求'],
      ['All the contributions are expected to be submitted to esalon@qq.com before June 1.', '投稿方式与截稿日（原句）'],
      ['Your story will be a great inspiration for all the students.', '给作者价值感（原句）']
    ]],
    ['投稿：介绍稿件', [
      ['The article focuses on ..., aiming to ....', '稿件主题与目的'],
      ['In the writing, I share my personal experience of ....', '介绍内容'],
      ['Through this article, I intend to call on people to ....', '写作意图：发出号召']
    ]]
  ],
  close:[
    ['Could we have your article before June 28th? I\'m looking forward to hearing from you.', '问句式催稿+盼复（原句）'],
    ['Let\'s hear your diverse experiences and voices.', '征稿号召收尾（原句）'],
    ['I would be honored if my work could be published.', '投稿收尾'],
    ['Please let me know if any revision is needed.', '欢迎修改意见']
  ],
  tips:['分清方向：约稿=请别人写（主题/字数/截稿/邮箱一个不能少）；投稿=主动交稿（介绍内容+意图）。', 'with the theme of … 以……为主题，约稿征稿通用。'] },

{ id:'report', name:'新闻报道', en:'News Report',
  scene:'校园/社会活动、比赛、事件的客观报道',
  open:[
    ['A 5-kilometer race, which aimed to promote public awareness of physical fitness, was successfully held by the school students\' union last Sunday.', '导语万能句：何事+目的+何单位+何时（原句）'],
    ['In the spirit of less consumption, an activity named Earth Day Trade was conducted in the school gymnasium on April 22.', '理念+活动+地点+日期（原句）'],
    ['Yesterday witnessed an exciting ... that attracted wide attention.', '无灵主语导语'],
    ['It was reported that ... took place in ....', '据说体导语']
  ],
  mid:[
    ['交代背景与目的', [
      ['Aimed at ..., the activity drew the participation of ....', '非谓语开头+参与人数'],
      ['The event was designed to raise people\'s awareness of ....', '活动设计目的']
    ]],
    ['描述过程与场面', [
      ['About 150 competitors participated in the race, the majority of whom were students and teaching staff.', '数字+定从写参与情况（原句）'],
      ['During the activity, students took an active part in ....', '客观陈述过程'],
      ['The atmosphere was lively, with everyone ....', 'with 复合结构写场面'],
      ['A variety of ... were presented, which won warm applause.', '节目+反响']
    ]],
    ['点明意义', [
      ['Through this activity, the school aimed to raise students\' awareness of recycling.', 'raise awareness of（原句）'],
      ['The activity benefited us a great deal both mentally and physically.', '身心健康收获']
    ]]
  ],
  close:[
    ['Widely praised by all walks of life, the race turned out to be a great success.', '非谓语开头评价（原句）'],
    ['Not only does this event strengthen our body, but it also enriches our school life.', '倒装升华（原句）'],
    ['It is believed that such activities will be held on a regular basis.', '展望：常态化'],
    ['The activity was highly thought of by all the participants.', '好评收尾']
  ],
  tips:['报道=客观陈述，少用 I think（这是与日记的核心区别）。', '导语一句话包含：何事+目的+主办方+时间地点。'] },

{ id:'proposal', name:'倡议书', en:'Proposal',
  scene:'环保、公益、安全、文明等号召性倡议',
  open:[
    ['I am writing to call on everyone to ....', '倡议第一模板句'],
    ['We are calling on you to show your gratitude to our school in the last few days before graduation.', '发出号召（原句）'],
    ['When it comes to ocean, its pollution is becoming more and more serious. World Ocean Day, falling on June 8th, is aimed at raising awareness of ocean conservation.', '背景+由头（原句）'],
    ['Faced with ..., I propose that we should ....', '面对问题提出倡议']
  ],
  mid:[
    ['指出问题与意义', [
      ['Nowadays, ... has become a pressing issue.', '点出现状'],
      ['It is of great importance to ....', '强调意义'],
      ['If we do nothing, ... will worsen.', '反面警示']
    ]],
    ['提出具体倡议', [
      ['Here is something you can do.', '引出行动清单（原句）'],
      ['First, we are supposed to ....', '倡议1'],
      ['Second, it is advisable to ....', '倡议2'],
      ['Last but not least, do remind others to ....', '倡议3']
    ]]
  ],
  close:[
    ['Come and join us! Let the song of gratitude sung across the school.', '热情号召（原句）'],
    ['It is high time that we devoted ourselves to protecting the ocean. To protect the ocean is to protect ourselves.', '虚拟语气+对仗金句（原句）'],
    ['Let\'s take action now and make a difference together.', '行动号召'],
    ['Small steps by each of us can lead to a better world.', '积少成多金句']
  ],
  tips:['倡议结构：现状/背景 → 为什么重要 → 我们能做什么（2–3条具体行动）→ 号召。'] },

// ───── 23版独有补充体裁（陶然128题）─────
{ id:'congratulate', name:'祝贺信', en:'Congratulation',
  scene:'祝贺获奖、创刊周年、取得成绩、节日喜事等',
  open:[
    ['Congratulations on the 5th anniversary of Global Mirror!', '祝贺即点题（原句）'],
    ['I\'m so glad / delighted to hear the good news that ....', '喜闻好消息'],
    ['I\'m a regular reader of your newspaper.', '亮身份拉近距离（原句）']
  ],
  mid:[
    ['夸具体优点', [
      ['Equally attractive are the success stories of world-famous people, which help me understand how a person can work hard to make the world a better place.', '倒装夸法+定从（原句）'],
      ['What attracts / impresses me most is ....', '最吸引我的是……'],
      ['You deserve the success / honor.', '这份成功你当之无愧']
    ]],
    ['顺势提建议（可选）', [
      ['I suggest that Global Mirror carry articles to guide us in our English learning.', '祝贺信常复合建议（原句）']
    ]]
  ],
  close:[
    ['I hope that it will be better and better.', '越办越好（原句）'],
    ['I sincerely hope you will achieve greater success in the future.', '祝未来更成功（定制）']
  ],
  tips:['祝贺信 = 点明喜事 → 具体夸 → （顺势建议）→ 祝愿；夸得具体才显真诚。'] },

{ id:'narrative', name:'记叙文/日记', en:'Narrative & Diary',
  scene:'记述活动经历、成长故事；日记更私密随意，投稿需点题升华',
  open:[
    ['Today witnessed a rewarding activity—Tree Planting organized by the Student Union of our school.', '无灵主语 witnessed，高级感开头（原句）'],
    ['Early in the morning, my classmates and I headed for a hill nearby with tools and seedlings.', '时间状语+出发动作（原句）'],
    ['A few months ago, I decided to explore the world of coding.', '经历类开头（原句）']
  ],
  mid:[
    ['过程动作流', [
      ['Some dug the pits, some carried the seedlings ....', '排比写劳动场面（原句）'],
      ['Interested in various applications, I started an online programming course.', '非谓语带出心理（原句）']
    ]],
    ['感受穿插', [
      ['What impressed me most was ....', '印象最深的是……'],
      ['To my delight / surprise, ....', '让我高兴/惊讶的是……']
    ]]
  ],
  close:[
    ['Exhausted as we were, we tasted the joy of labor.', '让步倒装：虽累犹乐（原句）'],
    ['My journey of learning coding has taught me the power of perseverance, the importance of practice, and the joy of creative problem solving.', '三排比升华（原句）']
  ],
  tips:['日记更私密随意（第一人称+真情实感）；投稿面向读者，结尾要点题升华。'] },

{ id:'argument', name:'议论文', en:'Argumentation',
  scene:'名言感悟、现象评论、观点论证类作文',
  open:[
    ['As John Burroughs puts it, "A man can fail many times, but he isn\'t a failure until he begins to blame somebody else."', '名言引入式（原句）'],
    ['Many students with good grades develop and apply effective study habits.', '现象引入式（原句）']
  ],
  mid:[
    ['阐释观点', [
      ['In my opinion, this quote means we should take responsibility for our actions.', '阐释名言亮观点（原句）'],
      ['There is no doubt that ....', '毫无疑问……']
    ]],
    ['论证：观点→解释→例子→小结', [
      ['Take ... as an example. ....', '举例论证'],
      ['That is why we say "Study smarter, not harder."', '对仗式小结（原句模型）']
    ]]
  ],
  close:[
    ['It is never too late to develop great study habits.', '呼吁行动（原句）'],
    ['Acknowledging our inadequacy is the first step to improve it.', '动名词主语金句（原句）']
  ],
  tips:['论证链条：观点句 → 解释 → 例子 → 小结；名言类先释义再论证。'] },

{ id:'chart', name:'图表作文', en:'Chart / Graph',
  scene:'描述图表数据、分析原因、给出建议',
  open:[
    ['Nowadays, with the growing popularity of smartphones and computers, an increasing number of students are choosing to learn English beyond the classroom.', '背景+现象总起（原句）'],
    ['As is (clearly) shown in the chart, ....', '如图表所示'],
    ['It can easily be seen that the percentage of students who choose listening to English songs is ....', '数据总览（原句）']
  ],
  mid:[
    ['数据描写（挑最大值、最小值、对比值）', [
      ['The percentage / number of ... is ..., accounting for ...%.', '占比句式'],
      ['... rank(s) first, while ... comes last.', '排序对比'],
      ['an increasing number of ...', '越来越多的……']
    ]],
    ['原因分析（数据后必跟原因）', [
      ['Because of their lack of self-discipline, they\'re more easily addicted to chatting online.', '因果分析（原句）'],
      ['There are several reasons for this phenomenon. First, ....', '原因过渡句']
    ]]
  ],
  close:[
    ['It\'s urgent for students themselves to improve their self-discipline, and it\'s also urgent for parents and teachers to strengthen the guidance.', '建议式收尾：双方发力（原句）']
  ],
  tips:['结构：现象/数据总览 → 数据细节（挑代表性数值）→ 原因 → 建议。'] }
];
