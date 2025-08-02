// === COOKIE CONSENT & ANALYTICS ===
let analyticsInitialized = false;

function initAnalytics() {
    if (analyticsInitialized) return;
    // Placeholder for Google Analytics
    console.log("Analytics initialized");
    // Uncomment below and replace G-XXXXXXXXXX when ready
    /*
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
    */
    analyticsInitialized = true;
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').style.display = 'none';
    initAnalytics();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieBanner').style.display = 'none';
}

function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        document.getElementById('cookieBanner').style.display = 'block';
    } else if (consent === 'accepted') {
        initAnalytics();
    }
}

// === MODAL FUNCTIONS ===
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Track event
        if (window.gtag) {
            gtag('event', modalId === 'signinModal' ? 'sign_in_modal_open' : 'signup_modal_open');
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function switchToSignup() {
    closeModal('signinModal');
    openModal('signupModal');
}

function switchToSignin() {
    closeModal('signupModal');
    openModal('signinModal');
}

// === FORM HANDLING ===
document.addEventListener('DOMContentLoaded', function () {
    // Handle Sign In Form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            // Simulate login
            alert(`Signing in as ${email}`);
            closeModal('signinModal');
        });
    }

    // Handle Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            // Simulate signup
            alert(`Welcome, ${firstName}! Your account has been created.`);
            closeModal('signupModal');
        });
    }

    // === DYNAMIC CONTENT ===
    function loadCommunities() {
        const container = document.getElementById('communitiesGrid');
        if (!container) return;
        const communities = [
            { emoji: '🇳🇬', name: 'Lagos Tech Hub', location: 'Lagos, Nigeria', desc: 'Join Africa\'s fastest-growing tech community.' },
            { emoji: '🏛️', name: 'Diaspora DC', location: 'Washington D.C.', desc: 'Networking for African professionals in the US.' },
            { emoji: '🎨', name: 'Joburg Creatives', location: 'Johannesburg, SA', desc: 'Artists shaping the cultural narrative of modern Africa.' }
        ];
        container.innerHTML = communities.map(c => `
            <article class="community-card">
                <div class="community-image">${c.emoji}</div>
                <h3 class="community-name">${c.name}</h3>
                <p class="community-location">${c.location}</p>
                <p class="community-description">${c.desc}</p>
            </article>
        `).join('');
    }

    // === POLYMORPHIC INTERFACE ===
    window.switchMode = function(button, mode) {
        document.querySelectorAll('.mode-tab').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const content = document.querySelector('.preview-content');
        const data = {
            forum: { h3: 'Deep Discussions', p: 'Reddit-style conversations with African cultural context.<br>Voice comments, live audio rooms, and expert AMAs.' },
            social: { h3: 'Cultural Sharing', p: 'Instagram meets African storytelling. Share moments, recipes, fashion, and traditions.' },
            network: { h3: 'Professional Network', p: 'LinkedIn for the diaspora. Find mentors, jobs, and business opportunities.' },
            events: { h3: 'Community Events', p: 'Discover and create local meetups, festivals, and professional networking events.' }
        };
        content.innerHTML = `<h3>${data[mode].h3}</h3><p>${data[mode].p}</p>`;
    };

    // === INITIALIZATION ===
    checkCookieConsent();
    loadCommunities();

    // Close modals on click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => closeModal(modal.id));
        }
    });
});