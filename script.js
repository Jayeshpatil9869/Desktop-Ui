// Realtime Clock (already working)
function updateDateTime() {
  const timeElement = document.getElementById("liveTime");
  const dateElement = document.getElementById("liveDate");

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  timeElement.textContent = `${hours}:${String(minutes).padStart(
    2,
    "0"
  )} ${ampm}`;
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

  startBtn.addEventListener("click", () => {
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
}

startMenu();

// App Launcher
// 📁 File Explorer Double Click
function openAppWithAnimation(iconSelector, appWindowSelector) {
  const icons = document.querySelectorAll(iconSelector);
  const appWindow = document.querySelector(appWindowSelector);

  icons.forEach((icon) => {
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

openAppWithAnimation(".file-explorer-icon", "#fileExplorerWindow"); // File Explorer
openAppWithAnimation(".notepad-icon", "#notepadWindow"); // Notepad

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
makeWindowDraggable("#notepadWindow");
