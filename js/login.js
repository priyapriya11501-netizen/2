// Login functionality for KindNet platform

// Initialize login functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    const userTypeCards = document.querySelectorAll('.user-type-card');
    const selectTypeBtns = document.querySelectorAll('.select-type-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const loginForms = document.querySelectorAll('.login-form');
    const userTypeSelection = document.querySelector('.user-type-selection');
    const loginForms_container = document.querySelector('.login-forms');

    // User type selection
    selectTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const userType = this.getAttribute('data-type');
            showLoginForm(userType);
        });
    });

    // Back to selection
    backBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showUserTypeSelection();
        });
    });

    // Form submissions
    loginForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formId = this.id;
            handleLogin(formId);
        });
    });

    function showLoginForm(userType) {
        // Hide user type selection
        userTypeSelection.style.display = 'none';
        
        // Hide all login forms
        const allLoginForms = document.querySelectorAll('.login-form-container');
        allLoginForms.forEach(form => {
            form.style.display = 'none';
        });
        
        // Show selected login form
        const selectedForm = document.getElementById(`${userType}-login`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
            loginForms_container.style.display = 'block';
        }
    }

    function showUserTypeSelection() {
        // Show user type selection
        userTypeSelection.style.display = 'flex';
        
        // Hide login forms
        loginForms_container.style.display = 'none';
        const allLoginForms = document.querySelectorAll('.login-form-container');
        allLoginForms.forEach(form => {
            form.style.display = 'none';
        });
    }

    function handleLogin(formId) {
        let userType, email, password;
        
        switch(formId) {
            case 'donor-login-form':
                userType = 'donor';
                email = document.getElementById('donor-email').value;
                password = document.getElementById('donor-password').value;
                break;
            case 'ngo-login-form':
                userType = 'ngo';
                email = document.getElementById('ngo-email').value;
                password = document.getElementById('ngo-password').value;
                break;
            case 'recipient-login-form':
                userType = 'recipient';
                email = document.getElementById('recipient-email').value;
                password = document.getElementById('recipient-password').value;
                break;
        }

        // Simulate login process
        showLoadingState(formId);
        
        setTimeout(() => {
            // Store user session
            const userData = {
                type: userType,
                email: email,
                name: getUserNameFromEmail(email),
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('kindnet_user', JSON.stringify(userData));
            
            // Redirect based on user type
            redirectUser(userType);
        }, 1500);
    }

    function showLoadingState(formId) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Reset after redirect
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function getUserNameFromEmail(email) {
        // Extract name from email (simple implementation)
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function redirectUser(userType) {
        switch(userType) {
            case 'donor':
                window.location.href = 'food-donations.html';
                break;
            case 'ngo':
                window.location.href = 'ngo.html';
                break;
            case 'recipient':
                window.location.href = 'food-donations.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }
}

// Check if user is already logged in
function checkUserSession() {
    const userData = localStorage.getItem('kindnet_user');
    if (userData) {
        const user = JSON.parse(userData);
        // Update navigation to show user info
        updateNavigation(user);
        return user;
    }
    return null;
}

// Update navigation based on login status
function updateNavigation(user) {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (user && loginBtn && userInfo) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        if (userName) userName.textContent = user.name;
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                logout();
            });
        }
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('kindnet_user');
    window.location.href = 'login.html';
}

// Initialize session check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Don't check session on login page itself
    if (!window.location.pathname.includes('login.html')) {
        checkUserSession();
    }
});