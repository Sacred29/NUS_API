import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { wrapDocuments, wrapDocument, v2 } from '@govtechsg/open-attestation';
//import {wrap} from '@govtechsg/open-attestation-cli'
import { Web3Service } from 'src/web3/web3.service';
import fs = require('fs');
import path = require('path');
import os = require('os');
import * as util from 'util';
import { Console } from 'console';
import { json } from 'stream/consumers';
import { deploy } from '@govtechsg/document-store';
const EthereumTx = require('ethereumjs-tx').Transaction;


@Injectable()
export class AttestationService {

    constructor(
        @InjectModel('Documents') private readonly docModel: Model<any>,
        private readonly web3Service: Web3Service,
    ) { }

    async wrap(document) {
        console.log('1')
        const web3 = await this.web3Service.getWeb3();
        await this.web3Service.updateGasPrice();


        const a = JSON.parse(process.env.DocStoreFactoryABI);

        const factoryContract = new web3.eth.Contract(
            JSON.parse(process.env.DocStoreFactoryABI),
            process.env.DOCSTORE_FACTORY,
        );

        const docStore = await factoryContract.methods.assets(process.env.WALLET_ADDR).call();

        const fullDocument = {

            $template: {
                name: "main",
                type: "EMBEDDED_RENDERER",
                url: "https://ephemeral-pastelito-b01b67.netlify.app",
            },

            issuers: [
                {
                    documentStore: `${docStore}`,
                    name: 'Panda Bank',
                    identityProof: {
                        type: "DNS-TXT",
                        location: `${process.env.DNS}`,
                    }
                }
            ]
            ,
            ...document
        }

        //wrapper
        const wrappedDoc = wrapDocument(fullDocument);




        // console.log('4')
        // const folderPath = fs.mkdtempSync(path.join(os.tmpdir(), 'foo-'));
        // const filePath = `${folderPath}/Document.json`;
        // const dictString = JSON.stringify(fullDocument);
        // fs.writeFileSync(filePath, dictString);

        // const bufferReadFile = fs.readFileSync(filePath);
        // const readFile = bufferReadFile.toString();

        // console.log('5')
        // //wrapping document
        // const wrappedDocument = wrapDocument(JSON.parse(readFile));
        // console.log('51')
        // const docOutput = util.inspect(wrappedDocument, { showHidden: false, depth: null });
        // console.log('52')
        // const wrappedDocumentInfo = JSON.stringify(wrapDocument)
        // console.log('53')
        // fs.writeFileSync(filePath, wrappedDocumentInfo);
        // const file = Buffer.from(fs.readFileSync(filePath).toString('base64'))
        // const split = `${docOutput}`.split('\n');
        // const lastLine = split.length - 3;
        // const extracted = split[lastLine].match(/(.{65}$)/g)[0];
        // const docRoot = extracted.slice(0, -1);



        //Issue Document
        const docRoot = wrappedDoc.signature.merkleRoot
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

        const tx = await new EthereumTx(rawTx, { chain: `${process.env.ISSUEDOC_NETWORK}` });
        tx.sign(Buffer.from(`${process.env.WALLET_PRIV}`, 'hex'));
    
        const serializedTx = tx.serialize();

        
        web3.eth
            .sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', console.log);
        

        //save into db
        const docDB = new this.docModel({
            docRoot: `0x${docRoot}`,
            wrappedDoc: JSON.stringify(wrappedDoc)
        })
        await docDB.save()
        // finalize signing
       

        return { 'docHash': `0x${docRoot}`, wrappedDoc }

    }

    async getWrappedDoc(docRoot) {
        return await this.docModel.findOne({ docRoot }, { wrappedDoc: 1 });
    }

    async deploy() {
        const web3 = await this.web3Service.getWeb3();
        await this.web3Service.updateGasPrice();
        const contract = new web3.eth.Contract(
            JSON.parse(process.env.DocStoreFactoryABI),
            process.env.DOCSTORE_FACTORY,
        );
        const data = await contract.methods.deployDocStore(`Jeff`).encodeABI();
        const nonce1 = await web3.eth.getTransactionCount(process.env.WALLET_ADDR, 'pending');

        const rawDocStoreTx = {
            nonce: web3.utils.toHex(nonce1),
            gasPrice: web3.utils.toHex(
                (this.web3Service.gasPrice.average * (100 + parseInt(process.env.GAS_PRICE_PREMIUM_PCT))) /
                100,
            ),
            to: process.env.DOCSTORE_FACTORY,
            gasLimit: web3.utils.toHex(process.env.GAS_LIMIT_DOCSTORE),
            value: web3.utils.toHex(web3.utils.toWei('0')),
            data: data,
        };


        const docStoreTx = await new EthereumTx(rawDocStoreTx, { chain: `${this.web3Service.net}` });
        docStoreTx.sign(Buffer.from(`${process.env.WALLET_PRIV}`, 'hex'));
        const docStoreSerialize = docStoreTx.serialize();
        await web3.eth
            .sendSignedTransaction('0x' + docStoreSerialize.toString('hex'))
            .on('receipt', console.log);

    }

}
