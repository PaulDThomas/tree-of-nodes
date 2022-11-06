import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface WordEntryProps {
  id?: string;
  value?: string;
  editing?: boolean;
  saving?: boolean;
  setValue?: (ret: string) => void;
  sendEscape?: () => void;
  style?: React.CSSProperties;
}

export const WordEntry = React.forwardRef<HTMLInputElement, WordEntryProps>(
  ({ id, value, editing, saving, setValue, sendEscape, style }, ref): JSX.Element => {
    const [currentStyle, setCurrentStyle] = useState<React.CSSProperties>({
      display: 'inline-block',
    });
    WordEntry.displayName = 'WordEntry';

    const [currentValue, setCurrentValue] = useState<string>(value ?? '');
    useEffect(() => {
      setCurrentValue(value ?? '');
    }, [value]);

    const returnData = useCallback(() => {
      if (typeof setValue !== 'function') return;
      setValue(currentValue);
    }, [currentValue, setValue]);

    const keyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.code === 'Escape') {
          setCurrentValue(value ?? '');
          if (typeof sendEscape === 'function') sendEscape();
        } else if (e.code === 'Enter') {
          returnData();
        }
      },
      [returnData, sendEscape, value],
    );

    useEffect(() => {
      setCurrentStyle({
        padding: '1px',
        paddingLeft: '3px',
        paddingRight: '3px',
        border: '1px',
        borderRadius: '3px',
        display: 'inline-block',
        ...style,
      });
    }, [style]);

    // Simple if not editing
    if (!editing) {
      return <span style={currentStyle}>{value}</span>;
    }

    return (
      <div
        style={currentStyle}
        id={id}
      >
        {saving && (
          <Spinner
            id={id ? `${id}-spinner` : undefined}
            size='sm'
            animation='border'
          />
        )}
        <input
          id={id ? `${id}-input` : undefined}
          ref={ref}
          type='text'
          style={{
            lineHeight: '0.75rem',
            border: editing ? '1px dotted black' : saving ? '' : '1px dotted grey',
            margin: !saving && !editing ? '1px' : '',
            width: 'auto',
            minWidth: '0',
          }}
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
