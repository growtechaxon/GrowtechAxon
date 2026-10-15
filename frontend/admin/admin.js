
/* =========================================================
   GROWTECH AXON - ADMIN PANEL
   Login + Leads + Team Management
========================================================= */

/* ==================== API CONFIG ==================== */

const API_URL = String(window.GROWTECHAXON_API_URL || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://growtechaxon-backend.onrender.com')).replace(/\/+$/, '');


/* ==================== COMMON HELPERS ==================== */

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
        return text ? JSON.parse(text) : {};
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

function getPhoneNumber(phone) {
    return String(phone || "").replace(/\D/g, "");
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function formatLeadDate(lead) {
    const value = lead?.createdAt || lead?.date;

    if (!value) return "-";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? escapeHTML(value)
        : escapeHTML(
            date.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
            })
        );
}

function getTeamField(id, fallback = "") {
    return document.getElementById(id)?.value?.trim() || fallback;
}

function getTeamCheckbox(id, fallback = true) {
    const element = document.getElementById(id);
    return element ? element.checked : fallback;
}


/* ==================== ADMIN LOGIN ==================== */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            document.getElementById("username")?.value.trim();

        const password =
            document.getElementById("password")?.value || "";

        const button = loginForm.querySelector("button");

        if (!username || !password) {
            if (loginMessage) {
                loginMessage.textContent =
                    "Please enter username and password.";
            }
            return;
        }

        if (button) button.disabled = true;
        if (loginMessage) loginMessage.textContent = "Signing in...";

        try {
            const response = await fetch(
                `${API_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                }
            );

            const data = await getJSON(response);

            if (!response.ok || !data.success || !data.token) {
                throw new Error(data.message || "Login failed.");
            }

            localStorage.setItem("growtechAdminToken", data.token);

            if (loginMessage) {
                loginMessage.textContent = "Login successful!";
            }

            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Admin login error:", error);

            if (loginMessage) {
                loginMessage.textContent =
                    error.message || "Unable to login.";
            }
        } finally {
            if (button) button.disabled = false;
        }
    });
}


/* ==================== LEADS INITIALIZATION ==================== */

const leadsTable = document.getElementById("leadsTable");

if (leadsTable) {
    if (!getAdminToken()) {
        redirectToLogin();
    } else {
        initializeDashboard();
    }
}

function initializeDashboard() {
    loadLeads();
    initializeLeadFilters();
    initializeRefresh();
    initializeLogout();
}


/* ==================== LOAD LEADS ==================== */

async function loadLeads() {
    const table = document.getElementById("leadsTable");
    if (!table) return;

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    table.innerHTML = `
        <tr><td colspan="10" class="loading">
            Loading customer leads...
        </td></tr>`;

    try {
        const response = await fetch(`${API_URL}/api/leads`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load leads.");
        }

        window.allLeads = Array.isArray(data.leads)
            ? data.leads
            : [];

        displayLeads(window.allLeads);
        updateStats(window.allLeads);
    } catch (error) {
        console.error("Load leads error:", error);

        table.innerHTML = `
            <tr><td colspan="10" class="loading">
                Unable to load customer leads.<br>
                <small>${escapeHTML(error.message)}</small>
            </td></tr>`;
    }
}


/* ==================== DISPLAY LEADS ==================== */

function displayLeads(leads) {
    const table = document.getElementById("leadsTable");
    if (!table) return;

    if (!Array.isArray(leads) || !leads.length) {
        table.innerHTML = `
            <tr><td colspan="10" class="loading">
                No customer leads found.
            </td></tr>`;
        return;
    }

    table.innerHTML = leads.map((lead, index) => {
        const id = String(lead._id || "");
        const phone = getPhoneNumber(lead.phone);
        const status = lead.status || "New";

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHTML(lead.name || "-")}</strong></td>
                <td>${escapeHTML(lead.business || "-")}</td>
                <td>${escapeHTML(lead.email || "-")}</td>
                <td>${escapeHTML(lead.phone || "-")}</td>
                <td>${escapeHTML(lead.planName || lead.service || "-")}</td>
                <td>${escapeHTML(typeof lead.planPrice === "number" ? `â‚¹${lead.planPrice.toLocaleString("en-IN")}` : (lead.budget || "-"))}</td>
                <td>
                    <select class="lead-status"
                        data-id="${escapeHTML(id)}"
                        aria-label="Lead status">
                        ${["New", "Contacted", "Converted", "Closed"]
                            .map(option => `
                                <option value="${option}"
                                    ${status === option ? "selected" : ""}>
                                    ${option}
                                </option>`).join("")}
                    </select>
                </td>
                <td>${formatLeadDate(lead)}</td>
                <td>
                    <div class="lead-actions">
                        <button type="button"
                            class="action-btn action-view"
                            data-action="view"
                            data-id="${escapeHTML(id)}">View</button>

                        ${phone ? `
                            <a href="tel:${phone}"
                                class="action-btn action-call">Call</a>
                            <a href="https://wa.me/${phone}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="action-btn action-whatsapp">WA</a>
                        ` : ""}

                        <button type="button"
                            class="action-btn action-delete"
                            data-action="delete"
                            data-id="${escapeHTML(id)}">Delete</button>
                    </div>
                </td>
            </tr>`;
    }).join("");

    table.querySelectorAll(".lead-status").forEach(select => {
        select.addEventListener("change", () => {
            updateStatus(select.dataset.id, select.value);
        });
    });

    table.querySelectorAll("[data-action='view']").forEach(button => {
        button.addEventListener("click", () => viewLead(button.dataset.id));
    });

    table.querySelectorAll("[data-action='delete']").forEach(button => {
        button.addEventListener("click", () => deleteLead(button.dataset.id));
    });
}


