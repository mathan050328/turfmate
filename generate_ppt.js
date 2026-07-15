const pptxgen = require('pptxgenjs');

// Initialize presentation
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Define Color Palette
const COLORS = {
    bg: '0A1128',       // Deep midnight blue
    card: '1C2541',     // Navy blue
    primary: '00FF88',  // Vibrant neon green
    secondary: '0096FF',// Cyan/Blue
    text: 'F0F4F8',     // Off-white
    muted: 'A0AABF',    // Muted grey-blue
    accent: 'DBF429'    // Neon yellow-green
};

// Helper: Apply Background to a slide
function applyBackground(slide) {
    slide.background = { fill: COLORS.bg };
}

// Helper: Add Title to a slide
function addSlideTitle(slide, titleText) {
    slide.addText(titleText, {
        x: 0.8,
        y: 0.5,
        w: 11.5,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: 'Arial'
    });
    
    // Add a thin accent line under title
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.8,
        y: 1.3,
        w: 4.0,
        h: 0.04,
        fill: { color: COLORS.secondary }
    });
}

// ==========================================
// SLIDE 1: Title Slide
// ==========================================
let slide1 = pptx.addSlide();
applyBackground(slide1);

// Title background decoration (accent card)
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 2.2,
    w: 11.7,
    h: 3.5,
    fill: { color: COLORS.card },
    line: { color: COLORS.primary, width: 2 }
});

slide1.addText("TURF MATE", {
    x: 1.2,
    y: 2.5,
    w: 11.0,
    h: 1.0,
    fontSize: 54,
    bold: true,
    color: COLORS.primary,
    fontFace: 'Arial',
    charSpacing: 2
});

slide1.addText("Next-Gen Turf Booking & Secure Verification System", {
    x: 1.2,
    y: 3.6,
    w: 11.0,
    h: 0.6,
    fontSize: 22,
    color: COLORS.secondary,
    fontFace: 'Arial',
    bold: true
});

slide1.addText("A modern web application featuring OTP-based email verification, generic email domain support, interactive slot management, and secure payments.", {
    x: 1.2,
    y: 4.3,
    w: 11.0,
    h: 1.0,
    fontSize: 14,
    color: COLORS.text,
    fontFace: 'Arial'
});

// ==========================================
// SLIDE 2: Necessity & Motivation
// ==========================================
let slide2 = pptx.addSlide();
applyBackground(slide2);
addSlideTitle(slide2, "Project Necessity");

// Left Column: The Problem
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.8,
    w: 5.5,
    h: 4.5,
    fill: { color: COLORS.card },
    line: { color: 'FF6B6B', width: 1 }
});
slide2.addText("THE PROBLEM", {
    x: 1.2,
    y: 2.0,
    w: 4.7,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: 'FF6B6B',
    fontFace: 'Arial'
});
slide2.addText([
    { text: "• Manual Booking Overhead: ", options: { bold: true, color: COLORS.text } },
    { text: "Ground bookings are often handled over phone calls or WhatsApp, leading to inefficiencies.\n\n", options: { color: COLORS.muted } },
    { text: "• Double-Booking Conflicts: ", options: { bold: true, color: COLORS.text } },
    { text: "Lack of real-time slot synchronization results in scheduling overlaps.\n\n", options: { color: COLORS.muted } },
    { text: "• Unverified Registrations: ", options: { bold: true, color: COLORS.text } },
    { text: "Spam accounts and fake emails abuse systems, exhausting slot reserves.", options: { color: COLORS.muted } }
], {
    x: 1.2,
    y: 2.6,
    w: 4.7,
    h: 3.5,
    fontSize: 13,
    fontFace: 'Arial'
});

