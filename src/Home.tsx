import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Menu from './components/Menu'
import InitBoard from './init-board.png'
import Top1 from './task_img1.png'
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import './Home.css'

import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';


function Home() {
    return (
        <div>
            <Header />
            <main>
                <Menu num={0} />
                <div className="main-contents">
                    <div className="event-title">
                        <Typography variant="h3">パ研合宿 2021 <span style={{ display: 'inline-block' }}>レクリエーション</span></Typography>
                    </div>
                    <Typography variant="body2" style={{ color: '#666', fontSize: '13px' }}>参加対象: パ研合宿 2021 参加者</Typography>

                    <div className="top-block">
                        <b>このサイトはアーカイブです。提出やチャレンジはできません。また、スマホ向けには作られていません。</b><br/><br />
                        <Typography variant="h5" className="top-block-title">問題設定</Typography>

                        <div style={{ margin: '15px' }}>
                            <Typography variant="body1">
                                <b>
                                    <Link to="/challenge-info/1">対戦の例</Link>をあわせて見ておく事を強く推奨します。
                                </b>
                            </Typography>
                            <img src={InitBoard} style={{ width: '400px', margin: '30px' }} />
                            <Typography variant="body1">
                                <TeX math="9" />x<TeX math="9" /> の盤面上でゲームをします。上の図は初期盤面の例で、黒が先手、白が後手で交互に着手します。
                                以下、マス <TeX math="(x, y)" /> は <b>0-indexed</b> で上から <TeX math="x" /> 番目、左から <TeX math="y" /> 番目のマスを指します。<br /><br />
                                先手はマス <TeX math="(8, 4)" /> スタート, 後手はマス <TeX math="(0, 4)" /> スタートです。<br />
                                各ターンでは、隣接するマスに移動するか、壁を置くかのどちらかの操作を行えます。先手・後手共に<b>壁を置く操作は合計 <TeX math="10" /> 回まで</b>しか行えません。
                                なお、ビジュアライザでは壁を置ける残り回数が盤面の上部（後手）と下部（先手）に表示されます。<br />相手のいるマスに移動するのは構いませんが、壁を超えての移動はできません。<br />

                                <br />
                                壁を置く操作では、水平方向か垂直方向に連続する <TeX math="2" /> 本の壁をマスの間に置きます（下の図を参考にして下さい）。
                                この時、<b>既に置かれている壁と重なってはいけません</b>。また、<b>全マスの連結性を保つ必要があります</b>。

                                <br /><br />
                                全体のおよそ <TeX math="60 \%" /> のマスにはリンゴが <TeX math="1" /> つ置かれています。この配置はランダムですが、水平方向の中心線を境に対称になっています。
                                また、マス <TeX math="(8, 4), (0, 4)" /> にリンゴは置かれていません。<br />
                                <b>リンゴが置かれているマスにプレイヤーが移動すると、そのプレイヤーは移動先のマスにあるリンゴを貰います。そのマスにあったリンゴはなくなります。</b><br />

                                <br />
                                ゲームは先手・後手合計で <TeX math="150" /> ステップに達するか、全てのリンゴがなくなると終了します。終了時点において、合計でより多くのリンゴを貰った方が勝ちです。
                            </Typography>

                            <img src={Top1} style={{ width: '400px', margin: '30px' }} />
                        </div>
                    </div>
                    <div className="top-block">
                        <Typography variant="h5" className="top-block-title">実装の詳細</Typography>
                        <div style={{ margin: '15px' }}>
                            <Typography variant="body1">
                                ※入出力や簡易ビジュアライズ、操作の正当性チェックなどの機能が付いたテンプレートを Discord で配布しているので、適宜活用して下さい。<br /><br />

                            まず、標準入力から先手・後手の情報と盤面の情報を入力します。先手なら First, 後手なら Second です。
                            盤面は # と . で表され、# のマスはリンゴがある事を、. のマスはリンゴがない事を表します。<br /><br />

                            (入力例) <br />
                            これは上の図の初期盤面を表しています。
                            <pre>
                                    First<br />
##.#.##.#<br />
#.###.##.<br />
##.#...##<br />
#...#.##.<br />
#..######<br />
#...#.##.<br />
##.#...##<br />
#.###.##.<br />
##.#.##.#<br />
                                </pre>

                            自分のターンになったら操作を選んで、標準出力に出力します。<b>出力の際に flush をしないと TLE になる事があります。</b>endl を使いましょう。<br />相手のターンだった場合は、相手の操作を標準入力から入力します。<br /><br />
                            操作を選ぶ時間は、<b>合計で <TeX math="75" /> 秒以内</b> である必要があります（つまり、ならし <TeX math="1" /> 手 <TeX math="1" /> 秒）。それを超えると TLE になり負けですので気をつけてください。
                                <b>また、スレッドなどを使うと相手のターンの間にも計算が行えますが、今回は禁止とします。</b><br /><br />
                            各操作は以下のように表されます。不正な操作は全て WA になります。途中で RE などで落ちてしまった場合も WA となるので気をつけてください。<br />

                                <Typography variant="h6" style={{ margin: '20px 0px', borderBottom: '1px solid #000' }}>隣接するマスに移動</Typography>
                                <pre>
                                    <TeX math="0\ d" />
                                </pre>
                                <TeX math="d" /> は方向を表します。
                                <ul>
                                    <li><TeX math="d = 0" /> ・・・ 上方向に移動。つまり、<TeX math="(x, y)" /> → <TeX math="(x-1, y)" /></li>
                                    <li><TeX math="d = 1" /> ・・・ 右方向に移動。つまり、<TeX math="(x, y)" /> → <TeX math="(x, y+1)" /></li>
                                    <li><TeX math="d = 2" /> ・・・ 下方向に移動。つまり、<TeX math="(x, y)" /> → <TeX math="(x+1, y)" /></li>
                                    <li><TeX math="d = 3" /> ・・・ 左方向に移動。つまり、<TeX math="(x, y)" /> → <TeX math="(x, y-1)" /></li>
                                </ul>
                                場外乱闘しようとしたり、壁を越えようとしてはいけません。
                            </Typography>
                            <Typography variant="h6" style={{ margin: '20px 0px', borderBottom: '1px solid #000' }}>水平方向の壁を置く</Typography>
                            <pre>
                                <TeX math="1\ x\ y" />
                            </pre>
                            マス <TeX math="(x, y)" /> とマス <TeX math="(x+1, y)" /> の間、マス <TeX math="(x, y+1)" /> とマス <TeX math="(x+1, y+1)" /> の間の <TeX math="2" /> 箇所に壁を置きます。
                            <TeX math="0 \leq x,y \leq 7" /> を満たす必要がある他、置こうとした場所に壁があってはいけません。また、全マスの連結性を失うような壁を置く事はできません。
                            <Typography variant="h6" style={{ margin: '20px 0px', borderBottom: '1px solid #000' }}>垂直方向の壁を置く</Typography>
                            <pre>
                                <TeX math="2\ x\ y" />
                            </pre>
                            マス <TeX math="(x, y)" /> とマス <TeX math="(x, y+1)" /> の間、マス <TeX math="(x+1, y)" /> とマス <TeX math="(x+1, y+1)" /> の間の <TeX math="2" /> 箇所に壁を置きます。
                            <TeX math="0 \leq x,y \leq 7" /> を満たす必要がある他、置こうとした場所に壁があってはいけません。また、全マスの連結性を失うような壁を置く事はできません。<br /><br />

                            壁を置く操作は合計で <TeX math="10" /> 回までしか行えません。<br /><br />先手・後手合わせて <TeX math="150" /> ステップに到達した、リンゴが全てなくなった、不正な操作が出力された、などでゲームが終了すると以下が入力されます。
                            <pre>
                                <TeX math="3" />
                            </pre>
                            <b>これが入力された場合、速やかにプログラムを終了させなければいけません。</b>

                            <Typography variant="h6" style={{ margin: '20px 0px', borderBottom: '1px solid #000' }}>やりとりの例</Typography>
                            操作を表すもののうち、ジャッジからの入力の先頭には → , 出力には ← を付けていますが実際には付いていません。<br />
                            対戦の例の後手視点でのやり取りになります。

                            <pre>
                                Second<br />
##.#.##.#<br />
#.###.##.<br />
##.#...##<br />
#...#.##.<br />
#..######<br />
#...#.##.<br />
##.#...##<br />
#.###.##.<br />
##.#.##.#<br />
→ 0 0<br />
← 0 1<br />
→ 2 0 5<br />
← 0 3<br />
→ 0 3<br />
← 0 2<br />
→ 0 0<br />
← 0 2<br />
→ 0 0<br />
← 0 3<br />
→ 0 1<br />
← 1 4 3<br />
→ 0 1<br />
...
                            </pre>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Home;