import { useState, useRef, useEffect, FC } from "react";
import { IconButton, InputBase, Box, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear"; // Import the clear icon
import { styled } from "@mui/material/styles";

const SearchInput = styled(InputBase)(({}) => ({
  display: "flex",
  alignItems: "center",
  transition: "width 0.3s ease-in-out",
  width: "0",
  opacity: 0,
  borderBottom: "1px solid #ccc",
  marginRight: "10px",
  "&.open": {
    width: "300px",
    opacity: 1,
  },
}));

type PROP_TYPE = {
  placeholder?: string;
  onChange: (value: string) => void;
};

const SearchComponent: FC<PROP_TYPE> = ({
  placeholder = "Search...",
  onChange,
}) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const inputRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => {
    setInputOpen(true);
    console.log("searchInputRef.current", searchInputRef.current);
    searchInputRef.current?.focus();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onChange(event.target.value);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    onChange("");
  };

  const handleClickAway = () => {
    if (!searchTerm) {
      setInputOpen(false);
    }
  };

  const getQuery = (key: string) => {
    const queryParams = new URLSearchParams(location.search);
    const value = queryParams.get(key);
    return value;
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        inputRef?.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleClickAway();
      }
    };
    const query = getQuery("query") ?? undefined;
    if (query) {
      setSearchTerm(query);
      setInputOpen(true);
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [searchTerm]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ display: "flex" }} ref={inputRef}>
        {!inputOpen && (
          <IconButton onClick={handleIconClick} sx={{}}>
            <SearchIcon />
          </IconButton>
        )}
        <SearchInput
          className={inputOpen ? "open" : ""}
          inputRef={searchInputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ paddingLeft: "5px" }}
          endAdornment={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {searchTerm && (
                <IconButton onClick={handleClearClick}>
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Box>
          }
        />
      </Box>
    </ClickAwayListener>
  );
};

export default SearchComponent;
