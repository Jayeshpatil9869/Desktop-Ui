// Realtime Clock (already working)
function updateDateTime() {
  const timeElement = document.getElementById("liveTime");
  const dateElement = document.getElementById("liveDate");

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  timeElement.textContent = `${hours}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")} ${ampm}`;
  dateElement.textContent = `${now.getDate()}/${
    now.getMonth() + 1
  }/${now.getFullYear()}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// START MENU TOGGLE WITH GSAP
function startMenu() {
  const startBtn = document.getElementById("startBtn");
  const startMenu = document.getElementById("startMenu");

  // Initially hide the menu
  gsap.set(startMenu, {
    y: 50,
    opacity: 0,
    display: "none",
  });

  let isMenuOpen = false;

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent body click from firing
    if (!isMenuOpen) {
      // Show with animation
      gsap.set(startMenu, { display: "block" });
      gsap.to(startMenu, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      // Hide with animation
      gsap.to(startMenu, {
        y: 50,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(startMenu, { display: "none" });
        },
      });
    }
    isMenuOpen = !isMenuOpen;
  });

  // Close start menu when clicking outside
  document.body.addEventListener("mousedown", (e) => {
    if (isMenuOpen && !startMenu.contains(e.target) && e.target !== startBtn) {
      gsap.to(startMenu, {
        y: 50,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(startMenu, { display: "none" });
        },
      });
      isMenuOpen = false;
    }
  });
}

startMenu();

// App Launcher
// 📁 File Explorer Double Click
function openAppWithAnimation(iconSelector, appWindowSelector) {
  const icon = document.querySelector(iconSelector);
  const appWindow = document.querySelector(appWindowSelector);

  let clickCount = 0;

  icon.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 2) {
      gsap.set(appWindow, { display: "flex", scale: 0.6, opacity: 0 });
      gsap.to(appWindow, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      clickCount = 0;
    }

    setTimeout(() => {
      clickCount = 0;
    }, 300);
  });

  // Close button
  appWindow.querySelector(".closeBtn").addEventListener("click", () => {
    gsap.to(appWindow, {
      scale: 0.6,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(appWindow, { display: "none" });
      },
    });
  });

  // Minimize button
  appWindow.querySelector(".minBtn").addEventListener("click", () => {
    gsap.to(appWindow, {
      y: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power1.in",
      onComplete: () => {
        gsap.set(appWindow, { display: "none" });
      },
    });
  });

  // Maximize (toggle full screen)
  appWindow.querySelector(".maxBtn").addEventListener("click", () => {
    appWindow.classList.toggle("fullscreen");
    if (appWindow.classList.contains("fullscreen")) {
      appWindow.style.top = "0";
      appWindow.style.left = "0";
      appWindow.style.width = "100%";
      appWindow.style.height = "100%";
      appWindow.style.borderRadius = "0";
    } else {
      appWindow.style.top = "0%";
      appWindow.style.left = "0%";
      appWindow.style.width = "40%";
      appWindow.style.height = "40%";
      appWindow.style.borderRadius = "10px";
    }
  });
}

openAppWithAnimation(".iconCtn:nth-child(2)", "#fileExplorerWindow"); // File Explorer

// ==============================
// 🖱️ Drag App Window by Header
// ==============================
function makeWindowDraggable(windowSelector) {
  const appWindow = document.querySelector(windowSelector);
  const header = appWindow.querySelector(".appHeader");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = appWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    appWindow.style.zIndex = 99; // bring to front
    document.body.style.userSelect = "none"; // avoid text select
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      appWindow.style.left = `${x}px`;
      appWindow.style.top = `${y}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
}

makeWindowDraggable("#fileExplorerWindow");

// ==============================
// 🖱️ Desktop Icons Draggable (Right-Click, Smooth, Bounded, Grid)
// ==============================
function alignIconsInGrid() {
  const desktop = document.body; // or use a specific desktop container if you have one
  const icons = document.querySelectorAll(".iconCtn");
  const iconSize = 72; // Adjust based on your icon size (height + margin)
  const margin = 14; // Space between icons
  const desktopRect = desktop.getBoundingClientRect();
  const maxRows = Math.floor(
    (desktopRect.height - margin) / (iconSize + margin)
  );
  let x = margin,
    y = margin,
    row = 0;
  icons.forEach((icon, i) => {
    icon.style.position = "absolute";
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    icon.style.transition =
      "left 0.18s cubic-bezier(.4,1.3,.5,1), top 0.18s cubic-bezier(.4,1.3,.5,1)";
    row++;
    if (row >= maxRows) {
      row = 0;
      y = margin;
      x += iconSize + margin;
    } else {
      y += iconSize + margin;
    }
  });
}

