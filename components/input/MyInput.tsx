import React from 'react'

const MyInput = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>((props, ref) => {
  return (
    <input ref={ref} className="bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-700
     hover:border-neutral-400 dark:hover:border-neutral-500 rounded my-1 w-full py-2 px-1"
     {...props} 
    />
  )
})

MyInput.displayName = 'MyInput'
export default MyInput