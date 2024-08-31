import { useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import notification from "../../configs/notification.config";
import { getAllQuestions } from "../../api/question.api";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../store/question/questionReducer";
import { RootState } from "../../store/store";

const TopicWiseQuestionsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { questions } = useSelector(
    (state: RootState) => state.questionReducer
  );

  const { categoryId, topicId } = useParams();

  const handleQuestionClick = (id: string) => {
    navigate(`/category/${categoryId}/question/${id}`);
  };

  const onLoad = async () => {
    try {
      const res = await getAllQuestions(categoryId, topicId);
      dispatch(setQuestions(res.data));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box sx={{ padding: 2, width: "100dvw" }}>
      <Grid
        container
        sx={{ display: "flex", gap: "20px", flexWrap: "wrap", width: "100%" }}
      >
        {questions.map((question) => (
          <Grid
            item
            xs={12}
            sm={7}
            md={3}
            className="question-grid"
            key={question.slug}
            onClick={() => handleQuestionClick(question.slug)}
          >
            <Card
              sx={{
                backgroundColor: "background.paper",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.04)",
                },
              }}
              className="question-card"
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {question.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopicWiseQuestionsList;
