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
    const desktop = document.querySelector(".desktop");
    const desktopRect = desktop.getBoundingClientRect();
    appWindow.classList.toggle("fullscreen");
    if (appWindow.classList.contains("fullscreen")) {
      appWindow.style.position = "absolute";
      appWindow.style.top = `${desktop.offsetTop}px`;
      appWindow.style.left = `${desktop.offsetLeft}px`;
      appWindow.style.width = `${desktop.offsetWidth}px`;
      appWindow.style.height = `${desktop.offsetHeight}px`;
      appWindow.style.borderRadius = "0";
    } else {
      // Restore to default size and center in desktop
      const width = desktop.offsetWidth * 0.4;
      const height = desktop.offsetHeight * 0.4;
      appWindow.style.width = `${width}px`;
      appWindow.style.height = `${height}px`;
      appWindow.style.left = `${
        desktop.offsetLeft + (desktop.offsetWidth - width) / 2
      }px`;
      appWindow.style.top = `${
        desktop.offsetTop + (desktop.offsetHeight - height) / 2
      }px`;
      appWindow.style.borderRadius = "10px";
    }
  });
}

openAppWithAnimation(".file-explorer-icon", "#fileExplorerWindow"); // File Explorer
openAppWithAnimation(".notepad-icon", "#notepadWindow"); // Notepad
openAppWithAnimation(".iconCtn[title='This PC']", "#thisPcWindow"); // This PC

// ==============================
// 🖱️ Drag App Window by Header
// ==============================
function makeWindowDraggable(windowSelector) {
  const appWindow = document.querySelector(windowSelector);
  const header = appWindow.querySelector(".appHeader");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;
  let animFrame;

  function animate() {
    // Smoothly interpolate to target position
    const currentX = parseFloat(appWindow.style.left) || 0;
    const currentY = parseFloat(appWindow.style.top) || 0;
    const lerp = (a, b, t) => a + (b - a) * t;
    const nextX = lerp(currentX, targetX, 0.25);
    const nextY = lerp(currentY, targetY, 0.25);
    appWindow.style.left = `${nextX}px`;
    appWindow.style.top = `${nextY}px`;
    if (Math.abs(nextX - targetX) > 0.5 || Math.abs(nextY - targetY) > 0.5) {
      animFrame = requestAnimationFrame(animate);
    } else {
      appWindow.style.left = `${targetX}px`;
      appWindow.style.top = `${targetY}px`;
    }
  }

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = appWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    appWindow.style.zIndex = 99;
    document.body.style.userSelect = "none";
    // Cancel any ongoing animation
    cancelAnimationFrame(animFrame);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const desktop = document.querySelector(".desktop");
      const desktopRect = desktop.getBoundingClientRect();
      const winWidth = appWindow.offsetWidth;
      const winHeight = appWindow.offsetHeight;
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      x = Math.max(desktopRect.left, Math.min(x, desktopRect.right - winWidth));
      y = Math.max(
        desktopRect.top,
        Math.min(y, desktopRect.bottom - winHeight)
      );
      targetX = x;
      targetY = y;
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(animate);
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      const desktop = document.querySelector(".desktop");
      const desktopRect = desktop.getBoundingClientRect();
      const winWidth = appWindow.offsetWidth;
      const winHeight = appWindow.offsetHeight;
      let left = targetX;
      let top = targetY;
      left = Math.max(
        desktopRect.left,
        Math.min(left, desktopRect.right - winWidth)
      );
      top = Math.max(
        desktopRect.top,
        Math.min(top, desktopRect.bottom - winHeight)
      );
      targetX = left;
      targetY = top;
      animFrame = requestAnimationFrame(animate);
    }
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
}

makeWindowDraggable("#fileExplorerWindow");
makeWindowDraggable("#notepadWindow");
makeWindowDraggable("#thisPcWindow");

// This PC folder and drive click functionality
function setupThisPcFunctionality() {
  const thisPcWindow = document.getElementById("thisPcWindow");
  if (!thisPcWindow) return;

  // Folder click: show alert (or open File Explorer in the future)
  thisPcWindow.querySelectorAll(".thisPc-folder").forEach((folder) => {
    folder.addEventListener("dblclick", () => {
      alert(`Opening ${folder.querySelector("span").textContent}...`);
      // Optionally, you could open the File Explorer window here
    });
  });

  // Drive click: show alert
  thisPcWindow.querySelectorAll(".thisPc-drive").forEach((drive) => {
    drive.addEventListener("dblclick", () => {
      alert(`Opening ${drive.querySelector("span").textContent}...`);
    });
  });
}

setupThisPcFunctionality();
