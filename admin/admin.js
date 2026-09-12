/* =========================================================
   GROWTECH AXON - ADMIN PANEL
   Leads + Team Management
   Image Upload + Preview
========================================================= */


/* =========================================================
   API CONFIG
========================================================= */

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : window.location.origin;


/* =========================================================
   COMMON HELPERS
========================================================= */

function getAdminToken() {
    return localStorage.getItem("growtechAdminToken");
}


function redirectToLogin() {
    localStorage.removeItem("growtechAdminToken");
    window.location.href = "login.html";
}


async function getJSON(response) {

    const text = await response.text();

    try {

        return text
            ? JSON.parse(text)
            : {};

    } catch {

        return {
            success: false,
            message: text || "Invalid server response."
        };
    }
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatLeadDate(lead) {

    if (lead?.createdAt) {

        const date =
            new Date(lead.createdAt);

        if (!isNaN(date.getTime())) {

            return escapeHTML(
                date.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })
            );
        }
    }

    return escapeHTML(
        lead?.date || "-"
    );
}


function getPhoneNumber(phone) {

    return String(phone || "")
        .replace(/\D/g, "");
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document
                    .getElementById("username")
                    ?.value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    ?.value || "";

            const button =
                loginForm.querySelector("button");


            if (!username || !password) {

                if (loginMessage) {

                    loginMessage.textContent =
                        "Please enter username and password.";
                }

                return;
            }


            if (button) {
                button.disabled = true;
            }


            if (loginMessage) {

                loginMessage.textContent =
                    "Signing in...";
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/admin/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username,
                                    password
                                })
                        }
                    );


                const data =
                    await getJSON(response);


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Login failed."
                    );
                }


                if (!data.token) {

                    throw new Error(
                        "Login successful but token was not received."
                    );
                }


                localStorage.setItem(
                    "growtechAdminToken",
                    data.token
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "Login successful!";
                }


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 500);


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        error.message ||
                        "Unable to login.";
                }


            } finally {

                if (button) {
                    button.disabled = false;
                }
            }

        }
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

const leadsTable =
    document.getElementById("leadsTable");


if (leadsTable) {

    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();

    } else {

        initializeDashboard();
    }
}


/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

function initializeDashboard() {

    loadLeads();

    initializeLeadFilters();

    initializeRefresh();

    initializeLogout();
}


/* =========================================================
   LOAD LEADS
========================================================= */

