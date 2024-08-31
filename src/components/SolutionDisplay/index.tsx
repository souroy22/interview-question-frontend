import React from "react";
import Editor from "@monaco-editor/react";
import { Box, useTheme } from "@mui/material";

interface SolutionEditorProps {
  code: string;
  language: string;
  canModify?: boolean;
}

const SolutionEditor: React.FC<SolutionEditorProps> = ({
  code,
  language,
  canModify = false,
}) => {
  const theme = useTheme();
  const editorTheme = theme.palette.mode === "dark" ? "vs-dark" : "light";

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: theme.palette.mode === "dark" ? "#2e2e2e" : "#f0f0f0",
        borderRadius: 2,
      }}
    >
      <Editor
        height="400px"
        language={language}
        value={code}
        theme={editorTheme}
        options={{
          readOnly: !canModify,
          minimap: { enabled: false },
          scrollbar: { alwaysConsumeMouseWheel: false },
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </Box>
  );
};

export default SolutionEditor;
