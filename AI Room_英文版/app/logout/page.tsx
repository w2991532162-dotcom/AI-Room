import { LogOut } from "lucide-react";

import { UtilityScene } from "@/components/immersive/utility-scene";

export default function LogoutPage() {
  return (
    <UtilityScene
      eyebrow="Session Threshold"
      title="退出登录"
      description="退出也不该掉出整套空间体验。这里保留同样的导航、固定顶栏和沉浸式房间框架，只把动作本身放在更安静的位置。"
      icon={LogOut}
      accent="radial-gradient(circle at 50% 32%, rgba(255,255,255,0.96), rgba(255,232,239,0.82) 22%, rgba(239,194,210,0.5) 52%, rgba(255,242,231,0.4) 84%)"
      primaryAction={{ label: "确认退出并离开房间", href: "/" }}
      secondaryAction={{ label: "回到设置", href: "/settings" }}
      cards={[
        {
          label: "Session",
          title: "在离开前看一眼当前状态",
          description: "退出动作会被包裹在更平静的上下文里，而不是突然中断。"
        },
        {
          label: "Account",
          title: "切换身份或重新连接",
          description: "如果只是换账号，也能继续沿用原本的空间语境，不必回到冷启动页。"
        },
        {
          label: "Memory",
          title: "你的痕迹仍会被保留",
          description: "意识档案、房间记录与偏好设置都还在，离开只是暂时退出会话。"
        },
        {
          label: "Calm Exit",
          title: "让动作变得更轻",
          description: "把退出放进统一框架后，整个流程会更完整，也更不突兀。"
        }
      ]}
      details={[
        { label: "Impact", value: "退出后会回到入口层，但不会丢失你的房间痕迹" },
        { label: "Account", value: "支持之后切换账号重新进入" },
        { label: "Experience", value: "保留固定导航与一致的空间层级" },
        { label: "Next", value: "确认离开前，还可以先回看意识档案" }
      ]}
    />
  );
}
