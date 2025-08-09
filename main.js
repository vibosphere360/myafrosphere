// === ANALYTICS ===
const track = (event, data = {}) => {
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify({event, ...data})], {type: 'application/json'});
    navigator.sendBeacon('/log', blob);
  } else {
    console.log('Track:', event, data);
    
    // Fallback to localStorage
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({event, data, timestamp: Date.now()});
    localStorage.setItem('analytics', JSON.stringify(analytics));
  }
};

// Track page load
track('page_view', {path: window.location.pathname});

// === UBER-STYLE JOIN FLOW ===
function joinFlow(country) {
  track('country_selected', {country});
  
  const email = prompt(`Welcome to c/${country}! Just need your email to save your spot:`);
  if (email && validateEmail(email)) {
    // Save to localStorage temporarily
    const signups = JSON.parse(localStorage.getItem('signups') || '[]');
    signups.push({country, email, timestamp: Date.now()});
    localStorage.setItem('signups', JSON.stringify(signups));
    
    track('waitlist_signup', {country, email});
    showSharePrompt(country);
  } else if (email) {
    alert('Please enter a valid email address.');
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// === TIKTOK-STYLE STORIES ===
function engageWithStory(id) {
  track('story_view', {story_id: id});
  
  // In a real app, this would show a modal with full story
  alert(`Story #${id} would expand here with:\n\n` +
        "- Full text content\n" +
        "- Audio playback option\n" + 
        "- Comments section\n" +
        "- 'Show more like this' button");
}

// === VIRAL SHARING ===
function showSharePrompt(country) {
  const messages = {
    Nigeria: `🇳🇬 Just joined c/Nigeria on @MyAfroSphere! Where's your African community?`,
    Ghana: `🇬🇭 Connecting with my Ghanaian roots on @MyAfroSphere!`,
    Kenya: `🇰🇪 Found my Kenyan community on @MyAfroSphere!`,
    default: `🌍 Connecting with the African diaspora on @MyAfroSphere!`
  };
  
  const message = messages[country] || messages.default;
  const url = window.location.href;
  
  const share = confirm(`${message}\n\nShare with your people?`);
  if (share) {
    track('share_initiated', {country});
    
    // Prefer WhatsApp for African users
    if (navigator.userAgent.match(/iPhone|Android/i)) {
      window.open(`whatsapp://send?text=${encodeURIComponent(`${message} ${url}`)}`);
    } else {
      // Fallback to Twitter
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
    }
  }
}

// === CAROUSEL ===
const africanCountries = [
    { name: 'Nigeria', code: 'NG', emoji: '🇳🇬', region: 'West Africa' },
    { name: 'Ghana', code: 'GH', emoji: '🇬🇭', region: 'West Africa' },
    { name: 'Kenya', code: 'KE', emoji: '🇰🇪', region: 'East Africa' },
    // ... (keep all countries from your original list)
];

function initializeCarousel() {
  const track = document.getElementById('carouselTrack');
  const itemsHTML = africanCountries.map(country => `
    <div class="carousel-item" onclick="joinFlow('${country.name}')">
      <div class="country-flag">${country.emoji}</div>
      <div class="country-name">${country.name}</div>
    </div>
  `).join('');
  
  // Duplicate for seamless looping
  track.innerHTML = itemsHTML + itemsHTML;
}

function showAllCountries() {
  track('view_all_countries');
  document.getElementById('communities').scrollIntoView({behavior: 'smooth'});
}

// === SCROLL TRACKING ===
window.addEventListener('scroll', () => {
  const scrollDepth = Math.round((window.scrollY / document.body.scrollHeight) * 100);
  if (scrollDepth % 20 === 0) {
    track('scroll_depth', {percent: scrollDepth});
  }
}, {passive: true});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeCarousel();
  
  // Track time on page
  setInterval(() => {
    track('time_on_page', {seconds: 30});
  }, 30000);
});