/* ==================== LEAD STATUS ==================== */

async function updateStatus(id, status) {
    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/leads/${encodeURIComponent(id)}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }
        );

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to update status.");
        }

        const lead = (window.allLeads || []).find(
            item => String(item._id) === String(id)
        );

        if (lead) lead.status = data.lead?.status || status;

        updateStats(window.allLeads || []);
    } catch (error) {
        console.error("Status update error:", error);
        alert(error.message || "Status update failed.");
        loadLeads();
    }
}


/* ==================== DELETE LEAD ==================== */

async function deleteLead(id) {
    const lead = (window.allLeads || []).find(
        item => String(item._id) === String(id)
    );

    if (!lead) {
        alert("Lead not found.");
        return;
    }

    if (!confirm(
        `Delete lead of ${lead.name || "this customer"}?\n\nThis cannot be undone.`
    )) return;

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/leads/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to delete lead.");
        }

        await loadLeads();
    } catch (error) {
        console.error("Delete lead error:", error);
        alert(error.message || "Delete failed.");
    }
}


/* ==================== VIEW LEAD ==================== */

function viewLead(id) {
    const lead = (window.allLeads || []).find(
        item => String(item._id) === String(id)
    );

    if (!lead) {
        alert("Lead not found.");
        return;
    }

    alert(`CUSTOMER DETAILS

Name: ${lead.name || "-"}
Business: ${lead.business || "-"}
Email: ${lead.email || "-"}
Phone: ${lead.phone || "-"}
City: ${lead.city || "-"}
Service: ${lead.service || "-"}
Selected plan: ${lead.planName || "Not specified"}
Plan price: ${typeof lead.planPrice === "number" ? `â‚¹${lead.planPrice.toLocaleString("en-IN")}` : "Not specified"}
Budget: ${lead.budget || "-"}
Message: ${lead.message || "-"}
Status: ${lead.status || "New"}
Date: ${formatLeadDate(lead)}`);
}


/* ==================== LEAD STATISTICS ==================== */

function updateStats(leads) {
    const list = Array.isArray(leads) ? leads : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = list.filter(lead => {
        if (!lead.createdAt) return false;

        const date = new Date(lead.createdAt);
        return date >= today && date < tomorrow;
    }).length;

    setText("totalLeads", list.length);
    setText("newLeads", list.filter(
        lead => (lead.status || "New") === "New"
    ).length);
    setText("todayLeads", todayCount);
    setText("projectLeads", list.filter(
        lead => lead.status === "Converted"
    ).length);
}


/* ==================== LEAD SEARCH / FILTER ==================== */

function initializeLeadFilters() {
    document.getElementById("searchInput")
        ?.addEventListener("input", applyFilters);

    document.getElementById("statusFilter")
        ?.addEventListener("change", applyFilters);
}

function applyFilters() {
    const search = document.getElementById("searchInput")
        ?.value.toLowerCase().trim() || "";

    const selectedStatus =
        document.getElementById("statusFilter")?.value || "all";

    const filtered = (window.allLeads || []).filter(lead => {
        const text = [
            lead.name, lead.business, lead.email,
            lead.phone, lead.city, lead.service, lead.budget
        ].join(" ").toLowerCase();

        return (!search || text.includes(search)) &&
            (selectedStatus === "all" ||
             (lead.status || "New") === selectedStatus);
    });

    displayLeads(filtered);
}


