document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       GROWTECHAXON API
       ========================================================= */

    const API_URL =
        "https://growtechaxon-backend.onrender.com";


    /* =========================================================
       INTERNSHIP WEBSITE LINK
       =========================================================
       IMPORTANT:
       Later replace this URL with your internship website.
       ========================================================= */

    const INTERNSHIP_WEBSITE_URL =
        "YOUR_INTERNSHIP_WEBSITE_URL";


    /* =========================================================
       PRELOADER
       ========================================================= */

    const preloader =
        document.getElementById("preloader");


    function hidePreloader() {

        if (!preloader) return;

        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
        preloader.style.pointerEvents = "none";

    }


    window.addEventListener("load", () => {

        setTimeout(hidePreloader, 500);

    });


    setTimeout(hidePreloader, 3000);


    /* =========================================================
       HEADER
       ========================================================= */

    const header =
        document.getElementById("header");

    const backToTop =
        document.getElementById("backToTop");

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    function handleScroll() {

        if (window.scrollY > 50) {

            header?.classList.add("scrolled");

        } else {

            header?.classList.remove("scrolled");

        }


        if (window.scrollY > 500) {

            backToTop?.classList.add("show");

        } else {

            backToTop?.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        handleScroll
    );

    handleScroll();


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    function closeMobileMenu() {

        navMenu?.classList.remove("open");

        const icon =
            menuToggle?.querySelector("i");

        icon?.classList.remove("fa-xmark");

        icon?.classList.add("fa-bars");

    }


    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle("open");

            const icon =
                menuToggle.querySelector("i");


            if (
                navMenu?.classList.contains("open")
            ) {

                icon?.classList.remove(
                    "fa-bars"
                );

                icon?.classList.add(
                    "fa-xmark"
                );

            } else {

                icon?.classList.remove(
                    "fa-xmark"
                );

                icon?.classList.add(
                    "fa-bars"
                );

            }

        }
    );


    /* =========================================================
       PAGE DATA
       ========================================================= */

    const pageData = {

        home: {

            title: "Digital Solutions Built for Growth",

            description:
                "GrowtechAxon creates modern websites, applications and digital solutions that help businesses build a stronger digital presence.",

            content: createHomePage

        },

        about: {

            title: "About GrowtechAxon",

            description:
                "Technology, creativity and practical digital solutions focused on helping businesses and learners move forward.",

            content: createAboutPage

        },

        services: {

            title: "Our Services",

            description:
                "Professional technology and digital services designed around real business requirements.",

            content: createServicesPage

        },

        projects: {

            title: "Our Projects",

            description:
                "Explore selected digital products and solutions built by GrowtechAxon.",

            content: createProjectsPage

        },

        process: {

            title: "Our Process",

            description:
                "A clear and structured approach from initial discussion to final delivery.",

            content: createProcessPage

        },

        pricing: {

            title: "Pricing",

            description:
                "Flexible service packages that can be adapted to your project requirements.",

            content: createPricingPage

        },

        training: {

            title: "Training & Internship",

            description:
                "Learn practical technology skills from basic concepts to advanced project development.",

            content: createTrainingPage

        },

        team: {

            title: "Meet Our Team",

            description:
                "The people working behind GrowtechAxon's technology and digital solutions.",

            content: createTeamPage

        },

        contact: {

            title: "Let's Work Together",

            description:
                "Tell us about your project, idea or requirement and connect with GrowtechAxon.",

            content: createContactPage

        }

    };


    /* =========================================================
       ROUTER
       ========================================================= */

    const app =
        document.getElementById("app");


    function getCurrentRoute() {

        const hash =
            window.location.hash
                .replace("#", "")
                .trim()
                .toLowerCase();


        if (
            hash &&
            Object.prototype.hasOwnProperty.call(
                pageData,
                hash
            )
        ) {

            return hash;

        }


        return "home";

    }


    function updateActiveNavigation(route) {

        document
            .querySelectorAll(".nav-link")
            .forEach(link => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                    `#${route}`
                );

            });

    }


    function renderPage(route) {

        if (!pageData[route]) {
            route = "home";
        }


        closeMobileMenu();


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        updateActiveNavigation(route);


        app.innerHTML = "";


        const page =
            pageData[route].content();


        app.appendChild(page);


        initializePage(route);


        document.title =
            `${pageData[route].title} | GrowtechAxon`;

    }


    function routeChange() {

        renderPage(
            getCurrentRoute()
        );

    }


    window.addEventListener(
        "hashchange",
        routeChange
    );


    /* =========================================================
       PAGE INITIALIZATION
       ========================================================= */

    function initializePage(route) {

        initializeReveal();

        initializeCounters();

        initializeProjectFilters();

        initializeTrainingLevels();

        initializeContactForm();

        if (route === "team") {

            loadTeamMembers();

        }

    }


    /* =========================================================
       HOME PAGE
       ========================================================= */

    function createHomePage() {

        const section =
            document.createElement("div");

        section.className = "home-page";


        section.innerHTML = `

            <section class="hero">

                <div class="container hero-grid">

                    <div class="hero-content">

                        <span class="eyebrow">
                            <i class="fa-solid fa-bolt"></i>
                            Technology • Design • Growth
                        </span>

                        <h1>
                            Build Digital.
                            <span>Grow Smarter.</span>
                        </h1>

                        <p>
                            GrowtechAxon delivers modern web,
                            app and digital solutions for businesses
                            while helping students build practical
                            technology skills.
                        </p>

                        <div class="hero-buttons">

                            <a
                                href="#services"
                                class="btn btn-primary page-link"
                            >
                                Explore Services
                                <i class="fa-solid fa-arrow-right"></i>
                            </a>

                            <a
                                href="#projects"
                                class="btn btn-outline page-link"
                            >
                                View Projects
                            </a>

                        </div>

                    </div>


                    <div class="hero-visual">

                        <div class="hero-image">

                           <div class="hero-visual">

    <img
        src="images/side.png"
        alt="Developer working on laptop"
        loading="eager"
    >

    <div class="hero-visual-overlay">

        <i class="fas fa-code"></i>

        <span>
            Digital solutions that turn ideas into reality.
        </span>

    </div>

</div>

                        </div>

                    </div>

                </div>

            </section>


            <section class="page">

                <div class="container">

                    <div class="page-header">

                        <span class="eyebrow">
                            Why GrowtechAxon
                        </span>

                        <h2 class="page-title">
                            Built Around Your
                            <span>Goals</span>
                        </h2>

                        <p class="page-description">
                            We combine technology, design and
                            practical execution to create useful
                            digital experiences.
                        </p>

                    </div>


                    <div class="card-grid">

                        ${serviceMiniCard(
                            "fa-code",
                            "Modern Development",
                            "Responsive and scalable digital products built with modern development practices."
                        )}

                        ${serviceMiniCard(
                            "fa-pen-ruler",
                            "Clean Design",
                            "User-focused interfaces designed to be professional, clear and easy to use."
                        )}

                        ${serviceMiniCard(
                            "fa-graduation-cap",
                            "Practical Learning",
                            "Training and internship programs focused on hands-on technology skills."
                        )}

                    </div>

                </div>

            </section>


            <section class="page">

                <div class="container">

                    <div class="cta-box">

                        <h2>
                            Have a project in mind?
                        </h2>

                        <p>
                            Share your requirement with our team
                            and let's discuss the right solution.
                        </p>

                        <a
                            href="#contact"
                            class="btn btn-primary page-link"
                        >
                            Start a Project
                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </div>

            </section>
        `;


        return section;

    }


    function serviceMiniCard(icon, title, text) {

        return `

            <article class="card reveal-item">

                <div class="card-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>

                <h3>${title}</h3>

                <p>${text}</p>

            </article>

        `;

    }


    /* =========================================================
       ABOUT
       ========================================================= */

    function createAboutPage() {

        const section =
            createStandardPage(
                "about",
                "About GrowtechAxon",
                "Technology with a practical purpose."
            );


        section.querySelector(".page-body").innerHTML = `

            <div class="about-grid">

                <div class="about-content">

                    <span class="eyebrow">
                        Who We Are
                    </span>

                    <h2>
                        Creating Digital Solutions
                        <span>That Matter.</span>
                    </h2>

                    <p>
                        GrowtechAxon is focused on delivering
                        practical technology solutions for businesses,
                        startups, students and growing digital brands.
                    </p>

                    <p>
                        From websites and applications to UI/UX,
                        software solutions, training and internship
                        programs, our approach is centered around
                        useful technology and real-world execution.
                    </p>

                    <a
                        href="#contact"
                        class="btn btn-primary page-link"
                    >
                        Work With Us
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                </div>


                <div>

                    <div class="stats-grid">

                        ${statCard(
                            "10",
                            "Projects"
                        )}

                        ${statCard(
                            "5",
                            "Core Services"
                        )}

                        ${statCard(
                            "5",
                            "Training Tracks"
                        )}

                        ${statCard(
                            "100",
                            "Focused On Quality"
                        )}

                    </div>

                </div>

            </div>

        `;


        return section;

    }


    function statCard(number, label) {

        return `

            <div class="stat-card reveal-item">

                <strong
                    class="counter"
                    data-target="${number}"
                >
                    0
                </strong>

                <span>${label}</span>

            </div>

        `;

    }


    /* =========================================================
       SERVICES
       ========================================================= */

    function createServicesPage() {

        const section =
            createStandardPage(
                "services",
                "Our Services",
                "Technology solutions for modern businesses."
            );


        const services = [

            [
                "fa-code",
                "Web Development",
                "Responsive, modern and scalable websites for businesses and organizations.",
                [
                    "Business Websites",
                    "Landing Pages",
                    "Web Applications",
                    "Frontend & Backend"
                ]
            ],

            [
                "fa-mobile-screen-button",
                "App Development",
                "Mobile application solutions designed around practical user requirements.",
                [
                    "Android Applications",
                    "Application UI",
                    "API Integration",
                    "Backend Integration"
                ]
            ],

            [
                "fa-pen-ruler",
                "UI / UX Design",
                "Professional interfaces designed for clarity, usability and modern branding.",
                [
                    "Website UI",
                    "Mobile UI",
                    "User Flow",
                    "Responsive Design"
                ]
            ],

            [
                "fa-laptop-code",
                "Software Development",
                "Custom digital systems and software solutions for specific business requirements.",
                [
                    "Custom Software",
                    "Database Systems",
                    "API Development",
                    "Business Tools"
                ]
            ],

            [
                "fa-chart-line",
                "Digital Solutions",
                "Technology-driven solutions to improve digital presence and business workflows.",
                [
                    "Digital Presence",
                    "Automation",
                    "System Integration",
                    "Technical Support"
                ]
            ],

            [
                "fa-graduation-cap",
                "Training & Internship",
                "Practical learning programs from programming fundamentals to project development.",
                [
                    "Web Development",
                    "App Development",
                    "C / Python / Java",
                    "Internship Programs"
                ]
            ]

        ];


        section.querySelector(".page-body").innerHTML = `

            <div class="card-grid">

                ${services.map(
                    (service, index) => `

                        <article
                            class="card service-card reveal-item"
                        >

                            <span class="service-number">
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <div class="card-icon">

                                <i class="fa-solid ${service[0]}"></i>

                            </div>

                            <h3>
                                ${service[1]}
                            </h3>

                            <p>
                                ${service[2]}
                            </p>

                            <ul>

                                ${service[3].map(
                                    item =>
                                        `<li>${item}</li>`
                                ).join("")}

                            </ul>

                        </article>

                    `
                ).join("")}

            </div>

        `;


        return section;

    }


    /* =========================================================
       PROJECTS
       ========================================================= */

    function createProjectsPage() {

        const section =
            createStandardPage(
                "projects",
                "Our Projects",
                "Selected digital products and solutions."
            );


        section.querySelector(".page-body").innerHTML = `

            <div class="filter-bar">

                <button
                    class="filter-btn active"
                    data-filter="all"
                >
                    All
                </button>

                <button
                    class="filter-btn"
                    data-filter="online-exam"
                >
                    Online Exam
                </button>

                <button
                    class="filter-btn"
                    data-filter="ecommerce"
                >
                    E-Commerce
                </button>

                <button
                    class="filter-btn"
                    data-filter="portfolio"
                >
                    Portfolio
                </button>

                <button
                    class="filter-btn"
                    data-filter="landing"
                >
                    Landing Page
                </button>

            </div>


            <div class="card-grid project-grid">

                <article
                    class="card project-card reveal-item"
                    data-category="online-exam"
                >

                <div class="project-image">
                    <img
                        src="images/test.png"
                        alt="Online Exam System"
                    >
                </div>

                    <div class="project-info">

                        <h3>
                            Online Exam System
                        </h3>

                        <p>
                            A web-based examination platform
                            designed for online tests and assessments.
                        </p>

                        <a
                            href="https://growtechaxon-exam-system.onrender.com/t"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            Visit Project
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>

                    </div>

                </article>


                <article
                    class="card project-card reveal-item"
                    data-category="portfolio"
                >

                    <div class="project-image">
                     <img
                    src="images/portfolio.png"
                          alt="Portfolio Website"
                     >       
                    </div>

                    <div class="project-info">

                        <h3>
                            Portfolio Website
                        </h3>

                        <p>
                            A professional portfolio experience
                            focused on presenting skills and projects.
                        </p>

                        <a
                            href="https://growtechaxon-frontend.onrender.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            Visit Project
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>

                    </div>

                </article>


                <article
                    class="card project-card reveal-item"
                    data-category="ecommerce"
                >

                    <div class="project-image">

                        <i class="fa-solid fa-cart-shopping"></i>

                    </div>

                    <div class="project-info">

                        <h3>
                            E-Commerce Solution
                        </h3>

                        <p>
                            A scalable concept for online stores,
                            product management and digital selling.
                        </p>

                        <a
                            href="#contact"
                            class="project-link page-link"
                        >
                            Discuss Project
                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </article>


                <article
                    class="card project-card reveal-item"
                    data-category="landing"
                >

                    <div class="project-image">

                        <i class="fa-solid fa-window-maximize"></i>

                    </div>

                    <div class="project-info">

                        <h3>
                            Business Landing Page
                        </h3>

                        <p>
                            Conversion-focused landing page
                            concepts for businesses and campaigns.
                        </p>

                        <a
                            href="#contact"
                            class="project-link page-link"
                        >
                            Discuss Project
                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                    </div>

                </article>

            </div>

        `;


        return section;

    }


    /* =========================================================
       PROCESS
       ========================================================= */

    function createProcessPage() {

        const section =
            createStandardPage(
                "process",
                "Our Process",
                "A structured path from idea to implementation."
            );


        const steps = [

            [
                "01",
                "Discover",
                "We understand your goals, requirements and project expectations."
            ],

            [
                "02",
                "Plan",
                "We define the structure, technology, scope and execution approach."
            ],

            [
                "03",
                "Design",
                "We create a clear user experience and visual direction."
            ],

            [
                "04",
                "Develop",
                "The product is developed, integrated and tested."
            ],

            [
                "05",
                "Launch",
                "After final checks, the project is prepared for delivery."
            ]

        ];


        section.querySelector(".page-body").innerHTML = `

            <div class="process-grid">

                ${steps.map(
                    step => `

                        <article
                            class="card process-step reveal-item"
                        >

                            <div class="process-number">
                                ${step[0]}
                            </div>

                            <h3>
                                ${step[1]}
                            </h3>

                            <p>
                                ${step[2]}
                            </p>

                        </article>

                    `
                ).join("")}

            </div>

        `;


        return section;

    }


    /* =========================================================
       PRICING
       ========================================================= */

    function createPricingPage() {

        const section =
            createStandardPage(
                "pricing",
                "Pricing",
                "Choose a starting package and discuss your exact requirements."
            );


        section.querySelector(".page-body").innerHTML = `

            <div class="card-grid">

                <article class="card pricing-card reveal-item">

                    <h3>
                        Starter
                    </h3>

                    <p>
                        For individuals and small requirements.
                    </p>

                    <div class="price">
                        Custom
                        <small>/ quote</small>
                    </div>

                    <ul class="pricing-list">

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Requirement discussion
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Responsive design
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Basic development
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Project support
                        </li>

                    </ul>

                    <a
                        href="#contact"
                        class="btn btn-outline page-link"
                    >
                        Request Quote
                    </a>

                </article>


                <article
                    class="card pricing-card featured reveal-item"
                >

                    <span class="pricing-badge">
                        Popular
                    </span>

                    <h3>
                        Business
                    </h3>

                    <p>
                        For growing businesses and digital brands.
                    </p>

                    <div class="price">
                        Custom
                        <small>/ quote</small>
                    </div>

                    <ul class="pricing-list">

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Complete planning
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Professional UI/UX
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Web development
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Backend/API integration
                        </li>

                    </ul>

                    <a
                        href="#contact"
                        class="btn btn-primary page-link"
                    >
                        Start a Project
                    </a>

                </article>


                <article class="card pricing-card reveal-item">

                    <h3>
                        Custom
                    </h3>

                    <p>
                        For advanced and specialized requirements.
                    </p>

                    <div class="price">
                        Custom
                        <small>/ quote</small>
                    </div>

                    <ul class="pricing-list">

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Custom architecture
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Advanced features
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Custom integrations
                        </li>

                        <li>
                            <i class="fa-solid fa-check"></i>
                            Technical consultation
                        </li>

                    </ul>

                    <a
                        href="#contact"
                        class="btn btn-outline page-link"
                    >
                        Discuss Requirement
                    </a>

                </article>

            </div>

        `;


        return section;

    }


    /* =========================================================
       TRAINING
       ========================================================= */

    function createTrainingPage() {

        const section =
            createStandardPage(
                "training",
                "Training & Internship",
                "Build skills. Build projects. Build your future."
            );


        section.querySelector(".page-body").innerHTML = `

            <div class="training-hero">

                <div class="training-banner">

                    <span class="eyebrow">
                        <i class="fa-solid fa-graduation-cap"></i>
                        Training Programs
                    </span>

                    <h2>
                        Learn Technology
                        <span>Step by Step.</span>
                    </h2>

                    <p>
                        Our training structure is designed for learners
                        starting from fundamentals and progressing toward
                        practical projects and advanced development.
                    </p>

                    <div class="hero-buttons">

                        <a
                            href="#contact"
                            class="btn btn-primary page-link"
                        >
                            Enquire About Training
                        </a>

                    </div>

                </div>


                <div class="summer-card">

                    <i class="fa-solid fa-sun"></i>

                    <h3>
                        Summer Training
                    </h3>

                    <p>
                        Practical summer training programs for students
                        who want to strengthen their programming,
                        development and project-building skills.
                    </p>

                </div>

            </div>


            <div>

                <div class="page-header">

                    <span class="eyebrow">
                        Programs
                    </span>

                    <h2 class="page-title">
                        Choose Your
                        <span>Technology Track</span>
                    </h2>

                </div>


                <div class="card-grid">

                    ${courseCard(
                        "fa-code",
                        "Web Development",
                        "HTML, CSS, JavaScript and modern full-stack development."
                    )}

                    ${courseCard(
                        "fa-mobile-screen",
                        "App Development",
                        "Application fundamentals, UI, APIs, databases and projects."
                    )}

                    ${courseCard(
                        "fa-c",
                        "C Programming",
                        "Programming fundamentals, problem solving and data structures."
                    )}

                    ${courseCard(
                        "fa-python",
                        "Python",
                        "Python programming, OOP, automation, APIs and applications."
                    )}

                    ${courseCard(
                        "fa-java",
                        "Java",
                        "Java fundamentals, OOP, collections, databases and backend concepts."
                    )}

                    ${courseCard(
                        "fa-layer-group",
                        "Full Stack",
                        "Frontend, backend, databases, APIs and complete web projects."
                    )}

                </div>

            </div>


            <div class="course-levels">

                <div class="page-header">

                    <span class="eyebrow">
                        Learning Levels
                    </span>

                    <h2 class="page-title">
                        Basic to
                        <span>Advanced</span>
                    </h2>

                    <p class="page-description">
                        Select a level to explore the type of topics
                        covered at that stage.
                    </p>

                </div>


                <div class="level-tabs">

                    <button
                        class="level-btn active"
                        data-level="basic"
                    >
                        Basic
                    </button>

                    <button
                        class="level-btn"
                        data-level="intermediate"
                    >
                        Intermediate
                    </button>

                    <button
                        class="level-btn"
                        data-level="advanced"
                    >
                        Advanced
                    </button>

                </div>


                <div
                    class="level-content active"
                    data-level-content="basic"
                >

                    ${syllabusCard(
                        "Web Development",
                        [
                            "HTML & CSS fundamentals",
                            "Responsive design",
                            "JavaScript basics",
                            "Git & GitHub basics"
                        ]
                    )}

                    ${syllabusCard(
                        "App Development",
                        [
                            "Programming fundamentals",
                            "Application structure",
                            "Basic UI development",
                            "Basic project development"
                        ]
                    )}

                    ${syllabusCard(
                        "C Programming",
                        [
                            "Variables & data types",
                            "Operators",
                            "Conditions",
                            "Loops & functions"
                        ]
                    )}

                    ${syllabusCard(
                        "Python",
                        [
                            "Python syntax",
                            "Variables",
                            "Conditions & loops",
                            "Functions"
                        ]
                    )}

                    ${syllabusCard(
                        "Java",
                        [
                            "Java fundamentals",
                            "Variables & data types",
                            "Conditions & loops",
                            "Methods"
                        ]
                    )}

                </div>


                <div
                    class="level-content"
                    data-level-content="intermediate"
                >

                    ${syllabusCard(
                        "Web Development",
                        [
                            "Advanced JavaScript",
                            "DOM & APIs",
                            "Frontend frameworks",
                            "Intermediate projects"
                        ]
                    )}

                    ${syllabusCard(
                        "App Development",
                        [
                            "Navigation",
                            "API integration",
                            "Database concepts",
                            "Authentication"
                        ]
                    )}

                    ${syllabusCard(
                        "C Programming",
                        [
                            "Arrays & strings",
                            "Pointers",
                            "Structures",
                            "File handling"
                        ]
                    )}

                    ${syllabusCard(
                        "Python",
                        [
                            "OOP",
                            "Modules",
                            "File handling",
                            "APIs & databases"
                        ]
                    )}

                    ${syllabusCard(
                        "Java",
                        [
                            "OOP",
                            "Collections",
                            "Exception handling",
                            "JDBC basics"
                        ]
                    )}

                </div>


                <div
                    class="level-content"
                    data-level-content="advanced"
                >

                    ${syllabusCard(
                        "Web Development",
                        [
                            "React",
                            "Node.js & Express",
                            "REST APIs",
                            "Database & full-stack projects"
                        ]
                    )}

                    ${syllabusCard(
                        "App Development",
                        [
                            "Production-ready application concepts",
                            "Backend integration",
                            "Deployment",
                            "Real-world projects"
                        ]
                    )}

                    ${syllabusCard(
                        "C Programming",
                        [
                            "Data structures",
                            "Advanced problem solving",
                            "Memory concepts",
                            "Advanced projects"
                        ]
                    )}

                    ${syllabusCard(
                        "Python",
                        [
                            "Automation",
                            "Advanced applications",
                            "Web development",
                            "Real-world projects"
                        ]
                    )}

                    ${syllabusCard(
                        "Java",
                        [
                            "Advanced Java",
                            "Backend development",
                            "Database integration",
                            "APIs & projects"
                        ]
                    )}

                </div>

            </div>


            <div class="internship-box">

                <span class="eyebrow">
                    Internship Program
                </span>

                <h2>
                    Learn Through Practical Experience
                </h2>

                <p>
                    Explore internship opportunities, program details,
                    application information and practical learning
                    resources through our internship portal.
                </p>

                <!--
                    PASTE YOUR INTERNSHIP WEBSITE LINK HERE
                    Replace YOUR_INTERNSHIP_WEBSITE_URL in script.js
                -->

                <a
                    id="internshipPortalLink"
                    href="${INTERNSHIP_WEBSITE_URL}"
                    class="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Internship Portal
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>

            </div>

        `;


        return section;

    }


    function courseCard(icon, title, description) {

        return `

            <article class="card reveal-item">

                <div class="card-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

            </article>

        `;

    }


    function syllabusCard(title, items) {

        return `

            <article class="syllabus-card">

                <h3>
                    ${title}
                </h3>

                <ul>

                    ${items.map(
                        item =>
                            `<li>${item}</li>`
                    ).join("")}

                </ul>

            </article>

        `;

    }


    /* =========================================================
       TEAM
       ========================================================= */

    function createTeamPage() {

        const section =
            createStandardPage(
                "team",
                "Meet Our Team",
                "Our team members will be loaded from the GrowtechAxon backend."
            );


        section.querySelector(".page-body").innerHTML = `

            <div
                class="team-grid"
                id="teamGrid"
            >

                <div class="team-empty">
                    Loading team members...
                </div>

            </div>

        `;


        return section;

    }


    /* =========================================================
       CONTACT
       ========================================================= */

    function createContactPage() {

        const section =
            createStandardPage(
                "contact",
                "Let's Work Together",
                "Have a project, business requirement or learning enquiry? Get in touch."
            );


        section.querySelector(".page-body").innerHTML = `

            <div class="contact-grid">

                <div class="contact-info">

                    <div class="contact-item">

                        <div class="contact-item-icon">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>

                        <div>

                            <h4>
                                Location
                            </h4>

                            <span>
                                Lucknow, Uttar Pradesh, India
                            </span>

                        </div>

                    </div>


                    <div class="contact-item">

                        <div class="contact-item-icon">
                            <i class="fa-solid fa-phone"></i>
                        </div>

                        <div>

                            <h4>
                                Phone
                            </h4>

                            <a href="tel:+919219226570">
                                +91 92192 26570
                            </a>

                        </div>

                    </div>


                    <div class="contact-item">

                        <div class="contact-item-icon">
                            <i class="fa-solid fa-envelope"></i>
                        </div>

                        <div>

                            <h4>
                                Email
                            </h4>

                            <a href="mailto:growtechaxon@gmail.com">
                                growtechaxon@gmail.com
                            </a>

                        </div>

                    </div>


                    <div class="contact-item">

                        <div class="contact-item-icon">
                            <i class="fa-brands fa-whatsapp"></i>
                        </div>

                        <div>

                            <h4>
                                WhatsApp
                            </h4>

                            <a
                                href="https://wa.me/919219226570?text=Hello%20GrowtechAxon%2C%20I%20am%20interested%20in%20your%20services."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Chat with GrowtechAxon
                            </a>

                        </div>

                    </div>


                    <div class="contact-item">

                        <div>

                            <h4>
                                Connect With Us
                            </h4>

                            <div class="contact-socials">

                                <a
                                    href="https://www.instagram.com/growtechaxon?utm_source=qr&stkn=MXBsb2VhMjRwYjcwcw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <i class="fa-brands fa-instagram"></i>
                                </a>

                                <a
                                    href="https://www.facebook.com/profile.php?id=61593886546973&sk=friends"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                >
                                    <i class="fa-brands fa-facebook-f"></i>
                                </a>

                                <a
                                    href="https://www.linkedin.com/company/growtech-axon/posts/?feedView=all"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <i class="fa-brands fa-linkedin-in"></i>
                                </a>

                                <a
                                    href="https://youtube.com/@growtechaxon?si=GbI0Q2iEkTDRu0HE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                >
                                    <i class="fa-brands fa-youtube"></i>
                                </a>

                            </div>

                        </div>

                    </div>

                </div>


                <form
                    id="projectForm"
                    class="contact-form"
                >

                    <div class="form-grid">

                        <div class="form-group">

                            <label for="name">
                                Name *
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="business">
                                Business / Company
                            </label>

                            <input
                                id="business"
                                name="business"
                                type="text"
                                placeholder="Business name"
                            >

                        </div>


                        <div class="form-group">

                            <label for="email">
                                Email *
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="phone">
                                Phone *
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+91"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label for="city">
                                City
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Your city"
                            >

                        </div>


                        <div class="form-group">

                            <label for="service">
                                Service
                            </label>

                            <select
                                id="service"
                                name="service"
                            >

                                <option value="">
                                    Select service
                                </option>

                                <option value="Web Development">
                                    Web Development
                                </option>

                                <option value="App Development">
                                    App Development
                                </option>

                                <option value="UI UX Design">
                                    UI / UX Design
                                </option>

                                <option value="Software Development">
                                    Software Development
                                </option>

                                <option value="Digital Solutions">
                                    Digital Solutions
                                </option>

                                <option value="Training">
                                    Training
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                            </select>

                        </div>


                        <div class="form-group">

                            <label for="budget">
                                Budget
                            </label>

                            <select
                                id="budget"
                                name="budget"
                            >

                                <option value="">
                                    Select budget
                                </option>

                                <option value="Under 25K">
                                    Under ₹25K
                                </option>

                                <option value="25K - 50K">
                                    ₹25K - ₹50K
                                </option>

                                <option value="50K - 1L">
                                    ₹50K - ₹1L
                                </option>

                                <option value="Above 1L">
                                    Above ₹1L
                                </option>

                                <option value="Not Decided">
                                    Not Decided
                                </option>

                            </select>

                        </div>


                        <div class="form-group full">

                            <label for="message">
                                Message *
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                placeholder="Tell us about your project..."
                                required
                            ></textarea>

                        </div>

                    </div>


                    <button
                        type="submit"
                        class="btn btn-primary form-submit"
                    >
                        Send Project Request
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>


                    <div id="formMessage"></div>

                </form>

            </div>

        `;


        return section;

    }


    /* =========================================================
       STANDARD PAGE
       ========================================================= */

    function createStandardPage(
        route,
        title,
        description
    ) {

        const section =
            document.createElement("section");

        section.className = "page";

        section.dataset.page = route;


        section.innerHTML = `

            <div class="container">

                <div class="page-header">

                    <span class="eyebrow">
                        GrowtechAxon
                    </span>

                    <h1 class="page-title">
                        ${title}
                    </h1>

                    <p class="page-description">
                        ${description}
                    </p>

                </div>


                <div class="page-body"></div>

            </div>

        `;


        return section;

    }


    /* =========================================================
       PROJECT FILTER
       ========================================================= */

    function initializeProjectFilters() {

        const buttons =
            document.querySelectorAll(".filter-btn");

        const cards =
            document.querySelectorAll(".project-card");


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn =>
                            btn.classList.remove("active")
                    );


                    button.classList.add("active");


                    const filter =
                        button.dataset.filter;


                    cards.forEach(card => {

                        const category =
                            card.dataset.category;


                        if (
                            filter === "all" ||
                            category === filter
                        ) {

                            card.style.display = "block";

                            requestAnimationFrame(() => {

                                card.style.opacity = "1";

                                card.style.transform =
                                    "scale(1)";

                            });

                        } else {

                            card.style.opacity = "0";

                            card.style.transform =
                                "scale(0.95)";


                            setTimeout(() => {

                                card.style.display =
                                    "none";

                            }, 250);

                        }

                    });

                }
            );

        });

    }


    /* =========================================================
       TRAINING LEVELS
       ========================================================= */

    function initializeTrainingLevels() {

        const buttons =
            document.querySelectorAll(".level-btn");

        const contents =
            document.querySelectorAll(
                ".level-content"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const level =
                        button.dataset.level;


                    buttons.forEach(
                        btn =>
                            btn.classList.toggle(
                                "active",
                                btn === button
                            )
                    );


                    contents.forEach(content => {

                        content.classList.toggle(
                            "active",
                            content.dataset.levelContent ===
                            level
                        );

                    });

                }
            );

        });

    }


    /* =========================================================
       COUNTERS
       ========================================================= */

    function initializeCounters() {

        const counters =
            document.querySelectorAll(".counter");


        if (!("IntersectionObserver" in window)) {

            counters.forEach(counter => {

                counter.textContent =
                    `${counter.dataset.target}+`;

            });

            return;

        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const counter =
                            entry.target;

                        const target =
                            Number(
                                counter.dataset.target
                            ) || 0;


                        const duration = 1300;

                        const startTime =
                            performance.now();


                        function update(time) {

                            const progress =
                                Math.min(
                                    (time - startTime) /
                                    duration,
                                    1
                                );


                            const eased =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );


                            counter.textContent =
                                Math.floor(
                                    eased * target
                                );


                            if (progress < 1) {

                                requestAnimationFrame(
                                    update
                                );

                            } else {

                                counter.textContent =
                                    `${target}+`;

                            }

                        }


                        requestAnimationFrame(
                            update
                        );


                        observer.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: 0.4
                }
            );


        counters.forEach(counter => {

            observer.observe(counter);

        });

    }


    /* =========================================================
       REVEAL ANIMATION
       ========================================================= */

    function initializeReveal() {

        const elements =
            document.querySelectorAll(
                ".reveal-item"
            );


        elements.forEach(element => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

        });


        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(element => {

                element.style.opacity = "1";

                element.style.transform =
                    "translateY(0)";

            });

            return;

        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );


        elements.forEach(element => {

            observer.observe(element);

        });

    }


    /* =========================================================
       CONTACT FORM
       ========================================================= */

    function initializeContactForm() {

        const form =
            document.getElementById(
                "projectForm"
            );

        const message =
            document.getElementById(
                "formMessage"
            );


        if (!form) return;


        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    )?.value.trim();


                const email =
                    document.getElementById(
                        "email"
                    )?.value.trim();


                const phone =
                    document.getElementById(
                        "phone"
                    )?.value.trim();


                const text =
                    document.getElementById(
                        "message"
                    )?.value.trim();


                if (
                    !name ||
                    !email ||
                    !phone ||
                    !text
                ) {

                    showFormMessage(
                        "Please fill all required fields.",
                        "#f87171"
                    );

                    return;

                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(email)
                ) {

                    showFormMessage(
                        "Please enter a valid email address.",
                        "#f87171"
                    );

                    return;

                }


                const phoneDigits =
                    phone.replace(/\D/g, "");


                if (
                    phoneDigits.length < 10
                ) {

                    showFormMessage(
                        "Please enter a valid phone number.",
                        "#f87171"
                    );

                    return;

                }


                const formData = {

                    name:
                        document.getElementById(
                            "name"
                        )?.value || "",

                    business:
                        document.getElementById(
                            "business"
                        )?.value || "",

                    email:
                        document.getElementById(
                            "email"
                        )?.value || "",

                    phone:
                        document.getElementById(
                            "phone"
                        )?.value || "",

                    city:
                        document.getElementById(
                            "city"
                        )?.value || "",

                    service:
                        document.getElementById(
                            "service"
                        )?.value || "",

                    budget:
                        document.getElementById(
                            "budget"
                        )?.value || "",

                    message:
                        document.getElementById(
                            "message"
                        )?.value || ""

                };


                const submitButton =
                    form.querySelector(
                        ".form-submit"
                    );


                const originalText =
                    submitButton?.innerHTML;


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                            Sending...
                            <i class="fa-solid fa-spinner fa-spin"></i>
                        `;

                }


                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/leads`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        formData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to submit request."
                        );

                    }


                    showFormMessage(
                        "Thank you! Your project request has been received.",
                        "#60a5fa"
                    );


                    form.reset();


                    if (submitButton) {

                        submitButton.innerHTML =
                            `
                                Request Sent
                                <i class="fa-solid fa-check"></i>
                            `;


                        setTimeout(() => {

                            submitButton.innerHTML =
                                originalText ||
                                "Send Project Request";

                            submitButton.disabled =
                                false;

                        }, 3000);

                    }


                    console.log(
                        "Lead successfully sent:",
                        result
                    );


                } catch (error) {

                    console.error(
                        "Lead submission error:",
                        error
                    );


                    showFormMessage(
                        "Unable to send request. Please try again.",
                        "#f87171"
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalText ||
                            "Send Project Request";

                    }

                }

            }
        );


        function showFormMessage(
            text,
            color
        ) {

            if (!message) return;

            message.textContent = text;

            message.style.color = color;

        }

    }


    /* =========================================================
       TEAM IMAGE
       ========================================================= */

    function getTeamPhotoUrl(photo) {

        if (!photo) {
            return "";
        }


        let imageUrl =
            String(photo).trim();


        const replacements = [

            [
                "http://localhost:5000",
                API_URL
            ],

            [
                "http://127.0.0.1:5000",
                API_URL
            ],

            [
                "http://growtechaxon-backend.onrender.com",
                API_URL
            ]

        ];


        replacements.forEach(
            ([oldUrl, newUrl]) => {

                if (
                    imageUrl.startsWith(oldUrl)
                ) {

                    imageUrl =
                        imageUrl.replace(
                            oldUrl,
                            newUrl
                        );

                }

            }
        );


        if (
            imageUrl.startsWith("/uploads/")
        ) {

            imageUrl =
                `${API_URL}${imageUrl}`;

        }


        if (
            imageUrl.startsWith("uploads/team/")
        ) {

            imageUrl =
                `${API_URL}/${imageUrl}`;

        }


        return imageUrl;

    }


    /* =========================================================
       DEFAULT TEAM IMAGE
       ========================================================= */

    function getDefaultTeamImage() {

        const svg = `

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="600"
                height="600"
                viewBox="0 0 600 600"
            >

                <rect
                    width="600"
                    height="600"
                    fill="#08152b"
                />

                <circle
                    cx="300"
                    cy="210"
                    r="90"
                    fill="#2563eb"
                />

                <circle
                    cx="300"
                    cy="210"
                    r="50"
                    fill="#dbeafe"
                />

                <path
                    d="
                        M145 500
                        C160 370 220 310 300 310
                        C380 310 440 370 455 500Z
                    "
                    fill="#2563eb"
                />

                <text
                    x="300"
                    y="555"
                    text-anchor="middle"
                    fill="#ffffff"
                    font-family="Arial, sans-serif"
                    font-size="24"
                    font-weight="600"
                >
                    GrowtechAxon
                </text>

            </svg>

        `;


        return (
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(svg)
        );

    }


    /* =========================================================
       CREATE TEAM CARD
       ========================================================= */

    function createTeamCard(member) {

        const article =
            document.createElement("article");

        article.className =
            "team-card reveal-item";


        const photoWrapper =
            document.createElement("div");

        photoWrapper.className =
            "team-photo";


        const image =
            document.createElement("img");

        image.loading = "lazy";

        image.alt =
            member.name ||
            "Team Member";


        const imageUrl =
            getTeamPhotoUrl(
                member.photo
            );


        image.src =
            imageUrl ||
            getDefaultTeamImage();


        image.addEventListener(
            "error",
            () => {

                if (
                    image.dataset.fallbackApplied ===
                    "true"
                ) {

                    return;

                }


                image.dataset.fallbackApplied =
                    "true";


                image.src =
                    getDefaultTeamImage();

            }
        );


        photoWrapper.appendChild(
            image
        );


        const info =
            document.createElement("div");

        info.className =
            "team-info";


        const name =
            document.createElement("h3");

        name.textContent =
            member.name || "";


        const designation =
            document.createElement("span");

        designation.className =
            "team-designation";

        designation.textContent =
            member.designation || "";


        const description =
            document.createElement("p");

        description.textContent =
            member.description || "";


        const socials =
            document.createElement("div");

        socials.className =
            "team-socials";


        addTeamSocial(
            socials,
            member.linkedin,
            "LinkedIn",
            "fa-linkedin-in"
        );


        addTeamSocial(
            socials,
            member.instagram,
            "Instagram",
            "fa-instagram"
        );


        addTeamSocial(
            socials,
            member.github,
            "GitHub",
            "fa-github"
        );


        info.appendChild(name);

        info.appendChild(designation);

        info.appendChild(description);


        if (socials.children.length) {

            info.appendChild(socials);

        }


        article.appendChild(
            photoWrapper
        );

        article.appendChild(
            info
        );


        return article;

    }


    function addTeamSocial(
        parent,
        url,
        label,
        icon
    ) {

        if (!url) return;


        const link =
            document.createElement("a");


        link.href = url;

        link.target = "_blank";

        link.rel =
            "noopener noreferrer";


        link.setAttribute(
            "aria-label",
            label
        );


        link.innerHTML =
            `<i class="fa-brands ${icon}"></i>`;


        parent.appendChild(link);

    }


    /* =========================================================
       LOAD TEAM
       ========================================================= */

    async function loadTeamMembers() {

        const teamGrid =
            document.getElementById(
                "teamGrid"
            );


        if (!teamGrid) return;


        try {

            const response =
                await fetch(
                    `${API_URL}/api/team`,
                    {
                        method: "GET",

                        headers: {
                            "Accept":
                                "application/json"
                        },

                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Team API failed: ${response.status}`
                );

            }


            const result =
                await response.json();


            const members =
                Array.isArray(result)
                    ? result
                    : result.team ||
                      result.data ||
                      [];


            const activeMembers =
                members
                    .filter(
                        member =>
                            member &&
                            member.active !== false
                    )
                    .sort(
                        (a, b) =>
                            (
                                Number(
                                    a.displayOrder
                                ) || 0
                            ) -
                            (
                                Number(
                                    b.displayOrder
                                ) || 0
                            )
                    );


            if (!activeMembers.length) {

                teamGrid.innerHTML = `

                    <div class="team-empty">

                        Our team members will
                        appear here soon.

                    </div>

                `;

                return;

            }


            teamGrid.innerHTML = "";


            activeMembers.forEach(
                member => {

                    teamGrid.appendChild(
                        createTeamCard(member)
                    );

                }
            );


            initializeReveal();


            console.log(
                `Team members loaded: ${activeMembers.length}`
            );


        } catch (error) {

            console.error(
                "Team loading error:",
                error
            );


            teamGrid.innerHTML = `

                <div class="team-empty">

                    Unable to load team members.

                </div>

            `;

        }

    }


    /* =========================================================
       PAGE LINK CLICK HANDLER
       ========================================================= */

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "a[href^='#']"
                );


            if (!link) return;


            const href =
                link.getAttribute("href");


            if (
                !href ||
                href === "#"
            ) {

                return;

            }


            const route =
                href.substring(1);


            if (
                Object.prototype.hasOwnProperty.call(
                    pageData,
                    route
                )
            ) {

                event.preventDefault();


                if (
                    window.location.hash !==
                    `#${route}`
                ) {

                    window.location.hash =
                        route;

                } else {

                    renderPage(route);

                }

            }

        }
    );


    /* =========================================================
       BACK TO TOP
       ========================================================= */

    backToTop?.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =========================================================
       ESCAPE KEY
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =========================================================
       CURRENT YEAR
       ========================================================= */

    const year =
        document.getElementById(
            "currentYear"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =========================================================
       CURSOR GLOW
       ========================================================= */

    if (
        window.innerWidth > 900
    ) {

        const cursorGlow =
            document.createElement("div");


        cursorGlow.style.position =
            "fixed";

        cursorGlow.style.width =
            "180px";

        cursorGlow.style.height =
            "180px";

        cursorGlow.style.borderRadius =
            "50%";

        cursorGlow.style.pointerEvents =
            "none";

        cursorGlow.style.zIndex =
            "0";

        cursorGlow.style.background =
            "radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)";

        cursorGlow.style.transform =
            "translate(-50%, -50%)";

        cursorGlow.style.display =
            "block";


        document.body.appendChild(
            cursorGlow
        );


        document.addEventListener(
            "mousemove",
            event => {

                cursorGlow.style.left =
                    `${event.clientX}px`;

                cursorGlow.style.top =
                    `${event.clientY}px`;

            }
        );

    }


    /* =========================================================
       INITIAL ROUTE
       ========================================================= */

    routeChange();


    /* =========================================================
       READY
       ========================================================= */

    console.log(
        "GrowtechAxon SPA initialized successfully."
    );

    console.log(
        "Backend API:",
        API_URL
    );

});