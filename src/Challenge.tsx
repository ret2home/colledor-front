import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Menu from './components/Menu'

import axios from 'axios'
import { Typography, Button, TextareaAutosize, Dialog, DialogContent, InputLabel, MenuItem, FormControl } from '@mui/material';
import { Navigate } from 'react-router';

import Select, { SelectChangeEvent } from '@mui/material/Select';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

interface User{
    id: string,
    rating: number
}
export default function Challenge() {
    const [target, setTarget] = useState<string>('');
    const [candTarget, setCandTarget] = useState<Array<User>>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [href, sethref] = useState<string>();
    const onSubmit = () => {
        setIsOpen(true);
        let data = {
            "token": localStorage.getItem('token'),
            "target": target
        };
        axios.post(API_URL + "/challenge", JSON.stringify(data)).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data));
            setIsOpen(false);
            sethref("/challenges-list")
        }).catch(err => {
            setIsOpen(false);
            setMessage('チャレンジ申込み失敗');
        })
    }
    const onChange = (event: SelectChangeEvent) => {
        setTarget(event.target.value);
    }
    useEffect(() => {
        if (localStorage.getItem('token') == null) sethref("/login");
        axios.get(API_URL + "/submitted-users").then(res => {
            let resBody: Array<any> = JSON.parse(JSON.stringify(res.data))["users"];
            let cand: Array<User> = [];
            resBody.forEach((val, i) => {
                let d:User={
                    id: val["id"],
                    rating: val["rating"]
                }
                cand.push(d);
            });
            setCandTarget(cand);
        })
    }, [])
    return (
        <div>
            <Header />
            <main>
                <Menu num={2} />
                <div className="main-contents">
                    <Typography variant="h5">注意事項</Typography>
                    <ul>
                        <li>
                            <Typography variant="body1">レーティングが自分以上のアカウントとの対戦のみ rated です。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">自分自身と対戦する事もできますが unrated です。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">一度も提出していないアカウントとは対戦できません。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">申込み者が先手になります。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">申込み時点ではなく、ジャッジ開始時点で最後に提出されたコードが使われます。</Typography>
                        </li>
                        <li>
                            <Typography variant="body1">対戦相手に関わらず、チャレンジ後は 3 分間チャレンジできません。</Typography>
                        </li>
                    </ul>
                    <div style={{ marginTop: '20px' }}>
                        <Typography variant="body1" color="red">{message}</Typography>
                    </div>
                    <div style={{ margin: '20px' }}>
                        <FormControl style={{width: '200px'}} variant="standard">
                            <InputLabel>対戦相手</InputLabel>
                            <Select
                                id="demo-simple-select"
                                value={target}
                                label="Age"
                                onChange={onChange}
                            >
                            {candTarget?.map(row=>(
                                <MenuItem value={row.id} key={row.id}>{row.id+" ("+row.rating.toString()+")"}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ margin: '20px' }}>
                        <Button variant="contained" onClick={() => onSubmit()}>チャレンジ</Button>
                    </div>
                </div>
                <Dialog open={isOpen}>
                    <DialogContent>処理中</DialogContent>
                </Dialog>
                {href && (
                    <Navigate to={href} />
                )}
            </main>
        </div>
    )
}