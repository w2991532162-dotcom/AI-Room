import { RoomScene } from "@/components/immersive/room-scene";

export default async function RoomPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RoomScene roomId={id} />;
}
