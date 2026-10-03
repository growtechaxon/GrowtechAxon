/* =========================================================
   GROWTECHAXON - MAIN JAVASCRIPT
========================================================= */

/* =========================================================
   API CONFIGURATION
========================================================= */

const PRODUCTION_API_URL =
    "https://growtechaxon-backend.onrender.com";

/*
 * Localhost par agar backend kisi aur port par chal raha ho
 * to index.html ke pehle ye set kar sakte ho:
 *
 * window.GROWTECHAXON_API_URL = "http://localhost:5000";
 *
 * Agar ye set nahi hai to production backend use hoga.
 */
const API_URL =
    window.GROWTECHAXON_API_URL ||
    PRODUCTION_API_URL;

const INTERNSHIP_WEBSITE_URL =
    "YOUR_INTERNSHIP_WEBSITE_URL";

/* =========================================================
   API CACHE / REQUEST CONTROL
========================================================= */

let teamMembersPromise = null;
let teamMembersCache = null;

const TEAM_API_TIMEOUT = 8000;

/* =========================================================
   FOUNDER SEO CONFIGURATION
========================================================= */

const FOUNDER_NAME =
    "RAM BHAROSA PRASAD";

const FOUNDER_INSTAGRAM =
    "https://www.instagram.com/devloper_512/";

/* =========================================================
   OFFICIAL SOCIAL LINKS
========================================================= */

const SOCIAL_LINKS = {

    instagram:
        "https://www.instagram.com/growtechaxon/",

    facebook:
        "https://www.facebook.com/profile.php?id=61593886546973",

    linkedin:
        "https://www.linkedin.com/company/growtech-axon/",

    youtube:
        "https://youtube.com/@growtechaxon"

};

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        initializeMenu();

        initializeFooter();

        routeChange();

        /*
         * Founder SEO background mein load hoga.
         * Team page kholne par duplicate API request nahi hogi.
         */
        loadFounderForSEO();

    }
);

/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link) {
                return;
            }

            const href =
                link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            /*
             * Sirf simple hash routes ko smooth scroll/router
             * ke through handle karo.
             */
            const target =
                document.querySelector(href);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

    window.addEventListener(
        "hashchange",
        routeChange
    );

}

