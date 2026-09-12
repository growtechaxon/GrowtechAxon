document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       GROWTECH AXON - PUBLIC WEBSITE SCRIPT
       Production API + Leads + Team Management
    ========================================================= */


    /* =========================================================
       API CONFIG
    ========================================================= */

    const API_URL =
        "https://growtechaxon-backend.onrender.com";


    /* =========================================================
       TEAM IMAGE URL FIX
       Handles old localhost / HTTP URLs
    ========================================================= */

    function getTeamPhotoUrl(photo) {

        if (!photo) {
            return "";
        }

        let photoUrl =
            String(photo).trim();


        /* Old localhost URL */

        if (
            photoUrl.startsWith(
                "http://localhost:5000"
            )
        ) {

            photoUrl =
                photoUrl.replace(
                    "http://localhost:5000",
                    API_URL
                );
        }


        /* Old 127.0.0.1 URL */

        if (
            photoUrl.startsWith(
                "http://127.0.0.1:5000"
            )
        ) {

            photoUrl =
                photoUrl.replace(
                    "http://127.0.0.1:5000",
                    API_URL
                );
        }


        /* Render HTTP URL */

        if (
            photoUrl.startsWith(
                "http://growtechaxon-backend.onrender.com"
            )
        ) {

            photoUrl =
                photoUrl.replace(
                    "http://growtechaxon-backend.onrender.com",
                    API_URL
                );
        }


        /* Relative upload path */

        if (
            photoUrl.startsWith(
                "/uploads/"
            )
        ) {

            photoUrl =
                API_URL + photoUrl;
        }


        return photoUrl;
    }


    /* =========================================================
       PRELOADER
    ========================================================= */

    const preloader =
        document.getElementById("preloader");


    function hidePreloader() {

        if (preloader) {

            preloader.style.opacity =
                "0";

            preloader.style.visibility =
                "hidden";

            preloader.style.pointerEvents =
                "none";
        }
    }


    window.addEventListener(
        "load",
        () => {

            setTimeout(
                hidePreloader,
                500
            );

        }
    );


    /* Safety fallback */

    setTimeout(
        hidePreloader,
        3000
    );


    /* =========================================================
       HEADER SCROLL
    ========================================================= */

    const header =
        document.getElementById("header");

    const backToTop =
        document.getElementById("backToTop");


    function handleScroll() {

        if (window.scrollY > 50) {

            header?.classList.add(
                "scrolled"
            );

        } else {

            header?.classList.remove(
                "scrolled"
            );
        }


        if (window.scrollY > 500) {

            backToTop?.classList.add(
                "show"
            );

        } else {

            backToTop?.classList.remove(
                "show"
            );
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

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const navMenu =
        document.getElementById(
            "navMenu"
        );


    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle(
                "open"
            );


            const icon =
                menuToggle.querySelector(
                    "i"
                );


            if (
                navMenu?.classList.contains(
                    "open"
                )
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
       CLOSE MOBILE MENU
    ========================================================= */

    document
        .querySelectorAll(
            ".nav-link, .nav-cta"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu?.classList.remove(
                        "open"
                    );


                    const icon =
                        menuToggle?.querySelector(
                            "i"
                        );


                    icon?.classList.remove(
                        "fa-xmark"
                    );

                    icon?.classList.add(
                        "fa-bars"
                    );

                }
            );

        });


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    function updateActiveNav() {

        let current = "";


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop - 160;

                const sectionHeight =
                    section.offsetHeight;


                if (
                    window.scrollY >=
                        sectionTop &&
                    window.scrollY <
                        sectionTop +
                        sectionHeight
                ) {

                    current =
                        section.getAttribute(
                            "id"
                        );
                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );
                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNav
    );


    updateActiveNav();


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
       PROJECT FILTER
    ========================================================= */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );

    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter;


                    projectCards.forEach(
                        card => {

                            const category =
                                card.dataset.category;


                            if (
                                filter ===
                                    "all" ||
                                category ===
                                    filter
                            ) {

                                card.style.display =
                                    "block";


                                setTimeout(
                                    () => {

                                        card.style.opacity =
                                            "1";

                                        card.style.transform =
                                            "scale(1)";

                                    },
                                    30
                                );

                            } else {

                                card.style.opacity =
                                    "0";

                                card.style.transform =
                                    "scale(0.95)";


                                setTimeout(
                                    () => {

                                        card.style.display =
                                            "none";

                                    },
                                    250
                                );
                            }

                        }
                    );

                }
            );

        }
    );


    /* =========================================================
       COUNTER ANIMATION
    ========================================================= */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const counterObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const counter =
                                entry.target;


                            const target =
                                Number(
                                    counter.dataset.target
                                );


                            let current =
                                0;


                            const duration =
                                1500;


                            const startTime =
                                performance.now();


                            function updateCounter(
                                currentTime
                            ) {

                                const progress =
                                    Math.min(

                                        (
                                            currentTime -
                                            startTime
                                        ) /
                                        duration,

                                        1

                                    );


                                const easedProgress =
                                    1 -
                                    Math.pow(
                                        1 -
                                        progress,
                                        3
                                    );


                                current =
                                    Math.floor(
                                        easedProgress *
                                        target
                                    );


                                counter.textContent =
                                    current;


                                if (
                                    progress < 1
                                ) {

                                    requestAnimationFrame(
                                        updateCounter
                                    );

                                } else {

                                    counter.textContent =
                                        target +
                                        "+";
                                }

                            }


                            requestAnimationFrame(
                                updateCounter
                            );


                            counterObserver.unobserve(
                                counter
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(
            counter => {

                counterObserver.observe(
                    counter
                );

            }
        );

    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".service-card, .project-card, .feature, .stat-card, .process-step, .testimonial-card, .pricing-card, .team-card"
        );


    revealElements.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

        }
    );


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";


                            revealObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.style.opacity =
                    "1";

                element.style.transform =
                    "translateY(0)";

            }
        );
    }


    /* =========================================================
       CONTACT FORM
    ========================================================= */

    const projectForm =
        document.getElementById(
            "projectForm"
        );

    const formMessage =
        document.getElementById(
            "formMessage"
        );


    projectForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    ?.value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    ?.value
                    .trim();


            /* Required fields */

            if (
                !name ||
                !email ||
                !phone ||
                !message
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please fill all required fields.";

                    formMessage.style.color =
                        "#f87171";
                }

                return;
            }


            /* Email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email
                )
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please enter a valid email address.";

                    formMessage.style.color =
                        "#f87171";
                }

                return;
            }


            /* Phone validation */

            const phoneDigits =
                phone.replace(
                    /\D/g,
                    ""
                );


            if (
                phoneDigits.length < 10
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please enter a valid phone number.";

                    formMessage.style.color =
                        "#f87171";
                }

                return;
            }


            /* =================================================
               FORM DATA
            ================================================= */

            const formData = {

                name:
                    document
                        .getElementById(
                            "name"
                        )
                        ?.value ||
                    "",


                business:
                    document
                        .getElementById(
                            "business"
                        )
                        ?.value ||
                    "",


                email:
                    document
                        .getElementById(
                            "email"
                        )
                        ?.value ||
                    "",


                phone:
                    document
                        .getElementById(
                            "phone"
                        )
                        ?.value ||
                    "",


                city:
                    document
                        .getElementById(
                            "city"
                        )
                        ?.value ||
                    "",


                service:
                    document
                        .getElementById(
                            "service"
                        )
                        ?.value ||
                    "",


                budget:
                    document
                        .getElementById(
                            "budget"
                        )
                        ?.value ||
                    "",


                message:
                    document
                        .getElementById(
                            "message"
                        )
                        ?.value ||
                    ""

            };


            /* =================================================
               SUBMIT BUTTON
            ================================================= */

            const submitButton =
                projectForm.querySelector(
                    ".form-submit"
                );


            const originalButtonText =
                submitButton?.innerHTML;


            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            }


            /* =================================================
               SEND TO RENDER BACKEND
            ================================================= */

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/leads`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
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


                if (
                    !response.ok
                ) {

                    throw new Error(
                        result.message ||
                        "Unable to submit request."
                    );
                }


                /* =================================================
                   SUCCESS
                ================================================= */

                if (formMessage) {

                    formMessage.textContent =
                        "Thank you! Your project request has been received.";

                    formMessage.style.color =
                        "#60a5fa";
                }


                projectForm.reset();


                if (submitButton) {

                    submitButton.innerHTML =
                        'Request Sent <i class="fa-solid fa-check"></i>';


                    setTimeout(
                        () => {

                            submitButton.innerHTML =
                                originalButtonText ||
                                "Send Project Request";


                            submitButton.disabled =
                                false;

                        },
                        3000
                    );
                }


                console.log(
                    "Lead successfully sent to backend:",
                    result
                );


            } catch (error) {

                console.error(
                    "Lead submission error:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "Unable to send request. Please try again.";

                    formMessage.style.color =
                        "#f87171";
                }


                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        originalButtonText ||
                        "Send Project Request";
                }

            }

        }
    );


    /* =========================================================
       TEAM MEMBERS
    ========================================================= */

    const teamGrid =
        document.getElementById(
            "teamGrid"
        );


    async function loadTeamMembers() {

        if (!teamGrid) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/team`,
                    {
                        method: "GET"
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Failed to load team members"
                );
            }


            const result =
                await response.json();


            /* Support different backend response formats */

            const members =
                Array.isArray(result)
                    ? result
                    : Array.isArray(
                        result.team
                    )
                        ? result.team
                        : Array.isArray(
                            result.data
                        )
                            ? result.data
                            : [];


            /* Only active members */

            const activeMembers =
                members
                    .filter(
                        member =>
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


            /* No members */

            if (
                !activeMembers.length
            ) {

                teamGrid.innerHTML = `
                    <div class="team-empty">
                        Our team members will appear here soon.
                    </div>
                `;

                return;
            }


            /* =================================================
               TEAM HTML
            ================================================= */

            teamGrid.innerHTML =
                activeMembers
                    .map(
                        member => {

                            const photo =
                                getTeamPhotoUrl(
                                    member.photo
                                );


                            const name =
                                escapeHTML(
                                    member.name ||
                                    "Team Member"
                                );


                            const designation =
                                escapeHTML(
                                    member.designation ||
                                    ""
                                );


                            const description =
                                escapeHTML(
                                    member.description ||
                                    ""
                                );


                            const linkedin =
                                safeExternalUrl(
                                    member.linkedin
                                );


                            const instagram =
                                safeExternalUrl(
                                    member.instagram
                                );


                            const github =
                                safeExternalUrl(
                                    member.github
                                );


                            const imageSource =
                                photo ||
                                "images/default-team.jpg";


                            return `

                                <article class="team-card">

                                    <div class="team-photo">

                                        <img
                                            src="${escapeHTML(
                                                imageSource
                                            )}"
                                            alt="${name}"
                                            loading="lazy"
                                            onerror="this.onerror=null;this.src='images/default-team.jpg';"
                                        >

                                    </div>


                                    <div class="team-info">

                                        <h3>
                                            ${name}
                                        </h3>


                                        <span class="team-designation">
                                            ${designation}
                                        </span>


                                        <p>
                                            ${description}
                                        </p>


                                        <div class="team-socials">

                                            ${
                                                linkedin
                                                    ? `
                                                        <a
                                                            href="${escapeHTML(
                                                                linkedin
                                                            )}"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label="LinkedIn"
                                                        >
                                                            <i class="fa-brands fa-linkedin-in"></i>
                                                        </a>
                                                    `
                                                    : ""
                                            }


                                            ${
                                                instagram
                                                    ? `
                                                        <a
                                                            href="${escapeHTML(
                                                                instagram
                                                            )}"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label="Instagram"
                                                        >
                                                            <i class="fa-brands fa-instagram"></i>
                                                        </a>
                                                    `
                                                    : ""
                                            }


                                            ${
                                                github
                                                    ? `
                                                        <a
                                                            href="${escapeHTML(
                                                                github
                                                            )}"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label="GitHub"
                                                        >
                                                            <i class="fa-brands fa-github"></i>
                                                        </a>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </div>

                                </article>

                            `;
                        }
                    )
                    .join("");


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
       ESCAPE HTML
       Prevents unsafe HTML from database fields
    ========================================================= */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
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
       SAFE SOCIAL URL
    ========================================================= */

    function safeExternalUrl(value) {

        if (!value) {
            return "";
        }


        const url =
            String(value).trim();


        try {

            const parsed =
                new URL(url);


            if (
                parsed.protocol ===
                    "http:" ||
                parsed.protocol ===
                    "https:"
            ) {

                return parsed.href;
            }


            return "";

        } catch {

            return "";
        }

    }


    /* Load team */

    loadTeamMembers();


    /* =========================================================
       SMOOTH ANCHOR LINKS
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }
                );

            }
        );


    /* =========================================================
       CURSOR GLOW
    ========================================================= */

    const cursorGlow =
        document.createElement(
            "div"
        );


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
        "none";


    document.body.appendChild(
        cursorGlow
    );


    if (
        window.innerWidth > 900
    ) {

        cursorGlow.style.display =
            "block";


        document.addEventListener(
            "mousemove",
            event => {

                cursorGlow.style.left =
                    event.clientX + "px";

                cursorGlow.style.top =
                    event.clientY + "px";

            }
        );

    }


    /* =========================================================
       ESCAPE KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                navMenu?.classList.remove(
                    "open"
                );


                const icon =
                    menuToggle?.querySelector(
                        "i"
                    );


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
       WEBSITE READY
    ========================================================= */

    console.log(
        "GrowtechAxon website initialized successfully."
    );

});