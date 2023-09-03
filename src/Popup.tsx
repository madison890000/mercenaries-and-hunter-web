import React, {useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import Switch from '@mui/material/Switch';
import {addSend, hasSite, removeSend} from "./service";
import copy from 'copy-to-clipboard'

const label = {inputProps: {'aria-label': 'Switch demo'}};

const getUrl = () => {
    const queryInfo = {
        active: true,
        currentWindow: true
    };
    return new Promise<{
        url: string;
        tabId: number;
        title?: string;
    }>(resolve => {
        chrome?.tabs?.query(queryInfo, function (tabs) {
            const activeTab = tabs?.find(t => t?.active);
            resolve({
                url: activeTab?.url as string,
                tabId: activeTab?.id ?? 0,
                title: activeTab?.title
            })
        });
    })
}

function Popup() {
    const [sended, setSended] = useState(false);
    const [tab, setTab] = useState<{
        url: string;
        tabId: number;
        title?: string;
    }>({url: '', tabId: 0});
    const hasSend = async () => {
        const res = await hasSite(tab?.url);
        setSended(res);
        // Next state will always be the opposite
        const nextState = res ? '已投' : '待投';
        // Set the action badge to the next state
        await chrome?.action?.setBadgeText({
            tabId: tab.tabId,
            text: nextState,
        });
    }
    const fetchUrl = async () => {
        const d = await getUrl();
        setTab(d);
    }
    useEffect(() => {
        fetchUrl();
    }, []);
    useEffect(() => {
        hasSend();
    }, [tab?.url]);
    const callBack = async () => {
        hasSend();
    }
    return (
        <div style={{
            padding: 12,
            minWidth: 160,
            textAlign: "center"
        }}>
            <div>已投递<Switch {...label} checked={sended} onChange={async (e) => {
                if (e?.target?.checked) {
                    await addSend(tab?.url, {
                        title: tab?.title
                    });
                    callBack();
                } else {
                    await removeSend(tab?.url);
                    callBack();
                }
            }}/></div>
            <div><Button variant="contained" onClick={async () => {
                window.open('https://www.mercenarieshunter.com/')
            }}>打开home 页面</Button></div>
            <div style={{
                marginTop: 12,
            }}><Button variant="outlined" onClick={async () => {
                copy(window.localStorage.getItem('resume') ?? '')
            }}>复制旧简历</Button></div>
        </div>
    );
}

export default Popup;
