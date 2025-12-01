import { CSSProperties, forwardRef, JSX, Key, KeyboardEvent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

interface WordEntryProps {
  id: Key;
  className?: string;
  editing?: boolean;
  saving?: boolean;
  sendEscape?: () => void;
  setValue?: (ret: string) => void;
  spellCheck?: "true" | "false";
  style?: CSSProperties;
  value?: string;
}

export const WordEntry = forwardRef<HTMLInputElement, WordEntryProps>(
  (
    { id, className, value, editing, saving, setValue, sendEscape, style, spellCheck = "true" },
    ref,
  ): JSX.Element => {
    const [currentValue, setCurrentValue] = useState<string>(value ?? "");
    useEffect(() => {
      setCurrentValue(value ?? "");
    }, [value]);

    const keyPress = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setCurrentValue(value ?? "");
        sendEscape?.();
      } else if (e.code === "Enter") {
        setValue?.(currentValue);
      }
    };

    // Add window onMouseDown event to stop events when editing
    useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          editing &&
          target.id !== `${id}` &&
          target.id !== `${id}-holder` &&
          target.id !== `${id}-spinner` &&
          target.className !== "ton-rename"
        ) {
          e.preventDefault();
          e.stopPropagation();
          setValue?.(currentValue);
        }
      };
      window.addEventListener("mousedown", handleMouseDown);
      return () => {
        window.removeEventListener("mousedown", handleMouseDown);
      };
    }, [currentValue, editing, id, setValue]);

    return !editing ? (
      <span
        className="ton-label-span"
        style={style}
        id={`${id}`}
      >
        {value ? value : <>&nbsp;</>}
      </span>
    ) : (
      <div
        style={style}
        id={`${id}-holder`}
        className="ton-rename-holder"
      >
        {saving && (
          <Spinner
            id={`${id}-spinner`}
            size="sm"
            animation="border"
          />
        )}
        <input
          autoFocus
          spellCheck={spellCheck}
          id={String(id)}
          ref={ref}
          type="text"
          className={["ton-rename", className].filter(Boolean).join(" ")}
          value={currentValue}
          disabled={saving}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={(e) => setValue?.(e.currentTarget.value)}
          onKeyDownCapture={keyPress}
        />
      </div>
    );
  },
);

WordEntry.displayName = "WordEntry";
