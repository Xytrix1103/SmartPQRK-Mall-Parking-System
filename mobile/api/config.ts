import React from 'react';

const ip = "192.168.101.13";
const port = "4000";
const ws_port = "3000";
export const baseURL = `http://${ip}:${port}/api`;      // http://
export const wsURL = `ws://${ip}:${ws_port}`;