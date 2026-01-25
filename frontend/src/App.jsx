import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import AllTenders from "./pages/AllTenders.jsx";
import Pipeline from "./pages/Pipeline.jsx";
import Shell from "./components/layout/Shell.jsx";

const App = () => (
  <BrowserRouter>
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tenders" element={<AllTenders />} />
        <Route path="/pipeline" element={<Pipeline />} />
      </Routes>
    </Shell>
  </BrowserRouter>
);

export default App;
