import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography,
    Input
} from '@material-ui/core';
import TokenStorage from '../../API/TokenStorage';
import {apiUrl} from '../../API/environment';
import {useDispatch, useSelector} from 'react-redux';
import {get, put, useGet, usePut} from '../../API/request';
import {setAva, setUser} from '../../redux/slices/auth';

const AccountProfile = (props) => {

    const [uploadedAvatar, setUploadedAvatar] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [userName, setUserName] = useState('');
    const dispatch = useDispatch();
    const getU = useGet();
    const putU = usePut();

    const uploadNewAvatar = () => {
        if (uploadedAvatar !== '') {

            let data = new FormData();
            data.append('avatar', uploadedAvatar);

            putU(`users/avatar`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        loadUserData()
                    }
                })
                .catch(() => {

                })
                .finally(() => {

                });
        }
    };

    const avaUploaded = (event) => {
        setUploadedAvatar(event.target.files[0]);
    };

    const loadUserData = () =>{
         getU(`users/current`)
            .then((response) => {
                if (response.status === 'success') {
                    setUserName(response.data.user.username);
                    setUserAvatar(`${process.env.REACT_APP_API_URL}/uploads/avatars/${response.data.user.avatar}`);
                    dispatch(setUser(response.data.user))
                } else {
                    setUserName('Admin');
                }
            }).catch((e) => {
                setUserName('Admin');
            })
            .finally(() => {

            });
    }

    useEffect( () => {
        loadUserData()
    }, []);

    useEffect(() => {
        uploadNewAvatar();
    }, [uploadedAvatar]);

    return (
        <Card {...props}>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        src={userAvatar}
                        sx={{
                            height: 100,
                            width: 100
                        }}
                    />
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h3"
                    >
                        {userName}
                    </Typography>
                </Box>
            </CardContent>
            <Divider/>
            <CardActions>
                <Box style={{width: '100%'}}>
                    <Input accept="xlsx/*" type="file" style={{display: 'none'}} id="userAvatarUpload"
                           onChange={avaUploaded}/>
                    <label htmlFor="userAvatarUpload">
                        <Button variant="text" style={{marginTop: '7px'}} fullWidth component="span">
                            Загрузить аватарку
                        </Button>
                    </label>
                </Box>
            </CardActions>
        </Card>
    );
};

export default AccountProfile;