/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMenu() {

    const menuToggle =
        document.getElementById(
            "menu-toggle"
        );

    const navLinks =
        document.getElementById(
            "nav-links"
        );

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navLinks.classList.toggle(
                    "active"
                );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

    navLinks.addEventListener(
        "click",
        event => {

            if (
                event.target.closest("a")
            ) {

                navLinks.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}

/* =========================================================
   ROUTER
========================================================= */

function getCurrentRoute() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();

    return hash || "home";

}

function routeChange() {

    const route =
        getCurrentRoute();

    initializePage(route);

}

/* =========================================================
   PAGE INITIALIZER
========================================================= */

function initializePage(route) {

    const app =
        document.getElementById("app");

    if (!app) {
        return;
    }

    switch (route) {

        case "home":
            createHomePage();
            break;

        case "about":
            createAboutPage();
            break;

        case "services":
            createServicesPage();
            break;

        case "projects":
            createProjectsPage();
            break;

        case "process":
            createProcessPage();
            break;

        case "pricing":
            createPricingPage();
            break;

        case "training":
            createTrainingPage();
            break;

        case "team":
            createTeamPage();
            break;

        case "contact":
            createContactPage();
            break;

        default:
            createHomePage();
            break;

    }

}

/* =========================================================
   PAGE TITLE / DESCRIPTION
========================================================= */

function updateSEO(
    title,
    description
) {

    document.title =
        title;

    let meta =
        document.querySelector(
            'meta[name="description"]'
        );

    if (!meta) {

        meta =
            document.createElement(
                "meta"
            );

        meta.name =
            "description";

        document.head.appendChild(
            meta
        );

    }

    meta.content =
        description;

    const canonical =
        document.querySelector(
            'link[rel="canonical"]'
        );

    if (canonical) {

        canonical.href =
            "https://growtechaxon.in/";

    }

}

/* =========================================================
   HOME PAGE
========================================================= */

function createHomePage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon | Website Development, Apps & Digital Solutions",
        "GrowtechAxon provides website development, app development, UI/UX design, software development, digital solutions and technology training."
    );

    app.innerHTML = `

        <section
            class="hero"
            id="home"
        >

            <div class="hero-content">

                <span class="hero-badge">
                    Digital Solutions & Technology
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
                        class="btn btn-primary"
                    >
                        Explore Services
                    </a>

                    <a
                        href="#contact"
                        class="btn btn-secondary"
                    >
                        Contact Us
                    </a>

                </div>

            </div>

        </section>


        <section
            class="section"
            id="why-growtechaxon"
        >

            <div class="section-heading">

                <span>
                    Why GrowtechAxon
                </span>

                <h2>
                    Technology That Creates Growth
                </h2>

                <p>
                    We combine modern development,
                    clean design and practical technology
                    solutions.
                </p>

            </div>


            <div class="cards-grid">

                <article class="service-card">

                    <h3>
                        Modern Development
                    </h3>

                    <p>
                        Modern technologies and development
                        practices for reliable digital products.
                    </p>

                </article>


                <article class="service-card">

                    <h3>
                        Clean Design
                    </h3>

                    <p>
                        User-focused interfaces designed
                        for clarity, usability and performance.
                    </p>

                </article>


                <article class="service-card">

                    <h3>
                        Practical Learning
                    </h3>

                    <p>
                        Practical training and technology
                        learning for students and aspiring
                        developers.
                    </p>

                </article>

            </div>

        </section>


        <section
            class="section founder-home-section"
        >

            <div class="section-heading">

                <span>
                    Founder
                </span>

                <h2>
                    RAM BHAROSA PRASAD
                </h2>

                <p>
                    Founder of GrowtechAxon, focused on
                    building practical digital solutions,
                    technology products and learning
                    opportunities.
                </p>

            </div>

        </section>


        <section class="section">

            <div class="section-heading">

                <span>
                    Our Services
                </span>

                <h2>
                    Digital Solutions For Your Needs
                </h2>

            </div>


            <div class="cards-grid">

                ${serviceCard(
                    "Web Development",
                    "Responsive, modern and scalable websites for businesses and digital brands."
                )}

                ${serviceCard(
                    "App Development",
                    "Application development focused on useful and engaging digital experiences."
                )}

                ${serviceCard(
                    "UI/UX Design",
                    "Clean and user-friendly interfaces designed around real user needs."
                )}

                ${serviceCard(
                    "Software Development",
                    "Custom software solutions for specific business and technology requirements."
                )}

            </div>

        </section>

    `;

}

/* =========================================================
   SERVICE CARD
========================================================= */

function serviceCard(
    title,
    description
) {

    return `

        <article class="service-card">

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

        </article>

    `;

}

/* =========================================================
   ABOUT PAGE
========================================================= */

function createAboutPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "About GrowtechAxon | Digital Solutions & Technology",
        "Learn about GrowtechAxon and its focus on practical technology solutions, websites, applications, UI/UX, software development and technology training."
    );

    app.innerHTML = `

        <section class="page-hero">

            <div>

                <span>
                    About GrowtechAxon
                </span>

                <h1>
                    Technology With A Practical Purpose
                </h1>

                <p>
                    GrowtechAxon focuses on practical
                    technology solutions for businesses,
                    startups, students and growing digital
                    brands.
                </p>

            </div>

        </section>


        <section class="section">

            <div class="content-grid">

                <div>

                    <h2>
                        What We Do
                    </h2>

                    <p>
                        GrowtechAxon provides websites,
                        applications, UI/UX design, software
                        solutions, digital services and
                        technology training.
                    </p>

                    <p>
                        Our goal is to create useful digital
                        products while helping learners gain
                        practical technology experience.
                    </p>

                </div>


                <div>

                    <h2>
                        Our Approach
                    </h2>

                    <p>
                        We focus on clean development,
                        understandable interfaces,
                        practical implementation and
                        solutions aligned with real needs.
                    </p>

                </div>

            </div>

        </section>

    `;

}

