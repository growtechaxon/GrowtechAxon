document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       GROWTECHAXON API
       ========================================================= */

    const API_URL = "https://growtechaxon-backend.onrender.com";


    /* =========================================================
       PRELOADER
       ========================================================= */

    const preloader = document.getElementById("preloader");

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

    setTimeout(hidePreloader, 3000);


    /* =========================================================
       HEADER SCROLL
       ========================================================= */

    const header = document.getElementById("header");
    const backToTop = document.getElementById("backToTop");

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

    window.addEventListener("scroll", handleScroll);
    handleScroll();


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    menuToggle?.addEventListener("click", () => {

        navMenu?.classList.toggle("open");

        const icon = menuToggle.querySelector("i");

        if (navMenu?.classList.contains("open")) {
            icon?.classList.remove("fa-bars");
            icon?.classList.add("fa-xmark");
        } else {
            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        }
    });


    /* =========================================================
       CLOSE MOBILE MENU
       ========================================================= */

    document.querySelectorAll(".nav-link, .nav-cta").forEach(link => {

        link.addEventListener("click", () => {

            navMenu?.classList.remove("open");

            const icon = menuToggle?.querySelector("i");

            icon?.classList.remove("fa-xmark");
            icon?.classList.add("fa-bars");
        });

    });


    /* =========================================================
       ACTIVE NAVIGATION
       ========================================================= */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveNav() {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav();


    /* =========================================================
       BACK TO TOP
       ========================================================= */

    backToTop?.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =========================================================
       PROJECT FILTER
       ========================================================= */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            projectCards.forEach(card => {

                const category = card.dataset.category;

                if (filter === "all" || category === filter) {

                    card.style.display = "block";

                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 30);

                } else {

                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";

                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);
                }

            });

        });

    });


    /* =========================================================
       COUNTER ANIMATION
       ========================================================= */

    const counters = document.querySelectorAll(".counter");

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const counter = entry.target;
                    const target = Number(counter.dataset.target);

                    let current = 0;

                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {

                        const progress = Math.min(
                            (currentTime - startTime) / duration,
                            1
                        );

                        const easedProgress =
                            1 - Math.pow(1 - progress, 3);

                        current = Math.floor(
                            easedProgress * target
                        );

                        counter.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + "+";
                        }
                    }

                    requestAnimationFrame(updateCounter);

                    counterObserver.unobserve(counter);
                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    }


    /* =========================================================
       SCROLL REVEAL
       ========================================================= */

    const revealElements = document.querySelectorAll(
        ".service-card, .project-card, .feature, .stat-card, .process-step, .testimonial-card, .pricing-card, .team-card"
    );

    revealElements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

    });


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                    revealObserver.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });

    }


    /* =========================================================
       CONTACT FORM
       ========================================================= */

    const projectForm = document.getElementById("projectForm");
    const formMessage = document.getElementById("formMessage");

    projectForm?.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("name")?.value.trim();

        const email =
            document.getElementById("email")?.value.trim();

        const phone =
            document.getElementById("phone")?.value.trim();

        const message =
            document.getElementById("message")?.value.trim();


        /* Required fields */

        if (!name || !email || !phone || !message) {

            if (formMessage) {

                formMessage.textContent =
                    "Please fill all required fields.";

                formMessage.style.color = "#f87171";
            }

            return;
        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            if (formMessage) {

                formMessage.textContent =
                    "Please enter a valid email address.";

                formMessage.style.color = "#f87171";
            }

            return;
        }


        /* Phone validation */

        const phoneDigits =
            phone.replace(/\D/g, "");

        if (phoneDigits.length < 10) {

            if (formMessage) {

                formMessage.textContent =
                    "Please enter a valid phone number.";

                formMessage.style.color = "#f87171";
            }

            return;
        }


        /* Form Data */

        const formData = {

            name:
                document.getElementById("name")?.value || "",

            business:
                document.getElementById("business")?.value || "",

            email:
                document.getElementById("email")?.value || "",

            phone:
                document.getElementById("phone")?.value || "",

            city:
                document.getElementById("city")?.value || "",

            service:
                document.getElementById("service")?.value || "",

            budget:
                document.getElementById("budget")?.value || "",

            message:
                document.getElementById("message")?.value || ""
        };


        /* Submit Button */

        const submitButton =
            projectForm.querySelector(".form-submit");

        const originalButtonText =
            submitButton?.innerHTML;


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        }


        /* =====================================================
           SEND LEAD TO RENDER BACKEND
           ===================================================== */

        try {

            const response = await fetch(
                `${API_URL}/api/leads`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to submit request."
                );
            }


            /* Success */

            if (formMessage) {

                formMessage.textContent =
                    "Thank you! Your project request has been received.";

                formMessage.style.color = "#60a5fa";
            }


            projectForm.reset();


            if (submitButton) {

                submitButton.innerHTML =
                    'Request Sent <i class="fa-solid fa-check"></i>';

                setTimeout(() => {

                    submitButton.innerHTML =
                        originalButtonText ||
                        "Send Project Request";

                    submitButton.disabled = false;

                }, 3000);
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

                formMessage.style.color = "#f87171";
            }


            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonText ||
                    "Send Project Request";
            }
        }

    });


    /* =========================================================
       TEAM MEMBERS
       ========================================================= */

    const teamGrid = document.getElementById("teamGrid");


    /* =========================================================
       TEAM IMAGE URL NORMALIZER
       ========================================================= */

    function getTeamPhotoUrl(photo) {

        if (!photo) {
            return "";
        }

        let imageUrl = String(photo).trim();

        /* Old localhost URL */

        if (
            imageUrl.startsWith("http://localhost:5000")
        ) {

            imageUrl =
                imageUrl.replace(
                    "http://localhost:5000",
                    API_URL
                );
        }


        /* Old 127.0.0.1 URL */

        if (
            imageUrl.startsWith("http://127.0.0.1:5000")
        ) {

            imageUrl =
                imageUrl.replace(
                    "http://127.0.0.1:5000",
                    API_URL
                );
        }


        /* HTTP Render URL */

        if (
            imageUrl.startsWith(
                "http://growtechaxon-backend.onrender.com"
            )
        ) {

            imageUrl =
                imageUrl.replace(
                    "http://growtechaxon-backend.onrender.com",
                    API_URL
                );
        }


        /* Relative /uploads URL */

        if (imageUrl.startsWith("/uploads/")) {

            imageUrl =
                `${API_URL}${imageUrl}`;
        }


        /* Relative uploads/team URL */

        if (imageUrl.startsWith("uploads/team/")) {

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
                viewBox="0 0 600 600">

                <rect
                    width="600"
                    height="600"
                    fill="#08152b"/>

                <circle
                    cx="300"
                    cy="210"
                    r="90"
                    fill="#2563eb"/>

                <circle
                    cx="300"
                    cy="210"
                    r="50"
                    fill="#dbeafe"/>

                <path
                    d="M145 500
                       C160 370 220 310 300 310
                       C380 310 440 370 455 500Z"
                    fill="#2563eb"/>

                <text
                    x="300"
                    y="555"
                    text-anchor="middle"
                    fill="#ffffff"
                    font-family="Arial, sans-serif"
                    font-size="24"
                    font-weight="600">
                    GrowtechAxon
                </text>

            </svg>
        `;

        return "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(svg);
    }


    /* =========================================================
       CREATE TEAM CARD
       ========================================================= */

    function createTeamCard(member) {

        const article =
            document.createElement("article");

        article.className = "team-card";


        /* Team photo */

        const photoWrapper =
            document.createElement("div");

        photoWrapper.className = "team-photo";


        const image =
            document.createElement("img");

        image.loading = "lazy";

        image.alt =
            member.name || "Team Member";


        const imageUrl =
            getTeamPhotoUrl(member.photo);


        /*
         * Agar image URL available hai to use load karo.
         * Nahi to direct fallback image.
         */

        if (imageUrl) {

            image.src = imageUrl;

        } else {

            image.src = getDefaultTeamImage();
        }


        /*
         * Image load fail hone par safe fallback.
         * Koi inline onerror HTML nahi.
         */

        image.addEventListener("error", () => {

            if (image.dataset.fallbackApplied === "true") {
                return;
            }

            image.dataset.fallbackApplied = "true";

            image.src = getDefaultTeamImage();

        });


        photoWrapper.appendChild(image);


        /* Team info */

        const info =
            document.createElement("div");

        info.className = "team-info";


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


        /* Social links */

        const socials =
            document.createElement("div");

        socials.className =
            "team-socials";


        /* LinkedIn */

        if (member.linkedin) {

            const link =
                document.createElement("a");

            link.href =
                member.linkedin;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.setAttribute(
                "aria-label",
                "LinkedIn"
            );

            link.innerHTML =
                '<i class="fa-brands fa-linkedin-in"></i>';

            socials.appendChild(link);
        }


        /* Instagram */

        if (member.instagram) {

            const link =
                document.createElement("a");

            link.href =
                member.instagram;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.setAttribute(
                "aria-label",
                "Instagram"
            );

            link.innerHTML =
                '<i class="fa-brands fa-instagram"></i>';

            socials.appendChild(link);
        }


        /* GitHub */

        if (member.github) {

            const link =
                document.createElement("a");

            link.href =
                member.github;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.setAttribute(
                "aria-label",
                "GitHub"
            );

            link.innerHTML =
                '<i class="fa-brands fa-github"></i>';

            socials.appendChild(link);
        }


        /* Append info */

        info.appendChild(name);
        info.appendChild(designation);
        info.appendChild(description);

        if (socials.children.length > 0) {
            info.appendChild(socials);
        }


        /* Complete card */

        article.appendChild(photoWrapper);
        article.appendChild(info);


        return article;
    }


    /* =========================================================
       LOAD TEAM MEMBERS
       ========================================================= */

    async function loadTeamMembers() {

        if (!teamGrid) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/team`,
                    {
                        method: "GET",

                        headers: {
                            "Accept": "application/json"
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
                            (Number(a.displayOrder) || 0) -
                            (Number(b.displayOrder) || 0)
                    );


            /* No team members */

            if (!activeMembers.length) {

                teamGrid.innerHTML = `
                    <div class="team-empty">
                        Our team members will appear here soon.
                    </div>
                `;

                return;
            }


            /* Clear old content */

            teamGrid.innerHTML = "";


            /* Add team cards */

            activeMembers.forEach(member => {

                const card =
                    createTeamCard(member);

                teamGrid.appendChild(card);

            });


            /*
             * Scroll reveal ke liye newly created
             * team cards ko visible rakho.
             */

            teamGrid
                .querySelectorAll(".team-card")
                .forEach(card => {

                    card.style.opacity = "1";
                    card.style.transform =
                        "translateY(0)";
                });


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


    loadTeamMembers();


    /* =========================================================
       SMOOTH ANCHOR LINKS
       ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =========================================================
       CURSOR GLOW
       ========================================================= */

    const cursorGlow =
        document.createElement("div");


    cursorGlow.style.position = "fixed";
    cursorGlow.style.width = "180px";
    cursorGlow.style.height = "180px";
    cursorGlow.style.borderRadius = "50%";
    cursorGlow.style.pointerEvents = "none";
    cursorGlow.style.zIndex = "0";

    cursorGlow.style.background =
        "radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)";

    cursorGlow.style.transform =
        "translate(-50%, -50%)";

    cursorGlow.style.display = "none";


    document.body.appendChild(cursorGlow);


    if (window.innerWidth > 900) {

        cursorGlow.style.display = "block";


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

            if (event.key === "Escape") {

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

        }
    );


    /* =========================================================
       WEBSITE READY
       ========================================================= */

    console.log(
        "GrowtechAxon website initialized successfully."
    );

    console.log(
        "Backend API:",
        API_URL
    );

});