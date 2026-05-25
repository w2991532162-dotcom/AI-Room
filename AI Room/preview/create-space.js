(() => {
  const form = document.querySelector('[data-role="create-space-form"]');
  if (!form) return;

  const roomCatalog = (window.AIRoom && window.AIRoom.roomCatalog) || {};
  const libraryKey = "ai-room-user-created-library";

  const typeMeta = {
    "room-insomnia": { stamp: "Night Room", coverImage: "./hall-deepnight.png", provider: "claude-style", model: "claude-style-insomnia" },
    "room-crowd": { stamp: "Idea Collision", coverImage: "./hall-crowd.png", provider: "gemini", model: "gemini-2.5-flash" },
    "room-love": { stamp: "Philosophy Room", coverImage: "./hall-philosophy-v2.png", provider: "deepseek", model: "deepseek-chat" },
    "room-knowledge": { stamp: "Knowledge Sphere", coverImage: "./hall-knowledge.png", provider: "groq", model: "llama-3.3-70b-versatile" },
    "room-unsent": { stamp: "Unsent Letters", coverImage: "./hall-anonymous.png", provider: "groq", model: "llama-3.3-70b-versatile" }
  };

  const preview = {
    cover: document.querySelector('[data-role="preview-cover"]'),
    stamp: document.querySelector('[data-role="preview-stamp"]'),
    title: document.querySelector('[data-role="preview-title"]'),
    description: document.querySelector('[data-role="preview-description"]'),
    visibility: document.querySelector('[data-role="preview-visibility"]'),
    mood: document.querySelector('[data-role="preview-mood"]'),
    aiCount: document.querySelector('[data-role="preview-ai-count"]')
  };

  const aiList = document.querySelector('[data-role="create-ai-list"]');
  let aiCounter = 0;
  let toastTimer = null;

  const toast = (() => {
    let node = document.querySelector(".room-global-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "room-global-toast";
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    return node;
  })();

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

  const slugify = (value) =>
    (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || `room-${Date.now()}`;

  const escapeHtml = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  };

  const addAiCard = (seed = {}) => {
    aiCounter += 1;
    const meta = typeMeta[form.roomType.value] || typeMeta["room-insomnia"];
    const card = document.createElement("details");
    card.className = "room-ai-card";
    if (aiCounter === 1) card.open = true;
    card.innerHTML = `
      <summary class="room-ai-summary">
        <span class="room-ai-summary-text">${escapeHtml(seed.name || `AI ${aiCounter}`)}</span>
        <span class="room-ai-summary-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 10l4 4 4-4"></path></svg>
        </span>
      </summary>
      <div class="room-ai-fields">
        <label class="room-field">
          <span>AI名称</span>
          <input type="text" data-ai-field="name" value="${escapeHtml(seed.name || `AI ${aiCounter}`)}" />
        </label>
        <label class="room-field">
          <span>AI的Prompt</span>
          <textarea data-ai-field="prompt" rows="4">${escapeHtml(seed.prompt || form.prompt.value)}</textarea>
        </label>
        <label class="room-field">
          <span>回复风格（可选）</span>
          <textarea data-ai-field="style" rows="3">${escapeHtml(seed.style || "温柔、清晰、有陪伴感")}</textarea>
        </label>
        <label class="room-field">
          <span>AI模型选择</span>
          <select data-ai-field="provider">
            <option value="claude-style" ${meta.provider === "claude-style" ? "selected" : ""}>Claude 风格</option>
            <option value="gemini" ${meta.provider === "gemini" ? "selected" : ""}>Gemini Flash</option>
            <option value="deepseek" ${meta.provider === "deepseek" ? "selected" : ""}>DeepSeek</option>
            <option value="groq" ${meta.provider === "groq" ? "selected" : ""}>Groq / Llama</option>
          </select>
        </label>
        <label class="room-field">
          <span>AI API（可选）</span>
          <input type="password" data-ai-field="apiKey" value="${escapeHtml(seed.apiKey || "")}" autocomplete="off" />
        </label>
        <div class="create-space-ai-actions">
          <button class="room-ghost-button" type="button" data-action="remove-create-ai">删除这个 AI</button>
        </div>
      </div>
    `;
    aiList.appendChild(card);
  };

  const syncAiSummaries = () => {
    const cards = Array.from(aiList.querySelectorAll(".room-ai-card"));
    cards.forEach((card, index) => {
      const name = card.querySelector('[data-ai-field="name"]')?.value?.trim() || `AI ${index + 1}`;
      const summary = card.querySelector(".room-ai-summary-text");
      if (summary) summary.textContent = name;
    });
    if (preview.aiCount) {
      preview.aiCount.textContent = `${cards.length} 位 AI`;
    }
  };

  const updatePreview = () => {
    const meta = typeMeta[form.roomType.value] || typeMeta["room-insomnia"];
    if (preview.cover) preview.cover.src = meta.coverImage;
    if (preview.stamp) preview.stamp.textContent = meta.stamp;
    if (preview.title) preview.title.textContent = form.roomName.value.trim() || "未命名房间";
    if (preview.description) preview.description.textContent = form.description.value.trim() || "给你的房间补一段介绍。";
    if (preview.visibility) preview.visibility.textContent = form.visibility.value === "private" ? "私密" : "公开";
    if (preview.mood) preview.mood.textContent = form.mood.value;
    syncAiSummaries();
  };

  const defaultState = () => {
    form.roomName.value = "月光停泊处";
    form.roomType.value = "room-insomnia";
    form.description.value = "一个适合深夜停靠、慢慢整理想法和情绪的小房间。";
    form.visibility.value = "private";
    form.mood.value = "Moonlit / tender / ambient";
    form.allowMultiAi.checked = false;
    form.welcome.value = "欢迎来到这里。你可以不用把一切整理清楚，我们先从你现在最想说的一点开始。";
    form.prompt.value = "你是一个擅长陪伴深夜情绪、帮助用户慢慢说清楚感受的 AI。你的回复应当温柔、清晰、不过分催促结论。";
    aiList.innerHTML = "";
    aiCounter = 0;
    addAiCard({ name: "夜灯", style: "温柔、缓慢、陪伴型" });
    addAiCard({ name: "慢云", style: "安静、清晰、低刺激" });
    updatePreview();
  };

  const readAiRoster = () =>
    Array.from(aiList.querySelectorAll(".room-ai-card")).map((card, index) => ({
      name: card.querySelector('[data-ai-field="name"]')?.value?.trim() || `AI ${index + 1}`,
      prompt: card.querySelector('[data-ai-field="prompt"]')?.value?.trim() || form.prompt.value.trim(),
      style: card.querySelector('[data-ai-field="style"]')?.value?.trim() || "",
      provider: card.querySelector('[data-ai-field="provider"]')?.value || "claude-style",
      apiKey: card.querySelector('[data-ai-field="apiKey"]')?.value?.trim() || "",
      model: (typeMeta[form.roomType.value] || typeMeta["room-insomnia"]).model
    }));

  const saveCreatedRoom = () => {
    const roomType = form.roomType.value;
    const meta = typeMeta[roomType] || typeMeta["room-insomnia"];
    const baseRoom = roomCatalog[roomType] || {};
    const aiRoster = readAiRoster();
    const name = form.roomName.value.trim() || "未命名房间";
    const description = form.description.value.trim();
    const now = new Date().toISOString();
    const roomId = `user-room-${slugify(name)}-${Date.now().toString(36)}`;
    const href = `./${roomType}.html?from=my-room&owner=me&userRoom=${encodeURIComponent(roomId)}&title=${encodeURIComponent(name)}`;

    const item = {
      id: roomId,
      sourceRoomId: roomType,
      name,
      description,
      coverImage: meta.coverImage,
      href,
      prompt: form.prompt.value.trim(),
      style: aiRoster[0]?.style || form.mood.value,
      allowMultiAi: !!form.allowMultiAi.checked,
      visibility: form.visibility.value,
      aiRoster,
      welcome: form.welcome.value.trim(),
      lead: description,
      mood: form.mood.value,
      createdAt: now,
      updatedAt: now,
      baseName: baseRoom.name || name
    };

    const list = readJson(libraryKey, []);
    list.unshift(item);
    writeJson(libraryKey, list);
    showToast("已创建新的房间");
    window.location.href = href;
  };

  form.addEventListener("input", (event) => {
    if (event.target.matches('[data-ai-field="name"]')) {
      syncAiSummaries();
    }
    updatePreview();
  });

  form.addEventListener("change", () => {
    updatePreview();
  });

  form.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    const action = trigger.getAttribute("data-action");

    if (action === "add-create-ai") {
      addAiCard();
      updatePreview();
      return;
    }

    if (action === "remove-create-ai") {
      const card = trigger.closest(".room-ai-card");
      if (card && aiList.querySelectorAll(".room-ai-card").length > 1) {
        card.remove();
        updatePreview();
      }
      return;
    }

    if (action === "reset-create-form") {
      defaultState();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCreatedRoom();
  });

  defaultState();
})();
