const PptxGenJS = require('pptxgenjs');
let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ─── All colors are valid 6-digit hex only ────────────────────
const C = {
    bg:          '060D1F',
    card:        '0F2044',
    card_dark:   '081429',
    border:      '1E3A6E',
    // Greens
    green:       '00E87A',
    green_dim:   '0D321E',
    green_mid:   '2A7A4A',
    // Cyan
    cyan:        '00D4FF',
    cyan_dim:    '0F2D3F',
    cyan_mid:    '206080',
    // Purple
    purple:      '7B61FF',
    purple_dim:  '201A45',
    purple_mid:  '4A3A99',
    // Yellow/Gold
    yellow:      'FFD166',
    yellow_dim:  '3A2A0A',
    yellow_mid:  '806810',
    // Red/Coral
    red:         'FF4D6D',
    red_dim:     '3A0A14',
    red_mid:     '7A2233',
    // Neutral
    white:       'FFFFFF',
    light:       'E2E8F4',
    muted:       '7A8BB0',
    dark:        '081429',
};

const F = 'Arial';

// ── Helpers ──────────────────────────────────────────────────────
function bg(slide)         { slide.background = { fill: C.bg }; }
function topBar(slide, c)  {
    slide.addShape(pptx.shapes.RECTANGLE, { x:0, y:0, w:13.33, h:0.07, fill:{color:c}, line:{color:c} });
}
function divLine(slide, c) {
    slide.addShape(pptx.shapes.RECTANGLE, { x:0.6, y:1.1, w:12.5, h:0.02, fill:{color: c||C.border}, line:{color:c||C.border} });
}
function slideTitle(slide, emoji, title, sub, ac) {
    // Vertical accent bar
    slide.addShape(pptx.shapes.RECTANGLE, { x:0.6, y:0.28, w:0.07, h:0.75, fill:{color:ac||C.green}, line:{color:ac||C.green} });
    if (emoji) slide.addText(emoji, { x:0.75, y:0.22, w:0.7, h:0.5, fontSize:22, fontFace:F });
    slide.addText(title, { x:1.45, y:0.26, w:11.5, h:0.48, fontSize:28, bold:true, color:C.white, fontFace:F });
    if (sub) slide.addText(sub, { x:0.75, y:0.76, w:12.0, h:0.28, fontSize:13, color:C.muted, fontFace:F, italic:true });
    divLine(slide);
}
function card(slide, x, y, w, h, ac, rx) {
    // Shadow
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:x+0.04, y:y+0.04, w, h, fill:{color:C.card_dark}, rectRadius:rx||0.12, line:{color:C.card_dark} });
    // Main
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill:{color:C.card}, rectRadius:rx||0.12, line:{color:ac||C.border, width:1.5} });
    // Top stripe
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w, h:0.07, fill:{color:ac||C.green}, line:{color:ac||C.green} });
}
function circleShape(slide, x, y, sz, fillColor, lineColor) {
    slide.addShape(pptx.shapes.OVAL, { x, y, w:sz, h:sz, fill:{color:fillColor||C.green}, line:{color:lineColor||fillColor||C.green} });
}
function numBadge(slide, x, y, n, ac) {
    circleShape(slide, x, y, 0.45, ac||C.green, ac||C.green);
    slide.addText(String(n), { x, y:y+0.02, w:0.45, h:0.41, fontSize:18, bold:true, color:C.bg, align:'center', fontFace:F });
}
function leftBar(slide, x, y, h, ac) {
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w:0.07, h, fill:{color:ac||C.green}, line:{color:ac||C.green} });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1 ─ Title
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);

    // Decorative circles (solid dim colors only)
    circleShape(s, 9.5, -1.5, 6, C.green_dim, C.green_dim);
    circleShape(s, 10.2, -1.0, 4.5, C.cyan_dim, C.cyan_dim);
    circleShape(s, -1.5, 4.0, 4.5, C.purple_dim, C.purple_dim);

    // Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:0.8, y:0.6, w:2.8, h:0.38, fill:{color:C.green_dim}, rectRadius:0.1, line:{color:C.green, width:1} });
    s.addText('🎓  FINAL YEAR PROJECT  2026', { x:0.8, y:0.63, w:2.8, h:0.3, fontSize:9, bold:true, color:C.green, align:'center', fontFace:F, charSpacing:1 });

    s.addText('Turf Mate', { x:0.7, y:1.15, w:10, h:1.35, fontSize:80, bold:true, color:C.green, fontFace:F });
    s.addText('Management System', { x:0.7, y:2.45, w:11, h:0.75, fontSize:40, bold:true, color:C.white, fontFace:F });
    s.addText('A Full-Stack Web Platform for Real-Time Sports Turf Booking\n& Management with Secure Email OTP Verification',
        { x:0.7, y:3.3, w:9.5, h:0.85, fontSize:15, color:C.muted, fontFace:F, lineSpacingMultiple:1.4 });

    // Tech pill tags
    const tags = ['Java 17','Spring Boot','MongoDB','HTML/CSS/JS','AWS EC2'];
    tags.forEach((tag, i) => {
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:0.7+i*2.35, y:4.28, w:2.2, h:0.33, fill:{color:C.cyan_dim}, rectRadius:0.15, line:{color:C.cyan, width:1} });
        s.addText(tag, { x:0.7+i*2.35, y:4.3, w:2.2, h:0.3, fontSize:10.5, bold:true, color:C.cyan, align:'center', fontFace:F });
    });

    // Right stat cards
    const stats = [
        { num:'6',    label:'OTP Digits\nVerification',  ac:C.cyan,   dim:C.cyan_dim },
        { num:'24/7', label:'AWS EC2\nUptime',           ac:C.green,  dim:C.green_dim },
        { num:'∞',   label:'Email Domain\nSupport',      ac:C.purple, dim:C.purple_dim },
    ];
    stats.forEach((st, i) => {
        let x=11.0, y=1.2+i*1.52;
        card(s, x, y, 2.1, 1.3, st.ac);
        s.addText(st.num, { x, y:y+0.12, w:2.1, h:0.6, fontSize:28, bold:true, color:st.ac, align:'center', fontFace:F });
        s.addText(st.label, { x, y:y+0.72, w:2.1, h:0.48, fontSize:10, color:C.muted, align:'center', fontFace:F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 ─ What Is This Project?
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.cyan);
    slideTitle(s, '💡', 'What Is This Project?', 'Understanding the Turf Management System', C.cyan);

    // Left description block
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:0.6, y:1.25, w:6.2, h:4.5, fill:{color:C.card}, rectRadius:0.15, line:{color:C.cyan, width:1.5} });
    leftBar(s, 0.6, 1.25, 4.5, C.cyan);
    s.addText('The Idea Behind It', { x:0.85, y:1.35, w:5.8, h:0.38, fontSize:16, bold:true, color:C.cyan, fontFace:F });
    s.addText(
        "Booking a sports turf today is still a phone-and-paper affair.\n\nWe built a platform that digitizes every part of the process:",
        { x:0.85, y:1.78, w:5.8, h:1.15, fontSize:12, color:C.light, fontFace:F, lineSpacingMultiple:1.4 }
    );
    const flows = [
        '→  Customers browse available turfs at any time',
        '→  Register with mandatory email OTP verification',
        '→  Pick a slot and pay — all in one seamless flow',
        '→  Owners track bookings live in real-time',
    ];
    flows.forEach((f, i) => s.addText(f, { x:0.85, y:3.0+i*0.55, w:5.8, h:0.44, fontSize:12, color:i===1?C.cyan:C.white, fontFace:F, bold:i===1 }));

    // Right feature cards
    const feats = [
        { icon:'🔐', title:'OTP Verification',   sub:'Email-verified accounts only\nNo fake registrations allowed', ac:C.green,  dim:C.green_dim  },
        { icon:'📅', title:'Live Booking',        sub:'Real-time slots with zero\ndouble-booking conflicts',        ac:C.cyan,   dim:C.cyan_dim   },
        { icon:'📊', title:'Booking Analytics',   sub:'Revenue & utilisation\ndashboard for owners',               ac:C.purple, dim:C.purple_dim },
    ];
    feats.forEach((f, i) => {
        let x=7.1, y=1.25+i*1.56;
        card(s, x, y, 5.95, 1.4, f.ac);
        circleShape(s, x+0.2, y+0.2, 0.58, f.dim, f.ac);
        s.addText(f.icon, { x:x+0.2, y:y+0.17, w:0.58, h:0.55, fontSize:24, align:'center', fontFace:F });
        s.addText(f.title, { x:x+0.92, y:y+0.18, w:4.8, h:0.36, fontSize:15, bold:true, color:f.ac, fontFace:F });
        s.addText(f.sub, { x:x+0.92, y:y+0.58, w:4.8, h:0.7, fontSize:11, color:C.muted, fontFace:F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 ─ Tools & Technologies
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.purple);
    slideTitle(s, '🔧', 'Tools & Technologies Used', "Each tool chosen for a specific reason", C.purple);

    const tools = [
        { icon:'☕', name:'Java 17',         role:'Backend Language',    desc:'Strongly typed, mature ecosystem for reliable REST API development.',      ac:C.yellow, dim:C.yellow_dim },
        { icon:'🍃', name:'Spring Boot 3',   role:'App Framework',       desc:'Handles HTTP, DI and email sending with minimal boilerplate.',            ac:C.green,  dim:C.green_dim  },
        { icon:'🍃', name:'MongoDB',         role:'NoSQL Database',      desc:'Document store for users, bookings and OTP states — schema-free.',        ac:C.green,  dim:C.green_dim  },
        { icon:'📧', name:'JavaMailSender',  role:'Email Engine (SMTP)', desc:'Sends HTML OTP emails. Graceful fallback to UI auto-fill if offline.',    ac:C.cyan,   dim:C.cyan_dim   },
        { icon:'🌐', name:'HTML5/CSS3/JS',   role:'Vanilla Frontend',    desc:'Glassmorphism UI with neon micro-animations. Runs in any browser.',       ac:C.cyan,   dim:C.cyan_dim   },
        { icon:'🔨', name:'Maven',           role:'Build Tool',          desc:'Manages all dependencies. Packages app into a single deployable JAR.',    ac:C.yellow, dim:C.yellow_dim },
        { icon:'☁️', name:'AWS EC2',          role:'Cloud Hosting',       desc:'Ubuntu systemd service — 24/7 uptime, auto-restart on crash/reboot.',     ac:C.purple, dim:C.purple_dim },
        { icon:'🐙', name:'GitHub',          role:'Version Control',     desc:'Credentials excluded via .gitignore. CI-ready clean commit history.',     ac:C.muted,  dim:C.border     },
    ];
    tools.forEach((t, i) => {
        let col=i%4, row=Math.floor(i/4);
        let x=0.6+col*3.2, y=1.3+row*2.0;
        card(s, x, y, 3.0, 1.78, t.ac);
        circleShape(s, x+0.15, y+0.2, 0.52, t.dim, t.ac);
        s.addText(t.icon, { x:x+0.15, y:y+0.17, w:0.52, h:0.5, fontSize:20, align:'center', fontFace:F });
        // Role badge
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:x+0.75, y:y+0.2, w:2.0, h:0.26, fill:{color:t.dim}, rectRadius:0.08, line:{color:t.ac, width:0.8} });
        s.addText(t.role, { x:x+0.75, y:y+0.2, w:2.0, h:0.26, fontSize:8.5, bold:true, color:t.ac, align:'center', fontFace:F });
        s.addText(t.name, { x:x+0.75, y:y+0.52, w:2.1, h:0.32, fontSize:13, bold:true, color:C.white, fontFace:F });
        s.addText(t.desc, { x:x+0.15, y:y+0.92, w:2.72, h:0.75, fontSize:10, color:C.muted, fontFace:F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 ─ Similar Projects
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.yellow);
    slideTitle(s, '🏟️', 'Similar Projects in the Space', 'Where we stand in the landscape — and what we did differently', C.yellow);

    const projects = [
        { icon:'🏟️', name:'Playo',             ac:C.cyan,   dim:C.cyan_dim,   desc:"India's biggest turf discovery app. Mobile-first, city-wide listings.",            gap:'No OTP verification. No owner management portal.' },
        { icon:'⚽', name:'Hudle',              ac:C.purple, dim:C.purple_dim, desc:'Aggregator model. Focuses on discovery, reviews and social meetups.',               gap:'Owners are just listings; no slot control or pricing rules.' },
        { icon:'🎟️', name:'BookMyShow Sports',  ac:C.yellow, dim:C.yellow_dim, desc:'Giant ticketing platform. Huge reach but generic booking flow.',                    gap:'One-size-fits-all; no white-label option or OTP security.' },
        { icon:'🖥️', name:'Custom CMS/Sheets',  ac:C.red,    dim:C.red_dim,    desc:'WordPress/WooCommerce or Google Sheets — manual and error-prone.',                  gap:'No real-time collision detection. Double-bookings daily.' },
    ];
    projects.forEach((p, i) => {
        let col=i%2, row=Math.floor(i/2);
        let x=0.6+col*6.38, y=1.28+row*2.38;
        card(s, x, y, 6.1, 2.15, p.ac);
        s.addText(p.icon+'   '+p.name, { x:x+0.25, y:y+0.18, w:5.6, h:0.42, fontSize:17, bold:true, color:p.ac, fontFace:F });
        s.addText(p.desc, { x:x+0.25, y:y+0.62, w:5.6, h:0.42, fontSize:12, color:C.light, fontFace:F });
        // Gap divider
        s.addShape(pptx.shapes.RECTANGLE, { x:x+0.25, y:y+1.12, w:5.6, h:0.02, fill:{color:C.red_mid}, line:{color:C.red_mid} });
        // Gap badge
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:x+0.25, y:y+1.17, w:0.7, h:0.22, fill:{color:C.red_dim}, rectRadius:0.05, line:{color:C.red, width:0.8} });
        s.addText('GAP', { x:x+0.25, y:y+1.18, w:0.7, h:0.2, fontSize:8, bold:true, color:C.red, align:'center', fontFace:F });
        s.addText(p.gap, { x:x+1.02, y:y+1.17, w:4.85, h:0.65, fontSize:11, color:C.red, fontFace:F, italic:true });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 ─ Uniqueness
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);
    slideTitle(s, '⚡', 'What Makes This Different?', "Features that set us apart — not just another CRUD app", C.green);

    const pts = [
        { text:'Mandatory OTP Email Verification — every account confirmed via 6-digit code before first login',      ac:C.green,  dim:C.green_dim  },
        { text:'Generic Email Domain Support — accepts Gmail, Outlook, Yahoo, any corporate domain via regex',         ac:C.cyan,   dim:C.cyan_dim   },
        { text:'SMTP Fallback Mode — OTP auto-fills in UI if email delivery is offline; zero user blocking',           ac:C.purple, dim:C.purple_dim },
        { text:'Unverified Login Redirection — HTTP 403 auto-opens OTP modal instead of a dead-end error screen',     ac:C.yellow, dim:C.yellow_dim },
        { text:'Collision-free Booking — slots locked at database level, not just the UI layer',                       ac:C.green,  dim:C.green_dim  },
        { text:'Deployed on AWS EC2 as systemd service — 24/7 uptime, auto-restarts on crash or server reboot',       ac:C.cyan,   dim:C.cyan_dim   },
        { text:'Credential-safe GitHub repo — application.properties in .gitignore so secrets never leak online',     ac:C.purple, dim:C.purple_dim },
        { text:'Relative API URLs — frontend works on any server IP or domain with zero code changes post-deploy',     ac:C.yellow, dim:C.yellow_dim },
    ];
    pts.forEach((p, i) => {
        let col=i%2, row=Math.floor(i/2);
        let x=col===0?0.6:6.88, y=1.28+row*1.02;
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w:6.0, h:0.88, fill:{color:C.card}, rectRadius:0.1, line:{color:p.dim, width:1} });
        leftBar(s, x, y, 0.88, p.ac);
        numBadge(s, x+0.18, y+0.22, i+1, p.ac);
        s.addText(p.text, { x:x+0.75, y:y+0.1, w:5.1, h:0.7, fontSize:11.5, color:C.light, fontFace:F, lineSpacingMultiple:1.3 });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 ─ Necessity
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.red);
    slideTitle(s, '🎯', 'Why Did This Need to Be Built?', 'Real problems we saw — and decided to solve', C.red);

    const stats = [
        { icon:'📈', val:'40%+', label:'YoY Booking Growth',     sub:'Sports tourism boom in India',   ac:C.green,  dim:C.green_dim  },
        { icon:'📞', val:'70%',  label:'Grounds Use Phone Calls', sub:'Manual = errors + frustration',  ac:C.yellow, dim:C.yellow_dim },
        { icon:'❌', val:'Daily', label:'Double-Booking Conflicts',sub:'No system → guaranteed chaos',  ac:C.red,    dim:C.red_dim    },
        { icon:'🚫', val:'100%', label:'Fake Accounts Stopped',   sub:'OTP verification blocks spam',  ac:C.cyan,   dim:C.cyan_dim   },
    ];
    stats.forEach((st, i) => {
        let x=0.6+i*3.18;
        card(s, x, 1.28, 3.0, 1.72, st.ac);
        s.addText(st.icon, { x, y:1.36, w:3.0, h:0.45, fontSize:22, align:'center', fontFace:F });
        s.addText(st.val, { x, y:1.82, w:3.0, h:0.45, fontSize:24, bold:true, color:st.ac, align:'center', fontFace:F });
        s.addText(st.label, { x:x+0.1, y:2.28, w:2.8, h:0.3, fontSize:10.5, bold:true, color:C.white, align:'center', fontFace:F });
        s.addText(st.sub, { x:x+0.1, y:2.58, w:2.8, h:0.3, fontSize:9.5, color:C.muted, align:'center', fontFace:F });
    });

    s.addText('Pain Points We Solved', { x:0.6, y:3.12, w:12.5, h:0.38, fontSize:15, bold:true, color:C.red, fontFace:F });
    const pains = [
        'Customers had zero visibility — had to call and hope for the best',
        'Fake email registrations blocked genuine users from getting slots',
        'Owners had no centralised view of who booked what and when',
        'Revenue tracking done in notebooks or Excel — unreliable and error-prone',
        'Sports clubs couldn\'t book recurring weekly slots systematically',
        'Cash payments were hard to track; booking disputes were common',
    ];
    [pains.slice(0,3), pains.slice(3)].forEach((col, ci) => {
        let x = ci===0 ? 0.6 : 6.88;
        col.forEach((p, pi) => {
            let y=3.6+pi*0.58;
            circleShape(s, x+0.05, y+0.12, 0.14, C.red, C.red);
            s.addText(p, { x:x+0.28, y, w:5.7, h:0.48, fontSize:11.5, color:C.light, fontFace:F });
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 ─ Future Scope
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.purple);
    slideTitle(s, '🚀', 'Where Can This Go Next?', 'Future scope — features scoped for v2.0+', C.purple);

    const futs = [
        { icon:'📱', title:'Mobile App',            desc:'React Native / Flutter.\nSame REST API, native iOS & Android.',  ac:C.cyan,   dim:C.cyan_dim   },
        { icon:'💸', title:'Dynamic Pricing AI',    desc:'AI-driven surge pricing.\nPeak hours & weather-based rates.',     ac:C.green,  dim:C.green_dim  },
        { icon:'🤖', title:'Predictive Analytics',  desc:'ML on booking history.\nPredict demand, suggest slot openings.', ac:C.purple, dim:C.purple_dim },
        { icon:'🔔', title:'Smart Notifications',   desc:'WhatsApp/SMS/Email alerts.\nAuto-cancel unpaid slots in 10 min.',ac:C.yellow, dim:C.yellow_dim },
        { icon:'🏆', title:'Loyalty & Subscriptions',desc:'Weekly memberships, reward\npoints and booking community.',      ac:C.red,    dim:C.red_dim    },
        { icon:'🗺️', title:'Multi-City Marketplace', desc:'Aggregator mode — multiple\ncities, partner-owner model.',       ac:C.cyan,   dim:C.cyan_dim   },
        { icon:'🔐', title:'JWT Auth Upgrade',      desc:'Full role-based JWT tokens:\nAdmin · Owner · Customer.',         ac:C.purple, dim:C.purple_dim },
        { icon:'💳', title:'Live Payment Gateway',  desc:'Razorpay / Stripe live keys\nfor real INR transactions.',        ac:C.green,  dim:C.green_dim  },
    ];
    futs.forEach((f, i) => {
        let col=i%4, row=Math.floor(i/4);
        let x=0.6+col*3.2, y=1.3+row*2.1;
        card(s, x, y, 3.0, 1.9, f.ac);
        circleShape(s, x+0.2, y+0.18, 0.58, f.dim, f.ac);
        s.addText(f.icon, { x:x+0.2, y:y+0.15, w:0.58, h:0.55, fontSize:22, align:'center', fontFace:F });
        s.addText(f.title, { x:x+0.88, y:y+0.2, w:1.95, h:0.36, fontSize:12.5, bold:true, color:f.ac, fontFace:F });
        s.addText(f.desc, { x:x+0.2, y:y+0.9, w:2.65, h:0.88, fontSize:10.5, color:C.muted, fontFace:F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 ─ Thank You
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);

    // Decorative circles
    circleShape(s, -1, -1, 6,   C.green_dim,  C.green_mid);
    circleShape(s,  9.5, 3.5, 5, C.cyan_dim,  C.cyan_mid);
    circleShape(s,  5.5, 1.5, 7, C.purple_dim,C.purple_mid);

    // Central card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x:1.5, y:0.9, w:10.5, h:5.3, fill:{color:C.card}, rectRadius:0.25, line:{color:C.green, width:2.5} });
    s.addShape(pptx.shapes.RECTANGLE, { x:1.5, y:0.9, w:10.5, h:0.09, fill:{color:C.green}, line:{color:C.green} });

    s.addText('🙏', { x:1.5, y:1.1, w:10.5, h:0.8, fontSize:40, align:'center', fontFace:F });
    s.addText('Thank You!', { x:1.5, y:1.9, w:10.5, h:1.3, fontSize:68, bold:true, color:C.green, align:'center', fontFace:F });
    s.addText('Open for Questions  🙋', { x:1.5, y:3.25, w:10.5, h:0.6, fontSize:22, color:C.white, align:'center', fontFace:F });

    s.addShape(pptx.shapes.RECTANGLE, { x:3.5, y:3.95, w:6.5, h:0.03, fill:{color:C.border}, line:{color:C.border} });

    s.addText('Turf Mate  ·  Java  ·  Spring Boot  ·  MongoDB  ·  AWS EC2',
        { x:1.5, y:4.08, w:10.5, h:0.38, fontSize:13, color:C.muted, align:'center', fontFace:F });
    s.addText('Email OTP Verification  ·  Real-Time Slot Booking  ·  Secure Cloud Deployment',
        { x:1.5, y:4.5, w:10.5, h:0.35, fontSize:12, color:C.cyan, align:'center', fontFace:F, italic:true });
}

// ── Save ─────────────────────────────────────────────────────────
pptx.writeFile({ fileName:'Turf_Management_Final.pptx' })
    .then(() => console.log('✅  Turf_Management_Final.pptx generated with NO color warnings!'))
    .catch(err => console.error('Error:', err));
