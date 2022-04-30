import React, { Component } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import TagsPicker from '../components/TagsPicker';
import TagsList from '../components/TagsList';
import { version } from '../lib/lib';
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

class CreatableMulti extends Component<Props> {
  render() {
    return (
      <CreatableSelect
        isMulti
        onChange={this.props.onChange}
        options={tagOptions}
      />
    )
  }
}

const Testing = ({foo}) => {
  return (
    <div style={{margin: '20vh 20vw 20vh 20vw', border: 'solid 1px #0005'}}>
      {/* <TagsList tags={['javascript', 'react']} /> */}
      {foo}
    </div>
  )
}

export function getServerSideProps({req}) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  return {
    props: { foo: baseUrl},
  }
}

export default Testing
