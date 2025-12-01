// Snowflake Configuration - Change these numbers to adjust snowflake count
const SNOWFLAKE_COUNT = 100; // Number of falling snowflakes
const FLOATING_DECORATIONS_COUNT = 10; // Number of floating decorative emojis

// Modal Image Configuration - Adjust opacity for ethereal effect (0.0 = transparent, 1.0 = fully opaque)
const MODAL_IMAGE_OPACITY = 0.85; // Image opacity for ethereal effect (0.0 - 1.0)

// Advent Calendar Application
class AdventCalendar {
  constructor() {
    this.imageData = {};
    this.currentDate = new Date();
    this.currentDay = this.currentDate.getDate();
    this.currentMonth = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    this.openedDays = this.loadOpenedDays();
    this.testMode = false; // Test mode off by default
    this.init();
  }

  async init() {
    await this.loadImageData();
    this.createSnowflakes();
    this.createFloatingDecorations();
    this.setupTestModeToggle();
    this.renderCalendar();
    this.setupModal();
    this.setupResetToggle();
  }

  createSnowflakes() {
    const snowContainer = document.querySelector(".snow-container");
    if (!snowContainer) return;

    const snowflakeTypes = ["❄", "❅", "❆"];

    // Adjust count based on screen size for better performance
    let count = SNOWFLAKE_COUNT;
    if (window.innerWidth <= 480) {
      count = Math.min(SNOWFLAKE_COUNT, 15); // Mobile: max 15
    } else if (window.innerWidth <= 768) {
      count = Math.min(SNOWFLAKE_COUNT, 25); // Tablet: max 25
    }

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.textContent = snowflakeTypes[i % snowflakeTypes.length];

      // Generate random properties for variety
      const left = Math.random() * 100; // 0-100%
      const duration = 8 + Math.random() * 5; // 8-13 seconds
      const delay = Math.random() * 3; // 0-3 seconds
      const fontSize =
        window.innerWidth <= 480
          ? 0.8 + Math.random() * 0.3 // Mobile: 0.8-1.1rem
          : 1 + Math.random() * 0.5; // Desktop: 1-1.5rem

      // Apply styles inline for unique animations
      snowflake.style.left = `${left}%`;
      snowflake.style.animationDuration = `${duration}s`;
      snowflake.style.animationDelay = `${delay}s`;
      snowflake.style.fontSize = `${fontSize}rem`;

      snowContainer.appendChild(snowflake);
    }
  }

  createFloatingDecorations() {
    const floatingEmojis = [
      "❄️",
      "❄️",
      "❄️",
      "⭐",
      "⭐",
      "🎅",
      "🎄",
      "🎁",
      "🦌",
      "🔔",
    ];
    const positions = [
      { top: "10%", left: "10%", delay: 0, size: 2 },
      { top: "30%", right: "15%", delay: 2, size: 1.5 },
      { top: "60%", left: "20%", delay: 4, size: 1.8 },
      { top: "20%", right: "25%", delay: 1, size: 1.3 },
      { top: "70%", right: "30%", delay: 3, size: 1.4 },
      { top: "50%", left: "5%", delay: 2.5, size: 2 },
      { top: "15%", right: "10%", delay: 1.8, size: 1.6 },
      { top: "80%", left: "15%", delay: 3.2, size: 1.7 },
      { top: "40%", right: "8%", delay: 2.8, size: 1.9 },
      { top: "65%", right: "20%", delay: 1.3, size: 1.4 },
    ];

    // Adjust count based on screen size
    let count = FLOATING_DECORATIONS_COUNT;
    if (window.innerWidth <= 480) {
      count = 6; // Mobile: show first 6 only
    }

    for (let i = 0; i < count && i < floatingEmojis.length; i++) {
      const decoration = document.createElement("div");
      decoration.className = "snowflakes";
      decoration.textContent = floatingEmojis[i];

      const pos = positions[i];
      decoration.style.top = pos.top;
      if (pos.left) decoration.style.left = pos.left;
      if (pos.right) decoration.style.right = pos.right;
      decoration.style.animationDelay = `${pos.delay}s`;
      const size =
        window.innerWidth <= 480
          ? pos.size * 0.6 // Mobile: reduce size
          : pos.size;
      decoration.style.fontSize = `${size}rem`;

      document.body.appendChild(decoration);
    }
  }

  async loadImageData() {
    try {
      const response = await fetch("imageData.json");
      this.imageData = await response.json();
    } catch (error) {
      console.error("Error loading imageData.json:", error);
      // Fallback data structure
      this.imageData = {};
    }
  }

  loadOpenedDays() {
    const saved = localStorage.getItem("adventOpenedDays");
    return saved ? JSON.parse(saved) : [];
  }

  saveOpenedDays() {
    localStorage.setItem("adventOpenedDays", JSON.stringify(this.openedDays));
  }

  isDayUnlocked(day) {
    // If test mode toggle is enabled, unlock all days
    if (this.testMode) {
      return true;
    }

    // Check for test mode in URL (e.g., ?test=true) - alternative method
    const urlParams = new URLSearchParams(window.location.search);
    const urlTestMode = urlParams.get("test") === "true";

    // If URL test mode is enabled, unlock all days
    if (urlTestMode) {
      return true;
    }

    // If not December, unlock all days for testing purposes
    // In production during December, this will enforce date restrictions
    if (this.currentMonth !== 12) {
      return true; // Unlock all for testing outside December
    }

    // In December: unlock days up to and including today
    return day <= this.currentDay;
  }

  isDayOpened(day) {
    return this.openedDays.includes(day);
  }

  openDay(day) {
    if (!this.isDayOpened(day)) {
      this.openedDays.push(day);
      this.saveOpenedDays();
    }
  }

  renderCalendar() {
    const tree = document.querySelector(".tree");
    tree.innerHTML = "";

    // Tree structure: 1, 2, 3, 4, 5, 6, 4 (total 25 days)
    const treeStructure = [1, 2, 3, 4, 5, 6, 4];
    let dayCounter = 1;

    treeStructure.forEach((daysInRow, rowIndex) => {
      const row = document.createElement("div");
      row.className = "tree-row";

      for (let i = 0; i < daysInRow; i++) {
        const day = dayCounter;
        const card = this.createDayCard(day);
        row.appendChild(card);
        dayCounter++;
      }

      tree.appendChild(row);
    });
  }

  createDayCard(day) {
    const card = document.createElement("div");
    card.className = "day-card";
    card.dataset.day = day;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Day ${day}`);

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayNumber.setAttribute("aria-hidden", "true");
    card.appendChild(dayNumber);

    const isUnlocked = this.isDayUnlocked(day);
    const isOpened = this.isDayOpened(day);

    if (!isUnlocked) {
      card.classList.add("locked");
    } else if (isOpened) {
      card.classList.add("opened");
      this.setCardIcon(card, day);
      card.addEventListener("click", () => this.handleDayClick(day));
    } else {
      card.addEventListener("click", () => this.handleDayClick(day));
    }

    return card;
  }

  handleDayClick(day) {
    if (!this.isDayUnlocked(day)) {
      return;
    }

    this.openDay(day);
    this.updateCardState(day);
    this.showModal(day);
  }

  updateCardState(day) {
    const card = document.querySelector(`[data-day="${day}"]`);
    if (card) {
      card.classList.add("opened");
      this.setCardIcon(card, day);
    }
  }

  setCardIcon(card, day) {
    const dayNumberEl = card.querySelector(".day-number");
    if (!dayNumberEl) return;

    dayNumberEl.textContent = this.getDayIcon(day);
    dayNumberEl.setAttribute("aria-hidden", "false");
    card.setAttribute("aria-label", `Day ${day} surprise unlocked`);
  }

  getDayIcon(day) {
    const icons = [
      "🎅",
      "🍭",
      "🍬",
      "🎁",
      "🧦",
      "🕯️",
      "🦌",
      "❄️",
      "🍪",
      "⛄️",
      "🎄",
      "🔔",
    ];

    return icons[(day - 1) % icons.length];
  }

  showModal(day) {
    const dateKey = `12-${String(day).padStart(2, "0")}`;
    const dayData = this.imageData[dateKey] || {};

    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const modalDescription = document.getElementById("modal-description");
    const modalAudio = document.getElementById("modal-audio");

    // Set image
    if (dayData.image) {
      modalImage.src = `images/${dayData.image}`;
      modalImage.alt = dayData.description || `Day ${day} surprise`;
      modalImage.style.display = "block";
      modalImage.style.opacity = MODAL_IMAGE_OPACITY;
    } else {
      modalImage.style.display = "none";
    }

    // Set description
    if (dayData.description) {
      modalDescription.textContent = dayData.description;
      modalDescription.style.display = "block";
    } else {
      modalDescription.style.display = "none";
    }

    // Set audio and show music selector
    const musicSelector = document.querySelector(".music-selector");
    if (dayData.audio) {
      modalAudio.src = `audio/${dayData.audio}`;
      modalAudio.style.display = "block";
      if (musicSelector) {
        musicSelector.style.display = "flex";
      }
      // Auto-play audio (optional - you may want to remove this)
      modalAudio.play().catch((e) => {
        console.log("Audio autoplay prevented:", e);
      });
    } else {
      modalAudio.style.display = "none";
      modalAudio.src = "";
      if (musicSelector) {
        musicSelector.style.display = "none";
      }
    }

    modal.style.display = "block";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  setupModal() {
    const modal = document.getElementById("modal");
    const closeBtn = document.querySelector(".close");
    const modalAudio = document.getElementById("modal-audio");
    const musicBtnLeft = document.getElementById("music-btn-left");
    const musicBtnRight = document.getElementById("music-btn-right");

    const closeModal = () => {
      modal.style.display = "none";
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      if (modalAudio) {
        modalAudio.pause();
        modalAudio.currentTime = 0;
      }
    };

    // Music selection functionality
    const switchMusic = (songFile) => {
      if (modalAudio) {
        const wasPlaying = !modalAudio.paused;
        const currentTime = modalAudio.currentTime;

        modalAudio.src = `audio/${songFile}`;
        modalAudio.load();

        if (wasPlaying) {
          modalAudio.currentTime = currentTime;
          modalAudio.play().catch((e) => {
            console.log("Audio play prevented:", e);
          });
        } else {
          modalAudio.play().catch((e) => {
            console.log("Audio play prevented:", e);
          });
        }
      }
    };

    if (musicBtnLeft) {
      musicBtnLeft.addEventListener("click", (event) => {
        event.stopPropagation();
        switchMusic("kansasCity.mp3");
      });
    }

    if (musicBtnRight) {
      musicBtnRight.addEventListener("click", (event) => {
        event.stopPropagation();
        switchMusic("sugarSugarArchies.mp3");
      });
    }

    closeBtn.addEventListener("click", closeModal);

    // Close when clicking anywhere on the modal (including the image)
    modal.addEventListener("click", (event) => {
      // Only prevent closing if clicking on the close button, audio controls, or music buttons
      if (
        event.target === closeBtn ||
        event.target.closest(".close") ||
        event.target === modalAudio ||
        event.target.closest("#modal-audio") ||
        event.target === musicBtnLeft ||
        event.target === musicBtnRight ||
        event.target.closest(".music-select-btn")
      ) {
        return;
      }
      closeModal();
    });

    // Close on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.style.display === "block") {
        closeModal();
      }
    });

    // Prevent closing when clicking on audio controls
    if (modalAudio) {
      modalAudio.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }
  }

  setupTestModeToggle() {
    const testModeToggle = document.getElementById("test-mode-toggle");
    if (!testModeToggle) {
      return;
    }

    const updateToggleState = () => {
      if (this.testMode) {
        testModeToggle.classList.add("active");
        testModeToggle.title =
          "Test mode ON - All dates unlocked (Click to turn off)";
      } else {
        testModeToggle.classList.remove("active");
        testModeToggle.title = "Toggle test mode (unlock all dates)";
      }
    };

    testModeToggle.addEventListener("click", () => {
      this.testMode = !this.testMode;
      updateToggleState();
      // Re-render calendar to update locked/unlocked states
      this.renderCalendar();
    });

    // Initialize the toggle state
    updateToggleState();
  }

  setupResetToggle() {
    const resetHeading = document.getElementById("reset-heading");
    if (!resetHeading) {
      return;
    }

    const handleReset = () => {
      if (
        confirm(
          "Are you sure you want to reset the calendar? This will clear all opened days."
        )
      ) {
        this.resetCalendar();
      }
    };

    resetHeading.addEventListener("click", handleReset);
    resetHeading.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleReset();
      }
    });
  }

  resetCalendar() {
    // Clear opened days from localStorage
    localStorage.removeItem("adventOpenedDays");
    this.openedDays = [];

    // Re-render the calendar to show all days as unopened
    this.renderCalendar();

    // Close modal if open
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    const audio = document.getElementById("modal-audio");
    audio.pause();
    audio.currentTime = 0;
  }
}

// Initialize the calendar when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new AdventCalendar();
});
