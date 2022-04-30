import React, { RefObject } from 'react'
import classes from './MyInput.module.css'

const MyInput = React.forwardRef((props:any, ref:RefObject<HTMLInputElement>) => {
  return (
    <input ref={ref} className={classes.myInput} {...props} />
  )
})

MyInput.displayName = 'MyInput'
export default MyInput