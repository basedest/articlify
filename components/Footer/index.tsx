import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const Footer:React.FC = () => {
  const [version, setVersion] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  useEffect(() => {
    fetch('/api/get-app-version')
    .then(res => res.json())
    .then(data => setVersion(data.version))
    .catch(console.error)
    setMounted(true)
  }, [])
  
  return (
    <footer className="
      flex flex-col-reverse text-center sm:flex-row-reverse sm:text-left justify-center
      px-4 pt-4 pb-6 sm:pb-24 gap-6 bg-neutral-200 text-black
      dark:bg-neutral-800 dark:text-white dark:border-black
      border-t border-solid border-neutral-300
    ">
        <section className="flex flex-col gap-2">
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
          <span>Version {version}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Copyright © 2022 Articlify Inc. All rights reserved.
          </span>
        </section>
        <section>
          <Select 
             className="my-react-select-container"
             classNamePrefix="my-react-select"
             isDisabled={!mounted}
             defaultValue={{value: 'system', label: 'System'}}
             placeholder={'Category...'}
             onChange={selected => {
               console.log(selected?.value)
               setTheme(selected?.value as string)
             }}
             options={[
              {value: 'system', label: 'System'},
              {value: 'dark', label: 'Dark'},
              {value: 'light', label: 'Light'}
             ]}
          />
        </section>
    </footer>
  )
}

export default Footer