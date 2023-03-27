import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import { Navigate } from 'react-router';

function Header() {
    const user: string | null = localStorage.getItem('user');
    const [href, sethref] = useState<string>();
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if(window.location.pathname!="/login")sethref("/login");
    }
    const gologin = () => {
        if(window.location.pathname!="/login")sethref("/login");
    }
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" className="appbar" style={{background: '#1a237e'}}>
                    <Toolbar>

                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            href="/"
                        ><HomeIcon /></IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            パ研合宿 2022 レクリエーション
                    </Typography>
                        {user ? (
                            <>
                                <Typography style={{ marginLeft: 'auto', marginRight: 10 }}>{user}</Typography>
                                <Button onClick={() => logout()} color="inherit">Logout</Button>
                            </>
                        ) :
                            (
                                <>
                                    <Button color="inherit" onClick={() => gologin()}>Login</Button>
                                </>
                            )
                        }
                    </Toolbar>
                </AppBar>
            </Box>
            {href && (
                <Navigate to={href} />
            )}
        </div>
    )
}
export default Header;