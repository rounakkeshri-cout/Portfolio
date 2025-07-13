// Game State
const gameState = {
  score: 0,
  coins: 0,
  // soundEnabled: true, // Removed as per user request
  currentSectionIndex: 0, // Track current section by index
  sections: [], // Will be populated with section elements
  sectionSpeech: {
    home: "Hey! I'm Rounak! Let's surf through my portfolio! 🏄‍♂️",
    about: "Let me tell you my story! 📖",
    skills: "Check out my power-ups! ⚡",
    projects: "My awesome creations! 🚀",
    contact: "Let's connect and build something awesome! 🤝",
  },
}

// DOM Elements
const scoreElement = document.getElementById("score")
const coinsElement = document.getElementById("coins")
const finalScoreElement = document.getElementById("final-score")
const finalCoinsElement = document.getElementById("final-coins")
// const soundToggle = document.getElementById("sound-toggle") // Removed as per user request
const resumeBtn = document.getElementById("resume-btn")
const loadingScreen = document.getElementById("loading-screen")
const runner = document.getElementById("runner")
const speechBubble = document.getElementById("speech-bubble")
const gameWorldContainer = document.getElementById("game-world-container")
const prevSectionBtn = document.getElementById("prev-section-btn")
const nextSectionBtn = document.getElementById("next-section-btn")
const mobileMenu = document.getElementById("mobile-menu")
const navMenu = document.getElementById("nav-menu")
const contactForm = document.querySelector(".contact-form")

// Other JS code here...

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Optional: you can also bind it dynamically instead of using `onclick` in HTML



// Initialize Game
function initializeGame() {
  console.log("initializeGame: Function called.")
  // Populate sections array
  gameState.sections = Array.from(document.querySelectorAll(".game-section"))

  // Initialize AOS (Animate On Scroll)
  initAOS()

  // Initialize counters
  setTimeout(() => {
    animateCounters()
  }, 1000)

  // Initialize skill bars
  setTimeout(() => {
    animateSkillBars()
  }, 1500)

  // Add interactive elements
  addInteractiveElements()

  // Setup horizontal navigation
  setupHorizontalNavigation()

  console.log("🎮 Subway Surfers Portfolio Game Initialized!")
  console.log("🏃‍♂️ Runner ready!")
  console.log("🎯 Game mechanics active!")
  console.log("🎨 Animations loaded!")
}

// Loading Sequence
function startLoadingSequence() {
  console.log("startLoadingSequence: Function called.")
  setTimeout(() => {
    console.log("startLoadingSequence: Hiding loading screen in 3 seconds.")
    console.log("startLoadingSequence: loadingScreen element found:", loadingScreen) // Check if element is null/undefined
    if (loadingScreen) {
      // Ensure loadingScreen exists before accessing classList
      loadingScreen.classList.add("hidden")
    }
    console.log("startLoadingSequence: Timeout finished, hiding loading screen now.")
    startGameIntro()
  }, 3000)
}

function startGameIntro() {
  console.log("startGameIntro: Function called.")
  updateScore(100)
  updateCoins(10)
  showNotification("Welcome to Rounak's World! 🎮", "success")
  // Start runner animation
  if (runner) {
    runner.classList.add("running")
  }
  // Ensure initial section is visible and buttons are updated
  updateNavigationButtons()
  updateSectionSpeech(gameState.sections[gameState.currentSectionIndex].id)
}

// Game Functions
function updateScore(points) {
  if (!scoreElement || !finalScoreElement) {
    // Ensure elements exist
    console.warn("Score elements not found, skipping score update.")
    return
  }
  gameState.score += points
  scoreElement.textContent = gameState.score
  finalScoreElement.textContent = gameState.score
  // Add score animation
  scoreElement.parentElement.style.transform = "scale(1.2)"
  setTimeout(() => {
    scoreElement.parentElement.style.transform = "scale(1)"
  }, 200)
}

function updateCoins(amount) {
  if (!coinsElement || !finalCoinsElement) {
    // Ensure elements exist
    console.warn("Coin elements not found, skipping coin update.")
    return
  }
  gameState.coins += amount
  coinsElement.textContent = gameState.coins
  finalCoinsElement.textContent = gameState.coins
  // Add coin animation
  coinsElement.parentElement.style.transform = "scale(1.2)"
  setTimeout(() => {
    coinsElement.parentElement.style.transform = "scale(1)"
  }, 200)
}

function collectCoin(coinElement) {
  coinElement.style.animation = "coinCollect 0.5s ease-in-out forwards"
  updateCoins(5)
  updateScore(10)
  // if (gameState.soundEnabled) { // Removed sound check
  //   playSound("coin")
  // }
  setTimeout(() => {
    coinElement.remove()
  }, 500)
}

