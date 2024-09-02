import { useState } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import Topics from "../Topics";
import QuestionsList from "../QuestionsList";
import { Link } from "react-router-dom";

const QuestionPage: React.FC = () => {
  const [view, setView] = useState<"all" | "topicwise">("topicwise");

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: "all" | "topicwise"
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        sx={{ marginBottom: 3, marginRight: "20px" }}
        aria-label="View switch"
      >
        <ToggleButton
          value="all"
          aria-label="All Questions"
          sx={{ textTransform: "none" }}
        >
          All Questions
        </ToggleButton>
        <ToggleButton
          value="topicwise"
          aria-label="Topicwise"
          sx={{ textTransform: "none" }}
        >
          Topicwise
        </ToggleButton>
      </ToggleButtonGroup>
      <Link to="/question/create">
        <Button variant="contained">Add Question</Button>
      </Link>
      <Grid container spacing={3}>
        {view === "all" ? <QuestionsList /> : <Topics />}
      </Grid>
    </Box>
  );
};

export default QuestionPage;
