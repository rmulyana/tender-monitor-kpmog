import { useEffect, useRef, useState } from "react";

const useRowMenuState = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const toggleMenu = (tenderId, event) => {
    event.stopPropagation();
    if (openMenuId === tenderId) {
      closeMenu();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.right,
    });
    setOpenMenuId(tenderId);
  };

  useEffect(() => {
    if (!openMenuId) return undefined;
    const handleClick = (event) => {
      if (menuRef.current?.contains(event.target)) {
        return;
      }
      if (event.target.closest(".menu-trigger")) {
        return;
      }
      closeMenu();
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenuId]);

  return {
    openMenuId,
    menuPosition,
    menuRef,
    toggleMenu,
    closeMenu,
  };
};

export default useRowMenuState;
