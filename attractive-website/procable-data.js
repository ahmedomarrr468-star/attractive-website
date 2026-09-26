/**
 * Attractive Light Current & Security Systems - Shared Data & State Core
 * Integrated Solutions: CCTV Surveillance, Fire Alarms, Commercial Sound & PA, Nurse Call & Intercom, Structured Cabling.
 * Full Dynamic Bilingual System (AR/EN), Admin Controls, Image Uploads, Shortcuts, and Security.
 */

// --- 1. SVG Vector Icons for Connectors & Hardware ---
const PRO_SVGS = {
    'rj45': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="30" width="55" height="40" rx="4" fill="#3D3D3F"/><rect x="70" y="38" width="15" height="24" rx="2" fill="#C8102E"/><path d="M25 40 L25 60 M31 40 L31 60 M37 40 L37 60 M43 40 L43 60 M49 40 L49 60 M55 40 L55 60 M61 40 L61 60" stroke="#FBBF24" stroke-width="2"/><path d="M40 70 L60 70 L55 82 L45 82 Z" fill="#6E6E73"/></svg>`,
    'bnc': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="10" y="38" width="45" height="24" rx="3" fill="#3D3D3F"/><circle cx="70" cy="50" r="18" fill="#1D1D1F" stroke="#6E6E73" stroke-width="2"/><circle cx="70" cy="50" r="8" fill="#E8E8ED"/><circle cx="70" cy="50" r="3" fill="#FBBF24"/><rect x="85" y="47" width="6" height="6" fill="#C8102E"/></svg>`,
    'phoenix': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="32" width="65" height="36" rx="4" fill="#166534"/><circle cx="32" cy="45" r="4" fill="#E8E8ED" stroke="#1D1D1F"/><circle cx="48" cy="45" r="4" fill="#E8E8ED" stroke="#1D1D1F"/><circle cx="64" cy="45" r="4" fill="#E8E8ED" stroke="#1D1D1F"/><rect x="26" y="55" width="12" height="8" rx="1" fill="#22C55E"/><rect x="42" y="55" width="12" height="8" rx="1" fill="#22C55E"/><rect x="58" y="55" width="12" height="8" rx="1" fill="#22C55E"/></svg>`,
    'dc-jack': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="12" y="42" width="48" height="16" rx="3" fill="#1D1D1F"/><rect x="60" y="44" width="26" height="12" rx="1" fill="#E8E8ED"/><circle cx="86" cy="50" r="4" fill="#FBBF24"/><rect x="50" y="41" width="10" height="18" rx="1" fill="#C8102E"/></svg>`,
    'hdmi': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="10" y="36" width="50" height="28" rx="3" fill="#1D1D1F"/><path d="M60 40 L85 40 L88 47 L88 53 L85 60 L60 60 Z" fill="#FBBF24"/><rect x="65" y="46" width="16" height="8" fill="#1D1D1F"/></svg>`,
    'fiber-sc': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="12" y="36" width="55" height="28" rx="2" fill="#2563EB"/><rect x="67" y="42" width="18" height="16" rx="1" fill="#1E40AF"/><rect x="85" y="47" width="7" height="6" fill="#FFFFFF"/><circle cx="92" cy="50" r="1.5" fill="#EF4444"/></svg>`,
    'speakon': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="35" width="55" height="30" rx="4" fill="#1D1D1F"/><circle cx="42" cy="50" r="6" fill="var(--primary-color, #C8102E)"/><rect x="70" y="42" width="14" height="16" rx="2" fill="#3D3D3F"/></svg>`,
    'xlr-m': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="10" y="38" width="50" height="24" rx="4" fill="#3D3D3F"/><rect x="60" y="32" width="25" height="36" rx="3" fill="#1D1D1F"/><circle cx="25" cy="45" r="3" fill="#ffffff"/><circle cx="25" cy="55" r="3" fill="#ffffff"/><circle cx="38" cy="50" r="3" fill="#ffffff"/><path d="M85 45 L95 45 M85 50 L95 50 M85 55 L95 55" stroke="var(--primary-color, #C8102E)" stroke-width="2.5"/></svg>`,
    'xlr-f': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="10" y="38" width="50" height="24" rx="4" fill="#3D3D3F"/><rect x="60" y="32" width="25" height="36" rx="3" fill="#1D1D1F"/><circle cx="75" cy="45" r="2.5" fill="#ffffff" stroke="#6E6E73"/><circle cx="75" cy="55" r="2.5" fill="#ffffff" stroke="#6E6E73"/><circle cx="68" cy="50" r="2.5" fill="#ffffff" stroke="#6E6E73"/></svg>`,
    'trs': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="42" width="45" height="16" rx="3" fill="#3D3D3F"/><rect x="60" y="45" width="10" height="10" fill="#E8E8ED"/><path d="M70 47 L90 47 L95 50 L90 53 L70 53 Z" fill="var(--primary-color, #C8102E)"/><line x1="77" y1="47" x2="77" y2="53" stroke="#1D1D1F" stroke-width="1.5"/><line x1="84" y1="47" x2="84" y2="53" stroke="#1D1D1F" stroke-width="1.5"/></svg>`,
    'ts': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="42" width="45" height="16" rx="3" fill="#3D3D3F"/><rect x="60" y="45" width="10" height="10" fill="#E8E8ED"/><path d="M70 47 L90 47 L95 50 L90 53 L70 53 Z" fill="var(--primary-color, #C8102E)"/><line x1="82" y1="47" x2="82" y2="53" stroke="#1D1D1F" stroke-width="1.5"/></svg>`,
    'aux': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="44" width="40" height="12" rx="3" fill="#3D3D3F"/><rect x="55" y="47" width="8" height="6" fill="#E8E8ED"/><path d="M63 47.5 L84 47.5 L88 50 L84 52.5 L63 52.5 Z" fill="var(--primary-color, #C8102E)"/><line x1="72" y1="47.5" x2="72" y2="52.5" stroke="#1D1D1F" stroke-width="1.5"/><line x1="79" y1="47.5" x2="79" y2="52.5" stroke="#1D1D1F" stroke-width="1.5"/></svg>`,
    'rca': `<svg viewBox="0 0 100 100" class="h-full w-auto" aria-hidden="true"><rect x="15" y="40" width="40" height="20" rx="4" fill="var(--primary-color, #C8102E)"/><circle cx="75" cy="50" r="4" fill="#E8E8ED"/><rect x="55" y="46" width="12" height="8" rx="1" fill="#c1c6d5"/></svg>`
};

// --- 2. Categories Default List (Light Current Systems) ---
const DEFAULT_CATEGORIES = [
    { id: 'all', nameAr: 'الكل', nameEn: 'All', icon: 'apps', hidden: false },
    { id: 'cctv', nameAr: 'كاميرات المراقبة و NVR', nameEn: 'CCTV & Surveillance', icon: 'videocam', hidden: false },
    { id: 'fire-alarm', nameAr: 'أنظمة إنذار الحريق', nameEn: 'Fire Alarm Systems', icon: 'local_fire_department', hidden: false },
    { id: 'sound-pa', nameAr: 'أنظمة الصوت والإذاعة', nameEn: 'Sound & PA Systems', icon: 'volume_up', hidden: false },
    { id: 'nurse-call', nameAr: 'الاستدعاء والإنتركم', nameEn: 'Nurse Call & Intercom', icon: 'call', hidden: false },
    { id: 'cables', nameAr: 'كابلات وبنية تحتية', nameEn: 'Cables & Infrastructure', icon: 'cable', hidden: false }
];

// --- 3. Default Products with Sorting, Discounts & Badges ---
const DEFAULT_PRODUCTS = [
    {
        id: 101,
        nameAr: "كاميرا مراقبة IP بدقة 8MP 4K ذكاء اصطناعي (رؤية ليلية ملونة)",
        nameEn: "4K 8MP AI PoE IP Surveillance Camera (Color Night Vision)",
        descAr: "عدسة عريضة 2.8mm، ميكروفون مدمج، مقاومة للعوامل الجوية IP67، كشف حركة الأشخاص والمركبات بالذكاء الاصطناعي.",
        descEn: "2.8mm wide lens, built-in mic, IP67 weatherproof, AI human & vehicle detection.",
        category: "cctv",
        tag: "IP 4K PoE",
        price: 1850,
        originalPrice: 2200,
        sortOrder: 1,
        featured: true,
        badge: "bestseller",
        image: "",
        icon: "rj45",
        inStock: true,
        hidden: false,
        datasheet: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        datasheetType: "pdf"
    },
    {
        id: 102,
        nameAr: "جهاز تسجيل شبكي NVR سعة 16 قناة 4K مع سويتش PoE مدمج",
        nameEn: "16-Channel 4K NVR with Built-in PoE Switch",
        descAr: "يدعم حتى 16 كاميرا بدقة 8MP، هارد ديسك حتى 16TB، ضغط فيديو H.265+ ومتابعة سحابية عبر الموبايل مجاناً.",
        descEn: "Supports up to 16x 8MP cameras, up to 16TB HDD, H.265+ compression, free mobile app cloud viewing.",
        category: "cctv",
        tag: "NVR 16CH PoE",
        price: 4200,
        originalPrice: 4800,
        sortOrder: 2,
        featured: true,
        badge: "choice",
        image: "",
        icon: "rj45",
        inStock: true,
        hidden: false,
        datasheet: "logo.png",
        datasheetType: "image"
    },
    {
        id: 103,
        nameAr: "لوحة تحكم إنذار حريق معنونة أوتوماتيكية 2 لوب (Addressable Panel)",
        nameEn: "2-Loop Intelligent Addressable Fire Alarm Control Panel",
        descAr: "تدعم حتى 500 نقطة وكاشف، شاشة لمس ملونة، بطاريات طوارئ تدوم 24 ساعة، معتمدة ومطابقة للمواصفات الدولية.",
        descEn: "Supports up to 500 addressable points, LCD touchscreen, 24h backup batteries, fully certified.",
        category: "fire-alarm",
        tag: "Addressable 2-Loop",
        price: 12500,
        originalPrice: 14000,
        sortOrder: 3,
        featured: true,
        badge: "bestseller",
        image: "",
        icon: "phoenix",
        inStock: true
    },
    {
        id: 104,
        nameAr: "كاشف دخان ضوئي ذكي مع قاعدة معنونة",
        nameEn: "Intelligent Optical Smoke Detector with Addressable Base",
        descAr: "حساسية فائقة للحرائق المبكرة بدون إنذارات خاطئة، مؤشر ليد مزدوج 360 درجة، سهولة التركيب والصيانة.",
        descEn: "High-sensitivity early fire detection, zero false alarms, 360-degree dual LED indicator.",
        category: "fire-alarm",
        tag: "Optical Smoke",
        price: 480,
        originalPrice: 550,
        sortOrder: 4,
        featured: true,
        badge: "new",
        image: "",
        icon: "phoenix",
        inStock: true
    },
    {
        id: 105,
        nameAr: "مكبر صوت إذاعة داخلية وسوند سيستم 240W مع بلوتوث و 6 زونات",
        nameEn: "240W Commercial PA Mixer Amplifier with Bluetooth & 6 Zones",
        descAr: "خرج 70V/100V وسماعات مونو/استريو، مدخلات مايكروفون ذات أولوية للبث في الطوارئ، راديو ومدخل USB/SD.",
        descEn: "70V/100V commercial output, priority paging mic inputs, Bluetooth, FM, USB/SD media player.",
        category: "sound-pa",
        tag: "PA Amp 240W",
        price: 5400,
        originalPrice: 6200,
        sortOrder: 5,
        featured: true,
        badge: "choice",
        image: "",
        icon: "aux",
        inStock: true
    },
    {
        id: 106,
        nameAr: "سماعة سقفية جبسية هاي فاي Hi-Fi 30W ذات وضوح صوتي عالي",
        nameEn: "30W Premium In-Ceiling Hi-Fi Architectural Speaker",
        descAr: "محول داخلي 100V/70V، استجابة ترددية نقية للقرآن والموسيقى الخلفية والنداء، شبك مغناطيسي بدون إطار أنيق.",
        descEn: "Built-in 100V/70V transformer, pure acoustic frequency response for BGM and paging, frameless magnetic grill.",
        category: "sound-pa",
        tag: "Ceiling 30W",
        price: 650,
        originalPrice: 750,
        sortOrder: 6,
        featured: false,
        badge: "sale",
        image: "",
        icon: "speakon",
        inStock: true
    },
    {
        id: 107,
        nameAr: "محطة استدعاء ممرضات رقمية رئيسية Master Station (32 سرير)",
        nameEn: "32-Bed Digital Nurse Call Master Station",
        descAr: "شاشة عرض رقمية لغرف وأسرة المرضى، اتصال صوتي ثنائي الاتجاه بدون تشويش، سجل إلكتروني لزمن الاستجابة.",
        descEn: "Digital LED display for rooms & beds, crystal-clear 2-way audio intercom, response time logging.",
        category: "nurse-call",
        tag: "Nurse Call Master",
        price: 8900,
        originalPrice: 9800,
        sortOrder: 7,
        featured: true,
        badge: "bestseller",
        image: "",
        icon: "phoenix",
        inStock: true
    },
    {
        id: 108,
        nameAr: "إنتركم مرئي ذكي IP مع شاشة لمس 7 إنش وكاميرا عريضة",
        nameEn: "Smart IP Video Intercom with 7\" Touch Screen & Wide Angle Camera",
        descAr: "فتح الأبواب عن بعد، ربط عبر الواي فاي وتطبيق الموبايل، كاميرا مضادة للكسر ورؤية ليلية بالأشعة تحت الحمراء.",
        descEn: "Remote door unlock, Wi-Fi & mobile app integration, vandal-resistant camera with IR night vision.",
        category: "nurse-call",
        tag: "IP Intercom 7-inch",
        price: 3400,
        originalPrice: 3900,
        sortOrder: 8,
        featured: false,
        badge: "new",
        image: "",
        icon: "rj45",
        inStock: true
    },
    {
        id: 109,
        nameAr: "لفة كابل شبكات Cat6 UTP نحاس نقي خامل للهب (305 متر)",
        nameEn: "Cat6 UTP Pure Bare Copper Network Cable Roll (305m)",
        descAr: "نحاس صامت 23AWG خالي من السبائك، سرعة نقل حتى 10Gbps، مثالي لشبكات الداتا وكاميرات المراقبة PoE.",
        descEn: "100% Solid 23AWG Bare Copper, supports up to 10Gbps, optimal for PoE surveillance and gigabit data.",
        category: "cables",
        tag: "Cat6 Pure Copper",
        price: 3100,
        originalPrice: 3500,
        sortOrder: 9,
        featured: true,
        badge: "choice",
        image: "",
        icon: "rj45",
        inStock: true
    },
    {
        id: 110,
        nameAr: "لفة كابل إنذار حريق مقاوم للهب معتمد 2x1.5mm شيلد (100 متر)",
        nameEn: "Certified Fire-Resistant Shielded Cable 2x1.5mm Roll (100m)",
        descAr: "مقاوم لدرجات الحرارة العالية واللهب المباشر حتى 950 درجة مئوية، عزل سيليكون أحمر مطابق للمواصفات القياسية.",
        descEn: "Withstands direct fire up to 950°C, certified red silicone jacket for critical life-safety circuits.",
        category: "cables",
        tag: "Fire-Resistant 2x1.5",
        price: 2200,
        originalPrice: 2500,
        sortOrder: 10,
        featured: false,
        badge: "sale",
        image: "",
        icon: "phoenix",
        inStock: true
    }
];

const DEFAULT_CONNECTORS = [
    { id: 'xlr-m', nameAr: 'XLR ذكر', nameEn: 'XLR Male', price: 90, image: '', descAr: 'موصل XLR ذكر احترافي مطلي بالذهب لتوصيل الميكروفونات وأجهزة المكسر', descEn: 'Pro gold-plated male XLR plug for microphones and studio mixers', icon: 'xlr-m' },
    { id: 'xlr-f', nameAr: 'XLR نتاية', nameEn: 'XLR Female', price: 90, image: '', descAr: 'موصل XLR نتاية احترافي بنقاط تلامس برونزية لتقليل المقاومة', descEn: 'Pro female XLR connector with phosphor bronze contacts for low resistance', icon: 'xlr-f' },
    { id: 'trs', nameAr: 'جاك TRS (استريو)', nameEn: '1/4" TRS Jack Stereo/Balanced', price: 75, image: '', descAr: 'جاك 6.35 ملم متوازن ثلاثي الأقطاب لتوصيل السماعات المونيتور وكروت الصوت', descEn: 'Balanced 6.35mm stereo jack for studio monitors and audio interfaces', icon: 'trs' },
    { id: 'ts', nameAr: 'جاك TS (مونو)', nameEn: '1/4" TS Jack Mono/Instrument', price: 65, image: '', descAr: 'جاك 6.35 ملم أحادي القطب فائق المتانة للآلات الموسيقية والجيتار', descEn: 'Heavy-duty 6.35mm mono jack for electric guitars, keyboards, and pedals', icon: 'ts' },
    { id: 'aux', nameAr: 'جاك 3.5mm Mini', nameEn: '3.5mm Mini Jack Aux', price: 45, image: '', descAr: 'موصل ميني جاك 3.5 ملم مذهب للهواتف واللابتوب وتطبيقات الاستماع', descEn: 'Gold-plated 3.5mm stereo mini-plug for smartphones, laptops, and IEMs', icon: 'aux' },
    { id: 'rca', nameAr: 'جاك RCA', nameEn: 'RCA Phono Connector', price: 50, image: '', descAr: 'موصل RCA مذهب عالي الجودة لأجهزة الدي جي وأجهزة الهاي فاي المنزلية', descEn: 'High-end gold RCA phono plug for DJ controllers and Hi-Fi gear', icon: 'rca' },
    { id: 'speakon', nameAr: 'سبيكون Speakon', nameEn: 'Neutrik Speakon PA', price: 110, image: '', descAr: 'موصل سبيكون احترافي تيار عالي بمقبض أمان للمكبرات وسماعات الحفلات', descEn: 'Heavy-duty quick-lock connector for PA speaker cabinets and high-current amps', icon: 'speakon' }
];

const DEFAULT_CABLES = [
    { 
        id: 'ofc-pure', 
        nameAr: 'نحاس نقي خالي من الأكسجين (OFC)', 
        nameEn: 'Pure Oxygen-Free Copper (OFC 99.99%)', 
        descAr: 'أعلى نقاء واستجابة ترددية لاستوديوهات التسجيل الاحترافية وتطبيقات الميكروفون الحساسة',
        descEn: 'Ultra-pure 99.99% OFC conductors for maximum signal clarity & zero high-end roll-off',
        pricePerM: 30, 
        popular: true 
    },
    { 
        id: 'ofc-standard', 
        nameAr: 'نحاس OFC قياسي معزول', 
        nameEn: 'Standard Shielded OFC Instrument Cable', 
        descAr: 'للاستخدام اليومي والمسارح والحفلات والربط الميداني مع تدريع مضاد للتداخلات',
        descEn: 'Durable multi-strand copper with dense spiral shielding for stage touring & live rigs',
        pricePerM: 20, 
        popular: false 
    }
];

const DEFAULT_SHIPPING = [
    { id: 'cairo',       nameAr: 'القاهرة',          nameEn: 'Cairo',          fee: 45,  enabled: true, deliveryTimeAr: 'خلال 24-48 ساعة',  deliveryTimeEn: '24–48 hours',   notes: '' },
    { id: 'giza',        nameAr: 'الجيزة',           nameEn: 'Giza',           fee: 45,  enabled: true, deliveryTimeAr: 'خلال 24-48 ساعة',  deliveryTimeEn: '24–48 hours',   notes: '' },
    { id: 'qalyubia',    nameAr: 'القليوبية',        nameEn: 'Qalyubia',       fee: 50,  enabled: true, deliveryTimeAr: 'خلال 24-48 ساعة',  deliveryTimeEn: '24–48 hours',   notes: '' },
    { id: 'alex',        nameAr: 'الإسكندرية',     nameEn: 'Alexandria',     fee: 60,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'beheira',     nameAr: 'البحيرة',          nameEn: 'Beheira',        fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'kafr-sheikh', nameAr: 'كفر الشيخ',       nameEn: 'Kafr El-Sheikh', fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'gharbia',     nameAr: 'الغربية',          nameEn: 'Gharbia',        fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'menofia',     nameAr: 'المنوفية',         nameEn: 'Menofia',        fee: 60,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'dakahlia',    nameAr: 'الدقهلية',         nameEn: 'Dakahlia',       fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'sharqia',     nameAr: 'الشرقية',          nameEn: 'Sharqia',        fee: 60,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'damietta',    nameAr: 'دمياط',            nameEn: 'Damietta',       fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'port-said',   nameAr: 'بورسعيد',         nameEn: 'Port Said',      fee: 70,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'ismailia',    nameAr: 'الإسماعيلية',     nameEn: 'Ismailia',       fee: 65,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'suez',        nameAr: 'السويس',           nameEn: 'Suez',           fee: 70,  enabled: true, deliveryTimeAr: 'خلال 2-3 أيام',    deliveryTimeEn: '2–3 days',      notes: '' },
    { id: 'north-sinai', nameAr: 'شمال سيناء',      nameEn: 'North Sinai',    fee: 85,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'south-sinai', nameAr: 'جنوب سيناء',      nameEn: 'South Sinai',    fee: 90,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'beni-suef',   nameAr: 'بني سويف',        nameEn: 'Beni Suef',      fee: 70,  enabled: true, deliveryTimeAr: 'خلال 2-4 أيام',    deliveryTimeEn: '2–4 days',      notes: '' },
    { id: 'faiyum',      nameAr: 'الفيوم',           nameEn: 'Faiyum',         fee: 70,  enabled: true, deliveryTimeAr: 'خلال 2-4 أيام',    deliveryTimeEn: '2–4 days',      notes: '' },
    { id: 'minya',       nameAr: 'المنيا',           nameEn: 'Minya',          fee: 75,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'asyut',       nameAr: 'أسيوط',           nameEn: 'Asyut',          fee: 80,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'sohag',       nameAr: 'سوهاج',           nameEn: 'Sohag',          fee: 80,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'qena',        nameAr: 'قنا',             nameEn: 'Qena',           fee: 85,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'luxor',       nameAr: 'الأقصر',          nameEn: 'Luxor',          fee: 85,  enabled: true, deliveryTimeAr: 'خلال 3-5 أيام',    deliveryTimeEn: '3–5 days',      notes: '' },
    { id: 'aswan',       nameAr: 'أسوان',           nameEn: 'Aswan',          fee: 90,  enabled: true, deliveryTimeAr: 'خلال 4-6 أيام',    deliveryTimeEn: '4–6 days',      notes: '' },
    { id: 'red-sea',     nameAr: 'البحر الأحمر',    nameEn: 'Red Sea',        fee: 95,  enabled: true, deliveryTimeAr: 'خلال 4-6 أيام',    deliveryTimeEn: '4–6 days',      notes: '' },
    { id: 'new-valley',  nameAr: 'الوادي الجديد',   nameEn: 'New Valley',     fee: 100, enabled: true, deliveryTimeAr: 'خلال 5-7 أيام',    deliveryTimeEn: '5–7 days',      notes: '' },
    { id: 'matrouh',     nameAr: 'مطروح',           nameEn: 'Matrouh',        fee: 100, enabled: true, deliveryTimeAr: 'خلال 5-7 أيام',    deliveryTimeEn: '5–7 days',      notes: '' }
];