// function playSound(type) { // Removed as per user request
//   // Visual sound feedback since we can't play actual audio
//   const soundIndicator = document.createElement("div")
//   soundIndicator.className = "sound-indicator"
//   soundIndicator.textContent = type === "coin" ? "💰" : "🎵"
//   soundIndicator.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 80px;
//         font-size: 2rem;
//         z-index: 10002;
//         animation: soundPop 0.5s ease-in-out forwards;
//         pointer-events: none;
//     `
//   document.body.appendChild(soundIndicator)
//   setTimeout(() => {
//     soundIndicator.remove()
//   }, 500)
// }

// Navigation Functions
function startJourney() {
  updateScore(50)
  // Move to the next section (About)
  navigateToSection(1) // Index 1 is 'about'
}

// New function for horizontal navigation
function navigateToSection(index) {
  if (!gameWorldContainer || index < 0 || index >= gameState.sections.length) {
    console.error("Invalid section index or game world container not found.")
    return
  }
  gameState.currentSectionIndex = index
  // Use window.innerWidth for precise full-page movement
  const sectionWidth = window.innerWidth
  const offset = -index * sectionWidth // Calculate pixel offset for transform
  gameWorldContainer.style.transform = `translateX(${offset}px)`

  // Update URL hash without scrolling
  const sectionId = gameState.sections[index].id
  history.pushState(null, null, `#${sectionId}`)

  updateScore(25)
  updateSectionSpeech(sectionId)
  updateNavigationButtons()
}

function updateNavigationButtons() {
  if (prevSectionBtn) {
    prevSectionBtn.disabled = gameState.currentSectionIndex === 0
  }
  if (nextSectionBtn) {
    nextSectionBtn.disabled = gameState.currentSectionIndex === gameState.sections.length - 1
  }
}

function updateSectionSpeech(sectionId) {
  const message = gameState.sectionSpeech[sectionId] || "Welcome to my journey!"
  updateSpeechBubble(message)

  // Update mini runner speech bubble for other sections
  const runnerMiniSpeechBubble = document.querySelector(".runner-mini .speech-bubble-mini p")
  if (runnerMiniSpeechBubble) {
    runnerMiniSpeechBubble.textContent = message
  }
}

function updateSpeechBubble(message) {
  if (speechBubble) {
    speechBubble.querySelector("p").textContent = message
    speechBubble.style.animation = "bubbleFloat 2s ease-in-out infinite"
  }
}

