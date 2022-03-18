import React, { useState, useEffect } from 'react';
import Header from './components/Header'

import { Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import Graph from './components/Graph'

import './Ranking.css'

import axios from 'axios'
import Menu from './components/Menu'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


interface User {
    rank: number,
    id: string,
    rating: number
}
function Ranking() {
    const [users, setUsers] = useState<Array<User>>();
    useEffect(() => {
        axios.get(API_URL + "/users").then(res => {
            let resBody = JSON.parse(JSON.stringify(res.data))["users"];
            let resData: Array<User> = [];
            let las:number=-1,rank:number=-1;
            resBody.forEach((elem: any, index: any) => {
                if(elem.rating!=las){
                    rank=index+1;
                }
                las=elem.rating;
                let data:User={
                    rank: rank,
                    id: elem.id,
                    rating: elem.rating
                };
                resData.push(data);
            });
            setUsers(resData);
        }).catch(err => {
            console.error(err);
        })
    }, []);
    return (
        <div>
            <Header />
            <main>
                <Menu num={5} />
                <div className="main-contents">
                    <Graph />
                    <TableContainer component={Container} style={{ maxWidth: '600px', marginTop: '15px' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow style={{ background: '#ddd' }}>
                                    <TableCell align="right" width="30px">Rank</TableCell>
                                    <TableCell align="left">User</TableCell>
                                    <TableCell align="right">Rating</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.map((row, index) => (
                                    <TableRow key={row.id} style={index % 2 ? { background: '#f2f2f2' } : { background: '#fff' }}>
                                        <TableCell align="right">{row.rank}</TableCell>
                                        <TableCell align="left">{row.id}</TableCell>
                                        <TableCell align="right">{row.rating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </main>
        </div>
    )
}
export default Ranking;