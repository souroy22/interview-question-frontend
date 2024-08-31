import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import useForm from "../../hooks/useForm";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../api/category.api";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCategory,
  CATEGORY_TYPE,
  setCategories,
} from "../../store/category/categoryReducer";
import { RootState } from "../../store/store";
import notification from "../../configs/notification.config";
import { createTopic, updateTopic } from "../../api/topic.api";
import {
  addNewTopic,
  setTopic,
  Topic_TYPE,
} from "../../store/topic/topicReducer";
import { useParams } from "react-router-dom";

// Define the fields for the add category form
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

type DEFAULT_VALUE_TYPE = {
  name: string;
  value: string | number;
};

type TopicFormProps = {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  defaultValues?: DEFAULT_VALUE_TYPE[];
  slug?: string;
  updatingTopic?: null | Topic_TYPE;
};

const TopicForm: React.FC<TopicFormProps> = ({
  onClose,
  mode = "CREATE",
  defaultValues = null,
  slug = null,
  updatingTopic = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<null | {
    name: string;
    slug: string;
  }>(null);

  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { topics } = useSelector((state: RootState) => state.topicReducer);
  const { categories } = useSelector(
    (state: RootState) => state.categoryReducer
  );

  const { formData, errors, loading, handleChange, handleSubmit } =
    useForm(formFields);

  const handleFormSubmit = async (data: { [key: string]: string }) => {
    try {
      if (mode === "CREATE") {
        console.log("selectedCategory", selectedCategory);

        const newTopic = await createTopic({
          ...data,
          categorySlug: selectedCategory?.slug ?? categoryId,
        });
        dispatch(addNewTopic(newTopic));
        notification.success("Category created successfully!");
      } else {
        if (slug) {
          const newTopic = await updateTopic(
            {
              ...data,
              categorySlug: selectedCategory?.slug,
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

  const handleTopicClick = (value: CATEGORY_TYPE) => {
    setSelectedCategory(value);
  };

  const onLoad = async () => {
    const res = await getCategories();
    dispatch(setCategories(res.data));
    if (mode === "UPDATE" && defaultValues) {
      for (const data of defaultValues) {
        handleChange(data.name, data.value.toString());
      }
      if (updatingTopic) {
        setSelectedCategory({
          name: updatingTopic.category.name,
          slug: updatingTopic.category.slug,
        });
      }
    }
    inputRef.current?.focus();
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
      <Select
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
      </Select>
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
