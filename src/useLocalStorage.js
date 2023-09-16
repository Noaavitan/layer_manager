import { useState, useEffect } from "react";

export function useLocalStorageState(initialState) {
  const [saved, setSaved] = useState(function () {
    const storedValue = localStorage.getItem("saved");
    return JSON.parse(storedValue) || [];
  });

  useEffect(
    function () {
      localStorage.setItem("saved", JSON.stringify(saved));
    },
    [saved]
  );
  return [saved, setSaved];
}
