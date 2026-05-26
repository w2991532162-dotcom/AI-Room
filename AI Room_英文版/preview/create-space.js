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
          <span>AI Name</span>
          <input type="text" data-ai-field="name" value="${escapeHtml(seed.name || `AI ${aiCounter}`)}" />
        </label>
        <label class="room-field">
          <span>AI Prompt</span>
          <textarea data-ai-field="prompt" rows="4">${escapeHtml(seed.prompt || form.prompt.value)}</textarea>
        </label>
        <label class="room-field">
          <span>Response Style (Optional)</span>
          <textarea data-ai-field="style" rows="3">${escapeHtml(seed.style || "gentle, clear, companionable")}</textarea>
        </label>
        <label class="room-field">
          <span>AI Model Selection</span>
          <select data-ai-field="provider">
            <option value="claude-style" ${meta.provider === "claude-style" ? "selected" : ""}>Claude Style</option>
            <option value="gemini" ${meta.provider === "gemini" ? "selected" : ""}>Gemini Flash</option>
            <option value="deepseek" ${meta.provider === "deepseek" ? "selected" : ""}>DeepSeek</option>
            <option value="groq" ${meta.provider === "groq" ? "selected" : ""}>Groq / Llama</option>
          </select>
        </label>
        <label class="room-field">
          <span>AI API (Optional)</span>
          <input type="password" data-ai-field="apiKey" value="${escapeHtml(seed.apiKey || "")}" autocomplete="off" />
        </label>
        <div class="create-space-ai-actions">
          <button class="room-ghost-button" type="button" data-action="remove-create-ai">Remove this AI</button>
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
      preview.aiCount.textContent = `${cards.length} AIs`;
    }
  };

  const updatePreview = () => {
    const meta = typeMeta[form.roomType.value] || typeMeta["room-insomnia"];
    if (preview.cover) preview.cover.src = meta.coverImage;
    if (preview.stamp) preview.stamp.textContent = meta.stamp;
    if (preview.title) preview.title.textContent = form.roomName.value.trim() || "Unnamed Room";
    if (preview.description) preview.description.textContent = form.description.value.trim() || "Add a description for your room.";
    if (preview.visibility) preview.visibility.textContent = form.visibility.value === "private" ? "Private" : "Public";
    if (preview.mood) preview.mood.textContent = form.mood.value;
    syncAiSummaries();
  };

  const defaultState = () => {
    form.roomName.value = "Moonlight Anchorage";
    form.roomType.value = "room-insomnia";
    form.description.value = "A small room suitable for late-night stays, slowly organizing thoughts and emotions.";
    form.visibility.value = "private";
    form.mood.value = "Moonlit / tender / ambient";
    form.allowMultiAi.checked = false;
    form.welcome.value = "Welcome here. You dont need to have everything sorted out. Lets start with what you want to say most right now.";
    form.prompt.value = "You are an AI skilled in accompanying late-night emotions and helping users articulate their feelings slowly. Your responses should be gentle, clear, and not overly pushy for conclusions.";
    aiList.innerHTML = "";
    aiCounter = 0;
    addAiCard({ name: "Night Light", style: "gentle, slow, companion-style" });
    addAiCard({ name: "Slow Cloud", style: "quiet, clear, low-stimulation" });
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
    const name = form.roomName.value.trim() || "Unnamed Room";
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
    showToast("Room created");
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
