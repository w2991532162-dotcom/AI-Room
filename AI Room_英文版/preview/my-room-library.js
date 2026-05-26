(() => {
  const LIBRARY_KEY = "ai-room-user-created-library";
  const PINNED_KEY = "ai-room-pinned-rooms";
  const HOME_LIMIT = 4;

  const enteredRooms = [
    {
      id: "room-insomnia",
      href: "./room-insomnia.html",
      coverImage: "./hall-deepnight.png",
      name: "Midnight Tree Hole",
      summary: "Someone is listening here, suitable for slowly releasing emotions at night before continuing.",
      shortSummary: "Someone is listening here",
      metaPrimary: "Insomnia Space",
      metaSecondary: "128 conversations",
      sideLabel: "Entering",
      sideValue: "Recently Active",
      avatars: ["./ai-avatar-insomnia.svg", "./ai-avatar-random.svg", "./ai-avatar-loneliness.svg"]
    },
    {
      id: "room-love",
      href: "./room-love.html",
      coverImage: "./hall-philosophy-v2.png",
      name: "Philosophy Hall",
      summary: "About life, meaning and relationships. Suitable for slowly dissecting problems.",
      shortSummary: "About life, meaning",
      metaPrimary: "Philosophical Discussion",
      metaSecondary: "72 conversations",
      sideLabel: "Frequently Visited",
      sideValue: "2 AIs Online",
      avatars: ["./ai-avatar-love.svg", "./ai-avatar-knowledge.svg", "./ai-avatar-memory.svg"]
    },
    {
      id: "room-crowd",
      href: "./room-crowd.html",
      coverImage: "./hall-crowd.png",
      name: "Inspiration Collision Field",
      summary: "Three AIs participating simultaneously. Suitable for brainstorming and rapid expansion.",
      shortSummary: "Three AIs are brainstorming",
      metaPrimary: "Creative Space",
      metaSecondary: "183 conversations",
      sideLabel: "Most Active",
      sideValue: "3 AIs Online",
      avatars: ["./ai-avatar-crowd.svg", "./ai-avatar-future.svg", "./ai-avatar-knowledge.svg"]
    },
    {
      id: "room-future",
      href: "./room-future.html",
      coverImage: "./hall-future.png",
      name: "Future Imagination Bureau",
      summary: "Push vague future visions into complete worldviews together.",
      shortSummary: "Let's build together",
      metaPrimary: "Future Building",
      metaSecondary: "156 conversations",
      sideLabel: "Continuously Entering",
      sideValue: "Structured Room",
      avatars: ["./ai-avatar-future.svg", "./ai-avatar-crowd.svg", "./ai-avatar-love.svg"]
    }
  ];

  const defaultCreatedRooms = [
    {
      id: "room-knowledge",
      href: "./room-knowledge.html?owner=me",
      coverImage: "./hall-knowledge.png",
      name: "Starlight Collector",
      description: "Record beauty and inspiration, organize scattered thoughts into meaningful content.",
      shortSummary: "Record beauty and inspiration",
      metaPrimary: "Knowledge Organization",
      metaSecondary: "28 conversations",
      sideLabel: "Created by You",
      sideValue: "Public",
      visibility: "public"
    },
    {
      id: "room-memory",
      href: "./room-memory.html?owner=me",
      coverImage: "./hall-anonymous.png",
      name: "Dream Journal",
      description: "Record dream fragments and feelings, preserve vague images and echoes.",
      shortSummary: "Record dream fragments",
      metaPrimary: "Dream Collection",
      metaSecondary: "16 conversations",
      sideLabel: "Created by You",
      sideValue: "Private Room",
      visibility: "private"
    },
    {
      id: "room-loneliness",
      href: "./room-loneliness.html?owner=me",
      coverImage: "./hall-emotion.png",
      name: "Emotion Sanctuary",
      description: "Place all emotions and silence. Suitable for slow companionship and gentle expression.",
      shortSummary: "Place all emotions",
      metaPrimary: "Emotional Companion",
      metaSecondary: "33 conversations",
      sideLabel: "Created by You",
      sideValue: "1 AI Online",
      visibility: "private"
    },
    {
      id: "room-random",
      href: "./room-random.html?owner=me",
      coverImage: "./hall-floating.png",
      name: "AI Collection",
      description: "Let inspiration flow freely, record all unorganized thoughts and fragments.",
      shortSummary: "Free flow of thoughts",
      metaPrimary: "Personal Draft",
      metaSecondary: "9 conversations",
      sideLabel: "Created by You",
      sideValue: "Continuously Editing",
      visibility: "private"
    }
  ];

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const escapeHtml = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const summarize = (value, fallback, limit = 28) => {
    const text = (value || "").trim();
    return text ? text.slice(0, limit) : fallback;
  };

  const uniqueById = (list) => {
    const seen = new Set();
    return list.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const pinnedIds = (() => {
    const value = readJson(PINNED_KEY, []);
    return Array.isArray(value) ? value : [];
  })();

  const pinnedSet = new Set(pinnedIds);

  const sortByPinned = (list) =>
    [...list].sort((a, b) => {
      const aPinned = pinnedSet.has(a.id) ? 1 : 0;
      const bPinned = pinnedSet.has(b.id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return 0;
    });

  const decorateCreatedRoom = (item) => ({
    id: item.id,
    href: item.href || "./my-room.html?owner=me",
    coverImage: item.coverImage || "./hall-floating.png",
    name: item.name || "My Room",
    description: item.description || "This is your saved room configuration",
    shortSummary: summarize(item.description, "This is your saved room"),
    metaPrimary: item.visibility === "private" ? "Private Room" : "Public Room",
    metaSecondary: "Just saved",
    sideLabel: "Created by You",
    sideValue: item.visibility === "private" ? "Private" : "Public",
    visibility: item.visibility === "private" ? "private" : "public",
    isUserCreated: true
  });

  const userCreatedRooms = uniqueById(readJson(LIBRARY_KEY, []).map(decorateCreatedRoom));
  const createdRooms = sortByPinned(uniqueById([...userCreatedRooms, ...defaultCreatedRooms]));
  const enteredList = sortByPinned(enteredRooms);

  const togglePinned = (roomId) => {
    const current = readJson(PINNED_KEY, []);
    const list = Array.isArray(current) ? [...current] : [];
    const next = list.includes(roomId)
      ? list.filter((item) => item !== roomId)
      : [roomId, ...list.filter((item) => item !== roomId)];
    writeJson(PINNED_KEY, next);
    window.location.reload();
  };

  const pinButtonHtml = (roomId) => `
    <button class="my-room-pin-button ${pinnedSet.has(roomId) ? "is-pinned" : ""}" type="button" data-pin-room="${escapeHtml(roomId)}">
      <span>${pinnedSet.has(roomId) ? "Pinned" : "Pin"}</span>
    </button>
  `;

  const avatarGroupHtml = (avatars = []) =>
    avatars.length
      ? `<span class="my-room-card-avatars">${avatars.map((src) => `<img src="${escapeHtml(src)}" alt="" />`).join("")}</span>`
      : "";

  const renderEnteredCard = (item) => `
    <a class="my-room-card" href="${escapeHtml(item.href)}">
      <div class="my-room-card-thumb"><img src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(item.name)}" /></div>
      <div class="my-room-card-body">
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.shortSummary)}</p>
        <div class="my-room-card-meta">
          ${avatarGroupHtml(item.avatars)}
          <em>${escapeHtml(item.metaSecondary)}</em>
        </div>
      </div>
    </a>
  `;

  const renderCreatedCard = (item) => `
    <a class="my-room-card my-room-card-user" href="${escapeHtml(item.href)}">
      <div class="my-room-card-thumb"><img src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(item.name)}" /></div>
      <div class="my-room-card-body">
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.shortSummary)}</p>
        <div class="my-room-card-meta">
          <em>${escapeHtml(item.visibility === "private" ? "Private" : "Public")}</em>
        </div>
      </div>
    </a>
  `;

  const renderEnteredListItem = (item) => `
    <div class="my-room-list-entry">
      <a class="my-room-list-item" href="${escapeHtml(item.href)}">
        <div class="my-room-list-thumb"><img src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(item.name)}" /></div>
        <div class="my-room-list-copy">
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.summary)}</p>
          <div class="my-room-list-meta"><span>${escapeHtml(item.metaPrimary)}</span><span>${escapeHtml(item.metaSecondary)}</span></div>
        </div>
        <div class="my-room-list-side"><em>${escapeHtml(item.sideLabel)}</em><span>${escapeHtml(item.sideValue)}</span></div>
      </a>
      <div class="my-room-list-actions">
        ${pinButtonHtml(item.id)}
      </div>
    </div>
  `;

  const renderCreatedListItem = (item) => `
    <div class="my-room-list-entry">
      <a class="my-room-list-item ${item.isUserCreated ? "my-room-list-item-user" : ""}" href="${escapeHtml(item.href)}">
        <div class="my-room-list-thumb"><img src="${escapeHtml(item.coverImage)}" alt="${escapeHtml(item.name)}" /></div>
        <div class="my-room-list-copy">
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.description)}</p>
          <div class="my-room-list-meta"><span>${escapeHtml(item.metaPrimary)}</span><span>${escapeHtml(item.metaSecondary)}</span></div>
        </div>
        <div class="my-room-list-side"><em>${escapeHtml(item.sideLabel)}</em><span>${escapeHtml(item.sideValue)}</span></div>
      </a>
      <div class="my-room-list-actions">
        ${pinButtonHtml(item.id)}
      </div>
    </div>
  `;

  const renderMyRoomHome = () => {
    const sections = document.querySelectorAll(".my-room-page .my-room-section .my-room-card-grid");
    if (sections.length >= 2) {
      sections[0].innerHTML = enteredList.slice(0, HOME_LIMIT).map(renderEnteredCard).join("");
      sections[1].innerHTML = createdRooms.slice(0, HOME_LIMIT).map(renderCreatedCard).join("");
    }
  };

  const renderMyRoomLists = () => {
    const list = document.querySelector(".my-room-list-page .my-room-list");
    const head = document.querySelector(".my-room-list-page .my-room-list-head h1");
    if (!list || !head) return;

    const title = head.textContent.trim();
    if (title === "Rooms I Entered" || title === "我进入的房间") {
      list.innerHTML = enteredList.map(renderEnteredListItem).join("");
      return;
    }

    if (title === "Rooms I Created" || title === "我创建的房间") {
      list.innerHTML = createdRooms.map(renderCreatedListItem).join("");
    }
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-pin-room]");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    togglePinned(trigger.getAttribute("data-pin-room"));
  });

  renderMyRoomHome();
  renderMyRoomLists();
})();