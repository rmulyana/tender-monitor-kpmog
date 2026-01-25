import { useEffect, useRef, useState } from "react";

const useTimelinePopover = ({
  editDraftStart,
  editDraftDue,
  setEditDraftStart,
  setEditDraftDue,
  normalizeDateInput,
  normalizeDateTimeInput,
  commitTimeline,
  commitSubitemTimeline,
  maybeRemoveDraft,
  cancelEditCell,
  setEditingCell,
}) => {
  const [timelineMenu, setTimelineMenu] = useState(null);
  const timelineMenuRef = useRef(null);

  const finalizeTimelineMenu = (menu, event) => {
    if (!menu) return;
    const startValue =
      editDraftStart || normalizeDateInput(menu.fallbackStart);
    const dueValue = editDraftDue || normalizeDateTimeInput(menu.fallbackDue);
    if (menu.mode === "main") {
      commitTimeline(menu.id, menu.fallbackStart, menu.fallbackDue);
      maybeRemoveDraft(
        menu.id,
        { startDate: startValue, dueDate: dueValue },
        event,
      );
    } else {
      commitSubitemTimeline(menu.id, menu.fallbackStart, menu.fallbackDue);
    }
    setTimelineMenu(null);
  };

  const openTimelineMenu = ({ id, mode, startDate, dueDate }, event) => {
    event.stopPropagation();
    if (timelineMenu?.id === id && timelineMenu?.mode === mode) {
      finalizeTimelineMenu(timelineMenu, event);
      return;
    }
    if (timelineMenu) {
      finalizeTimelineMenu(timelineMenu, event);
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 320;
    const left = Math.max(
      12,
      Math.min(rect.left, window.innerWidth - menuWidth - 12),
    );
    setEditingCell({
      id,
      field: mode === "main" ? "timeline" : "subitemTimeline",
    });
    setEditDraftStart(normalizeDateInput(startDate));
    setEditDraftDue(normalizeDateTimeInput(dueDate));
    setTimelineMenu({
      id,
      mode,
      top: rect.bottom + 8,
      left,
      anchorTop: rect.top,
      anchorLeft: rect.left,
      fallbackStart: startDate,
      fallbackDue: dueDate,
    });
  };

  useEffect(() => {
    if (!timelineMenu) return undefined;
    const handleClick = (event) => {
      if (timelineMenuRef.current?.contains(event.target)) {
        return;
      }
      if (event.target.closest(".timeline-edit-trigger")) {
        return;
      }
      finalizeTimelineMenu(timelineMenu, event);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setTimelineMenu(null);
        cancelEditCell();
        return;
      }
      if (event.key === "Enter") {
        finalizeTimelineMenu(timelineMenu, event);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [timelineMenu, editDraftStart, editDraftDue, cancelEditCell]);

  useEffect(() => {
    if (!timelineMenu) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const popover = timelineMenuRef.current;
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      let nextTop = timelineMenu.top;
      let nextLeft = timelineMenu.left;
      const bottom = rect.top + rect.height;
      const right = rect.left + rect.width;

      if (bottom > window.innerHeight - 12) {
        nextTop = Math.max(12, timelineMenu.anchorTop - rect.height - 8);
      }
      if (right > window.innerWidth - 12) {
        nextLeft = Math.max(12, window.innerWidth - rect.width - 12);
      }

      if (nextTop !== timelineMenu.top || nextLeft !== timelineMenu.left) {
        setTimelineMenu((prev) =>
          prev ? { ...prev, top: nextTop, left: nextLeft } : prev,
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [timelineMenu]);

  return {
    timelineMenu,
    timelineMenuRef,
    openTimelineMenu,
    closeTimelineMenu: () => setTimelineMenu(null),
  };
};

export default useTimelinePopover;
