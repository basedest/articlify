import React from 'react'
import classes from './MyInput.module.scss'

const MyInput = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>((props, ref) => {
  return (
    <input ref={ref} className={classes.myInput} {...props} />
  )
})

MyInput.displayName = 'MyInput'
export default MyInput