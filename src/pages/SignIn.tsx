import { Link, useNavigate } from "react-router";
import OAuthButtons from "../components/OAuthButtons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Supabase";

function SignIn() {
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { signInSupabase } = useAuth();
  return (
    <>
      <h1 className="text-3xl">Log ind</h1>
      <form className="max-w-lg mx-auto mt-4">
        <div className="flex flex-col space-y-4">
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
              value={emailField}
              onChange={(e) => setEmailField(e.target.value)}
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
              value={passwordField}
              onChange={(e) => setPasswordField(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                await signInSupabase(emailField, passwordField);
                setEmailField("");
                setPasswordField("");
                navigate("/kontrolpanel");
              }}
            >
              {t("login")}
            </button>
          </div>

          <div className="flex justify-center">
            <Link
              to="/glemt-adgangskode"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {t("forgot_password")}?
            </Link>
          </div>
          <div className="flex justify-center">
            <OAuthButtons></OAuthButtons>
          </div>
        </div>
      </form>
    </>
  );
}

export default SignIn;
