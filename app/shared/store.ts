import { createStore } from 'jotai';
export const createAppStore=()=>createStore();
export const webStore=createAppStore();
export const officePaneStore=createAppStore();
