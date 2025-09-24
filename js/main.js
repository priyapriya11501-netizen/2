// Main JavaScript functionality for KindNet platform

// Global variables
let map;
let donationModal;
let campaignModal;
let lightboxModal;
let currentLightboxImages = [];
let currentLightboxIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    initializeCounters();
    initializeForms();
    initializeMap();
    initializeFilters();
    initializeDonationFlow();
    initializeFileUpload();
    initializeInteractiveElements();
    initializeImageUpload();
    initializeLightbox();
    initializeImageGalleries();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Modal functionality
function initializeModals() {
    donationModal = document.getElementById('donation-modal');
    campaignModal = document.getElementById('campaign-modal');
    
    // Donation modal
    if (donationModal) {
        const donateButtons = document.querySelectorAll('.donate-btn, [data-cause]');
        const closeButton = donationModal.querySelector('.modal-close');
        
        donateButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const causeTitle = this.getAttribute('data-cause') || 'Selected Campaign';
                openDonationModal(causeTitle);
            });
        });
        
        if (closeButton) {
            closeButton.addEventListener('click', closeDonationModal);
        }
        
        donationModal.addEventListener('click', function(e) {
            if (e.target === donationModal) {
                closeDonationModal();
            }
        });
    }
    
    // Campaign creation modal
    if (campaignModal) {
        const createButtons = document.querySelectorAll('[data-modal="campaign"]');
        const closeButton = campaignModal.querySelector('.modal-close');
        
        createButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openCampaignModal();
            });
        });
        
        if (closeButton) {
            closeButton.addEventListener('click', closeCampaignModal);
        }
        
        campaignModal.addEventListener('click', function(e) {
            if (e.target === campaignModal) {
                closeCampaignModal();
            }
        });
    }
}

function openDonationModal(causeTitle) {
    if (donationModal) {
        const modalCauseTitle = document.getElementById('modal-cause-title');
        if (modalCauseTitle) {
            modalCauseTitle.textContent = causeTitle;
        }
        donationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDonationModal() {
    if (donationModal) {
        donationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openCampaignModal() {
    if (campaignModal) {
        campaignModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCampaignModal() {
    if (campaignModal) {
        campaignModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Animated counters
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Form handling
function initializeForms() {
    // Donation form
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmit);
    }
    
    // Help request form
    const helpRequestForm = document.getElementById('help-request-form');
    if (helpRequestForm) {
        helpRequestForm.addEventListener('submit', handleHelpRequestSubmit);
    }
    
    // Campaign form
    const campaignForm = document.querySelector('.campaign-form');
    if (campaignForm) {
        campaignForm.addEventListener('submit', handleCampaignSubmit);
    }
}

// Form submission handlers
function handleDonationSubmit(e) {
    e.preventDefault();
    // Handle donation form submission
    console.log('Donation form submitted');
    // Add your donation processing logic here
}

function handleHelpRequestSubmit(e) {
    e.preventDefault();
    // Handle help request form submission
    console.log('Help request form submitted');
    // Add your help request processing logic here
}

function handleCampaignSubmit(e) {
    e.preventDefault();
    // Handle campaign form submission
    console.log('Campaign form submitted');
    // Add your campaign processing logic here
}

// Map initialization
function initializeMap() {
    // Initialize map preview on homepage
    const mapPreview = document.getElementById('map-preview');
    if (mapPreview) {
        // Initialize Leaflet map
        const map = L.map('map-preview').setView([28.6139, 77.2090], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add sample markers
        const sampleLocations = [
            [28.6139, 77.2090, "Emergency Food Relief"],
            [28.5355, 77.3910, "School Books Drive"],
            [28.7041, 77.1025, "Medical Equipment"]
        ];
        
        sampleLocations.forEach(location => {
            L.marker([location[0], location[1]])
                .addTo(map)
                .bindPopup(location[2]);
        });
    }
    
    // Initialize donation map
    const donationMap = document.getElementById('donation-map');
    if (donationMap) {
        map = L.map('donation-map').setView([28.6139, 77.2090], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add more detailed markers for donation page
        const donationLocations = [
            [28.6139, 77.2090, "Emergency Food Relief", "urgent"],
            [28.5355, 77.3910, "School Books Drive", "education"],
            [28.7041, 77.1025, "Medical Equipment", "healthcare"],
            [28.4595, 77.0266, "Winter Clothes", "clothing"],
            [28.6692, 77.4538, "Cancer Treatment", "medical"]
        ];
        
        donationLocations.forEach(location => {
            const marker = L.marker([location[0], location[1]])
                .addTo(map)
                .bindPopup(`<strong>${location[2]}</strong><br>Category: ${location[3]}`);
        });
    }
}

// Filter functionality
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distance-value');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    // Distance slider
    if (distanceSlider && distanceValue) {
        distanceSlider.addEventListener('input', function() {
            distanceValue.textContent = this.value + ' km';
        });
    }
    
    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearFilters();
        });
    }
}

function applyFilters() {
    // Get selected filters
    const selectedCategories = [];
    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
    
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.value !== 'all') {
            selectedCategories.push(checkbox.value);
        }
    });
    
    // Apply filters to campaign cards
    const campaignCards = document.querySelectorAll('.cause-card');
    campaignCards.forEach(card => {
        const category = card.querySelector('.cause-category');
        if (category && selectedCategories.length > 0) {
            const cardCategory = category.textContent.toLowerCase();
            const shouldShow = selectedCategories.some(cat => cardCategory.includes(cat));
            card.style.display = shouldShow ? 'block' : 'none';
        }
    });
    
    console.log('Filters applied:', selectedCategories);
}

function clearFilters() {
    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = checkbox.value === 'all';
    });
    
    // Reset distance slider
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distance-value');
    if (distanceSlider && distanceValue) {
        distanceSlider.value = 10;
        distanceValue.textContent = '10 km';
    }
    
    // Show all campaign cards
    const campaignCards = document.querySelectorAll('.cause-card');
    campaignCards.forEach(card => {
        card.style.display = 'block';
    });
    
    console.log('Filters cleared');
}