/* ==================== REFRESH / LOGOUT ==================== */

function initializeRefresh() {
    const button = document.getElementById("refreshBtn");
    if (!button) return;

    button.addEventListener("click", async () => {
        const original = button.textContent;
        button.disabled = true;
        button.textContent = "Loading...";

        try {
            await loadLeads();
        } finally {
            button.disabled = false;
            button.textContent = original;
        }
    });
}

function initializeLogout() {
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        if (!confirm("Are you sure you want to logout?")) return;

        localStorage.removeItem("growtechAdminToken");
        window.location.href = "login.html";
    });
}


/* ==================== TEAM MANAGEMENT ELEMENTS ==================== */

const teamTable = document.getElementById("teamTable");
const teamModal = document.getElementById("teamModal");
const teamForm = document.getElementById("teamForm");
const addTeamBtn = document.getElementById("addTeamBtn");
const closeTeamModal = document.getElementById("closeTeamModal");
const cancelTeamBtn = document.getElementById("cancelTeamBtn");
const teamModalTitle = document.getElementById("teamModalTitle");
const teamSaveText = document.getElementById("teamSaveText");
const teamMessage = document.getElementById("teamMessage");


if (teamTable) {
    if (!getAdminToken()) {
        redirectToLogin();
    } else {
        initializeTeamManagement();
    }
}

function initializeTeamManagement() {
    loadTeamMembers();
    initializeTeamModal();
    initializeTeamForm();
    initializeTeamPhotoPreview();
}


/* ==================== LOAD TEAM MEMBERS ==================== */

async function loadTeamMembers() {
    const table = document.getElementById("teamTable");
    if (!table) return;

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    table.innerHTML = `
        <tr><td colspan="6" class="loading">
            Loading team members...
        </td></tr>`;

    try {
        const response = await fetch(`${API_URL}/api/admin/team`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load team.");
        }

        window.allTeamMembers = Array.isArray(data.team)
            ? data.team
            : [];

        displayTeamMembers(window.allTeamMembers);
    } catch (error) {
        console.error("Load team error:", error);

        table.innerHTML = `
            <tr><td colspan="6" class="loading">
                Unable to load team members.<br>
                <small>${escapeHTML(error.message)}</small>
            </td></tr>`;
    }
}


/* ==================== DISPLAY TEAM MEMBERS ==================== */