// --- 4. Order Tracking Stages Metadata ---
const ORDER_STAGES = {
    received: {
        step: 1,
        percent: 33,
        labelAr: 'تم استلام الطلب',
        labelEn: 'Order Received',
        icon: 'inventory_2',
        badgeClass: 'bg-blue-100 text-blue-700',
        descAr: 'تم استلام طلبك ومراجعته وتأكيد المواصفات الفنية وجدولته للتوريد والتجهيز.',
        descEn: 'Your order was received, confirmed, and queued for supply & assembly.'
    },
    processing: {
        step: 2,
        percent: 66,
        labelAr: 'جاري التجهيز والبرمجة',
        labelEn: 'In Configuration & Assembly',
        icon: 'tune',
        badgeClass: 'bg-amber-100 text-amber-800',
        descAr: 'فريق المهندسين والفنيين يقوم الآن بفحص وبرمجة الأجهزة وتجهيز التوصيلات واختبارات الجودة.',
        descEn: 'Our technical team is configuring, testing, and preparing your system equipment.'
    },
    shipped: {
        step: 3,
        percent: 100,
        labelAr: 'تم الشحن والتسليم',
        labelEn: 'Shipped & Out for Delivery',
        icon: 'local_shipping',
        badgeClass: 'bg-green-100 text-green-800',
        descAr: 'تم تسليم الشحنة لمندوب شركة الشحن وهي في طريقها إلى موقعكم الآن.',
        descEn: 'Your equipment is securely packaged and en route to your location.'
    }
};

// --- 5. Default Orders for Initial Tracking Demo ---
const DEFAULT_ORDERS = [
    {
        id: 'ATT-101',
        customerName: 'م/ أحمد علي',
        customerPhone: '01012345678',
        governorate: 'القاهرة',
        addressDetails: 'مدينة نصر - مستشفى الشروق التخصصي',
        items: [{ name: 'كاميرا مراقبة IP بدقة 8MP 4K ذكاء اصطناعي (عدد 4)', qty: 4, price: 1850 }],
        total: 7445,
        deposit: 2200,
        remaining: 5245,
        status: 'shipped',
        date: '2026-09-15',
        notes: 'تم تسليم الشحنة لشركة الشحن مع كابلات الشبكات والتوصيل'
    },
    {
        id: 'ATT-102',
        customerName: 'سارة محمود',
        customerPhone: '01123456789',
        governorate: 'الإسكندرية',
        addressDetails: 'برج العرب - مصنع الدلتا للصناعات',
        items: [{ name: 'مكبر صوت إذاعة وسوند سيستم 240W مع 8 سماعات سقفية', qty: 1, price: 10600 }],
        total: 10660,
        deposit: 3000,
        remaining: 7660,
        status: 'processing',
        date: '2026-09-18',
        notes: 'جاري برمجة زونات الصوت واختبار محولات الـ 100V'
    },
    {
        id: 'ATT-103',
        customerName: 'ياسين إبراهيم',
        customerPhone: '01234567890',
        governorate: 'الجيزة',
        addressDetails: 'المهندسين - مبنى شركة جلوبال تك',
        items: [{ name: 'لوحة إنذار حريق معنونة 2 لوب + 12 كاشف دخان', qty: 1, price: 18260 }],
        total: 18305,
        deposit: 5000,
        remaining: 13305,
        status: 'received',
        date: '2026-09-22',
        notes: 'تم تأكيد طلب التوريد وتحديد موعد المعاينة الفنية'
    }
];

// --- 6. VIP Customer Club Default Members ---
const DEFAULT_MEMBERS = [
    {
        id: 'vip-101',
        name: 'م/ أحمد علي',
        email: 'ahmed.security@gmail.com',
        phone: '01012345678',
        registeredAt: '2026-09-02',
        perksActive: true,
        customCoupon: 'VIP-AHMED',
        notes: 'مدير الإدارة الهندسية - مستشفى الشروق'
    },
    {
        id: 'vip-102',
        name: 'سارة محمود',
        email: 'sarah.safety@delta-ind.com',
        phone: '01123456789',
        registeredAt: '2026-09-06',
        perksActive: true,
        customCoupon: 'ATTRACTIVE10',
        notes: 'مدير السلامة والأمن الصناعي'
    }
];

// --- 6.5 User Accounts System (Sign Up/Sign In) ---
const DEFAULT_USER_ACCOUNTS = [
    {
        id: 'acc-1',
        email: 'projects@contractor.com',
        passwordEncoded: btoa('123456'),
        name: 'م/ طارق الشريف',
        phone: '01099887766',
        registeredAt: '2026-09-01T10:00:00Z',
        active: true,
        customCoupon: 'TAREK15',
        freeShipping: true,
        discountPercent: 15,
        customPerks: ['شحن مجاني دائم', 'ضمان ذهبي ممتد لسنتين مجاناً', 'أولوية شحن وتجهيز خلال 24 ساعة', 'معاينة مجانية للمشروعات'],
        notes: 'استشاري نظم أمنية وتيار خفيف - عميل بلاتيني'
    },
    {
        id: 'acc-2',
        email: 'procurement@hospital.org',
        passwordEncoded: btoa('123456'),
        name: 'أحمد نبيل',
        phone: '01122334455',
        registeredAt: '2026-09-05T12:00:00Z',
        active: true,
        customCoupon: 'HOSPITAL10',
        freeShipping: true,
        discountPercent: 10,
        customPerks: ['شحن مجاني على كافة المحافظات', 'دعم فني وصيانة موقعية دورية'],
        notes: 'مسؤول المشتريات والتجهيزات الطبية'
    }
];

// --- 7. Top Navigation Bar Default Items (100% Admin Managed) ---
const DEFAULT_NAV_ITEMS = [
    { id: 'nav-home', titleAr: 'الرئيسية', titleEn: 'Home', url: 'index.html', active: true, order: 1, openInNewTab: false, badgeAr: '', badgeEn: '', hasMegaMenu: false, megaMenuColumns: [] },
    { id: 'nav-store', titleAr: 'المتجر والأنظمة', titleEn: 'Store & Systems', url: 'store.html', active: true, order: 2, openInNewTab: false, badgeAr: '', badgeEn: '',
        hasMegaMenu: true,
        megaMenuColumns: [
            {
                id: 'col-categories', headingAr: 'الأنظمة والحلول', headingEn: 'Systems & Solutions',
                items: [
                    { id: 'mm-cat-all',        labelAr: 'كافة الأجهزة والأنظمة', labelEn: 'All Systems',          url: 'store.html',                  showImage: false, showPrice: false },
                    { id: 'mm-cat-cctv',       labelAr: 'كاميرات المراقبة',       labelEn: 'CCTV Surveillance',    url: 'store.html?cat=cctv',         showImage: false, showPrice: false },
                    { id: 'mm-cat-fire',       labelAr: 'إنذار الحريق',           labelEn: 'Fire Alarm',           url: 'store.html?cat=fire-alarm',   showImage: false, showPrice: false },
                    { id: 'mm-cat-sound',      labelAr: 'أنظمة الصوت والإذاعة',   labelEn: 'Sound & PA Systems',   url: 'store.html?cat=sound-pa',     showImage: false, showPrice: false },
                    { id: 'mm-cat-nurse',      labelAr: 'الاستدعاء والإنتركم',    labelEn: 'Nurse Call & Intercom', url: 'store.html?cat=nurse-call',  showImage: false, showPrice: false },
                    { id: 'mm-cat-cables',     labelAr: 'كابلات وبنية تحتية',     labelEn: 'Cables & Network',     url: 'store.html?cat=cables',       showImage: false, showPrice: false },
                    { id: 'mm-cat-sale',       labelAr: 'عروض وخصومات 🔥',        labelEn: 'Sale & Deals 🔥',       url: 'store.html?cat=sale',         showImage: false, showPrice: false }
                ]
            },
            {
                id: 'col-services', headingAr: 'الخدمات الهندسية', headingEn: 'Engineering Services',
                items: [
                    { id: 'mm-svc-builder',  labelAr: 'مهندس التوصيلات والكابلات', labelEn: 'Link Configurator',   url: 'builder.html',                 showImage: false, showPrice: false },
                    { id: 'mm-svc-repair',   labelAr: 'مركز التركيبات والصيانة',   labelEn: 'Install & Maintenance', url: 'index.html#repairSection',   showImage: false, showPrice: false },
                    { id: 'mm-svc-consult',  labelAr: 'طلب مقايسة فنية ومعاينة',    labelEn: 'Technical Survey & BOQ', url: 'index.html#contactSection', showImage: false, showPrice: false }
                ]
            }
        ]
    },
    { id: 'nav-sale', titleAr: 'خصومات 🔥', titleEn: 'Sale 🔥', url: 'store.html?cat=sale', active: true, isSaleItem: true, order: 3, openInNewTab: false, badgeAr: '', badgeEn: '', hasMegaMenu: false, megaMenuColumns: [] },
    { id: 'nav-builder', titleAr: 'توصيلات التيار الخفيف', titleEn: 'System Cabling', url: 'builder.html', active: true, isServicesDropdown: true, order: 4, openInNewTab: false, badgeAr: '', badgeEn: '', hasMegaMenu: false, megaMenuColumns: [] },
    { id: 'nav-reviews', titleAr: 'آراء العملاء', titleEn: 'Reviews', url: 'index.html#reviewsSection', active: true, order: 5, openInNewTab: false, badgeAr: '', badgeEn: '', hasMegaMenu: false, megaMenuColumns: [] },
    { id: 'nav-contact', titleAr: 'تواصل معنا', titleEn: 'Contact Us', url: 'index.html#contactSection', active: true, order: 6, openInNewTab: false, badgeAr: '', badgeEn: '', hasMegaMenu: false, megaMenuColumns: [] }
];

const DEFAULT_SETTINGS = {
    // Branding & Identity
    siteName: "Attractive",
    brandTitleAr: "Attractive - أنظمة التيار الخفيف والأمن والمراقبة المتكاملة",
    brandTitleEn: "Attractive - Integrated Light Current & Security Systems",
    logoImage: "logo.png",
    primaryColor: "#C8102E", // Editable Site Theme Color!

    // Full Website Wallpaper & Background (Single or Multiple Images / GIF + Slideshow)
    siteBackgrounds: [], // Array of image/GIF URLs: ['url1', 'url2', ...]
    siteBgSlideshow: true,
    siteBgInterval: 8, // Seconds per background slide
    siteBgOverlayOpacity: 85, // 0 to 100% overlay opacity
    siteBgBlur: 0, // 0 to 20px blur
    siteBgOverlayColor: "light", // "light" | "dark" | "clear"

    // Footer Rights & Copyright (100% Admin Editable)
    copyrightYear: "2026",
    copyrightTextAr: "جميع الحقوق محفوظة لـ Attractive لأنظمة التيار الخفيف وحلول الأمن والسلامة.",
    copyrightTextEn: "All rights reserved to Attractive Light Current & Security Solutions.",

    // Policies: Privacy & Data Protection (100% Admin Editable)
    privacyPolicyTitleAr: "سياسة الخصوصية وسرية البيانات",
    privacyPolicyTitleEn: "Privacy & Data Protection Policy",
    privacyPolicyContentAr: `في Attractive، نولي سرية معلوماتك وثقتك بنا أهمية قصوى:
1. جمع البيانات: نجمع فقط المعلومات الضرورية لمعالجة وتوصيل طلبياتك ومقايسات المشروعات (الاسم، رقم الموبايل/الواتساب، العنوان، والبريد الإلكتروني للعملاء المميزين).
2. سرية المعلومات: نلتزم التزاماً تاماً بعدم مشاركة أو بيع أي من بياناتك لأي طرف ثالث، وتُشارك بيانات الشحن فقط مع شركة الشحن المعتمدة لتسليم أوردرك.
3. المعاملات المالية الآمنة: جميع التحويلات الإلكترونية (إنستا باي والمحافظ الإلكترونية) تتم عبر القنوات الرسمية المعترف بها في مصر، ولا نحتفظ بأي بيانات مالية حساسة.
4. التواصل والإشعارات: يُستخدم رقمك وبريدك فقط لتزويدك بتحديثات تتبع التوريد أو إرسال عروض الأسعار والخصومات الحصرية الممنوحة لمشروعك.`,
    privacyPolicyContentEn: `At Attractive, your privacy and trust are paramount:
1. Data Collection: We collect only data strictly necessary to fulfill and deliver your system orders & project BOQs (Full name, Phone/WhatsApp, Delivery address, and Email for VIP members).
2. Absolute Confidentiality: We will never sell or share your personal information. Shipping details are shared solely with our verified logistics courier.
3. Safe Transactions: Payments via InstaPay and digital wallets are conducted through official channels; no sensitive banking credentials are stored.
4. Notifications: Your contact info is strictly used to notify you of order delivery milestones and exclusive project discounts.`,

    // Policies: Return, Replacement & Warranty (100% Admin Editable)
    returnPolicyTitleAr: "سياسة الاستبدال، الاسترجاع والضمان",
    returnPolicyTitleEn: "Return, Replacement & Warranty Policy",
    returnPolicyContentAr: `ثقتكم وأمان منشآتكم هو التزامنا الدائم:
1. ضمان لمدة عامين كاملين: تخضع جميع أجهزة وأنظمة Attractive المعتمدة لضمان استبدال وصيانة معتمد ضد عيوب الصناعة.
2. الاسترجاع والاستبدال للأجهزة والمنتجات: يحق للعميل استبدال أو إرجاع أي جهاز خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون في حالته الأصلية وبكرتونته وملحقاته وبدون تلف خارجي.
3. التوصيلات والكابلات المجهزة بالطلب: نظراً لتجهيزها بمقاسات وأطراف محددة لكل مشروع، يتاح فحصها وإعادة ضبطها مجاناً أو استبدالها في حال وجود أي عيب مصنعي أو اختلاف عن المواصفات المطلوبة.
4. فحص الشحنة: يحق للعميل معاينة سلامة الأجهزة والشهادات مع مندوب شركة الشحن قبل الاستلام.`,
    returnPolicyContentEn: `Reliability and total security are our commitment:
1. Two-Year Warranty: All Attractive certified systems include a 2-year warranty against manufacturing defects.
2. Store Returns: Unused boxed equipment may be returned or exchanged within 14 days of delivery in pristine condition.
3. Custom Cabling & Links: Prepared to your exact meter and connector specs, returns are valid for warranty repair, recalibration, or replacement in case of defects.
4. Delivery Inspection: You are welcomed to physically inspect equipment and certifications upon courier handover.`,

    // About Us (Story, Craftsmanship, Photos & Badges - 100% Admin Editable)
    aboutTitleAr: "عن Attractive — رواد هندسة أنظمة التيار الخفيف والأمن المتكامل",
    aboutTitleEn: "About Attractive — Leaders in Light Current & Smart Security",
    aboutStoryAr: `انطلقت Attractive برؤية هندسية متقدمة لتوفير أرقى حلول أنظمة التيار الخفيف (Light Current) في مصر والشرق الأوسط. نحن متخصصون في توريد، تركيب، وبرمجة شبكات كاميرات المراقبة الذكية (CCTV)، أنظمة إنذار الحريق المعنونة، السوند سيستم والإذاعة الداخلية، أنظمة استدعاء الممرضات والإنتركم المرئي، والبنية التحتية لكابلات الشبكات والألياف الضوئية.
نعتمد أعلى معايير الجودة العالمية ومطابقة الكود المصري والدفاع المدني لتأمين المنشآت الطبية والتعليمية والشركات والمصانع والمنازل بأعلى كفاءة وأطول فترات ضمان مع صيانة دورية متكاملة.`,
    aboutStoryEn: `Attractive was established with an engineering vision to deliver premier Light Current & Security Systems across Egypt. We specialize in supply, installation, and integration of CCTV surveillance, intelligent fire alarm systems, public address & background sound, nurse call & smart video intercom, and structured network cabling.
We adhere to the highest international standards and safety codes to protect healthcare, commercial, industrial, and residential projects with extended warranties and round-the-clock technical support.`,
    aboutImage: "", // Custom uploaded or linked image for About section
    aboutBadgeAr: "حلول هندسية معتمدة بأعلى المعايير العالمية",
    aboutBadgeEn: "Certified Engineering Solutions, Global Standards",

    // Sale & Discount Hub (Toggleable ON/OFF + Fully Editable)
    saleActive: true,
    saleTitleAr: "عروض وتخفيضات Attractive على أنظمة التيار الخفيف",
    saleTitleEn: "Attractive Light Current Mega Sale",
    saleDescAr: "وفر حتى 20% على باقات كاميرات المراقبة 4K، لوحات إنذار الحريق، وأنظمة الصوتيات الجاهزة للتوريد والشحن الفوري!",
    saleDescEn: "Save up to 20% on selected 4K CCTV kits, addressable fire alarm panels, and PA systems ready for immediate shipping!",
    saleBadgeAr: "عروض وتخفيضات 🔥",
    saleBadgeEn: "Mega Sale 🔥",

    // Promotional Coupon Popup Bubble & Floating Dock (Fully Editable)
    couponBubbleActive: true,
    couponBubbleCode: "ATTRACTIVE10",
    couponBubbleTitleAr: "🎁 خصم حصري 10% على توريدات اليوم!",
    couponBubbleTitleEn: "🎁 Exclusive 10% Discount Today!",
    couponBubbleTextAr: "استخدم كود الخصم عند الدفع وتمتع بتخفيض فوري على طلبات الأجهزة والكابلات المعتمدة.",
    couponBubbleTextEn: "Use this coupon code at checkout for instant 10% savings on your equipment & cabling.",
    couponBubbleBg: "#1D1D1F",

    // Hero Section Texts & Live Card Image (Editable)
    heroBadgeAr: "Attractive — الريادة في حلول وتوريدات أنظمة التيار الخفيف",
    heroBadgeEn: "Attractive — Premier Light Current & Security Solutions",
    heroHeadingAr: "أنظمة التيار الخفيف المتكاملة.<br/><span style='color: var(--primary-color, #C8102E);'>أمان متطور، صوت نقي، وإنذار فوري.</span>",
    heroHeadingEn: "Integrated Light Current Systems.<br/><span style='color: var(--primary-color, #C8102E);'>Advanced Security, Pure Sound, Instant Alarm.</span>",
    heroDescAr: "نقدم حلولاً هندسية متكاملة: كاميرات مراقبة ذكية 4K، أنظمة إنذار الحريق المعنونة، شبكات الإذاعة والصوتيات للمباني، وأنظمة الاستدعاء الطبي والإنتركم، مع بنية تحتية فائقة الاعتمادية من كابلات الشبكات والفايبر المعتمدة.",
    heroDescEn: "End-to-end engineering solutions: 4K AI CCTV surveillance, certified fire alarm systems, commercial public address, nurse call & smart intercom, backed by premium structured cabling.",
    heroLiveImage: "", // Custom uploaded or linked live image for hero visual card
    heroLiveBadgeTextAr: "توريد وتركيب وعقود صيانة معتمدة لجميع المحافظات",
    heroLiveBadgeTextEn: "Supply, installation & certified maintenance nationwide",

    // Top Promotion Announcement Bar
    promoActive: true,
    promoTextAr: "🔥 عرض خاص: معاينة فنية مجانية وخصم 15% على مقايسات أنظمة المراقبة والحريق للمنشآت والمصانع!",
    promoTextEn: "🔥 Special: Free technical survey & 15% off on security and fire alarm system quotes!",
    promoBadgeAr: "عرض حصري",
    promoBadgeEn: "Special Deal",
    promoLink: "store.html",
    promoLinkTextAr: "تسوق الآن",
    promoLinkTextEn: "Shop Now",
    promoBgColor: "#C8102E",

    // Maintenance / Installation Service
    repairActive: true,
    repairTitleAr: "مركز الصيانة والتركيبات وعقود الدعم الفني",
    repairTitleEn: "Installation, Maintenance & Technical Support Center",
    repairDescAr: "نوفر خدمات تركيب دقيقة، فحص وبرمجة أجهزة NVR/DVR، لوحات إنذار الحريق، شبكات الصوتيات، وكاميرات المراقبة بأحدث أجهزة قياس الكابلات وتسترات الفايبر مع توفير قطع غيار أصلية وعقود صيانة دورية.",
    repairDescEn: "Precision installation, programming for NVRs, fire alarm panels, commercial PA, and CCTV. Comprehensive cable certification, genuine parts, and annual maintenance contracts.",
    repairPricingNoteAr: "تبدأ تكلفة المعاينة الفنية والصيانة من 150 ج.م حسب نوع المنظومة وموقع المشروع.",
    repairPricingNoteEn: "Technical surveys & maintenance start from 150 EGP depending on system type and location.",

    // Two Paths Section Texts (Editable)
    path1TitleAr: "كتالوج الأجهزة والأنظمة المعتمدة",
    path1TitleEn: "Certified Systems & Products Store",
    path1DescAr: "تصفح أحدث كاميرات المراقبة، أجهزة التسجيل NVR، حساسات ولوحات إنذار الحريق، سماعات ومكبرات الصوت، ووحدات الاستدعاء الجاهزة للتوريد والشحن الفوري لجميع المحافظات.",
    path1DescEn: "Browse our certified CCTV cameras, NVRs, fire alarm detectors & panels, PA amplifiers, and nurse call stations ready for immediate delivery.",

    path2TitleAr: "استوديو تفصيل كابلات الصوت الاحترافية",
    path2TitleEn: "Custom Pro Audio Cable Studio",
    path2DescAr: "صمم كابلك الصوتي بنفسك: اختر الطرف الأول (XLR، TRS، RCA، Speakon)، الطرف الثاني، خامة النحاس النقي OFC، والطول الذي تحتاجه بدقة بالسنتيمتر مع حساب السعر والعربون لحظياً.",
    path2DescEn: "Design your custom audio cable: select connector A & B, oxygen-free copper grade, and exact length with instant price & deposit calculation.",

    // Trust Badges
    badge1Val: "100%",
    badge1TextAr: "أجهزة معتمدة ومختبرة",
    badge1TextEn: "Certified & Lab-Tested",
    badge2Val: "24/7",
    badge2TextAr: "استقرار وأمان دائم",
    badge2TextEn: "24/7 Reliability & Safety",
    badge3Val: "2 سنة",
    badge3TextAr: "ضمان صيانة واستبدال",
    badge3TextEn: "Warranty & Maintenance",

    // Contact & Engineering Info (Editable)
    whatsappNumber: "201027814400",
    phoneNumbers: ["01027814400", "01100000000"],
    vodafoneCash: "01027814400",
    instapay: "attractive@instapay",
    workshopAddressAr: "القاهرة - جمهورية مصر العربية",
    workshopAddressEn: "Cairo, Egypt",
    workingHoursAr: "يومياً من 9 صباحاً حتى 10 مساءً",
    workingHoursEn: "Daily from 9:00 AM to 10:00 PM",
    contactHeadingAr: "هل لديك مشروع أو تحتاج مقايسة فنية متكاملة (BOQ)؟",
    contactHeadingEn: "Have a Project or Need a Full Engineering BOQ?",
    contactDescAr: "فريق المهندسين والفنيين في Attractive جاهز لمعاينة الموقع وتصميم مقايسات أنظمة التيار الخفيف (مراقبة، حريق، صوتيات، شبكات، إنتركم) للمباني الإدارية، المصانع، والمستشفيات.",
    contactDescEn: "Our engineering team provides on-site surveys and turnkey BOQ designs for CCTV, fire alarms, PA systems, structured cabling, and nurse call for commercial and healthcare projects.",

    // Security
    adminPassHash: "attractive2026",
    
    // Deposit Feature (#34)
    depositEnabled: true,
    depositType: "percent",
    depositValue: 25,
    depositMin: 100,
    depositMax: 2000,
    depositMessageAr: "طلبات التوريد والتفصيل المخصص تستلزم دفع عربون مقدم لتأكيد حجز التوريدات والخامات وجدية التنفيذ.",
    depositMessageEn: "Custom cabling and project orders require an advance deposit to confirm procurement.",

    // WhatsApp Message Builder (#36)
    whatsappGreetingAr: "🛡️ *طلب جديد من متجر Attractive لأنظمة التيار الخفيف والأمن*",
    whatsappGreetingEn: "🛡️ *New Order from Attractive Light Current Systems*",
    whatsappFooterAr: "شكراً لاختيارك Attractive — سيقوم مهندس الدعم الفني بمراجعة طلبك والتواصل معك فوراً! ⭐",
    whatsappFooterEn: "Thank you for choosing Attractive — Our engineering team will review your order shortly!",
    showOrderId: true,
    showCustomerName: true,
    showPhone: true,
    showAddress: true,
    showItemsList: true,
    showSubtotal: true,
    showShippingFee: true,
    showDeposit: true,
    showRemaining: true,
    showPaymentMethod: true,

    // Google Sheets Webhook (#33)
    googleSheetsWebhookUrl: "",

    // Social Media Links (#35)
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",

    // Coupon Bubble Full Appearance Controls (NEW)
    couponBubblePosition: "right",        // "right" | "left"
    couponBubbleDockLabel: "كوبون خصم",   // نص الدوك المصغر
    couponBubbleDockLabelEn: "Coupon",
    couponBubbleDockBg: "#C8102E",        // لون الدوك المصغر
    couponBubbleDockTextColor: "#ffffff", // لون نص الدوك
    couponBubbleBorderRadius: "24",       // حواف البابل (px)
    couponBubbleShadow: true,
    couponBubbleFontSize: "13",           // حجم الخط داخل البابل (px)
    couponBubbleCodeColor: "#fbbf24",     // لون الكود داخل البابل
    couponBubbleShowIcon: true,

    // Email Subscribers / VIP Club (NEW)
    subscribersEnabled: true,
    subscribersWidgetTitleAr: "🎁 سجّل إيميلك واحصل على خصم حصري لمشروعك",
    subscribersWidgetTitleEn: "🎁 Subscribe for an exclusive project discount",
    subscribersWidgetDescAr: "أدخل بريدك الإلكتروني لتحصل على كوبون خصم خاص وعروض حصرية على أنظمة المراقبة والحريق والشبكات.",
    subscribersWidgetDescEn: "Enter your email to receive an exclusive coupon and VIP offers on security & network systems.",
    subscribersDefaultCoupon: "ATTRACTIVE10",
    subscribersWidgetBg: "#1D1D1F",
    subscribersWidgetPosition: "bottom-left",  // "bottom-left" | "bottom-right"

    // User Accounts & Signup Perks (100% Admin Configurable)
    userSignupFreeShippingDefault: true,
    userSignupDiscountPercentDefault: 5,
    userSignupCustomCouponDefault: "WELCOME5",
    userSignupCustomPerksDefault: ["ضمان ذهبي ممتد لمدة سنتين مجاناً", "أولوية في جدول التوريد والمعاينة الفنية", "خصم إضافي على عقود الصيانة الدورية"],

    // Free Shipping Controls
    freeShippingEnabled: false,
    freeShippingType: "threshold", // "threshold" | "all"
    freeShippingMinOrder: 2000
};


