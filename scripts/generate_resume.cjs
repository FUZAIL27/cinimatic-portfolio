const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createResume() {
  const doc = await PDFDocument.create();
  
  // Embed standard fonts
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.06, 0.52, 0.78); // Blue / Cyan #0f84c7
  const darkColor = rgb(0.06, 0.09, 0.16); // #0f172a
  const grayColor = rgb(0.39, 0.45, 0.55); // #64748b
  const lightBgColor = rgb(0.97, 0.98, 0.99); // #f8fafc
  const borderColor = rgb(0.88, 0.91, 0.94); // #e2e8f0

  const width = 595.28; // A4 width in points
  const height = 841.89; // A4 height in points
  const margin = 36;
  const contentWidth = width - margin * 2;

  let page = doc.addPage([width, height]);
  let y = height - margin;

  function checkPageBreak(requiredHeight) {
    if (y - requiredHeight < margin) {
      page = doc.addPage([width, height]);
      y = height - margin;
    }
  }

  function drawSectionHeader(title) {
    checkPageBreak(32);
    y -= 10;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y: y,
      size: 11,
      font: fontBold,
      color: primaryColor,
    });
    y -= 4;
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: width - margin, y: y },
      thickness: 1,
      color: primaryColor,
    });
    y -= 12;
  }

  function drawWrappedText(text, x, maxWidth, fontSize, font, color, lineHeight = 13) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && n > 0) {
        checkPageBreak(lineHeight);
        page.drawText(line.trim(), { x, y, size: fontSize, font, color });
        line = words[n] + ' ';
        y -= lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim().length > 0) {
      checkPageBreak(lineHeight);
      page.drawText(line.trim(), { x, y, size: fontSize, font, color });
      y -= lineHeight;
    }
  }

  function drawBullet(text, x = margin + 10, maxWidth = contentWidth - 10) {
    checkPageBreak(14);
    page.drawText('•', { x: margin, y: y, size: 9, font: fontBold, color: primaryColor });
    drawWrappedText(text, x, maxWidth, 9, fontRegular, darkColor, 12);
    y -= 2;
  }

  // --- HEADER ---
  page.drawText('FUZAIL AHMED', {
    x: margin,
    y: y,
    size: 22,
    font: fontBold,
    color: darkColor,
  });
  y -= 16;

  page.drawText('Java Full Stack Developer | Enterprise ERP Developer', {
    x: margin,
    y: y,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });
  y -= 14;

  const contactText = 'Chennai, India  |  +91 9840843264  |  fuzailahmed2702@gmail.com  |  LinkedIn: linkedin.com/in/fuzail-ahmed27  |  GitHub: github.com/FUZAIL27';
  page.drawText(contactText, {
    x: margin,
    y: y,
    size: 8,
    font: fontRegular,
    color: grayColor,
  });
  y -= 8;

  page.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 0.75,
    color: borderColor,
  });
  y -= 6;

  // --- PROFESSIONAL SUMMARY ---
  drawSectionHeader('Professional Summary');
  const summary = "Accomplished Java Full Stack Developer and Enterprise ERP Developer with 1.5+ years of verified experience in developing scalable business systems, robust backend architectures, and high-performance reactive web applications. Currently engineering modular enterprise ERP platforms at Tech Solution (Dammam Branch, Saudi Arabia), delivering mission-critical workflows across SCM, Manufacturing Work Orders, CRM, HRM, Inventory, and Construction Management (CMS). Proficient in Java, Spring Boot microservices, REST APIs, Angular, React, TypeScript, MySQL, and Docker containerization.";
  drawWrappedText(summary, margin, contentWidth, 9, fontRegular, darkColor, 12.5);
  y -= 4;

  // --- PROFESSIONAL EXPERIENCE ---
  drawSectionHeader('Work Experience');

  // Role 1: Tech Solution
  checkPageBreak(20);
  page.drawText('Tech Solution — Full Stack Developer', {
    x: margin,
    y: y,
    size: 10.5,
    font: fontBold,
    color: darkColor,
  });
  const date1 = 'Sept 2025 – Present';
  const date1Width = fontBold.widthOfTextAtSize(date1, 9);
  page.drawText(date1, {
    x: width - margin - date1Width,
    y: y,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });
  y -= 12;

  page.drawText('Enterprise ERP System | Dammam Branch, Saudi Arabia (Off-shore / Chennai, India)', {
    x: margin,
    y: y,
    size: 8.5,
    font: fontItalic,
    color: grayColor,
  });
  y -= 12;

  drawBullet('Developing enterprise-grade ERP applications and modular business workflows for multinational operations.');
  drawBullet('Engineered high-performance Java and Spring Boot backend microservices with secure REST APIs and transactional MySQL persistence.');
  drawBullet('Developed dynamic, responsive user interface modules in Angular using TypeScript and PrimeNG for intuitive data table operations and business dashboards.');
  drawBullet('Implemented SCM & Manufacturing ERP workflows: Material Requisition Flow (MRF), Bill of Materials (BOM), Manufacturing Orders, and Work Orders.');
  drawBullet('Built real-time inventory management with automated stock availability validation, material receipt/issue, and stock transfers.');
  drawBullet('Contributed to CMS Construction Management features including Bill of Quantities (BOQ), Work Breakdown Structure (WBS), and project budget tracking.');
  drawBullet('Optimized database queries, indexes, and transactional boundaries in MySQL, ensuring high data consistency and zero production regressions.');
  drawBullet('Collaborated actively with cross-functional development teams during sprint planning, architectural reviews, and code refactoring.');
  y -= 6;

  // Role 2: CodSoft
  checkPageBreak(20);
  page.drawText('CodSoft — Web Development Intern', {
    x: margin,
    y: y,
    size: 10.5,
    font: fontBold,
    color: darkColor,
  });
  const date2 = 'July 2024 – Aug 2024';
  const date2Width = fontBold.widthOfTextAtSize(date2, 9);
  page.drawText(date2, {
    x: width - margin - date2Width,
    y: y,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });
  y -= 12;

  page.drawText('Remote  |  Web Engineering & Responsive Design', {
    x: margin,
    y: y,
    size: 8.5,
    font: fontItalic,
    color: grayColor,
  });
  y -= 12;

  drawBullet('Developed fully responsive web applications, interactive landing pages, and web utilities using HTML5, CSS3, JavaScript, and Bootstrap.');
  drawBullet('Implemented clean mobile-first architectures, dynamic DOM interactions, and ensured seamless cross-browser compatibility.');
  drawBullet('Utilized Git and GitHub for version control, collaborative code reviews, and project milestone deliveries.');
  y -= 4;

  // --- TECHNICAL SKILLS ---
  drawSectionHeader('Technical Skills');
  const skillsList = [
    { label: 'Backend Development', val: 'Java, Spring Boot, Microservices, REST APIs, JDBC, Hibernate/JPA, Node.js, Express.js' },
    { label: 'Frontend Development', val: 'Angular, React, TypeScript, JavaScript (ES6+), PrimeNG, HTML5, CSS3, Tailwind CSS, Bootstrap' },
    { label: 'Databases & Storage', val: 'MySQL, PostgreSQL, MongoDB, Database Indexing, Relational Schema Design, ACID Transactions' },
    { label: 'Enterprise & Tools', val: 'Git, GitHub, Docker, Postman, VS Code, Linux/Bash, ERP Business Workflow Implementation' },
    { label: 'AI & Intelligence', val: 'AI APIs (Claude, OpenAI, Gemini), Prompt Engineering, Generative AI Application Integration' }
  ];

  for (const s of skillsList) {
    checkPageBreak(14);
    page.drawText(s.label + ':', { x: margin, y: y, size: 8.5, font: fontBold, color: darkColor });
    const labelW = fontBold.widthOfTextAtSize(s.label + ': ', 8.5);
    drawWrappedText(s.val, margin + labelW, contentWidth - labelW, 8.5, fontRegular, darkColor, 11);
    y -= 1;
  }
  y -= 4;

  // --- KEY PROJECTS ---
  drawSectionHeader('Key Projects');

  const projects = [
    {
      title: 'Tech Solution Enterprise ERP System (Enterprise ERP Development)',
      link: 'Professional Enterprise ERP Experience (Company Confidential)',
      tech: 'Java, Spring Boot, Angular, TypeScript, MySQL, PrimeNG, REST APIs, Docker',
      desc: 'Comprehensive multi-module ERP platform managing SCM (MRF, BOM, Work Orders), CRM (Customer & Leads), HRM (Attendance, Leaves & Labor), Inventory (Stock Validation & Warehouses), and CMS (Construction BOQ & WBS).'
    },
    {
      title: 'International Real Estate Platform',
      link: 'Live: international-real-estate-full-mu.vercel.app  |  GitHub: github.com/FUZAIL27/International-real-estate-full.git',
      tech: 'Java, Spring Boot, Hibernate/JPA, MySQL/PostgreSQL, React, JWT Security',
      desc: 'Enterprise-grade property discovery and transaction system with Spring Boot backend services, role-based JWT security, multi-currency support, and dynamic property filter engine.'
    },
    {
      title: 'DocMind AI — Document Understanding & Chat Platform',
      link: 'Live: doc-ai-flax.vercel.app  |  GitHub: github.com/FUZAIL27/Doc-Ai.git',
      tech: 'React, Node.js, Express.js, AI APIs, Vector Context, Tailwind CSS',
      desc: 'AI document intelligence web app enabling natural language document querying, automated summarization, and key fact extraction with citations.'
    },
    {
      title: 'Sentinel Audit Dashboard — Enterprise Security Portal',
      link: 'Live: audit-dashboard12.vercel.app  |  GitHub: github.com/FUZAIL27/audit-dashboard.git',
      tech: 'React, TypeScript, Node.js, Express.js, MongoDB, TanStack Query, Zustand',
      desc: 'Mission-critical security observability dashboard providing real-time visibility into enterprise events, vulnerability scores, audit trails, and compliance metrics.'
    },
    {
      title: 'Pulse Social Dashboard — Analytics & Intelligence',
      link: 'Live: pulse-social-dashboard-chi.vercel.app  |  GitHub: github.com/FUZAIL27/pulse--Social-Dashboard.git',
      tech: 'React, TypeScript, Tailwind CSS, Chart.js, Zustand, REST APIs',
      desc: 'Interactive social analytics platform tracking real-time audience engagement, impressions, campaign metrics, and growth trends with intuitive data visualization.'
    },
    {
      title: 'Adventure Tourism — Destination Discovery & Booking Portal',
      link: 'Live: adventure-tourism2.vercel.app  |  GitHub: github.com/FUZAIL27/Adventure_Tourism2.git',
      tech: 'HTML5, CSS3, JavaScript, Responsive Design, Bootstrap',
      desc: 'Responsive travel booking portal featuring curated destination itineraries, dynamic travel package discovery, and seamless user booking workflows.'
    }
  ];

  for (const proj of projects) {
    checkPageBreak(30);
    page.drawText(proj.title, { x: margin, y: y, size: 9.5, font: fontBold, color: darkColor });
    y -= 11;
    page.drawText(proj.link, { x: margin, y: y, size: 7.5, font: fontRegular, color: primaryColor });
    y -= 10;
    page.drawText('Tech Stack: ' + proj.tech, { x: margin, y: y, size: 8, font: fontItalic, color: grayColor });
    y -= 10;
    drawWrappedText(proj.desc, margin, contentWidth, 8.5, fontRegular, darkColor, 11);
    y -= 5;
  }
  y -= 4;

  // --- EDUCATION ---
  drawSectionHeader('Education');
  
  checkPageBreak(24);
  page.drawText('Bachelor of Computer Applications (BCA)', { x: margin, y: y, size: 9.5, font: fontBold, color: darkColor });
  const bcaPeriod = '2022 – 2025';
  page.drawText(bcaPeriod, { x: width - margin - fontBold.widthOfTextAtSize(bcaPeriod, 8.5), y: y, size: 8.5, font: fontBold, color: primaryColor });
  y -= 11;
  page.drawText('University of Madras — Chennai, India (Graduated)', { x: margin, y: y, size: 8.5, font: fontRegular, color: grayColor });
  y -= 13;

  checkPageBreak(24);
  page.drawText('Online Master of Computer Applications (MCA)', { x: margin, y: y, size: 9.5, font: fontBold, color: darkColor });
  const mcaPeriod = '2025 – 2027';
  page.drawText(mcaPeriod, { x: width - margin - fontBold.widthOfTextAtSize(mcaPeriod, 8.5), y: y, size: 8.5, font: fontBold, color: primaryColor });
  y -= 11;
  page.drawText('Master Degree Program — Enterprise Systems & Distributed Architecture (Currently Pursuing)', { x: margin, y: y, size: 8.5, font: fontRegular, color: grayColor });
  y -= 14;

  // --- CERTIFICATIONS ---
  drawSectionHeader('Key Certifications');
  const certs = [
    'Foundations of Prompt Engineering (AWS)',
    'Claude 101 Certification (Anthropic)',
    'Microsoft 365 Security Foundations & Core Admin Controls (Microsoft)',
    'Data Analytics Job Simulation (Deloitte / Forage)',
    'Tata GenAI Powered Data Analytics Job Simulation (Tata / Forage)',
    'Java Programming Certification & MySQL Relational Database Management'
  ];
  for (const c of certs) {
    checkPageBreak(12);
    drawBullet(c);
  }

  const pdfBytes = await doc.save();
  const outputPath = path.resolve('public', 'Fuzail_Ahmed_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated professional PDF resume at: ' + outputPath);
}

createResume().catch(err => {
  console.error(err);
  process.exit(1);
});
