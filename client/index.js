import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        //new metamask
        if(typeof window.ethereum !== 'undefined'){
            const web3 = new Web3(window.ethereum);
            window.ethereum.enable()
                .then(() => {
                    resolve(new Web3(window.ethereum));
                })
                .catch(e => {
                    reject(e);
                });
                return;
        }
        //old metamask
        if(typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        // if no metamask use truffle develop (ganache cli) directly
        resolve(new Web3('http://localhost:9545'));
    });
};

const initContract = () => {
    const deploymentKey = Object.keys(Crud.networks)[0];
    return new web3.eth.Contract(
        Crud.abi,
        Crud.networks[deploymentKey].address
    );
};

const initApp = () => {
    const $create = document.getElementsById('create');
    const $createResult = document.getElementById('create-result');

    const $read = document.getElementsById('read');
    const $readResult = document.getElementById('read-result');

    const $edit = document.getElementsById('edit');
    const $editResult = document.getElementById('edit-result');

    const $delete = document.getElementsById('delete');
    const $deleteResult = document.getElementById('delete-result');

    let account = [];
    web3.eth.getAccounts()
        .then(_accounts => {
            accounts = _accounts;
        });

    $create.addEventListener('submit', e => {
        e.preventDefault();
        const name = e.target.elements[0].value;
        crud.methods.create(name).send({from: accounts[0]})
        .then(() => {
            $createResult.innerHTML = `New user ${name} was successfully created!`
        })
        .catch(() => {
            $createResult.innerHTML = `There was an error when creating new user!`
        })
    });

    $read.addEventListener('submit', e => {
        e.preventDefault();
        
        const id = e.target.elements[0].value;
        crud.methods
            .read(id)
            .call()
            .then(result => {
                $readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]}`
            })
            .catch(() => {
                $readResult.innerHTML = `There was an error reading the user with id: ${id} `;
            });
    });

    $edit.addEventListener('submit', e => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;

        crud.methods.update(id, name).send({from: accounts[0]})
        .then(() => {
            $editResult.innerHTML = `The user with id: ${id} was changed to: ${name}`;
        })
        .catch(() => {
            $editResult.innerHTML = `There was an error when updating  user!`;
        })
    });

    $delete.addEventListener('submit', e => {
        e.preventDefault();
        const id = e.target.elements[0].value;

        crud.methods.delete(id).send({from: accounts[0]})
        .then(() => {
            $deleteResult.innerHTML = `The user with id: ${id} was deleted`;
        })
        .catch(() => {
            $deleteResult.innerHTML = `There was an error when deleting user with id: ${id}`;
        })
    });
};

// set the value to main variables and initialize application
document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3;
            crud = initContract();
            initApp();
        })
        .catch(e => console.log(e.message));
})