function makeIconsDraggable() {
  const desktop = document.body; // or use a specific desktop container if you have one
  const icons = document.querySelectorAll(".iconCtn");
  let draggingIcon = null;
  let offsetX = 0,
    offsetY = 0;
  let desktopRect = null;

  icons.forEach((icon) => {
    icon.addEventListener("contextmenu", (e) => e.preventDefault()); // Prevent default right-click menu
    icon.addEventListener("mousedown", (e) => {
      if (e.button !== 2) return; // Only right mouse button
      draggingIcon = icon;
      desktopRect = desktop.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      offsetX = e.clientX - iconRect.left;
      offsetY = e.clientY - iconRect.top;
      icon.style.transition = "none";
      icon.style.zIndex = 100;
      document.body.style.userSelect = "none";
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!draggingIcon) return;
    let x = e.clientX - desktopRect.left - offsetX;
    let y = e.clientY - desktopRect.top - offsetY;
    // Boundaries
    const iconRect = draggingIcon.getBoundingClientRect();
    const iconW = iconRect.width;
    const iconH = iconRect.height;
    x = Math.max(0, Math.min(x, desktopRect.width - iconW));
    y = Math.max(0, Math.min(y, desktopRect.height - iconH));
    draggingIcon.style.left = `${x}px`;
    draggingIcon.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", (e) => {
    if (draggingIcon && e.button === 2) {
      draggingIcon.style.transition =
        "left 0.18s cubic-bezier(.4,1.3,.5,1), top 0.18s cubic-bezier(.4,1.3,.5,1)";
      draggingIcon.style.zIndex = 1;
      draggingIcon = null;
      document.body.style.userSelect = "auto";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  alignIconsInGrid();
  makeIconsDraggable();
  window.addEventListener("resize", alignIconsInGrid);
});

// ==============================
// 🪟 Quick Settings Panel Logic
// ==============================
// ==============================
// 🪟 Quick Settings Panel Logic (with GSAP animation)
// ==============================
(function quickSettingsPanelInit() {
  const trayIcon = document.getElementById("quickSettingsTrayIcon");
  const panel = document.getElementById("quickSettingsPanel");
  const toggles = panel.querySelectorAll(".qs-toggle");
  const volume = document.getElementById("qsVolume");
  const volumeVal = document.getElementById("qsVolumeVal");
  const brightness = document.getElementById("qsBrightness");
  const brightnessVal = document.getElementById("qsBrightnessVal");
  const batteryVal = document.getElementById("qsBatteryVal");
  const batteryCharging = document.getElementById("qsBatteryCharging");

  // Initial state
  gsap.set(panel, { y: 20, opacity: 0, display: "none" });
  let isPanelOpen = false;

  trayIcon.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    if (!isPanelOpen) {
      gsap.set(panel, { display: "block" });
      gsap.to(panel, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      isPanelOpen = true;
    } else {
      gsap.to(panel, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
        },
      });
      isPanelOpen = false;
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (isPanelOpen && !panel.contains(e.target) && e.target !== trayIcon) {
      gsap.to(panel, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
        },
      });
      isPanelOpen = false;
    }
  });

  // Toggle buttons (e.g. WiFi, Bluetooth)
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });

  // Volume control
  volume.addEventListener("input", () => {
    volumeVal.textContent = volume.value;
  });

  // Brightness control (with min brightness)
  brightness.addEventListener("input", () => {
    const value = brightness.value;
    brightnessVal.textContent = value;
    const brightnessNormalized = Math.max(value / 100, 0.4);
    document.documentElement.style.setProperty('--brightness-level', brightnessNormalized);
  });

  // Simulated battery logic
  function updateBattery() {
    const percent = 87; // or use navigator.getBattery()
    batteryVal.textContent = percent + "%";
    batteryCharging.style.display = (Math.random() > 0.5) ? "inline" : "none";
  }

  updateBattery();
})();
