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
    const menuWidth = 200;
    const left = Math.max(
      12,
      Math.min(rect.left, window.innerWidth - menuWidth - 12),
    );
    setMenuPosition({
      top: rect.bottom + 8,
      left,
      anchorTop: rect.top,
      anchorLeft: rect.left,
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

  useEffect(() => {
    if (!menuPosition) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const popover = menuRef.current;
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      let nextTop = menuPosition.top;
      let nextLeft = menuPosition.left;
      const bottom = rect.top + rect.height;
      const right = rect.left + rect.width;

      if (bottom > window.innerHeight - 12) {
        nextTop = Math.max(12, menuPosition.anchorTop - rect.height - 8);
      }
      if (right > window.innerWidth - 12) {
        nextLeft = Math.max(12, window.innerWidth - rect.width - 12);
      }

      if (nextTop !== menuPosition.top || nextLeft !== menuPosition.left) {
        setMenuPosition((prev) =>
          prev ? { ...prev, top: nextTop, left: nextLeft } : prev,
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [menuPosition]);

  return {
    openMenuId,
    menuPosition,
    menuRef,
    toggleMenu,
    closeMenu,
  };
};

export default useRowMenuState;
