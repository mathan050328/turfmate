const PptxGenJS = require('pptxgenjs');
const fs = require('fs');

let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';

// ─── Design Tokens ───────────────────────────────────────────────
const C = {
    bg:      '0A1128',
    card:    '1C2541',
    card2:   '162037',
    green:   '00FF88',
    blue:    '0096FF',
    yellow:  'F5C518',
    red:     'FF6B6B',
    white:   'F0F4F8',
    muted:   'A0AABF',
    border:  '2A3A5A',
};

const FONT = 'Calibri';

function bg(slide) { slide.background = { fill: C.bg }; }

function hLine(slide, y) {
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.7, y, w: 12, h: 0.03,
        fill: { color: C.blue }, line: { color: C.blue }
    });
}

function slideTitle(slide, title, sub) {
    bg(slide);
    slide.addText(title, {
        x: 0.7, y: 0.35, w: 11.9, h: 0.65,
        fontSize: 30, bold: true, color: C.green, fontFace: FONT
    });
    hLine(slide, 1.05);
    if (sub) {
        slide.addText(sub, {
            x: 0.7, y: 1.12, w: 11.9, h: 0.35,
            fontSize: 14, color: C.muted, fontFace: FONT, italic: true
        });
    }
}

function card(slide, x, y, w, h, borderColor) {
    slide.addShape(pptx.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: C.card },
        line: { color: borderColor || C.border, width: 1.2 }
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1 ─ Title
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);

    // Large background accent block
    s.addShape(pptx.shapes.RECTANGLE, {
        x: 0, y: 1.5, w: 13.33, h: 4.0,
        fill: { color: C.card }, line: { color: C.green, width: 2 }
    });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 1.5, w: 0.18, h: 4.0, fill: { color: C.green } });

    s.addText('PROJECT PRESENTATION', {
        x: 0.7, y: 0.3, w: 12, h: 0.5,
        fontSize: 14, color: C.muted, bold: true, fontFace: FONT, charSpacing: 4
    });

    s.addText('Turf Mate', {
        x: 0.55, y: 1.6, w: 12.5, h: 1.1,
        fontSize: 66, bold: true, color: C.green, fontFace: FONT
    });

    s.addText('Management System', {
        x: 0.55, y: 2.65, w: 12.5, h: 0.7,
        fontSize: 38, bold: true, color: C.white, fontFace: FONT
    });

    s.addText('A Full-Stack Web Platform for Real-Time Sports Turf Booking & Management\nwith Secure Email OTP Verification', {
        x: 0.55, y: 3.45, w: 12.0, h: 0.75,
        fontSize: 15, color: C.muted, fontFace: FONT
    });

    s.addText('Java  ·  Spring Boot  ·  MongoDB  ·  HTML/CSS/JS  ·  AWS EC2', {
        x: 0.55, y: 4.3, w: 12.0, h: 0.4,
        fontSize: 13, color: C.blue, fontFace: FONT, bold: true
    });

    s.addText("Bachelor's Final Year Project  |  2026", {
        x: 0.55, y: 4.75, w: 12.0, h: 0.35,
        fontSize: 12, color: C.muted, fontFace: FONT
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 ─ What Is This Project?
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'What Is This Project?', 'Understanding the Turf Management System');

    s.addText('The Idea Behind It', {
        x: 0.7, y: 1.55, w: 12, h: 0.38,
        fontSize: 18, bold: true, color: C.green, fontFace: FONT
    });

    s.addText(
        "Booking a sports turf today is still a phone-and-paper affair.\n" +
        "We built a platform that changes that — a centralized, real-time web application that digitizes every part of the process:\n\n" +
        "→  Customers browse available turfs at any time\n" +
        "→  They register with mandatory email OTP verification — ensuring only real users access the platform\n" +
        "→  They pick a slot and pay — all in one flow\n" +
        "→  Owners see their bookings live in real-time",
        {
            x: 0.7, y: 1.98, w: 5.8, h: 3.8,
            fontSize: 13, color: C.white, fontFace: FONT, valign: 'top'
        }
    );

    const icons = [
        { icon: '🔐', title: 'OTP Verification', sub: 'Email-verified accounts only\nNo fake registrations' },
        { icon: '📅', title: 'Live Booking', sub: 'Real-time slots\nZero double-bookings' },
        { icon: '📊', title: 'Analytics', sub: 'Revenue & utilisation\ndashboard for owners' },
    ];
    icons.forEach((ic, i) => {
        let x = 6.85 + (i % 2) * 3.1;
        let y = 1.55 + Math.floor(i / 2) * 2.0;
        if (i === 2) { x = 8.1; }
        card(s, x, y, 2.85, 1.7, C.blue);
        s.addText(ic.icon, { x, y: y + 0.1, w: 2.85, h: 0.5, fontSize: 24, align: 'center', fontFace: FONT });
        s.addText(ic.title, { x, y: y + 0.55, w: 2.85, h: 0.3, fontSize: 13, bold: true, color: C.green, align: 'center', fontFace: FONT });
        s.addText(ic.sub, { x, y: y + 0.88, w: 2.85, h: 0.7, fontSize: 11, color: C.muted, align: 'center', fontFace: FONT });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 ─ Tools & Technologies
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'Tools & Technologies Used', 'Each tool chosen for a specific reason — not just because it\'s popular');

    const tools = [
        { icon: '☕', name: 'Java 17', desc: 'Backend language. Strongly typed, mature ecosystem — reliable REST API development.' },
        { icon: '🍃', name: 'Spring Boot 3', desc: 'Rapid app framework. Handles HTTP, Dependency Injection, and mail sending with minimal boilerplate.' },
        { icon: '🍃', name: 'MongoDB', desc: 'NoSQL document store. Manages users, bookings, and OTP states flexibly without schema migrations.' },
        { icon: '📧', name: 'JavaMailSender', desc: 'SMTP email engine. Dispatches HTML OTP emails on registration. Falls back gracefully if SMTP is offline.' },
        { icon: '🌐', name: 'HTML5 / CSS3 / JS', desc: 'Pure vanilla frontend. Lightweight, glassmorphism UI with micro-animations — runs in any browser.' },
        { icon: '🔨', name: 'Maven', desc: 'Build tool. Manages all dependencies and packages the app into a single deployable JAR.' },
        { icon: '☁️', name: 'AWS EC2', desc: 'Cloud hosting. Ubuntu server running 24/7 as a systemd service — auto-restarts on crash or reboot.' },
        { icon: '🐙', name: 'GitHub', desc: 'Version control. Credentials excluded via .gitignore. CI-ready codebase with clean commit history.' },
    ];

    tools.forEach((t, i) => {
        let col = i % 2;
        let row = Math.floor(i / 2);
        let x = 0.7 + col * 6.25;
        let y = 1.55 + row * 1.25;

        card(s, x, y, 5.95, 1.1, C.border);
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 0.08, h: 1.1, fill: { color: C.green } });

        s.addText(t.icon + '  ' + t.name, {
            x: x + 0.2, y: y + 0.1, w: 5.5, h: 0.3,
            fontSize: 14, bold: true, color: C.green, fontFace: FONT
        });
        s.addText(t.desc, {
            x: x + 0.2, y: y + 0.45, w: 5.5, h: 0.58,
            fontSize: 11, color: C.muted, fontFace: FONT
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 ─ Similar Projects
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'Similar Projects in the Space', 'Where we stand in the landscape — and what we did differently');

    const projects = [
        {
            icon: '🏟️', name: 'Playo',
            desc: "India's biggest turf discovery & booking app. Mobile-first, city-wide venue listings, player matching.",
            gap: 'Gap: No mandatory email verification. No OTP flow. No turf-owner management portal.'
        },
        {
            icon: '⚽', name: 'Hudle',
            desc: 'Aggregator model focusing on discovery, reviews and social sports meetups. Good UX.',
            gap: 'Gap: Owners are just listings; no control over slot logic, pricing, or user verification.'
        },
        {
            icon: '🎟️', name: 'BookMyShow (Sports)',
            desc: 'Giant ticketing platform that added sports turfs. Huge reach but generic booking flow.',
            gap: 'Gap: One-size-fits-all; no white-label option and no built-in email OTP security layer.'
        },
        {
            icon: '🖥️', name: 'Custom CMS / Sheets',
            desc: 'Some grounds use WordPress + WooCommerce or Google Sheets for bookings — manual, error-prone.',
            gap: 'Gap: No real-time collision detection; double-bookings happen frequently. No auth system.'
        },
    ];

    projects.forEach((p, i) => {
        let col = i % 2;
        let row = Math.floor(i / 2);
        let x = 0.7 + col * 6.25;
        let y = 1.5 + row * 2.2;

        card(s, x, y, 5.95, 2.0, C.border);
        s.addText(p.icon + '  ' + p.name, {
            x: x + 0.2, y: y + 0.1, w: 5.5, h: 0.35,
            fontSize: 15, bold: true, color: C.blue, fontFace: FONT
        });
        s.addText(p.desc, {
            x: x + 0.2, y: y + 0.48, w: 5.5, h: 0.55,
            fontSize: 11, color: C.white, fontFace: FONT
        });
        s.addShape(pptx.shapes.RECTANGLE, { x: x + 0.2, y: y + 1.08, w: 5.55, h: 0.02, fill: { color: C.red } });
        s.addText(p.gap, {
            x: x + 0.2, y: y + 1.14, w: 5.5, h: 0.7,
            fontSize: 11, color: C.red, fontFace: FONT, italic: true
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 ─ Uniqueness
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'What Makes This Different?', "Features that set us apart — not just another CRUD app");

    const points = [
        { tick: '✅', text: 'Mandatory OTP Email Verification — every account is confirmed via a 6-digit code before first login' },
        { tick: '✅', text: 'Generic Email Domain Support — accepts Gmail, Outlook, Yahoo, and any corporate domain via regex validation' },
        { tick: '✅', text: 'SMTP Fallback Mode — if email delivery is offline, OTP is returned in response and auto-filled in UI for seamless testing' },
        { tick: '✅', text: 'Unverified Login Redirection — HTTP 403 on login auto-opens the OTP verification modal instead of a dead-end error' },
        { tick: '✅', text: 'Collision-free booking — slots are locked at the database level, not just in the UI' },
        { tick: '✅', text: 'Deployed on AWS EC2 as a systemd service — runs 24/7, auto-restarts on crash or reboot' },
        { tick: '✅', text: 'Credential-safe GitHub repo — application.properties excluded from git via .gitignore so secrets never leak' },
        { tick: '✅', text: 'Relative API URLs — frontend works on any server IP or domain without code changes after deployment' },
    ];

    points.forEach((p, i) => {
        let y = 1.55 + i * 0.62;
        card(s, 0.7, y, 12.0, 0.52, C.border);
        s.addText(p.tick + '  ' + p.text, {
            x: 0.9, y: y + 0.09, w: 11.6, h: 0.34,
            fontSize: 12.5, color: C.white, fontFace: FONT
        });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 ─ Necessity
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'Why Did This Need to Be Built?', 'Real problems we saw — and decided to solve');

    // Stats row
    const stats = [
        { icon: '📈', stat: 'Turf bookings growing 40%+ YoY', sub: 'Sports tourism boom in India' },
        { icon: '📞', stat: '70% of grounds still use phone calls', sub: 'Manual = errors + frustration' },
        { icon: '❌', stat: 'Double bookings every single week', sub: 'No system → conflict guaranteed' },
        { icon: '🚫', stat: 'Fake accounts abuse slot systems', sub: 'No verification = spam registrations' },
    ];

    stats.forEach((st, i) => {
        let x = 0.7 + i * 3.1;
        card(s, x, 1.55, 2.85, 1.6, C.blue);
        s.addText(st.icon, { x, y: 1.65, w: 2.85, h: 0.45, fontSize: 22, align: 'center', fontFace: FONT });
        s.addText(st.stat, { x: x + 0.1, y: 2.13, w: 2.65, h: 0.55, fontSize: 11, bold: true, color: C.yellow, align: 'center', fontFace: FONT });
        s.addText(st.sub, { x: x + 0.1, y: 2.7, w: 2.65, h: 0.35, fontSize: 10, color: C.muted, align: 'center', fontFace: FONT });
    });

    s.addText('The Real-World Pain Points We Addressed', {
        x: 0.7, y: 3.25, w: 12, h: 0.38,
        fontSize: 15, bold: true, color: C.green, fontFace: FONT
    });
    const pains = [
        '• Customers had zero visibility — had to call and hope for the best',
        '• Owners had no centralised view of who booked what and when',
        '• Fake email registrations blocked genuine users from getting slots',
        '• No digital record meant repeat customers got no advantage',
        '• Revenue tracking was done in notebooks or Excel — unreliable',
        '• Sports clubs couldn\'t book recurring weekly slots systematically',
    ];
    s.addText(pains.join('\n'), {
        x: 0.7, y: 3.68, w: 12, h: 2.0,
        fontSize: 12.5, color: C.white, fontFace: FONT, lineSpacingMultiple: 1.4
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 ─ Future Scope
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    slideTitle(s, 'Where Can This Go Next?', 'Future scope — features already scoped out for v2.0+');

    const futures = [
        { icon: '📱', title: 'Mobile App', desc: 'React Native / Flutter port. Same REST API, new native UX for iOS & Android.' },
        { icon: '💸', title: 'Dynamic Pricing AI', desc: 'AI-driven price adjustment. Peak hours / weekends / weather-based surge pricing.' },
        { icon: '🤖', title: 'Predictive Analytics', desc: 'ML models trained on booking history. Predict demand, suggest owners when to open more slots.' },
        { icon: '🔔', title: 'Smart Notifications', desc: 'WhatsApp / SMS / Email reminders. Auto-cancel & release slots if payment not done in 10 min.' },
        { icon: '🏆', title: 'Loyalty & Subscriptions', desc: 'Weekly club memberships, reward points. Encourage repeat bookings and build community.' },
        { icon: '🗺️', title: 'Multi-City Marketplace', desc: 'Aggregator mode — list turfs from multiple cities. Owners join as partners, platform earns commission.' },
        { icon: '🔐', title: 'JWT Authentication', desc: 'Upgrade to full stateless JWT tokens for role-based access: Admin · Owner · Customer.' },
        { icon: '💳', title: 'Live Payment Gateway', desc: 'Integrate Razorpay / Stripe live keys for real INR transactions and automated invoicing.' },
    ];

    futures.forEach((f, i) => {
        let col = i % 4;
        let row = Math.floor(i / 4);
        let x = 0.7 + col * 3.15;
        let y = 1.55 + row * 2.1;

        card(s, x, y, 2.9, 1.85, C.blue);
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 2.9, h: 0.06, fill: { color: C.green } });
        s.addText(f.icon, { x, y: y + 0.12, w: 2.9, h: 0.4, fontSize: 20, align: 'center', fontFace: FONT });
        s.addText(f.title, { x: x + 0.1, y: y + 0.55, w: 2.7, h: 0.32, fontSize: 12, bold: true, color: C.green, align: 'center', fontFace: FONT });
        s.addText(f.desc, { x: x + 0.1, y: y + 0.9, w: 2.7, h: 0.88, fontSize: 10, color: C.muted, align: 'center', fontFace: FONT });
    });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 ─ Thank You
// ════════════════════════════════════════════════════════════════
{
    let s = pptx.addSlide();
    bg(s);

    s.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.2, w: 12.5, h: 5.0,
        fill: { color: C.card }, line: { color: C.green, width: 2.5 }
    });
    s.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 0.2, h: 5.0, fill: { color: C.green } });

    s.addText('Thank You!', {
        x: 0.9, y: 1.7, w: 12.0, h: 1.1,
        fontSize: 64, bold: true, color: C.green, fontFace: FONT, align: 'center'
    });
    s.addText('Open for Questions  🙋', {
        x: 0.9, y: 2.95, w: 12.0, h: 0.55,
        fontSize: 24, color: C.white, fontFace: FONT, align: 'center'
    });

    s.addShape(pptx.shapes.RECTANGLE, { x: 2.5, y: 3.65, w: 8.5, h: 0.03, fill: { color: C.blue } });

    s.addText('Turf Mate  ·  Java  ·  Spring Boot  ·  MongoDB  ·  AWS EC2', {
        x: 0.9, y: 3.75, w: 12.0, h: 0.4,
        fontSize: 14, color: C.muted, fontFace: FONT, align: 'center'
    });

    s.addText('Email OTP Verification  ·  Real-Time Slot Booking  ·  Secure Deployment', {
        x: 0.9, y: 4.2, w: 12.0, h: 0.35,
        fontSize: 12, color: C.blue, fontFace: FONT, align: 'center', italic: true
    });
}

// ─── Write File ────────────────────────────────────────────────
pptx.writeFile({ fileName: 'Turf_Management_Updated.pptx' })
    .then(() => console.log('✅  Turf_Management_Updated.pptx generated successfully!'))
    .catch(err => console.error('Error:', err));
