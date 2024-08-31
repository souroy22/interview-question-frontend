import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import QuestionDetails from "../pages/QuestionDetails";
import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import QuestionPage from "../pages/Question";
import TopicWiseQuestionsList from "../pages/TopicWiseQuestionList";
import AddQuestionForm from "../components/AddQuestionForm";

const RouterComponent = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<QuestionPage />} />
        <Route
          path="/category/:categoryId/topic/:topicId"
          element={<TopicWiseQuestionsList />}
        />

        <Route
          path="/category/:categoryId/question/:questionId"
          element={<QuestionDetails />}
        />
        <Route path="/question/create" element={<AddQuestionForm />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
