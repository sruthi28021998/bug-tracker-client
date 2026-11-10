import { io } from 'socket.io-client';
import { SERVER } from './api';

export const socket = io(SERVER, { autoConnect: false });