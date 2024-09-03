import { useEffect, useRef, useState } from "react";
import { TextField, Button, Box, InputLabel, FormControl } from "@mui/material";
import useForm from "../../hooks/useForm";
import { getCategories } from "../../api/category.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import notification from "../../configs/notification.config";
import { createTopic, updateTopic } from "../../api/topic.api";
import {
  addNewTopic,
  setTopic,
  Topic_TYPE,
} from "../../store/topic/topicReducer";
import { useParams } from "react-router-dom";
import InfiniteScrollDropdown, {
  DROPDOWN_OPTION_TYPE,
} from "../InfiniteScrollDropdown";
import { TOPIC_DROPDOWN_TYPE } from "../AddQuestionForm";

const formFields = [
  {
    name: "name",
    label: "Topic Name",
    type: "text",
    required: true,
    validation: (value: string) =>
      value.trim() ? null : "Topic name is required",
  },
];

type TopicFormProps = {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  slug?: string;
  updatingTopic?: null | Topic_TYPE;
};

const TopicForm: React.FC<TopicFormProps> = ({
  onClose,
  mode = "CREATE",
  slug = null,
  updatingTopic = null,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<null | TOPIC_DROPDOWN_TYPE>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    TOPIC_DROPDOWN_TYPE[] | []
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(false);

  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { topics } = useSelector((state: RootState) => state.topicReducer);

  const { formData, errors, loading, handleChange, handleSubmit } =
    useForm(formFields);

  const handleFormSubmit = async (data: { [key: string]: string }) => {
    try {
      if (mode === "CREATE") {
        console.log("selectedCategory", selectedCategory);

        const newTopic = await createTopic({
          ...data,
          categorySlug: selectedCategory?.value ?? categoryId,
        });
        dispatch(addNewTopic(newTopic));
        notification.success("Category created successfully!");
      } else {
        if (slug) {
          const newTopic = await updateTopic(
            {
              ...data,
              categorySlug: selectedCategory?.value,
            },
            slug
          );
          let updatedData = topics.map((topic) => {
            if (topic.slug === newTopic.slug) {
              return newTopic;
            }
            return topic;
          });
          dispatch(setTopic(updatedData));
          notification.success("Topic updated successfully!");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      onClose();
    }
  };

  const loadCategories = async (page: number = 1, searchValue: string = "") => {
    setLoadingTopics(true);
    try {
      const res = await getCategories(page, searchValue);
      const data: TOPIC_DROPDOWN_TYPE[] = res.data.map(
        (category: Topic_TYPE) => {
          return { label: category.name, value: category.slug };
        }
      );
      setCurrentPage(res.page);
      setTotalPage(res.totalPages);
      if (categoryOptions && page !== 1) {
        setCategoryOptions([...categoryOptions, ...data]);
      } else {
        setCategoryOptions(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoadingTopics(false);
      inputRef.current?.focus();
    }
  };

  const onLoad = async () => {
    await loadCategories();
  };

  const handleTopicChange = async (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    await loadCategories(1, value);
  };

  const fetchMoreTopics = async () => {
    setCurrentPage(currentPage + 1);
    await loadCategories(currentPage + 1, searchValue);
  };

  const handleSelectTopic = (value: DROPDOWN_OPTION_TYPE | null) => {
    console.log("value", value);
    setSelectedCategory(value);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        name="name"
        label="Topic Name"
        type="text"
        required
        value={formData.name || ""}
        onChange={(event) =>
          handleChange(event.target.name, event.target.value)
        }
        inputRef={inputRef}
        error={!!errors.categoryName}
        helperText={errors.categoryName}
        margin="normal"
        disabled={loading}
      />
      <InputLabel id="demo-simple-select-label">Category</InputLabel>
      {/* <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedCategory?.slug ?? categoryId}
        label="Category"
        fullWidth
      >
        {categories.map((topic) => (
          <MenuItem
            key={topic.slug}
            value={topic.slug}
            onClick={() => handleTopicClick(topic)}
          >
            {topic.name}
          </MenuItem>
        ))}
      </Select> */}
      <FormControl fullWidth>
        <InfiniteScrollDropdown
          label="Select Category"
          handleChange={handleTopicChange}
          handleSelect={handleSelectTopic}
          hasMore={currentPage < totalPage}
          loadMore={fetchMoreTopics}
          loading={loadingTopics}
          options={categoryOptions}
          required
          error={!selectedCategory}
          handleClose={() => {
            setTotalPage(1);
            setCurrentPage(1);
            setCategoryOptions([]);
            setLoadingTopics(false);
          }}
        />
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleSubmit(handleFormSubmit)}
          disabled={loading} // Disable button when loading
        >
          {mode === "CREATE" ? "ADD CATEGORY" : "UPDATE CATEGORY"}
        </Button>
      </Box>
    </Box>
  );
};

export default TopicForm;
