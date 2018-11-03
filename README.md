# Build

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

# When committing

Use "npx git-cz" or "npm run cz" instead of "git commit"

# When moving to prod

Make sure the following is changed from:
1. `firebaseinit-dev` to `firebaseinit`
2. `this.$store.state.web3.networkId !== "3"` to `this.$store.state.web3.networkId !== "1"`
3. `trackingId` and `token` in main.js file has dev commented out and prod keys not

