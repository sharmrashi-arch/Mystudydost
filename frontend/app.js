(function () {
  'use strict';

  const chatI18n = {
    en: { welcome: "Hello! I am MyStudyDost. Select your board, class, subject, and chat language, then ask for syllabus, chapters, or questions. You can ask in your preferred Indian language.", placeholder: "Type your question here...", typing: "Thinking...", demo: "Backend AI (RAG/Groq/SERP) is not connected yet. I understood your question. In the next step, you will get answers from real syllabus/books.", sourcePending: "Source: setup pending", sourceDemo: "Source: demo mode", syllabus: "Show the syllabus for this class and subject.", chapters: "List all chapters for this subject.", questions: "Give important questions for this chapter.", quiz: "Create a short quiz for this chapter.", newChat: "New Chat", searchPlaceholder: "Search chats...", voiceStart: "Start recording", voiceStop: "Stop recording", voiceTranscribing: "Transcribing...", voiceError: "Could not record audio. Please check microphone permissions.", noSpeech: "No speech detected. Please try again.", copy: "Copy", copied: "Copied!" },
    hi: { welcome: "नमस्ते! मैं MyStudyDost हूँ। अपना बोर्ड, कक्षा, विषय और चैट भाषा चुनें, फिर पाठ्यक्रम, अध्याय या सवाल पूछें।", placeholder: "अपना सवाल यहाँ लिखें...", typing: "सोच रहा हूँ...", demo: "बैकएंड AI अभी जुड़ना बाकी है। मैंने आपका सवाल समझ लिया है। अगले चरण में असली पाठ्यक्रम/किताबों से जवाब मिलेगा।", sourcePending: "स्रोत: सेटअप बाकी है", sourceDemo: "स्रोत: डेमो मोड", syllabus: "इस कक्षा और विषय का पाठ्यक्रम बताइए।", chapters: "इस विषय के सभी अध्याय बताइए।", questions: "इस अध्याय के महत्वपूर्ण प्रश्न बताइए।", quiz: "इस अध्याय की एक छोटी क्विज़ बनाइए।", newChat: "नई चैट", searchPlaceholder: "चैट खोजें...", voiceStart: "रिकॉर्डिंग शुरू करें", voiceStop: "रिकॉर्डिंग बंद करें", voiceTranscribing: "लिखा जा रहा है...", voiceError: "ऑडियो रिकॉर्ड नहीं कर सके। कृपया माइक्रोफ़ोन अनुमति जांचें।", noSpeech: "कोई आवाज़ नहीं आई। कृपया फिर से कोशिश करें।", copy: "कॉपी करें", copied: "कॉपी हो गया!" },
    bn: { welcome: "নমস্কার! আমি MyStudyDost। আপনার বোর্ড, শ্রেণি, বিষয় এবং চ্যাটের ভাষা নির্বাচন করুন, তারপর সিলেবাস, অধ্যায় বা প্রশ্ন জিজ্ঞাসা করুন।", placeholder: "এখানে আপনার প্রশ্ন লিখুন...", typing: "ভাবছি...", demo: "ব্যাকএন্ড AI এখনও সংযুক্ত নয়। আমি আপনার প্রশ্ন বুঝেছি। পরবর্তী ধাপে আসল সিলেবাস/বই থেকে উত্তর পাবেন।", sourcePending: "সূত্র: সেটআপ বাকি", sourceDemo: "সূত্র: ডেমো মোড", syllabus: "এই শ্রেণি ও বিষয়ের সিলেবাস দেখান।", chapters: "এই বিষয়ের সব অধ্যায়ের তালিকা দিন।", questions: "এই অধ্যায়ের গুরুত্বপূর্ণ প্রশ্ন দিন।", quiz: "এই অধ্যায়ের একটি ছোট কুইজ তৈরি করুন।", newChat: "নতুন চ্যাট", searchPlaceholder: "চ্যাট খুঁজুন...", voiceStart: "রেকর্ডিং শুরু করুন", voiceStop: "রেকর্ডিং বন্ধ করুন", voiceTranscribing: "লিখা হচ্ছে...", voiceError: "অডিও রেকর্ড করা যায়নি। মাইক্রোফোন অনুমতি যাচাই করুন।", noSpeech: "কোনো বকতা পাওয়া যায়নি। আবার চেষ্টা করুন।", copy: "কপি করুন", copied: "কপি হয়েছে!" },
    te: { welcome: "నమస్తే! నేను MyStudyDost. మీబోర్డు, తరగతి, విషయం మరియు చాట్ భాషను ఎంచుకుని, సిలబస్, అధ్యాయాలు లేదా ప్రశ్నలు అడగండి.", placeholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...", typing: "ఆలోచిస్తున్నాను...", demo: "బ్యాకెండ్ AI ఇంకా కనెక్ట్ కాలేదు. మీ ప్రశ్న నాకు అర్థమైంది. తదుపరి దశలో అసలు సిలబస్/పుస్తకాల నుండి సమాధానాలు వస్తాయి.", sourcePending: "మూలం: సెటప్ పెండింగ్", sourceDemo: "మూలం: డెమో మోడ్", syllabus: "ఈ తరగతి మరియు విషయానికి సిలబస్ చూపించండి.", chapters: "ఈ విషయంలోని అన్ని అధ్యాయాలను జాబితా చేయండి.", questions: "ఈ అధ్యాయానికి ముఖ్యమైన ప్రశ్నలు ఇవ్వండి.", quiz: "ఈ అధ్యాయానికి చిన్న క్విజ్ తయారు చేయండి.", newChat: "కొత్త చాట్", searchPlaceholder: "చాట్లను వెతకండి...", voiceStart: "రికార్డింగ్ ప్రారంభించండి", voiceStop: "రికార్డింగ్ ఆపు చేయండి", voiceTranscribing: "లిఖించబడుతోంది...", voiceError: "ఆడియో రికార్డు చేయలేకపోయాము. మైక్రోఫోన్ అనుమతులను తనిఖీ చేయండి.", noSpeech: "మాత్ర كوई обнаружение नहीं हुआ. దయచేసి మళ్లీ ప్రయత్నించండి.", copy: "కాపీ చేయండి", copied: "కాపీ అయ్యింది!" },
    mr: { welcome: "नमस्कार! मी MyStudyDost आहे. तुमचा बोर्ड, इयत्ता, विषय आणि चॅट भाषा निवडा, नंतर अभ्यासक्रम, धडे किंवा प्रश्न विचारा.", placeholder: "तुमचा प्रश्न येथे लिहा...", typing: "विचार करत आहे...", demo: "बॅकएंड AI अद्याप जोडलेले नाही. मला तुमचा प्रश्न समजला. पुढील टप्प्यात खऱ्या अभ्यासक्रम/पुस्तकांमधून उत्तरे मिळतील.", sourcePending: "स्रोत: सेटअप प्रलंबित", sourceDemo: "स्रोत: डेमो मोड", syllabus: "या इयत्ता आणि विषयाचा अभ्यासक्रम दाखवा.", chapters: "या विषयातील सर्व धडे सांगा.", questions: "या धड्याचे महत्त्वाचे प्रश्न द्या.", quiz: "या धड्यावर एक छोटी क्विझ तयार करा.", newChat: "नवीन चॅट", searchPlaceholder: "चॅट शोधा...", voiceStart: "रेकॉर्डिंग सुरू करा", voiceStop: "रेकॉर्डिंग थांबवा", voiceTranscribing: "लिहित आहे...", voiceError: "ऑडिओ रेकॉर्ड करू शकलं नाही. मायक्रोफोन परवानगी तपासा.", noSpeech: "काहीही बोललेले आढळलं नाही. कृपया पुन्हा प्रयत्न करा.", copy: "कॉपी करा", copied: "कॉपी झालं!" },
    ta: { welcome: "வணக்கம்! நான் MyStudyDost. உங்கள் வாரியம், வகுப்பு, பாடம் மற்றும் அரட்டை மொழியைத் தேர்ந்தெடுத்து, பாடத்திட்டம், அத்தியாயங்கள் அல்லது கேள்விகள் கேளுங்கள்.", placeholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...", typing: "யோசிக்கிறேன்...", demo: "பின்தள AI இன்னும் இணைக்கப்படவில்லை. உங்கள் கேள்வி புரிந்தது. அடுத்த கட்டத்தில் உண்மையான பாடத்திட்டம்/புத்தகங்களிலிருந்து பதில்கள் கிடைக்கும்.", sourcePending: "ஆதாரம்: அமைப்பு நிலுவையில்", sourceDemo: "ஆதாரம்: டெமோ முறை", syllabus: "இந்த வகுப்பு மற்றும் பாடத்திற்கான பாடத்திட்டத்தை காட்டுங்கள்.", chapters: "இந்த பாடத்தின் அனைத்து அத்தியாயங்களையும் பட்டியலிடுங்கள்.", questions: "இந்த அத்தியாயத்தின் முக்கிய கேள்விகளை கொடுங்கள்.", quiz: "இந்த அத்தியாயத்திற்கு ஒரு சிறிய வினாடி வினா உருவாக்குங்கள்.", newChat: "புதிய அரட்டை", searchPlaceholder: "அரட்டைகளைத் தேடுங்கள்...", voiceStart: "தொகுப்பதை துவக்கவும்", voiceStop: "தொகுப்பதை நிறுத்தவும்", voiceTranscribing: "எழுதப்படுகிறது...", voiceError: "ஆடியோ பதிவேற்ற முடியவில்லை. மைக்ரோஃபோன் அனுமதியை சரிபார்க்கவும்.", noSpeech: "எந்த பேச்சும் கண்டறியப்படவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.", copy: "காப்பி செய்க", copied: "காப்பி ஆக'hi!" },
    ur: { welcome: "السلام علیکم! میں MyStudyDost ہوں۔ اپنا بورڈ، جماعت، مضمون اور چیٹ کی زبان منتخب کریں، پھر نصاب، ابواب یا سوالات پوچھیں۔", placeholder: "اپنا سوال یہاں لکھیں...", typing: "سوچ رہا ہوں...", demo: "بیک اینڈ AI ابھی منسلک نہیں ہے۔ میں نے آپ کا سوال سمجھ لیا ہے۔ اگلے مرحلے میں اصل نصاب/کتابوں سے جواب ملے گا۔", sourcePending: "ماخذ: سیٹ اپ باقی ہے", sourceDemo: "ماخذ: ڈیمو موڈ", syllabus: "اس جماعت اور مضمون کا نصاب بتائیں۔", chapters: "اس مضمون کے تمام ابواب بتائیں۔", questions: "اس باب کے اہم سوالات بتائیں۔", quiz: "اس باب کا ایک مختصر کوئز بنائیں۔", newChat: "نیا چیٹ", searchPlaceholder: "چیٹ تلاش کریں...", voiceStart: "رکارڈنگ شروع کریں", voiceStop: "رکارڈنگ بند کریں", voiceTranscribing: "لکھا جا رہا ہے...", voiceError: "آڈیو ریکارڈ نہیں ہو سکا۔ براہ کرم مائیکروفون کی اجازت چیک کریں۔", noSpeech: "کوئی بولی نہیں ملی۔ براہ کرم دوبارہ کوشش کریں۔", copy: "کاپی کریں", copied: "کاپی ہو گیا!" },
    gu: { welcome: "નમસ્તે! હું MyStudyDost છું. તમારું બોર્ડ, વર્ગ, વિષય અને ચેટ ભાષા પસંદ કરો, પછી અભ્યાસક્રમ, પ્રકરણો અથવા પ્રશ્નો પૂછો.", placeholder: "તમારો પ્રશ્ન અહીં લખો...", typing: "વિચારી રહ્યો છું...", demo: "બેકએન્ડ AI હજી જોડાયેલ નથી. મેં તમારો પ્રશ્ન સમજ્યો. આગળના પગલે સાચા અભ્યાસક્રમ/પુસ્તકોથી જવાબ મળશે.", sourcePending: "સ્રોત: સેટઅપ બાકી", sourceDemo: "સ્રોત: ડેમો મોડ", syllabus: "આ વર્ગ અને વિષયનો અભ્યાસક્રમ બતાવો.", chapters: "આ વિષયના બધા પ્રકરણોની યાદી આપો.", questions: "આ પ્રકરણના મહત્વના પ્રશ્નો આપો.", quiz: "આ પ્રકરણ માટે એક નાની ક્વિઝ બનાવો.", newChat: "નવી ચેટ", searchPlaceholder: "ચેટ શોધો...", voiceStart: "રેકોર્ડિંગ શરૂ કરો", voiceStop: "રેકોર્ડિંગ બંધ કરો", voiceTranscribing: "લખવામાં આવી રહ્યું છે...", voiceError: "ઑડિયો રેકોર્ડ કરી શક્યા નથી. માઈક્રોફોન પરવાનગી તપાસો.", noSpeech: "કોઈ બોલાવુ કોઈ નથી. કૃપા કરીને ફરીથી પ્રયાસ કરો.", copy: "કોપી કરો", copied: "કોપી થયું!" },
    kn: { welcome: "ನಮಸ್ಕಾರ! ನಾನು MyStudyDost. ನಿಮ್ಮ ಬೋರ್ಡ್, ತರಗತಿ, ವಿಷಯ ಮತ್ತು ಚಾಟ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಂತರ ಪಠ್ಯಕ್ರಮ, ಅಧ್ಯಾಯಗಳು ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.", placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...", typing: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...", demo: "ಬ್ಯಾಕೆಂಡ್ AI ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನನಗೆ ಅರ್ಥವಾಗ 불�ೂ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ ನಿಜವಾದ ಪಠ್ಯಕ್ರಮ/ಪುಸ್ತಕಗಳಿಂದ ಉತ್ತರಗಳು ಸಿಗುತ್ತದೆ.", sourcePending: "ಮೂಲ: ಸೆಟಪ್ ಬಾಕಿ", sourceDemo: "ಮೂಲ: ಡೆಮೋ ಮೋಡ್", syllabus: "ಈ ತರಗತಿ ಮತ್ತು ವಿಷಯದ ಪಠ್ಯಕ್ರಮವನ್ನು ತೋರಿಸಿ.", chapters: "ಈ ವಿಷಯದ ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳನ್ನು ಪಟ್ಟಿಮಾಡಿ.", questions: "ಈ ಅಧ್ಯಾಯದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ನೀಡಿ.", quiz: "ಈ ಅಧ್ಯಾಯಕ್ಕೆ ಒಂದು ಸಣ್ಣ ರಸಪ್ರಶ್ನೆ ರಚಿಸಿ.", newChat: "ಹೊಸ ಚಾಟ್", searchPlaceholder: "ಚಾಟ್ ಹುಡುಕಿ...", voiceStart: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ", voiceStop: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ", voiceTranscribing: "ಲಿಖಲಾಗುತ್ತಿದೆ...", voiceError: "ಆಡಿಯೊವನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", noSpeech: "ಯಾವುದೇ ಮಾತು ಪತ್ತೆಯಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", copy: "ಕಾಪಿ ಮಾಡಿ", copied: "ಕಾಪಿ ಆಗಿದೆ!" },
    ml: { welcome: "നമസ്കാരം! ഞാൻ MyStudyDost ആണ്. നിങ്ങളുടെ ബോർഡ്, ക്ലാസ്, വിഷയം, ചാറ്റ് ഭാഷ എന്നിവ തിരഞ്ഞെടുത്ത് സിലബസ്, അധ്യായങ്ങൾ അല്ലെങ്കിൽ ചോദ്യങ്ങൾ ചോദിക്കുക.", placeholder: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...", typing: "ചിന്തിക്കുന്നു...", demo: "ബാക്കെൻഡ് AI ഇതുവരെ ബന്ധിപ്പിച്ചിട്ടില്ല. നിങ്ങളുടെ ചോദ്യം ഞാൻ മനസ്സിലാക്കി. അടുത്ത ഘട്ടത്തിൽ യഥാർത്ഥ സിലബസ്/പുസ്തകങ്ങളിൽ നിന്ന് ഉത്തരങ്ങൾ ലഭിക്കും.", sourcePending: "ഉറവിടം: സജ്ജീകരണം ബാക്കി", sourceDemo: "ഉറവിടം: ഡെമോ മോഡ്", syllabus: "ഈ ക്ലാസിന്റെയും വിഷയത്തിന്റെയും സിലബസ് കാണിക്കുക.", chapters: "ഈ വിഷയത്തിലെ എല്ലാ അധ്യായങ്ങളും പട്ടികപ്പെടുത്തുക.", questions: "ഈ അധ്യായത്തിലെ പ്രധാന ചോദ്യങ്ങൾ നൽകുക.", quiz: "ഈ അധ്യായത്തിന് ഒരു ചെറിയ ക്വിസ് തയ്യാറാക്കുക.", newChat: "പുതിയ ചാറ്റ്", searchPlaceholder: "ചാറ്റുകൾ തിരയുക...", voiceStart: "റെക്കോർഡിംഗ് ആരംഭിക്കുക", voiceStop: "റെക്കോർഡിംഗ് നിർത്തുക", voiceTranscribing: "എഴുതുന്നു...", voiceError: "ഓഡിയോറെക്കോർഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. മൈക്രോഫോൺ അനുമതി പരിശോധിക്കുക.", noSpeech: "എന്തെങ്കിലും സംസാരം കണ്ടെത്തിയില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.", copy: "കോപ്പി ചെയ്യുക", copied: "കോപ്പി ചെയ്തു!" },
    or: { welcome: "ନମସ୍କାର! ମୁଁ MyStudyDost। ଆପଣଙ୍କ ବୋର୍ଡ, ଶ୍ରେଣୀ, ବିଷୟ ଏବଂ ଚାଟ୍ ଭାଷା ବାଛନ୍ତୁ, ତାପରେ ସିଲାବସ୍, ଅଧ୍ୟାୟ କିମ୍ବା ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।", placeholder: "ଏଠାରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ...", typing: "ଭାବୁଛି...", demo: "ବ୍ୟାକଏଣ୍ଡ AI ଏପର୍ଯ୍ୟନ୍ତ ସଂଯୁକ୍ତ ହୋଇନାହିଁ। ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ବୁଝିଲି। ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପରେ ପ୍ରକୃତ ସିଲାବସ୍/ପୁସ୍ତକରୁ ଉତ୍ତର ମିଳିବ।", sourcePending: "ଉତ୍ସ: ସେଟଅପ୍ ବାକି", sourceDemo: "ଉତ୍ସ: ଡେମୋ ମୋଡ୍", syllabus: "ଏହି ଶ୍ରେଣୀ ଓ ବିଷୟର ସିଲାବସ୍ ଦେଖାନ୍ତୁ।", chapters: "ଏହି ବିଷୟର ସମସ୍ତ ଅଧ୍ୟାୟର ତାଲିକା ଦିଅନ୍ତୁ।", questions: "ଏହି ଅଧ୍ୟାୟର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପ୍ରଶ୍ନ ଦିଅନ୍ତୁ।", quiz: "ଏହି ଅଧ୍ୟାୟ ପାଇଁ ଏକ ଛୋଟ କୁଇଜ୍ ତିଆରି କରନ୍ତୁ।", newChat: "ନୂତନ ଚାଟ୍", searchPlaceholder: "ଚାଟ୍ ଖୋଜନ୍ତୁ...", voiceStart: "ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ", voiceStop: "ରେକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ", voiceTranscribing: "ଲେଖାଯାଉଛି...", voiceError: "ଅଡିଓ ରେକର୍ଡ କରିପାରିଲା ନାହିଁ। ମାଇକ୍ରୋଫୋନ ଅନୁମତି ଜାଞ୍ଚ କରନ୍ତୁ।", noSpeech: "କୌଣସି କଥା ମିଳିଲା ନାହିଁ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।", copy: "କପି କରନ୍ତୁ", copied: "କପି ହୋଇଛି!" },
    pa: { welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ MyStudyDost ਹਾਂ। ਆਪਣਾ ਬੋਰਡ, ਜਮਾਤ, ਵਿਸ਼ਾ ਅਤੇ ਚੈਟ ਭਾਸ਼ਾ ਚੁਣੋ, ਫਿਰ ਸਿਲੇਬਸ, ਅਧਿਆਇ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ।", placeholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...", typing: "ਸੋਚ ਰਿਹਾ ਹਾਂ...", demo: "ਬੈਕਐਂਡ AI ਅਜੇ ਜੁੜਿਆ ਨਹੀਂ ਹੈ। ਮੈਂ ਤੁਹਾਡਾ ਸਵਾਲ ਸਮਝ ਲਿਆ ਹੈ। ਅਗਲੇ ਕਦਮ ਵਿੱਚ ਅਸਲੀ ਸਿਲੇਬਸ/ਕਿਤਾਬਾਂ ਤੋਂ ਜਵਾਬ ਮਿਲੇਗਾ।", sourcePending: "ਸਰੋਤ: ਸੈੱਟਅੱਪ ਬਾਕੀ", sourceDemo: "ਸਰੋਤ: ਡੈਮੋ ਮੋਡ", syllabus: "ਇਸ ਜਮਾਤ ਅਤੇ ਵਿਸ਼ੇ ਦਾ ਸਿਲੇਬਸ ਦਿਖਾਓ।", chapters: "ਇਸ ਵਿਸ਼ੇ ਦੇ ਸਾਰੇ ਅਧਿਆਇ ਦੱਸੋ।", questions: "ਇਸ ਅਧਿਆਇ ਦੇ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਦੱਸੋ।", quiz: "ਇਸ ਅਧਿਆਇ ਲਈ ਇੱਕ ਛੋਟੀ ਕਵਿਜ਼ ਬਣਾਓ।", newChat: "ਨਵੀਂ ਚੈਟ", searchPlaceholder: "ਚੈਟ ਲੱਭੋ...", voiceStart: "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ", voiceStop: "ਰਿਕਾਰਡਿੰਗ ਬੰਦ ਕਰੋ", voiceTranscribing: "ਲਿਖਿਆ ਜਾ ਰਿਹਾ ਹੈ...", voiceError: "ਆਡੀਓ ਰਿਕਾਰਡ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕੀ। ਮਾਈਕ੍ਰੋਫੋਨ ਅਨੁਮਤੀ ਚੈੱਕ ਕਰੋ।", noSpeech: "ਕੋਈ ਬੋਲੀ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", copy: "ਕਾਪੀ ਕਰੋ", copied: "ਕਾਪੀ ਹੋ ਗਈ!" },
    as: { welcome: "নমস্কাৰ! মই MyStudyDost। আপোনাৰ ব'ৰ্ড, শ্ৰেণী, বিষয় আৰু চেটৰ ভাষা বাছনি কৰক, তাৰ পিছত পাঠ্যক্ৰম, অধ্যায় বা প্ৰশ্ন সোধক।", placeholder: "আপোনাৰ প্ৰশ্ন ইয়াত লিখক...", typing: "ভাবি আছোঁ...", demo: "বেকএণ্ড AI এতিয়াও সংযুক্ত হোৱা নাই। মই আপোনাৰ প্ৰশ্ন বুজিছোঁ। পৰৱৰ্তী ধাপত প্ৰকৃত পাঠ্যক্ৰম/কিতাপৰ পৰা উত্তৰ পাব।", sourcePending: "উৎস: ছেটআপ বাকী", sourceDemo: "উৎস: ডেম' ম'ড", syllabus: "এই শ্ৰেণী আৰু বিষয়ৰ পাঠ্যক্ৰম দেখুৱাওক।", chapters: "এই বিষয়ৰ সকলো অধ্যায়ৰ তালিকা দিয়ক।", questions: "এই অধ্যায়ৰ গুৰুত্বপূৰ্ণ প্ৰশ্ন দিয়ক।", quiz: "এই অধ্যায়ৰ বাবে এটা সৰু কুইজ বনাওক।", newChat: "নতুন চেট", searchPlaceholder: "চেট সন্ধান কৰক...", voiceStart: "ৰেক'ৰ্ডিং আৰম্ভ কৰক", voiceStop: "ৰেক'ৰ্ডিং বন্ধ কৰক", voiceTranscribing: "লিখা হৈছে...", voiceError: "অ'ডি'য' ৰেক'ৰ্ড কৰিব নোৱাৰে। মাইক্ৰ'ফ'ন অনুমতি জাঁচ কৰক।", noSpeech: "কোনো ক'থ'ল'ভে নাই। দয়া কৰি ফেৰে প্ৰয়াস কৰক।", copy: "ক'পি কৰক", copied: "ক'পি হ'ল!" },
    mai: { welcome: "प्रणाम! हम MyStudyDost छी। अपन बोर्ड, कक्षा, विषय आ चैट भाषा चुनू, फेर पाठ्यक्रम, अध्याय वा प्रश्न पूछू।", placeholder: "अपन प्रश्न एतय लिखू...", typing: "सोचि रहल छी...", demo: "बैकएंड AI अखन धरि जुड़ल नहि अछि। हमर अहाँक प्रश्न बुझि गेल। अगिला चरण मे असली पाठ्यक्रम/किताब सँ उत्तर भेटत।", sourcePending: "स्रोत: सेटअप बाकी", sourceDemo: "स्रोत: डेमो मोड", syllabus: "एहि कक्षा आ विषयक पाठ्यक्रम देखाउ।", chapters: "एहि विषयक सभ अध्याय बताउ।", questions: "एहि अध्यायक महत्वपूर्ण प्रश्न बताउ।", quiz: "एहि अध्यायक लेल एकटा छोट क्विज बनाउ।", newChat: "नय चेट", searchPlaceholder: "चेट खोजू...", voiceStart: "रिकार्डिंग सुरू करू", voiceStop: "रिकार्डिंग बन्द करू", voiceTranscribing: "लिखल जाइत अछि...", voiceError: "अडियो रिकार्ड नै भइल। माइक्रोफोन परमिशन जांचू।", noSpeech: "कउनो बोल नै भेटल। कृपया फेर कोशिश करू।", copy: "कापी करू", copied: "कापी भ गेल!" },
    sa: { welcome: "नमस्ते! अहं MyStudyDost अस्मि। स्वस्य बोर्ड्, कक्षां, विषयं च सम्भाषणभाषां चिनोतु, ततः पाठ्यक्रमं, अध्यायान् वा प्रश्नान् पृच्छतु।", placeholder: "अत्र स्वप्रश्नं लिखतु...", typing: "चिन्तयामि...", demo: "पृष्ठभाग-AI अद्यापि न संयोजितम्। भवतः प्रश्नः अवगतः। अग्रिमे सोपाने वास्तविकपाठ्यक्रमात्/पुस्तकेभ्यः उत्तराणि लभ्यन्ते।", sourcePending: "स्रोतः: स्थापना शेषा", sourceDemo: "स्रोतः: प्रदर्शनविधिः", syllabus: "अस्याः कक्षायाः विषयस्य च पाठ्यक्रमं दर्शयतु।", chapters: "अस्य विषयस्य सर्वान् अध्यायान् सूचयतु।", questions: "अस्य अध्यायस्य महत्त्वपूर्णान् प्रश्नान् ददातु।", quiz: "अस्य अध्यायस्य कृते लघुप्रश्नोत्तरीं रचयतु।", newChat: "नवीनः वार्तालापः", searchPlaceholder: "वार्तालापान् अन्वेषयतु...", voiceStart: "अभिलेखनम् आरभ्यताम्", voiceStop: "अभिलेखनम् विरामयतु", voiceTranscribing: "लिख्यते...", voiceError: "शब्दरिकार्डिङं न शक्यम्। माइक्रोफोनानुमतिं परीक्ष्यताम्।", noSpeech: "कश्चिद् वाक्यं न लब्धवान्। कृपया पुनः प्रयत्नं कुर्यात्।", copy: "प्रतिलिपिं कुर्वन्तु", copied: "प्रतिलिपिः कृता!" }
  };

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const chatPanel = document.getElementById('chatPanel');
  const messages = document.getElementById('messages');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const voiceVisualizer = document.getElementById('voiceVisualizer');
  const voiceTranscript = document.getElementById('voiceTranscript');
  const chatList = document.getElementById('chatList');
  const chatSearch = document.getElementById('chatSearch');
  const newChatBtn = document.getElementById('newChatBtn');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const boardSelect = document.getElementById('boardSelect');
  const classSelect = document.getElementById('classSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const chatLanguage = document.getElementById('chatLanguage');
  const currentChatTitle = document.getElementById('currentChatTitle');
  const currentChatSubtitle = document.getElementById('currentChatSubtitle');
  const welcomeText = document.getElementById('welcomeText');

  // State
  let chats = [];
  let currentChatId = 'new';
  let currentMessages = [];
  let isRecording = false;
  let mediaRecorder = null;
  let audioChunks = [];
  let audioBlob = null;
  let recognition = null;
  let currentTranscript = '';
  let isProcessingVoice = false;

  // Initialize
  function init() {
    loadChats();
    setupEventListeners();
    applyLanguage();
    renderChatList();
    loadChat('new');
    setupSpeechRecognition();
    setupServiceWorker();
  }

  // Load chats from localStorage
  function loadChats() {
    try {
      const stored = localStorage.getItem('mystudydost_chats');
      if (stored) {
        chats = JSON.parse(stored);
      }
    } catch (e) {
      chats = [];
    }
    // Ensure we have at least the new chat placeholder
    if (!chats.find(c => c.id === 'new')) {
      chats.unshift({ id: 'new', title: 'New Chat', messages: [], createdAt: Date.now(), updatedAt: Date.now() });
    }
  }

  function saveChats() {
    try {
      localStorage.setItem('mystudydost_chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Failed to save chats:', e);
    }
  }

  // Get current language
  function getLang() {
    return (chatLanguage && chatLanguage.value) || 'en';
  }

  function t() {
    return chatI18n[getLang()] || chatI18n.en;
  }

  // Apply language to UI
  function applyLanguage() {
    const tr = t();
    if (welcomeText) welcomeText.textContent = tr.welcome;
    if (chatInput) chatInput.placeholder = tr.placeholder;
    if (chatSearch) chatSearch.placeholder = tr.searchPlaceholder;
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      const action = btn.dataset.action;
      if (action && tr[action]) btn.textContent = tr[action];
    });
    updateVoiceButtonTitle();
  }

  function updateVoiceButtonTitle() {
    const tr = t();
    if (voiceBtn) voiceBtn.title = isRecording ? tr.voiceStop : tr.voiceStart;
  }

  // Event Listeners
  function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
    closeSidebar?.addEventListener('click', () => sidebar.classList.remove('open'));

    // New chat
    newChatBtn?.addEventListener('click', createNewChat);

    // Clear chat
    clearChatBtn?.addEventListener('click', clearCurrentChat);

    // Chat search
    chatSearch?.addEventListener('input', filterChatList);

    // Chat list delegation
    chatList?.addEventListener('click', (e) => {
      const item = e.target.closest('.chat-item');
      if (item) {
        const chatId = item.dataset.chatId;
        loadChat(chatId);
        sidebar.classList.remove('open');
      }
    });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const tr = t();
        const q = tr[action] || btn.textContent;
        if (action === 'quiz') {
          requestQuiz(q);
        } else {
          sendQuestion(q);
        }
      });
    });

    // Send message
    sendBtn?.addEventListener('click', () => {
      const q = chatInput.value.trim();
      if (q) sendQuestion(q);
    });

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const q = chatInput.value.trim();
        if (q) sendQuestion(q);
      }
    });

    // Voice recording
    voiceBtn?.addEventListener('click', toggleVoiceRecording);

    // Study setup changes
    [boardSelect, classSelect, subjectSelect, chatLanguage].forEach(el => {
      el?.addEventListener('change', () => {
        applyLanguage();
        if (currentChatId !== 'new') {
          saveCurrentChat();
        }
      });
    });

    // Click outside sidebar to close on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  // Chat Management
  function createNewChat() {
    const newChat = {
      id: 'chat_' + Date.now(),
      title: 'New Chat',
      messages: [],
      board: boardSelect?.value || 'CBSE',
      klass: classSelect?.value || 'Class 1',
      subject: subjectSelect?.value || 'Mathematics',
      language: getLang(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    chats.unshift(newChat);
    saveChats();
    renderChatList();
    loadChat(newChat.id);
    sidebar.classList.remove('open');
  }

  function loadChat(chatId) {
    if (chatId === 'new') {
      currentChatId = 'new';
      currentMessages = [];
      currentChatTitle.textContent = 'MyStudyDost';
      currentChatSubtitle.textContent = 'Your free study companion';
      showWelcomeMessage();
      updateChatListActive('new');
      return;
    }

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    currentChatId = chatId;
    currentMessages = chat.messages || [];
    currentChatTitle.textContent = chat.title || 'Chat';
    currentChatSubtitle.textContent = `${chat.board} • ${chat.klass} • ${chat.subject}`;

    // Restore study setup
    if (boardSelect) boardSelect.value = chat.board || 'CBSE';
    if (classSelect) classSelect.value = chat.klass || 'Class 1';
    if (subjectSelect) subjectSelect.value = chat.subject || 'Mathematics';
    if (chatLanguage) {
      chatLanguage.value = chat.language || 'en';
      applyLanguage();
    }

    renderMessages();
    updateChatListActive(chatId);
  }

  function saveCurrentChat() {
    if (currentChatId === 'new') return;

    const chatIndex = chats.findIndex(c => c.id === currentChatId);
    if (chatIndex === -1) return;

    const chat = chats[chatIndex];
    chat.messages = currentMessages;
    chat.board = boardSelect?.value || 'CBSE';
    chat.klass = classSelect?.value || 'Class 1';
    chat.subject = subjectSelect?.value || 'Mathematics';
    chat.language = getLang();
    chat.updatedAt = Date.now();

    // Update title from first user message
    const firstUserMsg = currentMessages.find(m => m.role === 'user');
    if (firstUserMsg && chat.title === 'New Chat') {
      chat.title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
    }

    chats[chatIndex] = chat;
    saveChats();
    renderChatList();
  }

  function clearCurrentChat() {
    if (currentChatId === 'new') return;

    if (confirm('Clear this chat?')) {
      currentMessages = [];
      renderMessages();
      saveCurrentChat();
    }
  }

  function deleteChat(chatId) {
    if (chatId === 'new') return;
    if (confirm('Delete this chat?')) {
      chats = chats.filter(c => c.id !== chatId);
      saveChats();
      renderChatList();
      if (currentChatId === chatId) {
        loadChat('new');
      }
    }
  }

  function filterChatList() {
    const query = chatSearch.value.toLowerCase().trim();
    const items = chatList.querySelectorAll('.chat-item:not([data-chat-id="new"])');
    items.forEach(item => {
      const title = item.querySelector('.chat-title').textContent.toLowerCase();
      item.style.display = title.includes(query) ? 'flex' : 'none';
    });
  }

  function renderChatList() {
    const newChatItem = chatList.querySelector('[data-chat-id="new"]');
    chatList.innerHTML = '';
    if (newChatItem) chatList.appendChild(newChatItem);

    chats.filter(c => c.id !== 'new').forEach(chat => {
      const div = document.createElement('div');
      div.className = 'chat-item' + (chat.id === currentChatId ? ' active' : '');
      div.dataset.chatId = chat.id;
      div.innerHTML = `
        <div class="chat-item-content">
          <svg class="chat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="chat-title">${escapeHtml(chat.title || 'New Chat')}</span>
        </div>
        <span class="chat-time">${formatTime(chat.updatedAt)}</span>
      `;
      chatList.appendChild(div);
    });
    updateChatListActive(currentChatId);
  }

  function updateChatListActive(chatId) {
    chatList.querySelectorAll('.chat-item').forEach(item => {
      item.classList.toggle('active', item.dataset.chatId === chatId);
    });
  }

  // Message Rendering
  function showWelcomeMessage() {
    messages.innerHTML = '';
    messages.appendChild(welcomeMessage);
    welcomeMessage.style.display = 'flex';
  }

  function hideWelcomeMessage() {
    welcomeMessage.style.display = 'none';
  }

  function renderMessages() {
    hideWelcomeMessage();
    messages.innerHTML = '';
    currentMessages.forEach(msg => appendMessageToDOM(msg, false));
    scrollToBottom();
  }

  function appendMessageToDOM(msg, animate = true) {
    const div = document.createElement('div');
    div.className = 'message ' + msg.role;
    if (animate) div.style.animation = 'fadeIn 200ms ease';

    const avatar = msg.role === 'bot' ? 'M' : 'U';
    const roleLabel = msg.role === 'bot' ? 'MyStudyDost' : 'You';

    let contentHtml = '';

    if (msg.type === 'voice') {
      // Voice message with audio player and transcript
      const audioUrl = msg.audioUrl || '';
      const duration = msg.duration || 0;
      const transcript = msg.transcript || '';
      contentHtml = `
        <div class="voice-message">
          <div class="voice-player" data-audio="${escapeHtml(audioUrl)}" data-duration="${duration}">
            <button class="play-btn" aria-label="Play voice message">
              <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
            <div class="wave-container">
              <span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span>
            </div>
            <span class="voice-time">${formatDuration(duration)}</span>
          </div>
          ${transcript ? `<div class="voice-transcript">${escapeHtml(transcript)}</div>` : ''}
        </div>
      `;
    } else {
      contentHtml = `<div class="message-bubble">${escapeHtml(msg.content)}</div>`;
    }

    // Sources
    if (msg.sources && msg.sources.length > 0) {
      contentHtml += '<div class="message-sources">' + msg.sources.slice(0, 3).map(s => `<span class="source-chip">${escapeHtml(s)}</span>`).join('') + '</div>';
    }

    div.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-role">${roleLabel}</span>
          <span class="message-time">${formatTime(msg.timestamp)}</span>
        </div>
        ${contentHtml}
      </div>
    `;

    messages.appendChild(div);

    // Setup audio player if voice message
    if (msg.type === 'voice') {
      setupAudioPlayer(div.querySelector('.voice-player'));
    }

    scrollToBottom();
  }

  function addMessage(role, content, options = {}) {
    const msg = {
      role,
      content,
      type: options.type || 'text',
      timestamp: Date.now(),
      ...options
    };
    currentMessages.push(msg);
    appendMessageToDOM(msg);
    saveCurrentChat();
    return msg;
  }

  function addBotMessage(content, sources = [], mode = 'rag') {
    return addMessage('bot', content, { sources, mode });
  }

  function addUserMessage(content, options = {}) {
    return addMessage('user', content, options);
  }

  function addTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'message bot typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="message-avatar">M</div>
      <div class="message-content">
        <div class="typing-indicator">
          <span class="typing-dots"><span></span><span></span><span></span></span>
          <span>${t().typing}</span>
        </div>
      </div>
    `;
    messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  // API Calls
  async function sendQuestion(question) {
    if (isProcessingVoice) return;

    addUserMessage(question);
    chatInput.value = '';
    sendBtn.disabled = true;

    const typingEl = addTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          board: boardSelect?.value || 'CBSE',
          class: classSelect?.value || 'Class 1',
          subject: subjectSelect?.value || 'Mathematics',
          language: getLang()
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      typingEl.remove();
      addBotMessage(data.answer || 'No answer available.', data.sources || [], data.mode || 'unknown');
    } catch (e) {
      typingEl.remove();
      addBotMessage(t().demo, [], 'demo');
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  async function requestQuiz(topic) {
    if (isProcessingVoice) return;

    addUserMessage(topic);
    const typingEl = addTypingIndicator();

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          board: boardSelect?.value || 'CBSE',
          class: classSelect?.value || 'Class 1',
          subject: subjectSelect?.value || 'Mathematics',
          language: getLang()
        })
      });

      if (!res.ok) throw new Error('Quiz API error');
      const data = await res.json();

      typingEl.remove();
      addBotMessage(data.quiz || 'No quiz available.', data.sources || [], data.mode || 'unknown');
    } catch (e) {
      typingEl.remove();
      sendQuestion(topic);
    }
  }

  // Voice Recording
  async function toggleVoiceRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        stream.getTracks().forEach(t => t.stop());
        await processVoiceMessage();
      };

      mediaRecorder.start(100);
      isRecording = true;
      voiceBtn.classList.add('recording');
      voiceVisualizer.classList.add('active');
      updateVoiceButtonTitle();
      startSpeechRecognition();
    } catch (e) {
      console.error('Recording error:', e);
      showVoiceTranscript(t().voiceError, true);
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    voiceBtn.classList.remove('recording');
    voiceVisualizer.classList.remove('active');
    updateVoiceButtonTitle();
    stopSpeechRecognition();
  }

  async function processVoiceMessage() {
    isProcessingVoice = true;
    showVoiceTranscript(t().voiceTranscribing, false);

    // Create audio URL
    const audioUrl = URL.createObjectURL(audioBlob);
    const duration = await getAudioDuration(audioBlob);

    // Add user voice message
    const userMsg = addUserMessage('', {
      type: 'voice',
      audioUrl,
      duration,
      transcript: currentTranscript || undefined
    });

    // Send transcript as question if available
    if (currentTranscript && currentTranscript.trim()) {
      const question = currentTranscript.trim();
      currentTranscript = '';
      hideVoiceTranscript();

      const typingEl = addTypingIndicator();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            board: boardSelect?.value || 'CBSE',
            class: classSelect?.value || 'Class 1',
            subject: subjectSelect?.value || 'Mathematics',
            language: getLang()
          })
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();

        typingEl.remove();
        addBotMessage(data.answer || 'No answer available.', data.sources || [], data.mode || 'unknown');
      } catch (e) {
        typingEl.remove();
        addBotMessage(t().demo, [], 'demo');
      }
    } else {
      hideVoiceTranscript();
      showVoiceTranscript(t().noSpeech, true);
      // Remove the voice message if no transcript
      currentMessages.pop();
      messages.lastChild?.remove();
      saveCurrentChat();
    }

    isProcessingVoice = false;
  }

  function getAudioDuration(blob) {
    return new Promise((resolve) => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration));
      });
      audio.addEventListener('error', () => resolve(0));
    });
  }

  // Speech Recognition
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      voiceBtn.style.display = 'none';
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getSpeechLang(getLang());

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      currentTranscript = finalTranscript || interimTranscript;
      showVoiceTranscript(currentTranscript, false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        showVoiceTranscript(t().voiceError, true);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still recording
        try { recognition.start(); } catch (e) {}
      }
    };
  }

  function getSpeechLang(lang) {
    const map = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN',
      'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
      'kn': 'kn-IN', 'ml': 'ml-IN', 'or': 'or-IN', 'pa': 'pa-IN',
      'as': 'as-IN', 'mai': 'hi-IN', 'sa': 'sa-IN'
    };
    return map[lang] || 'en-IN';
  }

  function startSpeechRecognition() {
    if (recognition) {
      recognition.lang = getSpeechLang(getLang());
      try { recognition.start(); } catch (e) {}
    }
  }

  function stopSpeechRecognition() {
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  // Voice Transcript UI
  function showVoiceTranscript(text, isError) {
    voiceTranscript.textContent = text;
    voiceTranscript.className = 'voice-transcript' + (isError ? ' error' : '');
    voiceTranscript.style.display = 'block';
  }

  function hideVoiceTranscript() {
    voiceTranscript.style.display = 'none';
    voiceTranscript.textContent = '';
  }

  // Audio Player
  function setupAudioPlayer(playerEl) {
    const audioUrl = playerEl.dataset.audio;
    const playBtn = playerEl.querySelector('.play-btn');
    const playIcon = playerEl.querySelector('.play-icon');
    const pauseIcon = playerEl.querySelector('.pause-icon');
    const waveContainer = playerEl.querySelector('.wave-container');

    let audio = new Audio(audioUrl);
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    audio.addEventListener('play', () => {
      isPlaying = true;
      playBtn.classList.add('playing');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      waveContainer.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      playBtn.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      waveContainer.classList.remove('playing');
    });

    audio.addEventListener('ended', () => {
      isPlaying = false;
      playBtn.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      waveContainer.classList.remove('playing');
    });

    audio.addEventListener('error', () => {
      console.error('Audio playback error');
    });
  }

  // Utilities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatDuration(seconds) {
    if (!seconds || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // Service Worker
  function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js').catch(() => {});
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();