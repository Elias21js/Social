import { useState, useRef, KeyboardEvent, ChangeEvent, forwardRef, useImperativeHandle } from "react";
import style from "./keywords.module.css";

interface KeywordsInputProps {
  onChange?: (tags: string[]) => void;
}

export interface KeywordsInputHandle {
  reset: () => void; // função que o pai poderá chamar
}

const KeywordsInput = forwardRef<KeywordsInputHandle, KeywordsInputProps>(({ onChange }, ref) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      onChange?.(newTags);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // ✅ expõe a função reset para o pai
  useImperativeHandle(ref, () => ({
    reset: () => {
      setTags([]);
      setInputValue("");
      onChange?.([]);
    },
  }));

  return (
    <div className={style.container} onClick={() => inputRef.current?.focus()}>
      {tags.map((tag, index) => (
        <div className={style.tag} key={index}>
          {tag}
          <span onClick={() => removeTag(index)}>×</span>
        </div>
      ))}
      <input
        ref={inputRef}
        className={style.input}
        placeholder={tags.length === 0 && inputValue === "" ? "Palavras-chave" : ""}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
    </div>
  );
});

export default KeywordsInput;
