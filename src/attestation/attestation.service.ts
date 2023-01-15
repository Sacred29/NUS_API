import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { wrapDocument } from '@govtechsg/open-attestation';
import { Web3Service } from 'src/web3/web3.service';
import fs = require('fs');
import path = require('path');
import os = require('os');
import * as util from 'util';
import { Console } from 'console';
const EthereumTx = require('ethereumjs-tx').Transaction;


@Injectable()
export class AttestationService {

    constructor(
        // @InjectModel('Documents') private readonly documentsModel: Model<any>,
        private readonly web3Service: Web3Service,
    ) { }

    async wrap(document) {
        console.log('1')
        const web3 = await this.web3Service.getWeb3();
        await this.web3Service.updateGasPrice();

        console.log('2')
        const a = JSON.stringify(process.env.DocStoreFactory);
        console.log('3', a)
        const factoryContract = new web3.eth.Contract(
            JSON.parse(process.env.DocStoreFactoryABI),
            process.env.DOCSTORE_FACTORY,
        );
        console.log('2a')
        const docStore = await factoryContract.methods.assets(process.env.WALLET_ADDR).call();
        console.log('3')
        let fullDocument = {
            ...document,
            $template: {
                name: "main",
                type: "EMBEDDED_RENDERER",
                url: "https://ephemeral-pastelito-b01b67.netlify.app"
            },
            issuers: [
                {
                    identityProof: {
                        type: 'DNS-TXT',
                        location: `${process.env.DNS}`,
                    }
                }
            ]
        }
        console.log('4')
        const folderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'foo-'));
        const filePath = `${folderPath}/Document.json`;
        const dictString = JSON.stringify(fullDocument);
        fs.writeFileSync(filePath, dictString);

        const bufferReadFile = fs.readFileSync(filePath);
        const readFile = bufferReadFile.toString();

        console.log('5')
        //wrapping document
        const wrappedDocument = wrapDocument(JSON.parse(readFile));
        const docOutput = util.inspect(wrappedDocument, { showHidden: false, depth: null });
        const wrappedDocumentInfo = JSON.stringify(wrapDocument)

        fs.writeFileSync(filePath, wrappedDocumentInfo);
        const file = Buffer.from(fs.readFileSync(filePath).toString('base64'))
        const split = `${docOutput}`.split('\n');
        const lastLine = split.length - 3;
        const extracted = split[lastLine].match(/(.{65}$)/g)[0];
        const docRoot = extracted.slice(0, -1);
        console.log('6')
        //Issue Document
        const contract = new web3.eth.Contract(JSON.parse(process.env.DocStoreABI), docStore)
        const data = await contract.methods.issue(`0x${docRoot}`).encodeABI();
        const nonce = await web3.eth.getTransactionCount(process.env.WALLET_ADDR, 'pending');

        const rawTx = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(
                (this.web3Service.gasPrice.average * (100 + parseInt(process.env.GAS_PRICE_PREMIUM_PCT))) /
                100,
            ),
            to: docStore,
            gasLimit: web3.utils.toHex(process.env.GAS_LIMIT),
            value: web3.utils.toHex(web3.utils.toWei('0')),
            data: data,
        };
        console.log('7')
        const tx = await new EthereumTx(rawTx, { chain: `${process.env.ISSUEDOC_NETWORK}` });
        tx.sign(Buffer.from(`${process.env.WALLET_PRIV}`, 'hex'));
        const serializedTx = tx.serialize();
        web3.eth
            .sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
        
            return {'docHash': `0x${docRoot}`, wrappedDocumentInfo, }
        //const wrappedDocuments = wrapDocuments(documents);
        //return wrappedDocuments;
    }


}
