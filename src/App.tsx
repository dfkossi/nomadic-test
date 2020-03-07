import React, { useState } from "react";
import { Tezos } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/babylon-wallet";

const App: React.FC = () => {
 
  const { register, handleSubmit } = useForm();
  const [txnAmount, setTxnAmount] = useState(0);
  const [txnAddress, setTxnAddress] = useState("");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);
  Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/babylonnet' });

  const onSquare = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    setTxnAmount(parseInt(data.firstNumber, 10));
    setTxnAddress(data.address);
    showSnackbar(true);


    const txn = Tezos.contract
      .at('KT1AyrqPRAgSMopSnxaT2pFUb2hM66U2pKZe')
      .then(contract => {

        contract.methods.square(parseInt(data.firstNumber)).send();
        return contract.storage().then(
          response => {
            const test = JSON.stringify(response)
            console.log(test);
          }
        )
      })
      .catch(error => setError(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    return txn;
  };

  const onMultiply = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    setTxnAmount(parseInt(data.firstNumber, 10));
    setTxnAmount(parseInt(data.seconNumber, 10));
    setTxnAmount(parseInt(data.thirdNumber, 10));
    setTxnAddress(data.address);
    showSnackbar(true);

    const txn = Tezos.contract
      .at('KT1AyrqPRAgSMopSnxaT2pFUb2hM66U2pKZe')
      .then(contract => {

        contract.methods.multiply(parseInt(data.firstNumber), parseInt(data.secondNumber), parseInt(data.thirdNumber)).send();
        return contract.storage().then(
          response => {
            const test = JSON.stringify(response)
            console.log(test);
          }
        )
      })
      .catch(error => setError(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    return txn;
  };

  const onAddition = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    setTxnAmount(parseInt(data.firstNumber, 10));
    setTxnAmount(parseInt(data.secondNumber, 10));
    setTxnAddress(data.address);
    showSnackbar(true);

    const txn = Tezos.contract
      .at('KT1AyrqPRAgSMopSnxaT2pFUb2hM66U2pKZe')
      .then(contract => {

        contract.methods.addition(parseInt(data.numberOne), parseInt(data.numberTwo)).send();
        return contract.storage().then(
          response => {
            const test = JSON.stringify(response)
            console.log(test);
          }
        )
      })
      .catch(error => setError(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    return txn;
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };
  
  return (
    <div>

      <div id="wallet">
        <h1>Babylonnet Tests</h1>

        {txnAddress && txnAmount ? (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
              {txnAmount && txnAddress ? (
                <>
                  Sending {txnAmount} to {txnAddress}
                  <a target="_blank" href={`https://babylonnet.tzstats.com/${txnAddress}`} rel="noopener noreferrer">
                    View on TzStats
                  </a>
                </>
              ) : null}
            </MuiAlert>
          </Snackbar>
        ) : null}

        {error && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="warning">
              {error}
            </MuiAlert>
          </Snackbar>
        )}

        <div id="dialog">
          <div id="content">
            <div id="balance-form">
              <h1>EntryPoints</h1>
              <form >
                <br />
                <input placeholder="First Value" id="address-input" name="firstNumber" ref={register} />
                <input placeholder="Second Value" id="address-input" name="secondNumber" ref={register} />
                <input placeholder="Third Value" id="address-input" name="thirdNumber" ref={register} />
                <button onClick={handleSubmit(onAddition)}>Addition</button>
                <button onClick={handleSubmit(onSquare)}>Square</button>
                <button onClick={handleSubmit(onMultiply)}>Multiply</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
