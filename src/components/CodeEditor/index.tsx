import React, { useState, useRef, useEffect, FC } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import * as monaco from "monaco-editor";

// Default code snippets for each language
const defaultCode = {
  javascript: "// Start coding in JavaScript\nconsole.log('Hello, World!');",
  typescript: "// Start coding in TypeScript\nconsole.log('Hello, World!');",
  jsx: `// Start coding in JSX\nconst App = () => <h1>Hello, World!</h1>;\nApp();`,
  tsx: `// Start coding in TSX\nconst App: React.FC = () => <h1>Hello, World!</h1>;\nApp();`,
};

type Language = "javascript" | "typescript" | "jsx" | "tsx";

const CodeEditor: FC = () => {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState<string>(defaultCode[language]);
  const [output, setOutput] = useState<string>(""); // State for storing output
  const theme = useTheme();
  const outputRef = useRef<HTMLDivElement>(null); // Ref for UI output container

  useEffect(() => {
    // Reset output when language changes
    setOutput("");
    if (outputRef.current) outputRef.current.innerHTML = "";
  }, [language]);

  const handleLanguageChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: Language | null
  ) => {
    if (newLanguage) {
      setLanguage(newLanguage);
      setCode(defaultCode[newLanguage]);
    }
  };

  const runCode = () => {
    try {
      if (language === "javascript" || language === "typescript") {
        // Capture console output
        const log = console.log;
        const outputLogs: string[] = [];
        console.log = (...args) => {
          outputLogs.push(args.join(" "));
        };
        eval(code); // Execute JavaScript/TypeScript code
        console.log = log;
        setOutput(outputLogs.join("\n")); // Display console output
      } else if (language === "jsx" || language === "tsx") {
        if (outputRef.current) {
          outputRef.current.innerHTML = ""; // Clear previous UI output
          const jsxCode = `
            (() => {
              ${code}
              const container = document.createElement('div');
              document.querySelector('#output-root')?.appendChild(container);
              ReactDOM.render(App(), container);
            })();
          `;
          const script = document.createElement("script");
          script.innerHTML = jsxCode;
          outputRef.current.appendChild(script); // Append script to DOM for rendering JSX/TSX
        }
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  // Function to handle Monaco Editor on mount

  const handleEditorDidMount: OnMount = (_, monaco) => {
    // Register a completion item provider for JavaScript and TypeScript
    ["javascript", "typescript"].forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model) => {
          // Define custom completion items
          const suggestions: monaco.languages.CompletionItem[] = [
            {
              label: "log",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "console.log($1);",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log output to console",
              range: model.getFullModelRange(), // Define range to cover the whole model
            },
            {
              label: "function",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "function ${1:name}(${2:params}) {\n\t$0\n}",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Function declaration",
              range: model.getFullModelRange(), // Define range to cover the whole model
            },
            {
              label: "const",
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: "const ${1:name} = ${2:value};",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Declare a constant variable",
              range: model.getFullModelRange(), // Define range to cover the whole model
            },
          ];

          // Return the suggestions wrapped in a CompletionList
          return {
            suggestions: suggestions,
          } as monaco.languages.CompletionList;
        },
      });
    });
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: theme.palette.mode === "dark" ? "#2e2e2e" : "#f0f0f0",
        borderRadius: 2,
        marginBottom: 4,
      }}
    >
      {/* Language Selector */}
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleLanguageChange}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="javascript">JavaScript</ToggleButton>
        <ToggleButton value="typescript">TypeScript</ToggleButton>
        {/* <ToggleButton value="jsx">JSX</ToggleButton>
        <ToggleButton value="tsx">TSX</ToggleButton> */}
      </ToggleButtonGroup>

      {/* Code Editor */}
      <Editor
        height="400px"
        defaultLanguage={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
        onMount={handleEditorDidMount} // Register custom suggestions on mount
      />

      {/* Run Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={runCode}
        sx={{ marginTop: 2 }}
      >
        Run Code
      </Button>

      {/* Output Display */}
      <Box
        sx={{
          marginTop: 2,
          padding: 2,
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
          borderRadius: 2,
          color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Typography variant="subtitle1">Console Output:</Typography>
        <Typography variant="body1" component="pre">
          {output}
        </Typography>

        {/* UI Output Container for JSX/TSX */}
        <Box ref={outputRef} id="output-root" sx={{ marginTop: 2 }} />
      </Box>
    </Box>
  );
};

export default CodeEditor;
