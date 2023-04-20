import React from 'react';
import {useField} from "formik";

const CustomInput = ({...props}) => {
    const [field, meta] = useField(props)

    return (
        <div>
            <input {...field} {...props}/>
            <span>remember me</span>
            {meta.touched && meta.error && <div>{meta.error}</div>}
        </div>
    );
};

export default CustomInput;