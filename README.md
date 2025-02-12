# yjs-example-react-todo-app

An example of how Yjs can be integrated into a simple React app — in this case, a todo list app.

## Contents

The `main` branch contains a todo list app powered by Yjs for multi-user collaboration. If you want to see the app in a version utilizing local state instead of a synchronized one, check out the `initial-app` branch.

The app's main logic is in `src/app/use-todo.ts`. The rest are simple React components.

Styling is based on the starter React page generated with Nx.

## Running the App

You need Node LTS to run the app. First, install dependencies:

```bash
npm install
```

If you're running the `initial-app` branch, the only thing you need to do is to run the app:

```bash
npm start
```

For the `main` branch, you also need to run a WebSocket server in a separate terminal tab with:

```bash
npm run ws-server
```