// Resume Download Function
function downloadResume() {
  // Create a mock resume content
  const resumeContent = `ROUNAK KESHRI
Full Stack Developer & Problem Solver

CONTACT INFORMATION
Email: rounakkeshri000@gmail.com
Phone: +91 6206094364
Location: Kolkata, West Bengal, India
LinkedIn: linkedin.com/in/rounak-keshri
GitHub: github.com/rounak-keshri

EDUCATION
B.Tech in Electrical Engineering (2022-2026)
Techno Main Salt Lake, Kolkata
GPA: 6.5/10.00

Higher Secondary Education (2021)
Rajkamal Saraswati Vidhya Mandir, Dhanbad
Percentage: 83.2%

TECHNICAL SKILLS
Programming Languages: C++, Python, Java, C
Web Technologies: HTML/CSS, JavaScript, Django, Flask
Databases: MongoDB, MySQL
Tools: Git/GitHub, Data Structures & Algorithms

CODING PLATFORMS
• CodeChef: 3 Star (Max Rating: 1323)
• HackerRank: 5 Star in C++ & Python
• LeetCode: Active Solver (Max Rating: 1190)
• Codeforces: Pupil Level

PROJECTS
1. Online Code Runner
 - Web-based code execution platform
 - Technologies: HTML, CSS, JavaScript
2. Food Delivery Website
 - Full-featured delivery platform
 - Technologies: HTML, CSS, JavaScript, Node.js, Firebase
3. Live Chat Application
 - Real-time messaging system
 - Technologies: HTML, CSS, JavaScript, WebSockets, Socket.io

ACHIEVEMENTS
• 15+ Projects Completed
• Strong problem-solving skills
• Passionate about web development and competitive programming
`
  // Create and download the resume
  const blob = new Blob([resumeContent], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "Rounak_Keshri_Resume.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  updateScore(100)
  updateCoins(20)
  showNotification("Resume downloaded successfully! 📄", "success")
  // if (gameState.soundEnabled) { // Removed sound check
  //   playSound("download")
  // }
}

// Event Listeners Setup
function setupEventListeners() {
  // Resume download
  if (resumeBtn) {
    resumeBtn.addEventListener("click", downloadResume)
  }

  // Sound toggle (removed from HTML, so this listener is no longer needed)
  // if (soundToggle) {
  //   soundToggle.addEventListener("click", toggleSound)
  // }

  // Navigation links (updated to use navigateToSection)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetIndex = gameState.sections.findIndex((section) => section.id === targetId)
      if (targetIndex !== -1) {
        navigateToSection(targetIndex)
      }
      // Close mobile menu if open
      if (navMenu && mobileMenu) {
        navMenu.classList.remove("active")
        mobileMenu.classList.remove("active")
      }
    })
  })

  // Mobile menu toggle
  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Coin collection
  document.querySelectorAll(".coin").forEach((coin) => {
    coin.addEventListener("click", () => collectCoin(coin))
  })

  // Power-up interactions
  document.querySelectorAll(".power-up").forEach((powerUp) => {
    powerUp.addEventListener("click", () => {
      powerUp.style.animation = "powerUpCollect 0.5s ease-in-out forwards"
      updateScore(30)
      updateCoins(3)
      showNotification(`${powerUp.getAttribute("data-power")} power-up activated! ⚡`, "success")
    })
  })

  // Contact form handling with enhanced UX
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const formData = new FormData(this)
      const name = formData.get("name")
      const email = formData.get("email")
      const message = formData.get("message")

      // Enhanced validation
      if (!name || name.trim().length < 2) {
        showNotification("Please enter a valid name", "error")
        return
      }
      if (!email || !isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }
      if (!message || message.trim().length < 10) {
        showNotification("Please enter a message with at least 10 characters", "error")
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      // Simulate API call
      setTimeout(() => {
        showNotification("Thank you for your message! I'll get back to you soon.", "success")
        this.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        updateScore(200)
        updateCoins(50)
        // if (gameState.soundEnabled) { // Removed sound check
        //   playSound("success")
        // }
      }, 2000)
    })
  }
}

// function toggleSound() { // Removed as per user request
//   gameState.soundEnabled = !gameState.soundEnabled
//   const icon = soundToggle.querySelector("i")
//   if (gameState.soundEnabled) {
//     icon.className = "fas fa-volume-up"
//     showNotification("Sound enabled! 🔊", "success")
//   } else {
//     icon.className = "fas fa-volume-mute"
//     showNotification("Sound disabled! 🔇", "error") // Changed to error for visual distinction
//   }
//   updateScore(10)
// }

// Horizontal Navigation Setup
function setupHorizontalNavigation() {
  if (prevSectionBtn) {
    prevSectionBtn.addEventListener("click", () => {
      navigateToSection(gameState.currentSectionIndex - 1)
    })
  }
  if (nextSectionBtn) {
    nextSectionBtn.addEventListener("click", () => {
      navigateToSection(gameState.currentSectionIndex + 1)
    })
  }

  // Handle initial load based on URL hash
  const initialHash = window.location.hash.substring(1)
  if (initialHash) {
    const initialIndex = gameState.sections.findIndex((section) => section.id === initialHash)
    if (initialIndex !== -1) {
      navigateToSection(initialIndex)
    }
  } else {
    // Ensure the first section is shown by default
    navigateToSection(0)
  }
}

// Add Interactive Elements
function addInteractiveElements() {
  // Add click effects to project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.style.animation = "cardBounce 0.5s ease-in-out"
      updateScore(20)
      updateCoins(2)
    })
  })

  // Add hover effects to arcade machines
  document.querySelectorAll(".arcade-machine").forEach((machine) => {
    machine.addEventListener("mouseenter", () => {
      machine.style.animation = "machineGlow 1s ease-in-out infinite"
      updateScore(5)
    })
    machine.addEventListener("mouseleave", () => {
      machine.style.animation = "none"
    })
  })

  // Add click effects to social buttons
  document.querySelectorAll(".social-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateScore(15)
      updateCoins(1)
      showNotification("Social link activated! 🔗", "success")
    })
  })
}

// Game completion check
function checkGameCompletion() {
  if (gameState.score >= 1000) {
    showNotification("🎉 Congratulations! You've mastered Rounak's World! 🎉", "success")
    updateCoins(100)
  }
}

