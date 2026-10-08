const PptxGenJS = require('pptxgenjs');

let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';

// ─── Design Tokens ────────────────────────────────────────────────
const C = {
    bg:       '060D1F',   // deep space black
    bg2:      '0D1B3E',   // dark navy
    card:     '0F2044',   // card navy
    card2:    '112554',   // lighter card
    green:    '00E87A',   // neon green
    cyan:     '00D4FF',   // electric cyan
    purple:   '7B61FF',   // vivid purple
    yellow:   'FFD166',   // warm gold
    red:      'FF4D6D',   // coral red
    white:    'FFFFFF',
    light:    'E2E8F4',
    muted:    '7A8BB0',
    border:   '1E3A6E',
    dark:     '081429',
};
const F = 'Arial';

// ── Helper: Dark background ──────────────────────────────────────
function bg(slide, color) {
    slide.background = { fill: color || C.bg };
}

// ── Helper: Glowing accent bar (top) ────────────────────────────
function topBar(slide, color) {
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 0, w: 13.33, h: 0.07,
        fill: { type: 'solid', color: color || C.green },
        line: { color: color || C.green }
    });
}

// ── Helper: Gradient-style card ──────────────────────────────────
function gCard(slide, x, y, w, h, accentColor, opts) {
    // Shadow layer
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.04, y: y + 0.04, w, h,
        fill: { color: C.dark }, rectRadius: 0.12,
        line: { color: C.dark }
    });
    // Main card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w, h,
        fill: { color: C.card },
        rectRadius: 0.12,
        line: { color: accentColor || C.border, width: 1.5 }
    });
    // Top accent stripe
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w, h: 0.06,
        fill: { color: accentColor || C.green },
        rectRadius: 0.12,
        line: { color: accentColor || C.green }
    });
}

// ── Helper: Circle badge ─────────────────────────────────────────
function circle(slide, x, y, size, color) {
    slide.addShape(pptx.shapes.OVAL, {
        x, y, w: size, h: size,
        fill: { color: color || C.green },
        line: { color: color || C.green }
    });
}

// ── Helper: Number badge ─────────────────────────────────────────
function numBadge(slide, x, y, num, color) {
    circle(slide, x, y, 0.45, color || C.green);
    slide.addText(String(num), {
        x, y: y + 0.02, w: 0.45, h: 0.41,
        fontSize: 18, bold: true, color: C.bg, align: 'center', fontFace: F
    });
}

