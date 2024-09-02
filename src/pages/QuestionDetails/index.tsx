import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import CodeEditor from "../../components/CodeEditor";
import SolutionDisplay from "../../components/SolutionDisplay";
import { useParams } from "react-router-dom";
import { getQuestionDetails } from "../../api/question.api";
import notification from "../../configs/notification.config";
import { useDispatch, useSelector } from "react-redux";
import {
  QUESTION_DETAILS_TYPE,
  setOpenedQuestion,
} from "../../store/question/questionReducer";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../store/store";
import Popup from "../../components/Popup";
import { Edit } from "@mui/icons-material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import InfiniteScrollDropdown, {
  DROPDOWN_OPTION_TYPE,
} from "../../components/InfiniteScrollDropdown";
import { TOPIC_DROPDOWN_TYPE } from "../../components/AddQuestionForm";
import { getTopics } from "../../api/topic.api";
import { Topic_TYPE } from "../../store/topic/topicReducer";

const QuestionDetails: React.FC = () => {
  const [fakeUpdate, setFakeUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [topics, setTopics] = useState<TOPIC_DROPDOWN_TYPE[] | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<
    DROPDOWN_OPTION_TYPE | undefined
  >(undefined);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [originalQuestion, setOriginalQuestion] =
    useState<QUESTION_DETAILS_TYPE | null>(null);
  const [updatedQuestion, setUpdatedQuestion] = useState<any | null>(null);

  const { questionId } = useParams();
  const dispatch = useDispatch();
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const { openedQuestion } = useSelector(
    (state: RootState) => state.questionReducer
  );

  const { user } = useSelector((state: RootState) => state.userReducer);

  const loadTopics = async (page: number = 1, searchValue: string = "") => {
    setLoadingTopics(true);
    try {
      const res = await getTopics("", page, searchValue);
      const data: TOPIC_DROPDOWN_TYPE[] = res.data.map((topic: Topic_TYPE) => {
        return { label: topic.name, value: topic.slug };
      });
      setCurrentPage(res.page);
      setTotalPage(res.totalPages);
      if (topics && page !== 1) {
        setTopics([...topics, ...data]);
      } else {
        setTopics(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoadingTopics(false);
    }
  };

  const onLoad = async () => {
    try {
      await loadTopics();
      const res = await getQuestionDetails(questionId || "");
      setOriginalQuestion(res.question);
      setUpdatedQuestion(res.question);
      setSelectedTopic({
        label: res.question.topic.name,
        value: res.question.topic.slug,
      });
      setFakeUpdate(!fakeUpdate);
      dispatch(setOpenedQuestion(res.question));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    setFakeUpdate(!fakeUpdate);
  };

  const handleTopicChange = async (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    await loadTopics(1, value);
  };

  const fetchMoreTopics = async () => {
    setCurrentPage(currentPage + 1);
    await loadTopics(currentPage + 1, searchValue);
  };

  const handleSelectTopic = (value: DROPDOWN_OPTION_TYPE | null) => {
    if (value) setSelectedTopic(value);
  };

  const handleChangeField = (field: string, value: string) => {
    setUpdatedQuestion({ ...updatedQuestion, [field]: value });
  };

  const isDisable = () => {
    if (!originalQuestion || !updatedQuestion) return true;
    return (
      originalQuestion.title === updatedQuestion.title &&
      originalQuestion.description === updatedQuestion.description &&
      originalQuestion.solution === updatedQuestion.solution
    );
  };

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (editMode && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editMode]);

  return (
    <Container>
      <Paper sx={{ padding: 3, mb: 3, position: "relative" }} elevation={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {editMode ? (
            <TextField
              fullWidth
              variant="standard"
              value={updatedQuestion?.title}
              onChange={(e) => handleChangeField("title", e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "2rem",
                  fontWeight: "bold",
                },
              }}
              inputRef={titleInputRef} // Attach ref to the TextField
            />
          ) : (
            <Typography variant="h4">{openedQuestion?.title}</Typography>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            {user?.adminMode && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                {!editMode ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditMode(true);
                      // Refocus is now handled by useEffect
                    }}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" disabled={isDisable()}>
                      Save
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => {
                        setEditMode(false);
                        setUpdatedQuestion(originalQuestion);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(true)}
              startIcon={<EmojiObjectsIcon />}
            >
              Solution
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {editMode ? (
          <TextField
            fullWidth
            variant="standard"
            value={updatedQuestion?.description}
            onChange={(e) => handleChangeField("description", e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                fontSize: "1rem",
              },
            }}
            multiline
          />
        ) : (
          <Typography variant="body1" gutterBottom>
            {openedQuestion?.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />
      </Paper>

      {user?.adminMode && (
        <Paper sx={{ padding: 3, mb: 3 }} elevation={3}>
          <FormControl fullWidth>
            <InfiniteScrollDropdown
              selectedOption={selectedTopic}
              label="Select Topic"
              handleChange={handleTopicChange}
              handleSelect={handleSelectTopic}
              hasMore={currentPage < totalPage}
              loadMore={fetchMoreTopics}
              loading={loadingTopics}
              options={topics}
              required
              disabled={!editMode}
              error={!selectedTopic}
            />
          </FormControl>
        </Paper>
      )}

      <Paper sx={{ padding: 3, mb: 3 }} elevation={3}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <CodeEditor />
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {openedQuestion?.youtubeLink && (
          <Button variant="contained" color="primary">
            Youtube Link
          </Button>
        )}
        {openedQuestion?.websiteLink && (
          <Button variant="outlined" color="secondary">
            Documentation Link
          </Button>
        )}
      </Box>

      <Popup open={open} onClose={() => setOpen(false)} width={"70%"}>
        <Box my={2} sx={{ width: "100%" }}>
          <Typography variant="h6">Solution:</Typography>
          <SolutionDisplay
            code={openedQuestion?.solution ?? ""}
            language="javascript"
            canModify={editMode && openedQuestion?.canModify}
          />
        </Box>
      </Popup>
    </Container>
  );
};

export default QuestionDetails;
