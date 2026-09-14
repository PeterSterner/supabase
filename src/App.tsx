import { Routes, Route } from "react-router";
import Design from "./pages/Design";
import Welcome from "./pages/Welcome";
import News from "./pages/News";
import ForgotPassword from "./pages/ForgotPassword";
import CreateUser from "./pages/CreateUser";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./Auth";
import PageNotFound from "./pages/PageNotFound";
import About from "./pages/About";
import Settings from "./pages/Settings";
import YouAreLoggedOut from "./pages/YouAreLoggedOut";
import AddNote from "./pages/AddNote";
import ShowNotes from "./pages/ShowNotes";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Design />}>
          <Route path="" index element={<Welcome />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="news" element={<News />} />
          <Route path="logind" element={<SignIn />} />
          <Route path="glemt-adgangskode" element={<ForgotPassword />} />
          <Route path="opretbruger" element={<CreateUser />} />
          <Route path="om" element={<About />} />
          <Route
            path="indstillinger"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="tilføjnote"
            element={
              <AuthGuard>
                <AddNote />
              </AuthGuard>
            }
          />
          <Route
            path="tilføjnote/:noteId"
            element={
              <AuthGuard>
                <AddNote />
              </AuthGuard>
            }
          />
          <Route
            path="visnoter"
            element={
              <AuthGuard>
                <ShowNotes />
              </AuthGuard>
            }
          />

          <Route
            path="ddu"
            element={
              <AuthGuard>
                <h1>Du er logget ind</h1>
                <h2>DDU</h2>
              </AuthGuard>
            }
          />
          <Route path="loggetud" element={<YouAreLoggedOut />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
