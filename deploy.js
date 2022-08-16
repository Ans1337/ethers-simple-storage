const ethers = require("ethers")
const fs = require("fs-extra")

require("dotenv").config()

async function main() {
    //complile them in our code
    //compile them seperately
    //http://127.0.0.1:7545

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

    console.log("Deplaying the contract ... wait ...")

    const contract = await contractFactory.deploy() // (await ) => stop here wait for the contract to deplay
    await contract.deployTransaction.wait(1)

    console.log(`Contract Address : ${contract.address}`)

    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number : ${currentFavoriteNumber.toString()}`)

    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)

    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated Favorite Number : ${updatedFavoriteNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
