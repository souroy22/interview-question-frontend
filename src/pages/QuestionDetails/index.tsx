import { Container, Typography, Box, Button } from "@mui/material";
import CodeEditor from "../../components/CodeEditor";
import SolutionDisplay from "../../components/SolutionDisplay";
import { useParams } from "react-router-dom";
import { getQuestionDetails } from "../../api/question.api";
import notification from "../../configs/notification.config";
import { useDispatch, useSelector } from "react-redux";
import { setOpenedQuestion } from "../../store/question/questionReducer";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import Popup from "../../components/Popup";

const QuestionDetails: React.FC = () => {
  const [fakeUpdate, setFakeUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const { questionId } = useParams();
  const dispatch = useDispatch();

  const { openedQuestion } = useSelector(
    (state: RootState) => state.questionReducer
  );

  const onLoad = async () => {
    try {
      const res = await getQuestionDetails(questionId || "");
      dispatch(setOpenedQuestion(res.question));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    setFakeUpdate(!fakeUpdate);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {openedQuestion?.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {openedQuestion?.description}
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show Solution
      </Button>
      <Popup open={open} onClose={() => setOpen(false)} width={"70%"}>
        <Box my={2} sx={{ width: "100%" }}>
          <Typography variant="h6">Solution:</Typography>
          <Typography variant="body2">
            <SolutionDisplay
              code={openedQuestion?.solution ?? ""}
              language="javascript"
              canModify={openedQuestion?.canModify}
            />
          </Typography>
        </Box>
      </Popup>
      <Box my={2}>
        {/* Code editor placeholder */}
        <Typography variant="body2" color="textSecondary">
          {/* Code Editor for Practice */}
          <CodeEditor />
        </Typography>
      </Box>
      <Box my={2}>
        {openedQuestion?.youtubeLink && (
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Youtube Link
          </Button>
        )}
        {openedQuestion?.websiteLink && (
          <Button variant="outlined" color="secondary">
            Documentation Link
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default QuestionDetails;
