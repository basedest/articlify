import React from 'react'
import classes from './SearchBar.module.css'

const SearchBar = ({onChange, value1}) => {
  return (
    <input 
      className={classes.search}
    />
  )
}

export default SearchBar