// ── Helper: Slide title block ────────────────────────────────────
function slideTitle(slide, emoji, title, sub, accentColor) {
    const ac = accentColor || C.green;
    // Left accent bar
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 0.28, w: 0.07, h: 0.75,
        fill: { color: ac }, line: { color: ac }
    });
    // Emoji
    if (emoji) {
        slide.addText(emoji, {
            x: 0.75, y: 0.22, w: 0.7, h: 0.5,
            fontSize: 22, fontFace: F
        });
    }
    // Title
    slide.addText(title, {
        x: emoji ? 1.45 : 0.75, y: 0.26, w: 11.5, h: 0.48,
        fontSize: 28, bold: true, color: C.white, fontFace: F
    });
    // Subtitle
    if (sub) {
        slide.addText(sub, {
            x: 0.75, y: 0.76, w: 12.0, h: 0.28,
            fontSize: 13, color: C.muted, fontFace: F, italic: true
        });
    }
    // Divider line
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 1.1, w: 12.5, h: 0.02,
        fill: { color: C.border }, line: { color: C.border }
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1 ─ Title Slide
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);

    // Big BG circle decoration (top right)
    s.addShape(pptx.shapes.OVAL, {
        x: 9.5, y: -1.5, w: 6, h: 6,
        fill: { color: '0D2A1C' }, line: { color: '0D2A1C', width: 1.5 }
    });
    s.addShape(pptx.shapes.OVAL, {
        x: 10.2, y: -1.0, w: 4.5, h: 4.5,
        fill: { color: '091A22' }, line: { color: '00D4FF15', width: 1 }
    });

    // Bottom left circle decoration
    s.addShape(pptx.shapes.OVAL, {
        x: -1.5, y: 4.0, w: 4.5, h: 4.5,
        fill: { color: '13102A' }, line: { color: '7B61FF20', width: 1 }
    });

    // PROJECT LABEL
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: 0.6, w: 2.8, h: 0.38,
        fill: { color: '0A2419' }, rectRadius: 0.1,
        line: { color: C.green, width: 1 }
    });
    s.addText('🎓  FINAL YEAR PROJECT  2026', {
        x: 0.8, y: 0.63, w: 2.8, h: 0.3,
        fontSize: 9, bold: true, color: C.green, align: 'center', fontFace: F, charSpacing: 1
    });

    // Main Title
    s.addText('Turf Mate', {
        x: 0.7, y: 1.15, w: 10, h: 1.4,
        fontSize: 80, bold: true, color: C.green, fontFace: F
    });

    // Subtitle
    s.addText('Management System', {
        x: 0.7, y: 2.45, w: 11, h: 0.75,
        fontSize: 40, bold: true, color: C.white, fontFace: F
    });

    // Description
    s.addText(
        'A Full-Stack Web Platform for Real-Time Sports Turf Booking\n& Management with Secure Email OTP Verification',
        {
            x: 0.7, y: 3.3, w: 9.5, h: 0.85,
            fontSize: 15, color: C.muted, fontFace: F, lineSpacingMultiple: 1.4
        }
    );

    // Tech Pill Tags
    const tags = ['Java 17', 'Spring Boot', 'MongoDB', 'HTML/CSS/JS', 'AWS EC2'];
    tags.forEach((tag, i) => {
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.7 + i * 2.35, y: 4.28, w: 2.2, h: 0.33,
            fill: { color: '0D2030' }, rectRadius: 0.15,
            line: { color: C.cyan, width: 1 }
        });
        s.addText(tag, {
            x: 0.7 + i * 2.35, y: 4.3, w: 2.2, h: 0.3,
            fontSize: 10.5, bold: true, color: C.cyan, align: 'center', fontFace: F
        });
    });

    // Right side - glowing stat cards
    const stats = [
        { num: '6', label: 'OTP Digits\nVerification' },
        { num: '24/7', label: 'AWS EC2\nUptime' },
        { num: '∞', label: 'Email\nDomains' },
    ];
    stats.forEach((st, i) => {
        let x = 11.0;
        let y = 1.2 + i * 1.5;
        gCard(s, x, y, 2.1, 1.2, C.cyan);
        s.addText(st.num, {
            x, y: y + 0.12, w: 2.1, h: 0.55,
            fontSize: 28, bold: true, color: C.cyan, align: 'center', fontFace: F
        });
        s.addText(st.label, {
            x, y: y + 0.65, w: 2.1, h: 0.45,
            fontSize: 10, color: C.muted, align: 'center', fontFace: F
        });
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

    // Left: Description block
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.6, y: 1.25, w: 6.2, h: 4.5,
        fill: { color: C.card }, rectRadius: 0.15,
        line: { color: C.cyan, width: 1.5 }
    });
    s.addShape(pptx.shapes.RECTANGLE, {
        x: 0.6, y: 1.25, w: 0.08, h: 4.5,
        fill: { color: C.cyan }, line: { color: C.cyan }
    });

    s.addText('The Idea Behind It', {
        x: 0.85, y: 1.35, w: 5.8, h: 0.38,
        fontSize: 16, bold: true, color: C.cyan, fontFace: F
    });

    const idea = "Booking a sports turf today is still a phone-and-paper affair.\n\nWe built a platform that changes that — a centralized, real-time web application that digitizes every part of the process:";
    s.addText(idea, {
        x: 0.85, y: 1.78, w: 5.8, h: 1.35,
        fontSize: 12, color: C.light, fontFace: F, lineSpacingMultiple: 1.4
    });

    const flows = [
        '→  Customers browse available turfs at any time',
        '→  Register with mandatory email OTP verification',
        '→  Pick a slot and pay — all in one seamless flow',
        '→  Owners track bookings live in real-time',
    ];
    flows.forEach((f, i) => {
        s.addText(f, {
            x: 0.85, y: 3.2 + i * 0.54,
            w: 5.8, h: 0.44,
            fontSize: 12, color: C.white, fontFace: F, bold: i === 1
        });
    });

    // Right: Feature cards
    const features = [
        { icon: '🔐', title: 'OTP Verification', sub: 'Email-verified accounts only\nNo fake registrations allowed', color: C.green },
        { icon: '📅', title: 'Live Booking', sub: 'Real-time slots with zero\ndouble-booking conflicts', color: C.cyan },
        { icon: '📊', title: 'Booking Analytics', sub: 'Revenue & utilisation\ndashboard for owners', color: C.purple },
    ];
    features.forEach((f, i) => {
        let x = 7.1;
        let y = 1.25 + i * 1.55;
        gCard(s, x, y, 5.95, 1.38, f.color);
        s.addText(f.icon, { x: x + 0.2, y: y + 0.15, w: 0.7, h: 0.6, fontSize: 26, fontFace: F });
        s.addText(f.title, { x: x + 0.95, y: y + 0.15, w: 4.8, h: 0.35, fontSize: 15, bold: true, color: f.color, fontFace: F });
        s.addText(f.sub, { x: x + 0.95, y: y + 0.55, w: 4.8, h: 0.68, fontSize: 11, color: C.muted, fontFace: F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 ─ Tools & Technologies
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.purple);
    slideTitle(s, '🔧', 'Tools & Technologies Used', "Each tool chosen for a specific reason — not just because it's popular", C.purple);

    const tools = [
        { icon: '☕', name: 'Java 17', role: 'Backend Language', desc: 'Strongly typed, mature ecosystem for reliable REST API development.', color: C.yellow },
        { icon: '🍃', name: 'Spring Boot 3', role: 'App Framework', desc: 'Handles HTTP, DI, security and email with minimal boilerplate.', color: C.green },
        { icon: '🍃', name: 'MongoDB', role: 'NoSQL Database', desc: 'Document store for users, bookings and OTP states — schema-free flexibility.', color: C.green },
        { icon: '📧', name: 'JavaMailSender', role: 'Email Engine (SMTP)', desc: 'Sends HTML OTP emails. Falls back gracefully to UI auto-fill if offline.', color: C.cyan },
        { icon: '🌐', name: 'HTML5 / CSS3 / JS', role: 'Frontend (Vanilla)', desc: 'Glassmorphism UI with neon micro-animations. Runs in any browser.', color: C.cyan },
        { icon: '🔨', name: 'Maven', role: 'Build Tool', desc: 'Manages all dependencies. Packages app into a single deployable JAR.', color: C.yellow },
        { icon: '☁️', name: 'AWS EC2', role: 'Cloud Hosting', desc: 'Ubuntu server as systemd service — 24/7 uptime, auto-restart on crash.', color: C.purple },
        { icon: '🐙', name: 'GitHub', role: 'Version Control', desc: 'Credentials excluded via .gitignore. CI-ready with clean commit history.', color: C.muted },
    ];

    tools.forEach((t, i) => {
        let col = i % 4;
        let row = Math.floor(i / 4);
        let x = 0.6 + col * 3.2;
        let y = 1.3 + row * 2.0;

        gCard(s, x, y, 3.0, 1.78, t.color);
        // Icon circle
        circle(s, x + 0.15, y + 0.2, 0.52, t.color + '28');
        s.addText(t.icon, { x: x + 0.15, y: y + 0.17, w: 0.52, h: 0.5, fontSize: 20, align: 'center', fontFace: F });

        // Role badge
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x + 0.75, y: y + 0.2, w: 2.0, h: 0.25,
            fill: { color: t.color + '28' }, rectRadius: 0.08,
            line: { color: t.color, width: 0.8 }
        });
        s.addText(t.role, { x: x + 0.75, y: y + 0.2, w: 2.0, h: 0.26, fontSize: 8.5, bold: true, color: t.color, align: 'center', fontFace: F });

        s.addText(t.name, { x: x + 0.75, y: y + 0.52, w: 2.1, h: 0.32, fontSize: 13, bold: true, color: C.white, fontFace: F });
        s.addText(t.desc, { x: x + 0.15, y: y + 0.92, w: 2.72, h: 0.75, fontSize: 10, color: C.muted, fontFace: F });
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
        { icon: '🏟️', name: 'Playo', color: C.cyan, desc: "India's biggest turf discovery app. Mobile-first, city-wide listings.", gap: 'No OTP verification. No owner management portal.' },
        { icon: '⚽', name: 'Hudle', color: C.purple, desc: 'Aggregator model. Focuses on discovery, reviews and social meetups.', gap: 'Owners are just listings; no slot control or pricing rules.' },
        { icon: '🎟️', name: 'BookMyShow', color: C.yellow, desc: 'Giant ticketing platform. Huge reach but generic booking flow.', gap: 'One-size-fits-all; no white-label option or email OTP security.' },
        { icon: '🖥️', name: 'Custom CMS / Sheets', color: C.red, desc: 'WordPress/WooCommerce or Google Sheets — manual, error-prone.', gap: 'No real-time collision detection. Double-bookings happen daily.' },
    ];

    projects.forEach((p, i) => {
        let col = i % 2;
        let row = Math.floor(i / 2);
        let x = 0.6 + col * 6.38;
        let y = 1.28 + row * 2.35;

        // Card
        gCard(s, x, y, 6.1, 2.1, p.color);

        // Icon + Name header
        s.addText(p.icon + '   ' + p.name, {
            x: x + 0.25, y: y + 0.18,
            w: 5.6, h: 0.42,
            fontSize: 17, bold: true, color: p.color, fontFace: F
        });

        // Description
        s.addText(p.desc, {
            x: x + 0.25, y: y + 0.62, w: 5.6, h: 0.42,
            fontSize: 12, color: C.light, fontFace: F
        });

        // Gap divider
        s.addShape(pptx.shapes.RECTANGLE, {
            x: x + 0.25, y: y + 1.12, w: 5.6, h: 0.02,
            fill: { color: C.red + '88' }, line: { color: C.red }
        });

        // Gap label
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x + 0.25, y: y + 1.16, w: 0.7, h: 0.22,
            fill: { color: C.red + '28' }, rectRadius: 0.05,
            line: { color: C.red, width: 0.8 }
        });
        s.addText('GAP', { x: x + 0.25, y: y + 1.17, w: 0.7, h: 0.2, fontSize: 8, bold: true, color: C.red, align: 'center', fontFace: F });

        s.addText(p.gap, {
            x: x + 1.02, y: y + 1.17, w: 4.85, h: 0.62,
            fontSize: 11, color: C.red, fontFace: F, italic: true
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 ─ Uniqueness
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);
    slideTitle(s, '⚡', "What Makes This Different?", "Features that set us apart — not just another CRUD app", C.green);

    const points = [
        { text: 'Mandatory OTP Email Verification — every account confirmed via 6-digit code before first login', color: C.green },
        { text: 'Generic Email Domain Support — accepts Gmail, Outlook, Yahoo, any corporate domain via regex', color: C.cyan },
        { text: 'SMTP Fallback Mode — OTP auto-fills in UI if email delivery is offline; zero blocking', color: C.purple },
        { text: 'Unverified Login Redirection — HTTP 403 auto-opens OTP verification modal instead of dead-end error', color: C.yellow },
        { text: 'Collision-free Booking — slots locked at DB level, not just UI layer', color: C.green },
        { text: 'Deployed on AWS EC2 as systemd service — runs 24/7, auto-restarts on crash or reboot', color: C.cyan },
        { text: 'Credential-safe GitHub repo — application.properties in .gitignore so secrets never leak', color: C.purple },
        { text: 'Relative API URLs — frontend works on any server IP or domain with zero code changes', color: C.yellow },
    ];

    points.forEach((p, i) => {
        let col = i % 2;
        let row = Math.floor(i / 4 === 0 ? Math.floor(i / 2) : Math.floor(i / 2));
        let isRight = col === 1;
        let x = isRight ? 6.85 : 0.6;
        let y = 1.28 + Math.floor(i / 2) * 1.02;

        // Card
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x, y, w: 6.0, h: 0.88,
            fill: { color: C.card }, rectRadius: 0.1,
            line: { color: p.color + '60', width: 1 }
        });
        // Left colored bar
        s.addShape(pptx.shapes.RECTANGLE, {
            x, y, w: 0.07, h: 0.88,
            fill: { color: p.color }, line: { color: p.color }
        });
        // Number badge
        numBadge(s, x + 0.18, y + 0.22, i + 1, p.color);
        // Text
        s.addText(p.text, {
            x: x + 0.75, y: y + 0.1, w: 5.1, h: 0.7,
            fontSize: 11.5, color: C.light, fontFace: F, lineSpacingMultiple: 1.3
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 ─ Necessity
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.red);
    slideTitle(s, '🎯', "Why Did This Need to Be Built?", 'Real problems we saw — and decided to solve', C.red);

    // Top stats row
    const stats = [
        { icon: '📈', val: '40%+', label: 'YoY booking growth', sub: 'Sports tourism boom in India', color: C.green },
        { icon: '📞', val: '70%', label: 'Grounds use phone calls', sub: 'Manual = errors + frustration', color: C.yellow },
        { icon: '❌', val: 'Weekly', label: 'Double booking conflicts', sub: 'No system → guaranteed chaos', color: C.red },
        { icon: '🚫', val: '100%', label: 'Fake accounts stopped', sub: 'OTP verification blocks spam', color: C.cyan },
    ];

    stats.forEach((st, i) => {
        let x = 0.6 + i * 3.18;
        gCard(s, x, 1.28, 3.0, 1.7, st.color);
        s.addText(st.icon, { x, y: 1.35, w: 3.0, h: 0.45, fontSize: 22, align: 'center', fontFace: F });
        s.addText(st.val, { x, y: 1.82, w: 3.0, h: 0.45, fontSize: 24, bold: true, color: st.color, align: 'center', fontFace: F });
        s.addText(st.label, { x: x + 0.1, y: 2.28, w: 2.8, h: 0.3, fontSize: 10.5, bold: true, color: C.white, align: 'center', fontFace: F });
        s.addText(st.sub, { x: x + 0.1, y: 2.58, w: 2.8, h: 0.3, fontSize: 9.5, color: C.muted, align: 'center', fontFace: F });
    });

    // Bottom pain points section
    s.addText('Pain Points We Solved', {
        x: 0.6, y: 3.12, w: 12.5, h: 0.38,
        fontSize: 15, bold: true, color: C.red, fontFace: F
    });

    const pains = [
        { icon: '●', text: 'Customers had zero visibility — had to call and hope for the best' },
        { icon: '●', text: 'Fake email registrations blocked genuine users from getting slots' },
        { icon: '●', text: 'Owners had no centralised view of who booked what and when' },
        { icon: '●', text: 'Revenue tracking done in notebooks or Excel — unreliable and error-prone' },
        { icon: '●', text: 'Sports clubs couldn\'t book recurring weekly slots systematically' },
        { icon: '●', text: 'Cash payments were hard to track; booking disputes were common' },
    ];

    const leftPains  = pains.slice(0, 3);
    const rightPains = pains.slice(3);

    [leftPains, rightPains].forEach((col, ci) => {
        let x = ci === 0 ? 0.6 : 6.85;
        col.forEach((p, pi) => {
            let y = 3.6 + pi * 0.58;
            s.addShape(pptx.shapes.OVAL, {
                x: x + 0.05, y: y + 0.12, w: 0.14, h: 0.14,
                fill: { color: C.red }, line: { color: C.red }
            });
            s.addText(p.text, {
                x: x + 0.28, y, w: 5.7, h: 0.48,
                fontSize: 11.5, color: C.light, fontFace: F
            });
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
    slideTitle(s, '🚀', "Where Can This Go Next?", 'Future scope — features already scoped for v2.0+', C.purple);

    const futures = [
        { icon: '📱', title: 'Mobile App',           desc: 'React Native / Flutter port.\nSame REST API, new native UX for iOS & Android.', color: C.cyan },
        { icon: '💸', title: 'Dynamic Pricing AI',   desc: 'AI-driven price adjustment.\nPeak hours / weather-based surge pricing.',          color: C.green },
        { icon: '🤖', title: 'Predictive Analytics', desc: 'ML models on booking history.\nPredict demand & suggest slot openings.',           color: C.purple },
        { icon: '🔔', title: 'Smart Notifications',  desc: 'WhatsApp / SMS / Email reminders.\nAuto-cancel unpaid slots in 10 min.',          color: C.yellow },
        { icon: '🏆', title: 'Loyalty & Subs',       desc: 'Weekly club memberships, reward\npoints, repeat booking community.',               color: C.red },
        { icon: '🗺️', title: 'Multi-City Marketplace',desc: 'Aggregator mode — list turfs\nfrom multiple cities, partner owners.',             color: C.cyan },
        { icon: '🔐', title: 'JWT Auth Upgrade',     desc: 'Full role-based JWT tokens:\nAdmin · Owner · Customer tiers.',                    color: C.purple },
        { icon: '💳', title: 'Live Payment Gateway', desc: 'Razorpay / Stripe live keys\nfor real INR transactions.',                          color: C.green },
    ];

    futures.forEach((f, i) => {
        let col = i % 4;
        let row = Math.floor(i / 4);
        let x = 0.6 + col * 3.2;
        let y = 1.3 + row * 2.1;

        gCard(s, x, y, 3.0, 1.9, f.color);

        // Icon with circle bg
        circle(s, x + 0.2, y + 0.18, 0.58, f.color + '25');
        s.addText(f.icon, { x: x + 0.2, y: y + 0.15, w: 0.58, h: 0.55, fontSize: 22, align: 'center', fontFace: F });

        s.addText(f.title, { x: x + 0.88, y: y + 0.2, w: 1.95, h: 0.36, fontSize: 12.5, bold: true, color: f.color, fontFace: F });
        s.addText(f.desc, { x: x + 0.2, y: y + 0.92, w: 2.65, h: 0.85, fontSize: 10.5, color: C.muted, fontFace: F });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 ─ Thank You
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);
    topBar(s, C.green);

    // Big decorative circles
    s.addShape(pptx.shapes.OVAL, { x: -1, y: -1, w: 6, h: 6, fill: { color: '0A1A12' }, line: { color: '0D2A1C', width: 1.5 } });
    s.addShape(pptx.shapes.OVAL, { x: 9.5, y: 3.5, w: 5, h: 5, fill: { color: '091A22' }, line: { color: '0D2030', width: 1 } });
    s.addShape(pptx.shapes.OVAL, { x: 5.5, y: 1.5, w: 7, h: 7, fill: { color: '13102A' }, line: { color: '1A1535', width: 1 } });

    // Central Thank You card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 1.5, y: 0.9, w: 10.5, h: 5.3,
        fill: { color: C.card }, rectRadius: 0.25,
        line: { color: C.green, width: 2 }
    });
    s.addShape(pptx.shapes.RECTANGLE, {
        x: 1.5, y: 0.9, w: 10.5, h: 0.08,
        fill: { color: C.green }, line: { color: C.green }
    });

    s.addText('🙏', { x: 1.5, y: 1.1, w: 10.5, h: 0.8, fontSize: 40, align: 'center', fontFace: F });

    s.addText('Thank You!', {
        x: 1.5, y: 1.9, w: 10.5, h: 1.3,
        fontSize: 68, bold: true, color: C.green, align: 'center', fontFace: F
    });

    s.addText('Open for Questions  🙋', {
        x: 1.5, y: 3.25, w: 10.5, h: 0.6,
        fontSize: 22, color: C.white, align: 'center', fontFace: F
    });

    // Divider
    s.addShape(pptx.shapes.RECTANGLE, {
        x: 3.5, y: 3.95, w: 6.5, h: 0.03,
        fill: { color: C.border }, line: { color: C.border }
    });

    s.addText('Turf Mate  ·  Java  ·  Spring Boot  ·  MongoDB  ·  AWS EC2', {
        x: 1.5, y: 4.08, w: 10.5, h: 0.38,
        fontSize: 13, color: C.muted, align: 'center', fontFace: F
    });

    s.addText('Email OTP Verification  ·  Real-Time Slot Booking  ·  Secure Cloud Deployment', {
        x: 1.5, y: 4.5, w: 10.5, h: 0.35,
        fontSize: 12, color: C.cyan, align: 'center', fontFace: F, italic: true
    });
}

// ─── Write File ──────────────────────────────────────────────────
const outFile = 'Turf_Management_Final.pptx';
pptx.writeFile({ fileName: outFile })
    .then(() => console.log(`✅  ${outFile}  generated successfully!`))
    .catch(err => console.error('Error:', err));