/* =========================================================
   SERVICES PAGE
========================================================= */

function createServicesPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Services | Web, App, UI/UX & Software Development",
        "Explore GrowtechAxon services including website development, app development, UI/UX design, software development, digital solutions and technology training."
    );

    const services = [

        {
            title: "Web Development",
            description:
                "Modern responsive websites, business websites, landing pages and custom web applications."
        },

        {
            title: "App Development",
            description:
                "Application solutions designed around useful features, usability and business requirements."
        },

        {
            title: "UI/UX Design",
            description:
                "Clean, practical and user-focused interface design for websites and applications."
        },

        {
            title: "Software Development",
            description:
                "Custom software solutions designed for specific business and technology requirements."
        },

        {
            title: "Digital Solutions",
            description:
                "Technology solutions that help businesses build, improve and manage their digital presence."
        },

        {
            title: "Training & Internship",
            description:
                "Practical technology learning and project-based experience for students and aspiring developers."
        }

    ];

    app.innerHTML = `

        <section class="page-hero">

            <span>
                GrowtechAxon Services
            </span>

            <h1>
                Digital Development & Technology Services
            </h1>

            <p>
                Practical technology solutions for
                businesses, startups, students and
                digital brands.
            </p>

        </section>


        <section class="section">

            <div class="cards-grid">

                ${services.map(service => `

                    <article
                        class="service-card"
                    >

                        <h2>
                            ${escapeHTML(
                                service.title
                            )}
                        </h2>

                        <p>
                            ${escapeHTML(
                                service.description
                            )}
                        </p>

                    </article>

                `).join("")}

            </div>

        </section>

    `;

}

/* =========================================================
   PROJECTS PAGE
========================================================= */

function createProjectsPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Projects | Web & Software Projects",
        "Explore projects and digital solutions developed by GrowtechAxon including exam systems, portfolio websites, e-commerce and business websites."
    );

    const projects = [

        {
            title:
                "Online Exam System",

            description:
                "An online examination platform designed for digital assessments.",

            url:
                "https://growtechaxon-exam-system.onrender.com/t"
        },

        {
            title:
                "Portfolio Website",

            description:
                "A modern portfolio and digital presence solution.",

            url:
                "https://growtechaxon-frontend.onrender.com/"
        },

        {
            title:
                "E-Commerce Solution",

            description:
                "Digital commerce solution for showcasing and selling products."
        },

        {
            title:
                "Business Landing Page",

            description:
                "Professional landing pages designed for business communication and online presence."
        }

    ];

    app.innerHTML = `

        <section class="page-hero">

            <span>
                GrowtechAxon Projects
            </span>

            <h1>
                Digital Products & Projects
            </h1>

            <p>
                Examples of websites, applications
                and digital solutions.
            </p>

        </section>


        <section class="section">

            <div class="cards-grid">

                ${projects.map(project => `

                    <article
                        class="project-card"
                    >

                        <h2>
                            ${escapeHTML(
                                project.title
                            )}
                        </h2>

                        <p>
                            ${escapeHTML(
                                project.description
                            )}
                        </p>

                        ${
                            project.url
                            ?

                            `

                                <a
                                    href="${escapeAttribute(project.url)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-primary"
                                >
                                    View Project
                                </a>

                            `

                            :

                            ""

                        }

                    </article>

                `).join("")}

            </div>

        </section>

    `;

}

/* =========================================================
   PROCESS PAGE
========================================================= */

function createProcessPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Development Process",
        "Learn about the GrowtechAxon process for planning, designing, developing, testing and launching digital products."
    );

    const steps = [

        [
            "01",
            "Understand",
            "We understand the business, users and technology requirements."
        ],

        [
            "02",
            "Plan",
            "We define the project structure, features and development approach."
        ],

        [
            "03",
            "Design",
            "We create clear and practical user interfaces and experiences."
        ],

        [
            "04",
            "Develop",
            "We build the website, application or software solution."
        ],

        [
            "05",
            "Test",
            "We test important functionality, usability and responsiveness."
        ],

        [
            "06",
            "Launch",
            "The completed digital solution is prepared for deployment."
        ]

    ];

    app.innerHTML = `

        <section class="page-hero">

            <span>
                Our Process
            </span>

            <h1>
                From Idea To Digital Product
            </h1>

        </section>


        <section class="section">

            <div class="cards-grid">

                ${steps.map(step => `

                    <article class="process-card">

                        <span>
                            ${escapeHTML(step[0])}
                        </span>

                        <h2>
                            ${escapeHTML(step[1])}
                        </h2>

                        <p>
                            ${escapeHTML(step[2])}
                        </p>

                    </article>

                `).join("")}

            </div>

        </section>

    `;

}

/* =========================================================
   PRICING PAGE
========================================================= */

function createPricingPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Pricing | Digital Development Services",
        "Explore GrowtechAxon digital development services and discuss your website, application, software or digital solution requirements."
    );

    app.innerHTML = `

        <section class="page-hero">

            <span>
                Pricing
            </span>

            <h1>
                Choose A Solution Around Your Requirements
            </h1>

            <p>
                Project pricing depends on scope,
                features, technology and requirements.
            </p>

        </section>


        <section class="section">

            <div class="cards-grid">

                <article class="pricing-card">

                    <h2>
                        Website Development
                    </h2>

                    <p>
                        Business websites, landing pages
                        and custom web development.
                    </p>

                    <a
                        href="#contact"
                        class="btn btn-primary"
                    >
                        Discuss Project
                    </a>

                </article>


                <article class="pricing-card">

                    <h2>
                        Application Development
                    </h2>

                    <p>
                        Custom application solutions
                        based on your requirements.
                    </p>

                    <a
                        href="#contact"
                        class="btn btn-primary"
                    >
                        Discuss Project
                    </a>

                </article>


                <article class="pricing-card">

                    <h2>
                        Custom Software
                    </h2>

                    <p>
                        Software solutions designed around
                        specific business workflows.
                    </p>

                    <a
                        href="#contact"
                        class="btn btn-primary"
                    >
                        Discuss Project
                    </a>

                </article>

            </div>

        </section>

    `;

}

/* =========================================================
   TRAINING PAGE
========================================================= */

function createTrainingPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Training & Internship",
        "GrowtechAxon provides practical technology learning, training and internship opportunities for students and aspiring developers."
    );

    const internshipButton =
        INTERNSHIP_WEBSITE_URL &&
        INTERNSHIP_WEBSITE_URL !==
            "YOUR_INTERNSHIP_WEBSITE_URL"

        ?

        `

            <a
                href="${escapeAttribute(INTERNSHIP_WEBSITE_URL)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
            >
                Internship Website
            </a>

        `

        :

        `

            <a
                href="#contact"
                class="btn btn-primary"
            >
                Contact For Internship
            </a>

        `;

    app.innerHTML = `

        <section class="page-hero">

            <span>
                Training & Internship
            </span>

            <h1>
                Learn Technology Through Practical Work
            </h1>

            <p>
                GrowtechAxon focuses on practical
                technology learning and project-based
                experience.
            </p>

        </section>


        <section class="section">

            <div class="content-grid">

                <div>

                    <h2>
                        Practical Learning
                    </h2>

                    <p>
                        Learn by working with real development
                        concepts, projects and modern
                        technology practices.
                    </p>

                </div>


                <div>

                    <h2>
                        Internship
                    </h2>

                    <p>
                        Students and aspiring developers can
                        contact GrowtechAxon to learn about
                        available internship opportunities.
                    </p>

                    ${internshipButton}

                </div>

            </div>

        </section>

    `;

}

/* =========================================================
   TEAM PAGE
========================================================= */

function createTeamPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "GrowtechAxon Team | RAM BHAROSA PRASAD",
        "Meet the GrowtechAxon team and RAM BHAROSA PRASAD, Founder of GrowtechAxon."
    );

    app.innerHTML = `

        <section class="page-hero">

            <span>
                GrowtechAxon Team
            </span>

            <h1>
                Meet Our Team
            </h1>

            <p>
                People working on technology,
                digital solutions and practical learning.
            </p>

        </section>


        <section
            class="section"
            id="team-members-section"
        >

            <div
                id="team-container"
                class="cards-grid"
            >

                <div class="loading">
                    Loading team members...
                </div>

            </div>

        </section>

    `;

    loadTeamMembers();

}

/* =========================================================
   FETCH JSON WITH TIMEOUT
========================================================= */

async function fetchJSONWithTimeout(
    url,
    options = {},
    timeout = TEAM_API_TIMEOUT
) {

    const controller =
        new AbortController();

    const timeoutId =
        setTimeout(
            () => controller.abort(),
            timeout
        );

    try {

        const response =
            await fetch(
                url,
                {
                    ...options,
                    signal:
                        controller.signal
                }
            );

        return response;

    } catch (error) {

        if (
            error &&
            error.name === "AbortError"
        ) {

            throw new Error(
                "Team API request timed out."
            );

        }

        throw error;

    } finally {

        clearTimeout(timeoutId);

    }

}

/* =========================================================
   NORMALIZE TEAM API RESPONSE
========================================================= */

/*
 * Backend different formats support:
 *
 * [
 *   {...}
 * ]
 *
 * {
 *   team: [...]
 * }
 *
 * {
 *   members: [...]
 * }
 *
 * {
 *   data: [...]
 * }
 *
 * {
 *   data: {
 *      team: [...]
 *   }
 * }
 *
 * {
 *   data: {
 *      members: [...]
 *   }
 * }
 */

function normalizeTeamResponse(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (
        data &&
        Array.isArray(data.team)
    ) {
        return data.team;
    }

    if (
        data &&
        Array.isArray(data.members)
    ) {
        return data.members;
    }

    if (
        data &&
        Array.isArray(data.data)
    ) {
        return data.data;
    }

    if (
        data &&
        data.data &&
        Array.isArray(data.data.team)
    ) {
        return data.data.team;
    }

    if (
        data &&
        data.data &&
        Array.isArray(data.data.members)
    ) {
        return data.data.members;
    }

    return null;

}

/* =========================================================
   GET TEAM MEMBERS
========================================================= */

/*
 * Important:
 *
 * Team page aur Founder SEO dono same promise use karenge.
 * Isse /api/team par duplicate request nahi jayegi.
 */

async function getTeamMembers() {

    if (Array.isArray(teamMembersCache)) {

        return teamMembersCache;

    }

    if (teamMembersPromise) {

        return teamMembersPromise;

    }

    teamMembersPromise =
        (async () => {

            const response =
                await fetchJSONWithTimeout(
                    `${API_URL}/api/team`,
                    {
                        method: "GET",

                        headers: {
                            "Accept":
                                "application/json"
                        },

                        cache: "no-store"
                    }
                );

            if (!response.ok) {

                throw new Error(
                    `Team API returned ${response.status}`
                );

            }

            const data =
                await response.json();

            console.log(
                "GrowtechAxon Team API response:",
                data
            );

            const members =
                normalizeTeamResponse(data);

            if (!members) {

                throw new Error(
                    "Invalid team API response"
                );

            }

            teamMembersCache =
                members;

            return members;

        })()
        .catch(error => {

            /*
             * Promise ko reset karo taaki Retry button
             * dobara request kar sake.
             */
            teamMembersPromise =
                null;

            throw error;

        });

    return teamMembersPromise;

}

/* =========================================================
   LOAD TEAM MEMBERS
========================================================= */

