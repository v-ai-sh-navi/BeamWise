function InputSelect({ label, value, onChange, options }) {
  return (
    <div className="input-field">
      <label>{label}</label>

   

      <select
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

export default InputSelect;