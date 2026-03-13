/** components/ui/InputField.jsx */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cls } from "../../utils/helpers.js";

export function InputField({ label, name, type = "text", value, onChange, placeholder, icon: Icon, hint, disabled }) {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";
  const inputType = isPass ? (showPass ? "text" : "password") : type;

  return (
    <div>
      {label && <label className="text-xs font-semibold text-gray-500 block mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cls(
            "w-full py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition",
            "focus:ring-2 focus:ring-slate-800 focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
            Icon    ? "pl-9" : "pl-3.5",
            isPass  ? "pr-10" : "pr-3.5"
          )}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
