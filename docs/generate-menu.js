name: Generate Dynamic Dashboard

on:
  push:
    branches:
      - main # Change this to master if your default git branch is named master

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Run Dashboard Indexer Script
        run: node generate-menu.js

      - name: Commit and Push Updated index.html
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "Automated update of index.html links structure [skip ci]"
          file_pattern: 'index.html'
