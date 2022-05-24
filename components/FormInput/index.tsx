import { useState } from "react"
import cl from "./FormInput.module.scss"

const FormInput = (props:any) => {
  const [focused, setFocused] = useState(false)
  const { label, errorMessage, onChange, id, ...inputProps } = props

  const handleFocus = (e:Event) => {
    setFocused(true)
  }

  return (
    <div className={cl.formInput}>
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  )
}

export default FormInput