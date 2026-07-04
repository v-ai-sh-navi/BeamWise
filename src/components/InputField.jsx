function InputField({ label, value, onChange }) {
  return (
    <div className="input-field">
      <label>{label}</label>


      <input
        type="number"
        value={value}
        onChange={onChange}
        onWheel={(e) => e.target.blur()}
      />

    </div>
  );
}

export default InputField;