import { useState, useMemo, useEffect } from "react";
import { customLocalStorage } from "../utils/customLocalStorage";
import { setUserTheme } from "../store/global/globalReducer";
import { useDispatch } from "react-redux";

// Define the type for theme mode
type PaletteMode = "light" | "dark";

const getInitialTheme = (): PaletteMode => {
  const savedTheme = customLocalStorage.getData("userTheme");
  return savedTheme === "dark" ? "dark" : "light";
};

const useThemeMode = () => {
  const [theme, setTheme] = useState<PaletteMode>(getInitialTheme);

  const dispatch = useDispatch();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    dispatch(setUserTheme(theme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    dispatch(setUserTheme(getInitialTheme()));
  }, [theme]);

  return useMemo(() => ({ theme, toggleTheme }), [theme]);
};

export default useThemeMode;
