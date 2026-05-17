declare module "midtrans-client" {
  class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    charge(params: Record<string, unknown>): Promise<unknown>;
    approve(transactionId: string): Promise<unknown>;
    deny(transactionId: string): Promise<unknown>;
    cancel(transactionId: string): Promise<unknown>;
    expireTransaction(transactionId: string): Promise<unknown>;
    transactionStatus(transactionId: string): Promise<unknown>;
  }

  const midtransClient: {
    CoreApi: typeof CoreApi;
    Snap?: unknown;
  };

  export default midtransClient;
}
