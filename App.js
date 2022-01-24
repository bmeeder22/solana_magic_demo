import React, {useState, useMemo, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {Magic} from '@magic-sdk/react-native';
import {SolanaExtension} from '@magic-ext/solana';
import * as web3 from "@solana/web3.js";

const rpcUrl = 'https://api.devnet.solana.com';

export const magic = new Magic('pk_live_19EA833CD6BEB4E4', {
    extensions: [
        new SolanaExtension({
            rpcUrl,
        }),
    ],
});

export default function App() {
  const [destinationAddress, setDestinationAddress] = useState('BDbksKYryFU4qf6DyHRTQwB9S8R2uYQbWJ2WRY1yAVYZ');
  const [address, setAddress] = useState('');

  useEffect(() => {
      magic.user.getMetadata().then(metadata => {
          setAddress(metadata.publicAddress);
      });
  }, []);

  async function login() {
      const email = 'throw.away5112@gmail.com';
      await magic.auth.loginWithMagicLink({ email });
  }

  async function onSend() {
      try {
          console.log('start');
          const metadata = await magic.user.getMetadata();
          const recipientPubKey = new web3.PublicKey(destinationAddress);
          const payer = new web3.PublicKey(metadata.publicAddress);
          const connection = new web3.Connection(rpcUrl);

          const hash = await connection.getRecentBlockhash();

          let transactionMagic = new web3.Transaction({
              feePayer: payer,
              recentBlockhash: hash.blockhash
          });

          const transaction = web3.SystemProgram.transfer({
              fromPubkey: payer,
              toPubkey: recipientPubKey,
              lamports: 1000000,
          });

          transactionMagic.add(...([transaction]));

          const serializeConfig = {
              requireAllSignatures: false,
              verifySignatures: true
          };

          console.log({transaction});
          const signedTransaction = (await magic.solana.signTransaction(transactionMagic, serializeConfig)).rawTransaction;
          console.log({signedTransaction});
          const signature = await connection.sendRawTransaction(signedTransaction);
          console.log({signature});
      } catch(e) {
          console.log(e);
      }

  }

  return (
    <View style={styles.container}>
        <magic.Relayer />
        <Text>Your address: {address}</Text>
        <Button
            onPress={login}
            title="Login"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
        <TextInput
            style={styles.input}
            onChangeText={setDestinationAddress}
            value={destinationAddress}
        />
        <Button
            onPress={() => {
                console.log('AHHHH');
                onSend();
            }}
            title="Send SOL"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