function displayTeamMembers(team) {
    const table = document.getElementById("teamTable");
    if (!table) return;

    if (!Array.isArray(team) || team.length === 0) {
        table.innerHTML = `
            <tr><td colspan="6" class="loading">
                No team members found.
            </td></tr>`;
        return;
    }

    table.innerHTML = team.map((member, index) => {
        const id = String(member._id || "");
        const photo = String(member.photo || "").trim();

        const photoHTML = photo
            ? `<img src="${escapeHTML(photo)}"
                    class="team-avatar"
                    alt="${escapeHTML(member.name || "Team member")}"
                    onerror="this.style.display='none'">`
            : `<div class="team-no-photo">GX</div>`;

        return `
            <tr>
                <td>${photoHTML}</td>
                <td><strong>${escapeHTML(member.name || "-")}</strong></td>
                <td>${escapeHTML(member.designation || "-")}</td>
                <td>${Number(member.displayOrder || 0)}</td>
                <td>
                    ${member.active !== false
                        ? '<span class="team-status-active">Active</span>'
                        : '<span class="team-status-inactive">Inactive</span>'}
                </td>
                <td>
                    <div class="team-actions">
                        <button type="button"
                            class="team-action-edit"
                            onclick="editTeamMember('${escapeHTML(id)}')">
                            Edit
                        </button>
                        <button type="button"
                            class="team-action-toggle"
                            onclick="toggleTeamMember('${escapeHTML(id)}')">
                            ${member.active !== false ? "Disable" : "Activate"}
                        </button>
                        <button type="button"
                            class="team-action-delete"
                            onclick="deleteTeamMember('${escapeHTML(id)}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join("");
}


/* ==================== TEAM MODAL ==================== */

function initializeTeamModal() {
    addTeamBtn?.addEventListener("click", openAddTeamModal);
    closeTeamModal?.addEventListener("click", closeTeamForm);
    cancelTeamBtn?.addEventListener("click", closeTeamForm);

    teamModal?.addEventListener("click", event => {
        if (event.target === teamModal) closeTeamForm();
    });
}

function openAddTeamModal() {
    resetTeamForm();

    if (teamModalTitle) teamModalTitle.textContent = "Add Team Member";
    if (teamSaveText) teamSaveText.textContent = "Save Team Member";

    teamModal?.classList.add("active");
}

function closeTeamForm() {
    teamModal?.classList.remove("active");
    resetTeamForm();
}

function resetTeamForm() {
    if (!teamForm) return;

    teamForm.reset();

    setText("teamId", "");

    const id = document.getElementById("teamId");
    const active = document.getElementById("teamActive");
    const order = document.getElementById("teamOrder");

    if (id) id.value = "";
    if (active) active.checked = true;
    if (order) order.value = "0";

    showTeamMessage("", "");
    clearTeamPhotoPreview();
}

function initializeTeamForm() {
    teamForm?.addEventListener("submit", saveTeamMember);
}


/* ==================== PHOTO PREVIEW ==================== */

function initializeTeamPhotoPreview() {
    const input = document.getElementById("teamPhoto");

    if (!input) return;

    input.addEventListener("change", () => {
        const file = input.files?.[0];

        if (!file) {
            clearTeamPhotoPreview();
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            showTeamMessage("Choose a JPG, JPEG, PNG or WEBP image.", "error");
            input.value = "";
            clearTeamPhotoPreview();
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            showTeamMessage("Image size must be 5 MB or less.", "error");
            input.value = "";
            clearTeamPhotoPreview();
            return;
        }

        const preview = document.getElementById("teamPhotoPreview");
        const message = document.getElementById("teamPhotoPreviewMessage");

        if (preview) {
            if (preview.dataset.objectUrl) {
                URL.revokeObjectURL(preview.dataset.objectUrl);
            }

            const objectUrl = URL.createObjectURL(file);
            preview.dataset.objectUrl = objectUrl;
            preview.src = objectUrl;
            preview.hidden = false;
        }

        if (message) message.textContent = file.name;
        showTeamMessage("", "");
    });
}

function clearTeamPhotoPreview() {
    const preview = document.getElementById("teamPhotoPreview");
    const message = document.getElementById("teamPhotoPreviewMessage");

    if (preview) {
        if (preview.dataset.objectUrl) {
            URL.revokeObjectURL(preview.dataset.objectUrl);
        }

        delete preview.dataset.objectUrl;
        preview.removeAttribute("src");
        preview.hidden = true;
    }

    if (message) {
        message.textContent = "Select a photo to preview it here.";
    }
}


/* ==================== SAVE / UPDATE TEAM MEMBER ==================== */

async function saveTeamMember(event) {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    const id = getTeamField("teamId");
    const name = getTeamField("teamName");
    const designation = getTeamField("teamDesignation");
    const description = getTeamField("teamDescription");
    const linkedin = getTeamField("teamLinkedin");
    const instagram = getTeamField("teamInstagram");
    const github = getTeamField("teamGithub");
    const displayOrder = Number(getTeamField("teamOrder", "0")) || 0;
    const active = getTeamCheckbox("teamActive", true);
    const isFounder = getTeamCheckbox("teamFounder", false);

    const photoInput = document.getElementById("teamPhoto");
    const photoFile = photoInput?.files?.[0] || null;

    if (!name || !designation) {
        showTeamMessage("Name and designation are required.", "error");
        return;
    }

    if (linkedin && !isValidHttpUrl(linkedin)) {
        showTeamMessage("Please enter a valid LinkedIn URL.", "error");
        return;
    }

    if (photoFile) {
        if (!photoFile.type.startsWith("image/")) {
            showTeamMessage("Please select a valid image.", "error");
            return;
        }

        if (photoFile.size > 5 * 1024 * 1024) {
            showTeamMessage("Image size must be 5 MB or less.", "error");
            return;
        }
    }

    const isEdit = Boolean(id);
    const url = isEdit
        ? `${API_URL}/api/admin/team/${encodeURIComponent(id)}`
        : `${API_URL}/api/admin/team`;

    const button = teamForm?.querySelector(
        'button[type="submit"], .team-save-btn'
    );

    if (button) button.disabled = true;

    if (teamSaveText) {
        teamSaveText.textContent = isEdit ? "Updating..." : "Saving...";
    }

    showTeamMessage(
        isEdit ? "Updating team member..." : "Saving team member...",
        "loading"
    );

    try {
        /*
         * IMPORTANT:
         * FormData sends the photo binary file.
         * Do NOT set Content-Type manually; the browser adds
         * the multipart/form-data boundary automatically.
         */
        const formData = new FormData();

        formData.append("name", name);
        formData.append("designation", designation);
        formData.append("description", description);
        formData.append("linkedin", linkedin);
        formData.append("displayOrder", String(displayOrder));
        formData.append("active", String(active));
        formData.append("isFounder", String(isFounder));

        formData.append("instagram", instagram);
        formData.append("github", github);

        if (photoFile) {
            formData.append("photo", photoFile, photoFile.name);
        }

        const response = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to save team member.");
        }

        showTeamMessage(
            data.message || "Team member saved successfully.",
            "success"
        );

        await loadTeamMembers();

        setTimeout(closeTeamForm, 700);
    } catch (error) {
        console.error("Save team error:", error);
        showTeamMessage(
            error.message || "Unable to save team member.",
            "error"
        );
    } finally {
        if (button) button.disabled = false;

        if (teamSaveText) {
            teamSaveText.textContent = isEdit
                ? "Update Team Member"
                : "Save Team Member";
        }
    }
}

function isValidHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}


/* ==================== EDIT TEAM MEMBER ==================== */

window.editTeamMember = function(id) {
    const member = (window.allTeamMembers || []).find(
        item => String(item._id) === String(id)
    );

    if (!member) {
        alert("Team member not found.");
        return;
    }

    setValue("teamId", member._id);
    setValue("teamName", member.name);
    setValue("teamDesignation", member.designation);
    setValue("teamDescription", member.description);
    setValue("teamLinkedin", member.linkedin);
    setValue("teamInstagram", member.instagram);
    setValue("teamGithub", member.github);
    setValue("teamOrder", member.displayOrder ?? 0);

    const active = document.getElementById("teamActive");
    const founder = document.getElementById("teamFounder");

    if (active) active.checked = member.active !== false;
    if (founder) founder.checked = member.isFounder === true;

    /*
     * Browsers do not allow assigning a file path to an input[type=file].
     * Leave the file input empty when editing; selecting a new file replaces
     * the existing image. If no new file is selected, backend should keep
     * the existing photo.
     */
    const photoInput = document.getElementById("teamPhoto");
    if (photoInput) photoInput.value = "";

    clearTeamPhotoPreview();

    const preview = document.getElementById("teamPhotoPreview");
    const message = document.getElementById("teamPhotoPreviewMessage");

    if (member.photo && preview) {
        preview.src = member.photo;
        preview.hidden = false;
        if (message) message.textContent = "Current photo (choose a new one to replace it).";
    }

    if (teamModalTitle) teamModalTitle.textContent = "Update Team Member";
    if (teamSaveText) teamSaveText.textContent = "Update Team Member";

    showTeamMessage("", "");
    teamModal?.classList.add("active");
};

function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value ?? "";
}


/* ==================== ACTIVATE / DISABLE TEAM MEMBER ==================== */

window.toggleTeamMember = async function(id) {
    const member = (window.allTeamMembers || []).find(
        item => String(item._id) === String(id)
    );

    if (!member) return;

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    const nextActive = member.active === false;

    const payload = {
        name: member.name || "",
        designation: member.designation || "",
        description: member.description || "",
        photo: member.photo || "",
        linkedin: member.linkedin || "",
        instagram: member.instagram || "",
        github: member.github || "",
        displayOrder: Number(member.displayOrder || 0),
        isFounder: member.isFounder === true,
        active: nextActive
    };

    try {
        const response = await fetch(
            `${API_URL}/api/admin/team/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
        );

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to change team status.");
        }

        await loadTeamMembers();
    } catch (error) {
        console.error("Toggle team error:", error);
        alert(error.message || "Unable to change team status.");
    }
};


/* ==================== DELETE TEAM MEMBER ==================== */

window.deleteTeamMember = async function(id) {
    const member = (window.allTeamMembers || []).find(
        item => String(item._id) === String(id)
    );

    if (!member) return;

    if (!confirm(
        `Delete ${member.name || "this team member"}?\n\nThis cannot be undone.`
    )) return;

    const token = getAdminToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/admin/team/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            redirectToLogin();
            return;
        }

        const data = await getJSON(response);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to delete team member.");
        }

        await loadTeamMembers();
    } catch (error) {
        console.error("Delete team error:", error);
        alert(error.message || "Delete failed.");
    }
};


/* ==================== TEAM MESSAGES ==================== */

function showTeamMessage(message, type = "") {
    if (!teamMessage) return;

    teamMessage.textContent = message;
    teamMessage.className = `team-message ${type}`;
}

