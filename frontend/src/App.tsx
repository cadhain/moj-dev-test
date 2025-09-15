import { Route, Routes } from "react-router-dom";
import GovUKTemplate from "./components/GovUKTemplate";
import TaskListPage from "./pages/TaskListPage";
import NewTaskPage from "./pages/NewTaskPage";
import EditTaskPage from "./pages/EditTaskPage";
import DeleteTaskPage from "./pages/DeleteTaskPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import SearchTaskPage from "./pages/SearchTaskPage";
import StartPage from "./pages/StartPage";

function App() {
  return (
    <main>
      <Routes>
        <Route
          path="*"
          element={
            <GovUKTemplate>
              <Routes>
                <Route path="/tasks" element={<TaskListPage />} />
                <Route path="/tasks/new" element={<NewTaskPage />} />
                <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
                <Route path="/tasks/:id/delete" element={<DeleteTaskPage />} />
                <Route path="/tasks/deleted" element={<ConfirmationPage />} />
                <Route path="/tasks/search" element={<SearchTaskPage />} />
                <Route path="*" element={<StartPage />} />
              </Routes>
            </GovUKTemplate>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
