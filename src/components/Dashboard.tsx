import { useTranslation } from "react-i18next";
import { useAuth } from "../Supabase";

export function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t("dashboard")}</h1>
      <p className="text-lg">{t("welcome", { name: userName })}</p>
    </>
  );
}
