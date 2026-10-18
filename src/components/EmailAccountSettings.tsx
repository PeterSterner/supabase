import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Supabase";
import ChooseLanguage from "./ChooseLanguage";
import { Button } from "./Button";

function EmailAccountSettings() {
  const { user, updateUserProfileSupabase, getUserProfileSupabase } = useAuth();

  const [fornavn, setFornavn] = useState("");
  const [efternavn, setEfternavn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await getUserProfileSupabase();
        if (error) {
          console.error(error);
          return;
        }
        if (data) {
          setFornavn(data.first_name || "");
          setEfternavn(data.last_name || "");
          setEmail(user.email || "");
        }
      }
    };
    fetchUserProfile();
  }, [getUserProfileSupabase, user]);

  return (
    <>
      <form className="max-w-lg mx-auto mt-4">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="fornavn"
              className="block text-sm font-medium text-gray-700"
            >
              {t("first_name")}
            </label>
            <input
              type="text"
              id="fornavn"
              value={fornavn}
              onChange={(e) => setFornavn(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="efternavn"
              className="block text-sm font-medium text-gray-700"
            >
              {t("last_name")}
            </label>
            <input
              type="text"
              id="efternavn"
              value={efternavn}
              onChange={(e) => setEfternavn(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              {t("confirm_password")}
            </label>
            <input
              type="password"
              id="passwordconfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></input>
          </div>
          <div>
            <Button
              fullWidth={true}
              type="submit"
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();

                if (!user) {
                  alert(
                    "Du skal være logget ind for at opdatere brugeroplysninger.",
                  );
                  return;
                }
                const { data, error } = await updateUserProfileSupabase(
                  fornavn,
                  efternavn,
                );
                if (error) {
                  console.error(error);
                  alert("Fejl ved opdatering af brugeroplysninger.");
                  return;
                }
                console.log("Brugeroplysninger opdateret:", data);
                setFornavn("");
                setEfternavn("");
                setEmail("");
                setPassword("");
                setPasswordConfirm("");
                alert("Brugeroplysninger opdateret.");
              }}
            >
              {t("save_changes")}
            </Button>
          </div>
        </div>
      </form>
      <ChooseLanguage></ChooseLanguage>
    </>
  );
}

export default EmailAccountSettings;
