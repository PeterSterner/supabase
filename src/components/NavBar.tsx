import { Link, useNavigate } from "react-router";
import { useAuth } from "../Supabase";
import Brand from "./Brand";
import { useTranslation } from "react-i18next";

function NavBar() {
  return (
    <nav className="bg-gray-800 p-4 w-full">
      <Brand />
      <NavBarButtons />
    </nav>
  );
}

function NavBarButtons() {
  const { user, signOutSupabase } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <ul className="flex flex-row space-x-4">
      <li>
        <Link to="news" className="text-gray-300 hover:text-white">
          {t("news")}
        </Link>
      </li>
      <li>
        <Link to="om" className="text-gray-300 hover:text-white">
          {t("about")}
        </Link>
      </li>
      {user ? (
        <>
          <li>
            <Link to="ddu" className="text-gray-300 hover:text-white">
              DDU
            </Link>
          </li>
          <li>
            <Link to="visnoter" className="text-gray-300 hover:text-white">
              {t("your_notes")}
            </Link>
          </li>
          <li>
            <Link to="indstillinger" className="text-gray-300 hover:text-white">
              {t("settings")}
            </Link>
          </li>
          <li>
            <Link
              to="forside"
              onClick={async () => {
                const { error } = await signOutSupabase();
                if (error) {
                  console.error(error);
                  return;
                } else {
                  console.log("User signed out successfully");
                  navigate("/loggetud");
                }
              }}
              className="text-gray-300 hover:text-white"
            >
              {t("logout")}
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="logind" className="text-gray-300 hover:text-white">
              {t("login")}
            </Link>
          </li>
          <li>
            <Link to="opretbruger" className="text-gray-300 hover:text-white">
              {t("signup")}
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default NavBar;
