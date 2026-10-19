import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // browser language detection
  .use(initReactI18next)
  .init({
    fallbackLng: "den", // hvis browser-sproget ikke findes, brug dansk
    interpolation: { escapeValue: false },
    resources: {
      da: {
        translation: {
          Created: "Oprettet",
          Updated: "Opdateret",
          edit_note: "Rediger",
          delete_note: "Slet",
          title: "Titel",
          content: "Indhold",
          add_note: "Tilføj note",
          add_transaction: "Tilføj transaktion",
          transactions: "Transaktioner",
          first_name: "Fornavn",
          last_name: "Efternavn",
          password: "Adgangskode",
          confirm_password: "Bekræft adgangskode",
          forgot_password: "Glemt adgangskode",
          frontpage: "Forside",
          news: "Nyheder",
          login: "Log ind",
          logout: "Log ud",
          signup: "Opret konto",
          email: "Email",
          hi: "Hej",
          you_are_logged_in: "Du er logget ind",
          logged_out: "Logget ud",
          you_are_not_logged_in: "Du er ikke logget ind.",
          you_are_now_signed_out: "Du er nu logget ud",
          see_you_next_time: "Vi ses næste gang!",
          preferred_language: "Foretrukket sprog",
          choose_language: "Vælg sprog",
          language_saved: "Sprog gemt",
          save_changes: "Gem ændringer",
          your_notes: "Dine noter",
          my_notes_intro: "Her kan du se dine noter.",
          settings: "Indstillinger",
          about: "Om",
          create_account: "Opret konto",
          create_user: "Opret bruger",
          or_continue_with: "eller fortsæt med",
          reset_password: "Nulstil adgangskode",
          reset_password_text:
            "Indtast din email for at nulstille din adgangskode",
          settings_text:
            "Her kan du ændre dine brugeroplysninger og andre indstillinger.",
          and: "og",
          multiple_methods_warning:
            "Du har flere login-metoder tilknyttet denne konto. Vær opmærksom på, at ændring af adgangskoden her muligvis ikke påvirker dine OAuth-login-metoder.",
          multiple_methods_providers:
            "De tilknyttede login-metoder er: {{providers}}",
          copyright: "Alle rettigheder forbeholdes.",
          page_not_found: "Siden blev ikke fundet",
          go_back_home: "Den side, du leder efter, findes ikke. Gå tilbage til",
          home: "nyheder",
          dashboard: "Kontrolpanel",
          welcome: "Velkommen, {{name}}!",
        },
      },
      en: {
        translation: {
          Created: "Created",
          Updated: "Updated",
          edit_note: "Edit",
          delete_note: "Delete",
          title: "Title",
          content: "Content",
          add_note: "Add note",
          add_transaction: "Add transaction",
          transactions: "Transactions",
          first_name: "First Name",
          last_name: "Last Name",
          password: "Password",
          confirm_password: "Confirm Password",
          forgot_password: "Forgot Password",
          frontpage: "Frontpage",
          news: "News",
          login: "Sign in",
          logout: "Log out",
          signup: "Sign up",
          email: "Email",
          hi: "Hi",
          you_are_logged_in: "You are logged in",
          logged_out: "Logged Out",
          you_are_not_logged_in: "You are not logged in.",
          you_are_now_signed_out: "You are now signed out.",
          see_you_next_time: "See you next time!",
          preferred_language: "Preferred Language",
          choose_language: "Choose language",
          language_saved: "Language saved",
          save_changes: "Save changes",
          your_notes: "My notes",
          my_notes_intro: "Here you can see your notes.",
          settings: "Settings",
          about: "About",
          create_account: "Create account",
          create_user: "Create user",
          or_continue_with: "or continue with",
          reset_password: "Reset password",
          reset_password_text: "Enter your email to reset your password",
          settings_text:
            "Here you can change your user information and other settings.",
          and: "and",
          multiple_methods_warning:
            "You have multiple login methods associated with this account. Please note that changing the password here may not affect your OAuth login methods.",
          multiple_methods_providers:
            "The associated login methods are: {{providers}}",
          copyright: "All rights reserved",
          page_not_found: "Page not found",
          go_back_home:
            "The page you are looking for does not exist. Go back to",
          home: "news",
          dashboard: "Dashboard",
          welcome: "Welcome, {{name}}!",
        },
      },
    },
  });

export default i18n;
