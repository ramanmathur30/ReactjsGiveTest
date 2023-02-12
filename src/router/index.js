import {HashRouter, Route,Routes} from "react-router-dom"
import PatchFormPage from "../component/PatchFormPage";

function Router() {
  return (
    <HashRouter>
        <Routes>
            <Route path="/" element={<PatchFormPage />}></Route>
        </Routes>
    </HashRouter>
  );
}

export default Router;
