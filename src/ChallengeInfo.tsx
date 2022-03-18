import React, { useState, useEffect, useRef, ReactElement } from 'react';
import Header from './components/Header'

import { Button, Dialog, DialogContent, FormControlLabel, Typography, IconButton, Slider } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';

import Checkbox from '@mui/material/Checkbox';

import axios from 'axios'
import Menu from './components/Menu'
import { Navigate, useParams } from 'react-router';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AppleImage from './fruit_apple.png'
import './ChallengeInfo.css'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}


interface Challenge {
    id: number,
    rated: string,
    tim: number,
    stat: string,
    user1: string,
    user2: string,
    user1_score: string,
    user2_score: string,
    output: string
}

interface Act {
    type: number,
    x: number,
    y: number
}
interface Game {
    C: Array<Array<number>>,
    X: Array<number>,
    Y: Array<number>,
    score: Array<number>,
    wall_used: Array<number>,
    wall_hrz: Array<Array<number>>,
    wall_vert: Array<Array<number>>,
    turn: number
}
function newGame() {
    let a99 = new Array(9);
    for (let i = 0; i < 9; i++) {
        a99[i] = (new Array<number>(9).fill(0));
    }
    let game: Game = {
        C: a99.slice(),
        X: [8, 0],
        Y: [4, 4],
        score: [0, 0],
        wall_used: [0, 0],
        wall_hrz: a99.slice(),
        wall_vert: a99.slice(),
        turn: 0
    };
    return JSON.parse(JSON.stringify(game));
}
let dx = [-1, 0, 1, 0];
let dy = [0, 1, 0, -1];
function applyAct(game: Game, act: Act) {
    let n = JSON.parse(JSON.stringify(game));
    if (act.type == 0) {
        n.X[n.turn] += dx[act.x];
        n.Y[n.turn] += dy[act.x];
        if (n.C[n.X[n.turn]][n.Y[n.turn]]) {
            n.score[n.turn]++;
            n.C[n.X[n.turn]][n.Y[n.turn]] = false;
        }
    } else if (act.type == 1) {
        n.wall_hrz[act.x][act.y] = n.wall_hrz[act.x][act.y + 1] = n.turn + 1;
        n.wall_used[n.turn]++;
    } else {
        n.wall_vert[act.x][act.y] = n.wall_vert[act.x + 1][act.y] = n.turn + 1;
        n.wall_used[n.turn]++;
    }
    n.turn ^= 1;
    return JSON.parse(JSON.stringify(n));
}


