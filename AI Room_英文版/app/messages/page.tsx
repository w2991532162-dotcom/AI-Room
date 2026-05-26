import { Inbox } from "lucide-react";

import { UtilityScene } from "@/components/immersive/utility-scene";

export default function MessagesPage() {
  return (
    <UtilityScene
      eyebrow="Message Current"
      title="消息收件箱"
      description="收件箱不是终点，而是进入下一段意识空间的门缝。所有提醒、低语和房间回声都继续留在同一套沉浸框架里。"
      icon={Inbox}
      accent="radial-gradient(circle at 50% 32%, rgba(255,255,255,0.96), rgba(239,229,255,0.82) 22%, rgba(199,184,244,0.52) 50%, rgba(255,241,230,0.42) 84%)"
      primaryAction={{ label: "查看新的房间回声", href: "/room/afterlight" }}
      secondaryAction={{ label: "返回首页", href: "/" }}
      cards={[
        {
          label: "Whisper",
          title: "AI 刚留下了回声",
          description: "有些消息不是通知，而是某个房间仍想继续和你说下去。"
        },
        {
          label: "Invite",
          title: "有人邀请你进入一个房间",
          description: "你关注的空间重新亮起，适合现在这个时刻靠近。"
        },
        {
          label: "Follow-up",
          title: "未完成的话被轻轻续写",
          description: "昨晚停住的对话，现在有了新的温度和一句更柔软的回应。"
        },
        {
          label: "Orbit",
          title: "消息按氛围聚集",
          description: "收件箱会自然形成不同轨道，帮你先看最贴近当下状态的内容。"
        }
      ]}
      details={[
        { label: "State", value: "3 条新回声正在等待被打开" },
        { label: "Priority", value: "优先展示与你最近进入房间相关的消息" },
        { label: "Texture", value: "像门缝透出的光，而不是冰冷提醒" },
        { label: "Next", value: "从那条最像你自己的低语开始" }
      ]}
    />
  );
}
