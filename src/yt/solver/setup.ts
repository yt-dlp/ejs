import { parse } from "meriyah";

export const setupNodes = parse(`
globalThis.XMLHttpRequest = { prototype: {} };
const window = Object.assign(Object.create(null), globalThis);
window.location = {
    hash: "",
    host: "www.youtube.com",
    hostname: "www.youtube.com",
    href: "https://www.youtube.com/watch?v=yt-dlp-wins",
    origin: "https://www.youtube.com",
    password: "",
    pathname: "/watch",
    port: "",
    protocol: "https:",
    search: "?v=yt-dlp-wins",
    username: "",
};
const document = {};
const navigator = {};
let self = globalThis;
`).body;
