import React, { useState, useEffect } from 'react';
import Header from './components/Header'

import { Button, Dialog, DialogContent, FormControlLabel, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';

import Checkbox from '@mui/material/Checkbox';
import 'highlight.js/styles/base16/github.css'
import './Ranking.css'

import axios from 'axios'
import Menu from './components/Menu'
import { Navigate } from 'react-router';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


interface Challenge {
    id: number,
    rated: string,
    tim: string,
    stat: string,
    user1: string,
    user2: string,
    user1_score: string,
    user2_score: string
}

export default function ChallengesList() {
    const [challenges, setChallenges] = useState<Array<Challenge>>();
    const currentTime = Date.now();
    const user=localStorage.getItem('user');
    const [isOwnOnly, setIsOwnOnly] = useState<boolean>(false);
    const [href, sethref] = useState<string>();

    const update = () => {
        axios.get(API_URL + "/challenges-list/" + (isOwnOnly ? localStorage.getItem('user') : "all")).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data))["challenges"];
            let resData: Array<Challenge> = [];
            resBody.forEach((elem: any, index: any) => {
                let data: Challenge = {
                    id: elem.id,
                    rated: elem.rated ? "rated" : "unrated",
                    tim: elem.tim,
                    stat: elem.stat,
                    user1: elem.user1,
                    user2: elem.user2,
                    user1_score: elem.user1_score,
                    user2_score: elem.user2_score
                };
                resData.push(data);
            });
            setChallenges(resData);
        }).catch(err => {
            console.error(err);
        })
    }
    useEffect(() => {
        if (localStorage.getItem('token') == null) sethref("/login");
    }, [])
    useEffect(() => {
        update();
    }, [isOwnOnly]);
    return (
        <div>
            <Header />
            <main>
                <Menu num={4} />
                <div className="main-contents">
                    <TableContainer component={Container}>
                        <Button variant="text" onClick={() => update()}>更新</Button>
                        <FormControlLabel control={<Checkbox checked={isOwnOnly} onChange={() => setIsOwnOnly(!isOwnOnly)} />} label="自分の対戦のみ" />
                        <Table size="small" style={{ marginTop: '15px' }}>
                            <TableHead>
                                <TableRow style={{ background: '#ddd' }}>
                                    <TableCell align="right" width="20px">ID</TableCell>
                                    <TableCell align="left" width="140px">Time</TableCell>
                                    <TableCell align="left">Rated</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">User 1</TableCell>
                                    <TableCell align="left">User 2</TableCell>
                                    <TableCell align="left">User 1 Score</TableCell>
                                    <TableCell align="left">User 2 Score</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {challenges?.map((row, index) => {
                                    let result;
                                    if(row.stat!="FINISHED"||row.user1==row.user2)result="-1";
                                    else if(row.user1_score=="TLE"||row.user1_score=="WA")result="win2";
                                    else if(row.user2_score=="TLE"||row.user2_score=="WA")result="win1";
                                    else if(Number(row.user1_score)<Number(row.user2_score))result="win2";
                                    else if(Number(row.user1_score)>Number(row.user2_score))result="win1";
                                    else result="draw";

                                    let background=(index%2?'#f2f2f2':'#fff');
                                    if((user==row.user1&&result=="win1")||(user==row.user2&&result=="win2"))background="#d5f0d5";
                                    else if((user==row.user1&&result=="win2")||(user==row.user2&&result=="win1"))background="#f5e6d3";
                                    else if((user==row.user1||user==row.user2)&&result=="draw")background="#e9f5ba";

                                    return (
                                        <TableRow key={row.id} style={{background: background}}>
                                            <TableCell align="right">{row.id}</TableCell>
                                            <TableCell align="left">{row.tim}</TableCell>
                                            <TableCell align="left">{row.rated}</TableCell>
                                            <TableCell align="left">{row.stat}</TableCell>
                                            <TableCell align="left">{row.user1}</TableCell>
                                            <TableCell align="left">{row.user2}</TableCell>
                                            <TableCell align="left">{row.user1_score}</TableCell>
                                            <TableCell align="left">{row.user2_score}</TableCell>
                                            <TableCell align="left">
                                                <Button variant="text" onClick={() => sethref("/challenge-info/" + row.id.toString())}>観戦</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {href && (
                    <Navigate to={href} />
                )}
            </main>
        </div>
    )
}