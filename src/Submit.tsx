import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Menu from './components/Menu'

import axios from 'axios'
import { Typography, Button, TextareaAutosize, Dialog, DialogContent } from '@mui/material';
import { Navigate } from 'react-router';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


export default function Submit() {
    const [source, setSource] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [href, sethref] = useState<string>();
    const onSubmit = () => {
        setIsOpen(true);
        let data = {
            "token": localStorage.getItem('token'),
            "source": source
        };
        axios.post(API_URL + "/submit", JSON.stringify(data)).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data));
            setIsOpen(false);
            sethref("/submissions-list")
        }).catch(err => {
            setIsOpen(false);
            setMessage('提出失敗');
        })
    }
    const onChangeSource=(event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setSource(event.target.value);
    }
    useEffect(()=>{
        if(localStorage.getItem('token')==null)sethref("/login");
    },[])
    return (
        <div>
            <Header />
            <main>
                <Menu num={1} />
                <div className="main-contents">
                    <Typography variant="h5">注意事項</Typography>
                    <ul>
                        <li>
                            <Typography variant="body1">言語は C++17 のみです。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">AC-Library が使えます。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">コンパイルが成功するかのみチェックが行われます。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">チャレンジには最後に提出されたコードが使われます。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">コンパイルの結果に関わらず提出後は 30 秒間提出できません。</Typography>
                        </li>
                    </ul>
                    <div style={{marginTop: '20px'}}>
                        <Typography variant="body1" color="red">{message}</Typography>
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <TextareaAutosize minRows={20} maxRows={20} value={source} onChange={onChangeSource} style={{ width: '600px', maxWidth: '100%' }} />
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <Button variant="contained" onClick={() => onSubmit()}>提出</Button>
                    </div>
                </div>
                <Dialog open={isOpen}>
                    <DialogContent>処理中</DialogContent>
                </Dialog>
                {href &&(
                    <Navigate to={href} />
                )}
            </main>
        </div>
    )
}