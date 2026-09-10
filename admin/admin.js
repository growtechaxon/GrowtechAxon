const API_URL = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


// ========================================
// ADMIN LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const button =
            loginForm.querySelector("button");

        button.disabled = true;
        loginMessage.textContent = "Signing in...";

        try {

            const response = await fetch(
                `${API_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            localStorage.setItem(
                "growtechAdminToken",
                data.token
            );

            loginMessage.textContent =
                "Login successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                error.message || "Unable to login.";

        } finally {

            button.disabled = false;
        }
    });
}


// ========================================
// DASHBOARD
// ========================================

const leadsTable =
    document.getElementById("leadsTable");

if (leadsTable) {

    const token =
        localStorage.getItem("growtechAdminToken");

    if (!token) {

        window.location.href = "login.html";

    } else {

        loadLeads();
    }


    // ====================================
    // LOAD LEADS
    // ====================================

    async function loadLeads() {

        leadsTable.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    Loading customer leads...
                </td>
            </tr>
        `;

        try {

            const response = await fetch(
                `${API_URL}/api/leads`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {

                localStorage.removeItem(
                    "growtechAdminToken"
                );

                window.location.href = "login.html";

                return;
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Unable to load leads."
                );
            }

            window.allLeads = data.leads || [];

            displayLeads(window.allLeads);
            updateStats(window.allLeads);

        } catch (error) {

            console.error(error);

            leadsTable.innerHTML = `
                <tr>
                    <td colspan="10" class="loading">
                        ❌ Unable to load customer leads.
                    </td>
                </tr>
            `;
        }
    }


    // ====================================
    // DISPLAY LEADS
    // ====================================

    function displayLeads(leads) {

        if (!leads || leads.length === 0) {

            leadsTable.innerHTML = `
                <tr>
                    <td colspan="10" class="loading">
                        No customer leads found.
                    </td>
                </tr>
            `;

            return;
        }

        leadsTable.innerHTML = leads.map(
            (lead, index) => {

                // MongoDB ID
                const leadId = String(lead._id);

                // Phone number
                const phone =
                    String(lead.phone || "")
                    .replace(/\D/g, "");

                return `
                    <tr>

                        <td>${index + 1}</td>

                        <td>
                            <strong>
                                ${escapeHTML(lead.name)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                lead.business || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(lead.email)}
                        </td>

                        <td>
                            ${escapeHTML(lead.phone)}
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
                                data-id="${leadId}"
                            >
                                <option value="New"
                                    ${lead.status === "New" ? "selected" : ""}>
                                    New
                                </option>

                                <option value="Contacted"
                                    ${lead.status === "Contacted" ? "selected" : ""}>
                                    Contacted
                                </option>

                                <option value="Converted"
                                    ${lead.status === "Converted" ? "selected" : ""}>
                                    Converted
                                </option>

                                <option value="Closed"
                                    ${lead.status === "Closed" ? "selected" : ""}>
                                    Closed
                                </option>
                            </select>
                        </td>

                        <td>
                            ${formatLeadDate(lead)}
                        </td>

                        <td>

                            <div style="
                                display:flex;
                                gap:6px;
                                align-items:center;
                            ">

                                <button
                                    class="action-view"
                                    onclick="viewLead('${leadId}')"
                                    title="View"
                                    style="
                                        padding:7px 9px;
                                        border:0;
                                        border-radius:7px;
                                        cursor:pointer;
                                        background:#2563eb;
                                        color:white;
                                    "
                                >
                                    View
                                </button>

                                <a
                                    href="tel:${phone}"
                                    title="Call"
                                    style="
                                        padding:7px 9px;
                                        border-radius:7px;
                                        background:#16a34a;
                                        color:white;
                                        text-decoration:none;
                                    "
                                >
                                    Call
                                </a>

                                <a
                                    href="https://wa.me/${phone}"
                                    target="_blank"
                                    rel="noopener"
                                    title="WhatsApp"
                                    style="
                                        padding:7px 9px;
                                        border-radius:7px;
                                        background:#22c55e;
                                        color:white;
                                        text-decoration:none;
                                    "
                                >
                                    WA
                                </a>

                                <button
                                    onclick="deleteLead('${leadId}')"
                                    title="Delete"
                                    style="
                                        padding:7px 9px;
                                        border:0;
                                        border-radius:7px;
                                        cursor:pointer;
                                        background:#dc2626;
                                        color:white;
                                    "
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }
        ).join("");


        // Status change events

        document
            .querySelectorAll(".lead-status")
            .forEach(select => {

                select.addEventListener(
                    "change",
                    async () => {

                        const id =
                            select.dataset.id;

                        await updateStatus(
                            id,
                            select.value
                        );

                    }
                );

            });

    }


    // ====================================
    // UPDATE STATUS
    // ====================================

    async function updateStatus(id, status) {

        try {

            const response = await fetch(
                `${API_URL}/api/leads/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to update status."
                );
            }

            // Update local MongoDB lead data
            const lead =
                window.allLeads.find(
                    item => String(item._id) === String(id)
                );

            if (lead) {
                lead.status = data.lead?.status || status;
            }

            updateStats(window.allLeads);

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Status update failed."
            );

            loadLeads();
        }
    }


    // ====================================
    // DELETE LEAD
    // ====================================

    window.deleteLead = async function(id) {

        const lead =
            window.allLeads.find(
                item => String(item._id) === String(id)
            );

        if (!lead) {
            return;
        }

        const confirmed =
            confirm(
                `Delete lead of ${lead.name}?\n\nThis action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/leads/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to delete lead."
                );
            }

            await loadLeads();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Delete failed."
            );
        }
    };


    // ====================================
    // VIEW LEAD
    // ====================================

    window.viewLead = function(id) {

        const lead =
            window.allLeads.find(
                item => String(item._id) === String(id)
            );

        if (!lead) {
            alert("Lead not found.");
            return;
        }

        alert(
`CUSTOMER DETAILS

Name: ${lead.name}

Business: ${lead.business || "-"}

Email: ${lead.email}

Phone: ${lead.phone}

City: ${lead.city || "-"}

Service: ${lead.service || "-"}

Budget: ${lead.budget || "-"}

Message:
${lead.message || "-"}

Status: ${lead.status || "New"}

Date: ${formatLeadDate(lead)}`
        );
    };


    // ====================================
    // STATS
    // ====================================

    function updateStats(leads) {

        const total = leads.length;

        const newLeads =
            leads.filter(
                lead =>
                    (lead.status || "New") === "New"
            ).length;

        // MongoDB timestamp
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(
            tomorrowStart.getDate() + 1
        );

        const todayLeads =
            leads.filter(lead => {

                if (!lead.createdAt) {
                    return false;
                }

                const created =
                    new Date(lead.createdAt);

                return (
                    created >= todayStart &&
                    created < tomorrowStart
                );

            }).length;

        const converted =
            leads.filter(
                lead =>
                    lead.status === "Converted"
            ).length;


        document.getElementById(
            "totalLeads"
        ).textContent = total;

        document.getElementById(
            "newLeads"
        ).textContent = newLeads;

        document.getElementById(
            "todayLeads"
        ).textContent = todayLeads;

        document.getElementById(
            "projectLeads"
        ).textContent = converted;
    }


    // ====================================
    // SEARCH + FILTER
    // ====================================

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");


    function applyFilters() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        const selectedStatus =
            statusFilter.value;


        const filtered =
            window.allLeads.filter(lead => {

                const searchableText = `
                    ${lead.name || ""}
                    ${lead.business || ""}
                    ${lead.email || ""}
                    ${lead.phone || ""}
                    ${lead.city || ""}
                    ${lead.service || ""}
                `.toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(search);


                const matchesStatus =
                    selectedStatus === "all" ||
                    (lead.status || "New") === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            });


        displayLeads(filtered);
    }


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


    // ====================================
    // REFRESH
    // ====================================

    const refreshBtn =
        document.getElementById("refreshBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            loadLeads
        );

    }


    // ====================================
    // LOGOUT
    // ====================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "growtechAdminToken"
                );

                window.location.href =
                    "login.html";
            }
        );
    }
}


// ========================================
// DATE FORMAT
// ========================================

function formatLeadDate(lead) {

    if (lead.createdAt) {

        const date =
            new Date(lead.createdAt);

        if (!isNaN(date.getTime())) {

            return escapeHTML(
                date.toLocaleString("en-IN")
            );
        }
    }

    // Fallback for any old lead
    return escapeHTML(
        lead.date || "-"
    );
}


// ========================================
// HTML SECURITY
// ========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}