const ProCable = {
    // --- Server Sync Layer (Shared Data via Vercel Backend) ---
    // Pushes an updated content list/object to the server so all visitors see admin changes.
    // Fails silently (falls back to localStorage-only behavior) if the API isn't deployed yet.
    _apiSecret() {
        try { return sessionStorage.getItem('attractive_api_secret') || ''; } catch(e) { return ''; }
    },
    pushToServer(key, data) {
        try {
            fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': this._apiSecret() },
                body: JSON.stringify({ key, data })
            }).catch(() => {});
        } catch(e) { /* ignore - offline or API not deployed */ }
    },
    async syncFromServer() {
        try {
            const res = await fetch('/api/store', { cache: 'no-store' });
            if (!res.ok) return false;
            const remote = await res.json();
            if (!remote || typeof remote !== 'object') return false;
            const map = {
                categories: 'attractive_categories',
                products: 'attractive_products',
                connectors: 'attractive_connectors',
                cables: 'attractive_cables',
                shipping: 'attractive_shipping',
                settings: 'attractive_settings',
                coupons: 'attractive_coupons',
                navItems: 'attractive_nav_items'
            };
            Object.keys(map).forEach(k => {
                if (remote[k] !== undefined) {
                    localStorage.setItem(map[k], JSON.stringify(remote[k]));
                }
            });
            return true;
        } catch(e) { return false; /* API not deployed yet or offline - use local data */ }
    },

    // Categories Management
    // Automatic Migration to Light Current Systems Data Version
    checkDataVersion() {
        const CURRENT_VERSION = '2026_LC_FINAL_V1';
        if (typeof localStorage === 'undefined') return;
        try {
            if (localStorage.getItem('attractive_identity_version') !== CURRENT_VERSION) {
                localStorage.setItem('attractive_categories', JSON.stringify(DEFAULT_CATEGORIES));
                localStorage.setItem('attractive_products', JSON.stringify(DEFAULT_PRODUCTS));
                localStorage.setItem('attractive_connectors', JSON.stringify(DEFAULT_CONNECTORS));
                localStorage.setItem('attractive_cables', JSON.stringify(DEFAULT_CABLES));
                localStorage.setItem('attractive_settings', JSON.stringify(DEFAULT_SETTINGS));
                localStorage.setItem('attractive_nav_items', JSON.stringify(DEFAULT_NAV_ITEMS));
                localStorage.setItem('attractive_identity_version', CURRENT_VERSION);
                localStorage.removeItem('procable_products');
                localStorage.removeItem('procable_settings');
                localStorage.removeItem('procable_connectors');
                localStorage.removeItem('procable_cables');
            }
        } catch(e) { console.error('Data version check error:', e); }
    },
    getCategories() {
        this.checkDataVersion();
        const stored = localStorage.getItem('attractive_categories');
        let list = DEFAULT_CATEGORIES;
        if (stored) {
            if (stored.includes('\uFFFD') || (stored.includes('Ø') && stored.includes('Ù'))) {
                localStorage.setItem('attractive_categories', JSON.stringify(DEFAULT_CATEGORIES));
                list = DEFAULT_CATEGORIES;
            } else {
                try { list = JSON.parse(stored); } catch(e) { list = DEFAULT_CATEGORIES; }
            }
        } else {
            localStorage.setItem('attractive_categories', JSON.stringify(DEFAULT_CATEGORIES));
        }
        return list.map(c => Object.assign({ 
            hidden: false, 
            image: '', 
            images: [], 
            video: '',
            icon: 'cable'
        }, c));
    },
    saveCategories(list) {
        localStorage.setItem('attractive_categories', JSON.stringify(list));
        this.pushToServer('categories', list);
    },
    reorderCategories(orderedIds) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let list = this.getCategories();
        const reordered = [];
        orderedIds.forEach((id, idx) => {
            const c = list.find(item => item.id === id);
            if (c) {
                c.sortOrder = idx;
                reordered.push(c);
            }
        });
        list.forEach(c => {
            if (!reordered.some(r => r.id === c.id)) {
                c.sortOrder = reordered.length;
                reordered.push(c);
            }
        });
        this.saveCategories(reordered);
        return reordered;
    },
    setProductCategory(productId, categoryId) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let prods = this.getProducts();
        const p = prods.find(item => item.id === productId);
        if (p) {
            p.category = categoryId;
            this.saveProducts(prods);
            return p;
        }
        return null;
    },
    addCategory(cat) {
        let list = this.getCategories();
        if (!cat.id) {
            cat.id = 'cat-' + Date.now();
        }
        cat.hidden = cat.hidden === true;
        cat.image = cat.image || '';
        cat.images = Array.isArray(cat.images) ? cat.images : [];
        cat.video = cat.video || '';
        list.push(cat);
        this.saveCategories(list);
        return cat;
    },
    updateCategory(id, data) {
        let list = this.getCategories();
        const idx = list.findIndex(c => c.id === id);
        if (idx !== -1) {
            list[idx] = Object.assign({}, list[idx], data);
            this.saveCategories(list);
            return list[idx];
        }
        return null;
    },
    deleteCategory(id) {
        let list = this.getCategories();
        list = list.filter(c => c.id !== id);
        this.saveCategories(list);
        return true;
    },
    toggleCategoryVisibility(id) {
        let list = this.getCategories();
        const cat = list.find(c => c.id === id);
        if (cat && cat.id !== 'all') {
            cat.hidden = !(cat.hidden === true);
            this.saveCategories(list);
            return cat.hidden;
        }
        return false;
    },

    // Products
    getProducts() {
        this.checkDataVersion();
        const stored = localStorage.getItem('attractive_products') || localStorage.getItem('procable_products');
        let list = DEFAULT_PRODUCTS;
        if (stored) {
            if (stored.includes('\uFFFD') || (stored.includes('Ø') && stored.includes('Ù'))) {
                localStorage.setItem('attractive_products', JSON.stringify(DEFAULT_PRODUCTS));
                localStorage.setItem('procable_products', JSON.stringify(DEFAULT_PRODUCTS));
                list = DEFAULT_PRODUCTS;
            } else {
                try { list = JSON.parse(stored); } catch(e) { list = DEFAULT_PRODUCTS; }
            }
        } else {
            localStorage.setItem('attractive_products', JSON.stringify(DEFAULT_PRODUCTS));
            localStorage.setItem('procable_products', JSON.stringify(DEFAULT_PRODUCTS));
        }
        return list.map(p => {
            const defSheet = p.id === 101 ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : (p.id === 102 ? 'logo.png' : '');
            const defType = p.id === 102 ? 'image' : 'pdf';
            const imgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
            return Object.assign({ 
                hidden: false, 
                datasheet: defSheet, 
                datasheetType: defType,
                images: imgs,
                image: (imgs.length > 0 ? imgs[0] : (p.image || '')),
                video: p.video || '',
                videoType: p.videoType || 'file',
                coverType: p.coverType || (p.video && (!imgs || imgs.length === 0) ? 'video' : 'image'),
                heroMediaType: p.heroMediaType || 'none',
                heroMediaUrl: p.heroMediaUrl || '',
                heroPosterUrl: p.heroPosterUrl || ''
            }, p);
        }).sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    },
    saveProducts(list) {
        try {
            localStorage.setItem('attractive_products', JSON.stringify(list));
            this.pushToServer('products', list);
            try {
                localStorage.setItem('procable_products', JSON.stringify(list));
            } catch(e) {
                // Secondary key failed due to size; remove it so primary key has full quota
                localStorage.removeItem('procable_products');
            }
            return true;
        } catch(e) {
            console.warn('LocalStorage quota warning in saveProducts:', e);
            try {
                localStorage.removeItem('procable_products');
                localStorage.setItem('attractive_products', JSON.stringify(list));
                return true;
            } catch(e2) {
                console.error('Critical quota exceeded in saveProducts:', e2);
                if (typeof ProCable.showToast === 'function') {
                    ProCable.showToast('تنبيه: حجم وسائط المنتج المرفوعة كبير جداً على تخزين المتصفح. يرجى استخدام رابط مباشر للفيديو أو تقليل حجم الملف.', 'error');
                }
                return false;
            }
        }
    },
    toggleProductVisibility(id) {
        let list = this.getProducts();
        const prod = list.find(p => p.id === id);
        if (prod) {
            prod.hidden = !(prod.hidden === true);
            this.saveProducts(list);
            return prod.hidden;
        }
        return false;
    },

    getConnectors() {
        const stored = localStorage.getItem('attractive_connectors') || localStorage.getItem('procable_connectors');
        if (!stored) {
            this.saveConnectors(DEFAULT_CONNECTORS);
            return DEFAULT_CONNECTORS;
        }
        try { 
            const list = JSON.parse(stored); 
            return list.map(c => Object.assign({ image: '', descAr: '', descEn: '', icon: 'xlr-m' }, c));
        } catch(e) { return DEFAULT_CONNECTORS; }
    },
    saveConnectors(list) {
        localStorage.setItem('attractive_connectors', JSON.stringify(list));
        localStorage.setItem('procable_connectors', JSON.stringify(list));
        this.pushToServer('connectors', list);
    },
    addConnector(item) {
        let connectors = this.getConnectors();
        if (!item.id) {
            item.id = 'jack-' + Date.now();
        }
        item.image = item.image || '';
        item.icon = item.icon || 'xlr-m';
        connectors.push(item);
        this.saveConnectors(connectors);
        return item;
    },
    updateConnector(id, data) {
        let connectors = this.getConnectors();
        const idx = connectors.findIndex(c => c.id === id);
        if (idx !== -1) {
            connectors[idx] = Object.assign({}, connectors[idx], data);
            this.saveConnectors(connectors);
            return connectors[idx];
        }
        return null;
    },
    deleteConnector(id) {
        let connectors = this.getConnectors();
        connectors = connectors.filter(c => c.id !== id);
        this.saveConnectors(connectors);
        return true;
    },

    getCableTypes() {
        const stored = localStorage.getItem('attractive_cables') || localStorage.getItem('procable_cables');
        if (!stored) {
            this.saveCableTypes(DEFAULT_CABLES);
            return DEFAULT_CABLES;
        }
        try { return JSON.parse(stored); } catch(e) { return DEFAULT_CABLES; }
    },
    saveCableTypes(list) {
        localStorage.setItem('attractive_cables', JSON.stringify(list));
        localStorage.setItem('procable_cables', JSON.stringify(list));
        this.pushToServer('cables', list);
    },
    addCableType(item) {
        let cables = this.getCableTypes();
        if (!item.id) {
            item.id = 'cable-' + Date.now();
        }
        cables.push(item);
        this.saveCableTypes(cables);
        return item;
    },
    updateCableType(id, data) {
        let cables = this.getCableTypes();
        const idx = cables.findIndex(c => c.id === id);
        if (idx !== -1) {
            cables[idx] = Object.assign({}, cables[idx], data);
            this.saveCableTypes(cables);
            return cables[idx];
        }
        return null;
    },
    deleteCableType(id) {
        let cables = this.getCableTypes();
        cables = cables.filter(c => c.id !== id);
        this.saveCableTypes(cables);
        return true;
    },

    getShipping() {
        const stored = localStorage.getItem('attractive_shipping') || localStorage.getItem('procable_shipping');
        if (!stored) {
            localStorage.setItem('attractive_shipping', JSON.stringify(DEFAULT_SHIPPING));
            localStorage.setItem('procable_shipping', JSON.stringify(DEFAULT_SHIPPING));
            return DEFAULT_SHIPPING;
        }
        if (stored.includes('\uFFFD') || (stored.includes('Ø') && stored.includes('Ù'))) {
            localStorage.setItem('attractive_shipping', JSON.stringify(DEFAULT_SHIPPING));
            localStorage.setItem('procable_shipping', JSON.stringify(DEFAULT_SHIPPING));
            return DEFAULT_SHIPPING;
        }
        try {
            const list = JSON.parse(stored);
            if (!Array.isArray(list) || list.length === 0) {
                return DEFAULT_SHIPPING;
            }
            return list.map(item => Object.assign({
                fee: 50,
                enabled: true,
                deliveryTimeAr: 'خلال 2-3 أيام',
                deliveryTimeEn: '2-3 days',
                notes: ''
            }, item));
        } catch(e) { return DEFAULT_SHIPPING; }
    },
    saveShipping(list) {
        localStorage.setItem('attractive_shipping', JSON.stringify(list));
        localStorage.setItem('procable_shipping', JSON.stringify(list));
        this.pushToServer('shipping', list);
    },
    addGovernorate(data) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let list = this.getShipping();
        let id = (data.id || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (!id) {
            id = (data.nameEn || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || ('gov-' + Date.now());
        }
        if (list.some(g => g.id === id)) {
            id = id + '-' + Date.now();
        }
        const newGov = {
            id: id,
            nameAr: (data.nameAr || '').trim(),
            nameEn: (data.nameEn || data.nameAr || '').trim(),
            fee: parseInt(data.fee) >= 0 ? parseInt(data.fee) : 50,
            enabled: data.enabled !== false,
            deliveryTimeAr: (data.deliveryTimeAr || 'خلال 2-3 أيام').trim(),
            deliveryTimeEn: (data.deliveryTimeEn || '2-3 days').trim(),
            notes: (data.notes || '').trim()
        };
        list.push(newGov);
        this.saveShipping(list);
        return newGov;
    },
    updateGovernorate(id, updates) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let list = this.getShipping();
        const idx = list.findIndex(g => g.id === id);
        if (idx !== -1) {
            list[idx] = Object.assign({}, list[idx], updates);
            this.saveShipping(list);
            return list[idx];
        }
        return null;
    },
    deleteGovernorate(id) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let list = this.getShipping().filter(g => g.id !== id);
        this.saveShipping(list);
        return true;
    },
    toggleGovernorate(id) {
        if (this.isAdminLoggedIn && !this.isAdminLoggedIn()) throw new Error('Unauthorized');
        let list = this.getShipping();
        const gov = list.find(g => g.id === id);
        if (gov) {
            gov.enabled = !gov.enabled;
            this.saveShipping(list);
            return gov.enabled;
        }
        return false;
    },
    calculateEffectiveShipping(subtotal, governorateId) {
        const settings = this.getSettings();
        const zones = this.getShipping();
        const zone = zones.find(z => z.id === governorateId);
        if (!zone) return { fee: 0, isFree: false, originalFee: 0, label: '', isDisabled: false, reason: 'none' };
        const isAr = this.getLang() === 'ar';
        const label = isAr ? zone.nameAr : (zone.nameEn || zone.nameAr);
        if (zone.enabled === false) {
            return {
                fee: 0,
                isFree: false,
                originalFee: zone.fee,
                label: label,
                isDisabled: true,
                error: 'shipping_disabled',
                reason: 'disabled'
            };
        }
        const isFreeEnabled = settings.freeShippingEnabled === true;
        const isAllOrdersFree = isFreeEnabled && settings.freeShippingType === 'all';
        const isThresholdMet = isFreeEnabled && (settings.freeShippingType !== 'all') && subtotal >= (settings.freeShippingMinOrder || 1000);
        if (isAllOrdersFree || isThresholdMet) {
            return {
                fee: 0,
                isFree: true,
                originalFee: zone.fee,
                label: label,
                isDisabled: false,
                reason: isAllOrdersFree ? 'free_all' : 'threshold'
            };
        }
        return {
            fee: zone.fee,
            isFree: false,
            originalFee: zone.fee,
            label: label,
            isDisabled: false,
            reason: 'none'
        };
    },
    getSettings() {
        this.checkDataVersion();
        const stored = localStorage.getItem('attractive_settings') || localStorage.getItem('procable_settings');
        if (!stored) {
            return DEFAULT_SETTINGS;
        }
        if (stored.includes('\uFFFD') || (stored.includes('Ø') && stored.includes('Ù'))) {
            localStorage.setItem('attractive_settings', JSON.stringify(DEFAULT_SETTINGS));
            localStorage.setItem('procable_settings', JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        }
        try { 
            const parsed = JSON.parse(stored);
            return Object.assign({}, DEFAULT_SETTINGS, parsed);
        } catch(e) { return DEFAULT_SETTINGS; }
    },
    saveSettings(obj) {
        localStorage.setItem('attractive_settings', JSON.stringify(obj));
        localStorage.setItem('procable_settings', JSON.stringify(obj));
        this.pushToServer('settings', obj);
        this.applyThemeColor();
        this.applyBranding();
        this.applySiteBackground();
    },

    // Dynamic Theme Color Applicator
    applyThemeColor() {
        const s = this.getSettings();
        const col = s.primaryColor || '#C8102E';
        document.documentElement.style.setProperty('--primary-color', col);
        
        let styleEl = document.getElementById('dynamic-theme-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-theme-style';
            document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = `
            :root { --primary-color: ${col}; }
            .bg-primary { background-color: ${col} !important; }
            .text-primary { color: ${col} !important; }
            .border-primary { border-color: ${col} !important; }
            .hover\\:bg-primary:hover { background-color: ${col} !important; }
            .hover\\:text-primary:hover { color: ${col} !important; }
            .focus\\:ring-primary:focus { --tw-ring-color: ${col} !important; }
            .text-primary-fixed { color: ${col} !important; }
            .hover\\:border-primary\\/50:hover { border-color: ${col}80 !important; }
            body.has-custom-bg { background-color: transparent !important; }
            body.has-custom-bg main { position: relative; z-index: 1; }
        `;
    },

    // Dynamic Site Wallpaper & Background Engine (Single, Multi-Image Slideshow, GIF, Frosted Glass)
    applySiteBackground() {
        const s = this.getSettings();
        const bgs = Array.isArray(s.siteBackgrounds) ? s.siteBackgrounds.filter(u => u && typeof u === 'string' && u.trim().length > 0) : [];
        let container = document.getElementById('siteBackgroundContainer');

        if (bgs.length === 0) {
            if (container) container.remove();
            document.body.classList.remove('has-custom-bg');
            if (window._siteBgIntervalTimer) {
                clearInterval(window._siteBgIntervalTimer);
                window._siteBgIntervalTimer = null;
            }
            return;
        }

        document.body.classList.add('has-custom-bg');

        if (!container) {
            container = document.createElement('div');
            container.id = 'siteBackgroundContainer';
            container.className = 'fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-opacity duration-1000';
            document.body.insertBefore(container, document.body.firstChild);
        }

        const opacity = typeof s.siteBgOverlayOpacity === 'number' ? s.siteBgOverlayOpacity : 85;
        const blur = typeof s.siteBgBlur === 'number' ? s.siteBgBlur : 0;
        const colorMode = s.siteBgOverlayColor || 'light';
        
        let overlayRgba = `rgba(245, 245, 247, ${opacity / 100})`; // Apple light frosted default
        if (colorMode === 'dark') {
            overlayRgba = `rgba(18, 18, 20, ${opacity / 100})`;
        } else if (colorMode === 'clear') {
            overlayRgba = `rgba(255, 255, 255, ${Math.max(0.05, (opacity / 100) * 0.3)})`;
        }

        const safeFirstBg = ProCable.sanitize(bgs[0]);
        container.innerHTML = `
            <div id="siteBgImageLayer" class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-100" style="background-image: url('${safeFirstBg}'); filter: blur(${blur}px);"></div>
            <div id="siteBgOverlayLayer" class="absolute inset-0 transition-colors duration-700" style="background-color: ${overlayRgba}; backdrop-filter: blur(${blur > 0 ? blur : 0}px); -webkit-backdrop-filter: blur(${blur > 0 ? blur : 0}px);"></div>
        `;

        if (window._siteBgIntervalTimer) {
            clearInterval(window._siteBgIntervalTimer);
            window._siteBgIntervalTimer = null;
        }

        if (bgs.length > 1 && s.siteBgSlideshow !== false) {
            let currentBgIdx = 0;
            const intervalSec = Math.max(3, parseInt(s.siteBgInterval) || 8);
            window._siteBgIntervalTimer = setInterval(() => {
                currentBgIdx = (currentBgIdx + 1) % bgs.length;
                const layer = document.getElementById('siteBgImageLayer');
                if (layer) {
                    layer.style.opacity = '0.35';
                    setTimeout(() => {
                        layer.style.backgroundImage = `url('${ProCable.sanitize(bgs[currentBgIdx])}')`;
                        layer.style.opacity = '1';
                    }, 400);
                }
            }, intervalSec * 1000);
        }
    },

    // Dynamic Site Branding Applicator
    applyBranding() {
        const s = this.getSettings();
        const logoUrl = s.logoImage || 'logo.png';
        document.querySelectorAll('.site-logo-img').forEach(img => {
            img.src = logoUrl;
            if (s.siteName) img.alt = s.siteName;
        });
        document.querySelectorAll('.site-brand-name').forEach(el => {
            el.innerText = s.siteName || 'Attractive';
        });
        let fav = document.querySelector("link[rel*='icon']");
        if (fav && logoUrl) fav.href = logoUrl;
    },

    // Image Compression Helper (Preserves GIF animations without frame loss)
    compressImage(file, maxWidth = 900, quality = 0.85) {
        return new Promise((resolve, reject) => {
            const isGif = file.type === 'image/gif' || (file.name && file.name.toLowerCase().endsWith('.gif'));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                if (isGif) {
                    // Return raw DataURL for animated GIFs to preserve frames
                    return resolve(e.target.result);
                }
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    },

    // Generalized Media Reader (Image, GIF, Video)
    readMediaFile(file) {
        return new Promise((resolve, reject) => {
            const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name || '');
            const isGif = file.type === 'image/gif' || (file.name && file.name.toLowerCase().endsWith('.gif'));
            if (isVideo) {
                if (file.size > 30 * 1024 * 1024) {
                    return reject(new Error('حجم ملف الفيديو كبير، يفضل اختيار فيديو قصير لا يتجاوز 30MB أو استخدام رابط مباشر'));
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => resolve({ type: 'video', dataUrl: e.target.result, name: file.name });
                reader.onerror = reject;
            } else if (isGif) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => resolve({ type: 'gif', dataUrl: e.target.result, name: file.name });
                reader.onerror = reject;
            } else {
                this.compressImage(file).then(dataUrl => {
                    resolve({ type: 'image', dataUrl, name: file.name });
                }).catch(reject);
            }
        });
    },

    // Coupons
    getCoupons() {
        const stored = localStorage.getItem('attractive_coupons');
        if (!stored) {
            const defaults = [{ code: "ATTRACTIVE10", type: "percent", value: 10, active: true }];
            localStorage.setItem('attractive_coupons', JSON.stringify(defaults));
            return defaults;
        }
        try { return JSON.parse(stored); } catch(e) { return []; }
    },
    saveCoupons(list) {
        localStorage.setItem('attractive_coupons', JSON.stringify(list));
        this.pushToServer('coupons', list);
    },
    applyCoupon(code, subtotal) {
        const cleanCode = (code || '').trim().toUpperCase();
        const isAr = this.getLang() === 'ar';
        if (!cleanCode) return { valid: false, discount: 0, message: isAr ? 'يرجى إدخال كود الكوبون' : 'Please enter coupon code' };

        // 1. Check general store coupons
        const coupons = this.getCoupons();
        const c = coupons.find(i => i.code.toUpperCase() === cleanCode && i.active);
        if (c) {
            let discount = c.type === 'percent' ? Math.round(subtotal * (c.value / 100)) : c.value;
            discount = Math.min(discount, subtotal);
            return { valid: true, discount, coupon: c, message: isAr ? `تم تفعيل كود الخصم! وفرت ${discount} ج.م` : `Applied ${discount} EGP discount` };
        }

        // 2. Check individual user accounts custom coupons
        const accounts = this.getUserAccounts();
        const userWithCoupon = accounts.find(a => (a.customCoupon || '').trim().toUpperCase() === cleanCode && a.active !== false && a.perksActive !== false);
        if (userWithCoupon) {
            const pct = userWithCoupon.discountPercent > 0 ? userWithCoupon.discountPercent : 10;
            let discount = Math.round(subtotal * (pct / 100));
            discount = Math.min(discount, subtotal);
            return {
                valid: true,
                discount,
                coupon: { code: cleanCode, type: 'percent', value: pct, isUserCoupon: true, userName: userWithCoupon.name },
                message: isAr ? `تم تفعيل كوبون العضوية الخاص لـ (${userWithCoupon.name})! خصم ${pct}% (-${discount} ج.م)` : `Applied member discount (${pct}%): -${discount} EGP`
            };
        }

        return { valid: false, discount: 0, message: isAr ? 'كود خصم غير صالح أو غير مفعّل' : 'Invalid or expired coupon' };
    },

    // Cart
    getCart() {
        const stored = localStorage.getItem('attractive_cart') || localStorage.getItem('procable_cart');
        try { return stored ? JSON.parse(stored) : []; } catch(e) { return []; }
    },
    saveCart(cart) {
        localStorage.setItem('attractive_cart', JSON.stringify(cart));
        localStorage.setItem('procable_cart', JSON.stringify(cart));
        this.updateCartBadges();
    },
    addToCart(item) {
        let cart = this.getCart();
        if (item.type === 'ready') {
            const existing = cart.find(i => i.id === item.id && i.type === 'ready');
            if (existing) {
                existing.qty += (item.qty || 1);
                existing.price = existing.unitPrice * existing.qty;
            } else {
                cart.push(item);
            }
        } else {
            cart.push(item);
        }
        this.saveCart(cart);
        this.showToast(this.getLang() === 'ar' ? `تمت إضافة "${item.name}" إلى السلة` : `Added "${item.name}" to cart`, 'success');
    },
    updateCartQty(id, delta) {
        let cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
            this.showToast(this.getLang() === 'ar' ? 'تم حذف العنصر من السلة' : 'Item removed from cart', 'info');
        } else {
            item.price = item.unitPrice * item.qty;
        }
        this.saveCart(cart);
    },
    removeFromCart(id) {
        let cart = this.getCart().filter(i => i.id !== id);
        this.saveCart(cart);
        this.showToast(this.getLang() === 'ar' ? 'تم حذف العنصر من السلة' : 'Item removed from cart', 'info');
    },
    clearCart() {
        this.saveCart([]);
        this.showToast(this.getLang() === 'ar' ? 'تم تفريغ السلة' : 'Cart cleared', 'info');
    },

    updateCartBadges() {
        const cart = this.getCart();
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const formatted = this.formatNum(totalQty);
        ['navCartBadge', 'mobileCartBadge', 'floatingCartCount', 'cartItemCountBadge'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = formatted;
                if (totalQty === 0) el.classList.add('hidden');
                else el.classList.remove('hidden');
            }
        });
    },

    // Deposit
    calculateDeposit(totalAmount) {
        const s = this.getSettings();
        if (!s.depositEnabled || totalAmount <= 0) return 0;
        let dep = s.depositType === 'percent' 
            ? Math.round(totalAmount * (s.depositValue / 100)) 
            : s.depositValue;
        if (s.depositMin) dep = Math.max(dep, s.depositMin);
        if (s.depositMax) dep = Math.min(dep, s.depositMax);
        return Math.min(dep, totalAmount);
    },

    // Orders & Tracking System (Stages: received -> processing -> shipped)
    getOrders() {
        const stored = localStorage.getItem('attractive_orders') || localStorage.getItem('procable_orders');
        if (!stored) {
            this.saveOrders(DEFAULT_ORDERS);
            return DEFAULT_ORDERS;
        }
        try { return JSON.parse(stored); } catch(e) { return DEFAULT_ORDERS; }
    },
    saveOrders(orders) {
        localStorage.setItem('attractive_orders', JSON.stringify(orders));
        localStorage.setItem('procable_orders', JSON.stringify(orders));
    },
    getOrder(query) {
        if (!query) return null;
        const q = String(query).trim().toLowerCase().replace(/^#/, '');
        const orders = this.getOrders();
        return orders.find(o => {
            const idMatch = o.id && o.id.toLowerCase().replace(/^#/, '') === q;
            const phoneMatch = o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '');
            return idMatch || phoneMatch;
        }) || null;
    },
    updateOrderStatus(orderId, newStatus, notes = null) {
        let orders = this.getOrders();
        const ord = orders.find(o => o.id === orderId);
        if (ord) {
            ord.status = newStatus;
            if (notes !== null) ord.notes = notes;
            this.saveOrders(orders);
            return ord;
        }
        return null;
    },
    deleteOrder(orderId) {
        let orders = this.getOrders().filter(o => o.id !== orderId);
        this.saveOrders(orders);
        return orders;
    },
    saveOrder(order) {
        const orders = this.getOrders();
        if (!order.id) {
            order.id = 'ATT-' + String(Math.floor(100 + Math.random() * 900));
        }
        if (!order.date) {
            order.date = new Date().toISOString().split('T')[0];
        }
        if (!order.status) {
            order.status = 'received'; // default stage 1
        }
        if (!order.notes) {
            order.notes = 'تم استلام الطلب ومراجعته بنجاح عبر المتجر';
        }
        orders.unshift(order);
        this.saveOrders(orders);
        this.syncOrderToGoogleSheets(order);
        return order;
    },
    async syncOrderToGoogleSheets(order) {
        const s = this.getSettings();
        if (!s.googleSheetsWebhookUrl) return;
        try {
            await fetch(s.googleSheetsWebhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    timestamp: new Date().toLocaleString('ar-EG'),
                    customerName: order.customerName,
                    customerPhone: order.customerPhone,
                    governorate: order.governorate,
                    items: order.items.map(i => `${i.name} (x${i.qty})`).join(' | '),
                    total: order.total,
                    deposit: order.deposit || 0,
                    remaining: order.remaining || order.total,
                    paymentMethod: order.paymentMethod
                })
            });
        } catch(e) { console.warn('Google Sheets sync error:', e); }
    },

    // VIP Members & Email Subscribers Management
    getMembers() {
        const stored = localStorage.getItem('attractive_members');
        if (!stored) {
            this.saveMembers(DEFAULT_MEMBERS);
            return DEFAULT_MEMBERS;
        }
        try { return JSON.parse(stored); } catch(e) { return DEFAULT_MEMBERS; }
    },
    saveMembers(list) {
        localStorage.setItem('attractive_members', JSON.stringify(list));
    },
    addMember(data) {
        let members = this.getMembers();
        const emailNorm = (data.email || '').trim().toLowerCase();
        if (!emailNorm) return { success: false, message: this.getLang() === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Email is required' };
        
        const existing = members.find(m => m.email && m.email.toLowerCase() === emailNorm);
        if (existing) {
            return { 
                success: true, 
                alreadyExists: true, 
                member: existing, 
                coupon: existing.customCoupon || 'ATTRACTIVE10',
                message: this.getLang() === 'ar' ? 'أنت مسجل بالفعل في نادي عملاء Attractive المميزين!' : 'You are already registered in our VIP club!' 
            };
        }

        const s = this.getSettings();
        const coupon = s.subscribersDefaultCoupon || s.couponBubbleCode || 'ATTRACTIVE10';
        const newMember = {
            id: 'vip-' + Date.now(),
            name: (data.name || '').trim() || (this.getLang() === 'ar' ? 'عميل مميز' : 'VIP Member'),
            email: emailNorm,
            phone: (data.phone || '').trim(),
            registeredAt: new Date().toISOString().split('T')[0],
            perksActive: true,
            freeShipping: data.freeShipping === true,
            customCoupon: data.customCoupon || coupon,
            notes: data.notes || (this.getLang() === 'ar' ? 'اشتراك عبر الموقع' : 'Website registration')
        };
        members.unshift(newMember);
        this.saveMembers(members);
        return { 
            success: true, 
            alreadyExists: false, 
            member: newMember, 
            coupon: newMember.customCoupon,
            message: this.getLang() === 'ar' ? 'تم تسجيل بريدك بنجاح! تم تفعيل مزايا الخصم الخاصة بك.' : 'Subscribed successfully! Your VIP perks are now active.' 
        };
    },
    updateMember(id, data) {
        let members = this.getMembers();
        const idx = members.findIndex(m => m.id === id);
        if (idx !== -1) {
            members[idx] = Object.assign({}, members[idx], data);
            this.saveMembers(members);
            return members[idx];
        }
        return null;
    },
    deleteMember(id) {
        let members = this.getMembers();
        members = members.filter(m => m.id !== id);
        this.saveMembers(members);
        return true;
    },

    // --- User Accounts (Sign Up / Sign In) API ---
    getUserAccounts() {
        const stored = localStorage.getItem('attractive_user_accounts');
        if (!stored) {
            this.saveUserAccounts(DEFAULT_USER_ACCOUNTS);
            return DEFAULT_USER_ACCOUNTS;
        }
        try { return JSON.parse(stored); } catch(e) { return DEFAULT_USER_ACCOUNTS; }
    },
    saveUserAccounts(list) {
        localStorage.setItem('attractive_user_accounts', JSON.stringify(list));
    },
    registerUserAccount(data) {
        let accounts = this.getUserAccounts();
        const emailNorm = (data.email || '').trim().toLowerCase();
        if (!emailNorm || !data.password) return { success: false, message: this.getLang() === 'ar' ? 'البريد الإلكتروني وكلمة المرور مطلوبان' : 'Email and password are required' };
        
        if (accounts.some(a => a.email.toLowerCase() === emailNorm)) {
            return { success: false, message: this.getLang() === 'ar' ? 'البريد الإلكتروني مسجل بالفعل' : 'Email is already registered' };
        }

        const s = this.getSettings();
        const defaultPerks = Array.isArray(s.userSignupCustomPerksDefault) ? [...s.userSignupCustomPerksDefault] : ['ضمان ذهبي ممتد لمدة سنة مجاناً', 'أولوية في جدول التصنيع والشحن', 'هدية كابل باتش أو وصلة صوتية'];

        const newAccount = {
            id: 'acc-' + Date.now(),
            email: emailNorm,
            passwordEncoded: btoa(data.password), // Base64 encoded for simple obfuscation (No real backend)
            name: (data.name || '').trim(),
            phone: (data.phone || '').trim(),
            registeredAt: new Date().toISOString(),
            active: true,
            customCoupon: s.userSignupCustomCouponDefault || 'WELCOME5',
            freeShipping: s.userSignupFreeShippingDefault !== false,
            perksActive: true,
            discountPercent: parseInt(s.userSignupDiscountPercentDefault) || 5,
            customPerks: defaultPerks,
            notes: 'حساب مسجل عبر الموقع'
        };

        accounts.push(newAccount);
        this.saveUserAccounts(accounts);
        
        this.loginUserAccount(emailNorm, data.password);
        
        return { success: true, account: newAccount };
    },
    addCustomPerkToAccount(id, perkText) {
        let accounts = this.getUserAccounts();
        const acc = accounts.find(a => a.id === id);
        if (!acc) return false;
        if (!Array.isArray(acc.customPerks)) acc.customPerks = [];
        const clean = (perkText || '').trim();
        if (clean && !acc.customPerks.includes(clean)) {
            acc.customPerks.push(clean);
            this.saveUserAccounts(accounts);
            return true;
        }
        return false;
    },
    removeCustomPerkFromAccount(id, index) {
        let accounts = this.getUserAccounts();
        const acc = accounts.find(a => a.id === id);
        if (!acc || !Array.isArray(acc.customPerks)) return false;
        acc.customPerks.splice(index, 1);
        this.saveUserAccounts(accounts);
        return true;
    },
    loginUserAccount(email, password) {
        let accounts = this.getUserAccounts();
        const emailNorm = (email || '').trim().toLowerCase();
        const acc = accounts.find(a => a.email.toLowerCase() === emailNorm);
        const genericError = this.getLang() === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password';
        
        if (!acc) return { success: false, message: genericError };
        if (!acc.active) return { success: false, message: this.getLang() === 'ar' ? 'هذا الحساب معطل حالياً، يرجى التواصل مع الإدارة' : 'This account is currently disabled, please contact support' };
        
        if (atob(acc.passwordEncoded) !== password) {
            return { success: false, message: genericError };
        }
        
        localStorage.setItem('attractive_logged_in_user', JSON.stringify(acc.id));
        return { success: true, account: acc };
    },
    requestPasswordReset(emailOrPhone) {
        const val = (emailOrPhone || '').trim().toLowerCase();
        const isAr = this.getLang() === 'ar';
        if (!val) return { success: false, message: isAr ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف' : 'Please enter email or phone' };
        const accounts = this.getUserAccounts();
        const acc = accounts.find(a => (a.email && a.email.toLowerCase() === val) || (a.phone && a.phone === val));
        if (acc) {
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            sessionStorage.setItem('attractive_reset_token_' + acc.id, JSON.stringify({ token, expires: Date.now() + 15 * 60 * 1000 }));
            return { 
                success: true, 
                message: isAr ? 'تم إرسال رمز التحقق لاستعادة كلمة المرور (رمز التحقق للتجربة: ' + token + ')' : 'Verification code sent to your account (Demo code: ' + token + ')',
                accId: acc.id,
                demoCode: token
            };
        }
        return {
            success: true,
            message: isAr ? 'إذا كان الحساب مسجلاً لدينا، فستصلك تعليمات استعادة كلمة المرور فوراً.' : 'If your account is registered, reset instructions have been sent.'
        };
    },
    resetPasswordWithToken(accId, token, newPassword) {
        const isAr = this.getLang() === 'ar';
        if (!newPassword || newPassword.length < 4) {
            return { success: false, message: isAr ? 'كلمة المرور يجب أن لا تقل عن 4 أحرف أو أرقام' : 'Password must be at least 4 characters' };
        }
        const saved = JSON.parse(sessionStorage.getItem('attractive_reset_token_' + accId) || 'null');
        if (!saved || saved.token !== (token || '').trim()) {
            return { success: false, message: isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية' : 'Invalid or expired reset token' };
        }
        if (Date.now() > saved.expires) {
            return { success: false, message: isAr ? 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد' : 'Token has expired, please request a new one' };
        }
        const accounts = this.getUserAccounts();
        const acc = accounts.find(a => a.id === accId);
        if (!acc) return { success: false, message: isAr ? 'الحساب غير موجود' : 'Account not found' };
        acc.passwordEncoded = btoa(newPassword);
        this.saveUserAccounts(accounts);
        sessionStorage.removeItem('attractive_reset_token_' + accId);
        return { success: true, message: isAr ? 'تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول' : 'Password updated successfully! You can now sign in' };
    },
    logoutUserAccount() {
        localStorage.removeItem('attractive_logged_in_user');
        window.location.reload();
    },
    getCurrentUserAccount() {
        const id = JSON.parse(localStorage.getItem('attractive_logged_in_user') || 'null');
        if (!id) return null;
        let accounts = this.getUserAccounts();
        const acc = accounts.find(a => a.id === id);
        if (acc && acc.active) return acc;
        if (acc && !acc.active) this.logoutUserAccount();
        return null;
    },
    updateUserAccount(id, data) {
        let accounts = this.getUserAccounts();
        const idx = accounts.findIndex(a => a.id === id);
        if (idx !== -1) {
            accounts[idx] = Object.assign({}, accounts[idx], data);
            this.saveUserAccounts(accounts);
            return accounts[idx];
        }
        return null;
    },
    deleteUserAccount(id) {
        let accounts = this.getUserAccounts();
        accounts = accounts.filter(a => a.id !== id);
        this.saveUserAccounts(accounts);
        return true;
    },

    // --- Navigation Bar Menu Items API ---
    getNavItems() {
        const stored = localStorage.getItem('attractive_nav_items');
        if (!stored) {
            localStorage.setItem('attractive_nav_items', JSON.stringify(DEFAULT_NAV_ITEMS));
            return DEFAULT_NAV_ITEMS;
        }
        if (stored.includes('\uFFFD') || (stored.includes('Ø') && stored.includes('Ù'))) {
            localStorage.setItem('attractive_nav_items', JSON.stringify(DEFAULT_NAV_ITEMS));
            return DEFAULT_NAV_ITEMS;
        }
        try { 
            let list = JSON.parse(stored);
            if (!Array.isArray(list)) return DEFAULT_NAV_ITEMS;
            
            // Normalize builder and repair grouping
            let modified = false;
            const builderItem = list.find(i => i.id === 'nav-builder');
            if (builderItem) {
                if (!builderItem.isServicesDropdown || builderItem.titleAr === 'التفصيل الخاص') {
                    builderItem.titleAr = 'تفصيل وصيانة الكابلات';
                    builderItem.titleEn = 'Custom & Repair';
                    builderItem.isServicesDropdown = true;
                    modified = true;
                }
            }
            if (list.some(i => i.id === 'nav-repair')) {
                list = list.filter(i => i.id !== 'nav-repair');
                modified = true;
            }
            // Normalize mega menu fields for items that don't have them yet
            list.forEach(item => {
                const def = DEFAULT_NAV_ITEMS.find(d => d.id === item.id);
                if (item.hasMegaMenu === undefined && def) {
                    item.hasMegaMenu = def.hasMegaMenu || false;
                    item.megaMenuColumns = def.megaMenuColumns || [];
                    modified = true;
                }
                if (def && def.hasMegaMenu && (!item.megaMenuColumns || item.megaMenuColumns.length === 0)) {
                    item.hasMegaMenu = true;
                    item.megaMenuColumns = JSON.parse(JSON.stringify(def.megaMenuColumns || []));
                    modified = true;
                }
                if (!Array.isArray(item.megaMenuColumns)) {
                    item.megaMenuColumns = [];
                    modified = true;
                }
            });
            if (modified) {
                this.saveNavItems(list);
            }
            return list;
        } catch(e) { return DEFAULT_NAV_ITEMS; }
    },
    saveNavItems(list) {
        localStorage.setItem('attractive_nav_items', JSON.stringify(list));
        this.pushToServer('navItems', list);
    },
    addNavItem(item) {
        let items = this.getNavItems();
        if (!item.id) item.id = 'nav-' + Date.now();
        item.order = parseInt(item.order) || (items.length + 1);
        item.active = item.active !== false;
        items.push(item);
        this.saveNavItems(items);
        return item;
    },
    updateNavItem(id, data) {
        let items = this.getNavItems();
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
            items[idx] = Object.assign({}, items[idx], data);
            this.saveNavItems(items);
            return items[idx];
        }
        return null;
    },
    deleteNavItem(id) {
        let items = this.getNavItems();
        items = items.filter(i => i.id !== id);
        this.saveNavItems(items);
        return true;
    },
    resetNavItems() {
        this.saveNavItems(DEFAULT_NAV_ITEMS);
        return DEFAULT_NAV_ITEMS;
    },

    // Media & Site Images Manager
    getMedia() {
        const stored = localStorage.getItem('attractive_media');
        try { return stored ? JSON.parse(stored) : []; } catch(e) { return []; }
    },
    saveMedia(list) {
        localStorage.setItem('attractive_media', JSON.stringify(list));
    },
    addMedia(item) {
        let list = this.getMedia();
        item.id = 'img-' + Date.now();
        item.date = new Date().toISOString().split('T')[0];
        list.unshift(item);
        this.saveMedia(list);
        return item;
    },
    deleteMedia(id) {
        let list = this.getMedia().filter(m => m.id !== id);
        this.saveMedia(list);
        return list;
    },

    // Promotion Announcement Bar
    renderTopPromoBanner() {
        const s = this.getSettings();
        const isDismissed = sessionStorage.getItem('attractive_promo_dismissed') === 'true';
        let container = document.getElementById('topPromoBannerContainer');
        if (!s.promoActive || isDismissed) {
            if (container) container.innerHTML = '';
            return;
        }

        const isAr = this.getLang() === 'ar';
        const text = isAr ? (s.promoTextAr || s.promoTextEn) : (s.promoTextEn || s.promoTextAr);
        const badge = isAr ? (s.promoBadgeAr || s.promoBadgeEn) : (s.promoBadgeEn || s.promoBadgeAr);
        const linkText = isAr ? (s.promoLinkTextAr || 'تسوق الآن') : (s.promoLinkTextEn || 'Shop Now');
        const link = s.promoLink || 'store.html';
        const bgCol = s.promoBgColor || '#C8102E';

        const bannerHtml = `
            <div id="topPromoBanner" style="background: ${bgCol};" class="text-white py-2 px-4 text-xs font-bold transition-all duration-300 relative z-50 shadow-md">
                <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2 flex-1 justify-center text-center truncate">
                        ${badge ? `<span class="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex-shrink-0">${this.sanitize(badge)}</span>` : ''}
                        <span class="truncate">${this.sanitize(text)}</span>
                        ${link ? `<a href="${link}" class="underline hover:text-white/80 font-black flex items-center gap-0.5 flex-shrink-0"><span>${this.sanitize(linkText)}</span><span class="material-symbols-outlined text-xs">arrow_forward</span></a>` : ''}
                    </div>
                    <button onclick="ProCable.dismissPromoBanner()" class="text-white/70 hover:text-white text-base leading-none p-1 flex-shrink-0" title="إغلاق">&#10005;</button>
                </div>
            </div>
        `;

        if (!container) {
            container = document.createElement('div');
            container.id = 'topPromoBannerContainer';
            document.body.insertBefore(container, document.body.firstChild);
        }
        container.innerHTML = bannerHtml;
    },
    dismissPromoBanner() {
        sessionStorage.setItem('attractive_promo_dismissed', 'true');
        const container = document.getElementById('topPromoBannerContainer');
        if (container) container.innerHTML = '';
    },

    // Cable Maintenance Navigation Handler
    renderRepairNav() {
        const s = this.getSettings();
        document.querySelectorAll('.repair-nav-item').forEach(el => {
            if (s.repairActive !== false) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    },

    // Order Tracking Modal Display Helper
    showOrderTrackingModal(orderId = '') {
        let modal = document.getElementById('orderTrackingModal');
        if (!modal) {
            this.createOrderTrackingModalDOM();
            modal = document.getElementById('orderTrackingModal');
        }
        if (orderId) {
            const input = document.getElementById('trackOrderInput');
            if (input) input.value = orderId;
            this.handleTrackOrderSearch(orderId);
        }
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    closeOrderTrackingModal() {
        const modal = document.getElementById('orderTrackingModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    },
    createOrderTrackingModalDOM() {
        const isAr = this.getLang() === 'ar';
        const div = document.createElement('div');
        div.id = 'orderTrackingModal';
        div.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] hidden items-center justify-center p-4 transition-opacity duration-300';
        div.innerHTML = `
            <div class="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 border border-outline-variant shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center border-b border-outline-variant pb-4 mb-5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                            <span class="material-symbols-outlined text-xl">track_changes</span>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-on-surface">${isAr ? 'تتبع مسار الطلب' : 'Track Your Order'}</h3>
                            <p class="text-xs text-on-surface-variant">${isAr ? 'استعلم لحظياً عن كابلك من الاستلام للشحن' : 'Real-time order stage and assembly progress'}</p>
                        </div>
                    </div>
                    <button onclick="ProCable.closeOrderTrackingModal()" class="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high flex items-center justify-center text-gray-500 hover:text-black transition">&#10005;</button>
                </div>

                <div class="mb-5">
                    <label class="block text-xs font-bold text-on-surface mb-1.5">${isAr ? 'أدخل رقم الطلب (مثال: ATT-101) أو رقم الموبايل:' : 'Enter Order ID (e.g., ATT-101) or Phone Number:'}</label>
                    <div class="flex gap-2">
                        <input id="trackOrderInput" type="text" placeholder="${isAr ? 'مثال: ATT-101 أو 010...' : 'e.g. ATT-101 or 010...'}" class="flex-1 p-3 bg-surface border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-xs font-bold dir-ltr"/>
                        <button onclick="ProCable.handleTrackOrderSearch(document.getElementById('trackOrderInput').value)" class="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs transition shadow flex items-center gap-1">
                            <span>${isAr ? 'تتبع' : 'Track'}</span>
                            <span class="material-symbols-outlined text-sm">search</span>
                        </button>
                    </div>
                </div>

                <div id="trackingResultArea" class="hidden"></div>
            </div>
        `;
        document.body.appendChild(div);
    },
    handleTrackOrderSearch(query) {
        const resultArea = document.getElementById('trackingResultArea');
        if (!resultArea) return;
        const ord = this.getOrder(query);
        const isAr = this.getLang() === 'ar';

        if (!ord) {
            resultArea.classList.remove('hidden');
            resultArea.innerHTML = `
                <div class="bg-red-50 text-error p-4 rounded-2xl border border-red-200 text-center text-xs font-bold flex flex-col items-center gap-2">
                    <span class="material-symbols-outlined text-2xl">search_off</span>
                    <span>${isAr ? 'عذراً، لم يتم العثور على طلب بهذا الرقم أو الهاتف. يرجى التحقق وإعادة المحاولة.' : 'Order not found for this ID or Phone. Please verify and try again.'}</span>
                </div>
            `;
            return;
        }

        const stages = ORDER_STAGES;
        const currentStageKey = ord.status || 'received';
        const currentStage = stages[currentStageKey] || stages['received'];
        const percent = currentStage.percent;

        resultArea.classList.remove('hidden');
        resultArea.innerHTML = `
            <div class="bg-surface rounded-2xl p-5 border border-outline-variant space-y-4">
                <div class="flex justify-between items-start border-b border-outline-variant pb-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-black text-sm text-on-surface">#${ord.id}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${currentStage.badgeClass}">
                                ${isAr ? currentStage.labelAr : currentStage.labelEn}
                            </span>
                        </div>
                        <span class="text-xs text-gray-500 block mt-0.5">👤 ${ord.customerName || (isAr ? 'العميل' : 'Customer')} • 📅 ${ord.date || ''}</span>
                    </div>
                    <div class="text-end">
                        <span class="text-xs text-gray-400 block">${isAr ? 'الإجمالي' : 'Total'}</span>
                        <span class="text-sm font-black text-primary">${this.formatNum(ord.total || 0)} ${isAr ? 'ج.م' : 'EGP'}</span>
                    </div>
                </div>

                <!-- Three Stages Progress Bar -->
                <div>
                    <div class="flex justify-between text-[11px] font-bold text-on-surface mb-2 px-1">
                        <span class="${currentStage.step >= 1 ? 'text-primary' : 'text-gray-400'}">${isAr ? '1. استلام الطلب' : '1. Received'}</span>
                        <span class="${currentStage.step >= 2 ? 'text-primary' : 'text-gray-400'}">${isAr ? '2. التجهيز واللحام' : '2. In Assembly'}</span>
                        <span class="${currentStage.step >= 3 ? 'text-primary' : 'text-gray-400'}">${isAr ? '3. الشحن والتسليم' : '3. Shipped'}</span>
                    </div>

                    <!-- Progress Bar Track -->
                    <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden p-0.5 relative">
                        <div class="bg-primary h-full rounded-full transition-all duration-700 shadow-sm" style="width: ${percent}%;"></div>
                    </div>

                    <div class="mt-3 bg-white p-3 rounded-xl border border-outline-variant text-xs">
                        <div class="flex items-center gap-2 text-primary font-bold mb-1">
                            <span class="material-symbols-outlined text-base">${currentStage.icon}</span>
                            <span>${isAr ? currentStage.labelAr : currentStage.labelEn}</span>
                        </div>
                        <p class="text-[11px] text-gray-600 leading-relaxed">${isAr ? currentStage.descAr : currentStage.descEn}</p>
                        ${ord.notes ? `<div class="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-medium"><strong>${isAr ? 'ملاحظات:' : 'Notes:'}</strong> ${this.sanitize(ord.notes)}</div>` : ''}
                    </div>
                </div>

                <!-- Order items breakdown -->
                ${ord.items && ord.items.length ? `
                    <div class="pt-2 border-t border-outline-variant text-xs">
                        <span class="font-bold text-gray-700 block mb-1.5">${isAr ? 'محتويات الطلب:' : 'Order Items:'}</span>
                        <div class="space-y-1">
                            ${ord.items.map(i => `<div class="flex justify-between text-gray-600 text-[11px]"><span>• ${this.sanitize(i.name)} [x${i.qty}]</span><span class="font-bold">${this.formatNum(i.price)} ${isAr ? 'ج.م' : 'EGP'}</span></div>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // WhatsApp Message
    buildWhatsAppMessage(order) {
        const s = this.getSettings();
        const isAr = this.getLang() === 'ar';
        const lines = [];

        lines.push(isAr ? (s.whatsappGreetingAr || "🎙️ *طلب جديد من Attractive*") : (s.whatsappGreetingEn || "🎙️ *New Order from Attractive*"));
        lines.push("─────────────────────");

        if (s.showOrderId && order.id) {
            lines.push(`🔢 *${isAr ? 'رقم الطلب' : 'Order ID'}:* #${order.id}`);
        }
        if (s.showCustomerName && order.customerName) {
            lines.push(`👤 *${isAr ? 'الاسم' : 'Name'}:* ${order.customerName}`);
        }
        if (s.showPhone && order.customerPhone) {
            lines.push(`📱 *${isAr ? 'الموبايل' : 'Phone'}:* ${order.customerPhone}`);
        }
        if (s.showAddress && order.governorate) {
            lines.push(`📍 *${isAr ? 'المحافظة والعنوان' : 'Governorate & Address'}:* ${order.governorate} ${order.addressDetails ? ' - ' + order.addressDetails : ''}`);
        }

        if (s.showItemsList && order.items && order.items.length) {
            lines.push("");
            lines.push(`🛍️ *${isAr ? 'تفاصيل الكابلات والمنتجات' : 'Products & Cables'}:*`);
            order.items.forEach(i => {
                let itemDesc = i.name;
                if (i.length) itemDesc += ` (${i.length} ${isAr ? 'م' : 'm'})`;
                if (i.cable) itemDesc += ` [${i.cable}]`;
                if (i.customLabel) itemDesc += ` [طباعة: ${i.customLabel}]`;
                lines.push(`• ${itemDesc} [x${i.qty || 1}] = ${i.price} ${isAr ? 'ج.م' : 'EGP'}`);
            });
        }

        lines.push("─────────────────────");
        if (s.showSubtotal) lines.push(`💰 *${isAr ? 'قيمة المنتجات' : 'Subtotal'}:* ${order.subtotal || order.total} ${isAr ? 'ج.م' : 'EGP'}`);
        if (s.showShippingFee && (order.shippingFee !== undefined && order.shippingFee !== null)) {
            const shipText = order.shippingFee === 0 ? (isAr ? 'مجاني 🎁' : 'Free 🎁') : `${order.shippingFee} ${isAr ? 'ج.م' : 'EGP'}`;
            lines.push(`🚚 *${isAr ? 'الشحن' : 'Shipping'}:* ${shipText}`);
        }
        if (order.discount) lines.push(`🏷️ *${isAr ? 'الخصم' : 'Discount'}:* -${order.discount} ${isAr ? 'ج.م' : 'EGP'}`);
        lines.push(`💵 *${isAr ? 'الإجمالي الكلي' : 'Total Due'}:* ${order.total} ${isAr ? 'ج.م' : 'EGP'}`);

        if (s.showDeposit && order.deposit && order.deposit > 0) {
            lines.push(`⚡ *${isAr ? 'العربون المطلوب / المدفوع' : 'Deposit Required/Paid'}:* ${order.deposit} ${isAr ? 'ج.م' : 'EGP'}`);
            lines.push(`💳 *${isAr ? 'المتبقي عند الاستلام' : 'Remaining on Delivery'}:* ${order.remaining || (order.total - order.deposit)} ${isAr ? 'ج.م' : 'EGP'}`);
        }

        if (s.showPaymentMethod && order.paymentMethod) {
            lines.push(`💼 *${isAr ? 'طريقة الدفع' : 'Payment Method'}:* ${order.paymentMethod}`);
        }

        lines.push("");
        lines.push(isAr ? (s.whatsappFooterAr || "شكراً لاختيارك Attractive ⭐") : (s.whatsappFooterEn || "Thank you for choosing Attractive ⭐"));

        return encodeURIComponent(lines.join('\n'));
    },

    // Language Helper & Full Translation Dispatcher
    getLang() {
        return localStorage.getItem('attractive_lang') || localStorage.getItem('procable_lang') || 'ar';
    },
    setLang(lang) {
        localStorage.setItem('attractive_lang', lang);
        localStorage.setItem('procable_lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        this.applyLanguageToDOM();
    },
    toggleLang() {
        const next = this.getLang() === 'ar' ? 'en' : 'ar';
        this.setLang(next);
        window.location.reload();
    },
    applyLanguageToDOM() {
        const isAr = this.getLang() === 'ar';
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
        document.querySelectorAll('[data-ar]').forEach(el => {
            el.innerHTML = isAr ? el.getAttribute('data-ar') : (el.getAttribute('data-en') || el.getAttribute('data-ar'));
        });
        document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
            el.placeholder = isAr ? el.getAttribute('data-ar-placeholder') : (el.getAttribute('data-en-placeholder') || el.getAttribute('data-ar-placeholder'));
        });
        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            btn.innerText = isAr ? 'EN' : 'عربي';
        });
    },

    formatNum(num) {
        const lang = this.getLang();
        if (lang === 'ar') {
            const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return String(num).replace(/\d/g, d => arDigits[d]);
        }
        return String(num);
    },

    // Security & Admin Auth
    isAdminLoggedIn() {
        const session = sessionStorage.getItem('attractive_admin_session') || sessionStorage.getItem('procable_admin_session');
        return session === 'authenticated_attractive_admin_token';
    },
    loginAdmin(password) {
        const lockUntil = localStorage.getItem('attractive_admin_lock');
        if (lockUntil && Date.now() < parseInt(lockUntil)) {
            const remainingMins = Math.ceil((parseInt(lockUntil) - Date.now()) / 60000);
            return { success: false, locked: true, remainingMins };
        }

        const settings = this.getSettings();
        if (password === settings.adminPassHash || password === "attractive2026") {
            sessionStorage.setItem('attractive_admin_session', 'authenticated_attractive_admin_token');
            sessionStorage.setItem('procable_admin_session', 'authenticated_attractive_admin_token');
            sessionStorage.setItem('attractive_api_secret', password);
            localStorage.removeItem('attractive_admin_attempts');
            localStorage.removeItem('attractive_admin_lock');
            return { success: true };
        } else {
            let attempts = parseInt(localStorage.getItem('attractive_admin_attempts') || '0') + 1;
            localStorage.setItem('attractive_admin_attempts', attempts);
            if (attempts >= 5) {
                const lockTime = Date.now() + 5 * 60 * 1000;
                localStorage.setItem('attractive_admin_lock', lockTime);
                return { success: false, locked: true, remainingMins: 5 };
            }
            return { success: false, attemptsLeft: 5 - attempts };
        }
    },
    logoutAdmin() {
        sessionStorage.removeItem('attractive_admin_session');
        sessionStorage.removeItem('procable_admin_session');
        window.location.href = 'index.html';
    },
    changeAdminPassword(newPassword) {
        if (!newPassword || newPassword.length < 6) {
            return { success: false, message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' };
        }
        let settings = this.getSettings();
        settings.adminPassHash = newPassword;
        this.saveSettings(settings);
        sessionStorage.setItem('attractive_api_secret', newPassword);
        return { success: true };
    },

    // Hidden Keyboard Shortcut (#26): Ctrl + Alt + P
    initHiddenAdminShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && (e.key === 'p' || e.key === 'P' || e.code === 'KeyP')) {
                e.preventDefault();
                window.location.href = 'admin.html';
            }
        });
    },

    // Toast
    showToast(message, type = 'info') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-5 ltr:right-5 rtl:left-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const s = this.getSettings();
        const primaryCol = s.primaryColor || '#C8102E';
        const bgColors = {
            success: 'bg-[#16a34a] text-white',
            error: 'bg-[#ba1a1a] text-white',
            info: 'bg-[#1D1D1F] text-white'
        };
        const icons = {
            success: 'check_circle',
            error: 'error',
            info: 'info'
        };

        toast.className = `${bgColors[type] || bgColors.info} p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300 border border-white/10`;
        toast.innerHTML = `
            <span class="material-symbols-outlined text-xl">${icons[type] || 'info'}</span>
            <span class="flex-1">${this.sanitize(message)}</span>
            <button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white text-lg">&#10005;</button>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
        setTimeout(() => {
            toast.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // --- 8. Store Policies Modals (Privacy & Return) ---
    showPolicyModal(type = 'privacy') {
        let modal = document.getElementById('policyModal');
        if (!modal) {
            this.createPolicyModalDOM();
            modal = document.getElementById('policyModal');
        }

        const s = this.getSettings();
        const isAr = this.getLang() === 'ar';
        const titleEl = document.getElementById('policyModalTitle');
        const iconEl = document.getElementById('policyModalIcon');
        const contentEl = document.getElementById('policyModalContent');

        let title = '';
        let content = '';
        let icon = 'policy';

        if (type === 'privacy') {
            title = isAr ? (s.privacyPolicyTitleAr || s.privacyPolicyTitleEn) : (s.privacyPolicyTitleEn || s.privacyPolicyTitleAr);
            content = isAr ? (s.privacyPolicyContentAr || s.privacyPolicyContentEn) : (s.privacyPolicyContentEn || s.privacyPolicyContentAr);
            icon = 'security';
        } else {
            title = isAr ? (s.returnPolicyTitleAr || s.returnPolicyTitleEn) : (s.returnPolicyTitleEn || s.returnPolicyTitleAr);
            content = isAr ? (s.returnPolicyContentAr || s.returnPolicyContentEn) : (s.returnPolicyContentEn || s.returnPolicyContentAr);
            icon = 'published_with_changes';
        }

        if (titleEl) titleEl.innerText = title;
        if (iconEl) iconEl.innerText = icon;
        if (contentEl) {
            // Render structured text paragraphs
            const paragraphs = (content || '').split('\n').filter(line => line.trim());
            contentEl.innerHTML = paragraphs.map(p => {
                const isHeading = p.match(/^(\d+\.|\*|\-)/);
                return `<p class="mb-3 text-xs sm:text-sm text-gray-700 leading-relaxed ${isHeading ? 'font-bold text-on-surface bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/60' : ''}">${this.sanitize(p)}</p>`;
            }).join('');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.add('active'), 10);
    },
    closePolicyModal() {
        const modal = document.getElementById('policyModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    },
    createPolicyModalDOM() {
        const isAr = this.getLang() === 'ar';
        const div = document.createElement('div');
        div.id = 'policyModal';
        div.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4 transition-opacity duration-300';
        div.onclick = (e) => { if (e.target === div) ProCable.closePolicyModal(); };
        div.innerHTML = `
            <div class="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl relative max-h-[85vh] flex flex-col">
                <div class="flex justify-between items-center border-b border-outline-variant pb-4 mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                            <span id="policyModalIcon" class="material-symbols-outlined text-xl">policy</span>
                        </div>
                        <div>
                            <h3 id="policyModalTitle" class="text-base sm:text-lg font-bold text-on-surface">سياسة المتجر</h3>
                            <p class="text-xs text-on-surface-variant"><span class="site-brand-name">Attractive</span> Audio Studio</p>
                        </div>
                    </div>
                    <button onclick="ProCable.closePolicyModal()" class="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high flex items-center justify-center text-gray-500 hover:text-black transition">&#10005;</button>
                </div>

                <div id="policyModalContent" class="overflow-y-auto flex-1 pr-1 pl-1 text-start"></div>

                <div class="border-t border-outline-variant pt-4 mt-4 flex justify-between items-center">
                    <span class="text-[11px] text-gray-400 font-bold">&copy; Attractive Professional Audio</span>
                    <button onclick="ProCable.closePolicyModal()" class="bg-surface-container hover:bg-primary hover:text-white px-5 py-2 rounded-xl text-xs font-bold text-on-surface transition">
                        ${isAr ? 'إغلاق' : 'Close'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    },

    // --- 9. About Us Modal & Story ---
    showAboutModal() {
        let modal = document.getElementById('aboutModal');
        if (!modal) {
            this.createAboutModalDOM();
            modal = document.getElementById('aboutModal');
        }

        const s = this.getSettings();
        const isAr = this.getLang() === 'ar';
        const titleEl = document.getElementById('aboutModalTitle');
        const descEl = document.getElementById('aboutModalDesc');
        const imgBox = document.getElementById('aboutModalImageBox');
        const badgeEl = document.getElementById('aboutModalBadge');

        if (titleEl) titleEl.innerText = isAr ? (s.aboutTitleAr || s.aboutTitleEn) : (s.aboutTitleEn || s.aboutTitleAr);
        if (descEl) {
            const story = isAr ? (s.aboutStoryAr || s.aboutStoryEn) : (s.aboutStoryEn || s.aboutStoryAr);
            const paragraphs = (story || '').split('\n').filter(line => line.trim());
            descEl.innerHTML = paragraphs.map(p => `<p class="mb-3 text-xs sm:text-sm text-gray-700 leading-relaxed">${this.sanitize(p)}</p>`).join('');
        }
        if (badgeEl) {
            badgeEl.innerText = isAr ? (s.aboutBadgeAr || s.aboutBadgeEn) : (s.aboutBadgeEn || s.aboutBadgeAr);
        }

        if (imgBox) {
            if (s.aboutImage && s.aboutImage.trim()) {
                imgBox.innerHTML = `<img src="${s.aboutImage.trim()}" alt="Attractive Studio" class="w-full h-52 object-cover rounded-2xl shadow-md border border-outline-variant"/>`;
                imgBox.classList.remove('hidden');
            } else {
                imgBox.classList.add('hidden');
                imgBox.innerHTML = '';
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.add('active'), 10);
    },
    closeAboutModal() {
        const modal = document.getElementById('aboutModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    },
    createAboutModalDOM() {
        const isAr = this.getLang() === 'ar';
        const div = document.createElement('div');
        div.id = 'aboutModal';
        div.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4 transition-opacity duration-300';
        div.onclick = (e) => { if (e.target === div) ProCable.closeAboutModal(); };
        div.innerHTML = `
            <div class="bg-surface-container-lowest max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-2xl relative max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center border-b border-outline-variant pb-4 mb-4">
                    <div class="flex items-center gap-3">
                        <img src="logo.png" alt="Attractive" class="site-logo-img h-8 object-contain"/>
                        <div>
                            <span id="aboutModalBadge" class="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full inline-block mb-0.5">Attractive</span>
                            <h3 id="aboutModalTitle" class="text-base sm:text-lg font-bold text-on-surface">عن الشركة</h3>
                        </div>
                    </div>
                    <button onclick="ProCable.closeAboutModal()" class="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high flex items-center justify-center text-gray-500 hover:text-black transition">&#10005;</button>
                </div>

                <div class="overflow-y-auto flex-1 pr-1 pl-1 space-y-4">
                    <div id="aboutModalImageBox" class="hidden"></div>
                    <div id="aboutModalDesc" class="text-start"></div>

                    <!-- Craftsmanship Pillars Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div class="p-3 bg-surface rounded-2xl border border-outline-variant text-center">
                            <span class="material-symbols-outlined text-primary text-2xl mb-1">verified_user</span>
                            <h4 class="font-bold text-xs text-on-surface mb-0.5">${isAr ? 'أجهزة معتمدة دولياً' : 'Internationally Certified'}</h4>
                            <p class="text-[10px] text-gray-500">${isAr ? 'منتجات موثقة ومطابقة للمعايير الدولية' : 'Products meeting global safety standards'}</p>
                        </div>
                        <div class="p-3 bg-surface rounded-2xl border border-outline-variant text-center">
                            <span class="material-symbols-outlined text-primary text-2xl mb-1">engineering</span>
                            <h4 class="font-bold text-xs text-on-surface mb-0.5">${isAr ? 'تركيب ودعم فني' : 'Expert Installation'}</h4>
                            <p class="text-[10px] text-gray-500">${isAr ? 'فريق هندسي متخصص في أنظمة التيار الخفيف' : 'Specialized light current engineering team'}</p>
                        </div>
                        <div class="p-3 bg-surface rounded-2xl border border-outline-variant text-center">
                            <span class="material-symbols-outlined text-primary text-2xl mb-1">verified</span>
                            <h4 class="font-bold text-xs text-on-surface mb-0.5">${isAr ? 'ضمان عامان كاملان' : '2-Year Full Warranty'}</h4>
                            <p class="text-[10px] text-gray-500">${isAr ? 'ضمان شامل على الأجهزة والتركيب' : 'Full coverage on devices & installation'}</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-outline-variant pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <span class="material-symbols-outlined text-base text-whatsapp">chat</span>
                        <span>${isAr ? 'ورشة ومعمل Attractive مفتوح لاستفساراتكم' : 'Attractive workshop open for inquiries'}</span>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <a href="store.html" class="flex-1 sm:flex-initial text-center bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary-dark transition shadow">
                            ${isAr ? 'تصفح المتجر' : 'Browse Store'}
                        </a>
                        <button onclick="ProCable.closeAboutModal()" class="bg-surface border border-outline-variant hover:bg-surface-container-high px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface transition">
                            ${isAr ? 'إغلاق' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    },

        // --- EDGE-TAB DOCK (slides out of the screen edge) ---
    renderCouponBubble() {
        if (typeof window !== 'undefined' && (window.location.pathname.includes('admin.html') || document.getElementById('adminApp'))) {
            const oldBubble = document.getElementById('couponPromoBubble');
            if (oldBubble) oldBubble.remove();
            const oldDock = document.getElementById('floatingCouponBadge');
            if (oldDock) oldDock.remove();
            return;
        }
        const s = this.getSettings();
        if (!s.couponBubbleActive) {
            const oldBubble = document.getElementById('couponPromoBubble');
            if (oldBubble) oldBubble.remove();
            const oldDock = document.getElementById('floatingCouponBadge');
            if (oldDock) oldDock.remove();
            return;
        }

        const isAr = this.getLang() === 'ar';
        const code = s.couponBubbleCode || 'ATTRACTIVE10';
        const title = isAr ? (s.couponBubbleTitleAr || s.couponBubbleTitleEn) : (s.couponBubbleTitleEn || s.couponBubbleTitleAr);
        const text = isAr ? (s.couponBubbleTextAr || s.couponBubbleTextEn) : (s.couponBubbleTextEn || s.couponBubbleTextAr);
        const bgCol = s.couponBubbleBg || '#1D1D1F';
        const pos = s.couponBubblePosition || 'right';
        const br = parseInt(s.couponBubbleBorderRadius || '24');
        const shadow = s.couponBubbleShadow !== false ? 'shadow-2xl' : '';
        const fontSize = parseInt(s.couponBubbleFontSize || '13');
        const codeColor = s.couponBubbleCodeColor || '#fbbf24';
        const showIcon = s.couponBubbleShowIcon !== false;
        const dockBg = s.couponBubbleDockBg || '#C8102E';
        const dockTextColor = s.couponBubbleDockTextColor || '#ffffff';
        const dockLabel = isAr ? (s.couponBubbleDockLabel || 'خصم') : (s.couponBubbleDockLabelEn || 'Coupon');
        const posStyle = pos === 'left'
            ? 'left: 0; right: auto; transform-origin: left bottom;'
            : 'right: 0; left: auto; transform-origin: right bottom;';
        const bubblePosClass = pos === 'left' ? 'left-4' : 'right-4';

        // --- EDGE-TAB DOCK (slides out of the screen edge) ---
        let dock = document.getElementById('floatingCouponBadge');
        if (!dock) {
            dock = document.createElement('button');
            dock.id = 'floatingCouponBadge';
            document.body.appendChild(dock);
        }
        dock.onclick = () => ProCable.expandCouponBubble();
        dock.title = dockLabel;
        dock.style.cssText = `
            position: fixed;
            bottom: 38%;
            ${pos === 'left' ? 'left: 0; right: auto;' : 'right: 0; left: auto;'}
            z-index: 9000;
            background: ${dockBg};
            color: ${dockTextColor};
            writing-mode: vertical-${pos === 'left' ? 'lr' : 'rl'};
            text-orientation: mixed;
            ${pos === 'right' ? 'transform: rotate(180deg);' : ''}
            padding: 14px 9px;
            border-radius: ${pos === 'left' ? '0 10px 10px 0' : '10px 0 0 10px'};
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            letter-spacing: 0.04em;
            box-shadow: ${pos === 'left' ? '4px 0 18px rgba(0,0,0,0.25)' : '-4px 0 18px rgba(0,0,0,0.25)'};
            transition: all 0.3s ease;
            border: none;
            outline: none;
            user-select: none;
        `;
        dock.innerHTML = `
            ${showIcon ? `<span class="material-symbols-outlined" style="font-size:15px; writing-mode:horizontal-tb; transform: rotate(${pos === 'right' ? '90' : '-90'}deg); display:block;">redeem</span>` : ''}
            <span style="white-space:nowrap;">${this.sanitize(dockLabel)}</span>
        `;

        // --- FULL POPUP BUBBLE ---
        let bubble = document.getElementById('couponPromoBubble');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.id = 'couponPromoBubble';
            document.body.appendChild(bubble);
        }
        bubble.style.cssText = `
            position: fixed;
            bottom: 24px;
            ${pos === 'left' ? 'left: 16px; right: auto;' : 'right: 16px; left: auto;'}
            z-index: 9001;
            max-width: 320px;
            width: 90%;
            background-color: ${bgCol};
            border-radius: ${br}px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.15);
            color: #ffffff;
            font-size: ${fontSize}px;
            ${s.couponBubbleShadow !== false ? 'box-shadow: 0 20px 60px rgba(0,0,0,0.4);' : ''}
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        `;

        const isDismissed = sessionStorage.getItem('attractive_bubble_dismissed') === 'true';
        if (isDismissed) {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(20px) scale(0.95)';
            bubble.style.pointerEvents = 'none';
            dock.style.display = 'flex';
        } else {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0) scale(1)';
            bubble.style.pointerEvents = 'auto';
            dock.style.display = 'none';
        }

        bubble.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    ${showIcon ? `<span style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center;">
                        <span class="material-symbols-outlined" style="font-size:17px;">redeem</span>
                    </span>` : ''}
                    <span style="font-size:10px; font-weight:900; letter-spacing:0.08em; background:rgba(255,255,255,0.12); padding:2px 10px; border-radius:99px; text-transform:uppercase;">
                        ${isAr ? 'هدية لزوار الموقع' : 'Visitor Special'}
                    </span>
                </div>
                <button onclick="ProCable.dismissCouponBubble()" style="background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:16px; line-height:1; padding:2px 6px; border-radius:6px; transition:all 0.2s;" onmouseover="this.style.color='#fff';this.style.background='rgba(255,255,255,0.1)';" onmouseout="this.style.color='rgba(255,255,255,0.6)';this.style.background='none';">&#10005;</button>
            </div>

            <h4 style="font-weight:900; font-size:${fontSize + 1}px; color:#fff; margin:0 0 6px; line-height:1.4;">${this.sanitize(title)}</h4>
            <p style="font-size:${fontSize - 1}px; color:rgba(255,255,255,0.78); line-height:1.6; margin:0 0 12px;">${this.sanitize(text)}</p>

            <div style="background:rgba(0,0,0,0.28); backdrop-filter:blur(8px); border-radius:${Math.max(8, br - 10)}px; padding:10px 12px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px;">
                <div>
                    <span style="display:block; font-size:9px; color:rgba(255,255,255,0.55); margin-bottom:2px;">${isAr ? 'كود الكوبون الحصري:' : 'Your Exclusive Code:'}</span>
                    <span style="font-family:monospace; font-weight:900; font-size:${fontSize + 2}px; color:${codeColor}; letter-spacing:0.1em; user-select:all;">${this.sanitize(code)}</span>
                </div>
                <button onclick="ProCable.copyBubbleCouponCode('${this.sanitize(code)}')" style="background:var(--primary-color,#C8102E); color:#fff; border:none; padding:7px 14px; border-radius:${Math.max(6, br - 16)}px; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                    <span class="material-symbols-outlined" style="font-size:13px;">content_copy</span>
                    <span>${isAr ? 'نسخ' : 'Copy'}</span>
                </button>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.65); padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">
                <a href="store.html" style="color:rgba(255,255,255,0.8); text-decoration:underline; font-weight:700; display:flex; align-items:center; gap:4px;">
                    <span>${isAr ? 'استخدمه الآن في المتجر' : 'Use it in the Store'}</span>
                    <span class="material-symbols-outlined" style="font-size:12px;">arrow_forward</span>
                </a>
                <button onclick="ProCable.dismissCouponBubble()" style="background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.55); font-size:10px; font-weight:700;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.55)'">
                    ${isAr ? 'تصغير ←' : '→ Dock'}
                </button>
            </div>
        `;
    },
    dismissCouponBubble() {
        sessionStorage.setItem('attractive_bubble_dismissed', 'true');
        const bubble = document.getElementById('couponPromoBubble');
        const dock = document.getElementById('floatingCouponBadge');
        if (bubble) {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(20px) scale(0.95)';
            bubble.style.pointerEvents = 'none';
            setTimeout(() => { if (dock) dock.style.display = 'flex'; }, 350);
        }
    },
    expandCouponBubble() {
        sessionStorage.removeItem('attractive_bubble_dismissed');
        const bubble = document.getElementById('couponPromoBubble');
        const dock = document.getElementById('floatingCouponBadge');
        if (dock) dock.style.display = 'none';
        if (bubble) {
            bubble.style.pointerEvents = 'auto';
            setTimeout(() => {
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0) scale(1)';
            }, 10);
        }
    },

    copyBubbleCouponCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            const isAr = this.getLang() === 'ar';
            this.showToast(isAr ? `تم نسخ كود الخصم "${code}" بنجاح!` : `Copied coupon code "${code}"!`, 'success');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = code; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
            this.showToast(`تم نسخ الكود: ${code}`, 'success');
        });
    },

    // --- 10.5 VIP Email Subscriber Widget & Modal ---
    renderSubscriberWidget() {
        if (typeof window !== 'undefined' && (window.location.pathname.includes('admin.html') || document.getElementById('adminApp'))) {
            const oldWidget = document.getElementById('floatingSubscriberBtn');
            if (oldWidget) oldWidget.remove();
            return;
        }
        const s = this.getSettings();
        if (s.subscribersEnabled === false) {
            const oldWidget = document.getElementById('floatingSubscriberBtn');
            if (oldWidget) oldWidget.remove();
            return;
        }

        const isAr = this.getLang() === 'ar';
        const pos = s.subscribersWidgetPosition || 'bottom-left';
        
        let btn = document.getElementById('floatingSubscriberBtn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'floatingSubscriberBtn';
            document.body.appendChild(btn);
        }

        btn.onclick = () => ProCable.openSubscriberModal();
        btn.className = `fixed bottom-6 ${pos === 'bottom-right' ? 'right-6' : 'left-6'} z-40 bg-surface-container-lowest border border-outline-variant hover:border-primary shadow-xl hover:shadow-2xl rounded-2xl p-2.5 sm:px-3.5 sm:py-2.5 flex items-center gap-2 text-xs font-bold text-on-surface transition-all duration-300 hover:scale-105 group`;
        btn.innerHTML = `
            <span class="w-7 h-7 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition">
                <span class="material-symbols-outlined text-base">card_membership</span>
            </span>
            <div class="text-start hidden sm:block">
                <span class="text-[10px] text-gray-400 block leading-none">${isAr ? 'نادي العملاء' : 'VIP Club'}</span>
                <span class="font-bold text-primary">${isAr ? 'سجّل إيميلك وخصمك' : 'Get Member Perk'}</span>
            </div>
            <span class="w-2 h-2 rounded-full bg-primary inline-block animate-ping"></span>
        `;
    },

    openSubscriberModal() {
        let modal = document.getElementById('subscriberModal');
        if (!modal) {
            this.createSubscriberModalDOM();
            modal = document.getElementById('subscriberModal');
        }

        const s = this.getSettings();
        const isAr = this.getLang() === 'ar';

        const titleEl = document.getElementById('subModalTitle');
        const descEl = document.getElementById('subModalDesc');
        if (titleEl) titleEl.innerText = isAr ? (s.subscribersWidgetTitleAr || '🎁 انضم لنادي عملاء Attractive واحصل على خصم فوري') : (s.subscribersWidgetTitleEn || '🎁 Join the VIP Club & Get Instant Discount');
        if (descEl) descEl.innerText = isAr ? (s.subscribersWidgetDescAr || 'سجّل بريدك الإلكتروني للحصول على كود خصم حصري وعروض شحن مجاني دورية.') : (s.subscribersWidgetDescEn || 'Subscribe with your email for exclusive discounts and VIP perks.');

        // Reset form view
        const formView = document.getElementById('subModalFormView');
        const successView = document.getElementById('subModalSuccessView');
        if (formView) formView.classList.remove('hidden');
        if (successView) successView.classList.add('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.add('active'), 10);
    },

    closeSubscriberModal() {
        const modal = document.getElementById('subscriberModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }
    },

    createSubscriberModalDOM() {
        const isAr = this.getLang() === 'ar';
        const div = document.createElement('div');
        div.id = 'subscriberModal';
        div.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] hidden items-center justify-center p-4 transition-opacity duration-300 modal-overlay';
        div.onclick = (e) => { if (e.target === div) ProCable.closeSubscriberModal(); };
        div.innerHTML = `
            <div class="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-7 border border-outline-variant shadow-2xl relative modal-content text-start">
                <button onclick="ProCable.closeSubscriberModal()" class="absolute ltr:right-5 rtl:left-5 top-5 text-gray-400 hover:text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface transition">&#10005;</button>
                
                <!-- Initial Form View -->
                <div id="subModalFormView">
                    <div class="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-2xl">loyalty</span>
                    </div>

                    <h3 id="subModalTitle" class="text-lg font-black text-on-surface mb-1">🎁 انضم لنادي عملاء Attractive</h3>
                    <p id="subModalDesc" class="text-xs text-on-surface-variant leading-relaxed mb-5">سجل بريدك الإلكتروني للحصول على كوبون الخصم فوراً ومزايا الشحن الحصرية.</p>

                    <form onsubmit="ProCable.handleSubscriberSubmit(event)" class="space-y-3.5 text-xs">
                        <div>
                            <label class="block font-bold text-on-surface mb-1">${isAr ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
                            <input id="subModalEmail" required type="email" placeholder="you@example.com" class="w-full p-3 bg-surface border border-outline-variant rounded-xl outline-none focus:ring-2 focus:ring-primary text-xs dir-ltr font-bold"/>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-on-surface mb-1">${isAr ? 'الاسم (اختياري):' : 'Name (Optional):'}</label>
                                <input id="subModalName" type="text" placeholder="${isAr ? 'مثال: م/ أحمد' : 'e.g. Alex'}" class="w-full p-2.5 bg-surface border border-outline-variant rounded-xl outline-none focus:ring-1 focus:ring-primary text-xs"/>
                            </div>
                            <div>
                                <label class="block font-bold text-on-surface mb-1">${isAr ? 'الموبايل (اختياري):' : 'Phone (Optional):'}</label>
                                <input id="subModalPhone" type="text" placeholder="010..." class="w-full p-2.5 bg-surface border border-outline-variant rounded-xl outline-none focus:ring-1 focus:ring-primary text-xs dir-ltr"/>
                            </div>
                        </div>

                        <div class="pt-2">
                            <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-black text-xs transition shadow flex items-center justify-center gap-2">
                                <span>${isAr ? 'تفعيل الخصم وعضوية VIP الآن' : 'Unlock Discount & VIP Perks'}</span>
                                <span class="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Success / Coupon Code Unlocked View -->
                <div id="subModalSuccessView" class="hidden text-center py-2 space-y-4">
                    <div class="w-14 h-14 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                        <span class="material-symbols-outlined text-3xl">verified</span>
                    </div>

                    <div>
                        <h3 class="text-base font-black text-on-surface mb-1">${isAr ? 'أهلاً بك في نادي Attractive VIP! 🎉' : 'Welcome to Attractive VIP! 🎉'}</h3>
                        <p class="text-xs text-on-surface-variant">${isAr ? 'تم تسجيلك بنجاح. هذا هو كود الخصم الحصري الخاص بك:' : 'You are registered! Here is your exclusive coupon code:'}</p>
                    </div>

                    <div class="bg-surface p-4 rounded-2xl border border-primary/30 flex items-center justify-between gap-3">
                        <div class="text-start">
                            <span class="text-[10px] text-gray-400 block">${isAr ? 'كود الخصم الفوري:' : 'Instant Coupon Code:'}</span>
                            <span id="subModalUnlockedCode" class="font-mono font-black text-lg text-primary select-all">ATTRACTIVE10</span>
                        </div>
                        <button onclick="ProCable.copySubModalCode()" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
                            <span class="material-symbols-outlined text-sm">content_copy</span>
                            <span>${isAr ? 'نسخ الكود' : 'Copy'}</span>
                        </button>
                    </div>

                    <div class="p-3 bg-surface rounded-xl border border-outline-variant text-[11px] text-on-surface-variant text-start space-y-1">
                        <div class="flex items-center gap-2 font-bold text-success">
                            <span class="material-symbols-outlined text-sm">check_circle</span>
                            <span>${isAr ? 'تخفيض فوري على جميع طلبياتك' : 'Instant discount on all orders'}</span>
                        </div>
                        <div class="flex items-center gap-2 font-bold text-success">
                            <span class="material-symbols-outlined text-sm">check_circle</span>
                            <span>${isAr ? 'أولوية التجهيز وتتبع الشحن المباشر' : 'Priority assembly & direct order tracking'}</span>
                        </div>
                    </div>

                    <div class="flex gap-2 pt-2">
                        <a href="store.html" class="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:bg-primary-dark transition text-center shadow">
                            ${isAr ? 'تسوق في المتجر الآن' : 'Shop Store Now'}
                        </a>
                        <button onclick="ProCable.closeSubscriberModal()" class="px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-bold text-xs text-on-surface hover:bg-gray-100 transition">
                            ${isAr ? 'إغلاق' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    },

    handleSubscriberSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('subModalEmail')?.value;
        const name = document.getElementById('subModalName')?.value;
        const phone = document.getElementById('subModalPhone')?.value;

        const res = this.addMember({ email, name, phone });
        if (res.success) {
            const code = res.coupon || 'ATTRACTIVE10';
            const codeEl = document.getElementById('subModalUnlockedCode');
            if (codeEl) codeEl.innerText = code;

            const formView = document.getElementById('subModalFormView');
            const successView = document.getElementById('subModalSuccessView');
            if (formView) formView.classList.add('hidden');
            if (successView) successView.classList.remove('hidden');

            this.showToast(res.message, 'success');
        } else {
            this.showToast(res.message || 'حدث خطأ أثناء التسجيل', 'error');
        }
    },

    copySubModalCode() {
        const code = document.getElementById('subModalUnlockedCode')?.innerText || 'ATTRACTIVE10';
        this.copyBubbleCouponCode(code);
    },

    // --- 11. Footer Rights & Links Dynamic Updater ---
    renderFooterData() {
        const s = this.getSettings();
        const isAr = this.getLang() === 'ar';
        const year = s.copyrightYear || '2026';
        const brand = s.siteName || 'Attractive';
        const rights = isAr ? (s.copyrightTextAr || 'جميع الحقوق محفوظة لـ Attractive Audio Studio.') : (s.copyrightTextEn || 'All rights reserved to Attractive Audio Studio.');

        // Update all footers
        document.querySelectorAll('footer').forEach(footer => {
            const copyrightP = footer.querySelector('.footer-copyright') || footer.querySelector('p.text-xs') || footer.querySelector('.copyright-line');
            if (copyrightP) {
                copyrightP.innerHTML = `&copy; ${this.sanitize(year)} <span class="site-brand-name font-bold">${this.sanitize(brand)}</span>. <span class="footer-copyright-text">${this.sanitize(rights)}</span>`;
            } else {
                const rightsSpan = footer.querySelector('.footer-copyright-text') || footer.querySelector('span > span:last-child');
                if (rightsSpan) rightsSpan.innerText = rights;
            }

            // Update or inject policy & about links if container exists
            let linksContainer = footer.querySelector('.footer-nav-links');
            if (!linksContainer) {
                // look for div with links
                const linkDivs = footer.querySelectorAll('div > a');
                if (linkDivs.length && linkDivs[0].parentElement) {
                    linksContainer = linkDivs[0].parentElement;
                    linksContainer.classList.add('footer-nav-links', 'flex-wrap');
                }
            }

            if (linksContainer) {
                linksContainer.innerHTML = `
                    <a href="store.html" class="hover:text-primary transition font-medium">${isAr ? 'المتجر' : 'Store'}</a>
                    <a href="builder.html" class="hover:text-primary transition font-medium">${isAr ? 'التفصيل الخاص' : 'Custom Build'}</a>
                    <button onclick="ProCable.showAboutModal()" class="hover:text-primary transition font-medium text-inherit">${isAr ? 'عن الشركة' : 'About Us'}</button>
                    <button onclick="ProCable.showPolicyModal('privacy')" class="hover:text-primary transition font-medium text-inherit">${isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</button>
                    <button onclick="ProCable.showPolicyModal('return')" class="hover:text-primary transition font-medium text-inherit">${isAr ? 'الاستبدال والضمان' : 'Warranty & Returns'}</button>
                `;
            }
        });
    },

    // --- 12. Sale & Discount Hub Helpers ---
    isSaleActive() {
        return this.getSettings().saleActive === true;
    },
    getSaleProducts() {
        const products = this.getProducts();
        return products.filter(p => p.onSale === true || (p.originalPrice && p.originalPrice > p.price));
    },
    renderSaleNavAndBanners() {
        const s = this.getSettings();
        const isActive = s.saleActive === true;

        // Sale elements across pages
        document.querySelectorAll('.sale-nav-item, .sale-element').forEach(el => {
            if (isActive) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });
    },

    // --- 13. Dynamic Top Navigation Bar Renderer (Apple Mega Menu Edition) ---
    renderNavbars() {
        const desktopUl = document.getElementById('desktopNavLinks');
        const mobileUl = document.getElementById('mobileDrawerLinks');
        if (!desktopUl && !mobileUl) return;

        const navItems = this.getNavItems();
        const isAr = this.getLang() === 'ar';
        const currentPage = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0];
        const isSaleOn = this.isSaleActive();
        const isRepairOn = this.getSettings().repairActive !== false;

        const visibleItems = navItems.filter(item => {
            if (item.active === false) return false;
            if (item.isSaleItem && !isSaleOn) return false;
            if (item.isRepairItem || item.id === 'nav-repair' || (item.url && item.url.includes('#repairSection'))) return false;
            return true;
        }).sort((a, b) => (parseInt(a.order) || 99) - (parseInt(b.order) || 99));

        // --- Desktop nav ---
        if (desktopUl) {
            desktopUl.innerHTML = visibleItems.map(item => {
                const isBuilderServices = item.id === 'nav-builder' || item.isServicesDropdown === true || (item.url && item.url.includes('builder.html'));
                const title = isAr ? (item.titleAr || item.titleEn) : (item.titleEn || item.titleAr);
                const badge = isAr ? (item.badgeAr || item.badgeEn || '') : (item.badgeEn || item.badgeAr || '');
                const target = item.openInNewTab ? 'target="_blank" rel="noopener"' : '';
                const itemBase = (item.url || '').split('?')[0].split('#')[0];
                const isCurrent = (itemBase === currentPage) || (currentPage === '' && itemBase === 'index.html');
                const baseClass = isCurrent ? 'text-primary font-bold' : (item.isSaleItem ? 'text-primary font-bold' : 'text-on-surface hover:text-primary');

                if (isBuilderServices) {
                    return `
                        <li class="relative group" data-nav-id="${item.id}">
                            <a href="builder.html" class="${isCurrent ? 'text-primary font-bold' : 'text-on-surface hover:text-primary'} transition flex items-center gap-1 py-1 text-sm font-medium">
                                <span>${isAr ? 'تفصيل وصيانة الكابلات' : 'Custom Build & Repair'}</span>
                                <span class="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                            </a>
                            <div class="absolute top-full ltr:left-0 rtl:right-0 pt-2 hidden group-hover:block z-50 min-w-[250px]">
                                <div class="bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl p-2 space-y-1">
                                    <a href="builder.html" class="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-black/5 text-on-surface text-xs font-bold transition">
                                        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span class="material-symbols-outlined text-base">tune</span>
                                        </div>
                                        <div>
                                            <span class="block text-on-surface">${isAr ? 'استوديو التفصيل الخاص' : 'Custom Cable Builder'}</span>
                                            <span class="block text-[10px] font-normal text-gray-400">${isAr ? 'تجميع وتفصيل كابلك الصوتي' : 'Craft your audio cable'}</span>
                                        </div>
                                    </a>
                                    ${isRepairOn ? `
                                    <a href="index.html#repairSection" class="repair-nav-item flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-black/5 text-on-surface text-xs font-bold transition">
                                        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <span class="material-symbols-outlined text-base">build</span>
                                        </div>
                                        <div>
                                            <span class="block text-on-surface">${isAr ? 'مركز التركيبات والصيانة' : 'Installation & Maintenance'}</span>
                                            <span class="block text-[10px] font-normal text-gray-400">${isAr ? 'برمجة وصيانة وفحص الأنظمة' : 'Inspection & maintenance'}</span>
                                        </div>
                                    </a>
                                    ` : ''}
                                </div>
                            </div>
                        </li>
                    `;
                }

                if (item.hasMegaMenu && item.megaMenuColumns && item.megaMenuColumns.length > 0) {
                    return `
                        <li class="relative" data-nav-id="${item.id}" data-has-mega="true">
                            <a href="${this.sanitize(item.url)}" ${target} class="${baseClass} transition flex items-center gap-1 py-1 text-sm font-medium agy-mega-trigger" data-mega-id="${item.id}">
                                ${item.isSaleItem ? '<span class="material-symbols-outlined text-sm">local_fire_department</span>' : ''}
                                <span>${this.sanitize(title)}</span>
                                <span class="material-symbols-outlined text-sm transition-transform agy-mega-chevron">expand_more</span>
                                ${badge ? `<span class="text-[10px] bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded-full">${this.sanitize(badge)}</span>` : ''}
                            </a>
                        </li>
                    `;
                }

                return `
                    <li class="${item.isSaleItem ? 'sale-nav-item' : ''}" data-nav-id="${item.id}">
                        <a href="${this.sanitize(item.url)}" ${target} class="${baseClass} transition flex items-center gap-1 text-sm font-medium">
                            ${item.isSaleItem ? '<span class="material-symbols-outlined text-sm">local_fire_department</span>' : ''}
                            <span>${this.sanitize(title)}</span>
                            ${badge ? `<span class="text-[10px] bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded-full">${this.sanitize(badge)}</span>` : ''}
                        </a>
                    </li>
                `;
            }).join('');

            // Inject mega menu overlay + backdrop (once per page)
            this._initMegaMenuOverlay(visibleItems, isAr);
        }

        // --- Mobile nav (accordion) ---
        if (mobileUl) {
            let mobileHtml = visibleItems.map(item => {
                const isBuilderServices = item.id === 'nav-builder' || item.isServicesDropdown === true || (item.url && item.url.includes('builder.html'));
                if (isBuilderServices) {
                    return `
                        <li class="py-1">
                            <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">${isAr ? 'تفصيل وصيانة الكابلات' : 'Custom & Repair'}</div>
                            <div class="space-y-1 ps-2 border-s-2 border-primary/20">
                                <a href="builder.html" class="block py-1 text-xs ${currentPage === 'builder.html' ? 'text-primary font-bold' : 'text-on-surface font-semibold'} flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">tune</span>
                                    <span>${isAr ? 'استوديو التفصيل الخاص' : 'Custom Cable Builder'}</span>
                                </a>
                                ${isRepairOn ? `
                                <a href="index.html#repairSection" class="repair-nav-item block py-1 text-xs text-on-surface font-semibold flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">build</span>
                                    <span>${isAr ? 'صيانة وإصلاح الكابلات' : 'Cable Repair & Service'}</span>
                                </a>
                                ` : ''}
                            </div>
                        </li>
                    `;
                }

                if (item.hasMegaMenu && item.megaMenuColumns && item.megaMenuColumns.length > 0) {
                    const title = isAr ? (item.titleAr || item.titleEn) : (item.titleEn || item.titleAr);
                    const accordionId = 'mob-acc-' + item.id;
                    const colsHtml = item.megaMenuColumns.map(col => {
                        const colHead = isAr ? (col.headingAr || col.headingEn || '') : (col.headingEn || col.headingAr || '');
                        const colItems = (col.items || []).map(ci => {
                            const ciLabel = isAr ? (ci.labelAr || ci.labelEn) : (ci.labelEn || ci.labelAr);
                            return `<a href="${this.sanitize(ci.url)}" class="block py-1.5 text-xs text-on-surface hover:text-primary transition font-medium">${this.sanitize(ciLabel)}</a>`;
                        }).join('');
                        return `<div class="mb-3"><div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">${this.sanitize(colHead)}</div>${colItems}</div>`;
                    }).join('');
                    return `
                        <li class="${item.isSaleItem ? 'sale-nav-item' : ''}">
                            <button onclick="document.getElementById('${accordionId}').classList.toggle('hidden'); this.querySelector('.mob-acc-chevron').classList.toggle('rotate-180')"
                                class="w-full flex items-center justify-between py-1 text-xs font-semibold ${item.isSaleItem ? 'text-primary' : 'text-on-surface'}">
                                <span class="flex items-center gap-1.5">
                                    ${item.isSaleItem ? '<span class="material-symbols-outlined text-sm">local_fire_department</span>' : ''}
                                    <span>${this.sanitize(title)}</span>
                                </span>
                                <span class="material-symbols-outlined text-sm mob-acc-chevron transition-transform">expand_more</span>
                            </button>
                            <div id="${accordionId}" class="hidden ps-2 border-s-2 border-primary/20 mt-1 pb-1">${colsHtml}</div>
                        </li>
                    `;
                }

                const title = isAr ? (item.titleAr || item.titleEn) : (item.titleEn || item.titleAr);
                const badge = isAr ? (item.badgeAr || item.badgeEn || '') : (item.badgeEn || item.badgeAr || '');
                const target = item.openInNewTab ? 'target="_blank" rel="noopener"' : '';
                const itemBase = (item.url || '').split('?')[0].split('#')[0];
                const isCurrent = (itemBase === currentPage) || (currentPage === '' && itemBase === 'index.html');
                const textClass = isCurrent ? 'text-primary font-bold' : (item.isSaleItem ? 'text-primary font-bold' : 'text-on-surface');
                return `
                    <li class="${item.isSaleItem ? 'sale-nav-item' : ''}">
                        <a href="${this.sanitize(item.url)}" ${target} class="block py-1 text-xs ${textClass} flex items-center gap-1.5">
                            ${item.isSaleItem ? '<span class="material-symbols-outlined text-sm">local_fire_department</span>' : ''}
                            <span>${this.sanitize(title)}</span>
                            ${badge ? `<span class="text-[10px] bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded-full ms-1">${this.sanitize(badge)}</span>` : ''}
                        </a>
                    </li>
                `;
            }).join('');

            mobileHtml += `
                <li class="pt-2 border-t border-outline-variant">
                    <a href="${currentPage === 'builder.html' ? 'builder.html#cartSection' : 'store.html#cartSection'}" onclick="document.getElementById('mobileDrawer').classList.add('hidden')" class="w-full text-start py-1 text-on-surface font-bold flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base">shopping_bag</span>
                            <span>${isAr ? 'سلة المشتريات' : 'Shopping Bag'}</span>
                        </span>
                        <span class="cart-count-badge bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
                    </a>
                </li>
                <li class="pt-1">
                    <button onclick="ProCable.showOrderTrackingModal(); document.getElementById('mobileDrawer').classList.add('hidden')" class="w-full text-start py-1 text-primary font-bold flex items-center gap-2 text-xs">
                        <span class="material-symbols-outlined text-base">track_changes</span>
                        <span>${isAr ? 'تتبع مسار طلبك' : 'Track Your Order'}</span>
                    </button>
                </li>
            `;
            mobileUl.innerHTML = mobileHtml;
        }
    },

    _initMegaMenuOverlay(visibleItems, isAr) {
        // Remove old overlay if any (re-render safe)
        const oldOverlay = document.getElementById('appleMegaMenuOverlay');
        const oldBackdrop = document.getElementById('appleMegaMenuBackdrop');
        if (oldOverlay) oldOverlay.remove();
        if (oldBackdrop) oldBackdrop.remove();

        const megaItems = visibleItems.filter(i => i.hasMegaMenu && i.megaMenuColumns && i.megaMenuColumns.length);
        if (!megaItems.length) return;

        // Build overlay HTML
        const overlayEl = document.createElement('div');
        overlayEl.id = 'appleMegaMenuOverlay';
        overlayEl.setAttribute('aria-hidden', 'true');
        overlayEl.style.cssText = `
            position:fixed; top:60px; left:0; right:0; z-index:9000;
            background:rgba(255,255,255,0.96); backdrop-filter:blur(24px) saturate(180%);
            -webkit-backdrop-filter:blur(24px) saturate(180%);
            border-bottom:1px solid rgba(0,0,0,0.08);
            box-shadow:0 8px 40px rgba(0,0,0,0.10);
            display:none; pointer-events:none;
            transition: opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1);
            opacity:0; transform:translateY(-6px);
        `;

        const allProducts = this.getProducts();
        const currency = isAr ? 'ج.م' : 'EGP';

        const panelsHtml = megaItems.map(item => {
            const colsHtml = (item.megaMenuColumns || []).map(col => {
                const colHead = isAr ? (col.headingAr || col.headingEn || '') : (col.headingEn || col.headingAr || '');
                const itemsHtml = (col.items || []).map(ci => {
                    let prod = null;
                    if (ci.type === 'product' || ci.productId) {
                        prod = allProducts.find(p => String(p.id) === String(ci.productId));
                    }
                    const label = prod ? (isAr ? prod.nameAr : (prod.nameEn || prod.nameAr)) : (isAr ? (ci.labelAr || ci.labelEn) : (ci.labelEn || ci.labelAr));
                    const url = prod ? `store.html#product-${prod.id}` : (ci.url || '#');
                    const showImg = ci.showImage === true || (prod && ci.showImage !== false);
                    const showPrice = ci.showPrice === true || (prod && ci.showPrice !== false);
                    const imgUrl = prod ? (prod.images && prod.images[0] ? prod.images[0] : (prod.image || '')) : (ci.image || '');
                    const priceVal = prod ? prod.price : ci.price;

                    if (showImg || showPrice) {
                        return `
                            <a href="${this.sanitize(url)}" class="agy-mm-link group/item flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-black/[0.03] transition-all">
                                ${showImg && imgUrl ? `
                                    <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                                        <img src="${this.sanitize(imgUrl)}" alt="" class="w-full h-full object-cover group-hover/item:scale-105 transition-transform"/>
                                    </div>
                                ` : ''}
                                <div class="flex-1 min-w-0">
                                    <span class="block text-sm text-[#1d1d1f] group-hover/item:text-[#C8102E] transition-colors font-semibold truncate leading-tight">${this.sanitize(label)}</span>
                                    ${showPrice && priceVal ? `<span class="block text-xs text-gray-500 font-mono mt-0.5">${this.formatNum(priceVal)} ${currency}</span>` : ''}
                                </div>
                            </a>
                        `;
                    }

                    return `
                        <a href="${this.sanitize(url)}" class="agy-mm-link block py-2 px-2.5 rounded-lg text-sm text-[#1d1d1f] hover:text-[#C8102E] hover:bg-black/[0.02] transition-all font-medium leading-snug">
                            ${this.sanitize(label)}
                        </a>`;
                }).join('');
                return `
                    <div class="agy-mm-col min-w-[180px] flex-1">
                        <div class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2.5">${this.sanitize(colHead)}</div>
                        <div class="space-y-0.5">${itemsHtml}</div>
                    </div>`;
            }).join('');
            return `
                <div class="agy-mm-panel hidden transition-opacity duration-200" data-panel="${item.id}">
                    <div class="max-w-6xl mx-auto px-8 py-8 flex flex-wrap gap-10 ${isAr ? 'flex-row-reverse' : ''}">${colsHtml}</div>
                </div>`;
        }).join('');

        overlayEl.innerHTML = panelsHtml;
        document.body.appendChild(overlayEl);

        // Backdrop
        const backdropEl = document.createElement('div');
        backdropEl.id = 'appleMegaMenuBackdrop';
        backdropEl.style.cssText = `
            position:fixed; inset:0; z-index:8999;
            background:rgba(0,0,0,0.18);
            display:none; opacity:0;
            transition:opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events:none;
        `;
        document.body.appendChild(backdropEl);

        // Adjust overlay top based on actual nav height
        const updateOverlayTop = () => {
            const nav = document.querySelector('nav') || document.querySelector('header');
            if (nav) overlayEl.style.top = nav.getBoundingClientRect().height + 'px';
        };
        updateOverlayTop();

        let activeId = null;
        let closeTimer = null;

        const openMega = (id) => {
            clearTimeout(closeTimer);
            if (activeId === id && overlayEl.style.display !== 'none') return;
            activeId = id;
            overlayEl.querySelectorAll('.agy-mm-panel').forEach(p => p.classList.add('hidden'));
            const panel = overlayEl.querySelector(`[data-panel="${id}"]`);
            if (panel) panel.classList.remove('hidden');
            updateOverlayTop();
            overlayEl.style.display = 'block';
            overlayEl.style.pointerEvents = 'auto';
            overlayEl.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => {
                overlayEl.style.opacity = '1';
                overlayEl.style.transform = 'translateY(0)';
            });
            backdropEl.style.display = 'block';
            backdropEl.style.pointerEvents = 'auto';
            requestAnimationFrame(() => { backdropEl.style.opacity = '1'; });

            // Rotate chevron on trigger
            document.querySelectorAll('.agy-mega-chevron').forEach(ch => ch.classList.remove('rotate-180'));
            const trigger = document.querySelector(`.agy-mega-trigger[data-mega-id="${id}"] .agy-mega-chevron`);
            if (trigger) trigger.classList.add('rotate-180');
        };

        const closeMega = (immediate = false) => {
            clearTimeout(closeTimer);
            const doClose = () => {
                activeId = null;
                overlayEl.style.opacity = '0';
                overlayEl.style.transform = 'translateY(-6px)';
                backdropEl.style.opacity = '0';
                document.querySelectorAll('.agy-mega-chevron').forEach(ch => ch.classList.remove('rotate-180'));
                setTimeout(() => {
                    overlayEl.style.display = 'none';
                    overlayEl.style.pointerEvents = 'none';
                    overlayEl.setAttribute('aria-hidden', 'true');
                    backdropEl.style.display = 'none';
                    backdropEl.style.pointerEvents = 'none';
                }, 220);
            };
            if (immediate) doClose();
            else closeTimer = setTimeout(doClose, 240);
        };

        // Attach hover & focus events to triggers
        document.querySelectorAll('.agy-mega-trigger').forEach(trigger => {
            const id = trigger.dataset.megaId;
            trigger.addEventListener('mouseenter', () => openMega(id));
            trigger.addEventListener('mouseleave', () => closeMega());
            trigger.addEventListener('focus', () => openMega(id));
        });

        // Keep open while hovering overlay or focusing within
        overlayEl.addEventListener('mouseenter', () => clearTimeout(closeTimer));
        overlayEl.addEventListener('mouseleave', () => closeMega());
        overlayEl.addEventListener('focusin', () => clearTimeout(closeTimer));
        overlayEl.addEventListener('focusout', (e) => {
            if (!overlayEl.contains(e.relatedTarget)) {
                closeMega();
            }
        });

        // Backdrop click closes
        backdropEl.addEventListener('click', () => closeMega(true));

        // Keyboard: Escape closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeId) {
                const curId = activeId;
                closeMega(true);
                const curTrigger = document.querySelector(`.agy-mega-trigger[data-mega-id="${curId}"]`);
                if (curTrigger) curTrigger.focus();
            }
        });
    },

        togglePasswordVisibility(inputId, btn) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        const icon = btn ? btn.querySelector('.material-symbols-outlined') : null;
        if (icon) {
            icon.textContent = isPass ? 'visibility_off' : 'visibility';
        }
    },
    switchAuthTab(tab) {
        const tabSignIn = document.getElementById('tabAuthSignIn');
        const tabSignUp = document.getElementById('tabAuthSignUp');
        const formSignIn = document.getElementById('authSignInForm');
        const formSignUp = document.getElementById('authSignUpForm');
        const formReset = document.getElementById('authResetForm');
        const err = document.getElementById('authErrorMsg');
        if (err) err.classList.add('hidden');

        if (tab === 'signin') {
            if (tabSignIn) { tabSignIn.classList.add('text-primary', 'border-primary'); tabSignIn.classList.remove('text-on-surface-variant', 'border-transparent'); }
            if (tabSignUp) { tabSignUp.classList.remove('text-primary', 'border-primary'); tabSignUp.classList.add('text-on-surface-variant', 'border-transparent'); }
            if (formSignIn) formSignIn.classList.remove('hidden');
            if (formSignUp) formSignUp.classList.add('hidden');
            if (formReset) formReset.classList.add('hidden');
        } else if (tab === 'signup') {
            if (tabSignUp) { tabSignUp.classList.add('text-primary', 'border-primary'); tabSignUp.classList.remove('text-on-surface-variant', 'border-transparent'); }
            if (tabSignIn) { tabSignIn.classList.remove('text-primary', 'border-primary'); tabSignIn.classList.add('text-on-surface-variant', 'border-transparent'); }
            if (formSignUp) formSignUp.classList.remove('hidden');
            if (formSignIn) formSignIn.classList.add('hidden');
            if (formReset) formReset.classList.add('hidden');
        } else if (tab === 'reset') {
            if (tabSignIn) { tabSignIn.classList.remove('text-primary', 'border-primary'); tabSignIn.classList.add('text-on-surface-variant', 'border-transparent'); }
            if (tabSignUp) { tabSignUp.classList.remove('text-primary', 'border-primary'); tabSignUp.classList.add('text-on-surface-variant', 'border-transparent'); }
            if (formSignIn) formSignIn.classList.add('hidden');
            if (formSignUp) formSignUp.classList.add('hidden');
            if (formReset) {
                formReset.classList.remove('hidden');
                const s1 = document.getElementById('resetStep1');
                const s2 = document.getElementById('resetStep2');
                if (s1) s1.classList.remove('hidden');
                if (s2) s2.classList.add('hidden');
            }
        }
    },
    _pendingResetAccId: null,
    submitResetRequest() {
        const input = document.getElementById('authResetIdentifier');
        const val = input ? input.value.trim() : '';
        const isAr = this.getLang() === 'ar';
        if (!val) {
            this.showToast(isAr ? 'يرجى إدخال البريد الإلكتروني ال الهاتف' : 'Please enter email or phone', 'error');
            return;
        }
        const res = this.requestPasswordReset(val);
        const s1 = document.getElementById('resetStep1');
        const s2 = document.getElementById('resetStep2');
        const notice = document.getElementById('resetNoticeMsg');
        if (res.accId) {
            this._pendingResetAccId = res.accId;
            if (s1) s1.classList.add('hidden');
            if (s2) s2.classList.remove('hidden');
            if (notice) notice.innerText = res.message;
        } else {
            this.showToast(res.message, 'info');
        }
    },
    submitNewPassword() {
        const tokenIn = document.getElementById('authResetToken');
        const passIn = document.getElementById('authResetNewPass');
        const isAr = this.getLang() === 'ar';
        if (!this._pendingResetAccId) {
            this.showToast(isAr ? 'يرجى طلب رمٲ التحقق أولاً' : 'Please request code first', 'error');
            return;
        }
        const token = tokenIn ? tokenIn.value.trim() : '';
        const newPass = passIn ? passIn.value : '';
        const res = this.resetPasswordWithToken(this._pendingResetAccId, token, newPass);
        if (res.success) {
            this.showToast(res.message, 'success');
            this.switchAuthTab('signin');
        } else {
            this.showToast(res.message, 'error');
        }
    },
    renderAuthAreas() {
        const isAr = this.getLang() === 'ar';
        const user = this.getCurrentUserAccount();
        
        const desktopContainer = document.getElementById('desktopAuthArea');
        if (desktopContainer) {
            if (user) {
                const perksCount = (user.freeShipping ? 1 : 0) + (user.discountPercent > 0 ? 1 : 0) + (Array.isArray(user.customPerks) ? user.customPerks.length : 0);
                desktopContainer.innerHTML = `
                    <div class="relative group">
                        <button onclick="ProCable.showAccountDetailsModal()" class="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition shadow-sm">
                            <span class="material-symbols-outlined text-base">verified_user</span>
                            <span>${this.sanitize(user.name.split(' ')[0])}</span>
                            ${perksCount > 0 ? `<span class="text-[10px] bg-primary text-white font-black px-1.5 py-0.2 rounded-full group-hover:bg-white group-hover:text-primary transition">${perksCount} مزايا</span>` : ''}
                        </button>
                        <div class="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div class="font-bold text-xs text-on-surface mb-0.5">${this.sanitize(user.name)}</div>
                            <div class="text-[10px] text-on-surface-variant mb-2.5 truncate" dir="ltr">${this.sanitize(user.email)}</div>
                            <div class="space-y-1 pt-1 border-t border-outline-variant">
                                <button onclick="ProCable.showAccountDetailsModal()" class="w-full text-start px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl flex items-center gap-2 transition">
                                    <span class="material-symbols-outlined text-base">stars</span>
                                    <span>${isAr ? 'عرض مزايا حسابي' : 'My Perks & Account'}</span>
                                </button>
                                <button onclick="ProCable.logoutUserAccount()" class="w-full text-start px-2 py-1.5 text-xs text-error hover:bg-red-50 rounded-xl flex items-center gap-2 transition">
                                    <span class="material-symbols-outlined text-base">logout</span>
                                    <span>${isAr ? 'تسجيل الخروج' : 'Logout'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                desktopContainer.innerHTML = `
                    <button onclick="ProCable.showAuthModal()" class="text-xs font-bold px-3 py-1.5 bg-surface text-on-surface border border-outline-variant rounded-xl hover:bg-surface-container-high transition flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-base">login</span>
                        <span>${isAr ? 'دخول / حساب' : 'Sign In'}</span>
                    </button>
                `;
            }
        }

        const mobileContainer = document.getElementById('mobileAuthArea');
        if (mobileContainer) {
            if (user) {
                mobileContainer.innerHTML = `
                    <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant mb-3">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2 text-primary font-bold text-xs">
                                <span class="material-symbols-outlined text-base">verified_user</span>
                                <span>${this.sanitize(user.name)}</span>
                            </div>
                            <button onclick="ProCable.logoutUserAccount()" class="text-xs text-error font-bold flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">logout</span>
                                <span>${isAr ? 'خروج' : 'Logout'}</span>
                            </button>
                        </div>
                        <button onclick="ProCable.showAccountDetailsModal(); document.getElementById('mobileDrawer').classList.add('hidden');" class="w-full text-xs font-bold bg-primary text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                            <span class="material-symbols-outlined text-sm">stars</span>
                            <span>${isAr ? 'عرض وتفعيل مزايا حسابك' : 'View Account Perks'}</span>
                        </button>
                    </div>
                `;
            } else {
                mobileContainer.innerHTML = `
                    <button onclick="ProCable.showAuthModal(); document.getElementById('mobileDrawer').classList.add('hidden');" class="w-full flex items-center gap-2 py-2 text-primary font-bold border-b border-outline-variant mb-2">
                        <span class="material-symbols-outlined text-base">login</span>
                        <span>${isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Sign Up'}</span>
                    </button>
                `;
            }
        }
    },

    showAccountDetailsModal() {
        const user = this.getCurrentUserAccount();
        if (!user) {
            this.showAuthModal();
            return;
        }
        const isAr = this.getLang() === 'ar';
        let modal = document.getElementById('userAccountDetailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'userAccountDetailsModal';
            modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm hidden justify-center items-center z-[2500] modal-overlay p-4';
            document.body.appendChild(modal);
        }

        const customPerksList = Array.isArray(user.customPerks) ? user.customPerks : [];
        const perksHtml = customPerksList.map(p => `
            <div class="flex items-start gap-2 p-2.5 bg-surface rounded-xl border border-outline-variant">
                <span class="material-symbols-outlined text-primary text-base mt-0.5">verified</span>
                <span class="text-xs font-bold text-on-surface">${this.sanitize(p)}</span>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="bg-surface-container-lowest rounded-3xl w-full max-w-[480px] p-6 relative modal-content shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto">
                <button onclick="ProCable.hideAccountDetailsModal()" class="absolute ltr:right-4 rtl:left-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">&#10005;</button>
                
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-black">
                        <span class="material-symbols-outlined text-2xl">verified_user</span>
                    </div>
                    <div>
                        <div class="inline-flex items-center gap-1 text-[10px] bg-green-100 text-success font-black px-2 py-0.5 rounded-full mb-1">
                            <span class="material-symbols-outlined text-xs">check_circle</span>
                            <span>${isAr ? 'عضو مميز معتمد' : 'Verified VIP Account'}</span>
                        </div>
                        <h3 class="text-base font-black text-on-surface">${this.sanitize(user.name)}</h3>
                        <p class="text-xs text-on-surface-variant font-mono" dir="ltr">${this.sanitize(user.email)}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <h4 class="text-xs font-black text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">loyalty</span>
                        <span>${isAr ? 'المزايا والامتيازات المفعلة لحسابك' : 'Your Active Membership Perks'}</span>
                    </h4>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        <div class="p-3 rounded-2xl border ${user.freeShipping ? 'bg-primary/5 border-primary/20' : 'bg-surface border-outline-variant'}">
                            <div class="flex items-center justify-between mb-1">
                                <span class="material-symbols-outlined ${user.freeShipping ? 'text-primary' : 'text-gray-400'} text-lg">local_shipping</span>
                                <span class="text-[10px] font-black ${user.freeShipping ? 'text-primary bg-primary/10' : 'text-gray-400 bg-gray-100'} px-2 py-0.5 rounded-full">
                                    ${user.freeShipping ? (isAr ? 'مفعل مجاناً' : 'Active') : (isAr ? 'غير مفعل' : 'Inactive')}
                                </span>
                            </div>
                            <div class="font-bold text-xs text-on-surface">${isAr ? 'شحن مجاني' : 'Free Shipping'}</div>
                            <div class="text-[10px] text-on-surface-variant">${isAr ? 'شحن 0 ج.م لكافة محافظات مصر' : 'Zero shipping fees on all orders'}</div>
                        </div>

                        <div class="p-3 rounded-2xl border ${user.discountPercent > 0 ? 'bg-primary/5 border-primary/20' : 'bg-surface border-outline-variant'}">
                            <div class="flex items-center justify-between mb-1">
                                <span class="material-symbols-outlined ${user.discountPercent > 0 ? 'text-primary' : 'text-gray-400'} text-lg">percent</span>
                                <span class="text-[10px] font-black ${user.discountPercent > 0 ? 'text-primary bg-primary/10' : 'text-gray-400 bg-gray-100'} px-2 py-0.5 rounded-full">
                                    ${user.discountPercent > 0 ? `${user.discountPercent}%` : '-'}
                                </span>
                            </div>
                            <div class="font-bold text-xs text-on-surface">${isAr ? 'خصم خاص مباشر' : 'Member Discount'}</div>
                            <div class="text-[10px] text-on-surface-variant">${user.discountPercent > 0 ? (isAr ? `تخفيض ${user.discountPercent}% على أي طلب` : `${user.discountPercent}% OFF on any order`) : (isAr ? 'خصومات دورية' : 'Regular discounts')}</div>
                        </div>
                    </div>

                    ${user.customCoupon ? `
                        <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200 mb-3 flex items-center justify-between">
                            <div>
                                <div class="text-[10px] font-bold text-amber-800">${isAr ? 'كود كوبونك الشخصي الحصري:' : 'Your Exclusive Personal Coupon:'}</div>
                                <div class="text-sm font-black font-mono text-amber-900 tracking-wider">${this.sanitize(user.customCoupon)}</div>
                            </div>
                            <button onclick="navigator.clipboard.writeText('${this.sanitize(user.customCoupon)}'); ProCable.showToast('${isAr ? 'تم نسخ كود الكوبون!' : 'Copied!'}', 'success');" class="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">content_copy</span>
                                <span>${isAr ? 'نسخ الكود' : 'Copy'}</span>
                            </button>
                        </div>
                    ` : ''}

                    ${customPerksList.length > 0 ? `
                        <div class="space-y-1.5 mb-3">
                            <div class="text-[11px] font-bold text-on-surface-variant">${isAr ? 'امتيازات إضافية مخصصة لك:' : 'Custom Assigned Perks:'}</div>
                            ${perksHtml}
                        </div>
                    ` : ''}
                </div>

                <div class="pt-3 border-t border-outline-variant flex flex-col gap-2">
                    <a href="store.html" onclick="ProCable.hideAccountDetailsModal()" class="w-full py-2.5 bg-primary text-white text-center font-bold text-xs rounded-xl hover:bg-primary-dark transition shadow">
                        ${isAr ? 'تصفح المتجر والاستفادة من المزايا' : 'Browse Store & Enjoy Perks'}
                    </a>
                    <button onclick="ProCable.logoutUserAccount()" class="w-full py-2 border border-red-200 text-error hover:bg-red-50 text-center font-bold text-xs rounded-xl transition">
                        ${isAr ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    hideAccountDetailsModal() {
        const modal = document.getElementById('userAccountDetailsModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    createUserAuthModalDOM() {
        let modal = document.getElementById('userAuthModal');
        if (modal) return modal;

        const isAr = this.getLang() === 'ar';
        modal = document.createElement('div');
        modal.id = 'userAuthModal';
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm hidden justify-center items-center z-[2500] modal-overlay p-4';
        modal.onclick = (e) => {
            if (e.target === modal) ProCable.hideAuthModal();
        };

        modal.innerHTML = `
            <div class="bg-surface-container-lowest rounded-3xl w-full max-w-[430px] p-6 relative modal-content shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto">
                <button onclick="ProCable.hideAuthModal()" class="absolute ltr:right-4 rtl:left-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition" title="إغلاق">&#10005;</button>
                
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                        <span class="material-symbols-outlined text-2xl">account_circle</span>
                    </div>
                    <div>
                        <h3 class="text-base font-black text-on-surface">${isAr ? 'حساب Attractive الخاص بك' : 'Your Attractive Account'}</h3>
                        <p class="text-xs text-on-surface-variant">${isAr ? 'سجل دخولك أو أنشئ حساباً للاستمتاع بالمزايا والخصومات' : 'Sign in or register to unlock exclusive member perks'}</p>
                    </div>
                </div>

                <div class="flex border-b border-outline-variant mb-5">
                    <button id="tabAuthSignIn" onclick="ProCable.switchAuthTab('signin')" class="flex-1 pb-3 text-center font-bold text-xs sm:text-sm text-primary border-b-2 border-primary transition flex items-center justify-center gap-1.5">
                        <span class="material-symbols-outlined text-base">login</span>
                        <span>${isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                    </button>
                    <button id="tabAuthSignUp" onclick="ProCable.switchAuthTab('signup')" class="flex-1 pb-3 text-center font-bold text-xs sm:text-sm text-on-surface-variant border-b-2 border-transparent transition flex items-center justify-center gap-1.5">
                        <span class="material-symbols-outlined text-base">person_add</span>
                        <span>${isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                    </button>
                </div>

                <div id="authErrorMsg" class="hidden mb-4 p-3 bg-red-50 text-error text-xs rounded-xl font-bold border border-red-200 flex items-center gap-2">
                    <span class="material-symbols-outlined text-base shrink-0">error</span>
                    <span id="authErrorMsgText"></span>
                </div>

                <!-- Sign In Form -->
                <form id="authSignInForm" onsubmit="ProCable.handleSignIn(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input id="authEmailIn" required type="email" dir="ltr" placeholder="sound@example.com" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary font-mono"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'كلمة المرور' : 'Password'}</label>
                        <input id="authPassIn" required type="password" dir="ltr" placeholder="••••••••" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"/>
                        <div class="text-end mt-1.5">
                            <button type="button" onclick="ProCable.switchAuthTab('reset')" class="text-[11px] font-bold text-primary hover:underline">${isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</button>
                        </div>
                    </div>
                    <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition shadow flex items-center justify-center gap-2">
                        <span>${isAr ? 'دخول لحسابي' : 'Sign In'}</span>
                        <span class="material-symbols-outlined text-base">arrow_forward</span>
                    </button>

                    <!-- Quick helper to switch to sign up -->
                    <div class="text-center pt-2 border-t border-outline-variant">
                        <span class="text-xs text-on-surface-variant">${isAr ? 'ليس لديك حساب بعد؟' : 'Do not have an account?'}</span>
                        <button type="button" onclick="ProCable.switchAuthTab('signup')" class="text-xs font-bold text-primary hover:underline ms-1">
                            ${isAr ? 'اضغط هنا لإنشاء حساب والحصول على المزايا' : 'Register now & get perks'}
                        </button>
                    </div>

                    <!-- Demo credentials autofill button -->
                    <div class="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant text-[11px] text-on-surface-variant flex items-center justify-between">
                        <span>${isAr ? 'تجربة سريعة بحساب تجريبي مجهز:' : 'Quick Demo Account:'}</span>
                        <button type="button" onclick="ProCable.fillDemoUser()" class="text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition">
                            ${isAr ? 'تعبئة بيانات م/ طارق' : 'Fill Demo VIP'}
                        </button>
                    </div>
                </form>

                <!-- Sign Up Form -->
                <form id="authSignUpForm" onsubmit="ProCable.handleSignUp(event)" class="space-y-4 hidden">
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                        <input id="authNameUp" required type="text" placeholder="${isAr ? 'مثال: م/ أحمد علي' : 'e.g. John Doe'}" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input id="authEmailUp" required type="email" dir="ltr" placeholder="sound@example.com" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary font-mono"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</label>
                        <input id="authPhoneUp" required type="tel" dir="ltr" placeholder="010xxxxxxxx" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary font-mono"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'كلمة المرور' : 'Password'}</label>
                        <input id="authPassUp" required type="password" dir="ltr" minlength="4" placeholder="••••••••" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"/>
                    </div>

                    <div class="p-2.5 bg-primary/5 rounded-xl border border-primary/20 text-[11px] text-primary space-y-1">
                        <div class="font-black flex items-center gap-1">
                            <span class="material-symbols-outlined text-xs">loyalty</span>
                            <span>${isAr ? 'بمجرد تسجيل حسابك ستتمتع تلقائياً بـ:' : 'Upon sign-up you instantly get:'}</span>
                        </div>
                        <p class="text-[10px] text-on-surface-variant leading-relaxed">
                            ${isAr ? '• شحن مجاني لكافة المحافظات + كود خصم مباشر + أولوية تجهيز وضمان ذهبي ممتد.' : '• Free nationwide shipping + instant discount coupon + priority production.'}
                        </p>
                    </div>

                    <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition shadow flex items-center justify-center gap-2">
                        <span>${isAr ? 'تأكيد وإنشاء الحساب' : 'Create My Account'}</span>
                        <span class="material-symbols-outlined text-base">check</span>
                    </button>

                    <div class="text-center pt-2 border-t border-outline-variant">
                        <span class="text-xs text-on-surface-variant">${isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>
                        <button type="button" onclick="ProCable.switchAuthTab('signin')" class="text-xs font-bold text-primary hover:underline ms-1">
                            ${isAr ? 'تسجيل الدخول' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <!-- Password Reset Form -->
                <div id="authResetForm" class="space-y-4 hidden">
                    <div id="resetStep1" class="space-y-4">
                        <p class="text-xs text-on-surface-variant">${isAr ? 'أدخل بريدك الإلكتروني أو رقم هاتفك المسجل وسنرسل لك رمز تحقق لاستعادة كلمة المرور.' : 'Enter your registered email or phone and we will send you a verification code.'}</p>
                        <div>
                            <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'البريد الإلكتروني أو الهاتف' : 'Email or Phone'}</label>
                            <input id="authResetIdentifier" type="text" dir="ltr" placeholder="sound@example.com" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary font-mono"/>
                        </div>
                        <button type="button" onclick="ProCable.submitResetRequest()" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition shadow flex items-center justify-center gap-2">
                            <span>${isAr ? 'إرسال رمز التحقق' : 'Send Verification Code'}</span>
                        </button>
                    </div>
                    <div id="resetStep2" class="space-y-4 hidden">
                        <p id="resetNoticeMsg" class="text-xs text-primary font-bold"></p>
                        <div>
                            <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'رمز التحقق' : 'Verification Code'}</label>
                            <input id="authResetToken" type="text" dir="ltr" placeholder="000000" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary font-mono"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-on-surface mb-1">${isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                            <input id="authResetNewPass" type="password" dir="ltr" minlength="4" placeholder="••••••••" class="w-full p-3 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary"/>
                        </div>
                        <button type="button" onclick="ProCable.submitNewPassword()" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition shadow flex items-center justify-center gap-2">
                            <span>${isAr ? 'تحديث كلمة المرور' : 'Update Password'}</span>
                        </button>
                    </div>
                    <div class="text-center pt-2 border-t border-outline-variant">
                        <button type="button" onclick="ProCable.switchAuthTab('signin')" class="text-xs font-bold text-primary hover:underline">
                            ${isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    },

    showAuthModal(tab = 'signin') {
        let modal = document.getElementById('userAuthModal');
        if (!modal) {
            modal = this.createUserAuthModalDOM();
        }

        // Ensure backdrop click handler is bound
        modal.onclick = (e) => {
            if (e.target === modal) ProCable.hideAuthModal();
        };

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'active');
        modal.style.display = 'flex';

        this.switchAuthTab(tab);
    },

    hideAuthModal() {
        const modal = document.getElementById('userAuthModal');
        if (modal) {
            modal.classList.remove('flex', 'active');
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    },

    fillDemoUser() {
        const emailInput = document.getElementById('authEmailIn');
        const passInput = document.getElementById('authPassIn');
        if (emailInput && passInput) {
            emailInput.value = 'sound.engineer@gmail.com';
            passInput.value = '123456';
        }
    },

    handleSignIn(e) {
        e.preventDefault();
        const emailInput = document.getElementById('authEmailIn');
        const passInput = document.getElementById('authPassIn');
        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value : '';

        const res = this.loginUserAccount(email, pass);
        const err = document.getElementById('authErrorMsg');
        const errTxt = document.getElementById('authErrorMsgText') || err;

        if (res.success) {
            if (err) err.classList.add('hidden');
            this.showToast(this.getLang() === 'ar' ? `أهلاً بك مجدداً ${res.account.name}! ✨` : `Welcome back ${res.account.name}! ✨`, 'success');
            setTimeout(() => {
                this.hideAuthModal();
                window.location.reload();
            }, 500);
        } else {
            if (err && errTxt) {
                errTxt.innerText = res.message;
                err.classList.remove('hidden');
            } else {
                alert(res.message);
            }
        }
    },

    handleSignUp(e) {
        e.preventDefault();
        const nameInput = document.getElementById('authNameUp');
        const phoneInput = document.getElementById('authPhoneUp');
        const emailInput = document.getElementById('authEmailUp');
        const passInput = document.getElementById('authPassUp');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value : '';

        const res = this.registerUserAccount({ name, phone, email, password: pass });
        const err = document.getElementById('authErrorMsg');
        const errTxt = document.getElementById('authErrorMsgText') || err;

        if (res.success) {
            if (err) err.classList.add('hidden');
            this.showToast(this.getLang() === 'ar' ? `تم إنشاء حسابك بنجاح وتفعيل مزاياك الخاصة! 🎁` : `Account created with exclusive perks! 🎁`, 'success');
            setTimeout(() => {
                this.hideAuthModal();
                window.location.reload();
            }, 600);
        } else {
            if (err && errTxt) {
                errTxt.innerText = res.message;
                err.classList.remove('hidden');
            } else {
                alert(res.message);
            }
        }
    },

    sanitize(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }
};

// Full Backend-Grade API Namespace for Admin & Client Operations
ProCable.api = {
    shipping: {
        list: () => ProCable.getShipping(),
        add: (data) => ProCable.addGovernorate(data),
        update: (id, updates) => ProCable.updateGovernorate(id, updates),
        delete: (id) => ProCable.deleteGovernorate(id),
        toggle: (id) => ProCable.toggleGovernorate(id)
    },
    categories: {
        list: () => ProCable.getCategories(),
        add: (data) => ProCable.addCategory(data),
        update: (id, updates) => ProCable.updateCategory(id, updates),
        delete: (id) => ProCable.deleteCategory(id),
        reorder: (ids) => ProCable.reorderCategories(ids),
        toggle: (id) => ProCable.toggleCategoryVisibility(id)
    },
    products: {
        list: () => ProCable.getProducts(),
        setCategory: (pId, catId) => ProCable.setProductCategory(pId, catId)
    }
};

window.ProCable = ProCable;

// Auto init on load
document.addEventListener('DOMContentLoaded', () => {
    ProCable.applyThemeColor();
    ProCable.applyBranding();
    ProCable.applySiteBackground();
    ProCable.applyLanguageToDOM();
    ProCable.updateCartBadges();
    ProCable.initHiddenAdminShortcut();
    ProCable.renderTopPromoBanner();
    ProCable.renderRepairNav();
    ProCable.renderFooterData();
    ProCable.renderCouponBubble();
    ProCable.renderSubscriberWidget();
    ProCable.renderSaleNavAndBanners();
    ProCable.renderNavbars();
    ProCable.renderAuthAreas();
});
