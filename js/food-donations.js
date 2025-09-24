// Food donations functionality for KindNet platform

// Global variables
let currentUser = null;
let foodDonations = [];
let filteredDonations = [];

// Initialize food donations functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFoodDonations();
    loadFoodDonations();
    initializeFilters();
    initializeFoodPosting();
    checkUserAccess();
});

function initializeFoodDonations() {
    // Check user session
    const userData = localStorage.getItem('kindnet_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavigationForUser();
    }

    // Initialize buttons
    const postFoodBtn = document.getElementById('post-food-btn');
    const viewRequestsBtn = document.getElementById('view-requests-btn');
    const loginBtn = document.getElementById('login-btn');

    if (postFoodBtn) {
        postFoodBtn.addEventListener('click', function() {
            if (!currentUser) {
                showNotification('Please login to post food donations', 'warning');
                window.location.href = 'login.html';
                return;
            }
            if (currentUser.type !== 'donor') {
                showNotification('Only donors can post food donations', 'warning');
                return;
            }
            openFoodPostingModal();
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
}

function updateNavigationForUser() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginBtn && userInfo) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name;
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('kindnet_user');
                window.location.href = 'login.html';
            });
        }
    }
}

function checkUserAccess() {
    // Show/hide buttons based on user type
    const postFoodBtn = document.getElementById('post-food-btn');
    const acceptBtns = document.querySelectorAll('.accept-btn');

    if (currentUser) {
        switch(currentUser.type) {
            case 'donor':
                // Donors can post food but not accept
                if (postFoodBtn) postFoodBtn.style.display = 'inline-block';
                acceptBtns.forEach(btn => {
                    btn.style.display = 'none';
                });
                break;
            case 'recipient':
                // Recipients can accept food but not post
                if (postFoodBtn) postFoodBtn.style.display = 'none';
                acceptBtns.forEach(btn => {
                    btn.style.display = 'inline-block';
                    btn.addEventListener('click', handleAcceptDonation);
                });
                break;
            case 'ngo':
                // NGOs can see everything and moderate
                if (postFoodBtn) postFoodBtn.style.display = 'inline-block';
                acceptBtns.forEach(btn => {
                    btn.style.display = 'inline-block';
                    btn.addEventListener('click', handleAcceptDonation);
                });
                break;
        }
    } else {
        // Not logged in - hide action buttons
        if (postFoodBtn) postFoodBtn.style.display = 'none';
        acceptBtns.forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

function loadFoodDonations() {
    // Load existing donations from localStorage or use sample data
    const savedDonations = localStorage.getItem('kindnet_food_donations');
    if (savedDonations) {
        foodDonations = JSON.parse(savedDonations);
    } else {
        // Initialize with sample data
        foodDonations = getSampleFoodDonations();
        saveFoodDonations();
    }
    
    filteredDonations = [...foodDonations];
    renderFoodDonations();
}

function getSampleFoodDonations() {
    return [
        {
            id: 1,
            title: "Traditional South Indian Meal",
            description: "Fresh sambar, rasam, rice, and vegetables. Prepared for 50 people but only 30 attended our function.",
            type: "cooked",
            quantity: "20 servings",
            expiry: "4 hours",
            location: "T. Nagar, Chennai",
            city: "chennai",
            urgency: "immediate",
            contact: "+91 98765 43210",
            donor: {
                name: "Priya Sharma",
                avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=30&h=30"
            },
            image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
            postedTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            status: "available"
        },
        {
            id: 2,
            title: "Packaged Snacks & Biscuits",
            description: "Assorted packaged snacks, biscuits, and ready-to-eat items. All items are well within expiry date.",
            type: "packaged",
            quantity: "50 packets",
            expiry: "2-6 months",
            location: "Koramangala, Bangalore",
            city: "bangalore",
            urgency: "today",
            contact: "+91 87654 32109",
            donor: {
                name: "Rajesh Kumar",
                avatar: "https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=30&h=30"
            },
            image: "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
            postedTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            status: "available"
        },
        {
            id: 3,
            title: "Fresh Fruits & Vegetables",
            description: "Fresh seasonal fruits and vegetables from our farm. Slightly overripe but perfectly edible and nutritious.",
            type: "fruits",
            quantity: "25 kg mixed",
            expiry: "2-3 days",
            location: "Jubilee Hills, Hyderabad",
            city: "hyderabad",
            urgency: "tomorrow",
            contact: "+91 76543 21098",
            donor: {
                name: "Anita Reddy",
                avatar: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=30&h=30"
            },
            image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
            postedTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            status: "available"
        }
    ];
}

function renderFoodDonations() {
    const donationsGrid = document.getElementById('donations-grid');
    if (!donationsGrid) return;

    donationsGrid.innerHTML = '';

    filteredDonations.forEach(donation => {
        const donationCard = createFoodDonationCard(donation);
        donationsGrid.appendChild(donationCard);
    });
}

function createFoodDonationCard(donation) {
    const card = document.createElement('div');
    card.className = `food-donation-card ${donation.urgency === 'immediate' ? 'urgent' : ''}`;
    card.setAttribute('data-type', donation.type);
    card.setAttribute('data-location', donation.city);
    card.setAttribute('data-urgency', donation.urgency);

    const urgencyText = {
        'immediate': 'Immediate Pickup',
        'today': 'Pickup Today',
        'tomorrow': 'Pickup Tomorrow',
        'flexible': 'Flexible Pickup'
    };

    const typeText = {
        'cooked': 'Cooked Food',
        'raw': 'Raw Ingredients',
        'packaged': 'Packaged Food',
        'fruits': 'Fruits & Vegetables',
        'dairy': 'Dairy Products',
        'grains': 'Grains & Cereals'
    };

    const timeAgo = getTimeAgo(donation.postedTime);

    card.innerHTML = `
        <div class="food-image">
            <img src="${donation.image}" alt="${donation.title}" class="donation-image">
            <div class="urgency-badge ${donation.urgency}">${urgencyText[donation.urgency] || 'Pickup Available'}</div>
            <div class="food-type-badge ${donation.type}">${typeText[donation.type] || donation.type}</div>
        </div>
        <div class="food-content">
            <h4 class="food-title">${donation.title}</h4>
            <p class="food-description">${donation.description}</p>
            
            <div class="food-details">
                <div class="detail-item">
                    <span class="detail-label">Quantity:</span>
                    <span class="detail-value">${donation.quantity}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Expiry:</span>
                    <span class="detail-value">${donation.expiry}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${donation.location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${donation.contact}</span>
                </div>
            </div>

            <div class="food-meta">
                <span class="donor-info">
                    <img src="${donation.donor.avatar}" alt="Donor" class="donor-avatar">
                    ${donation.donor.name}
                </span>
                <span class="posted-time">Posted ${timeAgo}</span>
            </div>

            <div class="food-actions">
                <button class="btn btn-primary accept-btn" data-donation-id="${donation.id}" style="display: none;">Accept Donation</button>
                <button class="btn btn-outline">Contact Donor</button>
                <button class="btn btn-outline">Share</button>
            </div>
        </div>
    `;

    return card;
}

function initializeFilters() {
    const foodTypeFilter = document.getElementById('food-type-filter');
    const locationFilter = document.getElementById('location-filter');
    const urgencyFilter = document.getElementById('urgency-filter');
    const sortBy = document.getElementById('sort-by');

    [foodTypeFilter, locationFilter, urgencyFilter, sortBy].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const foodType = document.getElementById('food-type-filter')?.value || '';
    const location = document.getElementById('location-filter')?.value || '';
    const urgency = document.getElementById('urgency-filter')?.value || '';
    const sortBy = document.getElementById('sort-by')?.value || 'recent';

    // Filter donations
    filteredDonations = foodDonations.filter(donation => {
        return (!foodType || donation.type === foodType) &&
               (!location || donation.city === location) &&
               (!urgency || donation.urgency === urgency);
    });

    // Sort donations
    switch(sortBy) {
        case 'recent':
            filteredDonations.sort((a, b) => new Date(b.postedTime) - new Date(a.postedTime));
            break;
        case 'expiry':
            filteredDonations.sort((a, b) => getExpiryHours(a.expiry) - getExpiryHours(b.expiry));
            break;
        case 'quantity':
            filteredDonations.sort((a, b) => getQuantityNumber(b.quantity) - getQuantityNumber(a.quantity));
            break;
        case 'distance':
            // Simple distance sorting (would need geolocation in real app)
            filteredDonations.sort((a, b) => a.location.localeCompare(b.location));
            break;
    }

    renderFoodDonations();
    checkUserAccess(); // Re-apply user access controls
}

function getExpiryHours(expiry) {
    // Convert expiry text to hours for sorting
    if (expiry.includes('hour')) return parseInt(expiry);
    if (expiry.includes('today')) return 24;
    if (expiry.includes('tomorrow')) return 48;
    if (expiry.includes('day')) return parseInt(expiry) * 24;
    if (expiry.includes('week')) return parseInt(expiry) * 24 * 7;
    if (expiry.includes('month')) return parseInt(expiry) * 24 * 30;
    return 999999; // For very long expiry
}

function getQuantityNumber(quantity) {
    // Extract number from quantity string
    const match = quantity.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
}

function initializeFoodPosting() {
    const foodPostingModal = document.getElementById('food-posting-modal');
    const foodPostingForm = document.getElementById('food-posting-form');
    const modalClose = foodPostingModal?.querySelector('.modal-close');

    if (modalClose) {
        modalClose.addEventListener('click', closeFoodPostingModal);
    }

    if (foodPostingModal) {
        foodPostingModal.addEventListener('click', function(e) {
            if (e.target === foodPostingModal) {
                closeFoodPostingModal();
            }
        });
    }

    if (foodPostingForm) {
        foodPostingForm.addEventListener('submit', handleFoodPosting);
    }
}

function openFoodPostingModal() {
    const modal = document.getElementById('food-posting-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeFoodPostingModal() {
    const modal = document.getElementById('food-posting-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleFoodPosting(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.type !== 'donor') {
        showNotification('Only donors can post food donations', 'error');
        return;
    }

    // Collect form data
    const formData = {
        id: Date.now(),
        title: document.getElementById('food-name').value,
        description: document.getElementById('food-description').value,
        type: document.getElementById('food-type').value,
        quantity: document.getElementById('food-quantity').value,
        expiry: document.getElementById('expiry-time').value,
        urgency: document.getElementById('pickup-urgency').value,
        location: document.getElementById('pickup-address').value,
        city: document.getElementById('pickup-city').value,
        contact: document.getElementById('contact-phone').value,
        donor: {
            name: currentUser.name,
            avatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=30&h=30"
        },
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
        postedTime: new Date(),
        status: "available"
    };

    // Add to donations array
    foodDonations.unshift(formData);
    saveFoodDonations();
    
    // Refresh display
    applyFilters();
    
    // Close modal
    closeFoodPostingModal();
    
    // Show success message
    showNotification('Food donation posted successfully!', 'success');
    
    // Notify NGOs and recipients
    notifyUsersAboutNewDonation(formData);
    
    // Reset form
    document.getElementById('food-posting-form').reset();
}

function handleAcceptDonation(e) {
    const donationId = parseInt(e.target.getAttribute('data-donation-id'));
    const donation = foodDonations.find(d => d.id === donationId);
    
    if (!donation) return;
    
    if (!currentUser || (currentUser.type !== 'recipient' && currentUser.type !== 'ngo')) {
        showNotification('Please login as recipient or NGO to accept donations', 'warning');
        return;
    }

    // Update donation status
    donation.status = 'accepted';
    donation.acceptedBy = {
        name: currentUser.name,
        type: currentUser.type,
        time: new Date()
    };

    saveFoodDonations();
    
    // Update UI
    e.target.textContent = 'Accepted';
    e.target.disabled = true;
    e.target.classList.remove('btn-primary');
    e.target.classList.add('btn-success');
    
    showNotification('Donation accepted successfully!', 'success');
    
    // Notify donor
    notifyDonorAboutAcceptance(donation);
}

function saveFoodDonations() {
    localStorage.setItem('kindnet_food_donations', JSON.stringify(foodDonations));
}

function notifyUsersAboutNewDonation(donation) {
    // In a real app, this would send notifications to NGOs and recipients
    console.log('Notifying users about new donation:', donation.title);
    
    // Show notification to current user
    setTimeout(() => {
        showNotification(`New food donation posted: ${donation.title}`, 'info');
    }, 1000);
}

function notifyDonorAboutAcceptance(donation) {
    // In a real app, this would notify the donor
    console.log('Notifying donor about acceptance:', donation.title);
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

function getTimeAgo(date) {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
    } else {
        return `${diffDays} days ago`;
    }
}