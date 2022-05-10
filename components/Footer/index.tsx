import React, { useEffect, useState } from 'react'
import styles from './Footer.module.css'

const Footer:React.FC = () => {
  const [version, setVersion] = useState('')
  useEffect(() => {
    fetch('/api/get-app-version')
    .then(res => res.json())
    .then(data => setVersion(data.version))
    .catch(console.error)
  })
  
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
        <span>Copyright © 2022 Articlify Inc. All rights reserved.</span>
        <span>Version {version}</span>
    </footer>
  )
}

export default Footer