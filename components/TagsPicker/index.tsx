import React, { Component } from 'react'
import { ActionMeta, OnChangeValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import classes from './TagsPicker.module.css'

interface tagOption {
    value: string
    label: string
}

const tagOptions: Array<tagOption> = [
    {value:'javascript', label:'Javascript'},
    {value:'typescript', label:'TypeScript'},
    {value:'react', label:'React'},
    {value:'nodejs', label:'NodeJS'},
    {value:'backend', label:'backend'},
    {value:'frontend', label:'frontend'},
]

type Props = {
    onChange: (newValue: OnChangeValue<tagOption, true>,
      actionMeta: ActionMeta<tagOption>) => void
}
  
class TagsPicker extends Component<Props> {
    render() {
        return (
        <CreatableSelect
            className={classes.picker}
            isMulti
            isClearable
            onChange={this.props.onChange}
            options={tagOptions}
        />
        )
    }
}

export default TagsPicker