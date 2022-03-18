import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
import axios from 'axios'

interface History {
    tim_num: number,
    user_id: string,
    rating: number
}
interface Dataset {
    label: string,
    data: Array<number>,
    borderColor: string,
    backgroundColor: string
}
interface Data {
    labels: Array<string>,
    datasets: Array<Dataset>
}

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

if (axios.defaults.headers) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
}

export default function Graph() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Top ranker',
            },
        },
    };
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
    const [data, setData] = useState<Data>();

    const CONTEST_START: number = Number(process.env.REACT_APP_CONTEST_START);

    useEffect(() => {
        axios.get(API_URL + "/top-rating-history").then(res => {
            let resBody: Array<History> = JSON.parse(JSON.stringify(res.data))["history"];
            let ratings: Array<number> = [];
            interface LooseObject {
                [key: string]: any
            }
            let mapping: LooseObject = {};
            let nowdata: Data = {
                labels: [],
                datasets: []
            };

            let cur = 0;
            for (let t = CONTEST_START; t <= CONTEST_START + 60 * 60 * 3; t += 60 * 5) {
                while (cur < resBody.length && resBody[cur].tim_num <= t) {
                    if (resBody[cur].tim_num == CONTEST_START) {
                        let new_data: Dataset = {
                            label: resBody[cur].user_id,
                            data: [],
                            borderColor: colors[cur % colors.length],
                            backgroundColor: colors[cur % colors.length] + '80'
                        };
                        nowdata.datasets.push(new_data);
                        mapping[resBody[cur].user_id] = cur;
                        ratings.push(resBody[cur].rating);
                    } else {
                        ratings[mapping[resBody[cur].user_id]] = resBody[cur].rating;
                    }
                    cur++;
                }
                for (let i = 0; i < ratings.length; i++)nowdata.datasets[i].data.push(ratings[i]);
                nowdata.labels.push(((t - CONTEST_START)/60).toString());
                if(Date.now()/1000<t)break;
            }
            setData(nowdata);
        }).catch(err => {
            console.error(err);
        })
    }, [])

    return (
        <div className="graph">
            {data && (
                <Line options={options} data={data} />
            )}
        </div>
    )
}