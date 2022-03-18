import React, { useState, useEffect } from 'react';
import Header from './components/Header'

import { Button, Dialog, DialogContent, FormControlLabel, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import Checkbox from '@mui/material/Checkbox';
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import 'highlight.js/styles/base16/github.css'
import './Ranking.css'

import axios from 'axios'
import Menu from './components/Menu'
import { Navigate } from 'react-router';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


interface Submission {
    id: number,
    tim: string,
    user: string,
    source: string
}

// 2022/3/17 13:00:00
const CONTEST_END: number = Number(process.env.REACT_APP_CONTEST_END) * 1000;
export default function Submissions() {
    const [submissions, setSubmissions] = useState<Array<Submission>>();
    const currentTime = Date.now();
    const user = localStorage.getItem('user');
    const [isOwnOnly, setIsOwnOnly] = useState<boolean>(currentTime <= CONTEST_END && user != 'admin');
    const [href, sethref] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [source, setSource] = useState<string>("");
    useEffect(() => {
        if (localStorage.getItem('token') == null) sethref("/login");
        hljs.registerLanguage('cpp', cpp);
    }, [])
    useEffect(() => {
        let data = {
            "token": localStorage.getItem('token'),
            "user": (isOwnOnly ? localStorage.getItem('user') : "all")
        }

        axios.post(API_URL + "/submissions-list", JSON.stringify(data)).then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data))["submissions"];
            let resData: Array<Submission> = [];
            resBody.forEach((elem: any, index: any) => resData.push(elem));
            setSubmissions(resData);
        }).catch(err => {
            console.error(err);
        })
    }, [isOwnOnly]);
    const openDetail = (id: number) => {
        setIsOpen(true);
        setSource("Loading...");
        let data = {
            "token": localStorage.getItem('token'),
            "id": id
        }
        axios.post(API_URL + "/submission-info", JSON.stringify(data)).then(res => {
            setSource(JSON.parse(JSON.stringify(res.data))["source"]);
            hljs.highlightAll();
        }).catch(err => {
            console.error(err);
        })
    }
    return (
        <div>
            <Header />
            <main>
                <Menu num={3} />
                <div className="main-contents">
                    <TableContainer component={Container} style={{ maxWidth: '800px' }}>
                        {(currentTime >= CONTEST_END || user == 'admin') && (
                            <FormControlLabel control={<Checkbox checked={isOwnOnly} onChange={() => setIsOwnOnly(!isOwnOnly)} />} label="自分の提出のみ" />
                        )
                        }
                        <Table size="small" style={{ marginTop: '15px' }}>
                            <TableHead>
                                <TableRow style={{ background: '#ddd' }}>
                                    <TableCell align="right" width="20px">ID</TableCell>
                                    <TableCell align="left" width="180px">Time</TableCell>
                                    <TableCell align="left">User</TableCell>
                                    <TableCell align="left" width="30px"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions?.map((row, index) => (
                                    <TableRow key={row.id} style={index % 2 ? { background: '#f2f2f2' } : { background: '#fff' }}>
                                        <TableCell align="right">{row.id}</TableCell>
                                        <TableCell align="left">{row.tim}</TableCell>
                                        <TableCell align="left">{row.user}</TableCell>
                                        <TableCell align="left">
                                            <Button variant="text" onClick={() => openDetail(row.id)}>Code</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {href && (
                    <Navigate to={href} />
                )}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
                    <DialogContent>
                        <Button variant="text" onClick={() => navigator.clipboard.writeText(source)}>Copy</Button>
                        <Button variant="text" onClick={() => setIsOpen(false)}>Close</Button>
                        <pre>
                            <code>
                                {source}
                            </code>
                        </pre>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}