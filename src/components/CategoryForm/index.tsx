import React, { useEffect, useRef } from "react";
import { TextField, Button, Box } from "@mui/material";
import useForm from "../../hooks/useForm";
import { createCategory, updateCategory } from "../../api/category.api";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCategory,
  setCategories,
} from "../../store/category/categoryReducer";
import { RootState } from "../../store/store";
import notification from "../../configs/notification.config";

// Define the fields for the add category form
const formFields = [
  {
    name: "name",
    label: "Category Name",
    type: "text",
    required: true,
    validation: (value: string) =>
      value.trim() ? null : "Category name is required",
  },
];

type DEFAULT_VALUE_TYPE = {
  name: string;
  value: string | number;
};

type CategoryFormProps = {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  defaultValues?: DEFAULT_VALUE_TYPE[];
  slug?: string;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  onClose,
  mode = "CREATE",
  defaultValues = null,
  slug = null,
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { categories } = useSelector(
    (state: RootState) => state.categoryReducer
  );

  const { formData, errors, loading, handleChange, handleSubmit } =
    useForm(formFields);

  const handleFormSubmit = async (data: { [key: string]: string }) => {
    try {
      if (mode === "CREATE") {
        const newCategory = await createCategory(data);
        dispatch(addNewCategory(newCategory));
        notification.success("Category created successfully!");
      } else {
        if (slug) {
          const newCategory = await updateCategory(data, slug);
          let updatedData = categories.map((category) => {
            if (category.slug === newCategory.slug) {
              return newCategory;
            }
            return category;
          });
          dispatch(setCategories(updatedData));
          notification.success("Category updated successfully!");
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

  useEffect(() => {
    if (mode === "UPDATE" && defaultValues) {
      for (const data of defaultValues) {
        handleChange(data.name, data.value.toString());
      }
    }
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        name="name"
        label="Category Name"
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

export default CategoryForm;
