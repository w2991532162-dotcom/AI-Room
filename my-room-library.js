(() => {
  const LIBRARY_KEY = "ai-room-user-created-library";
  const PINNED_KEY = "ai-room-pinned-rooms";
  const HOME_LIMIT = 4;

  const enteredRooms = [
    {
      id: "room-insomnia",
      href: "./room-insomnia.html",
      coverImage: "./hall-deepnight.png",
      name: "深夜树洞",
      summary: "有人在这里倾听，适合在深夜慢慢放下情绪，再继续往里说。",
      shortSummary: "有人在这里倾听",
      metaPrimary: "失眠空间",
      metaSecondary: "128 次对话",
      sideLabel: "进入中",
      sideValue: "最近活跃",
      avatars: ["./ai-avatar-insomnia.svg", "./ai-avatar-random.svg", "./ai-avatar-loneliness.svg"]
    },
    {
      id: "room-love",
      href: "./room-love.html",
      coverImage: "./hall-philosophy-v2.png",
      name: "哲学思辨馆",
      summary: "关于生命、意义与关系，适合慢速拆解问题本身。",
      shortSummary: "关于生命、意义",
      metaPrimary: "思辨讨论",
      metaSecondary: "72 次对话",
      sideLabel: "常访问",
      sideValue: "2 AI 在线",
      avatars: ["./ai-avatar-love.svg", "./ai-avatar-knowledge.svg", "./ai-avatar-memory.svg"]
    },
    {
      id: "room-crowd",
      href: "./room-crowd.html",
      coverImage: "./hall-crowd.png",
      name: "灵感碰撞场",
      summary: "三个 AI 同时参与，适合脑暴和快速扩展方向。",
      shortSummary: "三个 AI 正在头脑风暴",
      metaPrimary: "创意空间",
      metaSecondary: "183 次对话",
      sideLabel: "最活跃",
      sideValue: "3 AI 在线",
      avatars: ["./ai-avatar-crowd.svg", "./ai-avatar-future.svg", "./ai-avatar-knowledge.svg"]
    },
    {
      id: "room-future",
      href: "./room-future.html",
      coverImage: "./hall-future.png",
      name: "未来想象局",
      summary: "一起把模糊的未来设想推进成完整世界观。",
      shortSummary: "我们一起构建",
      metaPrimary: "未来构建",
      metaSecondary: "156 次对话",
      sideLabel: "持续进入",
      sideValue: "结构型房间",
      avatars: ["./ai-avatar-future.svg", "./ai-avatar-crowd.svg", "./ai-avatar-love.svg"]
    }
  ];

  const defaultCreatedRooms = [
    {
      id: "room-knowledge",
      href: "./room-knowledge.html?owner=me",
      coverImage: "./hall-knowledge.png",
      name: "星光收藏家",
      description: "记录美好与灵感，把零散问题慢慢整理成可沉淀的内容。",
      shortSummary: "记录美好与灵感",
      metaPrimary: "知识整理",
      metaSecondary: "28 次对话",
      sideLabel: "你创建的",
      sideValue: "公开中",
      visibility: "public"
    },
    {
      id: "room-memory",
      href: "./room-memory.html?owner=me",
      coverImage: "./hall-anonymous.png",
      name: "梦境记录本",
      description: "记录梦境碎片与片段感受，保留模糊的图像和回声。",
      shortSummary: "记录梦境碎片",
      metaPrimary: "梦境收纳",
      metaSecondary: "16 次对话",
      sideLabel: "你创建的",
      sideValue: "私密房间",
      visibility: "private"
    },
    {
      id: "room-loneliness",
      href: "./room-loneliness.html?owner=me",
      coverImage: "./hall-emotion.png",
      name: "情绪收容所",
      description: "安放所有情绪与留白，适合慢速陪伴和柔和表达。",
      shortSummary: "安放所有情绪",
      metaPrimary: "情绪陪伴",
      metaSecondary: "33 次对话",
      sideLabel: "你创建的",
      sideValue: "1 AI 在线",
      visibility: "private"
    },
    {
      id: "room-random",
      href: "./room-random.html?owner=me",
      coverImage: "./hall-floating.png",
      name: "AI 随想集",
      description: "让灵感自由流动，记录所有还没整理好的想法和片段。",
      shortSummary: "想法的自由流动",
      metaPrimary: "个人草稿",
      metaSecondary: "9 次对话",
      sideLabel: "你创建的",
      sideValue: "持续编辑",
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
    name: item.name || "我的房间",
    description: item.description || "这是你另存下来的房间配置",
    shortSummary: summarize(item.description, "这是你另存下来的房间"),
    metaPrimary: item.visibility === "private" ? "私密房间" : "公开房间",
    metaSecondary: "刚刚保存",
    sideLabel: "你创建的",
    sideValue: item.visibility === "private" ? "私密" : "公开",
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
      <span>${pinnedSet.has(roomId) ? "已置顶" : "置顶"}</span>
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
          <em>${escapeHtml(item.visibility === "private" ? "私密" : "公开")}</em>
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
    if (title === "我进入的房间") {
      list.innerHTML = enteredList.map(renderEnteredListItem).join("");
      return;
    }

    if (title === "我创建的房间") {
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