// Donation flow
function initializeDonationFlow() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.querySelector('.amount-input');
    const donationAmount = document.getElementById('donation-amount');
    const processingFee = document.getElementById('processing-fee');
    const totalAmount = document.getElementById('total-amount');
    
    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update amount input
            const amount = this.getAttribute('data-amount');
            if (amountInput) {
                amountInput.value = amount;
            }
            
            updateDonationSummary(amount);
        });
    });
    
    // Custom amount input
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            // Remove active class from amount buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            updateDonationSummary(this.value);
        });
    }
    
    function updateDonationSummary(amount) {
        const numAmount = parseFloat(amount) || 0;
        const fee = Math.round(numAmount * 0.029); // 2.9% processing fee
        const total = numAmount + fee;
        
        if (donationAmount) donationAmount.textContent = `₹${numAmount.toLocaleString()}`;
        if (processingFee) processingFee.textContent = `₹${fee.toLocaleString()}`;
        if (totalAmount) totalAmount.textContent = `₹${total.toLocaleString()}`;
    }
}

// File upload functionality
function initializeFileUpload() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('.file-input');
        const fileList = zone.parentElement.querySelector('.file-list');
        
        if (!fileInput) return;
        
        // Drag and drop events
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFileSelection(files, fileList);
        });
        
        // Click to upload
        zone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', function() {
            handleFileSelection(this.files, fileList);
        });
    });
}

