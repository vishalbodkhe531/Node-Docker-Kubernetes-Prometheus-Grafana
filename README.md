1] npm init -y

2] npm install express

3] npm install -D typescript ts-node-dev @types/node @types/express

4] npx tsc --init

5] {
"compilerOptions": {
"target": "ES6",
"module": "commonjs",
"rootDir": "./src",
"outDir": "./dist",
"strict": true,
"esModuleInterop": true
}
}

6] "scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/app.ts",
"build": "tsc",
"start": "node dist/app.js"
}


--------------------------------END-NODE-SETUP---------------------------------------------