// === COOKIE CONSENT & ANALYTICS ===
let analyticsInitialized = false;

function initAnalytics() {
    if (analyticsInitialized) return;
    console.log("Analytics initialized");
    analyticsInitialized = true;
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
    initAnalytics();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
}

function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    const banner = document.getElementById('cookieBanner');
    if (!consent && banner) {
        banner.style.display = 'block';
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
        signinForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            const message = document.getElementById('signinMessage') || createMessageElement('signinForm');

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                if (data.user) {
                    message.style.color = 'var(--success)';
                    message.textContent = 'Signed in successfully! Redirecting...';
                    setTimeout(() => {
                        window.location.href = '/dashboard.html'; // Or update UI
                    }, 1000);
                }
            } catch (error) {
                message.style.color = 'var(--error)';
                message.textContent = error.message;
            }
        });
    }

    // Handle Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const fullName = `${firstName} ${lastName}`.trim();
            const username = generateUsername(firstName, lastName);
            const message = document.getElementById('signupMessage') || createMessageElement('signupForm');

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            username: username
                        }
                    }
                });

                if (error) throw error;

                if (data.user) {
                    // Insert into public users table
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([
                            { id: data.user.id, username, email, full_name: fullName }
                        ]);

                    if (insertError) console.error('User insert error:', insertError);

                    message.style.color = 'var(--success)';
                    message.textContent = `Welcome, ${firstName}! Check your email to confirm your account.`;
                    setTimeout(() => {
                        closeModal('signupModal');
                    }, 2000);
                }
            } catch (error) {
                message.style.color = 'var(--error)';
                message.textContent = error.message;
            }
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

    // === SHARE FUNCTIONS ===
    window.shareToX = function() {
        const text = "I'm on MyAfroSphere – the real African community network. Join me in s/brainhealth: ";
        const url = "https://2ce85d2d.myafrosphere.pages.dev/";
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`, '_blank');
    };

    window.shareToWhatsApp = function() {
        const text = "I'm on MyAfroSphere – the real African community network. Join me in s/brainhealth: ";
        const url = "https://2ce85d2d.myafrosphere.pages.dev/";
        window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
    };

    // === SUPABASE CLIENT SETUP ===
    const getEnv = (key, fallback) => {
        return (typeof import !== 'undefined' && import.meta.env?.[key]) ||
               (typeof process !== 'undefined' && process.env?.[key]) ||
               fallback;
    };

    const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://your-project.supabase.co').trim();
    const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'your-anon-key').trim();

    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        script.onload = () => {
            try {
                window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
                console.log("✅ Supabase client loaded");
                
                // Check auth state
                supabase.auth.onAuthStateChange((event, session) => {
                    console.log('Auth state changed:', event);
                    if (event === 'SIGNED_IN') {
                        // User signed in
                        console.log('User signed in:', session.user);
                    } else if (event === 'SIGNED_OUT') {
                        // User signed out
                        console.log('User signed out');
                    }
                });
            } catch (error) {
                console.error("Failed to create Supabase client:", error);
            }
        };
        script.onerror = () => {
            console.error("Failed to load Supabase SDK");
        };
        document.head.appendChild(script);
    }

    // === HELPERS ===
    function createMessageElement(formId) {
        const message = document.createElement('p');
        message.id = formId === 'signinForm' ? 'signinMessage' : 'signupMessage';
        message.style.marginTop = '10px';
        message.style.fontSize = '14px';
        document.getElementById(formId).appendChild(message);
        return message;
    }

    function generateUsername(firstName, lastName) {
        const base = (firstName + lastName).toLowerCase().replace(/[^a-z]/g, '');
        return base.length >= 4 ? base : base + Math.floor(100 + Math.random() * 900);
    }

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

    // Check if user is already logged in
    async function checkAuthState() {
        if (window.supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // User is logged in - update UI accordingly
                console.log('User already logged in:', user);
                // Example: Hide sign-in button, show profile button
            }
        }
    }
    
    // Run auth check after Supabase is loaded
    setTimeout(checkAuthState, 1000);
});