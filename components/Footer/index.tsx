import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <a
          href="https://github.com/basedest"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Ivan Scherbakov
        </a>
    </footer>
  )
}

export default Footer