async function loadLeads() {

    const table =
        document.getElementById("leadsTable");

    if (!table) return;


    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="10" class="loading">
                Loading customer leads...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            redirectToLogin();
            return;
        }


        const data =
            await getJSON(response);


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load leads."
            );
        }


        window.allLeads =
            Array.isArray(data.leads)
                ? data.leads
                : [];


        displayLeads(
            window.allLeads
        );


        updateStats(
            window.allLeads
        );


    } catch (error) {

        console.error(
            "Load leads error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    ❌ Unable to load customer leads.
                    <br>
                    <small>
                        ${escapeHTML(error.message)}
                    </small>
                </td>
            </tr>
        `;
    }
}


/* =========================================================
   DISPLAY LEADS
========================================================= */

function displayLeads(leads) {

    const table =
        document.getElementById("leadsTable");


    if (!table) return;


    if (
        !Array.isArray(leads) ||
        leads.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    No customer leads found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        leads.map(
            (lead, index) => {

                const leadId =
                    String(
                        lead._id || ""
                    );


                const phone =
                    getPhoneNumber(
                        lead.phone
                    );


                const status =
                    lead.status || "New";


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    lead.name || "-"
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.business || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.email || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.phone || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.service || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.budget || "-"
                            )}
                        </td>

                        <td>

                            <select
                                class="lead-status"
                                data-id="${escapeHTML(leadId)}"
                                aria-label="Lead status"
                            >

                                <option
                                    value="New"
                                    ${
                                        status === "New"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    New
                                </option>

                                <option
                                    value="Contacted"
                                    ${
                                        status === "Contacted"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Contacted
                                </option>

                                <option
                                    value="Converted"
                                    ${
                                        status === "Converted"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Converted
                                </option>

                                <option
                                    value="Closed"
                                    ${
                                        status === "Closed"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Closed
                                </option>

                            </select>

                        </td>

                        <td>
                            ${formatLeadDate(lead)}
                        </td>

                        <td>

                            <div class="lead-actions">

                                <button
                                    type="button"
                                    class="action-btn action-view"
                                    data-action="view"
                                    data-id="${escapeHTML(leadId)}"
                                >
                                    View
                                </button>


                                ${
                                    phone
                                        ? `
                                            <a
                                                href="tel:${phone}"
                                                class="action-btn action-call"
                                            >
                                                Call
                                            </a>

                                            <a
                                                href="https://wa.me/${phone}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="action-btn action-whatsapp"
                                            >
                                                WA
                                            </a>
                                        `
                                        : ""
                                }


                                <button
                                    type="button"
                                    class="action-btn action-delete"
                                    data-action="delete"
                                    data-id="${escapeHTML(leadId)}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            }
        )
        .join("");


    attachLeadActions();
}


/* =========================================================
   LEAD ACTION EVENTS
========================================================= */

function attachLeadActions() {

    document
        .querySelectorAll(".lead-status")
        .forEach(select => {

            select.addEventListener(
                "change",
                async () => {

                    const id =
                        select.dataset.id;

                    const status =
                        select.value;


                    await updateStatus(
                        id,
                        status
                    );
                }
            );
        });


    document
        .querySelectorAll(
            "[data-action='view']"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    viewLead(
                        button.dataset.id
                    );
                }
            );
        });


    document
        .querySelectorAll(
            "[data-action='delete']"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteLead(
                        button.dataset.id
                    );
                }
            );
        });
}


/* =========================================================
   UPDATE LEAD STATUS
========================================================= */

async function updateStatus(
    id,
    status
) {

    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/leads/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            status
                        })
                }
            );


        if (response.status === 401) {

            redirectToLogin();
            return;
        }


        const data =
            await getJSON(response);


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to update status."
            );
        }


        const lead =
            (window.allLeads || [])
                .find(
                    item =>
                        String(item._id) ===
                        String(id)
                );


        if (lead) {

            lead.status =
                data.lead?.status ||
                status;
        }


        updateStats(
            window.allLeads || []
        );


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            error.message ||
            "Status update failed."
        );


        loadLeads();
    }
}


/* =========================================================
   DELETE LEAD
========================================================= */

async function deleteLead(id) {

    const lead =
        (window.allLeads || [])
            .find(
                item =>
                    String(item._id) ===
                    String(id)
            );


    if (!lead) {

        alert("Lead not found.");
        return;
    }


    const confirmed =
        confirm(
            `Delete lead of ${
                lead.name ||
                "this customer"
            }?\n\nThis action cannot be undone.`
        );


    if (!confirmed) return;


    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/leads/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            redirectToLogin();
            return;
        }


        const data =
            await getJSON(response);


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to delete lead."
            );
        }


        await loadLeads();


    } catch (error) {

        console.error(
            "Delete lead error:",
            error
        );


        alert(
            error.message ||
            "Delete failed."
        );
    }
}


/* =========================================================
   VIEW LEAD
========================================================= */

function viewLead(id) {

    const lead =
        (window.allLeads || [])
            .find(
                item =>
                    String(item._id) ===
                    String(id)
            );


    if (!lead) {

        alert("Lead not found.");
        return;
    }


    alert(
`CUSTOMER DETAILS

Name: ${lead.name || "-"}

Business: ${lead.business || "-"}

Email: ${lead.email || "-"}

Phone: ${lead.phone || "-"}

City: ${lead.city || "-"}

Service: ${lead.service || "-"}

Budget: ${lead.budget || "-"}

Message:
${lead.message || "-"}

Status: ${lead.status || "New"}

Date:
${formatLeadDate(lead)}`
    );
}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function updateStats(leads) {

    const safeLeads =
        Array.isArray(leads)
            ? leads
            : [];


    const total =
        safeLeads.length;


    const newLeads =
        safeLeads.filter(
            lead =>
                (lead.status || "New") ===
                "New"
        ).length;


    const todayStart =
        new Date();


    todayStart.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrowStart =
        new Date(todayStart);


    tomorrowStart.setDate(
        tomorrowStart.getDate() + 1
    );


    const todayLeads =
        safeLeads.filter(
            lead => {

                if (!lead.createdAt) {
                    return false;
                }


                const created =
                    new Date(
                        lead.createdAt
                    );


                return (
                    created >= todayStart &&
                    created < tomorrowStart
                );
            }
        ).length;


    const converted =
        safeLeads.filter(
            lead =>
                lead.status ===
                "Converted"
        ).length;


    setText(
        "totalLeads",
        total
    );


    setText(
        "newLeads",
        newLeads
    );


    setText(
        "todayLeads",
        todayLeads
    );


    setText(
        "projectLeads",
        converted
    );
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   SEARCH + STATUS FILTER
========================================================= */

function initializeLeadFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );
    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );
    }
}


function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchInput?.value
            .toLowerCase()
            .trim() || "";


    const selectedStatus =
        statusFilter?.value ||
        "all";


    const filtered =
        (window.allLeads || [])
            .filter(
                lead => {

                    const searchableText = `
                        ${lead.name || ""}
                        ${lead.business || ""}
                        ${lead.email || ""}
                        ${lead.phone || ""}
                        ${lead.city || ""}
                        ${lead.service || ""}
                        ${lead.budget || ""}
                    `.toLowerCase();


                    const matchesSearch =
                        !search ||
                        searchableText.includes(
                            search
                        );


                    const matchesStatus =
                        selectedStatus === "all" ||
                        (lead.status || "New") ===
                            selectedStatus;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );


    displayLeads(
        filtered
    );
}


/* =========================================================
   REFRESH
========================================================= */

function initializeRefresh() {

    const refreshBtn =
        document.getElementById(
            "refreshBtn"
        );


    if (!refreshBtn) return;


    refreshBtn.addEventListener(
        "click",
        async () => {

            const originalText =
                refreshBtn.textContent;


            refreshBtn.disabled = true;


            refreshBtn.textContent =
                "↻ Loading...";


            try {

                await loadLeads();

            } finally {

                refreshBtn.disabled = false;

                refreshBtn.textContent =
                    originalText;
            }
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) return;


    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) return;


            localStorage.removeItem(
                "growtechAdminToken"
            );


            window.location.href =
                "login.html";
        }
    );
}


/* =========================================================
   OUR TEAM MANAGEMENT
========================================================= */

const teamTable =
    document.getElementById(
        "teamTable"
    );


const teamModal =
    document.getElementById(
        "teamModal"
    );


const teamForm =
    document.getElementById(
        "teamForm"
    );


const addTeamBtn =
    document.getElementById(
        "addTeamBtn"
    );


const closeTeamModal =
    document.getElementById(
        "closeTeamModal"
    );


const cancelTeamBtn =
    document.getElementById(
        "cancelTeamBtn"
    );


const teamModalTitle =
    document.getElementById(
        "teamModalTitle"
    );


const teamSaveText =
    document.getElementById(
        "teamSaveText"
    );


const teamMessage =
    document.getElementById(
        "teamMessage"
    );


if (teamTable) {

    const teamToken =
        getAdminToken();


    if (!teamToken) {

        redirectToLogin();

    } else {

        initializeTeamManagement();
    }
}


/* =========================================================
   TEAM INITIALIZATION
========================================================= */

function initializeTeamManagement() {

    createTeamPhotoPreview();

    initializeTeamPhotoInput();

    loadTeamMembers();

    initializeTeamModal();

    initializeTeamForm();
}


/* =========================================================
   CREATE IMAGE PREVIEW
========================================================= */

function createTeamPhotoPreview() {

    const photoInput =
        document.getElementById(
            "teamPhoto"
        );


    if (!photoInput) return;


    if (
        document.getElementById(
            "teamPhotoPreview"
        )
    ) {
        return;
    }


    const preview =
        document.createElement(
            "div"
        );


    preview.id =
        "teamPhotoPreview";


    preview.style.marginTop =
        "12px";


    preview.innerHTML = `
        <div
            style="
                display:none;
                position:relative;
                width:120px;
            "
            id="teamPhotoPreviewBox"
        >

            <img
                id="teamPhotoPreviewImage"
                src=""
                alt="Team photo preview"
                style="
                    width:120px;
                    height:120px;
                    object-fit:cover;
                    border-radius:12px;
                    border:1px solid #ddd;
                    display:block;
                "
            >

            <button
                type="button"
                id="removeTeamPhotoPreview"
                style="
                    margin-top:6px;
                    cursor:pointer;
                    padding:5px 10px;
                    border:0;
                    border-radius:6px;
                "
            >
                Remove
            </button>

        </div>
    `;


    photoInput.parentNode.appendChild(
        preview
    );


    const removeButton =
        document.getElementById(
            "removeTeamPhotoPreview"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            () => {

                photoInput.value = "";

                hideTeamPhotoPreview();
            }
        );
    }
}


/* =========================================================
   IMAGE INPUT
========================================================= */

function initializeTeamPhotoInput() {

    const photoInput =
        document.getElementById(
            "teamPhoto"
        );


    if (!photoInput) return;


    photoInput.addEventListener(
        "change",
        handleTeamPhotoChange
    );
}


/* =========================================================
   HANDLE IMAGE CHANGE
========================================================= */

function handleTeamPhotoChange(event) {

    const input =
        event.target;


    const file =
        input.files?.[0];


    if (!file) {

        hideTeamPhotoPreview();
        return;
    }


    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        alert(
            "Only JPG, PNG and WEBP images are allowed."
        );


        input.value = "";

        hideTeamPhotoPreview();

        return;
    }


    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Image size must be less than 5MB."
        );


        input.value = "";

        hideTeamPhotoPreview();

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            showTeamPhotoPreview(
                reader.result
            );
        };


    reader.readAsDataURL(
        file
    );
}


/* =========================================================
   SHOW PHOTO PREVIEW
========================================================= */

function showTeamPhotoPreview(
    src
) {

    const box =
        document.getElementById(
            "teamPhotoPreviewBox"
        );


    const image =
        document.getElementById(
            "teamPhotoPreviewImage"
        );


    if (!box || !image) return;


    image.src =
        src;


    box.style.display =
        "block";
}


/* =========================================================
   HIDE PHOTO PREVIEW
========================================================= */

function hideTeamPhotoPreview() {

    const box =
        document.getElementById(
            "teamPhotoPreviewBox"
        );


    const image =
        document.getElementById(
            "teamPhotoPreviewImage"
        );


    if (box) {

        box.style.display =
            "none";
    }


    if (image) {

        image.src =
            "";
    }
}


/* =========================================================
   LOAD EXISTING PHOTO PREVIEW
========================================================= */

function showExistingTeamPhoto(
    photo
) {

    if (!photo) {

        hideTeamPhotoPreview();
        return;
    }


    showTeamPhotoPreview(
        photo
    );
}


/* =========================================================
   LOAD TEAM MEMBERS
========================================================= */

async function loadTeamMembers() {

    const table =
        document.getElementById(
            "teamTable"
        );


    if (!table) return;


    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Loading team members...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/admin/team`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            redirectToLogin();
            return;
        }


        const data =
            await getJSON(response);


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load team."
            );
        }


        window.allTeamMembers =
            Array.isArray(data.team)
                ? data.team
                : [];


        displayTeamMembers(
            window.allTeamMembers
        );


    } catch (error) {

        console.error(
            "Load team error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    ❌ Unable to load team members.
                    <br>
                    <small>
                        ${escapeHTML(
                            error.message
                        )}
                    </small>
                </td>
            </tr>
        `;
    }
}


/* =========================================================
   DISPLAY TEAM
========================================================= */

function displayTeamMembers(
    team
) {

    const table =
        document.getElementById(
            "teamTable"
        );


    if (!table) return;


    if (
        !Array.isArray(team) ||
        team.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    No team members found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        team.map(
            (member) => {

                const memberId =
                    String(
                        member._id || ""
                    );


                const photo =
                    member.photo || "";


                const photoHTML =
                    photo

                        ? `
                            <img
                                src="${escapeHTML(photo)}"
                                class="team-avatar"
                                alt="${escapeHTML(
                                    member.name ||
                                    "Team Member"
                                )}"
                                style="
                                    width:60px;
                                    height:60px;
                                    object-fit:cover;
                                    border-radius:50%;
                                "
                                onerror="
                                    this.style.display='none';
                                "
                            >
                        `

                        : `
                            <div
                                class="team-no-photo"
                                style="
                                    width:60px;
                                    height:60px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    border-radius:50%;
                                "
                            >
                                GX
                            </div>
                        `;


                return `
                    <tr>

                        <td>
                            ${photoHTML}
                        </td>


                        <td>

                            <strong>
                                ${escapeHTML(
                                    member.name ||
                                    "-"
                                )}
                            </strong>

                        </td>


                        <td>
                            ${escapeHTML(
                                member.designation ||
                                "-"
                            )}
                        </td>


                        <td>
                            ${Number(
                                member.displayOrder ||
                                0
                            )}
                        </td>


                        <td>

                            ${
                                member.active !== false

                                    ? `
                                        <span
                                            class="team-status-active"
                                        >
                                            Active
                                        </span>
                                    `

                                    : `
                                        <span
                                            class="team-status-inactive"
                                        >
                                            Inactive
                                        </span>
                                    `
                            }

                        </td>


                        <td>

                            <div
                                class="team-actions"
                            >

                                <button
                                    type="button"
                                    class="team-action-edit"
                                    onclick="editTeamMember('${memberId}')"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="team-action-toggle"
                                    onclick="toggleTeamMember('${memberId}')"
                                >
                                    ${
                                        member.active !== false
                                            ? "Disable"
                                            : "Activate"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="team-action-delete"
                                    onclick="deleteTeamMember('${memberId}')"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            }
        )
        .join("");
}


