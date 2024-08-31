import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Fade,
  Button,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Popup from "../../components/Popup";
import CategoryForm from "../../components/CategoryForm";
import CreateIcon from "@mui/icons-material/Create";
import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/category.api";
import {
  CATEGORY_TYPE,
  setCategories,
} from "../../store/category/categoryReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationPopup from "../../components/ConfirmationDialog";
import notification from "../../configs/notification.config";
import SearchComponent from "../../components/SearchInput";
import { filterOptions } from "../../constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useDebounce from "../../hooks/useDebounce";

const HomePage: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [mode, setMode] = useState<"CREATE" | "UPDATE">("CREATE");
  const [updatingCategory, setUpdatingCategory] =
    useState<null | CATEGORY_TYPE>(null);
  const [value, setValue] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState<null | string>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<{
    label: string;
    value: boolean | null;
  } | null>(null);

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { categories } = useSelector(
    (state: RootState) => state.categoryReducer
  );

  const dispatch = useDispatch();

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false);
    setMode("CREATE");
    setUpdatingCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const getCategoryValue = (id: string) => {
    if (!id) {
      return { name: "name", value: "" };
    }
    const category = categories.find((cat) => cat.slug === id);
    return { name: "name", value: category?.name || "" };
  };

  const handleDelete = async () => {
    try {
      if (deleteCategoryId) {
        await deleteCategory(deleteCategoryId);
        setOpenDeletePopup(false);
        const data = categories.filter(
          (category) => category.slug !== deleteCategoryId
        );
        dispatch(setCategories(data));
        notification.success("Category deleted successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const onLoad = async () => {
    const res = await getCategories();
    dispatch(setCategories(res.data));
  };

  const handleChange = async (newValue: string) => {
    setValue(newValue);
    if (newValue.trim() !== value) {
      const res = await getCategories(newValue.trim(), filter?.value);
      dispatch(setCategories(res.data));
    }
  };

  const debounceHandleChange = useDebounce(handleChange);

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleSelectFilter = async (selectedFilter: {
    label: string;
    value: boolean | null;
  }) => {
    setFilter(selectedFilter);
    if (selectedFilter.label !== filter?.label) {
      const res = await getCategories(value, selectedFilter?.value);
      dispatch(setCategories(res.data));
    }
    handleCloseDropdown();
  };

  const handleVerified = async (slug: string, isVerified: boolean) => {
    try {
      const data = await updateCategory({ verified: isVerified }, slug);
      let updatedData = categories.map((category) => {
        if (category.slug === data.slug) {
          return data;
        }
        return category;
      });
      dispatch(setCategories(updatedData));
      notification.success("Category updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container>
      <Box className="heading-section">
        <SearchComponent onChange={debounceHandleChange} />
        {user?.role === "SUPER_ADMIN" && (
          <Button
            id="demo-customized-button"
            aria-controls={
              Boolean(anchorEl) ? "demo-customized-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleDropdownClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {filter === null ? "Options" : filter.label}
          </Button>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseDropdown}
          TransitionComponent={Fade}
          keepMounted
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.label === filter?.label}
              onClick={() => handleSelectFilter(option)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Popup open={popupOpen} onClose={handleClosePopup}>
        <CategoryForm
          onClose={handleClosePopup}
          defaultValues={[
            { ...getCategoryValue(updatingCategory?.slug || "") },
          ]}
          mode={mode}
          slug={updatingCategory?.slug || ""}
        />
      </Popup>
      <ConfirmationPopup
        open={openDeletePopup}
        title="Are you sure?"
        message="This action cannot be undone."
        onClose={() => setOpenDeletePopup(false)}
        onConfirm={handleDelete}
        conformBtnName="DELETE"
      />
      <Grid container spacing={3}>
        {user?.adminMode &&
          (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <Grid item xs={12} sm={6} md={4}>
              <Card
                className="add-category-card card-container center-content"
                sx={{ boxShadow: "none" }}
                onClick={handleOpenPopup}
              >
                <CardContent className="category-content-container center-content">
                  <IconButton>
                    <AddIcon className="add-category-icon" />
                  </IconButton>
                  <Typography fontSize="25px" fontWeight={700}>
                    Add Category
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        {categories.map((category, index) => {
          if (!category.canModify && !category.verified) {
            return null;
          }
          if (
            filter &&
            filter.label !== "All" &&
            Boolean(filter?.value) !== category.verified
          ) {
            return null;
          }
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleCategoryClick(category.slug)}
                className="card-container center-content"
              >
                {user?.adminMode && category.canModify && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CreateIcon
                      sx={{ color: "green", cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setMode("UPDATE");
                        setPopupOpen(true);
                        setUpdatingCategory(category);
                      }}
                    />
                    <DeleteIcon
                      sx={{ color: "crimson", cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenDeletePopup(true);
                        setDeleteCategoryId(category.slug);
                      }}
                    />
                    {user?.role === "SUPER_ADMIN" && (
                      <Switch
                        checked={category.verified}
                        onChange={async () => {
                          await handleVerified(
                            category.slug,
                            !category.verified
                          );
                        }}
                        onClick={(event) => event.stopPropagation()}
                      />
                    )}
                  </Box>
                )}
                <CardContent className="center-content">
                  <Typography variant="h6">{category.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default HomePage;
