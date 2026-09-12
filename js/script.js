document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       GROWTECH AXON - MAIN WEBSITE JS
       Production Ready
    ========================================================= */


    /* =========================================================
       API CONFIG
    ========================================================= */

    const API_URL =
        "https://growtechaxon-backend.onrender.com";


    /* =========================================================
       PRELOADER
    ========================================================= */

    const preloader =
        document.getElementById("preloader");


    function hidePreloader() {

        if (preloader) {

            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            preloader.style.pointerEvents = "none";

        }

    }


    window.addEventListener("load", () => {

        setTimeout(hidePreloader, 500);

    });


    // Safety fallback
    setTimeout(hidePreloader, 3000);



    /* =========================================================
       HEADER SCROLL
    ========================================================= */

    const header =
        document.getElementById("header");

    const backToTop =
        document.getElementById("backToTop");


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

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    menuToggle?.addEventListener(
        "click",
        () => {

            navMenu?.classList.toggle("open");


            const icon =
                menuToggle.querySelector("i");


            if (
                navMenu?.classList.contains("open")
            ) {

                icon?.classList.remove("fa-bars");

                icon?.classList.add("fa-xmark");

            } else {

                icon?.classList.remove("fa-xmark");

                icon?.classList.add("fa-bars");

            }

        }
    );



    /* =========================================================
       CLOSE MOBILE MENU
    ========================================================= */

    document
        .querySelectorAll(".nav-link, .nav-cta")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu?.classList.remove("open");


                    const icon =
                        menuToggle?.querySelector("i");


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


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 160;


            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                    sectionTop + sectionHeight
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                `#${current}`
            ) {

                link.classList.add("active");

            }

        });

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


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                projectCards.forEach(card => {

                    const category =
                        card.dataset.category;


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.style.display =
                            "block";


                        setTimeout(() => {

                            card.style.opacity =
                                "1";

                            card.style.transform =
                                "scale(1)";

                        }, 30);

                    } else {

                        card.style.opacity =
                            "0";

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



    /* =========================================================
       COUNTER ANIMATION
    ========================================================= */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

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


                        let current = 0;


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
                                    ) / duration,
                                    1
                                );


                            const easedProgress =
                                1 -
                                Math.pow(
                                    1 - progress,
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
                                    target + "+";

                            }

                        }


                        requestAnimationFrame(
                            updateCounter
                        );


                        counterObserver.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(
                counter
            );

        });

    }



    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            `
            .service-card,
            .project-card,
            .feature,
            .stat-card,
            .process-step,
            .testimonial-card,
            .pricing-card,
            .team-card
            `
        );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

    });


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
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


                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(
                element
            );

        });

    } else {

        revealElements.forEach(element => {

            element.style.opacity = "1";

            element.style.transform =
                "translateY(0)";

        });

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



            /* ================= REQUIRED ================= */

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



            /* ================= EMAIL ================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please enter a valid email address.";

                    formMessage.style.color =
                        "#f87171";

                }

                return;

            }



            /* ================= PHONE ================= */

            const phoneDigits =
                phone.replace(/\D/g, "");


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



            /* ================= FORM DATA ================= */

            const formData = {

                name:
                    document
                        .getElementById("name")
                        ?.value || "",


                business:
                    document
                        .getElementById("business")
                        ?.value || "",


                email:
                    document
                        .getElementById("email")
                        ?.value || "",


                phone:
                    document
                        .getElementById("phone")
                        ?.value || "",


                city:
                    document
                        .getElementById("city")
                        ?.value || "",


                service:
                    document
                        .getElementById("service")
                        ?.value || "",


                budget:
                    document
                        .getElementById("budget")
                        ?.value || "",


                message:
                    document
                        .getElementById("message")
                        ?.value || ""

            };



            /* ================= BUTTON ================= */

            const submitButton =
                projectForm.querySelector(
                    ".form-submit"
                );


            const originalButtonText =
                submitButton?.innerHTML;


            if (submitButton) {

                submitButton.disabled = true;


                submitButton.innerHTML =
                    'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            }



            /* ================= SEND ================= */

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


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to submit request."
                    );

                }



                /* ================= SUCCESS ================= */

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


                    setTimeout(() => {

                        submitButton.innerHTML =
                            originalButtonText ||
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



    /* =========================================================
       HTML ESCAPE
    ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    /* =========================================================
       TEAM IMAGE URL FIX
       
       Converts old localhost URLs:
       
       http://localhost:5000/uploads/team/...
       
       into:
       
       https://growtechaxon-backend.onrender.com/uploads/team/...
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


        /* Relative upload URL */

        if (
            photoUrl.startsWith(
                "/uploads/"
            )
        ) {

            photoUrl =
                API_URL +
                photoUrl;

        }


        return photoUrl;

    }



    /* =========================================================
       TEAM PLACEHOLDER
    ========================================================= */

    function getTeamPlaceholder(
        name
    ) {

        const firstLetter =
            String(name || "G")
                .trim()
                .charAt(0)
                .toUpperCase() ||
            "G";


        return `
            <div
                class="team-photo-placeholder"
                aria-label="Team member placeholder"
            >
                <span>${escapeHTML(firstLetter)}</span>
            </div>
        `;

    }



    /* =========================================================
       LOAD TEAM MEMBERS
    ========================================================= */

    async function loadTeamMembers() {

        if (!teamGrid) {
            return;
        }


        teamGrid.innerHTML = `
            <div class="team-empty">
                Loading our team...
            </div>
        `;


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

                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Team API error: ${response.status}`
                );

            }


            const result =
                await response.json();


            /*
                Backend currently returns:
                { success: true, team: [...] }

                This also supports:
                [...]
                { data: [...] }
            */

            const members =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result.team)
                        ? result.team
                        : Array.isArray(result.data)
                            ? result.data
                            : [];


            const activeMembers =
                members
                    .filter(
                        member =>
                            member.active !== false
                    )
                    .sort(
                        (a, b) =>
                            Number(
                                a.displayOrder || 0
                            ) -
                            Number(
                                b.displayOrder || 0
                            )
                    );


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



            /* ================= RENDER TEAM ================= */

            teamGrid.innerHTML =
                activeMembers
                    .map(member => {

                        const name =
                            member.name ||
                            "Team Member";


                        const designation =
                            member.designation ||
                            "";


                        const description =
                            member.description ||
                            "";


                        const photo =
                            getTeamPhotoUrl(
                                member.photo
                            );


                        const safeName =
                            escapeHTML(
                                name
                            );


                        const safeDesignation =
                            escapeHTML(
                                designation
                            );


                        const safeDescription =
                            escapeHTML(
                                description
                            );


                        const photoHTML =
                            photo

                                ? `
                                    <img
                                        src="${escapeHTML(photo)}"
                                        alt="${safeName}"
                                        loading="lazy"
                                        onerror="
                                            this.style.display='none';
                                            this.parentElement.classList.add('photo-error');
                                            this.parentElement.insertAdjacentHTML(
                                                'beforeend',
                                                '<div class=&quot;team-photo-placeholder&quot;><span>${escapeHTML(
                                                    String(name).trim().charAt(0).toUpperCase() || "G"
                                                )}</span></div>'
                                            );
                                        "
                                    >
                                `

                                : getTeamPlaceholder(
                                    name
                                );



                        /* ================= SOCIAL LINKS ================= */

                        let socialHTML =
                            "";


                        if (
                            member.linkedin
                        ) {

                            socialHTML += `
                                <a
                                    href="${escapeHTML(
                                        member.linkedin
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <i class="fa-brands fa-linkedin-in"></i>
                                </a>
                            `;

                        }


                        if (
                            member.instagram
                        ) {

                            socialHTML += `
                                <a
                                    href="${escapeHTML(
                                        member.instagram
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <i class="fa-brands fa-instagram"></i>
                                </a>
                            `;

                        }


                        if (
                            member.github
                        ) {

                            socialHTML += `
                                <a
                                    href="${escapeHTML(
                                        member.github
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                >
                                    <i class="fa-brands fa-github"></i>
                                </a>
                            `;

                        }



                        return `
                            <article
                                class="team-card"
                            >

                                <div
                                    class="team-photo"
                                >

                                    ${photoHTML}

                                </div>


                                <div
                                    class="team-info"
                                >

                                    <h3>
                                        ${safeName}
                                    </h3>


                                    <span
                                        class="team-designation"
                                    >
                                        ${safeDesignation}
                                    </span>


                                    ${
                                        description
                                            ? `
                                                <p>
                                                    ${safeDescription}
                                                </p>
                                            `
                                            : ""
                                    }


                                    ${
                                        socialHTML
                                            ? `
                                                <div
                                                    class="team-socials"
                                                >
                                                    ${socialHTML}
                                                </div>
                                            `
                                            : ""
                                    }

                                </div>

                            </article>
                        `;

                    })
                    .join("");


            /*
                Because team cards are inserted dynamically,
                apply reveal animation manually.
            */

            const newTeamCards =
                teamGrid.querySelectorAll(
                    ".team-card"
                );


            newTeamCards.forEach(card => {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(25px)";

                card.style.transition =
                    "opacity 0.7s ease, transform 0.7s ease";


                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        card.style.opacity =
                            "1";

                        card.style.transform =
                            "translateY(0)";

                    });

                });

            });


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


    loadTeamMembers();



    /* =========================================================
       SMOOTH ANCHOR LINKS
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

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

                        behavior: "smooth",

                        block: "start"

                    });

                }
            );

        });



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
                event.key === "Escape"
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