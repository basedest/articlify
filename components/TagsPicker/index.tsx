'use client';

import React from 'react';
import { MultiSelect, type Option } from '~/components/ui/multi-select';

const tagOptions: Option[] = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'NodeJS' },
  { value: 'backend', label: 'backend' },
  { value: 'frontend', label: 'frontend' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'mongodb', label: 'MongoDB' },
];

interface TagsPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  defaultValue?: string[];
}

const TagsPicker: React.FC<TagsPickerProps> = ({
  value,
  onChange,
  defaultValue,
}) => {
  return (
    <MultiSelect
      options={tagOptions}
      selected={value || defaultValue || []}
      onChange={onChange}
      placeholder="Select or create tags..."
      allowCustom={true}
    />
  );
};

export default TagsPicker;