// Right Column: The Solution
slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 7.0,
    y: 1.8,
    w: 5.5,
    h: 4.5,
    fill: { color: COLORS.card },
    line: { color: COLORS.primary, width: 1 }
});
slide2.addText("THE SOLUTION", {
    x: 7.4,
    y: 2.0,
    w: 4.7,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.primary,
    fontFace: 'Arial'
});
slide2.addText([
    { text: "• Automated Scheduling: ", options: { bold: true, color: COLORS.text } },
    { text: "Dynamic dashboard displaying real-time availability.\n\n", options: { color: COLORS.muted } },
    { text: "• Mandatory Verification: ", options: { bold: true, color: COLORS.text } },
    { text: "Registration triggers a 6-digit OTP verification email, locking out fake signups.\n\n", options: { color: COLORS.muted } },
    { text: "• Seamless Checkout Flow: ", options: { bold: true, color: COLORS.text } },
    { text: "Integrated reservation locking alongside mock payment confirmation.", options: { color: COLORS.muted } }
], {
    x: 7.4,
    y: 2.6,
    w: 4.7,
    h: 3.5,
    fontSize: 13,
    fontFace: 'Arial'
});

// ==========================================
// SLIDE 3: System Constraints
// ==========================================
let slide3 = pptx.addSlide();
applyBackground(slide3);
addSlideTitle(slide3, "System Constraints");

// Three horizontal cards representing Constraints
const constraints = [
    {
        title: "Database Consistency",
        desc: "Ensuring transaction isolation so that two users booking the exact same time slot simultaneously cannot double-book. Solved using atomic updates in MongoDB.",
        color: COLORS.secondary
    },
    {
        title: "Network Security",
        desc: "Mandatory secure verification before login. If SMTP email delivery fails, the app uses a safe local testing fallback rather than completely locking users out.",
        color: COLORS.accent
    },
    {
        title: "Generic Formats",
        desc: "No locked domains. Validation accepts any valid email (Gmail, Outlook, Yahoo, or custom corporate domains) using a robust regex validation engine.",
        color: COLORS.primary
    }
];

constraints.forEach((item, index) => {
    let xPos = 0.8 + (index * 4.0);
    slide3.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: 2.0,
        w: 3.7,
        h: 4.0,
        fill: { color: COLORS.card },
        line: { color: item.color, width: 1.5 }
    });
    
    slide3.addText(`0${index + 1}`, {
        x: xPos + 0.3,
        y: 2.3,
        w: 3.1,
        h: 0.5,
        fontSize: 28,
        bold: true,
        color: item.color,
        fontFace: 'Arial'
    });
    
    slide3.addText(item.title, {
        x: xPos + 0.3,
        y: 2.9,
        w: 3.1,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: COLORS.text,
        fontFace: 'Arial'
    });
    
    slide3.addText(item.desc, {
        x: xPos + 0.3,
        y: 3.4,
        w: 3.1,
        h: 2.3,
        fontSize: 12,
        color: COLORS.muted,
        fontFace: 'Arial'
    });
});

// ==========================================
// SLIDE 4: Tools Used & Purpose
// ==========================================
let slide4 = pptx.addSlide();
applyBackground(slide4);
addSlideTitle(slide4, "Tools & Technologies");

const tools = [
    { name: "Java 17 & Spring Boot", type: "Backend", purpose: "Powering robust REST API controllers, security configs, and email routing." },
    { name: "MongoDB", type: "Database", purpose: "NoSQL document store managing user profiles, bookings, and active OTP states." },
    { name: "HTML5 & CSS3 (Vanilla)", type: "Frontend", purpose: "Modern responsive styling with customized neon glows and micro-animations." },
    { name: "JavaMailSender (SMTP)", type: "Email Service", purpose: "Dispatches HTML format templates for OTP delivery and Welcome updates." },
    { name: "GitHub Version Control", type: "Collab/Git", purpose: "Securing codebase tracking and platform deployment versioning." },
    { name: "AWS EC2", type: "Hosting", purpose: "Deploying Spring Boot package live, keeping system online 24/7." }
];

