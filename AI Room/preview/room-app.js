(() => {
  const APP = window.AIRoom || {};
  const roomCatalog = APP.roomCatalog || {};
  const currentPage = (window.location.pathname.split("/").pop() || "").replace(".html", "");

  if (!currentPage.startsWith("room-")) {
    return;
  }

  const room = roomCatalog[currentPage];
  if (!room) {
    return;
  }

  const pageParams = (() => {
    try {
      return new URL(window.location.href).searchParams;
    } catch {
      return new URLSearchParams();
    }
  })();

  const sourceDisplayTitle = (pageParams.get("title") || "").trim() || room.name;
  const isOwnedRoom = pageParams.get("owner") === "me";
  const canRenameRoom = true;
  const shouldSaveAsMine = !isOwnedRoom;
  const userRoomLibraryKey = "ai-room-user-created-library";

  const providerLabels = {
    gemini: "Gemini Flash",
    groq: "Groq / Llama",
    deepseek: "DeepSeek",
    "claude-style": "Claude 风格模拟",
    local: "本地模拟"
  };

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const matchedUserRoom = (() => {
    if (!isOwnedRoom) return null;
    const requestedUserRoomId = (pageParams.get("userRoom") || "").trim();
    const requestedTitle = (pageParams.get("title") || "").trim();
    const library = readJson(userRoomLibraryKey, []);
    if (!Array.isArray(library)) return null;
    if (requestedUserRoomId) {
      const byId = library.find((item) => item && item.id === requestedUserRoomId);
      if (byId) return byId;
    }
    if (!requestedTitle) return null;
    return library.find(
      (item) =>
        item &&
        item.sourceRoomId === currentPage &&
        (item.name || "").trim() === requestedTitle
    ) || null;
  })();

  const effectiveRoom = {
    ...room,
    name: matchedUserRoom?.name || sourceDisplayTitle || room.name,
    lead: matchedUserRoom?.lead || matchedUserRoom?.description || room.lead,
    prompt: matchedUserRoom?.prompt || room.prompt,
    style: matchedUserRoom?.aiRoster?.[0]?.style || matchedUserRoom?.style || room.style,
    mood: matchedUserRoom?.mood || room.mood,
    welcome: matchedUserRoom?.welcome || room.welcome,
    coverImage: matchedUserRoom?.coverImage || room.coverImage,
    visibility: matchedUserRoom?.visibility || "public",
    allowMultiAi: matchedUserRoom ? !!matchedUserRoom.allowMultiAi : room.allowMultiAi,
    aiRoster: Array.isArray(matchedUserRoom?.aiRoster) && matchedUserRoom.aiRoster.length
      ? matchedUserRoom.aiRoster
      : room.aiRoster
  };

  const roomStateScope = isOwnedRoom && matchedUserRoom?.id ? matchedUserRoom.id : room.id;

  const storageKeys = {
    conversations: `ai-room-conversations:${roomStateScope}`,
    settings: `ai-room-settings:${roomStateScope}`,
    apiKeys: "ai-room-api-keys",
    session: `ai-room-current-session:${roomStateScope}`
  };

  const writeJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const defaultModelByProvider = {
    gemini: "gemini-2.5-flash",
    groq: "llama-3.3-70b-versatile",
    deepseek: "deepseek-chat",
    "claude-style": "claude-style-room",
    local: "local-room"
  };

  const defaultModelForProvider = (providerName) => {
    if (providerName === effectiveRoom.provider && effectiveRoom.model) {
      return effectiveRoom.model;
    }

    return defaultModelByProvider[providerName] || "local-room";
  };

  const normalizeAiConfig = (item = {}, index = 0) => {
    const provider = item.provider || effectiveRoom.provider || "local";
    const role = (item.role || "").trim();

    return {
      name: (item.name || "").trim() || `AI ${index + 1}`,
      role,
      prompt: (item.prompt || "").trim() || [effectiveRoom.prompt, role ? `角色补充：${role}` : ""].filter(Boolean).join("\n"),
      style: (item.style || "").trim() || effectiveRoom.style || "",
      provider,
      model: (item.model || "").trim() || defaultModelForProvider(provider),
      apiKey: (item.apiKey || "").trim()
    };
  };

  const normalizeAiRoster = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return effectiveRoom.aiRoster.map((item, index) => normalizeAiConfig(item, index));
    }

    return list.map((item, index) => normalizeAiConfig(item, index));
  };

  const storedSettings = isOwnedRoom ? readJson(storageKeys.settings, {}) : {};

  const defaultSettings = {
    roomName: effectiveRoom.name,
    allowMultiAi: effectiveRoom.allowMultiAi,
    visibility: effectiveRoom.visibility,
    aiRoster: normalizeAiRoster(effectiveRoom.aiRoster)
  };

  const state = {
    settings: { ...defaultSettings, ...storedSettings },
    apiKeys: readJson(storageKeys.apiKeys, {
      gemini: "",
      groq: "",
      deepseek: "",
      anthropic: ""
    }),
    conversations: readJson(storageKeys.conversations, []),
    activeConversationId: null
  };

  if (!storedSettings.roomName || storedSettings.roomName === room.name) {
    state.settings.roomName = effectiveRoom.name;
  }

  state.settings.aiRoster = normalizeAiRoster(state.settings.aiRoster);

  const welcomeConversation = () => ({
    id: uid("conv"),
    title: "新的对话",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: uid("msg"),
        role: "assistant",
        speaker: state.settings.aiRoster[0]?.name || "AI",
        provider: state.settings.aiRoster[0]?.provider || effectiveRoom.provider,
        model: state.settings.aiRoster[0]?.model || effectiveRoom.model,
        content: effectiveRoom.welcome,
        createdAt: new Date().toISOString()
      }
    ]
  });

  if (!state.conversations.length) {
    const first = welcomeConversation();
    state.conversations = [first];
    state.activeConversationId = first.id;
  }

  const storedSessionId = (() => {
    try {
      return sessionStorage.getItem(storageKeys.session);
    } catch {
      return null;
    }
  })();

  const knownActive = state.conversations.find((item) => item.id === storedSessionId);
  state.activeConversationId = knownActive?.id || state.conversations[0].id;

  const persist = () => {
    writeJson(storageKeys.settings, state.settings);
    writeJson(storageKeys.apiKeys, state.apiKeys);
    writeJson(storageKeys.conversations, state.conversations);
    try {
      sessionStorage.setItem(storageKeys.session, state.activeConversationId);
    } catch {}
  };

  const conversationById = (id) => state.conversations.find((item) => item.id === id);

  const activeConversation = () => conversationById(state.activeConversationId) || state.conversations[0];

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const bubbleHtml = (message) => {
    const isUser = message.role === "user";
    const speakerName = escapeHtml(message.speaker || "AI");
    const providerName = escapeHtml(providerLabels[message.provider] || message.provider || "AI");
    const avatarSrc = escapeHtml(avatarAssetByRoom[room.id] || "./ai-avatar-default.svg");
    const providerTag = !isUser && message.model
      ? `<span class="message-model">${escapeHtml(message.model)}</span>`
      : "";

    if (isUser) {
      return `
        <article class="message message-user">
          <div class="message-row">
            <div class="message-stack">
              <div class="bubble bubble-user">
                ${escapeHtml(message.content).replaceAll("\n", "<br />")}
              </div>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="message message-assistant">
        <div class="message-meta">
          <span>${speakerName}</span>
          <span class="message-provider">${providerName}</span>
          ${providerTag}
        </div>
        <div class="message-row">
          <div class="message-avatar" aria-hidden="true">
            <img class="message-avatar-image" src="${avatarSrc}" alt="" />
          </div>
          <div class="message-stack">
            <div class="bubble bubble-ai">
              ${escapeHtml(message.content).replaceAll("\n", "<br />")}
            </div>
          </div>
        </div>
      </article>
    `;
  };

  const titleMeta = {
    "room-random": "REGRET ROOM",
    "room-memory": "MEMORY FIELD",
    "room-insomnia": "INSOMNIA ROOM",
    "room-love": "PHILOSOPHY LOUNGE",
    "room-crowd": "IDEA COLLISION",
    "room-future": "FUTURE BUREAU",
    "room-loneliness": "LONELINESS ROOM",
    "room-unsent": "UNSENT LETTERS",
    "room-knowledge": "KNOWLEDGE SPHERE"
  };

  const avatarAssetByRoom = {
    "room-random": "./ai-avatar-random.svg",
    "room-memory": "./ai-avatar-memory.svg",
    "room-insomnia": "./ai-avatar-insomnia.svg",
    "room-love": "./ai-avatar-love.svg",
    "room-crowd": "./ai-avatar-crowd.svg",
    "room-future": "./ai-avatar-future.svg",
    "room-loneliness": "./ai-avatar-loneliness.svg",
    "room-unsent": "./ai-avatar-unsent.svg",
    "room-knowledge": "./ai-avatar-knowledge.svg"
  };

  const roomAppHtml = `
    <div class="room-app" data-room-id="${escapeHtml(room.id)}">
      <section class="room-chat-stage">
        <div class="room-chat-panel">
          <div class="room-chat-header">
            <div class="room-chat-title-wrap">
              <div class="room-chat-title">${escapeHtml(state.settings.roomName || effectiveRoom.name)}</div>
              <div class="room-chat-title-en">${escapeHtml(titleMeta[room.id] || "AI ROOM")}</div>
            </div>
            <div class="room-chat-toolbar">
              <button class="room-icon-button" type="button" data-action="toggle-history" aria-label="查看历史">
                <svg class="room-filled-icon" viewBox="0 0 1024 1024" aria-hidden="true">
                  <path d="M733.013333 503.893333h-185.173333V264.106667a35.84 35.84 0 0 0-72.106667 0v240.213333a72.106667 72.106667 0 0 0 72.106667 72.106667h185.173333a35.84 35.84 0 0 0 0-72.106667z m90.026667 319.146667A439.893333 439.893333 0 1 1 341.333333 106.666667a439.893333 439.893333 0 0 1 481.706667 716.373333zM512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z"></path>
                </svg>
              </button>
              <button class="room-icon-button" type="button" data-action="toggle-settings" aria-label="房间设置">
                <svg class="room-filled-icon" viewBox="0 0 1024 1024" aria-hidden="true">
                  <path d="M469.333333 60.693333a85.333333 85.333333 0 0 1 85.333334 0l326.826666 188.714667a85.333333 85.333333 0 0 1 42.666667 73.898667v377.386666a85.333333 85.333333 0 0 1-42.666667 73.898667L554.666667 963.306667a85.333333 85.333333 0 0 1-85.333334 0L142.506667 774.592a85.333333 85.333333 0 0 1-42.666667-73.898667v-377.386666a85.333333 85.333333 0 0 1 42.666667-73.898667z m42.666667 73.898667L185.173333 323.306667v377.386666L512 889.408l326.826667-188.714667v-377.386666L512 134.592zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 85.333334a85.333333 85.333333 0 1 0 0 170.666666 85.333333 85.333333 0 0 0 0-170.666666z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="chat-flow room-message-list" data-role="message-list"></div>
          <form class="room-composer" data-role="composer-form">
            <textarea
              class="room-composer-input"
              data-role="composer-input"
              rows="4"
              placeholder="把你想说的话留在这里，按 Enter 发送，Shift + Enter 换行"
            ></textarea>
            <div class="room-composer-bottom">
              <div class="room-suggestion-row" data-role="suggestions"></div>
              <div class="room-composer-actions">
                <button class="room-send-button" type="submit" data-role="send-button" aria-label="发送" disabled>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 18V6"></path>
                    <path d="M7.5 10.5 12 6l4.5 4.5"></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <div class="room-overlay-shell" data-role="history-overlay">
        <button class="room-overlay-backdrop" type="button" data-action="close-overlays" aria-label="关闭浮层"></button>
        <aside class="room-overlay-panel room-history-panel">
          <div class="room-history-top">
            <div>
              <div class="room-history-label">Current Room</div>
              <h2 class="room-history-title">历史记录</h2>
            </div>
            <div class="room-overlay-actions">
              <button class="room-action-button" type="button" data-action="new-conversation">新对话</button>
              <button class="room-icon-button" type="button" data-action="close-overlays" aria-label="关闭历史">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12"></path>
                  <path d="M18 6 6 18"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="room-history-list" data-role="conversation-list"></div>
        </aside>
      </div>
      <div class="room-overlay-shell" data-role="settings-overlay">
        <button class="room-overlay-backdrop" type="button" data-action="close-overlays" aria-label="关闭浮层"></button>
        <aside class="room-overlay-panel room-settings-panel">
          <div class="room-settings-top">
            <div>
              <div class="room-history-label">Room Controls</div>
              <h2 class="room-history-title">设置</h2>
            </div>
            <button class="room-icon-button" type="button" data-action="close-overlays" aria-label="关闭设置">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12"></path>
                <path d="M18 6 6 18"></path>
              </svg>
            </button>
          </div>
          <form class="room-settings-form" data-role="settings-form">
            <div class="room-settings-scroll">
              <label class="room-field">
                <span>房间名</span>
                <input type="text" name="roomName" />
              </label>
              <label class="room-field room-field-inline">
                <input type="checkbox" name="allowMultiAi" />
                <span>允许多个 AI 连续回复</span>
              </label>
              ${isOwnedRoom ? `
              <label class="room-field">
                <span>公开状态</span>
                <select name="visibility">
                  <option value="public">公开</option>
                  <option value="private">私密</option>
                </select>
              </label>
              ` : ""}
              <div class="room-ai-list-head">
                <span class="room-settings-section-title">AI 列表</span>
                <button class="room-ghost-button" type="button" data-action="add-ai">增加AI</button>
              </div>
              <div class="room-ai-list" data-role="ai-list"></div>
            </div>
            <div class="room-settings-actions">
              <button class="room-ghost-button" type="button" data-action="reset-settings">恢复默认</button>
              <button class="room-action-button" type="submit">${shouldSaveAsMine ? "另存为我的房间" : "保存设置"}</button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  `;

  const mount = () => {
    const wrap = document.querySelector(".room-shell-wrap");
    const existingShell = document.querySelector(".room-shell");
    const detailPage = document.querySelector(".detail-page");

    if (detailPage) {
      const replacement = document.createElement("div");
      replacement.className = "room-shell-wrap";
      replacement.innerHTML = roomAppHtml;
      detailPage.replaceWith(replacement);
      return replacement;
    }

    if (wrap) {
      wrap.innerHTML = roomAppHtml;
      return wrap;
    }

    if (existingShell) {
      const replacement = document.createElement("div");
      replacement.className = "room-shell-wrap";
      replacement.innerHTML = roomAppHtml;
      existingShell.replaceWith(replacement);
      return replacement;
    }

    return null;
  };

  const root = mount();
  if (!root) {
    return;
  }

  const el = {
    historyList: root.querySelector('[data-role="conversation-list"]'),
    messageList: root.querySelector('[data-role="message-list"]'),
    suggestions: root.querySelector('[data-role="suggestions"]'),
    form: root.querySelector('[data-role="composer-form"]'),
    input: root.querySelector('[data-role="composer-input"]'),
    sendButton: root.querySelector('[data-role="send-button"]'),
    aiList: root.querySelector('[data-role="ai-list"]'),
    settingsOverlay: root.querySelector('[data-role="settings-overlay"]'),
    historyOverlay: root.querySelector('[data-role="history-overlay"]'),
    settingsForm: root.querySelector('[data-role="settings-form"]')
  };
  let toastTimer = null;

  const getGlobalToast = () => {
    let toast = document.body.querySelector(".room-global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "room-global-toast";
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    return toast;
  };

  const updateHeader = () => {
    const title = root.querySelector(".room-chat-title");
    if (title) {
      title.textContent = state.settings.roomName || room.name;
    }
  };

  const slugifyRoomName = (value) =>
    (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || uid("room");

  const readUserRoomLibrary = () => readJson(userRoomLibraryKey, []);

  const writeUserRoomLibrary = (rooms) => writeJson(userRoomLibraryKey, rooms);

  const coverImageForRoom = effectiveRoom.coverImage || "./hall-floating.png";

  const saveAsMyRoom = () => {
    syncSettingsDraftFromForm();

    const now = new Date().toISOString();
    const roomName = state.settings.roomName || sourceDisplayTitle || effectiveRoom.name;
    const roomId = `user-room-${slugifyRoomName(roomName)}-${Date.now().toString(36)}`;
    const nextRoom = {
      id: roomId,
      sourceRoomId: room.id,
      name: roomName,
      description: effectiveRoom.lead || effectiveRoom.whisper || "",
      coverImage: coverImageForRoom,
      href: `./room-${room.id.replace(/^room-/, "")}.html?from=my-room&owner=me&userRoom=${encodeURIComponent(roomId)}&title=${encodeURIComponent(roomName)}`,
      prompt: state.settings.aiRoster[0]?.prompt || effectiveRoom.prompt || "",
      style: state.settings.aiRoster[0]?.style || effectiveRoom.style || "",
      allowMultiAi: !!state.settings.allowMultiAi,
      visibility: state.settings.visibility || "public",
      aiRoster: state.settings.aiRoster,
      welcome: effectiveRoom.welcome || "",
      lead: effectiveRoom.lead || "",
      mood: effectiveRoom.mood || "",
      createdAt: now,
      updatedAt: now,
      baseName: room.name
    };

    const library = readUserRoomLibrary();
    library.unshift(nextRoom);
    writeUserRoomLibrary(library);
    showSettingsToast("已另存为我的房间");
  };

  const renderSuggestions = () => {
    el.suggestions.innerHTML = effectiveRoom.suggestions
      .map(
        (item) =>
          `<button class="room-suggestion" type="button" data-suggestion="${escapeHtml(item)}">${escapeHtml(item)}</button>`
      )
      .join("");
  };

  const updateConversationTitle = (conversation) => {
    const firstUser = conversation.messages.find((message) => message.role === "user");
    conversation.title = firstUser ? firstUser.content.slice(0, 18) || "新的对话" : "新的对话";
    conversation.updatedAt = new Date().toISOString();
  };

  const renderHistory = () => {
    el.historyList.innerHTML = state.conversations
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((item) => {
        const active = item.id === state.activeConversationId ? "is-active" : "";
        const latest = item.messages[item.messages.length - 1];
        return `
          <button class="room-history-item ${active}" type="button" data-conversation-id="${escapeHtml(item.id)}">
            <strong>${escapeHtml(item.title || "新的对话")}</strong>
            <span>${escapeHtml((latest?.content || "").slice(0, 38) || "还没有消息")}</span>
          </button>
        `;
      })
      .join("");
  };

  const scrollMessagesToBottom = () => {
    requestAnimationFrame(() => {
      el.messageList.scrollTop = el.messageList.scrollHeight;
    });
  };

  const renderMessages = () => {
    const conversation = activeConversation();
    el.messageList.innerHTML = conversation.messages.map(bubbleHtml).join("");
    scrollMessagesToBottom();
  };

  const renderAiList = () => {
    el.aiList.innerHTML = state.settings.aiRoster
      .map((item, index) => {
        const name = item.name || `未命名 AI ${index + 1}`;
        return `
          <details class="room-ai-card">
            <summary class="room-ai-summary">
              <span class="room-ai-summary-text">${escapeHtml(name)}</span>
              <span class="room-ai-summary-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 10l4 4 4-4"></path>
                </svg>
              </span>
            </summary>
            <div class="room-ai-fields">
              <label class="room-field">
                <span>AI名称</span>
                <input type="text" data-ai-field="name" value="${escapeHtml(item.name || "")}" />
              </label>
              <label class="room-field">
                <span>AI的Prompt</span>
                <textarea data-ai-field="prompt" rows="4">${escapeHtml(item.prompt || "")}</textarea>
              </label>
              <label class="room-field">
                <span>回复风格（可选）</span>
                <textarea data-ai-field="style" rows="3">${escapeHtml(item.style || "")}</textarea>
              </label>
              <label class="room-field">
                <span>AI模型选择</span>
                <select data-ai-field="provider">
                  ${Object.entries(providerLabels)
                    .map(([value, label]) => `<option value="${escapeHtml(value)}" ${item.provider === value ? "selected" : ""}>${escapeHtml(label)}</option>`)
                    .join("")}
                </select>
              </label>
              <label class="room-field">
                <span>AI API（可选）</span>
                <input type="password" data-ai-field="apiKey" value="${escapeHtml(item.apiKey || "")}" autocomplete="off" />
              </label>
            </div>
          </details>
        `;
      })
      .join("");
  };

  const readAiRosterFromForm = () =>
    Array.from(el.aiList.querySelectorAll(".room-ai-card")).map((card, index) =>
      normalizeAiConfig(
        {
          name: card.querySelector('[data-ai-field="name"]')?.value || "",
          prompt: card.querySelector('[data-ai-field="prompt"]')?.value || "",
          style: card.querySelector('[data-ai-field="style"]')?.value || "",
          provider: card.querySelector('[data-ai-field="provider"]')?.value || effectiveRoom.provider,
          apiKey: card.querySelector('[data-ai-field="apiKey"]')?.value || ""
        },
        index
      )
    );

  const showSettingsToast = (message) => {
    const toast = getGlobalToast();
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  };

  const syncSettingsDraftFromForm = () => {
    const form = el.settingsForm;
    state.settings = {
      ...state.settings,
      roomName: canRenameRoom ? form.roomName.value.trim() || defaultSettings.roomName : sourceDisplayTitle,
      allowMultiAi: form.allowMultiAi.checked,
      visibility: isOwnedRoom ? (form.visibility?.value || "public") : state.settings.visibility || "public",
      aiRoster: (() => {
        const nextAiRoster = readAiRosterFromForm();
        return nextAiRoster.length ? nextAiRoster : normalizeAiRoster(defaultSettings.aiRoster);
      })()
    };
  };

  const fillSettingsForm = () => {
    const form = el.settingsForm;
    form.roomName.value = state.settings.roomName;
    form.roomName.disabled = !canRenameRoom;
    form.roomName.readOnly = !canRenameRoom;
    form.roomName.title = canRenameRoom ? "" : "该房间名称不可修改";
    form.allowMultiAi.checked = !!state.settings.allowMultiAi;
    if (form.visibility) {
      form.visibility.value = state.settings.visibility || "public";
    }
    renderAiList();
  };

  const fallbackReply = async (messageText, aiList) => {
    const targets = aiList && aiList.length ? aiList : state.settings.aiRoster.slice(0, 1);

    const createText = (speaker, index) => {
      if (speaker.provider === "claude-style") {
        return `${speaker.name}：我先接住你刚才那句话。你提到“${messageText.slice(0, 30)}”，这背后像是有一层更细的感受还没被说完。如果你愿意，我们可以先不求结论，只把它再描述具体一点。`;
      }

      if (speaker.provider === "deepseek") {
        return `${speaker.name}：我先把你的问题拆成两层。第一层是你字面上在问的“${messageText.slice(0, 24)}”；第二层是你真正想确认的判断依据。要不要我们先界定一下核心概念，再继续往下推？`;
      }

      if (speaker.provider === "gemini") {
        return `${speaker.name}：先给你 ${index === 0 ? "一个主方向" : "一个补充方向"}。围绕“${messageText.slice(0, 24)}”，我们可以从场景、情绪、结构三个面向同时展开，这样会更容易把想法变具体。`;
      }

      if (speaker.provider === "groq") {
        return `${speaker.name}：我直接给你一个清晰版本。你现在最需要的，可能不是更多信息，而是先确定“${messageText.slice(0, 24)}”到底要解决什么，再决定下一步怎么做。`;
      }

      return `${speaker.name}：我听见了。你刚才说到“${messageText.slice(0, 24)}”，我们可以继续往下聊，我会陪你把它一点点说清楚。`;
    };

    return targets.map((speaker, index) => ({
      role: "assistant",
      speaker: speaker.name,
      provider: speaker.provider,
      model: speaker.model,
      content: createText(speaker, index),
      createdAt: new Date().toISOString()
    }));
  };

  const chatPayload = (messageText, aiConfig) => {
    const conversation = activeConversation();
    const recentMessages = conversation.messages.slice(-10).map((item) => ({
      role: item.role === "user" ? "user" : "assistant",
      content: item.content,
      name: item.speaker
    }));

    const systemPrompt = [
      `你正在扮演 AI Room 里的房间 AI。`,
      `房间名：${state.settings.roomName}`,
      `AI名称：${aiConfig.name}`,
      `基础 Prompt：${aiConfig.prompt}`,
      `风格要求：${aiConfig.style || "保持自然、稳定、贴合房间氛围。"}`,
      `当前模型来源：${aiConfig.provider}`,
      `如果房间里有多个 AI，可在必要时只回复当前轮最合适的一位。`
    ].join("\n");

    return {
      systemPrompt,
      recentMessages,
      messageText,
      modelName: aiConfig.model
    };
  };

  const requestGemini = async ({ systemPrompt, recentMessages, messageText, modelName, apiKey }) => {
    if (!apiKey) throw new Error("missing-gemini-key");

    const contents = [];
    if (systemPrompt) {
      contents.push({ role: "user", parts: [{ text: systemPrompt }] });
      contents.push({ role: "model", parts: [{ text: "好的，我会遵守这个房间设定。" }] });
    }

    recentMessages.forEach((item) => {
      contents.push({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }]
      });
    });

    contents.push({ role: "user", parts: [{ text: messageText }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.8, topP: 0.92, maxOutputTokens: 800 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`gemini-${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();
  };

  const requestOpenAICompat = async ({ endpoint, apiKey, modelName, systemPrompt, recentMessages, messageText, authHeader = "Authorization" }) => {
    if (!apiKey) throw new Error("missing-api-key");

    const headers = { "Content-Type": "application/json" };
    headers[authHeader] = authHeader === "Authorization" ? `Bearer ${apiKey}` : apiKey;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelName,
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages.map((item) => ({
            role: item.role,
            content: item.content
          })),
          { role: "user", content: messageText }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`openai-compat-${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim();
  };

  const requestProvider = async (aiConfig, messageText) => {
    const payload = chatPayload(messageText, aiConfig);
    const apiKey = aiConfig.apiKey || state.apiKeys[aiConfig.provider] || "";

    if (aiConfig.provider === "gemini") {
      const content = await requestGemini({ ...payload, apiKey });
      return {
        role: "assistant",
        speaker: aiConfig.name || "Gemini",
        provider: aiConfig.provider,
        model: aiConfig.model,
        content: content || "我想了一下，我们可以继续往下拆。"
      };
    }

    if (aiConfig.provider === "groq") {
      const content = await requestOpenAICompat({
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        apiKey,
        modelName: aiConfig.model,
        ...payload
      });
      return {
        role: "assistant",
        speaker: aiConfig.name || "Llama",
        provider: aiConfig.provider,
        model: aiConfig.model,
        content: content || "我先给你一个更直接的回答。"
      };
    }

    if (aiConfig.provider === "deepseek") {
      const content = await requestOpenAICompat({
        endpoint: "https://api.deepseek.com/chat/completions",
        apiKey,
        modelName: aiConfig.model,
        ...payload
      });
      return {
        role: "assistant",
        speaker: aiConfig.name || "DeepSeek",
        provider: aiConfig.provider,
        model: aiConfig.model,
        content: content || "我先把这个问题整理一下结构。"
      };
    }

    return (await fallbackReply(messageText, [aiConfig]))[0];
  };

  const setStatus = () => {
    const hasContent = !!el.input.value.trim();
    el.sendButton.disabled = !hasContent;
  };

  const saveSettingsFromForm = () => {
    if (shouldSaveAsMine) {
      saveAsMyRoom();
      return;
    }
    syncSettingsDraftFromForm();
    updateHeader();
    fillSettingsForm();
    persist();
    setStatus();
    showSettingsToast("已保存当前设置");
  };

  const createConversation = () => {
    const conversation = welcomeConversation();
    state.conversations.unshift(conversation);
    state.activeConversationId = conversation.id;
    persist();
    renderAll();
  };

  const clearRoomHistory = () => {
    const fresh = welcomeConversation();
    state.conversations = [fresh];
    state.activeConversationId = fresh.id;
    persist();
    renderAll();
    setStatus();
  };

  const submitMessage = async (messageText) => {
    const text = messageText.trim();
    if (!text) return;

    const conversation = activeConversation();
    conversation.messages.push({
      id: uid("msg"),
      role: "user",
      speaker: "",
      content: text,
      createdAt: new Date().toISOString()
    });
    updateConversationTitle(conversation);
    persist();
    renderAll();
    el.input.value = "";
    setStatus();

    const targets = state.settings.allowMultiAi ? state.settings.aiRoster : state.settings.aiRoster.slice(0, 1);
    const replies = [];

    for (const aiConfig of targets) {
      try {
        replies.push(await requestProvider(aiConfig, text));
      } catch {
        replies.push((await fallbackReply(text, [aiConfig]))[0]);
      }
    }

    replies.forEach((item) => {
      conversation.messages.push({
        id: uid("msg"),
        ...item,
        createdAt: new Date().toISOString()
      });
    });

    conversation.updatedAt = new Date().toISOString();
    persist();
    renderAll();
    setStatus();
  };

  const renderAll = () => {
    renderSuggestions();
    renderHistory();
    renderMessages();
    fillSettingsForm();
  };

  const closeOverlays = () => {
    el.settingsOverlay.classList.remove("is-open");
    el.historyOverlay.classList.remove("is-open");
  };

  root.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      const action = actionTarget.getAttribute("data-action");

      if (action === "new-conversation") {
        createConversation();
        return;
      }

      if (action === "clear-room-history") {
        clearRoomHistory();
        return;
      }

      if (action === "toggle-history") {
        const next = !el.historyOverlay.classList.contains("is-open");
        closeOverlays();
        el.historyOverlay.classList.toggle("is-open", next);
        return;
      }

      if (action === "toggle-settings") {
        const next = !el.settingsOverlay.classList.contains("is-open");
        closeOverlays();
        el.settingsOverlay.classList.toggle("is-open", next);
        return;
      }

      if (action === "close-overlays") {
        closeOverlays();
        return;
      }

      if (action === "reset-settings") {
        state.settings = { ...defaultSettings, aiRoster: normalizeAiRoster(defaultSettings.aiRoster) };
        if (isOwnedRoom) {
          persist();
        }
        fillSettingsForm();
        updateHeader();
        setStatus();
        showSettingsToast("已恢复默认设置");
        return;
      }

      if (action === "add-ai") {
        syncSettingsDraftFromForm();
        state.settings.aiRoster.push(
          normalizeAiConfig(
            {
              name: `AI ${state.settings.aiRoster.length + 1}`,
              prompt: effectiveRoom.prompt,
              style: effectiveRoom.style,
              provider: effectiveRoom.provider
            },
            state.settings.aiRoster.length
          )
        );
        fillSettingsForm();
        return;
      }
    }

    const suggestion = event.target.closest("[data-suggestion]");
    if (suggestion) {
      el.input.value = suggestion.getAttribute("data-suggestion") || "";
      el.input.focus();
      setStatus();
      return;
    }

    const conversationButton = event.target.closest("[data-conversation-id]");
    if (conversationButton) {
      state.activeConversationId = conversationButton.getAttribute("data-conversation-id");
      persist();
      renderAll();
    }
  });

  el.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitMessage(el.input.value);
  });

  el.input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submitMessage(el.input.value);
    }
  });

  el.input.addEventListener("input", () => {
    setStatus();
  });

  el.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSettingsFromForm();
  });

  renderAll();
  setStatus();
})();
