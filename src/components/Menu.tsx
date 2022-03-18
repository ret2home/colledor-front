import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './Menu.css'
import { Navigate } from 'react-router';
import { Typography } from '@mui/material';

interface Props {
    num: number
}

function two(x:string){
    if(x.length==1)return "0"+x;
    return x;
}
function dat(d:number){
    let x:Date=new Date(d);
    return String(x.getFullYear())+"/"+String(x.getMonth()+1)+"/"+String(x.getDate())+" "+two(String(x.getHours()))+":"+two(String(x.getMinutes()));
}

const CONTEST_START:number=Number(process.env.REACT_APP_CONTEST_START);
const CONTEST_END:number=Number(process.env.REACT_APP_CONTEST_END);
function Menu(props: Props) {
    const [value, setValue] = React.useState(props.num);
    const [href, sethref]=React.useState<string>();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const hr=(hr: string)=>{
        if(window.location.pathname!=hr)sethref(hr);
    };

    return (
        <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="body2" style={{ color: '#666', marginLeft: '30px', fontSize: '13px'}}>
                コンテスト時間: {dat(CONTEST_START*1000)} ~ {dat(CONTEST_END*1000)} ({(CONTEST_END-CONTEST_START)/60} 分)
            </Typography>
            <Tabs value={value} onChange={handleChange} scrollButtons allowScrollButtonsMobile variant="scrollable">
                <Tab label="トップ" onClick={()=>hr("/")} />
                <Tab label="提出" onClick={()=>hr("/submit")} />
                <Tab label="チャレンジ" onClick={()=>hr("/challenge")} />
                <Tab label="提出一覧" onClick={()=>hr("/submissions-list")} />
                <Tab label="チャレンジ一覧" onClick={()=>hr("/challenges-list")} />
                <Tab label="ランキング" onClick={()=>hr("/ranking")} />
            </Tabs>
            {href && (
                <Navigate to={href} />
            )}
        </Box>
    );
}
export default Menu