tools.forEach((tool, idx) => {
    let row = Math.floor(idx / 2);
    let col = idx % 2;
    
    let xPos = 0.8 + (col * 5.9);
    let yPos = 1.8 + (row * 1.5);
    
    slide4.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.6,
        h: 1.2,
        fill: { color: COLORS.card }
    });
    
    slide4.addText(tool.name, {
        x: xPos + 0.2,
        y: yPos + 0.15,
        w: 3.5,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: COLORS.primary,
        fontFace: 'Arial'
    });
    
    slide4.addText(tool.type.toUpperCase(), {
        x: xPos + 3.8,
        y: yPos + 0.15,
        w: 1.6,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: COLORS.secondary,
        fontFace: 'Arial',
        align: 'right'
    });
    
    slide4.addText(tool.purpose, {
        x: xPos + 0.2,
        y: yPos + 0.5,
        w: 5.2,
        h: 0.6,
        fontSize: 11,
        color: COLORS.text,
        fontFace: 'Arial'
    });
});

// ==========================================
// SLIDE 5: Uniqueness
// ==========================================
let slide5 = pptx.addSlide();
applyBackground(slide5);
addSlideTitle(slide5, "What Makes Turf Mate Unique?");

const uniquePoints = [
    {
        title: "Intelligent SMTP Fallback Mode",
        desc: "If SMTP keys are missing or offline during development, the backend injects the OTP into the API response. The UI detects this and automatically populates the input fields, ensuring the flow is fully testable without blocking features."
    },
    {
        title: "Generic Validation Engine",
        desc: "Instead of limiting validation strictly to Outlook or Gmail, our custom regular-expression validation works dynamically with any standard email provider, corporate, or personal domain."
    },
    {
        title: "Automatic Verification Redirection",
        desc: "When a registered user attempts to sign in but has not yet verified their email, the app intercepts the HTTP 403 Forbidden response, opens the verification modal, and initiates a secure OTP prompt."
    }
];

uniquePoints.forEach((point, idx) => {
    let yPos = 1.8 + (idx * 1.5);
    
    slide5.addShape(pptx.shapes.RECTANGLE, {
        x: 0.8,
        y: yPos,
        w: 11.7,
        h: 1.2,
        fill: { color: COLORS.card },
        line: { color: COLORS.primary, width: 1 }
    });
    
    slide5.addText(point.title, {
        x: 1.1,
        y: yPos + 0.15,
        w: 11.1,
        h: 0.3,
        fontSize: 15,
        bold: true,
        color: COLORS.accent,
        fontFace: 'Arial'
    });
    
    slide5.addText(point.desc, {
        x: 1.1,
        y: yPos + 0.5,
        w: 11.1,
        h: 0.6,
        fontSize: 12,
        color: COLORS.text,
        fontFace: 'Arial'
    });
});

// ==========================================
// SLIDE 6: Similar Projects Analysis
// ==========================================
let slide6 = pptx.addSlide();
applyBackground(slide6);
addSlideTitle(slide6, "Similar Projects Comparison");

// Table Header
slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.8, w: 11.7, h: 0.5, fill: { color: COLORS.secondary }
});
slide6.addText("Feature Comparison", {
    x: 1.0, y: 1.9, w: 11.3, h: 0.3, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Arial'
});

// Draw a table for comparison
let rows = [
    ["Feature / Capability", "Turf Mate", "TurfTown / Playo", "Generic Templates"],
    ["Pre-Authentication Verification", "Mandatory (OTP-based email flow)", "Often optional or mobile OTP", "None or post-login"],
    ["SMTP Fallback Simulator", "Yes (auto-fills for offline tests)", "No (will fail if service is offline)", "No"],
    ["Domain Support", "Generic (All valid formats)", "Often restrictive signup", "Custom hardcoding"],
    ["Payment Integration", "Mock Payment checkout & booking states", "External gateways only", "Static booking cards"]
];

