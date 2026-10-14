// Bank Management System - Frontend App Logic

document.addEventListener("DOMContentLoaded", () => {
    // Determine which page we are on and boot the script
    if (document.getElementById("auth-card")) {
        initAuthPage();
    } else if (document.getElementById("dashboard-content")) {
        initDashboardPage();
    }
});

// CSRF Utility
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fetch CSRF token initially
async function ensureCsrf() {
    try {
        await fetch('/api/csrf/');
    } catch (e) {
        console.error("Failed to seed CSRF cookie", e);
    }
}

// Toast alerts
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer") || createToastContainer();
    
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement("span");
    icon.innerHTML = type === "success" ? "✓" : "✗";
    icon.style.fontWeight = "bold";
    icon.style.color = type === "success" ? "var(--accent-emerald)" : "var(--accent-rose)";
    
    const text = document.createElement("span");
    text.innerText = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function createToastContainer() {
    const el = document.createElement("div");
    el.id = "toastContainer";
    el.className = "toast-container";
    document.body.appendChild(el);
    return el;
}

// ================= AUTH PAGE LOGIC =================
function initAuthPage() {
    ensureCsrf();
    
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authSubtitle = document.getElementById("authSubtitle");

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        authSubtitle.innerText = "Access your digital banking terminal";
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        authSubtitle.innerText = "Create an account to start growth";
    });

    // Handle Forms Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        
        try {
            const res = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
           
            if (res.ok && data.success) {
                showToast(data.message, "success");
                setTimeout(() => {
                    window.location.href = "/dashboard/";
                }, 800);
            } else {
                showToast(data.message || "Login failed", "error");
            }
        } catch (err) {
            showToast("Server error during login", "error");
            console.error(err);
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        
        try {
            const res = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                showToast("Account created successfully!", "success");
                setTimeout(() => {
                    window.location.href = "/dashboard/";
                }, 800);
            } else {
                showToast(data.message || "Registration failed", "error");
            }
        } catch (err) {
            showToast("Server error during registration", "error");
            console.error(err);
        }
    });
}

// ================= DASHBOARD PAGE LOGIC =================
let userProfile = null;

function initDashboardPage() {
    loadProfile();
    setupDashboardTabs();
    setupActionShortcuts();
    setupActionForms();
    setupGreeting();
}

function setupGreeting() {
    const greetingEl = document.getElementById("timeGreeting");
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let text = "Welcome back";
    if (hour < 12) text = "Good morning";
    else if (hour < 18) text = "Good afternoon";
    else text = "Good evening";
    greetingEl.innerText = text;
}

async function loadProfile() {
    try {
        const res = await fetch('/api/profile/');
        if (!res.ok) {
            // Not authenticated, redirect to login
            window.location.href = "/";
            return;
        }
        const data = await res.json();
        if (data.success) {
            userProfile = data.user;
            renderProfile(data.user);
            renderTransactions(data.transactions);
            drawBalanceChart(data.transactions, data.user.balance);
        }
    } catch (e) {
        showToast("Error loading account data", "error");
        console.error(e);
    }
}

function renderProfile(user) {
    document.getElementById("userDisplayName").innerText = user.name;
    document.getElementById("navUserEmail").innerText = user.email;
    document.getElementById("cardHolderName").innerText = user.name;
    
    // Balance
    const balance = Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("cardBalanceVal").innerText = `৳${balance}`;
    
    // Account Number formatting (e.g. 1234 5678 90)
    const rawAcct = user.account_number;
    const formattedAcct = rawAcct.replace(/(\d{4})(\d{4})(\d{2})/, "$1 $2 $3");
    document.getElementById("cardAccountNumber").innerText = formattedAcct;
}

function renderTransactions(transactions, filter = 'ALL') {
    const tableBody = document.getElementById("txTableBody");
    tableBody.innerHTML = "";
    
    const filtered = transactions.filter(tx => {
        if (filter === 'ALL') return true;
        if (filter === 'INFLOW') return tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
        if (filter === 'OUTFLOW') return tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER_OUT';
        return true;
    });

    if (filtered.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4" class="empty-tx">No transaction history found</td>`;
        tableBody.appendChild(tr);
        return;
    }

    filtered.forEach(tx => {
        const tr = document.createElement("tr");
        tr.className = "tx-row";
        
        let typeText = "";
        let badgeClass = "";
        let amountPrefix = "";
        let amountClass = "";
        let counterparty = "Bank Cashier";
        
        switch(tx.type) {
            case "DEPOSIT":
                typeText = "Deposit";
                badgeClass = "badge-deposit";
                amountPrefix = "+";
                amountClass = "inflow";
                break;
            case "WITHDRAWAL":
                typeText = "Withdrawal";
                badgeClass = "badge-withdraw";
                amountPrefix = "-";
                amountClass = "outflow";
                break;
            case "TRANSFER_IN":
                typeText = "Transfer Recv";
                badgeClass = "badge-transfer-in";
                amountPrefix = "+";
                amountClass = "inflow";
                counterparty = tx.sender_email;
                break;
            case "TRANSFER_OUT":
                typeText = "Transfer Sent";
                badgeClass = "badge-transfer-out";
                amountPrefix = "-";
                amountClass = "outflow";
                counterparty = tx.recipient_email;
                break;
        }

        const date = new Date(tx.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
        const amountFormatted = Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        tr.innerHTML = `
            <td>
                <span class="badge ${badgeClass}">${typeText}</span>
            </td>
            <td class="tx-amount ${amountClass}">${amountPrefix}৳${amountFormatted}</td>
            <td style="color: var(--text-secondary); font-size: 0.9rem;">${counterparty}</td>
            <td style="color: var(--text-muted); font-size: 0.85rem; text-align: right;">${formattedDate}</td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Set up filter buttons
function setupDashboardTabs() {
    const filters = document.querySelectorAll(".filter-chip");
    filters.forEach(chip => {
        chip.addEventListener("click", () => {
            filters.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            
            // Reload user transactions from backend (or filter current cache)
            if (userProfile) {
                // To keep it updated, refresh profile and filter
                refreshTransactionsOnly(chip.getAttribute("data-filter"));
            }
        });
    });
}

async function refreshTransactionsOnly(filterType) {
    try {
        const res = await fetch('/api/profile/');
        const data = await res.json();
        if (data.success) {
            renderTransactions(data.transactions, filterType);
        }
    } catch (e) {
        console.error(e);
    }
}

// Action form toggle (Deposit, Withdraw, Transfer)
function setupActionForms() {
    const tabs = document.querySelectorAll(".operation-tab-btn");
    const containers = document.querySelectorAll(".op-form-container");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            containers.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            const op = tab.getAttribute("data-op");
            document.getElementById(`${op}Container`).classList.add("active");
        });
    });
}

// Quick amount selectors
function setupActionShortcuts() {
    const shortcuts = document.querySelectorAll(".shortcut-btn");
    shortcuts.forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.getAttribute("data-val");
            const inputId = btn.getAttribute("data-target");
            const input = document.getElementById(inputId);
            if (input) {
                input.value = val;
            }
        });
    });
}

// Submit action forms
function setupActionForms() {
    // DEPOSIT FORM
    const depositForm = document.getElementById("depositForm");
    depositForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amountInput = document.getElementById("depositAmount");
        const amount = amountInput.value;
        
        if (!amount || Number(amount) <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        try {
            const res = await fetch('/api/deposit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message, "success");
                amountInput.value = "";
                loadProfile(); // refresh balances and logs
            } else {
                showToast(data.message || "Deposit failed", "error");
            }
        } catch (err) {
            showToast("Server error during deposit", "error");
            console.error(err);
        }
    });

    // WITHDRAW FORM
    const withdrawForm = document.getElementById("withdrawForm");
    withdrawForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amountInput = document.getElementById("withdrawAmount");
        const amount = amountInput.value;

        if (!amount || Number(amount) <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        try {
            const res = await fetch('/api/withdraw/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message, "success");
                amountInput.value = "";
                loadProfile();
            } else {
                showToast(data.message || "Withdrawal failed", "error");
            }
        } catch (err) {
            showToast("Server error during withdrawal", "error");
            console.error(err);
        }
    });

    // TRANSFER FORM
    const transferForm = document.getElementById("transferForm");
    transferForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amountInput = document.getElementById("transferAmount");
        const recipientInput = document.getElementById("transferRecipient");
        const amount = amountInput.value;
        const recipient = recipientInput.value.trim();

        if (!amount || Number(amount) <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }
        if (!recipient) {
            showToast("Please enter a recipient account number or email", "error");
            return;
        }

        try {
            const res = await fetch('/api/transfer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ amount, recipient })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message, "success");
                amountInput.value = "";
                recipientInput.value = "";
                loadProfile();
            } else {
                showToast(data.message || "Transfer failed", "error");
            }
        } catch (err) {
            showToast("Server error during transfer", "error");
            console.error(err);
        }
    });

    // TABS TOGGLE FOR DEPOSIT / WITHDRAW / TRANSFER
    const tabButtons = document.querySelectorAll(".operation-tab-btn");
    const tabContainers = document.querySelectorAll(".op-form-container");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabContainers.forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-op") + "Container";
            document.getElementById(targetId).classList.add("active");
        });
    });
}

// LOGOUT VIEW
async function logoutUser() {
    try {
        const res = await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        const data = await res.json();
        if (data.success) {
            showToast(data.message || "Logged out", "success");
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        }
    } catch (e) {
        showToast("Error during logout", "error");
        console.error(e);
    }
}

// Custom balance curve rendering
function drawBalanceChart(transactions, currentBalance) {
    const canvas = document.getElementById("balanceChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Process running balance history
    let balance = Number(currentBalance);
    let history = [balance];
    
    // Sort transactions chronological (oldest first)
    const chronTx = [...transactions].reverse();
    for (let tx of chronTx) {
        let amt = Number(tx.amount);
        if (tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') {
            balance -= amt;
        } else {
            balance += amt;
        }
        history.unshift(balance);
    }
    
    // If only 1 data point (no transactions yet), seed initial balance or default 0
    if (history.length === 1) {
        history.unshift(0);
    }
    
    // Resize canvas based on container size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    const minVal = Math.min(...history) * 0.95;
    const maxVal = Math.max(...history) * 1.05 || 100;
    const valRange = maxVal - minVal;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();
    }

    const points = history.map((val, idx) => {
        const x = (idx / (history.length - 1)) * (width - 30) + 15;
        const y = height - ((val - minVal) / valRange) * (height - 30) - 15;
        return { x, y };
    });
    
    // Draw gradient fill beneath line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.25)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        // Curve to midpoint
        const xc = (points[i-1].x + points[i].x) / 2;
        const yc = (points[i-1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.strokeStyle = "var(--primary)";
    ctx.lineWidth = 3.5;
    ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    // Close area for gradient
    ctx.shadowBlur = 0; // reset shadow
    ctx.lineTo(points[points.length-1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Render endpoints dots
    points.forEach((pt, idx) => {
        if (idx === points.length - 1 || idx === 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = idx === points.length - 1 ? "var(--accent-emerald)" : "var(--primary)";
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Window resizing adjustments for canvas
window.addEventListener("resize", () => {
    if (userProfile && document.getElementById("balanceChart")) {
        // Re-fetch profile and redraw chart based on new size
        loadProfile();
    }
});
