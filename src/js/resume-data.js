/* =============================================================================
   resume-data.js — Single source of truth for the Portfolio deck.
   Consumed by resume.js to render cards, the skills bento, and modals.

   Each experience object:
     slug        unique id
     modalId     deep-link hash (matches content/Professional/<slug>/<slug>.md)
     category    work | projects | education | certificates
     title, org, period, location, typeLabel
     heroImg     card front image + modal hero
     keywords[]  card front — short, no full sentences
     summary     card back (flip) — the full-sentence blurb
     highlights[] modal — key achievements
     tools[]     modal — Tools & Tech chips
     gallery[]   modal — { src, alt }
     docs[]      modal — { label, href, kind } ; ALL open in a new tab
   ========================================================================== */

const P = 'content/Professional/';

const EXPERIENCES = [
  /* ------------------------------------------------------------------ WORK */
  {
    slug: 'miru',
    modalId: 'exp-miru-modal',
    category: 'work',
    title: 'Development Engineer',
    org: 'Miru Smart Technologies',
    period: 'Sep 2023 – Apr 2024',
    location: 'Vancouver, BC',
    typeLabel: 'Engineering Co-op',
    heroImg: P + 'miru/miru_curing.jpg',
    keywords: ['Clean-Tech R&D', 'Plasma Curing', '$150K Grant'],
    summary: 'Independently ran an 8-month, $150K research grant at an electrochromic smart-window startup — validating a novel plasma curing process that cut a key manufacturing bottleneck by a projected 90%.',
    highlights: [
      'Independently managed an 8-month, $150,000 plasma-curing research grant from an uncertain experiment to a validated, repeatable process.',
      'Demonstrated a projected 90% reduction in a manufacturing bottleneck via Design of Experiments and SPC validation.',
      'Executed 6+ mechanical projects: glass inspection booths, precision heating rigs, and spectrometry testing stations.',
      'Owned full project lifecycle — BOM creation, hardware sourcing, SOP authoring, and preventative maintenance planning.',
      'Delivered monthly external reports and bi-weekly presentations to managers, stakeholders, and grant funders.'
    ],
    tools: ['SolidWorks', 'SolidWorks PDM', 'Design of Experiments (DoE)', 'Statistical Process Control (SPC)', 'BOM Creation', 'SOP Authoring', 'Technical Reporting'],
    gallery: [
      { src: P + 'miru/miru_curing.jpg', alt: 'Plasma curing research setup' },
      { src: P + 'miru/miru_curing_thermalcamera.jpg', alt: 'Thermal camera during plasma curing' },
      { src: P + 'miru/miru_curing_workingsample.jpg', alt: 'Working cured electrochromic device sample' },
      { src: P + 'miru/miru_greenlightbooth1.jpg', alt: 'Green-light inspection booth Felipe built' },
      { src: P + 'miru/miru_halfcell_commisioning.jpg', alt: 'Half-cell testing station commissioning' },
      { src: P + 'miru/miru_testingstation.jpg', alt: 'Spectrometry testing station' },
      { src: P + 'miru/miru_heatgun_stand.jpg', alt: 'Custom heat-gun stand' },
      { src: P + 'miru/miru_desk.jpg', alt: 'Felipe’s workspace at Miru' }
    ],
    docs: []
  },
  {
    slug: 'ledcor',
    modalId: 'exp-ledcor-modal',
    category: 'work',
    title: 'Project Controls Engineer',
    org: 'Ledcor — Trans Mountain Expansion',
    period: 'May 2023 – Aug 2023',
    location: 'Burnaby, BC',
    typeLabel: 'Engineering Co-op',
    heroImg: P + 'ledcor/ledcor_BT.jpg',
    keywords: ['$1.2B+ Megaproject', 'Change Orders', 'Site Reporting'],
    summary: 'Project controls on TMX’s $1.2B+ Burnaby Terminal — filing and securing approval on engineering change orders up to $200K while owning site-wide daily reporting.',
    highlights: [
      'Supported project controls on a $1.2B+ construction site (Burnaby Terminal, TMX pipeline expansion).',
      'Filed and secured stakeholder approval on change orders up to $200,000 from unforeseen construction challenges.',
      'Maintained site-wide daily reporting — documenting delays, safety items, personnel changes, and equipment usage.',
      'Coordinated with field engineers, foremen, and subcontractors to capture accurate progress data.',
      'Completed rigorous Ledcor safety training, operating with a safety-first mindset throughout.'
    ],
    tools: ['Project Controls', 'Change Order Management', 'Daily Site Reporting', 'Construction Documentation', 'Stakeholder Communication', 'Cross-Trade Coordination'],
    gallery: [
      { src: P + 'ledcor/ledcor_BT.jpg', alt: 'Burnaby Terminal overview' },
      { src: P + 'ledcor/ledcor1.jpg', alt: 'Trans Mountain Expansion construction site' },
      { src: P + 'ledcor/ledcor2.jpg', alt: 'Site construction detail' },
      { src: P + 'ledcor/ledcor3.jpg', alt: 'Site construction detail' },
      { src: P + 'ledcor/ledcor4.jpg', alt: 'Site construction detail' },
      { src: P + 'ledcor/ledcor_office.jpg', alt: 'Ledcor site office' }
    ],
    docs: []
  },
  {
    slug: '3d-printing',
    modalId: 'exp-3dprinting-modal',
    category: 'work',
    title: '3D Printing Shop Manager',
    org: 'UBC Faculty of Integrated Engineering',
    period: 'Mar 2023 – Dec 2023',
    location: 'Vancouver, BC',
    typeLabel: 'Work Experience',
    heroImg: P + '3d-printing/3d_studentproject.jpg',
    keywords: ['8+ Printer Farm', 'GD&T Advising', 'FDM + Resin'],
    summary: 'Ran the faculty’s 8+ machine FDM and resin printing farm — keeping printers at full uptime, diagnosing electromechanical failures, and coaching students on GD&T callouts to hit working assemblies with minimal reprints.',
    highlights: [
      'Maintained 8+ FDM and resin printers at full capacity for continuous student and faculty use.',
      'Diagnosed and repaired electromechanical failures across extruder, motion, and resin-cure systems.',
      'Advised students on GD&T callouts (press fits, clearance fits, datum features) for working assemblies with minimal reprints.',
      'Developed deep intuition for printability, support strategies, and tolerances across diverse geometries.',
      'Delivered parts on tight timelines aligned to academic project deadlines.'
    ],
    tools: ['FDM 3D Printing', 'Resin (SLA) Printing', 'Slicing Software', 'GD&T', 'Electromechanical Troubleshooting', 'Printer Calibration'],
    gallery: [
      { src: P + '3d-printing/3d_printedparts.jpg', alt: 'Batch of printed parts ready for pickup' },
      { src: P + '3d-printing/3d_printing2.jpg', alt: 'Printer farm in operation' },
      { src: P + '3d-printing/3d_printing3.jpg', alt: 'Printer maintenance detail' },
      { src: P + '3d-printing/3D_HUD_parts.jpg', alt: '3D-printed components for a student project' },
      { src: P + '3d-printing/3d_studentproject 2.jpg', alt: 'Student project part' },
      { src: P + '3d-printing/3d_failedprint.jpg', alt: 'Example failed print used for troubleshooting' }
    ],
    docs: []
  },
  {
    slug: 'jetski',
    modalId: 'exp-jetski-modal',
    category: 'work',
    title: 'Jetski Tour Guide',
    org: 'Vancouver Water Adventures',
    period: 'May 2025 – Aug 2025',
    location: 'Vancouver, BC',
    typeLabel: 'Work Experience',
    heroImg: P + 'jetski/jetski11.jpg',
    keywords: ['Group Leadership', 'Marine Safety', '5★ Reviews'],
    summary: 'Led guided jetski tours of up to 21 riders through Howe Sound — running real-time risk assessment in dynamic ocean conditions, on-water mechanical troubleshooting, and guest experience that earned repeated five-star reviews.',
    highlights: [
      'Led on-water tours of up to 21 jetskis simultaneously through Vancouver harbour and Howe Sound.',
      'Applied real-time risk assessment and proactive hazard recognition in dynamic marine conditions.',
      'Adapted tour approach across diverse international groups — varied skill levels, languages, and personalities.',
      'Performed corrective maintenance: clogged impellers, fluid checks, and on-water mechanical troubleshooting.',
      'Earned multiple five-star reviews citing safety, personality, and an unforgettable experience.'
    ],
    tools: ['Marine Safety Protocols', 'On-Water Risk Assessment', 'Group Leadership', 'Client Management', 'Impeller Maintenance', 'Pre-Launch Briefings'],
    gallery: [
      { src: P + 'jetski/jetski11.jpg', alt: 'Guided jetski tour' },
      { src: P + 'jetski/jetski_sunset.jpg', alt: 'Sunset jetski tour' },
      { src: P + 'jetski/jetski_lighthouse.jpg', alt: 'Tour passing the lighthouse' },
      { src: P + 'jetski/jetski_ripping.jpg', alt: 'High-speed jetski riding' },
      { src: P + 'jetski/jetski1.jpg', alt: 'Action tour photo' },
      { src: P + 'jetski/jetski2.jpg', alt: 'Tour in Howe Sound' }
    ],
    docs: [
      { label: 'Watch Tour Clip', href: P + 'jetski/jetski_vid.mp4', kind: 'video' }
    ]
  },

  /* -------------------------------------------------------------- PROJECTS */
  {
    slug: 'checkmate',
    modalId: 'exp-checkmate-modal',
    category: 'projects',
    title: 'CheckMATE — Autonomous Robotic Chessboard',
    org: 'UBC · IGEN 430 Capstone',
    period: 'Sep 2024 – Apr 2025',
    location: 'Vancouver, BC',
    typeLabel: '4th-Year Capstone · Best Project',
    heroImg: P + 'checkmate/checkmate_me.jpg',
    keywords: ['Best Capstone Award', 'Robotics', 'H-Bot Gantry'],
    summary: 'Led a cross-functional team to build a robotic chessboard that moves its own pieces via a hidden H-Bot gantry and electromagnet — voted Best Capstone Project by UBC faculty, peers, and public showcase attendees.',
    highlights: [
      'H-Bot gantry hitting 450 mm/s top speed and 600 mm/s² acceleration for smooth, fast piece motion.',
      '20 kg-force electromagnet coupling for reliable actuation and capture — no mechanical grippers.',
      'Handles every special move autonomously: castling, knight jumps, and capture with path rerouting.',
      'Designed a 3 mm low-friction epoxy playing surface that preserves a traditional board look over the gantry.',
      'Awarded Best Capstone Project at DAID (Design & Innovation Day) showcase.'
    ],
    tools: ['SolidWorks', 'H-Bot Gantry', 'Stepper Motors', 'GRBL / G-code', 'Electromagnets', 'Raspberry Pi', 'FDM 3D Printing', 'GD&T'],
    gallery: [
      { src: P + 'checkmate/checkmate_me.jpg', alt: 'Felipe at the CheckMATE board' },
      { src: P + 'checkmate/checkmate_team.jpg', alt: 'Full team at the DAID showcase' },
      { src: P + 'checkmate/chessboard1.jpg', alt: 'Playing surface detail' },
      { src: P + 'checkmate/pieces.jpg', alt: 'Neodymium-embedded chess pieces' },
      { src: P + 'checkmate/tensioning_gantry.jpg', alt: 'H-Bot gantry belt tensioning' },
      { src: P + 'checkmate/first_sketch.png', alt: 'Initial concept sketch' },
      { src: P + 'checkmate/watchscreen_checkmate.png', alt: 'Touchscreen UI' },
      { src: P + 'checkmate/checkmate_award.jpg', alt: 'Best Capstone award at DAID' }
    ],
    docs: [
      { label: 'Full Report', href: P + 'checkmate/Final Report - CheckMATE.pdf', kind: 'pdf' },
      { label: 'Project Poster', href: P + 'checkmate/checkmate_daid_poster.jpg', kind: 'poster' },
      { label: 'Build Video', href: P + 'checkmate/lasercutting_checkmate.mp4', kind: 'video' }
    ]
  },
  {
    slug: 'helmet-hud',
    modalId: 'exp-hud-modal',
    category: 'projects',
    title: 'Helmet Heads-Up Display',
    org: 'UBC · IGEN 330 Capstone',
    period: 'Sep 2022 – Apr 2023',
    location: 'Vancouver, BC',
    typeLabel: '3rd-Year Capstone',
    heroImg: P + 'helmet-hud/HUD_final.jpg',
    keywords: ['Near-Eye AR Optics', 'CAN BUS Telemetry', 'Formula Electric'],
    summary: 'Built a helmet-mounted augmented-reality HUD projecting live CAN BUS telemetry into a race driver’s field of view — engineering a custom bi-convex lens system that pushed the virtual image distance up by two orders of magnitude.',
    highlights: [
      'Virtual image distance increased by 2+ orders of magnitude via a custom bi-convex lens system (~300 mm vs. naked OLED).',
      'Compact helmet-mounted form factor with a magnetic Quick-Disconnect System compliant with Formula SAE safety standards.',
      'CAN BUS data capture with minimal latency to the driver display.',
      'Empirically validated the lens configuration with multiple test users — improved clarity and reduced eye strain.',
      'Iteratively benchmarked beam-splitter materials and coatings to minimize ghosting before finalizing.'
    ],
    tools: ['SolidWorks', 'Optical Combiners', 'Bi-Convex Lensing', 'Beam-Splitter', 'OLED Micro-Display', 'CAN BUS', 'FDM 3D Printing'],
    gallery: [
      { src: P + 'helmet-hud/HUD_final.jpg', alt: 'Final assembled HUD on the helmet' },
      { src: P + 'helmet-hud/HUD_closeup.png', alt: 'Close-up of the display module' },
      { src: P + 'helmet-hud/hud_exploded.png', alt: 'Exploded view of the opto-mechanical assembly' },
      { src: P + 'helmet-hud/HUD_visual.png', alt: 'Render of the HUD system' },
      { src: P + 'helmet-hud/hud_testingrig1.jpg', alt: 'Custom optical validation test rig' },
      { src: P + 'helmet-hud/hud_lensingtest.jpg', alt: 'Lensing system testing' },
      { src: P + 'helmet-hud/HUD_team.jpg', alt: 'Team with the completed HUD' }
    ],
    docs: [
      { label: 'Full Report', href: P + 'helmet-hud/HelmetHUD-Report.pdf', kind: 'pdf' },
      { label: 'Project Poster', href: P + 'helmet-hud/IGEN330_Poster_303_HelmetHUD.jpg', kind: 'poster' }
    ]
  },
  {
    slug: 'rc-boat',
    modalId: 'exp-rcboat-modal',
    category: 'projects',
    title: 'Autonomous Water-Testing RC Boat',
    org: 'UBC · IGEN 230 Capstone',
    period: 'Dec 2021 – Apr 2022',
    location: 'Vancouver, BC',
    typeLabel: '2nd-Year Capstone · Best Project',
    heroImg: P + 'rc-boat/Boat.jpg',
    keywords: ['Best Capstone Award', 'Fiberglass Hull', 'Autonomous Nav'],
    summary: 'Designed an autonomous fiberglass catamaran for water-quality monitoring in hazardous tailings ponds — hand-laying the composite hull over a 3D-printed mold and integrating GPS/IMU autonomous navigation. Awarded Best 2nd-Year Capstone.',
    highlights: [
      '80 × 56 × 21 cm fiberglass catamaran hull optimized for stability and payload capacity.',
      'Sensor winch capable of sampling to 50 m depth via a stepper-driven assembly.',
      'Full autonomous navigation with GPS + IMU + gyro via a flight-controller stack.',
      'Used a multi-part 3D-printed negative mold for lay-up — complex geometry without CNC tooling.',
      'Passed leak-testing, flotation trials, and controlled water-tank validation before full integration.'
    ],
    tools: ['SolidWorks', 'FDM 3D Printing (mold)', 'Fiberglass / Composite Layup', 'Vacuum Bagging', 'RC Electronics', 'GPS + IMU', 'Stepper-Driven Winch'],
    gallery: [
      { src: P + 'rc-boat/Boat.jpg', alt: 'Completed autonomous boat on the water' },
      { src: P + 'rc-boat/rc_boat_assembled.jpg', alt: 'Fully assembled catamaran' },
      { src: P + 'rc-boat/rc_boat_mold.jpg', alt: '3D-printed negative mold for the hull' },
      { src: P + 'rc-boat/fiberglass_layup.JPG', alt: 'Fiberglass layup process' },
      { src: P + 'rc-boat/post_cure_hull.jpg', alt: 'Hull after curing' },
      { src: P + 'rc-boat/assembly.jpg', alt: 'Electronics assembly' },
      { src: P + 'rc-boat/watertest.jpg', alt: 'Water-tank validation test' },
      { src: P + 'rc-boat/rc_boat_daid.jpg', alt: 'Boat displayed at DAID showcase' }
    ],
    docs: [
      { label: 'Full Report', href: P + 'rc-boat/Final Report.pdf', kind: 'pdf' },
      { label: 'Individual Logbook', href: P + 'rc-boat/Individual logbook.pdf', kind: 'pdf' },
      { label: 'Project Poster', href: P + 'rc-boat/Poster.jpg', kind: 'poster' }
    ]
  },
  {
    slug: 'ankle-box',
    modalId: 'exp-ankle-box-modal',
    category: 'projects',
    title: 'Ankle Box — Variable-Resistance Footrest',
    org: 'Ankle Box — Personal Project',
    period: 'Nov 2025 – Present',
    location: 'Vancouver, BC',
    typeLabel: 'Personal Design Project',
    heroImg: P + 'ankle-box/AnkleBOX.png',
    keywords: ['Mechanical Design', 'Pneumatic Clutching', 'DFM for 3D Print'],
    summary: 'A self-initiated desk footrest delivering 2-axis, bidirectional ankle-rehab resistance across three independently controlled surfaces from a single pneumatic actuator — via a custom gearing and selective-clutching assembly, optimized for tool-free 3D-printed assembly.',
    highlights: [
      '3 independently controlled resistance surfaces driven from a single pneumatic rotary actuator.',
      'Custom gearing + selective-clutching assembly enables tunable resistance without multiple actuators.',
      '4+ iterative printed revisions on critical load paths (gearing, clutch, shaft coupling).',
      'Optimized for FDM with DFM/DFA — tool-free assembly for non-technical end users.',
      'Applied GD&T to press-fit and tight-coupling interfaces, accounting for FDM layer orientation and shrinkage.'
    ],
    tools: ['OnShape', 'FDM 3D Printing', 'Pneumatic Rotary Actuator', 'Custom Gearing', 'Selective Clutching', 'GD&T', 'DFM/DFA', 'Stress Testing'],
    gallery: [
      { src: P + 'ankle-box/AnkleBOX.png', alt: 'Hero render of the Ankle Box assembly' },
      { src: P + 'ankle-box/anklebox transparent.png', alt: 'Transparent render showing internals' },
      { src: P + 'ankle-box/CAD gearing system.png', alt: 'Gearing system CAD detail' },
      { src: P + 'ankle-box/csketch anklebox.jpeg', alt: 'Concept sketch' },
      { src: P + 'ankle-box/Gearing system calculations.jpeg', alt: 'Hand calculations for the gearing' },
      { src: P + 'ankle-box/prototyping.jpeg', alt: 'Prototyping in progress' },
      { src: P + 'ankle-box/mechanical-prototype-v1.png', alt: 'First mechanical prototype' },
      { src: P + 'ankle-box/mechanical-prototype-v2.png', alt: 'Second mechanical prototype' }
    ],
    docs: [
      { label: 'Prototype v1 Video', href: P + 'ankle-box/1st prototype.mp4', kind: 'video' },
      { label: 'Prototype v2 Video', href: P + 'ankle-box/pv2-vid.mp4', kind: 'video' }
    ]
  },

  /* ------------------------------------------------------------- EDUCATION */
  {
    slug: 'ubc',
    modalId: 'exp-ubc-modal',
    category: 'education',
    title: 'BASc, Integrated Engineering',
    org: 'University of British Columbia',
    period: '2020 – May 2026',
    location: 'Vancouver, BC',
    typeLabel: 'Bachelor of Applied Science',
    heroImg: P + 'ubc/Grad_headshot.JPG',
    keywords: ['Mechanical Major', 'Electrical Minor', '3× Design Capstones'],
    summary: 'A cross-disciplinary BASc blending mechanical, electrical, and electromagnetic engineering — built around three year-long design capstones and graduating with a Mechanical major and Electrical / Electromagnetic minor.',
    highlights: [
      'Best 4th-Year Capstone Project — IGEN 430 (CheckMATE robotic chessboard, 2025).',
      'Best 2nd-Year Capstone Project — IGEN 230 (autonomous RC boat, 2022).',
      'Three year-long design capstones spanning robotics, AR optics, and autonomous vehicles.',
      'Coordinated International Exchange at the University of Sydney (Jul–Dec 2024).'
    ],
    tools: ['Mechanics of Materials', 'Heat Transfer', 'Machine Design', 'Systems & Control', 'Engineering Electromagnetics', 'FEA / ANSYS', 'Computer Vision', 'Engineering Economics'],
    gallery: [
      { src: P + 'ubc/Grad_headshot.JPG', alt: 'Felipe’s UBC graduation headshot' },
      { src: P + 'ubc/igen_logo.png', alt: 'Integrated Engineering program logo' },
      { src: P + 'ubc/ubc_eng_logo_red.jpg', alt: 'UBC Engineering logo' }
    ],
    docs: []
  },
  {
    slug: 'australia',
    modalId: 'exp-australia-modal',
    category: 'education',
    title: 'International Exchange — Mechanical Engineering',
    org: 'University of Sydney',
    period: 'Jul 2024 – Dec 2024',
    location: 'Sydney, Australia',
    typeLabel: 'UBC Go Global Exchange',
    heroImg: P + 'australia/opera.jpg',
    keywords: ['FEA (ANSYS)', 'Computer Vision', 'Global Mindset'],
    summary: 'A semester abroad at the University of Sydney through UBC Go Global — taking Finite Element Analysis, Computer Vision & Image Processing, and Manufacturing Engineering while adapting to a new academic and cultural environment.',
    highlights: [
      'Completed a full-semester exchange in a new academic system and cultural environment.',
      'Gained expertise in FEA (ANSYS), computer vision techniques, and manufacturing engineering internationally.',
      'Built a global mindset and independent problem-solving adapting to Sydney’s engineering pedagogy.'
    ],
    tools: ['Finite Element Analysis (AMME 3060)', 'Computer Vision & Image Processing (AMME 4710)', 'Manufacturing Engineering (MECH 2460)', 'ANSYS'],
    gallery: [
      { src: P + 'australia/opera.jpg', alt: 'Sydney Opera House' },
      { src: P + 'australia/usydcampus.jpg', alt: 'University of Sydney campus' },
      { src: P + 'australia/quadrangle.jpg', alt: 'The Quadrangle at the University of Sydney' },
      { src: P + 'australia/FEA.jpg', alt: 'Finite element analysis coursework in ANSYS' },
      { src: P + 'australia/computervision.jpg', alt: 'Computer vision coursework' },
      { src: P + 'australia/composite.jpg', alt: 'Manufacturing / composite lab' },
      { src: P + 'australia/bondipool.jpg', alt: 'Bondi ocean pool' },
      { src: P + 'australia/grouppic.jpg', alt: 'Group photo with exchange students' }
    ],
    docs: []
  },

  /* ---------------------------------------------------------- CERTIFICATES */
  {
    slug: 'fusion-cert',
    modalId: 'exp-fusioncert-modal',
    category: 'certificates',
    title: 'Intro to Fusion Energy & Plasma Physics',
    org: 'Princeton Plasma Physics Laboratory (PPPL)',
    period: 'June 2024',
    location: 'Princeton, NJ',
    typeLabel: 'Certificate · 2-Week Course',
    heroImg: P + 'fusion-cert/fusion_course_cert.png',
    keywords: ['Plasma Physics', 'Magnetic Confinement', 'Fusion Energy'],
    summary: 'An intensive 2-week course at PPPL covering magnetic confinement, tokamaks and stellarators, plasma dynamics, tritium systems, and the path to commercial fusion — which led me to publish a research article on fusion’s commercialization.',
    highlights: [
      'Completed an intensive 2-week residential course at PPPL — a leading global fusion research institution.',
      'Covered magnetic confinement (tokamaks & stellarators), plasma dynamics, NBI & microwave heating, and the tritium fuel cycle.',
      'Engaged directly with fusion-technology experts and researchers.',
      'Led to publishing a research article analyzing fusion’s commercialization path.'
    ],
    tools: ['Magnetic Confinement', 'Tokamaks & Stellarators', 'Plasma Dynamics', 'NBI & Microwave Heating', 'Tritium Fuel Cycle', 'Fusion Commercialization'],
    gallery: [
      { src: P + 'fusion-cert/fusion_course_cert.png', alt: 'Fusion energy course completion certificate' }
    ],
    docs: [
      { label: 'View Certificate', href: P + 'fusion-cert/fusion_course_cert.png', kind: 'poster' },
      { label: 'Read My Fusion Article', href: 'articles/fusion-energy-future.html', kind: 'link' }
    ]
  },
  {
    slug: 'wfr',
    modalId: 'exp-wfr-modal',
    category: 'certificates',
    title: 'Wilderness First Responder (WFR) — 80-Hour Course',
    org: 'Wilderness Medical Associates',
    period: 'May 2025',
    location: 'Field-Based Course',
    typeLabel: 'Certificate · 80-Hour',
    heroImg: P + 'wfr/wrf_certificate.jpg',
    keywords: ['80-Hour Cert', 'Remote Medicine', 'Emergency Response'],
    summary: 'The gold-standard 80-hour Wilderness First Responder certification — trained in remote patient assessment, trauma and environmental emergency management, and field evacuation, qualified to administer epinephrine and BLS CPR with an AED.',
    highlights: [
      'Earned WFR certification through 80 hours of intensive field-based training.',
      'Trained in remote patient assessment, trauma response, and environmental emergencies.',
      'Qualified to administer epinephrine, manage severe asthma, and provide BLS CPR with oxygen and AED.',
      'Rapid decision-making under high-stress conditions — transferable to engineering fieldwork.'
    ],
    tools: ['Patient Assessment', 'Trauma Response', 'Environmental Emergencies', 'Anaphylaxis / Epinephrine', 'BLS CPR + AED', 'Field Evacuation'],
    gallery: [
      { src: P + 'wfr/wrf_certificate.jpg', alt: 'Wilderness First Responder completion certificate' }
    ],
    docs: [
      { label: 'View Certificate', href: P + 'wfr/wrf_certificate.jpg', kind: 'poster' }
    ]
  },
  {
    slug: 'tech-stewardship',
    modalId: 'exp-techsteward-modal',
    category: 'certificates',
    title: 'Technology Stewardship Practice',
    org: 'Technology Stewardship Practice Program',
    period: 'May 2024',
    location: 'Online',
    typeLabel: 'Micro-Credential · 12-Hour',
    heroImg: P + 'tech-stewardship/Tech_stewardship.png',
    keywords: ['Responsible Innovation', 'Ethical Design', 'Sustainability'],
    summary: 'A 12-hour micro-credential on purposeful, inclusive, and regenerative technology stewardship — applying ethical and sustainable frameworks to how engineers steward emerging technologies and new ventures.',
    highlights: [
      'Trained in ethical frameworks for technology development and responsible innovation.',
      'Explored inclusive design, equitable access, and regenerative approaches to engineering.',
      'Built perspective on the engineer’s role as a steward of emerging technologies.'
    ],
    tools: ['Ethical Frameworks', 'Inclusive Design', 'Regenerative Innovation', 'Responsible Innovation', 'Societal Impact Assessment'],
    gallery: [
      { src: P + 'tech-stewardship/Tech_stewardship.png', alt: 'Technology Stewardship Practice certificate' }
    ],
    docs: [
      { label: 'View Certificate', href: P + 'tech-stewardship/Tech_stewardship.png', kind: 'poster' }
    ]
  },
  {
    slug: 'cse-2023',
    modalId: 'exp-cse-modal',
    category: 'certificates',
    title: 'Conference on Sustainability in Engineering',
    org: 'CSE 2023 · UBC',
    period: 'January 2023',
    location: 'Vancouver, BC',
    typeLabel: 'National Conference',
    heroImg: P + 'cse-2023/CSE-2023-Promo.png',
    keywords: ['43 Institutions', 'Sustainability', 'Case Competitions'],
    summary: 'A four-day national conference with 200+ delegates from 43 Canadian institutions — case competitions, panels, and workshops on integrating sustainability, equity, two-eyed seeing, and decolonization into engineering design.',
    highlights: [
      'One of 200+ student delegates from 43 Canadian institutions.',
      'Participated in hands-on sustainable-engineering workshops and case competitions.',
      'Explored two-eyed seeing, co-creation, and decolonization as engineering design frameworks.'
    ],
    tools: ['Sustainable Design', 'Two-Eyed Seeing', 'Community Co-Creation', 'Systems Thinking', 'Equity in Engineering'],
    gallery: [
      { src: P + 'cse-2023/CSE-2023-Promo.png', alt: 'CSE 2023 conference promotional image' }
    ]
  }
];