// Periodic score updates
setInterval(() => {
  if (gameState.score > 0) {
    checkGameCompletion()
  }
}, 5000)

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Notification system
function showNotification(message, type = "success") {
  const container = document.getElementById("notification-container")
  if (!container) {
    console.error("Notification container not found!")
    return
  }
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
      <span>${message}</span>
  `
  container.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Animated counters
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")
  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0
    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.ceil(current)
        setTimeout(updateCounter, 30)
      } else {
        counter.textContent = target
      }
    }
    updateCounter()
  })
}

// Skill bars animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    setTimeout(() => {
      bar.style.width = width
    }, 200)
  })
}

// Simple AOS (Animate On Scroll) implementation
function initAOS() {
  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")
        // Trigger specific animations
        if (entry.target.classList.contains("fade-in")) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
        if (entry.target.classList.contains("project-card")) {
          entry.target.classList.add("animate")
        }
        // Animate counters when about section is visible
        if (entry.target.id === "about") {
          setTimeout(animateCounters, 500)
        }
        // Animate skill bars when skills section is visible
        if (entry.target.id === "skills") {
          setTimeout(animateSkillBars, 500)
        }
      } else {
        // Optional: remove aos-animate when out of view to re-trigger on scroll back
        // entry.target.classList.remove("aos-animate");
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll("[data-aos]").forEach((el) => {
    observer.observe(el)
  })
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el)
  })
  document.querySelectorAll(".project-card").forEach((el) => {
    observer.observe(el)
  })
  // Observe sections
  const aboutSection = document.getElementById("about")
  const skillsSection = document.getElementById("skills")
  if (aboutSection) observer.observe(aboutSection)
  if (skillsSection) observer.observe(skillsSection)
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Ensure navMenu and mobileMenu exist before accessing them
  const navMenu = document.getElementById("nav-menu")
  const mobileMenu = document.getElementById("mobile-menu")
  if (e.key === "Escape") {
    // Close mobile menu if open
    if (navMenu && mobileMenu && navMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active")
      navMenu.classList.remove("active")
    }
  }
  // Konami code easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]
  if (!window.konamiProgress) window.konamiProgress = 0
  if (e.code === konamiCode[window.konamiProgress]) {
    window.konamiProgress++
    if (window.konamiProgress === konamiCode.length) {
      updateScore(500)
      updateCoins(100)
      showNotification("🎮 KONAMI CODE ACTIVATED! Bonus points! 🎮", "success")
      window.konamiProgress = 0
    }
  } else {
    window.konamiProgress = 0
  }
})

// Add focus management for accessibility
document.querySelectorAll(".btn, .social-icon, .project-link").forEach((element) => {
  element.addEventListener("focus", function () {
    this.style.outline = "2px solid var(--accent-primary)"
    this.style.outlineOffset = "2px"
  })
  element.addEventListener("blur", function () {
    this.style.outline = "none"
  })
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debouncing to scroll events (still useful for fixed header, even with horizontal sections)
const debouncedScrollHandler = debounce(() => {
  // No specific scroll effects for the top bar needed with this layout
}, 10)
window.addEventListener("scroll", debouncedScrollHandler)

// Particles effect for hero section
function createParticles() {
  const hero = document.querySelector(".hero-station")
  if (!hero) {
    console.warn("Particles: Hero section (.hero-station) not found, skipping particle creation.")
    return
  }
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles-container"
  particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
  `
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float-particle ${Math.random() * 10 + 10}s infinite linear;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 10}s;
      `
    particlesContainer.appendChild(particle)
  }
  hero.appendChild(particlesContainer)

  // Add particle animation CSS
  const style = document.createElement("style")
  style.textContent = `
      @keyframes float-particle {
          0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
          }
          10% {
              opacity: 1;
          }
          90% {
              opacity: 1;
          }
          100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
          }
      }
  `
  document.head.appendChild(style)
}

// Initial setup when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded: Setting up event listeners and initial game state.")
  setupEventListeners() // Call setupEventListeners here
  initializeGame() // Initialize the game logic
})

// Add loading animation
window.addEventListener("load", () => {
  console.log("Script: Window loaded event fired.")
  document.body.classList.add("loaded")
  // Initialize particles effect for hero section
  console.log("Script: Attempting to create particles.")
  createParticles()
  // Start the loading sequence to hide the loading screen
  console.log("Script: Attempting to start loading sequence.")
  startLoadingSequence()
})

console.log("🚀 Portfolio script loaded successfully!")
console.log("✨ Theme system active (if elements exist)")
console.log("🎨 Animations initialized (if elements exist)")
console.log("📱 Responsive design ready")
console.log("🚇 Welcome to Rounak's Subway Surfers Portfolio! 🚇")
console.log("🎮 Collect coins, earn points, and explore my journey!")
console.log("🏃‍♂️ Let the adventure begin!")
