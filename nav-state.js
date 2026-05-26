(() => {
  const storageKey = "ai-room-nav-root";
  const backKey = "ai-room-back-href";
  const allowedRoots = new Set(["home", "hall", "my-room"]);
  const isProfilePath = (path) => /\/profile\.html$/.test(path || "");
  const isRoomPath = (path) => /\/room-[^/]+\.html$/.test(path || "");
  const isRoomHref = (href) => /(^|\/)room-[^/]+\.html($|[?#])/.test(href || "");
  const cleanTitle = (value) => (value || "").replace(/\s+/g, " ").trim();
  const appendRoomRuntime = () => {
    if (!isRoomPath(window.location.pathname)) return;

    const appendScript = (src, onload) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (onload) {
          if (existing.dataset.loaded === "true") {
            onload();
          } else {
            existing.addEventListener("load", onload, { once: true });
          }
        }
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        if (onload) onload();
      }, { once: true });
      document.body.appendChild(script);
    };

    appendScript("./room-data.js", () => appendScript("./room-app.js"));
  };

  const setupSettingsTabs = () => {
    const navItems = Array.from(document.querySelectorAll(".settings-nav-item[data-settings-target]"));
    const panels = Array.from(document.querySelectorAll(".settings-section[data-settings-panel]"));
    if (!navItems.length || !panels.length) return;

    const activate = (target) => {
      navItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.settingsTarget === target);
      });
      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.settingsPanel === target);
      });
    };

    const initial = navItems.find((item) => item.classList.contains("is-active"))?.dataset.settingsTarget || navItems[0].dataset.settingsTarget;
    activate(initial);

    navItems.forEach((item) => {
      item.addEventListener("click", () => activate(item.dataset.settingsTarget));
    });
  };

  const setupSidebarAccountMenu = () => {
    const logoutTool = document.querySelector('.sidebar-tools .tool[aria-label="Logout"]');
    if (!logoutTool) return;

    logoutTool.classList.add("tool-avatar");
    logoutTool.setAttribute("href", "#");
    logoutTool.setAttribute("aria-expanded", "false");
    logoutTool.setAttribute("aria-haspopup", "true");
    logoutTool.innerHTML = `
      <span class="tool-avatar-face" aria-hidden="true">
        <img src="./ai-avatar-random.svg" alt="" />
      </span>
    `;

    let menu = logoutTool.nextElementSibling;
    if (!menu || !menu.classList.contains("sidebar-account-menu")) {
      menu = document.createElement("div");
      menu.className = "sidebar-account-menu";
      menu.innerHTML = `
        <div class="sidebar-account-menu-copy">
          <strong>Current Account</strong>
          <span>Ready to leave AI Room?</span>
        </div>
        <a class="sidebar-account-action" href="./logout.html">Logout</a>
      `;
      logoutTool.insertAdjacentElement("afterend", menu);
    }

    const closeMenu = () => {
      menu.classList.remove("is-open");
      logoutTool.setAttribute("aria-expanded", "false");
    };

    logoutTool.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextState = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", nextState);
      logoutTool.setAttribute("aria-expanded", String(nextState));
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !logoutTool.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  const pathKey = (path) => {
    if (!path) return null;
    if (path === "/" || path.endsWith("/index.html")) return "home";
    if (path.endsWith("/hall.html")) return "hall";
    if (path.endsWith("/my-room.html") || path.endsWith("/my-room-entered.html") || path.endsWith("/my-room-created.html")) return "my-room";
    return null;
  };

  const hrefKey = (href) => {
    if (!href) return null;
    if (href.includes("index.html")) return "home";
    if (href.includes("hall.html")) return "hall";
    if (href.includes("my-room.html") || href.includes("my-room-entered.html") || href.includes("my-room-created.html")) return "my-room";
    return null;
  };

  const setStored = (value) => {
    if (!value) return;
    try {
      sessionStorage.setItem(storageKey, value);
    } catch {}
  };

  const setBackHref = (value) => {
    if (!value) return;
    try {
      sessionStorage.setItem(backKey, value);
    } catch {}
  };

  const getStored = () => {
    try {
      return sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const getBackHref = () => {
    try {
      return sessionStorage.getItem(backKey);
    } catch {
      return null;
    }
  };

  const rootHref = (value) => {
    if (value === "hall") return "./hall.html";
    if (value === "my-room") return "./my-room.html";
    return "./index.html";
  };

  const roomSourceFromUrl = () => {
    try {
      const value = new URL(window.location.href).searchParams.get("from");
      return allowedRoots.has(value) ? value : null;
    } catch {
      return null;
    }
  };

  const withRoomSource = (href, source) => {
    if (!href || !allowedRoots.has(source)) return href;

    try {
      const url = new URL(href, window.location.href);
      url.searchParams.set("from", source);
      const filename = url.pathname.split("/").pop() || href;
      return `${filename}${url.search}${url.hash}`;
    } catch {
      return href;
    }
  };

  const withRoomTitle = (href, title) => {
    const normalized = cleanTitle(title);
    if (!href || !normalized) return href;

    try {
      const url = new URL(href, window.location.href);
      url.searchParams.set("title", normalized);
      const filename = url.pathname.split("/").pop() || href;
      return `${filename}${url.search}${url.hash}`;
    } catch {
      return href;
    }
  };

  const extractRoomTitle = (item) => {
    const directText = [
      item.querySelector(".my-room-card-body strong"),
      item.querySelector(".my-room-list-copy strong"),
      item.querySelector(".hall-card strong"),
      item.querySelector("h3")
    ]
      .map((node) => cleanTitle(node?.textContent))
      .find(Boolean);

    if (directText) return directText;

    const aria = cleanTitle(item.getAttribute("aria-label"));
    if (!aria) return "";
    if (aria === "Random Entry") return "";
    return aria.replace(/^Enter/, "").trim();
  };

  const currentPath = window.location.pathname;
  if (isProfilePath(currentPath)) {
    window.location.replace("./settings.html");
    return;
  }

  const current = pathKey(currentPath);

  let refRoot = null;
  if (!current) {
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer);
        if (ref.origin === window.location.origin) {
          refRoot = pathKey(ref.pathname);
        }
      }
    } catch {}
  }

  const stored = getStored();
  const roomSource = roomSourceFromUrl();
  const roomContext = roomSource || refRoot || stored || "home";
  const active = current || (isRoomPath(currentPath) ? roomContext : stored || "home");
  const backHref = rootHref(active);

  document.body.dataset.navRoot = active;
  if (isRoomPath(currentPath)) {
    document.body.dataset.roomSource = roomContext;
  }

  if (current) {
    setStored(current);
    setBackHref(rootHref(current));
  } else if (isRoomPath(currentPath)) {
    setStored(active);
    setBackHref(backHref);
  } else if (refRoot) {
    setStored(refRoot);
    setBackHref(rootHref(refRoot));
  }

  document.querySelectorAll(".sidebar-nav .nav-item").forEach((item) => {
    const key = hrefKey(item.getAttribute("href"));
    item.classList.toggle("active", key === active);
    if (key) item.addEventListener("click", () => {
      setStored(key);
      setBackHref(rootHref(key));
    });
  });

  document.querySelectorAll(".content-backbar").forEach((item) => {
    const href = getBackHref() || backHref;
    item.setAttribute("href", href);
  });

  document.querySelectorAll('.sidebar-tools .tool[aria-label="Profile"]').forEach((item) => {
    item.remove();
  });

  setupSidebarAccountMenu();
  setupSettingsTabs();

  document.querySelectorAll("a[href]").forEach((item) => {
    const href = item.getAttribute("href");
    if (!isRoomHref(href)) return;
    const title = extractRoomTitle(item);
    item.setAttribute("href", withRoomTitle(withRoomSource(href, active), title));
    item.addEventListener("click", () => {
      setStored(active);
      setBackHref(backHref);
    });
  });

  appendRoomRuntime();
})();
