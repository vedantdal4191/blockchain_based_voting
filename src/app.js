// Load the Web3 library and connect to MetaMask
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

// Load the smart contract
let election;
const contractAddress = '0x4B1ec0871D4dE447162d739F5D6326B278259A2F'; // Replace with your deployed contract address
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "candidatesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "voted",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "vote",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "registered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "registerVoter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateId",
          "type": "uint256"
        }
      ],
      "name": "getVoteCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

// Connect to MetaMask and load the contract
async function loadContract() {
  const accounts = await web3.eth.requestAccounts();
  election = new web3.eth.Contract(abi, contractAddress);

  // Load candidates from the smart contract
  const candidatesCount = await election.methods.candidatesCount().call();
  const candidatesResults = document.getElementById('candidatesResults');
  const candidatesSelect = document.getElementById('candidatesSelect');

  for (let i = 1; i <= candidatesCount; i++) {
    const candidate = await election.methods.candidates(i).call();
    
    // Add candidates to the table
    const row = candidatesResults.insertRow();
    row.innerHTML = `<td>${candidate.id}</td><td>${candidate.name}</td><td>${candidate.voteCount}</td>`;
    
    // Add candidates to the dropdown list for voting
    const option = document.createElement('option');
    option.value = candidate.id;
    option.innerHTML = candidate.name;
    candidatesSelect.appendChild(option);
  }
}

// Handle the voting process
document.getElementById('voteForm').onsubmit = async (e) => {
  e.preventDefault();

  const candidateId = document.getElementById('candidatesSelect').value;
  const accounts = await web3.eth.getAccounts();

  // Vote for the selected candidate
  await election.methods.vote(candidateId).send({ from: accounts[0] });
  alert('Vote cast successfully!');
};

// Load the contract when the page is loaded
window.addEventListener('load', () => {
  loadContract();
});
