const EthCrypto = require('eth-crypto');
const secp256k1 = require('secp256k1');
const SHA3      = require('keccakjs');
const readline  = require('readline-sync');

let generatePublicKey = (privateKey) => {
    let private_key = new Buffer(privateKey, "hex");
    let public_key  = secp256k1.publicKeyCreate(private_key, false);
    
    return public_key.toString('hex'); 
}

let generateAddress = (pubKeyHex) => {
    let pubKeyBuf   = new Buffer(pubKeyHex, 'hex')
    let h           = new SHA3(256)
    h.update(pubKeyBuf.slice(1));

    let address = h.digest('hex').slice(-40);

    return address;
}

let encryptData = async (message, publicKey) => {
	try{
        const encrypted = await EthCrypto.encryptWithPublicKey(
            publicKey,
            JSON.stringify(message)
        );

        return encrypted;
	}
	catch(error){
		console.log(error);
	}
}

let decryptData = async (encrypted, privateKey) => {
    try{
        const decrypted = await EthCrypto.decryptWithPrivateKey(
            privateKey,
            encrypted
        );

        return decrypted.substr(1).slice(0, -1);
    }
    catch(error){
        console.log(error);
    }
}

let test = async (privateKey, publicKey) => {
    try{
        let message         = "Some sample message";
        let encryptedMsg    = await encryptData(message, publicKey);
        let decryptedMsg    = await decryptData(encryptedMsg, privateKey);

        //console.log(decryptedMsg);
        console.log("Original Message  : " + message);
        console.log("Decrypted Message : " + decryptedMsg);
        if(message === decryptedMsg) {
            console.log("Original message and decrypted message both are same");
        }
    }
    catch(error){
        console.log(error);
    }

}

let privateKey  = readline.question("Enter private key ");
let publicKey   = generatePublicKey(privateKey);
let address     = generateAddress(publicKey);
console.log("-------------------------------------------");
console.log("Following is the generated public Key");
console.log(publicKey);
console.log("-------------------------------------------");
console.log("Following is the generated address");
console.log(address);
console.log("-------------------------------------------");
publicKey       = publicKey.substring(2);
privateKey      = "0x" + privateKey;


test(privateKey, publicKey);
