(function () {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  const messages = document.getElementById('messages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const chatLang = document.getElementById('chatLanguage');
  const welcomeText = document.getElementById('welcomeText');

  const chatI18n = {
    en: { welcome: "Hello! I am MyStudyDost. Select your board, class, subject, and chat language, then ask for syllabus, chapters, or questions. You can ask in your preferred Indian language.", placeholder: "Type your question here...", typing: "Thinking...", demo: "Backend AI (RAG/Groq/SERP) is not connected yet. I understood your question. In the next step, you will get answers from real syllabus/books.", sourcePending: "Source: setup pending", sourceDemo: "Source: demo mode", syllabus: "Show the syllabus for this class and subject.", chapters: "List all chapters for this subject.", questions: "Give important questions for this chapter.", quiz: "Create a short quiz for this chapter." },
    hi: { welcome: "नमस्ते! मैं MyStudyDost हूँ। अपना बोर्ड, कक्षा, विषय और चैट भाषा चुनें, फिर पाठ्यक्रम, अध्याय या सवाल पूछें।", placeholder: "अपना सवाल यहाँ लिखें...", typing: "सोच रहा हूँ...", demo: "बैकएंड AI अभी जुड़ना बाकी है। मैंने आपका सवाल समझ लिया है। अगले चरण में असली पाठ्यक्रम/किताबों से जवाब मिलेगा।", sourcePending: "स्रोत: सेटअप बाकी है", sourceDemo: "स्रोत: डेमो मोड", syllabus: "इस कक्षा और विषय का पाठ्यक्रम बताइए।", chapters: "इस विषय के सभी अध्याय बताइए।", questions: "इस अध्याय के महत्वपूर्ण प्रश्न बताइए।", quiz: "इस अध्याय की एक छोटी क्विज़ बनाइए।" },
    bn: { welcome: "নমস্কার! আমি MyStudyDost। আপনার বোর্ড, শ্রেণি, বিষয় এবং চ্যাটের ভাষা নির্বাচন করুন, তারপর সিলেবাস, অধ্যায় বা প্রশ্ন জিজ্ঞাসা করুন।", placeholder: "এখানে আপনার প্রশ্ন লিখুন...", typing: "ভাবছি...", demo: "ব্যাকএন্ড AI এখনও সংযুক্ত নয়। আমি আপনার প্রশ্ন বুঝেছি। পরবর্তী ধাপে আসল সিলেবাস/বই থেকে উত্তর পাবেন।", sourcePending: "সূত্র: সেটআপ বাকি", sourceDemo: "সূত্র: ডেমো মোড", syllabus: "এই শ্রেণি ও বিষয়ের সিলেবাস দেখান।", chapters: "এই বিষয়ের সব অধ্যায়ের তালিকা দিন।", questions: "এই অধ্যায়ের গুরুত্বপূর্ণ প্রশ্ন দিন।", quiz: "এই অধ্যায়ের একটি ছোট কুইজ তৈরি করুন।" },
    te: { welcome: "నమస్తే! నేను MyStudyDost. మీ బోర్డు, తరగతి, విషయం మరియు చాట్ భాషను ఎంచుకుని, సిలబస్, అధ్యాయాలు లేదా ప్రశ్నలు అడగండి.", placeholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...", typing: "ఆలోచిస్తున్నాను...", demo: "బ్యాకెండ్ AI ఇంకా కనెక్ట్ కాలేదు. మీ ప్రశ్న నాకు అర్థమైంది. తదుపరి దశలో అసలు సిలబస్/పుస్తకాల నుండి సమాధానాలు వస్తాయి.", sourcePending: "మూలం: సెటప్ పెండింగ్", sourceDemo: "మూలం: డెమో మోడ్", syllabus: "ఈ తరగతి మరియు విషయానికి సిలబస్ చూపించండి.", chapters: "ఈ విషయంలోని అన్ని అధ్యాయాలను జాబితా చేయండి.", questions: "ఈ అధ్యాయానికి ముఖ్యమైన ప్రశ్నలు ఇవ్వండి.", quiz: "ఈ అధ్యాయానికి చిన్న క్విజ్ తయారు చేయండి." },
    mr: { welcome: "नमस्कार! मी MyStudyDost आहे. तुमचा बोर्ड, इयत्ता, विषय आणि चॅट भाषा निवडा, नंतर अभ्यासक्रम, धडे किंवा प्रश्न विचारा.", placeholder: "तुमचा प्रश्न येथे लिहा...", typing: "विचार करत आहे...", demo: "बॅकएंड AI अद्याप जोडलेले नाही. मला तुमचा प्रश्न समजला. पुढील टप्प्यात खऱ्या अभ्यासक्रम/पुस्तकांमधून उत्तरे मिळतील.", sourcePending: "स्रोत: सेटअप प्रलंबित", sourceDemo: "स्रोत: डेमो मोड", syllabus: "या इयत्ता आणि विषयाचा अभ्यासक्रम दाखवा.", chapters: "या विषयातील सर्व धडे सांगा.", questions: "या धड्याचे महत्त्वाचे प्रश्न द्या.", quiz: "या धड्यावर एक छोटी क्विझ तयार करा." },
    ta: { welcome: "வணக்கம்! நான் MyStudyDost. உங்கள் வாரியம், வகுப்பு, பாடம் மற்றும் அரட்டை மொழியைத் தேர்ந்தெடுத்து, பாடத்திட்டம், அத்தியாயங்கள் அல்லது கேள்விகள் கேளுங்கள்.", placeholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...", typing: "யோசிக்கிறேன்...", demo: "பின்தள AI இன்னும் இணைக்கப்படவில்லை. உங்கள் கேள்வி புரிந்தது. அடுத்த கட்டத்தில் உண்மையான பாடத்திட்டம்/புத்தகங்களிலிருந்து பதில்கள் கிடைக்கும்.", sourcePending: "ஆதாரம்: அமைப்பு நிலுவையில்", sourceDemo: "ஆதாரம்: டெமோ முறை", syllabus: "இந்த வகுப்பு மற்றும் பாடத்திற்கான பாடத்திட்டத்தை காட்டுங்கள்.", chapters: "இந்த பாடத்தின் அனைத்து அத்தியாயங்களையும் பட்டியலிடுங்கள்.", questions: "இந்த அத்தியாயத்தின் முக்கிய கேள்விகளை கொடுங்கள்.", quiz: "இந்த அத்தியாயத்திற்கு ஒரு சிறிய வினாடி வினா உருவாக்குங்கள்." },
    ur: { welcome: "السلام علیکم! میں MyStudyDost ہوں۔ اپنا بورڈ، جماعت، مضمون اور چیٹ کی زبان منتخب کریں، پھر نصاب، ابواب یا سوالات پوچھیں۔", placeholder: "اپنا سوال یہاں لکھیں...", typing: "سوچ رہا ہوں...", demo: "بیک اینڈ AI ابھی منسلک نہیں ہے۔ میں نے آپ کا سوال سمجھ لیا ہے۔ اگلے مرحلے میں اصل نصاب/کتابوں سے جواب ملے گا۔", sourcePending: "ماخذ: سیٹ اپ باقی ہے", sourceDemo: "ماخذ: ڈیمو موڈ", syllabus: "اس جماعت اور مضمون کا نصاب بتائیں۔", chapters: "اس مضمون کے تمام ابواب بتائیں۔", questions: "اس باب کے اہم سوالات بتائیں۔", quiz: "اس باب کا ایک مختصر کوئز بنائیں۔" },
    gu: { welcome: "નમસ્તે! હું MyStudyDost છું. તમારું બોર્ડ, વર્ગ, વિષય અને ચેટ ભાષા પસંદ કરો, પછી અભ્યાસક્રમ, પ્રકરણો અથવા પ્રશ્નો પૂછો.", placeholder: "તમારો પ્રશ્ન અહીં લખો...", typing: "વિચારી રહ્યો છું...", demo: "બેકએન્ડ AI હજી જોડાયેલ નથી. મેં તમારો પ્રશ્ન સમજ્યો. આગળના પગલે સાચા અભ્યાસક્રમ/પુસ્તકોથી જવાબ મળશે.", sourcePending: "સ્રોત: સેટઅપ બાકી", sourceDemo: "સ્રોત: ડેમો મોડ", syllabus: "આ વર્ગ અને વિષયનો અભ્યાસક્રમ બતાવો.", chapters: "આ વિષયના બધા પ્રકરણોની યાદી આપો.", questions: "આ પ્રકરણના મહત્વના પ્રશ્નો આપો.", quiz: "આ પ્રકરણ માટે એક નાની ક્વિઝ બનાવો." },
    kn: { welcome: "ನಮಸ್ಕಾರ! ನಾನು MyStudyDost. ನಿಮ್ಮ ಬೋರ್ಡ್, ತರಗತಿ, ವಿಷಯ ಮತ್ತು ಚಾಟ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಂತರ ಪಠ್ಯಕ್ರಮ, ಅಧ್ಯಾಯಗಳು ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.", placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...", typing: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...", demo: "ಬ್ಯಾಕೆಂಡ್ AI ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನನಗೆ ಅರ್ಥವಾಗಿದೆ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ ನಿಜವಾದ ಪಠ್ಯಕ್ರಮ/ಪುಸ್ತಕಗಳಿಂದ ಉತ್ತರಗಳು ಸಿಗುತ್ತವೆ.", sourcePending: "ಮೂಲ: ಸೆಟಪ್ ಬಾಕಿ", sourceDemo: "ಮೂಲ: ಡೆಮೋ ಮೋಡ್", syllabus: "ಈ ತರಗತಿ ಮತ್ತು ವಿಷಯದ ಪಠ್ಯಕ್ರಮವನ್ನು ತೋರಿಸಿ.", chapters: "ಈ ವಿಷಯದ ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳನ್ನು ಪಟ್ಟಿಮಾಡಿ.", questions: "ಈ ಅಧ್ಯಾಯದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ನೀಡಿ.", quiz: "ಈ ಅಧ್ಯಾಯಕ್ಕೆ ಒಂದು ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ ರಚಿಸಿ." },
    ml: { welcome: "നമസ്കാരം! ഞാൻ MyStudyDost ആണ്. നിങ്ങളുടെ ബോർഡ്, ക്ലാസ്, വിഷയം, ചാറ്റ് ഭാഷ എന്നിവ തിരഞ്ഞെടുത്ത് സിലബസ്, അധ്യായങ്ങൾ അല്ലെങ്കിൽ ചോദ്യങ്ങൾ ചോദിക്കുക.", placeholder: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...", typing: "ചിന്തിക്കുന്നു...", demo: "ബാക്കെൻഡ് AI ഇതുവരെ ബന്ധിപ്പിച്ചിട്ടില്ല. നിങ്ങളുടെ ചോദ്യം ഞാൻ മനസ്സിലാക്കി. അടുത്ത ഘട്ടത്തിൽ യഥാർത്ഥ സിലബസ്/പുസ്തകങ്ങളിൽ നിന്ന് ഉത്തരങ്ങൾ ലഭിക്കും.", sourcePending: "ഉറവിടം: സജ്ജീകരണം ബാക്കി", sourceDemo: "ഉറവിടം: ഡെമോ മോഡ്", syllabus: "ഈ ക്ലാസിന്റെയും വിഷയത്തിന്റെയും സിലബസ് കാണിക്കുക.", chapters: "ഈ വിഷയത്തിലെ എല്ലാ അധ്യായങ്ങളും പട്ടികപ്പെടുത്തുക.", questions: "ഈ അധ്യായത്തിലെ പ്രധാന ചോദ്യങ്ങൾ നൽകുക.", quiz: "ഈ അധ്യായത്തിന് ഒരു ചെറിയ ക്വിസ് തയ്യാറാക്കുക." },
    or: { welcome: "ନମସ୍କାର! ମୁଁ MyStudyDost। ଆପଣଙ୍କ ବୋର୍ଡ, ଶ୍ରେଣୀ, ବିଷୟ ଏବଂ ଚାଟ୍ ଭାଷା ବାଛନ୍ତୁ, ତାପରେ ସିଲାବସ୍, ଅଧ୍ୟାୟ କିମ୍ବା ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।", placeholder: "ଏଠାରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ...", typing: "ଭାବୁଛି...", demo: "ବ୍ୟାକଏଣ୍ଡ AI ଏପର୍ଯ୍ୟନ୍ତ ସଂଯୁକ୍ତ ହୋଇନାହିଁ। ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ବୁଝିଲି। ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପରେ ପ୍ରକୃତ ସିଲାବସ୍/ପୁସ୍ତକରୁ ଉତ୍ତର ମିଳିବ।", sourcePending: "ଉତ୍ସ: ସେଟଅପ୍ ବାକି", sourceDemo: "ଉତ୍ସ: ଡେମୋ ମୋଡ୍", syllabus: "ଏହି ଶ୍ରେଣୀ ଓ ବିଷୟର ସିଲାବସ୍ ଦେଖାନ୍ତୁ।", chapters: "ଏହି ବିଷୟର ସମସ୍ତ ଅଧ୍ୟାୟର ତାଲିକା ଦିଅନ୍ତୁ।", questions: "ଏହି ଅଧ୍ୟାୟର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପ୍ରଶ୍ନ ଦିଅନ୍ତୁ।", quiz: "ଏହି ଅଧ୍ୟାୟ ପାଇଁ ଏକ ଛୋଟ କୁଇଜ୍ ତିଆରି କରନ୍ତୁ।" },
    pa: { welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ MyStudyDost ਹਾਂ। ਆਪਣਾ ਬੋਰਡ, ਜਮਾਤ, ਵਿਸ਼ਾ ਅਤੇ ਚੈਟ ਭਾਸ਼ਾ ਚੁਣੋ, ਫਿਰ ਸਿਲੇਬਸ, ਅਧਿਆਇ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ।", placeholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...", typing: "ਸੋਚ ਰਿਹਾ ਹਾਂ...", demo: "ਬੈਕਐਂਡ AI ਅਜੇ ਜੁੜਿਆ ਨਹੀਂ ਹੈ। ਮੈਂ ਤੁਹਾਡਾ ਸਵਾਲ ਸਮਝ ਲਿਆ ਹੈ। ਅਗਲੇ ਕਦਮ ਵਿੱਚ ਅਸਲੀ ਸਿਲੇਬਸ/ਕਿਤਾਬਾਂ ਤੋਂ ਜਵਾਬ ਮਿਲੇਗਾ।", sourcePending: "ਸਰੋਤ: ਸੈੱਟਅੱਪ ਬਾਕੀ", sourceDemo: "ਸਰੋਤ: ਡੈਮੋ ਮੋਡ", syllabus: "ਇਸ ਜਮਾਤ ਅਤੇ ਵਿਸ਼ੇ ਦਾ ਸਿਲੇਬਸ ਦਿਖਾਓ।", chapters: "ਇਸ ਵਿਸ਼ੇ ਦੇ ਸਾਰੇ ਅਧਿਆਇ ਦੱਸੋ।", questions: "ਇਸ ਅਧਿਆਇ ਦੇ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਦੱਸੋ।", quiz: "ਇਸ ਅਧਿਆਇ ਲਈ ਇੱਕ ਛੋਟੀ ਕਵਿਜ਼ ਬਣਾਓ।" },
    as: { welcome: "নমস্কাৰ! মই MyStudyDost। আপোনাৰ ব'ৰ্ড, শ্ৰেণী, বিষয় আৰু চেটৰ ভাষা বাছনি কৰক, তাৰ পিছত পাঠ্যক্ৰম, অধ্যায় বা প্ৰশ্ন সোধক।", placeholder: "আপোনাৰ প্ৰশ্ন ইয়াত লিখক...", typing: "ভাবি আছোঁ...", demo: "বেকএণ্ড AI এতিয়াও সংযুক্ত হোৱা নাই। মই আপোনাৰ প্ৰশ্ন বুজিছোঁ। পৰৱৰ্তী ধাপত প্ৰকৃত পাঠ্যক্ৰম/কিতাপৰ পৰা উত্তৰ পাব।", sourcePending: "উৎস: ছেটআপ বাকী", sourceDemo: "উৎস: ডেম' ম'ড", syllabus: "এই শ্ৰেণী আৰু বিষয়ৰ পাঠ্যক্ৰম দেখুৱাওক।", chapters: "এই বিষয়ৰ সকলো অধ্যায়ৰ তালিকা দিয়ক।", questions: "এই অধ্যায়ৰ গুৰুত্বপূৰ্ণ প্ৰশ্ন দিয়ক।", quiz: "এই অধ্যায়ৰ বাবে এটা সৰু কুইজ বনাওক।" },
    mai: { welcome: "प्रणाम! हम MyStudyDost छी। अपन बोर्ड, कक्षा, विषय आ चैट भाषा चुनू, फेर पाठ्यक्रम, अध्याय वा प्रश्न पूछू।", placeholder: "अपन प्रश्न एतय लिखू...", typing: "सोचि रहल छी...", demo: "बैकएंड AI अखन धरि जुड़ल नहि अछि। हमर अहाँक प्रश्न बुझि गेल। अगिला चरण मे असली पाठ्यक्रम/किताब सँ उत्तर भेटत।", sourcePending: "स्रोत: सेटअप बाकी", sourceDemo: "स्रोत: डेमो मोड", syllabus: "एहि कक्षा आ विषयक पाठ्यक्रम देखाउ।", chapters: "एहि विषयक सभ अध्याय बताउ।", questions: "एहि अध्यायक महत्वपूर्ण प्रश्न बताउ।", quiz: "एहि अध्यायक लेल एकटा छोट क्विज बनाउ।" },
    sa: { welcome: "नमस्ते! अहं MyStudyDost अस्मि। स्वस्य बोर्ड्, कक्षां, विषयं च सम्भाषणभाषां चिनोतु, ततः पाठ्यक्रमं, अध्यायान् वा प्रश्नान् पृच्छतु।", placeholder: "अत्र स्वप्रश्नं लिखतु...", typing: "चिन्तयामि...", demo: "पृष्ठभाग-AI अद्यापि न संयोजितम्। भवतः प्रश्नः अवगतः। अग्रिमे सोपाने वास्तविकपाठ्यक्रमात्/पुस्तकेभ्यः उत्तराणि लभ्यन्ते।", sourcePending: "स्रोतः: स्थापना शेषा", sourceDemo: "स्रोतः: प्रदर्शनविधिः", syllabus: "अस्याः कक्षायाः विषयस्य च पाठ्यक्रमं दर्शयतु।", chapters: "अस्य विषयस्य सर्वान् अध्यायान् सूचयतु।", questions: "अस्य अध्यायस्य महत्त्वपूर्णान् प्रश्नान् ददातु।", quiz: "अस्य अध्यायस्य कृते लघुप्रश्नोत्तरीं रचयतु।" }
  };

  function getLang() {
    return (chatLang && chatLang.value) || 'en';
  }
  function t() {
    return chatI18n[getLang()] || chatI18n.en;
  }
  function applyChatLanguage() {
    const tr = t();
    if (welcomeText) welcomeText.textContent = tr.welcome;
    if (input) input.placeholder = tr.placeholder;
    const chip = document.querySelector('#welcomeBubble .source-chip');
    if (chip && chip.textContent.includes('setup')) chip.textContent = tr.sourcePending;
  }
  if (chatLang) {
    chatLang.addEventListener('change', applyChatLanguage);
    applyChatLanguage();
  }

  function addBubble(text, who, source) {
    if (!messages) return;
    const div = document.createElement('div');
    div.className = 'bubble ' + who;
    if (who === 'bot') {
      const span = document.createElement('span');
      span.textContent = text;
      div.appendChild(span);
      const chip = document.createElement('div');
      chip.className = 'source-chip';
      chip.textContent = source || t().sourcePending;
      div.appendChild(chip);
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendQuestion(q) {
    if (!q || !messages) return;
    addBubble(q, 'user');
    const typing = document.createElement('div');
    typing.className = 'bubble bot typing';
    typing.textContent = t().typing;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          board: document.getElementById('boardSelect')?.value || 'CBSE',
          class: document.getElementById('classSelect')?.value || 'Class 1',
          subject: document.getElementById('subjectSelect')?.value || 'Mathematics',
          language: getLang()
        })
      });
      if (!res.ok) throw new Error('API not ready');
      const data = await res.json();
      typing.remove();
      addBubble(data.answer || 'No answer available.', 'bot', (data.sources && data.sources[0]) || 'Source: API');
    } catch (e) {
      typing.remove();
      addBubble(t().demo, 'bot', t().sourceDemo);
    }
  }

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      sendQuestion(q);
    });
  }

  async function requestQuiz(topic) {
    if (!messages) return;
    addBubble(topic || t().quiz, 'user');
    const typing = document.createElement('div');
    typing.className = 'bubble bot typing';
    typing.textContent = t().typing;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || t().quiz,
          board: document.getElementById('boardSelect')?.value || 'CBSE',
          class: document.getElementById('classSelect')?.value || 'Class 1',
          subject: document.getElementById('subjectSelect')?.value || 'Mathematics',
          language: getLang()
        })
      });
      if (!res.ok) throw new Error('Quiz API not ready');
      const data = await res.json();
      typing.remove();
      addBubble(data.quiz || 'No quiz available.', 'bot', (data.sources && data.sources[0]) || 'Source: API');
    } catch (e) {
      typing.remove();
      sendQuestion(topic || t().quiz);
    }
  }

  document.querySelectorAll('.qa').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const tr = t();
      const q = (action && tr[action]) ? tr[action] : (btn.getAttribute('data-q') || btn.textContent);
      if (action === 'quiz') {
        requestQuiz(q);
      } else {
        sendQuestion(q);
      }
    });
  });

  const homeSearch = document.getElementById('homeSearch');
  if (homeSearch) {
    homeSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = '/chat';
      }
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/static/sw.js').catch(() => {});
    });
  }
})();
