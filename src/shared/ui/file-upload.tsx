'use client';

import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction } from 'react';
import { Input } from '~/shared/ui/input';

type FileUploadProps = {
    setImageSrc?: Dispatch<SetStateAction<null | string>>;
    setFile: Dispatch<SetStateAction<null | File>>;
};

export function FileUpload({ setImageSrc, setFile }: FileUploadProps) {
    function handleOnChange(changeEvent: ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        const file = (changeEvent.target.files as FileList)[0];

        reader.onload = function (onLoadEvent) {
            if (setImageSrc) setImageSrc(onLoadEvent.target?.result as string);
        };

        if (file) {
            reader.readAsDataURL(file);
            setFile(file);
        }
    }

    return <Input onChange={handleOnChange} type="file" accept="image/*" />;
}