/* Category tab order + labels (desktop / mobile) --------------------------- */
const CATEGORIES = [
  { id: 'work',         label: 'Work Experience', short: 'Work' },
  { id: 'projects',     label: 'Projects',        short: 'Projects' },
  { id: 'education',    label: 'Education',        short: 'Education' },
  { id: 'certificates', label: 'Certificates',    short: 'Certificates' },
  { id: 'skills',       label: 'Skill Sets',      short: 'Skills' }
];

/* Skill Sets bento (from content/Professional/skill-set.md) ---------------- */
const SKILLS = {
  groups: [
    { title: 'CAD & Design Software', items: ['SolidWorks', 'SolidWorks PDM', 'OnShape', 'ANSYS / FEA', 'MATLAB', 'G-code Sender (GRBL)'] },
    { title: 'Design Methodology', items: ['GD&T', 'DFM / DFA', 'Rapid Prototyping', 'Stress Testing', 'Commissioning', 'Root Cause Analysis', 'Design of Experiments'] },
    { title: 'Manufacturing & Process', items: ['SPC', 'BOM Management', 'SOP Authoring', 'Preventative Maintenance', 'Lean (Kaizen)', 'Process Validation', 'Change Control (ECO/ECR)'] },
    { title: 'Fabrication & Prototyping', items: ['FDM Printing', 'Resin (SLA)', 'Laser Cutting', 'CNC', 'Waterjet', 'Composite / Fiberglass', 'Soldering', 'Power Tools'] },
    { title: 'Documentation & Reporting', items: ['Technical Reports', 'Grant & Audit Reports', 'Stakeholder Decks', 'Daily Site Reports', 'Change Order Docs'] },
    { title: 'Programming & Computing', items: ['Python', 'C / C++', 'MATLAB', 'HTML', 'CSS', 'JavaScript', 'Git / GitHub', 'Agentic Workflows'] },
    { title: 'Project Controls', items: ['Cost & Schedule Tracking', 'Change Orders (≤$200K)', 'Grant Management ($150K)', 'Cross-Trade Coordination', 'Stakeholder Reporting'] },
    { title: 'Languages', items: ['English — Fluent', 'Spanish — Native', 'Portuguese — Conversational', 'French — Conversational'], isLanguages: true }
  ]
};
