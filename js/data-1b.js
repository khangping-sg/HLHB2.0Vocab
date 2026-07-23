/* ============================================================
   华文小乐园 — Level 1B lesson data (Lessons 11–19)
   Source: teacher-provided 生字表 (我会认 / 我会写), 2026-07-22
   ============================================================ */

const LEVEL_1B = {
  id: "1B",
  label: "1B",
  fullLabel: "小一下 (1B)",
  lessons: [
    {
      no: 11, chinese: "十一", title: "校园生活 / 方位",
      words: [
        ["同学","tóngxué","classmate"],["朋友","péngyou","friend"],
        ["前后","qiánhòu","front and back"],["左右","zuǒyòu","left and right"],
        ["中间","zhōngjiān","middle"],["周末","zhōumò","weekend"],
        ["回家","huíjiā","go home"],["起立","qǐlì","stand up"],
        ["发生","fāshēng","to happen"],["高大","gāodà","tall and big"],
        ["直走","zhízǒu","go straight"]
      ],
      recognizeChars: ["甲","丁","前","后","左","右","中","间","边","同","学","朋","友","坐","高","发","直","起","回","周","末"],
      writeChars: ["后","面","左","右","中","间","的","同","学","回","画"],
      radicals: [
        { name:"口字框", form:"囗", examples:["回","周"] },
        { name:"工字旁", form:"工", examples:["左"] },
        { name:"口字旁", form:"口", examples:["同","高"] }
      ],
      strokeFocus: "横折钩、横撇",
      strokeRule: "先外后内再封口（如：回、周）"
    },
    {
      no: 12, chinese: "十二", title: "饮食 / 动物",
      words: [
        ["鸡蛋","jīdàn","egg"],["米饭","mǐfàn","cooked rice"],
        ["鸭子","yāzi","duck"],["饥饿","jī'è","hungry"],
        ["吃饱","chībǎo","eat until full"],["饼干","bǐnggān","biscuit"],
        ["小狗","xiǎogǒu","puppy"],["喜欢","xǐhuan","to like"],
        ["吃肉","chīròu","eat meat"],["唱歌","chànggē","sing a song"],
        ["青菜","qīngcài","green vegetables"],["汤面","tāngmiàn","noodle soup"],
        ["蛋卷","dànjuǎn","egg roll"]
      ],
      recognizeChars: ["鸡","饭","鸭","肉","元","饿","饱","饼","干","狗","喜","欢","猫","歌","唱","青","菜","汤","蛋","香"],
      writeChars: ["包","肉","半","虫","元","今","吃","米","干","豆"],
      radicals: [
        { name:"食字旁", form:"饣", examples:["饭","饿","饱"] },
        { name:"鸟字旁", form:"鸟", examples:["鸡","鸭"] },
        { name:"草字头", form:"艹", examples:["菜"] }
      ],
      strokeFocus: "竖折折钩",
      strokeRule: "从左到右（如：饭、饱）"
    },
    {
      no: 13, chinese: "十三", title: "卫生习惯 / 洗漱",
      words: [
        ["刷牙","shuāyá","brush teeth"],["毛巾","máojīn","towel"],
        ["洗脸","xǐliǎn","wash face"],["洗澡","xǐzǎo","take a bath"],
        ["冲凉","chōngliáng","take a shower"],["东西","dōngxi","things"],
        ["谢谢","xièxie","thank you"],["请先","qǐngxiān","please go first"],
        ["变化","biànhuà","change"]
      ],
      recognizeChars: ["用","刷","巾","抹","洗","要","脸","放","冲","凉","东","西","到","先","请","很","泡","变","谢"],
      writeChars: ["用","牙","巾","以","要","东","西","雨","马","先","点"],
      radicals: [
        { name:"三点水", form:"氵", examples:["洗","澡","冲","凉","泡"] },
        { name:"巾字旁", form:"巾", examples:["巾","布"] }
      ],
      strokeFocus: "竖钩、点",
      strokeRule: "从上到下（如：要）"
    },
    {
      no: 14, chinese: "十四", title: "穿着 / 动作",
      words: [
        ["袜子","wàzi","socks"],["皮鞋","píxié","leather shoes"],
        ["衣服","yīfu","clothes"],["被子","bèizi","quilt"],
        ["红色","hóngsè","red colour"],["动作","dòngzuò","action"],
        ["快","kuài","fast"],["收拾","shōushi","tidy up"],
        ["做事","zuòshì","do things"]
      ],
      recognizeChars: ["这","双","袜","那","皮","鞋","件","服","被","还","色","红","都","动","作","快","收","拾","穿","事","做"],
      writeChars: ["是","皮","衣","和","里","尺","还","自","己","好"],
      radicals: [
        { name:"衣字旁", form:"衤", examples:["袜","衫","被"] },
        { name:"革字旁", form:"革", examples:["鞋"] },
        { name:"走之底", form:"辶", examples:["这","还"] }
      ],
      strokeFocus: "捺",
      strokeRule: "先中间后两边 / 先里头后封口"
    },
    {
      no: 15, chinese: "十五", title: "味道 / 感受",
      words: [
        ["甜饼","tiánbǐng","sweet cookie"],["辛苦","xīnkǔ","toilsome"],
        ["臭味","chòuwèi","bad smell"],["生病","shēngbìng","fall ill"],
        ["重要","zhòngyào","important"],["喝水","hēshuǐ","drink water"],
        ["甘甜","gāntián","sweet"],["果汁","guǒzhī","fruit juice"],
        ["办法","bànfǎ","method"],["圆圈","yuánquān","circle"],
        ["亲切","qīnqiè","kind, friendly"],["怎么","zěnme","how"]
      ],
      recognizeChars: ["甜","苦","臭","生","重","喝","甘","汁","买","法","圆","切","怎","选","最","抱","拿","办"],
      writeChars: ["生","果","汁","买","斤","它","办","法","看"],
      radicals: [
        { name:"舌字旁", form:"舌", examples:["甜"] },
        { name:"口字旁", form:"口", examples:["喝","味"] },
        { name:"力字旁", form:"力", examples:["办","加"] }
      ],
      strokeFocus: "横折钩（办）",
      strokeRule: "先中间后两边（如：办、小）"
    },
    {
      no: 16, chinese: "十六", title: "家庭 / 家务",
      words: [
        ["打扫","dǎsǎo","sweep, clean"],["窗户","chuānghu","window"],
        ["桌子","zhuōzi","table"],["特别","tèbié","special"],
        ["兄弟","xiōngdì","brothers"],["房间","fángjiān","room"],
        ["干净","gānjìng","clean"],["叔叔","shūshu","uncle"],
        ["听话","tīnghuà","obedient"],["响声","xiǎngshēng","sound"]
      ],
      recognizeChars: ["扫","写","户","桌","完","特","兄","房","阿","叔","会","打","听","啊","声","进","净","谁"],
      writeChars: ["父","母","她","他","会","你","们","爸","妈","打"],
      radicals: [
        { name:"提手旁", form:"扌", examples:["扫","打"] },
        { name:"宝盖头", form:"宀", examples:["完","家","室"] },
        { name:"口字旁", form:"口", examples:["听","啊"] }
      ],
      strokeFocus: "竖弯钩",
      strokeRule: "从上到下（如：完、兄）"
    },
    {
      no: 17, chinese: "十七", title: "节日 / 庆祝",
      words: [
        ["昨晚","zuówǎn","last night"],["星星","xīngxing","stars"],
        ["明天","míngtiān","tomorrow"],["庆祝","qìngzhù","celebrate"],
        ["节目","jiémù","programme"],["爱护","àihù","cherish"],
        ["因为","yīnwèi","because"],["快乐","kuàilè","happy"],
        ["讲台","jiǎngtái","podium"],["故事","gùshi","story"],
        ["每当","měidāng","whenever"],["儿童","értóng","children"]
      ],
      recognizeChars: ["昨","晚","星","明","庆","祝","节","爱","给","因","为","乐","课","台","讲","故","每","童"],
      writeChars: ["昨","明","给","快","乐","没","有","这","老","师","每"],
      radicals: [
        { name:"日字旁", form:"日", examples:["昨","明","晚"] },
        { name:"示字旁", form:"礻", examples:["祝"] },
        { name:"心字底", form:"心", examples:["爱","思"] }
      ],
      strokeFocus: "卧钩",
      strokeRule: "先外后内（如：因）"
    },
    {
      no: 18, chinese: "十八", title: "动物 / 身体部位",
      words: [
        ["兔子","tùzi","rabbit"],["尾巴","wěiba","tail"],
        ["短期","duǎnqī","short-term"],["眼睛","yǎnjing","eyes"],
        ["皮带","pídài","belt"],["爪子","zhǎozi","claw, paw"],
        ["尖叫","jiānjiào","scream"],["动物","dòngwù","animal"],
        ["老虎","lǎohǔ","tiger"],["狮子","shīzi","lion"],
        ["园丁","yuándīng","gardener"],["孩子","háizi","child"]
      ],
      recognizeChars: ["兔","尾","短","眼","睛","爪","尖","物","虎","狮","园","期","带","黑","站","叫","认","话","再","孩"],
      writeChars: ["爪","尖","气","玩","我","弟","妹","站","叫","再"],
      radicals: [
        { name:"目字旁", form:"目", examples:["眼","睛"] },
        { name:"反犬旁", form:"犭", examples:["狮","物"] },
        { name:"口字旁", form:"口", examples:["叫","吐"] }
      ],
      strokeFocus: "撇",
      strokeRule: "从左到右（如：眼、睛）"
    },
    {
      no: 19, chinese: "十九", title: "游玩 / 场所",
      words: [
        ["组织","zǔzhī","organise"],["屋子","wūzi","room"],
        ["公共","gōnggòng","public"],["学校","xuéxiào","school"],
        ["广场","guǎngchǎng","square, plaza"],["商店","shāngdiàn","shop"],
        ["伙伴","huǒbàn","partner"],["楼梯","lóutī","stairs"],
        ["扶手","fúshǒu","handrail"],["高兴","gāoxìng","happy"],
        ["游戏","yóuxì","game"]
      ],
      recognizeChars: ["组","屋","球","公","步","校","场","习","商","店","伙","伴","梯","扶","游","拍","兴","戏"],
      writeChars: ["公","园","姐","哥","习","心","起","到","高","兴"],
      radicals: [
        { name:"绞丝旁", form:"纟", examples:["组"] },
        { name:"木字旁", form:"木", examples:["校","梯"] },
        { name:"单人旁", form:"亻", examples:["伙","伴"] }
      ],
      strokeFocus: "提",
      strokeRule: "先中间后两边（如：兴）"
    }
  ]
};

