# telegraph-api

> Working in progress to fix the [original documention](https://deno.land/x/telegraph)

This library is a fork of <https://github.com/dcdunkan/telegraph>

It use the [unified](https://www.npmjs.com/package/unified) library, so no wasm or c/c++ is required (use [remark](https://www.npmjs.com/package/remark-parse) to parse markdown, use [rehype](https://www.npmjs.com/package/rehype-parse) to parse html)

Use built-in `fetch`, so no more `node-fetch` for node.js

Note that the parsers are separated with the api client, so there is no dependency when parsers are not imported

All in all, it can support both node and deno
