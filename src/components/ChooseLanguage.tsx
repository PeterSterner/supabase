import { useTranslation } from "react-i18next";
import Toast from "./Toast";
import { useState } from "react";

function ChooseLanguage() {
  const { i18n } = useTranslation();
  const [sprog, setSprog] = useState(i18n.language); // browser default
  const [toastOpen, setToastOpen] = useState(false);

  const håndterSprogSkift = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valgtSprog = e.target.value;
    setSprog(valgtSprog);
    i18n.changeLanguage(valgtSprog); // skifter sproget globalt
    setToastOpen(true);
  };

  return (
    <>
      <h1 className="text-3xl mb-4">{i18n.t("choose_language")}</h1>
      <div className="max-w-lg mx-auto">
        <label
          htmlFor="sprog"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {i18n.t("preferred_language")}
        </label>
        <select
          id="sprog"
          value={sprog}
          onChange={håndterSprogSkift}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="da">Dansk</option>
          <option value="en">English</option>
        </select>
      </div>
      <Toast
        message={i18n.t("language_saved")}
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

export default ChooseLanguage;