/* =========================================================
   TEAM MODAL
========================================================= */

function initializeTeamModal() {

    if (addTeamBtn) {

        addTeamBtn.addEventListener(
            "click",
            openAddTeamModal
        );
    }


    if (closeTeamModal) {

        closeTeamModal.addEventListener(
            "click",
            closeTeamForm
        );
    }


    if (cancelTeamBtn) {

        cancelTeamBtn.addEventListener(
            "click",
            closeTeamForm
        );
    }


    if (teamModal) {

        teamModal.addEventListener(
            "click",
            (e) => {

                if (
                    e.target ===
                    teamModal
                ) {

                    closeTeamForm();
                }
            }
        );
    }
}


/* =========================================================
   OPEN ADD TEAM
========================================================= */

function openAddTeamModal() {

    resetTeamForm();


    if (teamModalTitle) {

        teamModalTitle.textContent =
            "Add Team Member";
    }


    if (teamSaveText) {

        teamSaveText.textContent =
            "Save Team Member";
    }


    if (teamModal) {

        teamModal.classList.add(
            "active"
        );
    }
}


/* =========================================================
   CLOSE TEAM MODAL
========================================================= */

function closeTeamForm() {

    if (teamModal) {

        teamModal.classList.remove(
            "active"
        );
    }


    resetTeamForm();
}


