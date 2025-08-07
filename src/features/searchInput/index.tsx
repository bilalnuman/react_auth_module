"use client"
import React, {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
} from 'react';
import { debounce } from '../../util/debounce';
import styles from './index.module.css';

interface Props {
    onChange?: (value: string) => void;
    onClick?: (value: string) => void;
    handleClear?: () => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    disabledClass?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    isIconInside?: boolean,
    iconClassName?: string;
    keyName?: string;
    isIcon?: boolean,
    delay?: number;
}

export type SearchInputRef = {
    focus: () => void;
    clear: () => void;
    getValue: () => string;
};

const SearchInput = forwardRef<SearchInputRef, Props>(({
    onClick,
    onChange,
    handleClear,
    icon,
    iconPosition = 'left',
    isIconInside = true,
    placeholder = 'Search...',
    className = '',
    disabled = false,
    isIcon = true,
    disabledClass = '',
    iconClassName = '',
    keyName = 'search',
    delay = 500
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const params = new URLSearchParams(window.location.search);
    const searchValue = params.get(keyName ?? 'search');

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            onChange?.(value?.trim())
            !value.length && resetSearch()
        }, delay),
        [onChange]
    );

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        clear: () => {
            if (inputRef.current) {
                inputRef.current.value = '';
                handleClear?.();
            }
        },
        getValue: () => {
            return inputRef.current?.value || '';
        }
    }));


    const resetSearch = () => {
        params.delete(keyName);
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
        if (inputRef.current) inputRef.current.value = '';

    }

    const handleClick = () => {
        onClick && inputRef.current?.value?.trim() !== searchValue && onClick?.(inputRef.current!.value?.trim());
        if (!inputRef.current!.value) {
            resetSearch()
        }
    };

    useEffect(() => {
        if (searchValue !== null) {
            inputRef.current!.value = searchValue;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.key === 'Enter') && inputRef.current) {
                event.preventDefault();
                handleClick?.();
            }
            if (event.key === 'Escape') {
                resetSearch()
            }

        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    return (
        <div className={`${styles.inputContainer} ${className}`}>
            <input
                ref={inputRef}
                className={`${styles.inputField} ${disabled ? disabledClass : ''}`}
                type="text"
                disabled={disabled}
                onChange={(e) => {
                    if (onChange) debouncedSearch(e.target.value);
                }}
                placeholder={placeholder}
                style={{ paddingLeft: iconPosition == 'right' ? '10px' : '40px' }}
            />
            {isIcon ?
                <button onClick={handleClick} type='button' className={!isIconInside ? styles.iconOutside : styles.iconInside}
                    style={{
                        left: iconPosition == 'left' ? '0px' : undefined,
                        right: iconPosition == 'right' ? !isIconInside ? '-35px' : '0px' : undefined,
                        cursor: onChange ? 'not-allowed' : 'pointer'
                    }

                    }
                >{icon ?? <span className={`${styles.searchIcon} ${iconClassName}`}
                ></span>
                    }</button>
                : null}
        </div>
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
