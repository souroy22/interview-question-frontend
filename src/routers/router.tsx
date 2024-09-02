import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import FallBack from "../components/FallBack";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import BaseLayout from "../layouts/BaseLayout";

const HomePage = lazy(() => import("../pages/HomePage"));
const QuestionDetails = lazy(() => import("../pages/QuestionDetails"));
const QuestionPage = lazy(() => import("../pages/Question"));
const TopicWiseQuestionsList = lazy(
  () => import("../pages/TopicWiseQuestionList")
);
const AddQuestionForm = lazy(() => import("../components/AddQuestionForm"));

const RouterComponent = () => {
  return (
    <Suspense fallback={<FallBack />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<BaseLayout />}>
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
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