function handleFileSelection(files, fileList) {
    if (!fileList) return;
    
    Array.from(files).forEach(file => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (!allowedTypes.includes(file.type)) {
            alert('Please select valid file types (images, PDF, or Word documents)');
            return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }
        
        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name">${file.name}</span>
            <span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>
            <button type="button" class="remove-file" onclick="this.parentElement.remove()">×</button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Toggle view button
    const toggleViewBtn = document.getElementById('toggle-view');
    const causesList = document.getElementById('causes-list');
    
    if (toggleViewBtn && causesList) {
        toggleViewBtn.addEventListener('click', function() {
            causesList.style.display = causesList.style.display === 'none' ? 'block' : 'none';
            this.textContent = causesList.style.display === 'none' ? '📋 List View' : '🗺️ Map View';
        });
    }
    
    // Locate me button
    const locateMeBtn = document.getElementById('locate-me');
    if (locateMeBtn) {
        locateMeBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    if (map) {
                        map.setView([lat, lng], 13);
                        L.marker([lat, lng])
                            .addTo(map)
                            .bindPopup('Your location')
                            .openPopup();
                    }
                }, function() {
                    alert('Unable to retrieve your location');
                });
            } else {
                alert('Geolocation is not supported by this browser');
            }
        });
    }
}

// Image upload functionality
function initializeImageUpload() {
    const imageUploadSections = document.querySelectorAll('.image-upload-section');
    
    imageUploadSections.forEach(section => {
        const uploadZone = section.querySelector('.image-upload-zone');
        const imageInput = section.querySelector('.image-input');
        const previewGallery = section.querySelector('.image-preview-gallery');
        const browseBtns = section.querySelectorAll('.upload-browse-btn');
        
        if (!uploadZone || !imageInput || !previewGallery) return;
        
        // Browse button clicks
        browseBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                imageInput.click();
            });
        });
        
        // Drag and drop events
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            handleImageUpload(files, previewGallery);
        });
        
        // Click to upload
        uploadZone.addEventListener('click', function() {
            imageInput.click();
        });
        
        // File input change
        imageInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            handleImageUpload(files, previewGallery);
        });
    });
}

function handleImageUpload(files, previewGallery) {
    files.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select only image files');
            return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" class="preview-image">
                <div class="image-preview-overlay">
                    <button type="button" class="remove-image" onclick="this.parentElement.parentElement.remove()">×</button>
                    <button type="button" class="view-image" onclick="openLightbox('${e.target.result}')">👁</button>
                </div>
                <div class="image-info">
                    <span class="image-name">${file.name}</span>
                    <span class="image-size">${(file.size / 1024).toFixed(1)} KB</span>
                </div>
            `;
            
            previewGallery.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    });
}

// Lightbox functionality
function initializeLightbox() {
    // Create lightbox modal if it doesn't exist
    if (!document.getElementById('lightbox-modal')) {
        const lightboxHTML = `
            <div id="lightbox-modal" class="lightbox-modal">
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img id="lightbox-image" src="" alt="Lightbox Image">
                    <div class="lightbox-nav">
                        <button class="lightbox-prev">‹</button>
                        <button class="lightbox-next">›</button>
                    </div>
                    <div class="lightbox-info">
                        <span id="lightbox-counter">1 / 1</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Close on background click
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });
}

function openLightbox(imageSrc, images = []) {
    if (!lightboxModal) return;
    
    currentLightboxImages = images.length > 0 ? images : [imageSrc];
    currentLightboxIndex = currentLightboxImages.indexOf(imageSrc);
    
    if (currentLightboxIndex === -1) {
        currentLightboxIndex = 0;
    }
    
    updateLightboxImage();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    if (currentLightboxImages.length <= 1) return;
    
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex >= currentLightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentLightboxImages.length - 1;
    }
    
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    if (lightboxImage && currentLightboxImages[currentLightboxIndex]) {
        lightboxImage.src = currentLightboxImages[currentLightboxIndex];
    }
    
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
    }
}

// Image galleries
function initializeImageGalleries() {
    const galleries = document.querySelectorAll('.campaign-image-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-main-image');
        const indicators = gallery.querySelectorAll('.gallery-indicator');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        
        if (images.length <= 1) {
            // Hide navigation if only one image
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        }
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                showImage(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            });
        }
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showImage(index);
            });
        });
        
        // Auto-play (optional)
        setInterval(() => {
            const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            showImage(newIndex);
        }, 5000);
        
        // Initialize first image
        showImage(0);
    });
}
    