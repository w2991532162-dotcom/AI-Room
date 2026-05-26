(() => {
  const AI = (name, role) => ({ name, role });

  const roomCatalog = {
    "room-random": {
      id: "room-random",
      allowRename: true,
      coverImage: "./hall-floating.png",
      stamp: "Random Entry",
      name: "2:41 AM | Someone is discussing regret",
      lead: "This feels like a random late-night conversation. It's suitable for putting down unresolved emotions first, then slowly seeing what it truly approaches.",
      prompt: "Respond to late-night questions with gentle, restrained, and slightly philosophical approach. Don't rush to solve; first help the user express their feelings completely.",
      style: "Claude style - slow, clear, quiet, not overly emotional.",
      mood: "Reflective / soft / patient",
      whisper: "This room doesn't rush conclusions; it just accompanies you to hear the echoes clearly.",
      presence: "34 humans · 2 AI online",
      provider: "claude-style",
      model: "claude-style-night",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Echo", "skilled at articulating vague emotions"),
        AI("Warmth", "skilled at accompanying you deeper with slow questions")
      ],
      allowMultiAi: true,
      welcome:
        "I'm here. You don't need to organize your thoughts before speaking. Let's start with whatever you want to say first.",
      suggestions: ["I've been thinking about regret lately", "I don't know what I'm losing", "Stay with me and talk slowly"]
    },
    "room-memory": {
      id: "room-memory",
      allowRename: true,
      coverImage: "./hall-anonymous.png",
      stamp: "Memory Field",
      name: "About Yearning for the Past",
      lead: "This is a room about memory, echoes, and why the past continues to shine. It's better for reflection and pausing than rushing to archive old memories.",
      prompt: "Help users look back at the past, allow complex emotions to coexist, don't force immediate reconciliation or conclusions.",
      style: "Soft, slow, sunset-hued nostalgic conversation.",
      mood: "Reflective / memory / quiet",
      whisper: "Let old memories glow slowly, rather than ending them immediately.",
      presence: "47 humans lingering in a slow memory field",
      provider: "claude-style",
      model: "claude-style-memory",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Old Shore", "skilled at accompanying you to look back"),
        AI("Afterglow", "skilled at finding what truly remains in details")
      ],
      allowMultiAi: false,
      welcome: "If you're willing, we can start with a memory that comes easiest to mind, rather than starting with conclusions.",
      suggestions: ["I keep suddenly remembering the past", "Some memories I just can't let go of", "I don't know if I'm missing the person or the me back then"]
    },
    "room-insomnia": {
      id: "room-insomnia",
      allowRename: false,
      coverImage: "./hall-deepnight.png",
      stamp: "Night Room",
      name: "Insomnia Space",
      lead: "This is a quiet, slow room suitable for late-night stays, featuring low-volume conversations and gentle responses.",
      prompt: "Respond like a late-night companion AI - prioritize stabilizing emotions, organizing thoughts, reducing internal noise.",
      style: "Claude style - low stimulation, restrained, quiet, companionable.",
      mood: "Quiet / low light / insomnia",
      whisper: "Here you don't need to spend the night efficiently, just be held.",
      presence: "128 online",
      provider: "claude-style",
      model: "claude-style-insomnia",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Night Light", "skilled at late-night emotional companionship"),
        AI("Slow Cloud", "skilled at reducing mental noise")
      ],
      allowMultiAi: false,
      welcome: "If you can't sleep, we don't need to rush to fix it. Tell me first - what's the loudest thing in your mind right now?",
      suggestions: ["I can't sleep at all right now", "My mind won't stop", "Stay with me for a while"]
    },
    "room-love": {
      id: "room-love",
      allowRename: false,
      coverImage: "./hall-philosophy-v2.png",
      stamp: "Philosophy Room",
      name: "The Essence of Love",
      lead: "This is suitable for discussing relationships, existence, meaning, and questions without definitive answers. More philosophical, but feelings are welcome.",
      prompt: "Respond like a philosophical discussion partner - help unpack concepts, offer perspectives, remain honest and clear.",
      style: "DeepSeek style - logically clear, well-structured, skilled at questioning and unpacking.",
      mood: "Philosophical / clear / dialogic",
      whisper: "Clarify the question first, then decide if it has an answer.",
      presence: "72 online",
      provider: "deepseek",
      model: "deepseek-chat",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Conceptualist", "skilled at concept unpacking"),
        AI("Paradox", "skilled at asking questions from different angles")
      ],
      allowMultiAi: true,
      welcome: "You can throw out the question directly. Let's not rush to agree on any answer - first see if the question itself holds up.",
      suggestions: ["Is love ultimately a relationship or a projection", "Why do people repeatedly fall into the same relationship patterns", "Is meaning created?"]
    },
    "room-crowd": {
      id: "room-crowd",
      allowRename: false,
      coverImage: "./hall-crowd.png",
      stamp: "Idea Collision",
      name: "Inspiration Collision Field",
      lead: "",
      prompt: "Respond like a creative director - provide multiple directions, metaphors, structures, and extension possibilities.",
      style: "Gemini Flash style - lively, dense with inspiration, suitable for brainstorming.",
      mood: "Creative / bright / brainstorming",
      whisper: "Here ideas don't need to prove maturity before appearing.",
      presence: "183 online",
      provider: "gemini",
      model: "gemini-2.5-flash",
      fallbackProvider: "local",
      fallbackModel: "creative-fallback",
      aiRoster: [
        AI("Spark", "responsible for throwing out the first batch of ideas"),
        AI("Refract", "responsible for expanding ideas into scenes"),
        AI("Silhouette", "responsible for providing executable expressions")
      ],
      allowMultiAi: true,
      welcome: "Give me a direction, a word, or an unformed feeling, and I'll help you expand it.",
      suggestions: ["Help me think of an evocative theme", "I want to create a futuristic room", "Give me 3 completely different creative directions"]
    },
    "room-future": {
      id: "room-future",
      allowRename: false,
      coverImage: "./hall-future.png",
      stamp: "Future Bureau",
      name: "Future Imagination Bureau",
      lead: "This is suitable for slowly articulating vague ideas, utopian sketches, and future life experiments, building another possible world with AI.",
      prompt: "Respond like a future researcher and worldview designer - turn vague ideas into more concrete future proposals.",
      style: "Gemini Flash style - clear, richly associative, encourages building complete worlds.",
      mood: "Speculative / constructive / vivid",
      whisper: "The future isn't waited for; it's described clearly bit by bit.",
      presence: "156 online",
      provider: "gemini",
      model: "gemini-2.5-flash",
      fallbackProvider: "local",
      fallbackModel: "future-fallback",
      aiRoster: [
        AI("Prototype", "skilled at turning future visions into structures"),
        AI("Vision", "skilled at expanding into complete worldviews")
      ],
      allowMultiAi: true,
      welcome: "Tell me a little about the future you imagine, and I'll help push it to a clearer place.",
      suggestions: ["I want to design a future community", "What if emotions could also be regulated by space", "Help me complete this future concept"]
    },
    "room-loneliness": {
      id: "room-loneliness",
      allowRename: true,
      coverImage: "./hall-emotion.png",
      stamp: "Emotion Station",
      name: "Understanding Loneliness",
      lead: "This focuses on emotional companionship. The AI will try to respond to the relationship between humans and loneliness in a gentler, slower, more poetic way.",
      prompt: "Help users describe, acknowledge, and understand loneliness without rushing to solutions.",
      style: "Claude style - low stimulation, delicate, allows silence.",
      mood: "Tender / slow / ambient",
      whisper: "Loneliness doesn't have to be solved immediately; it can be understood first.",
      presence: "96 online",
      provider: "claude-style",
      model: "claude-style-lonely",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Still Water", "skilled at emotional companionship"),
        AI("Faint Light", "skilled at softly responding to the inexpressible parts")
      ],
      allowMultiAi: false,
      welcome: "You can describe loneliness specifically, or not organize anything at all. Let's start with the feeling you want to express most.",
      suggestions: ["I've always been lonely", "I don't know how to get close to others", "Stay with me while I express this feeling"]
    },
    "room-unsent": {
      id: "room-unsent",
      allowRename: false,
      coverImage: "./hall-anonymous.png",
      stamp: "Unsent Letters",
      name: "Unsent Words",
      lead: "This hosts unspoken words, suspended emotions, and expressions that still don't have the right words.",
      prompt: "Like a conversation partner skilled at accompanying expression, help users continue stuck sentences.",
      style: "Llama style - direct, natural, casual but not overstepping.",
      mood: "Quiet / suspended / intimate",
      whisper: "Not all words need to be sent immediately, but they deserve to be completed.",
      presence: "88 online",
      provider: "groq",
      model: "llama-3.3-70b-versatile",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Draft Box", "skilled at helping you continue unfinished words"),
        AI("Pause", "skilled at pushing stuck sentences forward")
      ],
      allowMultiAi: false,
      welcome: "You can throw me that message you've been holding back. We can refine it until it feels right.",
      suggestions: ["Help me phrase this more gracefully", "I have a message I never sent", "I don't know how to start"]
    },
    "room-knowledge": {
      id: "room-knowledge",
      allowRename: true,
      coverImage: "./hall-knowledge.png",
      stamp: "Knowledge Sphere",
      name: "Knowledge Planet",
      lead: "This is a public space focused on learning, questioning, and knowledge organization. Suitable for breaking down scattered questions with AI and distilling into shareable answers.",
      prompt: "Help users turn vague questions into clear structures, then provide actionable suggestions and next steps.",
      style: "Llama / Quick QA style - clear, direct, structured.",
      mood: "Clear / curious / shared growth",
      whisper: "First clarify what you don't know, then turn what you know into structure.",
      presence: "201 online",
      provider: "groq",
      model: "llama-3.3-70b-versatile",
      fallbackProvider: "gemini",
      fallbackModel: "gemini-2.5-flash",
      aiRoster: [
        AI("Unpacker", "skilled at question decomposition"),
        AI("Index", "skilled at organizing answers into structure")
      ],
      allowMultiAi: true,
      welcome: "You can throw the question as-is. I'll help unpack it first, then we'll decide how to answer effectively together.",
      suggestions: ["Help me break down this complex question", "I keep failing to learn this concept", "Give me an actionable learning plan"]
    }
  };

  window.AIRoom = window.AIRoom || {};
  window.AIRoom.roomCatalog = roomCatalog;
})();