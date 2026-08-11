import { SettingsView } from "@/components/settings/settings-view";
import { getUserSettings } from "@/lib/settings-actions";

export const metadata = {
  title: "Settings — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = (await getUserSettings())!;
  return <SettingsView initialSettings={settings} />;
}
