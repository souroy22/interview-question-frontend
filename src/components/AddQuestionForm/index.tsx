import { useState, useRef, useEffect, FC } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Editor, { useMonaco, OnMount } from "@monaco-editor/react";
import "./style.css";
import { createQuestion } from "../../api/question.api";
import notification from "../../configs/notification.config";
import InfiniteScrollDropdown, {
  DROPDOWN_OPTION_TYPE,
} from "../InfiniteScrollDropdown";
import { getTopics } from "../../api/topic.api";
import { Topic_TYPE } from "../../store/topic/topicReducer";

type Language = "javascript" | "typescript" | "jsx" | "tsx";
type QUESTION_TYPE = "CODING" | "THEORY";
export type TOPIC_DROPDOWN_TYPE = { label: string; value: string | number };

const AddQuestionForm: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [websiteLink, setWebsiteLink] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [type, setType] = useState<QUESTION_TYPE>("CODING");
  const [topics, setTopics] = useState<TOPIC_DROPDOWN_TYPE[] | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] =
    useState<TOPIC_DROPDOWN_TYPE | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    topic?: string;
    solution?: string;
  }>({
    title: "",
    description: "",
    topic: "",
    solution: "",
  });

  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const theme = useTheme();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("customTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "757575" },
          { token: "keyword", foreground: "C586C0" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "identifier", foreground: "9CDCFE" },
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "function", foreground: "DCDCAA" },
        ],
        colors: {
          "editor.background": "#1E1E1E",
        },
      });

      monaco.editor.setTheme("customTheme");
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    setSolution(value || "");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    ["javascript", "typescript"].forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model) => {
          const suggestions: any = [
            {
              label: "log",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "console.log($1);",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log output to console",
              range: model.getFullModelRange(),
            },
            {
              label: "function",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "function ${1:name}(${2:params}) {\n\t$0\n}",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Function declaration",
              range: model.getFullModelRange(),
            },
            {
              label: "const",
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: "const ${1:name} = ${2:value};",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Declare a constant variable",
              range: model.getFullModelRange(),
            },
          ];

          return { suggestions: suggestions } as any;
        },
      });
    });
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleSubmit = async () => {
    try {
      let hasError = false;
      const newErrors: {
        title?: string;
        description?: string;
        topic?: string;
        solution?: string;
      } = {};

      if (!title) {
        newErrors.title = "Title is required";
        hasError = true;
      }

      if (!selectedTopic) {
        console.log("selectedTopic", selectedTopic);
        newErrors.topic = "Topic is required";
        hasError = true;
      }

      if (!description) {
        newErrors.description = "Description is required";
        hasError = true;
      }

      if (hasError) {
        console.log("newErrors", newErrors);

        setErrors(newErrors);
        notification.error("Please fill all required fields!");
        return;
      }

      const newQuestion = {
        title,
        description,
        solution,
        youtubeLink,
        websiteLink,
        language,
        type,
      };
      const data = await createQuestion({
        ...newQuestion,
        topicSlug: selectedTopic?.value,
      });
      console.log("data", data);
      setTitle("");
      setDescription("");
      setSolution("");
      setYoutubeLink("");
      setWebsiteLink("");
      setErrors({});
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: Language
  ) => {
    if (newView !== null) {
      setLanguage(newView);
    }
  };

  const handleTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: QUESTION_TYPE
  ) => {
    if (newType !== null) {
      setType(newType);
    }
  };

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
    console.log("value", value);
    setSelectedTopic(value);
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <Container sx={{ maxWidth: "97dvw !important" }}>
      <Box
        className="center-content"
        sx={{
          display: "flex",
          gap: "30px",
          justifyContent: "flex-start",
          flexDirection: "row !important",
          paddingLeft: "50px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add New Question
        </Typography>
        <Box my={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
      <Box className="add-question-form-container">
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleTypeChange}
          sx={{
            marginBottom: 3,
            marginRight: "20px",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="View switch"
        >
          <ToggleButton
            value="CODING"
            aria-label="CODING"
            sx={{ textTransform: "none" }}
          >
            Coding
          </ToggleButton>
          <ToggleButton
            value="THEORY"
            aria-label="Theory"
            sx={{ textTransform: "none" }}
          >
            Theory
          </ToggleButton>
        </ToggleButtonGroup>
        <Box my={2}>
          <FormControl fullWidth error={Boolean(errors.title)}>
            <TextField
              label="Title"
              variant="outlined"
              required
              name="title"
              value={title}
              onChange={(e) => {
                let copyErrors = JSON.parse(JSON.stringify(errors));
                if (e.target.value.trim().length >= 3) {
                  delete copyErrors[e.target.name];
                } else if (
                  e.target.value.trim().length &&
                  e.target.value.trim().length < 3
                ) {
                  copyErrors = {
                    ...copyErrors,
                    [e.target.name]: "Title must be atleast 3 characters.",
                  };
                } else {
                  copyErrors = {
                    ...copyErrors,
                    [e.target.name]: "Title is required",
                  };
                }
                setErrors(copyErrors);
                setTitle(e.target.value);
              }}
              error={!!errors.title}
            />
            {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
          </FormControl>
        </Box>
        <Box my={2}>
          <FormControl fullWidth error={Boolean(errors.description)}>
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              multiline
              rows={4}
              required
              value={description}
              error={!!errors.description}
              onChange={(e) => {
                let copyErrors = JSON.parse(JSON.stringify(errors));
                if (e.target.value.trim().length >= 3) {
                  delete copyErrors[e.target.name];
                } else if (
                  e.target.value.trim().length &&
                  e.target.value.trim().length < 3
                ) {
                  copyErrors = {
                    ...copyErrors,
                    [e.target.name]:
                      "Description must be atleast 3 characters.",
                  };
                } else {
                  copyErrors = {
                    ...copyErrors,
                    [e.target.name]: "Description is required",
                  };
                }
                setErrors(copyErrors);
                setDescription(e.target.value);
              }}
            />
            {errors.description && (
              <FormHelperText>{errors.description}</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box my={2}>
          <FormControl fullWidth>
            <InfiniteScrollDropdown
              label="Select Topic"
              handleChange={handleTopicChange}
              handleSelect={handleSelectTopic}
              hasMore={currentPage < totalPage}
              loadMore={fetchMoreTopics}
              loading={loadingTopics}
              options={topics}
              required
              error={!selectedTopic}
            />
          </FormControl>
        </Box>
        <Box my={2}>
          <TextField
            label="YouTube Link"
            variant="outlined"
            fullWidth
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </Box>

        <Box my={2}>
          <TextField
            label="Website Link"
            variant="outlined"
            fullWidth
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
          />
        </Box>
        {type === "CODING" && (
          <Box my={2}>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                paddingRight: 2,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" color="textSecondary" gutterBottom>
                  Add Solution Code
                </Typography>
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={handleChange}
                  sx={{
                    marginBottom: 3,
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="View switch"
                >
                  <ToggleButton
                    value="javascript"
                    aria-label="JavaScript"
                    sx={{ textTransform: "none" }}
                  >
                    JavaScript
                  </ToggleButton>
                  <ToggleButton
                    value="typescript"
                    aria-label="Typescript"
                    sx={{ textTransform: "none" }}
                  >
                    Typescript
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFormatCode}
                sx={{ height: "40px" }}
              >
                Format Code
              </Button>
            </Box>
            <Box
              sx={{
                padding: 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#2e2e2e" : "#f0f0f0",
                borderRadius: 2,
                marginBottom: 4,
              }}
            >
              <Editor
                height="300px"
                defaultLanguage={language}
                theme="customTheme"
                value={solution}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AddQuestionForm;
