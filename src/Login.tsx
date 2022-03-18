import React, { useState } from 'react';
import Header from './components/Header'
import { Navigate } from 'react-router-dom'
import { Typography, TextField, Button, Dialog, DialogContent } from '@mui/material'
import './Login.css'
import axios from 'axios'
import Menu from './components/Menu'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

function Login() {
    const [id, setID] = useState<string>('');
    const [pw, setPW] = useState<string>('');
    const [isLoggedin, setIsLoggedin] = useState<boolean>(localStorage.getItem('token')!=null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const handleID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setID(event.target.value);
    };
    const handlePW = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPW(event.target.value);
    };
    const handleAuth = () => {
        let data = {
            "id": id,
            "pw": pw
        };
        setIsOpen(true);
        axios.post(API_URL + "/login", JSON.stringify(data)).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data));
            localStorage.setItem("token", resBody.token);
            localStorage.setItem("user", id);
            setIsLoggedin(true);
            setIsOpen(false);
        }).catch(err => {
            setIsOpen(false);
            setMessage('ログイン失敗');
        })
    }
    return (
        <div>
            <Header></Header>
            <main>
                <Menu num={0}/>
                <div className="main-contents">
                    <Typography variant="h4">ログイン</Typography>
                    <Typography variant="body1" color="red">{message}</Typography>
                    <div className="login-form-main">
                        <div className="login-form-in">
                            <TextField id="outlined-basic" label="ID" variant="outlined" onChange={handleID} value={id} />
                        </div>
                        <div className="login-form-in">
                            <TextField id="outlined-basic" label="Password" variant="outlined" type="password" onChange={handlePW} value={pw} />
                        </div>
                        <Button variant="contained" onClick={handleAuth}>ログイン</Button>
                    </div>
                </div>
                {isLoggedin &&
                    <Navigate to="/" />
                }
                <Dialog open={isOpen}>
                    <DialogContent>処理中</DialogContent>
                </Dialog>
            </main>
        </div>
    )
}
export default Login;