rows.forEach((row, rIdx) => {
    let yPos = 2.4 + (rIdx * 0.8);
    let isHeader = rIdx === 0;
    
    row.forEach((cell, cIdx) => {
        let xPos = 0.8 + (cIdx * 2.925);
        let width = 2.9255;
        
        slide6.addShape(pptx.shapes.RECTANGLE, {
            x: xPos,
            y: yPos,
            w: width,
            h: 0.7,
            fill: { color: isHeader ? COLORS.card : (rIdx % 2 === 0 ? COLORS.card : COLORS.bg) },
            line: { color: COLORS.card, width: 1 }
        });
        
        // Highlight Turf Mate column slightly
        let textColor = COLORS.text;
        if (cIdx === 1) {
            textColor = COLORS.primary;
        } else if (isHeader) {
            textColor = COLORS.secondary;
        }
        
        slide6.addText(cell, {
            x: xPos + 0.1,
            y: yPos + 0.1,
            w: width - 0.2,
            h: 0.5,
            fontSize: isHeader ? 12 : 11,
            bold: isHeader || cIdx === 1,
            color: textColor,
            fontFace: 'Arial'
        });
    });
});

// ==========================================
// SLIDE 7: Future Scope
// ==========================================
let slide7 = pptx.addSlide();
applyBackground(slide7);
addSlideTitle(slide7, "Future Scope");

const futures = [
    { title: "Gateway Integrations", desc: "Production checkout integrations using fully verified live Stripe, Razorpay, or PayPal gateways." },
    { title: "Interactive Map Routing", desc: "Locating nearest turfs via Google Maps API geolocation, displaying routing and travel duration." },
    { title: "Analytics & Owner Portal", desc: "Interactive charts showing booking trends, slot usage patterns, revenue summaries, and dashboard graphs." },
    { title: "Dynamic Pricing AI", desc: "Algorithm adjusts pricing based on demand, weather, and peak time schedules to optimize turf revenue." }
];

futures.forEach((item, index) => {
    let row = Math.floor(index / 2);
    let col = index % 2;
    
    let xPos = 0.8 + (col * 5.9);
    let yPos = 2.0 + (row * 2.0);
    
    slide7.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.6,
        h: 1.7,
        fill: { color: COLORS.card },
        line: { color: COLORS.secondary, width: 1.5 }
    });
    
    // Glowing corner badge
    slide7.addShape(pptx.shapes.RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 0.1,
        h: 1.7,
        fill: { color: COLORS.primary }
    });
    
    slide7.addText(item.title, {
        x: xPos + 0.3,
        y: yPos + 0.2,
        w: 5.0,
        h: 0.35,
        fontSize: 16,
        bold: true,
        color: COLORS.primary,
        fontFace: 'Arial'
    });
    
    slide7.addText(item.desc, {
        x: xPos + 0.3,
        y: yPos + 0.65,
        w: 5.0,
        h: 0.9,
        fontSize: 12,
        color: COLORS.muted,
        fontFace: 'Arial'
    });
});

// ==========================================
// SLIDE 8: Thank You
// ==========================================
let slide8 = pptx.addSlide();
applyBackground(slide8);

slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.5,
    w: 11.7,
    h: 4.2,
    fill: { color: COLORS.card },
    line: { color: COLORS.primary, width: 2 }
});

slide8.addText("THANK YOU", {
    x: 1.2,
    y: 2.2,
    w: 11.0,
    h: 0.8,
    fontSize: 54,
    bold: true,
    color: COLORS.primary,
    fontFace: 'Arial',
    align: 'center'
});

slide8.addText("Turf Booking & Secure Verification Platform", {
    x: 1.2,
    y: 3.2,
    w: 11.0,
    h: 0.4,
    fontSize: 18,
    color: COLORS.secondary,
    fontFace: 'Arial',
    align: 'center',
    bold: true
});

slide8.addText("Questions & Answers", {
    x: 1.2,
    y: 4.0,
    w: 11.0,
    h: 0.5,
    fontSize: 14,
    color: COLORS.text,
    fontFace: 'Arial',
    align: 'center'
});

// Save Presentation
pptx.writeFile({ fileName: "Turf_Management_Presentation.pptx" })
    .then(fileName => {
        console.log(`Presentation generated successfully: ${fileName}`);
    })
    .catch(err => {
        console.error("Error generating presentation:", err);
    });
