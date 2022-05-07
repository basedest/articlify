import React from 'react'
import styles from './Footer.module.css'

const Footer:React.FC = () => {
  return (
    <footer className={styles.footer}>
        <span>
          Made by&nbsp;
          <a
            href="https://github.com/basedest"
            target="_blank"
            rel="noopener noreferrer"
          >
          Ivan Scherbakov
          </a>
        </span>
    </footer>
  )
}

export default Footer