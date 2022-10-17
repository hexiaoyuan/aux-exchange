import { parseMarketType } from "../src/clob/core/query";
import { parsePoolType } from "../src/amm/core/query";
import { AuxClient, FakeCoin, Network } from "../src/client";

async function main() {
  const auxClient =
    process.env["APTOS_LOCAL"] === "true"
      ? AuxClient.createFromEnvForTesting({})[0]
      : AuxClient.create({
          network: Network.Devnet,
          validatorAddress: "https://fullnode.devnet.aptoslabs.com/v1",
        });

  const moduleAddress = auxClient.moduleAddress;
  const resources = await auxClient.aptosClient.getAccountResources(
    auxClient.moduleAddress
  );
  const pools = [];
  const markets = [];
  const coinInfos = [];
  for (const resource of resources) {
    if (resource.type.includes("Pool")) {
      pools.push(parsePoolType(resource.type));
    } else if (resource.type.includes("Market")) {
      markets.push(parseMarketType(resource.type));
    } else if (
      resource.type.includes("CoinInfo") &&
      !resource.type.includes("LP")
    ) {
      coinInfos.push(resource.type);
    }
  }
  const metadata = {
    moduleAddress,
    pools,
    markets,
    coinInfos,
  };
  metadata;
  console.log("=== GraphQL Variables ===");
  const btc = auxClient.getWrappedFakeCoinType(FakeCoin.BTC);
  const eth = auxClient.getWrappedFakeCoinType(FakeCoin.ETH);
  const usdc = auxClient.getWrappedFakeCoinType(FakeCoin.USDC);
  const btcUsdcPool = {
    coinTypeX: btc,
    coinTypeY: usdc,
  };
  const ethUsdcPool = {
    coinTypeX: eth,
    coinTypeY: usdc,
  };
  const btcUsdcMarket = {
    baseCoinType: btc,
    quoteCoinType: usdc,
  };
  const ethUsdcMarket = {
    baseCoinType: eth,
    quoteCoinType: usdc,
  };
  console.log(
    JSON.stringify(
      {
        owner:
          "0x767b7442b8547fa5cf50989b9b761760ca6687b83d1c23d3589a5ac8acb50639",
        btc,
        eth,
        usdc,
        btcUsdcPool,
        ethUsdcPool,
        btcUsdcMarket,
        ethUsdcMarket,
        addLiquidityInput: {
          amountX: 1,
          amountY: 1300,
          poolInput: {
            coinTypeX: eth,
            coinTypeY: usdc,
          },
        },
      },
      undefined,
      4
    )
  );
  console.log(
    JSON.stringify({
      poolInput: ethUsdcPool,
    })
  );
  console.log(
    JSON.stringify({
      marketInput: ethUsdcPool,
    })
  );
}

main();
