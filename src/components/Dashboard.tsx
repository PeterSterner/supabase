import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t("dashboard")}</h1>
    </>
  );
}
