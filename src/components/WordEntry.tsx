import React, { Key, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

interface WordEntryProps {
  id: Key;
  value?: string;
  editing?: boolean;
  saving?: boolean;
  setValue?: (ret: string) => void;
  sendEscape?: () => void;
  style?: React.CSSProperties;
  spellCheck?: "true" | "false";
}

export const WordEntry = React.forwardRef<HTMLInputElement, WordEntryProps>(
  (
    { id, value, editing, saving, setValue, sendEscape, style, spellCheck = "true" },
    ref,
  ): JSX.Element => {
    const [currentValue, setCurrentValue] = useState<string>(value ?? "");
    useEffect(() => {
      setCurrentValue(value ?? "");
    }, [value]);

    const returnData = useCallback(() => {
      setValue?.(currentValue);
    }, [currentValue, setValue]);

    const keyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.code === "Escape") {
          setCurrentValue(value ?? "");
          sendEscape?.();
        } else if (e.code === "Enter") {
          returnData();
        }
      },
      [returnData, sendEscape, value],
    );

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
          returnData();
        }
      };
      window.addEventListener("mousedown", handleMouseDown);
      return () => {
        window.removeEventListener("mousedown", handleMouseDown);
      };
    }, [editing, id, returnData]);

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
          className="ton-rename"
          value={currentValue}
          disabled={saving}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={returnData}
          onKeyDownCapture={keyPress}
        />
      </div>
    );
  },
);

WordEntry.displayName = "WordEntry";