export default function ChallengeInfo() {
    const id = useParams()["id"];
    const [challenge, setChallenge] = useState<Challenge>();
    const [result, setResult] = useState<Array<string>>([]);
    const games = useRef<Array<Game>>([]);
    const [running, setRunning] = useState<boolean>(true);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const updateIntervalID = useRef<number>(-1);
    const stepIntervalID = useRef<number>(0);

    const update = (() => {
        axios.get(API_URL + "/challenge-info/" + id).then(res => {
            let resBody: Challenge = JSON.parse(JSON.stringify(res.data));
            setChallenge(resBody);
            let spl = resBody.output.split('\n');

            while (spl[spl.length - 1] == "") spl.pop();
            if (spl[spl.length - 1] == "END") {
                spl.pop(); spl.pop();
            }
            if (spl.length == 0) return;
            let clone = [];
            if (clone.length == 0) {
                let game: Game = newGame();
                for (let i = 0; i < 9; i++)for (let j = 0; j < 9; j++) {
                    if (spl[i][j] == '#') game.C[i][j] = 1;
                    else game.C[i][j] = 0;
                }
                clone.push(game);
            }
            for (let i = 9; i < spl.length; i++) {
                let x = spl[i].split(' ');
                if (x.length == 3) x.push('0');
                let act: Act = {
                    type: Number(x[1]),
                    x: Number(x[2]),
                    y: Number(x[3])
                };
                clone.push(applyAct(clone[clone.length - 1], act));
            }
            games.current = clone;

            if (resBody.user1_score != "") {
                window.clearInterval(updateIntervalID.current);
            }
        }).catch(err => {
            console.error(err);
        })
    });

    const stopRunning = (() => {
        window.clearInterval(stepIntervalID.current);
        setRunning(false);
        console.log("STOP", stepIntervalID.current);
    })
    const onRunningChange = (() => {
        if (running) stopRunning();
        else {
            stepIntervalID.current = window.setInterval(step, 500);
            console.log("START", stepIntervalID);
            setRunning(true);
        }
    })
    const step = (() => {
        setCurrentStep(c => {
            if (c == games.current.length - 1 || games.current.length == 0) {
                if (challenge?.stat == "FINISHED") stopRunning();
                return c;
            }
            return c + 1;
        });
    })
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof (newValue) == "number") {
            stopRunning();
            setCurrentStep(newValue);
        }
    }
    useEffect(() => {
        update();
        stepIntervalID.current = window.setInterval(step, 500);
        updateIntervalID.current = window.setInterval(update, 1000);
    }, []);
    return (
        <div>
            <Header />
            <main>
                <Menu num={4} />
                <div className="main-contents">

                    <TableContainer component={Container}>
                        <Table size="small" style={{ marginTop: '15px', marginBottom: '15px' }}>
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {challenge &&
                                    (
                                        <TableRow style={{ background: '#fff' }}>
                                            <TableCell align="right">{challenge.id}</TableCell>
                                            <TableCell align="left">{challenge.tim}</TableCell>
                                            <TableCell align="left">{challenge.rated ? "rated" : "unrated"}</TableCell>
                                            <TableCell align="left">{challenge.stat}</TableCell>
                                            <TableCell align="left">{challenge.user1}</TableCell>
                                            <TableCell align="left">{challenge.user2}</TableCell>
                                            <TableCell align="left">{challenge.user1_score}</TableCell>
                                            <TableCell align="left">{challenge.user2_score}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div>{currentStep}/{Math.max(games.current.length - 1, 0)} Step</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <IconButton
                            color="primary"
                            onClick={() => onRunningChange()}
                            size="large"
                        >
                            {running ? (
                                <StopIcon />
                            ) :
                                (
                                    <PlayArrowIcon />
                                )}
                        </IconButton>
                        <Slider step={1} min={0} max={Math.max(games.current.length - 1, 0)} value={currentStep} onChange={handleSliderChange} />
                    </div>
                    {games.current.length ? (

                        <div className="scoreboard">
                            {(currentStep == games.current.length - 1 && challenge?.stat == "FINISHED") ? (
                                <Typography variant="h4">{challenge.user1_score} : {challenge.user2_score}</Typography>
                            ) : (
                                <Typography variant="h4">{games.current[currentStep].score[0]} : {games.current[currentStep].score[1]}</Typography>
                            )
                            }
                        </div>
                    ) : null}
                    {games.current.length ?
                        (
                            <div className="board">
                                {
                                    games.current[currentStep].C.map((row, i) => (
                                        row.map((x, j) => (
                                            <div style={{ width: '50px', height: '50px', position: 'absolute', top: String(70 + 65 * i) + 'px', left: String(20 + 65 * j) + 'px', background: '#c3ab8c', zIndex: '100', borderRadius: '5px' }} key={i * 9 + j}>
                                                <img src={AppleImage} style={{ 'width': '40px', 'height': '40px', margin: '5px', position: 'relative', opacity: (x ? '100%' : '0%'), transition: '0.5s' }}></img>
                                            </div>
                                        ))
                                    ))
                                }
                                {
                                    games.current[currentStep].wall_hrz.map((row, i) => (
                                        row.map((x, j) => {
                                            return (
                                                <div style={{ width: '50px', height: '10px', position: 'absolute', top: String(70 + 65 * i + 52) + 'px', left: String(20 + 65 * j) + 'px', background: (x == 0 ? '#00000000' : (x == 1 ? '#000' : '#ffffffcc')), zIndex: '2', borderRadius: '3px', transition: '0.5s' }} key={i * 9 + j}></div>
                                            )
                                        })
                                    ))
                                }
                                {
                                    games.current[currentStep].wall_vert.map((row, i) => (
                                        row.map((x, j) => {
                                            return (
                                                <div style={{ width: '10px', height: '50px', position: 'absolute', top: String(70 + 65 * i) + 'px', left: String(20 + 65 * j + 52) + 'px', background: (x == 0 ? '#00000000' : (x == 1 ? '#000' : '#ffffffcc')), zIndex: '2', borderRadius: '3px', transition: '0.5s' }} key={i * 9 + j}></div>
                                            )
                                        })
                                    ))
                                }
                                {
                                    (() => {
                                        let v: Array<ReactElement> = [];
                                        for (let i = 0; i < 10 - games.current[currentStep].wall_used[1]; i++)v.push((
                                            <div style={{ width: '10px', height: '50px', position: 'absolute', top: '15px', left: String(20 + 65 * i - 12) + 'px', background: '#fff', zIndex: '2', borderRadius: '3px' }} key={i}></div>
                                        ))
                                        return v;
                                    })()
                                }
                                {
                                    (() => {
                                        let v: Array<ReactElement> = [];
                                        for (let i = 0; i < 10 - games.current[currentStep].wall_used[0]; i++)v.push((
                                            <div style={{ width: '10px', height: '50px', position: 'absolute', top: '645px', left: String(20 + 65 * i - 12) + 'px', background: '#000', zIndex: '2', borderRadius: '3px' }} key={i}></div>
                                        ))
                                        return v;
                                    })()
                                }
                                <div style={{ width: '30px', height: '30px', position: 'absolute', top: String(80 + 65 * games.current[currentStep].X[1]) + 'px', left: String(30 + 65 * games.current[currentStep].Y[1]) + 'px', background: '#fff', zIndex: '100', borderRadius: '50%', transition: '0.3s' }}></div>
                                <div style={{ width: '30px', height: '30px', position: 'absolute', top: String(80 + 65 * games.current[currentStep].X[0]) + 'px', left: String(30 + 65 * games.current[currentStep].Y[0]) + 'px', background: '#00000099', zIndex: '100', borderRadius: '50%', transition: '0.3s' }}></div>
                            </div>
                        ) : (
                            <div>Waiting to start...</div>
                        )
                    }
                </div>
            </main>
        </div >
    )
}