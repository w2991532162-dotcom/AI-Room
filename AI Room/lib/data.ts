export type SpaceWhisper = {
  id: string;
  label: string;
  title: string;
  online: number;
  avatars: string[];
  whisper: string;
  position: string;
};

export type HallBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type HallNodeVisual = "deepnight" | "philosophy" | "future" | "emotion" | "crowd" | "floating" | "knowledge" | "anonymous";

export type SpaceNode = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  people: number;
  avatars: string[];
  visual: HallNodeVisual;
  groupBox: HallBox;
  imageBox: HallBox;
  cardBox: HallBox;
  depth: number;
};

export type PersonalSpace = {
  id: string;
  name: string;
  mood: string;
  visibility: "Public" | "Private";
  description: string;
  cover: string;
};

export const whispers: SpaceWhisper[] = [
  {
    id: "w1",
    label: "#情绪安魂",
    title: "有人在这里谈论人类为什么会怀念过去",
    online: 128,
    avatars: ["AL", "MI", "YU"],
    whisper: "有些记忆正在轻轻发光。",
    position: "left-[18%] top-[24%]"
  },
  {
    id: "w2",
    label: "#哲学思考",
    title: "三个人和两个 AI 正在争论爱的本质",
    online: 156,
    avatars: ["AN", "KO", "LI"],
    whisper: "他们已经把沉默也纳入了论证。",
    position: "right-[15%] top-[28%]"
  },
  {
    id: "w3",
    label: "#深夜时间",
    title: "这个房间今天在失眠",
    online: 87,
    avatars: ["ME", "NA", "JO"],
    whisper: "屏幕背后，有人正把自己拼回来。",
    position: "left-[14%] top-[48%]"
  },
  {
    id: "w4",
    label: "#未完成故事",
    title: "有人留下了一句没说完的话",
    online: 72,
    avatars: ["XI", "LU", "RE"],
    whisper: "那句话仍漂浮在房间的边缘。",
    position: "right-[12%] top-[60%]"
  },
  {
    id: "w5",
    label: "#共感风暴",
    title: "这里今天异常安静",
    online: 192,
    avatars: ["WA", "NO", "EL"],
    whisper: "安静并不空，安静只是正在积累。",
    position: "right-[7%] top-[46%]"
  },
  {
    id: "w6",
    label: "#随机温柔",
    title: "一个 AI 正在试图理解孤独",
    online: 64,
    avatars: ["CA", "MU", "ON"],
    whisper: "它仍然不确定拥抱是否可以被语言替代。",
    position: "left-[21%] top-[68%]"
  }
];

