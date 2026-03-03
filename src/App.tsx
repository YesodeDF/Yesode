import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/nav-bar/nav-bar.component";
import HeroSection from "./pages/components/hero-section/hero-section.component";
import SendInvite from "./pages/send-invite/send-invite.component";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={
            <><Navbar /><HeroSection /></>
          } />
          <Route path="/invite" element={<SendInvite />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
