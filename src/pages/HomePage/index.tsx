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
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
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
import InfiniteScrollComponent from "../../components/InfiniteScrollComponent";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  const setQuery = (key: string, value: string) => {
    const params = new URLSearchParams(location.search);
    params.set(key, value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const removeQuery = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const getQuery = (key: string) => {
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get(key);
    return value;
  };
  const onLoad = async () => {
    setIsLoading(true);
    try {
      const query = getQuery("query") ?? undefined;
      if (query) {
        setValue(query);
      }
      const res = await getCategories(1, query);
      setTotalPages(res.totalPages);
      dispatch(setCategories(res.data));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (newValue: string) => {
    setIsLoading(true);
    setValue(newValue);
    if (newValue.trim()) {
      setQuery("query", newValue);
    } else {
      removeQuery("query");
    }
    if (newValue.trim() !== value) {
      const res = await getCategories(1, newValue.trim(), filter?.value);
      dispatch(setCategories(res.data));
    }
    setIsLoading(false);
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
      const res = await getCategories(1, value, selectedFilter?.value);
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

  const loadMoreCategories = async () => {
    setIsLoading(true);
    try {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        const res = await getCategories(currentPage + 1, value, filter?.value);
        setTotalPages(res.totalPages);
        dispatch(setCategories([...categories, ...res.data]));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container sx={{ maxWidth: "100dvw !important" }}>
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
      <Grid id="category-container">
        <InfiniteScrollComponent
          dataLength={categories.length + 1}
          hasMore={currentPage < totalPages}
          targetId="category-container"
          loadMoreData={loadMoreCategories}
          style={{
            width: "100%",
            display: "flex",
            gap: "30px",
            padding: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
              <Link to={`/category/${category.slug}`}>
                <Grid xs={12} sm={6} md={4} key={index}>
                  <Card
                    // onClick={() => handleCategoryClick(category.slug)}
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
              </Link>
            );
          })}
          {isLoading && (
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={400}
                  height={200}
                />
              ))}
            </>
          )}
        </InfiniteScrollComponent>
      </Grid>
    </Container>
  );
};

export default HomePage;