async function loadTeamMembers() {

    const container =
        document.getElementById(
            "team-container"
        );

    if (!container) {
        return;
    }

    /*
     * Retry/loading state
     */
    container.innerHTML = `

        <div class="loading-state">

            <p>
                Loading team members...
            </p>

        </div>

    `;

    try {

        const members =
            await getTeamMembers();

        /*
         * Active members filter
         */
        const activeMembers =
            members
                .filter(
                    member =>
                        member &&
                        member.isActive !== false
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

        /*
         * Founder structured data
         */
        const founder =
            activeMembers.find(
                member => {

                    const name =
                        String(
                            member?.name || ""
                        )
                            .trim()
                            .toLowerCase();

                    return (
                        name ===
                        FOUNDER_NAME.toLowerCase()
                    );

                }
            );

        if (founder) {

            injectFounderStructuredData(
                founder
            );

        }

        /*
         * Empty team
         */
        if (!activeMembers.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <p>
                        No team members are currently available.
                    </p>

                </div>

            `;

            return;

        }

        /*
         * Render team
         */
        container.innerHTML =
            activeMembers
                .map(
                    member =>
                        createTeamCard(member)
                )
                .join("");

    } catch (error) {

        console.error(
            "Team loading error:",
            error
        );

        container.innerHTML = `

            <div class="error-state">

                <p>
                    Unable to load team members right now.
                </p>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="retryTeamLoading()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}

/* =========================================================
   RETRY TEAM
========================================================= */

function retryTeamLoading() {

    /*
     * Cache reset
     */
    teamMembersCache =
        null;

    teamMembersPromise =
        null;

    loadTeamMembers();

}

/* =========================================================
   TEAM CARD
========================================================= */

function createTeamCard(member) {

    const name =
        member.name ||
        "Team Member";

    const designation =
        member.designation ||
        "Team Member";

    const description =
        member.description ||
        "";

    const image =
        getTeamPhotoUrl(
            member.photo
        ) ||
        getDefaultTeamImage();

    const socialLinks = [];

    if (member.linkedin) {

        socialLinks.push(`

            <a
                href="${escapeAttribute(member.linkedin)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeAttribute(name)} LinkedIn"
            >
                LinkedIn
            </a>

        `);

    }

    if (member.instagram) {

        socialLinks.push(`

            <a
                href="${escapeAttribute(member.instagram)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeAttribute(name)} Instagram"
            >
                Instagram
            </a>

        `);

    }

    if (member.github) {

        socialLinks.push(`

            <a
                href="${escapeAttribute(member.github)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeAttribute(name)} GitHub"
            >
                GitHub
            </a>

        `);

    }

    return `

        <article
            class="team-card"
        >

            <div class="team-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(name)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null;this.src=getDefaultTeamImage();"
                >

            </div>


            <div class="team-content">

                <h2>
                    ${escapeHTML(name)}
                </h2>

                <h3>
                    ${escapeHTML(designation)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>


                ${
                    socialLinks.length
                    ?

                    `

                        <div
                            class="team-social"
                        >

                            ${socialLinks.join("")}

                        </div>

                    `

                    :

                    ""
                }

            </div>

        </article>

    `;

}

/* =========================================================
   TEAM PHOTO URL
========================================================= */

function getTeamPhotoUrl(photo) {

    if (!photo) {
        return "";
    }

    let photoUrl =
        String(photo).trim();

    if (!photoUrl) {
        return "";
    }

    /*
     * Absolute URL
     */
    if (
        photoUrl.startsWith(
            "http://"
        ) ||
        photoUrl.startsWith(
            "https://"
        )
    ) {

        /*
         * Old localhost URLs
         */
        photoUrl =
            photoUrl.replace(
                /^https?:\/\/localhost(?::\d+)?/i,
                API_URL
            );

        /*
         * Old 127.0.0.1 URLs
         */
        photoUrl =
            photoUrl.replace(
                /^https?:\/\/127\.0\.0\.1(?::\d+)?/i,
                API_URL
            );

        /*
         * Existing production backend
         */
        photoUrl =
            photoUrl.replace(
                /^https?:\/\/growtechaxon-backend\.onrender\.com/i,
                API_URL
            );

        return photoUrl;

    }

    /*
     * /uploads/photo.jpg
     */
    if (
        photoUrl.startsWith(
            "/uploads/"
        )
    ) {

        return (
            API_URL +
            photoUrl
        );

    }

    /*
     * uploads/photo.jpg
     */
    if (
        photoUrl.startsWith(
            "uploads/"
        )
    ) {

        return (
            API_URL +
            "/" +
            photoUrl
        );

    }

    /*
     * Any root-relative backend path
     */
    if (
        photoUrl.startsWith("/")
    ) {

        return (
            API_URL +
            photoUrl
        );

    }

    /*
     * Filename only
     */
    return (
        API_URL +
        "/uploads/" +
        photoUrl
    );

}

/* =========================================================
   DEFAULT TEAM IMAGE
========================================================= */

function getDefaultTeamImage() {

    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="500"
            height="500"
            viewBox="0 0 500 500"
        >

            <rect
                width="500"
                height="500"
                fill="#eeeeee"
            />

            <circle
                cx="250"
                cy="190"
                r="85"
                fill="#aaaaaa"
            />

            <path
                d="
                    M100 470
                    C100 350 170 290 250 290
                    C330 290 400 350 400 470
                    Z
                "
                fill="#aaaaaa"
            />

        </svg>

    `;

    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}

/* =========================================================
   FOUNDER SEO IMAGE
========================================================= */

function getFounderImageUrl(photo) {

    if (!photo) {
        return "";
    }

    return getTeamPhotoUrl(photo);

}

/* =========================================================
   DYNAMIC FOUNDER STRUCTURED DATA
========================================================= */

function injectFounderStructuredData(
    member
) {

    if (!member) {
        return;
    }

    const founderName =
        member.name ||
        FOUNDER_NAME;

    const founderImage =
        getFounderImageUrl(
            member.photo
        );

    const founderInstagram =
        member.instagram ||
        FOUNDER_INSTAGRAM;

    const founderDescription =
        member.description ||
        "RAM BHAROSA PRASAD is the Founder of GrowtechAxon, a digital solutions and technology company focused on website development, app development, software solutions, UI/UX design and digital technology services.";

    const existing =
        document.getElementById(
            "growtechaxon-founder-schema"
        );

    if (existing) {
        existing.remove();
    }

    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "Person",

        "@id":
            "https://growtechaxon.in/#ram-bharosa-prasad",

        "name":
            founderName,

        "alternateName":
            "Ram Bharosa Prasad",

        "jobTitle":
            member.designation ||
            "Founder",

        "description":
            founderDescription,

        "url":
            "https://growtechaxon.in/#team",

        "worksFor": {

            "@type":
                "Organization",

            "@id":
                "https://growtechaxon.in/#organization",

            "name":
                "GrowtechAxon",

            "url":
                "https://growtechaxon.in/"

        },

        "sameAs": [
            founderInstagram
        ]

    };

    if (founderImage) {

        schema.image =
            founderImage;

    }

    const script =
        document.createElement(
            "script"
        );

    script.type =
        "application/ld+json";

    script.id =
        "growtechaxon-founder-schema";

    script.textContent =
        JSON.stringify(
            schema,
            null,
            2
        );

    document.head.appendChild(
        script
    );

    console.log(
        "Founder SEO schema added:",
        schema
    );

}

/* =========================================================
   LOAD FOUNDER SEO DATA
========================================================= */

async function loadFounderForSEO() {

    try {

        /*
         * Same cached Team API request use hoga.
         */
        const members =
            await getTeamMembers();

        const founder =
            members.find(
                member => {

                    const name =
                        String(
                            member?.name || ""
                        )
                            .trim()
                            .toLowerCase();

                    return (
                        name ===
                        FOUNDER_NAME.toLowerCase()
                    );

                }
            );

        if (!founder) {

            console.warn(
                `Founder "${FOUNDER_NAME}" was not found in Team API.`
            );

            return;

        }

        injectFounderStructuredData(
            founder
        );

    } catch (error) {

        /*
         * SEO API fail hone par website crash nahi hogi.
         */
        console.warn(
            "Founder SEO: Team API unavailable.",
            error
        );

    }

}

/* =========================================================
   CONTACT PAGE
========================================================= */

function createContactPage() {

    const app =
        document.getElementById("app");

    updateSEO(
        "Contact GrowtechAxon | Website & Digital Solutions",
        "Contact GrowtechAxon for website development, app development, software development, UI/UX design, digital solutions and technology services."
    );

    app.innerHTML = `

        <section class="page-hero">

            <span>
                Contact GrowtechAxon
            </span>

            <h1>
                Let's Build Something Digital
            </h1>

            <p>
                Tell us about your project,
                business requirement or learning goal.
            </p>

        </section>


        <section class="section contact-section">

            <div class="contact-grid">


                <div class="contact-info">

                    <h2>
                        Contact Information
                    </h2>


                    <div class="contact-item">

                        <strong>
                            Location
                        </strong>

                        <p>
                            Lucknow, Uttar Pradesh, India
                        </p>

                    </div>


                    <div class="contact-item">

                        <strong>
                            Phone
                        </strong>

                        <p>

                            <a
                                href="tel:+919219226570"
                            >
                                +91 92192 26570
                            </a>

                        </p>

                    </div>


                    <div class="contact-item">

                        <strong>
                            Email
                        </strong>

                        <p>

                            <a
                                href="mailto:growtechaxon@gmail.com"
                            >
                                growtechaxon@gmail.com
                            </a>

                        </p>

                    </div>


                    <div class="contact-item">

                        <strong>
                            WhatsApp
                        </strong>

                        <p>

                            <a
                                href="https://wa.me/919219226570"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Chat on WhatsApp
                            </a>

                        </p>

                    </div>


                    <div class="contact-social">

                        <a
                            href="${SOCIAL_LINKS.instagram}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>

                        <a
                            href="${SOCIAL_LINKS.facebook}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </a>

                        <a
                            href="${SOCIAL_LINKS.linkedin}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </a>

                        <a
                            href="${SOCIAL_LINKS.youtube}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            YouTube
                        </a>

                    </div>

                </div>


                <div class="contact-form-wrapper">

                    <h2>
                        Send Us A Message
                    </h2>


                    <form
                        id="contact-form"
                    >

                        <div class="form-group">

                            <label
                                for="name"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your name"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label
                                for="email"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Your email"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label
                                for="phone"
                            >
                                Phone
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Your phone number"
                            >

                        </div>


                        <div class="form-group">

                            <label
                                for="message"
                            >
                                Message
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                placeholder="Tell us about your requirement"
                                required
                            ></textarea>

                        </div>


                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Send Message
                        </button>


                        <div
                            id="form-message"
                            class="form-message"
                        ></div>

                    </form>

                </div>

            </div>

        </section>

    `;

    initializeContactForm();

}

/* =========================================================
   CONTACT FORM
========================================================= */

function initializeContactForm() {

    const form =
        document.getElementById(
            "contact-form"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            const messageBox =
                document.getElementById(
                    "form-message"
                );

            const formData =
                new FormData(form);

            const data =
                Object.fromEntries(
                    formData.entries()
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending...";

            }

            if (messageBox) {

                messageBox.textContent =
                    "";

            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/leads`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    data
                                )

                        }
                    );

                const result =
                    await response.json()
                        .catch(
                            () => ({})
                        );

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to submit your message."
                    );

                }

                if (messageBox) {

                    messageBox.textContent =
                        result.message ||
                        "Thank you. Your message has been sent successfully.";

                }

                form.reset();

            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );

                if (messageBox) {

                    messageBox.textContent =
                        error.message ||
                        "Something went wrong. Please try again.";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Message";

                }

            }

        }
    );

}

/* =========================================================
   FOOTER
========================================================= */

function initializeFooter() {

    const year =
        document.getElementById(
            "current-year"
        );

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}

/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

/* =========================================================
   ATTRIBUTE ESCAPE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(value);

}

/* =========================================================
   INITIALIZE FOOTER YEAR AFTER DYNAMIC CONTENT
========================================================= */

window.addEventListener(
    "hashchange",
    () => {

        setTimeout(
            initializeFooter,
            0
        );

    }
);

/* =========================================================
   GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "GrowtechAxon JavaScript error:",
            event.error ||
            event.message
        );

    }
);

window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "GrowtechAxon promise error:",
            event.reason
        );

    }
);