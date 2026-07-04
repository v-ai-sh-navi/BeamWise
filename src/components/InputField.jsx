function InputField({ label, value, onChange, placeholder = ""}) {
  return (
    <div className="input-field">
      <label>{label}</label>


      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onWheel={(e) => e.target.blur()}
      />

    </div>
  );
}

export default InputField;