import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Menu from './components/Menu'

import './Home.css'

import { Typography } from '@mui/material';


function Home() {
    return (
        <div>
            <Header />
            <main>
                <Menu num={0} />
                <div className="main-contents">
                    <div className="event-title">
                        <Typography variant="h3">パ研合宿 2022 レクリエーション</Typography>
                    </div>
                    <Typography variant="body2" style={{ color: '#666', fontSize: '13px' }}>参加対象: パ研合宿 2022 参加者</Typography>

                    <div className="top-block">
                        <Typography variant="h5">コンテスト情報</Typography>
                        <ul>
                            <li>
                                <Typography variant="body1">コンテスト時間: 180 分</Typography>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Home;