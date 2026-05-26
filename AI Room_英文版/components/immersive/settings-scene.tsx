"use client";

import { SlidersHorizontal } from "lucide-react";

import { UtilityScene } from "@/components/immersive/utility-scene";

export function SettingsScene() {
  return (
    <UtilityScene
      eyebrow="Minimal Controls"
      title="设置"
      description="设置页也切到和随机进入一致的双栏结构里，把通知、账号与空间偏好放进同一层沉浸体验。"
      icon={SlidersHorizontal}
      accent="radial-gradient(circle at 50% 32%, rgba(255,255,255,0.96), rgba(232,244,255,0.82) 22%, rgba(189,219,243,0.52) 52%, rgba(255,242,231,0.4) 84%)"
      primaryAction={{ label: "管理通知节奏", href: "/messages" }}
      secondaryAction={{ label: "前往退出登录", href: "/logout" }}
      cards={[
        {
          label: "Appearance",
          title: "空间氛围与显示偏好",
          description: "切换更深的雾感空间、低照度光效和更安静的页面强度。"
        },
        {
          label: "Notifications",
          title: "提醒频率与消息节奏",
          description: "当你关注的房间再次出现低语时，以更克制、更有温度的方式提醒你。"
        },
        {
          label: "Privacy",
          title: "账号、连接与隐私",
          description: "管理基础身份信息、连接方式和意识档案的可见范围。"
        },
        {
          label: "Exit",
          title: "保留完整路径再离开",
          description: "退出不再单独漂浮成一个孤立动作，而是从设置流畅过渡出去。"
        }
      ]}
      details={[
        { label: "Focus", value: "更像房间内控制台，而不是单独工具页" },
        { label: "Alerts", value: "消息提醒会按房间温度与重要性调整" },
        { label: "Safety", value: "账号与隐私选项保持最基础但完整的入口" },
        { label: "Next", value: "先整理提醒频率，再决定要不要暂时离开" }
      ]}
    />
  );
}
