import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./pages/components/nav-bar/nav-bar.component";
// import HeroSection from "./pages/components/hero-section/hero-section.component";
import SendInvite from "./pages/send-invite/send-invite.component";
import ProposalMiAbuela from "./pages/proposal-mi-abuela/proposal-mi-abuela";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="*" element={<Navigate to="/proposal-mi-abuela" replace />} />
          <Route path="/invite" element={<SendInvite />} />
          <Route path="/proposal-mi-abuela" element={<ProposalMiAbuela />} />
        </Routes>

      </main>
    </>
  );
}

export default App;
