
export const State = Object.freeze({
  NotConn: 0,
  Connecting: 1,
  Connected: 3,
  Error: 4,
  WrongKey: 5,
});

export const APIKeyErrorCode = -32800;

export class Conn {
  constructor(connectedCb, rpcAddr = null, apiKey = null) {
    this.rpcAddr = rpcAddr;
    this.apiKey = apiKey;
    this.connectedCb = connectedCb;
    this.syncTicker = null;
    this.state = State.Connected;
    this.errorMessage = "";
    this.syncState = {
      syncing: false,
      currentBlock: 0,
      highestBlock: 0,
      wrongTime: false,
      peers: 5,
    };
  }

  async start() {
    this.state = State.Connecting;
    this.last_id = 0;
    try {
      await this.updateSyncState();
    } catch (e) {
      if (e.code === APIKeyErrorCode) {
        this.state = State.WrongKey;
        return;
      } else {
        this.state = State.Error;
        this.errorMessage = e.message;
        throw e;
      }
    }
    if (this.syncTicker !== null) {
      clearInterval(this.syncTicker);
    }
    this.state = State.Connected;
    this.connectedCb();
  }

  stop() {
    this.state = State.NotConn;
  }

  async getIdentity(address) {
    return await this.call("dna_identity", [address]);
  }

  async getPendingTx(address) {
    return await this.call("bcn_pendingTransactions", [address]);
  }

  async getEpoch() {
    return await this.call("dna_epoch");
  }

  async getBalance(address) {
    return await this.call("dna_getBalance", [address]);
  }

  async getTxReceipt(txHash) {
    return await this.call("bcn_txReceipt", [txHash]);
  }

  async call(method, params = [], full = false) {
    const id = ++this.last_id;
    console.log("calling", method);
    const req = await fetch(this.rpcAddr, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method,
        params,
        id,
        key: this.apiKey,
      }),
    }).catch();

    const resp = await req.json();
    console.log("got resp", resp);

    if (resp.error) {
      throw resp.error;
    }
    if (full) {
      return resp;
    } else {
      return resp.result;
    }
  }
}
