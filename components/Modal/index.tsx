import React from 'react'
import cl from './Modal.module.scss'

const Modal: React.FC<{visible: boolean, setVisible: Function}> = ({children, visible, setVisible}) => {

    const rootClasses = [cl.Modal]

    if (visible) {
        rootClasses.push(cl.active)
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className="p-6 rounded-2xl min-w-[250px] bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal