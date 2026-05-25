import { Search } from "lucide-react";

import { UtilityScene } from "@/components/immersive/utility-scene";

export default function SearchPage() {
  return (
    <UtilityScene
      eyebrow="Search Drift"
      title="搜索空间、状态与低语"
      description="搜索不再是普通工具页，而是继续留在同一层意识空间里。你可以沿着关键词、情绪和房间气候继续下潜。"
      icon={Search}
      accent="radial-gradient(circle at 50% 32%, rgba(255,255,255,0.96), rgba(225,240,255,0.8) 24%, rgba(180,205,246,0.52) 50%, rgba(255,239,233,0.42) 84%)"
      primaryAction={{ label: "进入 Afterlight 房间", href: "/room/afterlight" }}
      secondaryAction={{ label: "浏览大厅", href: "/hall" }}
      cards={[
        {
          label: "Mood Query",
          title: "从情绪切入",
          description: "按孤独、失眠、半成型想法等氛围寻找房间，而不是机械标签。"
        },
        {
          label: "Whisper Trail",
          title: "沿着低语继续走",
          description: "每一条搜索结果都像一个仍在呼吸的入口，点进去就是一段实时意识流。"
        },
        {
          label: "Live Signals",
          title: "看见正在发生的内容",
          description: "优先浮现此刻最活跃、最贴近你当前状态的房间，而不是静态归档。"
        },
        {
          label: "Soft Ranking",
          title: "结果不是冷排序",
          description: "结果会混合在线人数、房间气候和 Prompt 温度，更像被空间牵引。"
        }
      ]}
      details={[
        { label: "Mode", value: "Ambient search layered into the room network" },
        { label: "Rhythm", value: "搜索结果更像漂浮入口，而不是普通列表" },
        { label: "Scope", value: "房间、状态、低语、未完成片段都会被联想" },
        { label: "Next", value: "先从你刚刚不敢说清楚的那个词开始" }
      ]}
    />
  );
}
