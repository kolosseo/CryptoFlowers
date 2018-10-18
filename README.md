# Crypto Flowers

### Just a fun free time project to play a little with code and D3 libraries.

Consider this:
- The D3 visualizator comes from [this](https://github.com/kolosseo/CodeFlower) personal fork of [CodeFlower](https://github.com/fzaninotto/CodeFlower)
- Data are real time and provided by [blockchain.info](https://blockchain.info/) via websockets .
- Mouse over any "ball" to see its respective TX number.
- The bigger the ball, the more bitcoins are involved with it.
- Every ball has many smaller children balls, they are its input TX's.
- Every 30 transactions, the flower get renewed to avoid putting too much weight on the user browser.
- Click the "disconnect/connect" button to close/open the websocket flow.
- Demo actually available [here](https://flowers.jacopo.im)

Feel free to play with it, the code is available <a target="_blank" href="https://github.com/kolosseo/CryptoFlowers">here</a>.
