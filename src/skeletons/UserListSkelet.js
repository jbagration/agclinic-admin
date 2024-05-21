import React from 'react';
import { Container, Box, Skeleton } from '@material-ui/core';

const UserListSkelet = () => (
    <Box>
        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton variant="text" style={{ width: '18%', height: '74px' }} />
        </Box>
        <Skeleton variant="text" style={{ height: '400px', transform: 'scale(1, 0.97)' }} />
    </Box>
);

export default UserListSkelet;
