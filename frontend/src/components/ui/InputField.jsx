import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cls } from "../../utils/helpers.js";
import { Input } from "./input";
import { Label } from "./label";

export const InputField = forwardRef(({ label, name, type = "text", value, onChange, placeholder, icon: Icon, hint, disabled, className, ...rest }, ref) => {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";
  const inputType = isPass ? (showPass ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />}
        <Input
          ref={ref}
          name={name}
          id={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cls(
            Icon ? "pl-9" : "pl-3.5",
            isPass ? "pr-10" : "pr-3.5",
            className
          )}
          {...rest}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
});
