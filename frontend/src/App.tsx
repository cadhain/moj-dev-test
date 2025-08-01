import { Route, Routes } from "react-router-dom";
import GovUKTemplate from "./components/GovUKTemplate";
import TaskList from "./components/TaskList";
import NewTask from "./components/NewTask";
import EditTask from "./pages/EditTask";
import DeleteTaskPage from "./pages/DeleteTaskPage";

function App() {
  return (
    <main>
      <Routes>
        <Route
          path="*"
          element={
            <GovUKTemplate>
              <Routes>
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/new" element={<NewTask />} />
                <Route path="/tasks/:id/edit" element={<EditTask />} />
                <Route path="/tasks/:id/delete" element={<DeleteTaskPage />} />
              </Routes>
            </GovUKTemplate>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
