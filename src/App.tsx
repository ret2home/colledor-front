import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Submit from './Submit'
import Ranking from './Ranking'
import Submissions from './Submissions'
import Challenge from './Challenge'
import ChallengesList from './ChallengesList'
import ChallengeInfo from './ChallengeInfo'

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/submit" element={<Submit />}/>
                    <Route path="/ranking" element={<Ranking />}/>
                    <Route path="/submissions-list" element={<Submissions />}/>
                    <Route path="/challenge" element={<Challenge />}/>
                    <Route path="/challenges-list" element={<ChallengesList />}/>
                    <Route path="/challenge-info/:id" element={<ChallengeInfo />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