/* =========================================================
   RESET TEAM FORM
========================================================= */

function resetTeamForm() {

    if (!teamForm) return;


    teamForm.reset();


    const teamId =
        document.getElementById(
            "teamId"
        );


    const teamActive =
        document.getElementById(
            "teamActive"
        );


    const teamOrder =
        document.getElementById(
            "teamOrder"
        );


    if (teamId) {

        teamId.value =
            "";
    }


    if (teamActive) {

        teamActive.checked =
            true;
    }


    if (teamOrder) {

        teamOrder.value =
            0;
    }


    hideTeamPhotoPreview();


    if (teamMessage) {

        teamMessage.textContent =
            "";

        teamMessage.className =
            "";
    }
}


/* =========================================================
   TEAM FORM SUBMIT
========================================================= */

function initializeTeamForm() {

    if (!teamForm) return;


    teamForm.addEventListener(
        "submit",
        saveTeamMember
    );
}


/* =========================================================
   SAVE / UPDATE TEAM
   WITH FILE UPLOAD
========================================================= */

async function saveTeamMember(e) {

    e.preventDefault();


    const token =
        getAdminToken();


    if (!token) {

        redirectToLogin();
        return;
    }


    const id =
        document
            .getElementById(
                "teamId"
            )
            ?.value
            .trim();


    const name =
        document
            .getElementById(
                "teamName"
            )
            ?.value
            .trim() || "";


    const designation =
        document
            .getElementById(
                "teamDesignation"
            )
            ?.value
            .trim() || "";


    const description =
        document
            .getElementById(
                "teamDescription"
            )
            ?.value
            .trim() || "";


    const linkedin =
        document
            .getElementById(
                "teamLinkedin"
            )
            ?.value
            .trim() || "";


    const instagram =
        document
            .getElementById(
                "teamInstagram"
            )
            ?.value
            .trim() || "";


    const github =
        document
            .getElementById(
                "teamGithub"
            )
            ?.value
            .trim() || "";


    const displayOrder =
        Number(
            document
                .getElementById(
                    "teamOrder"
                )
                ?.value
        ) || 0;


    const active =
        document
            .getElementById(
                "teamActive"
            )
            ?.checked ?? true;


    const photoInput =
        document.getElementById(
            "teamPhoto"
        );


    const photoFile =
        photoInput?.files?.[0] ||
        null;


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
        !name ||
        !designation
    ) {

        showTeamMessage(
            "Name and designation are required.",
            "error"
        );

        return;
    }


    /* -----------------------------------------------------
       FILE VALIDATION
    ----------------------------------------------------- */

    if (photoFile) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg"
        ];


        if (
            !allowedTypes.includes(
                photoFile.type
            )
        ) {

            showTeamMessage(
                "Only JPG, PNG and WEBP images are allowed.",
                "error"
            );

            return;
        }


        if (
            photoFile.size >
            5 * 1024 * 1024
        ) {

            showTeamMessage(
                "Image must be smaller than 5MB.",
                "error"
            );

            return;
        }
    }


    const isEdit =
        Boolean(id);


    const url =
        isEdit

            ? `${API_URL}/api/admin/team/${id}`

            : `${API_URL}/api/admin/team`;


    const method =
        isEdit
            ? "PUT"
            : "POST";


    const saveButton =
        teamForm.querySelector(
            ".team-save-btn"
        );


    if (saveButton) {

        saveButton.disabled =
            true;
    }


    showTeamMessage(
        isEdit
            ? "Updating team member..."
            : "Uploading and saving team member...",
        "loading"
    );


    /* -----------------------------------------------------
       FORM DATA
    ----------------------------------------------------- */

    const formData =
        new FormData();


    formData.append(
        "name",
        name
    );


    formData.append(
        "designation",
        designation
    );


    formData.append(
        "description",
        description
    );


    formData.append(
        "linkedin",
        linkedin
    );


    formData.append(
        "instagram",
        instagram
    );


    formData.append(
        "github",
        github
    );


    formData.append(
        "displayOrder",
        String(displayOrder)
    );


    formData.append(
        "active",
        String(active)
    );


    /* -----------------------------------------------------
       ADD PHOTO ONLY IF SELECTED
    ----------------------------------------------------- */

    if (photoFile) {

        formData.append(
            "photo",
            photoFile
        );
    }


    try {

        const response =
            await fetch(
                url,
                {
                    method,

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        formData
                }
            );


        if (
            response.status ===
            401
        ) {

            redirectToLogin();
            return;
        }


        const data =
            await getJSON(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to save team member."
            );
        }


        showTeamMessage(
            data.message ||
            "Team member saved successfully.",
            "success"
        );


        await loadTeamMembers();


        setTimeout(
            closeTeamForm,
            700
        );


    } catch (error) {

        console.error(
            "Save team error:",
            error
        );


        showTeamMessage(
            error.message ||
            "Unable to save team member.",
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;
        }
    }
}