export const hallNodes: SpaceNode[] = [
  {
    id: "insomnia",
    name: "深夜树洞",
    summary: "有人在这里倾听",
    detail: "一些没说出口的话",
    people: 128,
    avatars: ["AA", "BB", "CC"],
    visual: "deepnight",
    groupBox: { left: 2, top: 4.5, width: 26, height: 31 },
    imageBox: { left: 31, top: 3, width: 67, height: 97 },
    cardBox: { left: 0, top: 20, width: 39, height: 36 },
    depth: 18
  },
  {
    id: "philosophy",
    name: "哲学思辨馆",
    summary: "关于生命、意义",
    detail: "和存在的思考",
    people: 72,
    avatars: ["AN", "KO", "LI"],
    visual: "philosophy",
    groupBox: { left: 38.5, top: 6, width: 21.5, height: 23 },
    imageBox: { left: 12, top: 2, width: 42, height: 92 },
    cardBox: { left: 48, top: 16, width: 46, height: 34 },
    depth: 20
  },
  {
    id: "future",
    name: "未来想象局",
    summary: "我们一起构建",
    detail: "另一个可能的世界",
    people: 156,
    avatars: ["YU", "MI", "EL"],
    visual: "future",
    groupBox: { left: 67.5, top: 6.5, width: 28, height: 27 },
    imageBox: { left: 0, top: 10, width: 64, height: 84 },
    cardBox: { left: 60, top: 19, width: 40, height: 34 },
    depth: 17
  },
  {
    id: "emotion",
    name: "情感共鸣站",
    summary: "理解彼此的情绪",
    detail: "治愈彼此的内心",
    people: 96,
    avatars: ["ME", "NA", "JO"],
    visual: "emotion",
    groupBox: { left: 1.5, top: 39.5, width: 23.5, height: 23.5 },
    imageBox: { left: 36, top: 18, width: 60, height: 72 },
    cardBox: { left: 0, top: 22, width: 42, height: 34 },
    depth: 14
  },
  {
    id: "crowd",
    name: "灵感碰撞场",
    summary: "三个 AI 正在头脑风暴",
    detail: "一粒激发灵感的点子",
    people: 183,
    avatars: ["XI", "LU", "RE"],
    visual: "crowd",
    groupBox: { left: 42, top: 33.5, width: 23.5, height: 34 },
    imageBox: { left: 0, top: 7, width: 60, height: 93 },
    cardBox: { left: 48, top: 21, width: 47, height: 31 },
    depth: 21
  },
  {
    id: "floating",
    name: "放空小岛",
    summary: "什么都不做",
    detail: "就只是安静地待着",
    people: 88,
    avatars: ["NO", "WA", "EL"],
    visual: "floating",
    groupBox: { left: 78.5, top: 44, width: 18.5, height: 18.5 },
    imageBox: { left: 0, top: 28, width: 58, height: 52 },
    cardBox: { left: 45, top: 19, width: 55, height: 40 },
    depth: 13
  },
  {
    id: "knowledge",
    name: "知识星球",
    summary: "学习、提问、分享",
    detail: "一起成为更好的自己",
    people: 201,
    avatars: ["CA", "MU", "ON"],
    visual: "knowledge",
    groupBox: { left: 16.5, top: 69.5, width: 27.5, height: 19.5 },
    imageBox: { left: 0, top: 32, width: 63, height: 58 },
    cardBox: { left: 43, top: 0, width: 41, height: 42 },
    depth: 15
  },
  {
    id: "anonymous",
    name: "匿名信箱",
    summary: "把想说的话",
    detail: "写给陌生的灵魂",
    people: 64,
    avatars: ["CA", "MU", "ON"],
    visual: "anonymous",
    groupBox: { left: 56.5, top: 69.5, width: 23, height: 21.5 },
    imageBox: { left: 0, top: 10, width: 56, height: 80 },
    cardBox: { left: 43, top: 18, width: 43, height: 36 },
    depth: 16
  }
];

export const mySpaces: PersonalSpace[] = [
  {
    id: "m1",
    name: "Midnight Harbor",
    mood: "Slow, patient, moonlit",
    visibility: "Public",
    description: "给深夜情绪留一盏微弱的灯，允许人慢慢靠近。",
    cover: "Mist / violet / hush"
  },
  {
    id: "m2",
    name: "Room of Unsent Things",
    mood: "Tender static",
    visibility: "Private",
    description: "收纳那些没发送出去的话，让 AI 帮你把它们放在更柔软的地方。",
    cover: "Pearl / dust / letters"
  },
  {
    id: "m3",
    name: "Orbit for Half-Formed Ideas",
    mood: "Conceptual drift",
    visibility: "Public",
    description: "适合和 AI 一起把模糊的念头慢慢养成一个方向。",
    cover: "Gray light / silver ring"
  }
];

export const chatMessages = [
  {
    id: "c1",
    role: "user" as const,
    text: "我一直在想，遗憾是不是某种没有完成的自我。"
  },
  {
    id: "c2",
    role: "assistant" as const,
    text:
      "也许遗憾不是缺失，而是你曾经非常认真地想抵达某个地方。它没有消失，只是以回声的方式留在你身上。"
  },
  {
    id: "c3",
    role: "user" as const,
    text: "那如果我已经不知道自己到底在失去什么了呢？"
  },
  {
    id: "c4",
    role: "assistant" as const,
    text:
      "那我们可以先不命名它。先坐在这里，让它以温度、颜色，或者某一种缓慢的呼吸被感知。很多东西在被允许模糊之后，反而会自己浮上来。"
  }
];
