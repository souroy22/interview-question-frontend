import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

const HomePage = lazy(() => import("../pages/HomePage"));
const Login = lazy(() => import("../pages/Login"));
const QuestionDetails = lazy(() => import("../pages/QuestionDetails"));
const Signup = lazy(() => import("../pages/Signup"));
const QuestionPage = lazy(() => import("../pages/Question"));
const TopicWiseQuestionsList = lazy(
  () => import("../pages/TopicWiseQuestionList")
);
const AddQuestionForm = lazy(() => import("../components/AddQuestionForm"));

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