/* =========================================================
   EDIT TEAM MEMBER
========================================================= */

window.editTeamMember =
    function(id) {

        const member =
            (window.allTeamMembers || [])
                .find(
                    item =>
                        String(
                            item._id
                        ) ===
                        String(id)
                );


        if (!member) {

            alert(
                "Team member not found."
            );

            return;
        }


        setValue(
            "teamId",
            member._id
        );


        setValue(
            "teamName",
            member.name
        );


        setValue(
            "teamDesignation",
            member.designation
        );


        setValue(
            "teamDescription",
            member.description
        );


        setValue(
            "teamLinkedin",
            member.linkedin
        );


        setValue(
            "teamInstagram",
            member.instagram
        );


        setValue(
            "teamGithub",
            member.github
        );


        setValue(
            "teamOrder",
            member.displayOrder ||
            0
        );


        /* -------------------------------------------------
           FILE INPUT CANNOT BE PREFILLED

           Instead, show existing image.
        ------------------------------------------------- */

        const photoInput =
            document.getElementById(
                "teamPhoto"
            );


        if (photoInput) {

            photoInput.value =
                "";
        }


        showExistingTeamPhoto(
            member.photo
        );


        const active =
            document.getElementById(
                "teamActive"
            );


        if (active) {

            active.checked =
                member.active !== false;
        }


        if (teamModalTitle) {

            teamModalTitle.textContent =
                "Update Team Member";
        }


        if (teamSaveText) {

            teamSaveText.textContent =
                "Update Team Member";
        }


        if (teamMessage) {

            teamMessage.textContent =
                "";

            teamMessage.className =
                "";
        }


        if (teamModal) {

            teamModal.classList.add(
                "active"
            );
        }
    };