/* Master character dictionary: pinyin + English gloss for every
   character used above (recognizeChars ∪ writeChars) */
const CHAR_INFO = {
  "甲":["jiǎ","first; armour"], "丁":["dīng","a nail; (surname)"], "前":["qián","front"],
  "后":["hòu","back, behind"], "左":["zuǒ","left"], "右":["yòu","right"],
  "中":["zhōng","middle"], "间":["jiān","between; room"], "边":["biān","side"],
  "同":["tóng","same"], "学":["xué","study"], "朋":["péng","friend"], "友":["yǒu","friend"],
  "坐":["zuò","sit"], "高":["gāo","tall"], "发":["fā","send out; happen"], "直":["zhí","straight"],
  "起":["qǐ","to rise"], "回":["huí","return"], "周":["zhōu","week"], "末":["mò","end"],
  "面":["miàn","face; side"], "的":["de","(possessive particle)"], "画":["huà","draw; picture"],

  "鸡":["jī","chicken"], "饭":["fàn","cooked rice; meal"], "鸭":["yā","duck"], "肉":["ròu","meat"],
  "元":["yuán","dollar; origin"], "饿":["è","hungry"], "饱":["bǎo","full (after eating)"],
  "饼":["bǐng","cake, biscuit"], "干":["gān","dry"], "狗":["gǒu","dog"], "喜":["xǐ","happy; to like"],
  "欢":["huān","joyful"], "猫":["māo","cat"], "歌":["gē","song"], "唱":["chàng","to sing"],
  "青":["qīng","green/blue"], "菜":["cài","vegetable"], "汤":["tāng","soup"], "蛋":["dàn","egg"],
  "香":["xiāng","fragrant"], "包":["bāo","bun; to wrap"], "半":["bàn","half"], "虫":["chóng","insect"],
  "今":["jīn","now, today"], "吃":["chī","eat"], "米":["mǐ","rice"], "豆":["dòu","bean"],

  "用":["yòng","to use"], "刷":["shuā","brush"], "巾":["jīn","towel, cloth"], "抹":["mǒ","to wipe"],
  "洗":["xǐ","to wash"], "要":["yào","want, need"], "脸":["liǎn","face"], "放":["fàng","to put; release"],
  "冲":["chōng","to rinse"], "凉":["liáng","cool"], "东":["dōng","east"], "西":["xī","west"],
  "到":["dào","to arrive"], "先":["xiān","first"], "请":["qǐng","please"], "很":["hěn","very"],
  "泡":["pào","to soak; bubble"], "变":["biàn","to change"], "谢":["xiè","to thank"], "牙":["yá","tooth"],
  "以":["yǐ","by means of"], "雨":["yǔ","rain"], "马":["mǎ","horse"], "点":["diǎn","point; dot; o'clock"],

  "这":["zhè","this"], "双":["shuāng","pair"], "袜":["wà","socks"], "那":["nà","that"],
  "皮":["pí","skin, leather"], "鞋":["xié","shoe"], "件":["jiàn","item (measure word)"],
  "服":["fú","clothes"], "被":["bèi","quilt; (passive marker)"], "还":["hái","still, also"],
  "色":["sè","colour"], "红":["hóng","red"], "都":["dōu","all"], "动":["dòng","move"],
  "作":["zuò","to do, make"], "快":["kuài","fast"], "收":["shōu","receive, collect"],
  "拾":["shí","to pick up"], "穿":["chuān","to wear"], "事":["shì","matter, thing"],
  "做":["zuò","to do, make"], "是":["shì","to be"], "衣":["yī","clothes"], "和":["hé","and"],
  "里":["lǐ","inside"], "尺":["chǐ","ruler; foot (unit)"], "自":["zì","self"], "己":["jǐ","self"],
  "好":["hǎo","good"],

  "甜":["tián","sweet"], "苦":["kǔ","bitter"], "臭":["chòu","smelly"], "生":["shēng","raw; life"],
  "重":["zhòng","heavy; important"], "喝":["hē","to drink"], "甘":["gān","sweet; willing"],
  "汁":["zhī","juice"], "买":["mǎi","to buy"], "法":["fǎ","method, law"], "圆":["yuán","round"],
  "切":["qiè","to cut"], "怎":["zěn","how"], "选":["xuǎn","to choose"], "最":["zuì","most"],
  "抱":["bào","to hug"], "拿":["ná","to take, hold"], "办":["bàn","to do, handle"], "果":["guǒ","fruit"],
  "斤":["jīn","catty (unit of weight)"], "它":["tā","it"], "看":["kàn","to look, see"],

  "扫":["sǎo","to sweep"], "写":["xiě","to write"], "户":["hù","household; door"], "桌":["zhuō","table"],
  "完":["wán","to finish"], "特":["tè","special"], "兄":["xiōng","elder brother"], "房":["fáng","room, house"],
  "阿":["ā","(name prefix)"], "叔":["shū","uncle"], "会":["huì","can; meeting"], "打":["dǎ","to hit; to play"],
  "听":["tīng","to listen"], "啊":["a","(exclamation particle)"], "声":["shēng","sound"], "进":["jìn","to enter"],
  "净":["jìng","clean"], "谁":["shéi","who"], "父":["fù","father"], "母":["mǔ","mother"],
  "她":["tā","she"], "他":["tā","he"], "你":["nǐ","you"], "们":["men","(plural marker)"],
  "爸":["bà","dad"], "妈":["mā","mom"],

  "昨":["zuó","yesterday"], "晚":["wǎn","evening; late"], "星":["xīng","star"], "明":["míng","bright; next"],
  "庆":["qìng","to celebrate"], "祝":["zhù","to wish, bless"], "节":["jié","festival"], "爱":["ài","love"],
  "给":["gěi","to give"], "因":["yīn","because"], "为":["wèi","for, because"], "乐":["lè","happy"],
  "课":["kè","lesson"], "台":["tái","platform, stage"], "讲":["jiǎng","to speak"], "故":["gù","reason; old"],
  "每":["měi","every"], "童":["tóng","child"], "没":["méi","not have"], "有":["yǒu","to have"],
  "老":["lǎo","old"], "师":["shī","teacher"],

  "兔":["tù","rabbit"], "尾":["wěi","tail"], "短":["duǎn","short"], "眼":["yǎn","eye"],
  "睛":["jīng","eyeball"], "爪":["zhǎo","claw"], "尖":["jiān","sharp, pointed"], "物":["wù","thing"],
  "虎":["hǔ","tiger"], "狮":["shī","lion"], "园":["yuán","garden"], "期":["qī","period, date"],
  "带":["dài","to bring; belt"], "黑":["hēi","black"], "站":["zhàn","to stand; station"],
  "叫":["jiào","to call, shout"], "认":["rèn","to recognise"], "话":["huà","speech, words"],
  "再":["zài","again"], "孩":["hái","child"], "气":["qì","air, gas"], "玩":["wán","to play"],
  "我":["wǒ","I, me"], "弟":["dì","younger brother"], "妹":["mèi","younger sister"],

  "组":["zǔ","group"], "屋":["wū","room, house"], "球":["qiú","ball"], "公":["gōng","public"],
  "步":["bù","step"], "校":["xiào","school"], "场":["chǎng","field, venue"], "习":["xí","to practice"],
  "商":["shāng","commerce"], "店":["diàn","shop"], "伙":["huǒ","partner"], "伴":["bàn","companion"],
  "梯":["tī","ladder, stairs"], "扶":["fú","to support"], "游":["yóu","to swim; to tour"],
  "拍":["pāi","to pat, clap"], "兴":["xìng","interest, mood"], "戏":["xì","play, drama"],
  "姐":["jiě","elder sister"], "哥":["gē","elder brother"], "心":["xīn","heart"]
};
