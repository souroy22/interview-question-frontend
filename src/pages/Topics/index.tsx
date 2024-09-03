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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Popup from "../../components/Popup";
import CreateIcon from "@mui/icons-material/Create";
import { getCategories } from "../../api/category.api";
import { setCategories } from "../../store/category/categoryReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationPopup from "../../components/ConfirmationDialog";
import notification from "../../configs/notification.config";
import SearchComponent from "../../components/SearchInput";
import { filterOptions } from "../../constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useDebounce from "../../hooks/useDebounce";
import TopicForm from "../../components/TopicForm";
import { deleteTopic, getTopics, updateTopic } from "../../api/topic.api";
import { setTopic, Topic_TYPE } from "../../store/topic/topicReducer";
import "./style.css";

const Topics: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [mode, setMode] = useState<"CREATE" | "UPDATE">("CREATE");
  const [updatingTopic, setUpdatingTopic] = useState<null | Topic_TYPE>(null);
  const [value, setValue] = useState("");
  const [deleteTopicId, setDeleteTopicId] = useState<null | string>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<{
    label: string;
    value: boolean | null;
  } | null>(null);

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userReducer);
  const { topics } = useSelector((state: RootState) => state.topicReducer);

  const dispatch = useDispatch();

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false);
    setMode("CREATE");
    setUpdatingTopic(null);
  };

  const handleDelete = async () => {
    try {
      if (deleteTopicId) {
        await deleteTopic(deleteTopicId);
        setOpenDeletePopup(false);
        const data = topics.filter((topic) => topic.slug !== deleteTopicId);
        dispatch(setTopic(data));
        notification.success("Category deleted successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const onLoad = async () => {
    if (categoryId) {
      const res = await getTopics(categoryId);
      dispatch(setTopic(res.data));
    }
  };

  const handleChange = async (newValue: string) => {
    setValue(newValue);
    if (newValue.trim() !== value) {
      const res = await getCategories(1, newValue.trim(), filter?.value);
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
      const res = await getCategories(1, value, selectedFilter?.value);
      dispatch(setCategories(res.data));
    }
    handleCloseDropdown();
  };

  const handleVerified = async (slug: string, isVerified: boolean) => {
    try {
      const data = await updateTopic({ verified: isVerified }, slug);
      let updatedData = topics.map((topic) => {
        if (topic.slug === data.slug) {
          return data;
        }
        return topic;
      });
      dispatch(setTopic(updatedData));
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

  const handleTopicClick = (id: string) => {
    navigate(`/category/${categoryId}/topic/${id}`);
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
        <TopicForm
          onClose={handleClosePopup}
          mode={mode}
          slug={updatingTopic?.slug || ""}
          updatingTopic={updatingTopic}
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
                    Add Topic
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        {topics.map((topic, index) => {
          if (!topic.canModify && !topic.verified) {
            return null;
          }
          if (
            filter &&
            filter.label !== "All" &&
            Boolean(filter?.value) !== topic.verified
          ) {
            return null;
          }
          if (categoryId !== topic.category.slug) {
            return null;
          }
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                className="card-container center-content"
                onClick={() => handleTopicClick(topic.slug)}
              >
                {user?.adminMode && topic.canModify && (
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
                        setUpdatingTopic(topic);
                      }}
                    />
                    <DeleteIcon
                      sx={{ color: "crimson", cursor: "pointer" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenDeletePopup(true);
                        setDeleteTopicId(topic.slug);
                      }}
                    />
                    {user?.role === "SUPER_ADMIN" && (
                      <Switch
                        checked={topic.verified}
                        onChange={async () => {
                          await handleVerified(topic.slug, !topic.verified);
                        }}
                        onClick={(event) => event.stopPropagation()}
                      />
                    )}
                  </Box>
                )}
                <CardContent className="center-content">
                  <Typography variant="h6">{topic.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Topics;