/* =========================================================
   SET VALUE
========================================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";
    }
}


/* =========================================================
   TOGGLE TEAM MEMBER
========================================================= */

window.toggleTeamMember =
    async function(id) {

        const member =
            (window.allTeamMembers || [])
                .find(
                    item =>
                        String(
                            item._id
                        ) ===
                        String(id)
                );


        if (!member) return;


        const token =
            getAdminToken();


        if (!token) {

            redirectToLogin();
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/admin/team/${id}`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({

                                name:
                                    member.name,

                                designation:
                                    member.designation,

                                description:
                                    member.description ||
                                    "",

                                photo:
                                    member.photo ||
                                    "",

                                linkedin:
                                    member.linkedin ||
                                    "",

                                instagram:
                                    member.instagram ||
                                    "",

                                github:
                                    member.github ||
                                    "",

                                displayOrder:
                                    member.displayOrder ||
                                    0,

                                active:
                                    member.active === false
                                        ? true
                                        : false

                            })
                    }
                );


            if (
                response.status ===
                401
            ) {

                redirectToLogin();
                return;
            }


            const data =
                await getJSON(
                    response
                );


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to change status."
                );
            }


            await loadTeamMembers();


        } catch (error) {

            console.error(
                "Toggle team error:",
                error
            );


            alert(
                error.message ||
                "Unable to change status."
            );
        }
    };


/* =========================================================
   DELETE TEAM MEMBER
========================================================= */

window.deleteTeamMember =
    async function(id) {

        const member =
            (window.allTeamMembers || [])
                .find(
                    item =>
                        String(
                            item._id
                        ) ===
                        String(id)
                );


        if (!member) {

            alert(
                "Team member not found."
            );

            return;
        }


        const confirmed =
            confirm(
                `Delete ${
                    member.name ||
                    "this team member"
                }?\n\nThis action cannot be undone.`
            );


        if (!confirmed) return;


        const token =
            getAdminToken();


        if (!token) {

            redirectToLogin();
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/admin/team/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            if (
                response.status ===
                401
            ) {

                redirectToLogin();
                return;
            }


            const data =
                await getJSON(
                    response
                );


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to delete team member."
                );
            }


            await loadTeamMembers();


        } catch (error) {

            console.error(
                "Delete team error:",
                error
            );


            alert(
                error.message ||
                "Delete failed."
            );
        }
    };


/* =========================================================
   TEAM MESSAGE
========================================================= */

function showTeamMessage(
    message,
    type = ""
) {

    if (!teamMessage) return;


    teamMessage.textContent =
        message;


    teamMessage.className =
        `team-message ${type}`;
}