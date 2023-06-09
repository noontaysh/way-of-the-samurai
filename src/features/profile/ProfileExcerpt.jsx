import React, {useState} from 'react';
import StatusEditForm from "./StatusEditForm.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getPhotoError, updatePhoto} from "./profileSlice.js";
import ProfileContacts from "./ProfileContacts.jsx";
import ProfileEditForm from "./ProfileEditForm.jsx";

const ProfileExcerpt = (props) => {
    const dispatch = useDispatch()

    const photoError = useSelector(getPhotoError)

    const [isEditing, setIsEditing] = useState(false)

    const onPhotoChange = (e) => {
        e.target.files.length && dispatch(updatePhoto(e.target.files[0]))
    }

    return (
        <div className={'flex'}>
            <div>
                <img className={'rounded-xl mb-4'}
                     src={props.photos.large || 'https://www.w3schools.com/howto/img_avatar.png'} alt=""/>
                <div>
                    {props.isOwner && <input type="file" onChange={onPhotoChange}/>} {photoError}
                </div>
            </div>
            {isEditing ? <ProfileEditForm {...props} setIsEditing={setIsEditing}/> :
                <ProfileData {...props} setIsEditing={setIsEditing} isEditing={isEditing}/>}
        </div>
    );
};

const ProfileData = ({isEditing, setIsEditing, ...props}) => {
    return (
        <div className={'pl-6 pt-4'}>
            <div className={'mb-2 leading-5'}>
                <h1 className={'text-2xl text-white'}>{props.fullName}</h1>
                <StatusEditForm userStatus={props.userStatus} isOwner={props.isOwner}/>
                <div className={'mt-4'}>
                    <p>{props.aboutMe && `Bio: ${props.aboutMe}`}</p>
                    <p>{props.lookingForAJobDescription && `Skills: ${props.lookingForAJobDescription}`}</p>
                    <p>Looking for a job: {props.lookingForAJob ? 'yes' : 'no'}</p>
                </div>
            </div>
            <div className={'flex'}>
                {Object.keys(props.contacts).map(key => {
                    return <ProfileContacts key={key} title={key} value={props.contacts[key]}/>
                })}
            </div>
            {props.isOwner && <button className={'bg-white py-1 px-6 rounded-md text-black uppercase tracking-wider text-sm mt-2'} onClick={() => setIsEditing(true)}>Edit</button>}
        </div>
    )
}

export default ProfileExcerpt;