// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    // Structure to define a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Structure to define a voter
    struct Voter {
        bool voted;
        uint vote;
        bool registered;
    }

    // Mapping to store voters
    mapping(address => Voter) public voters;

    // Mapping to store candidates
    mapping(uint => Candidate) public candidates;

    // Count of registered candidates
    uint public candidatesCount;

    // Constructor to add candidates at contract deployment
    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    // Function to add a candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function to register a voter
    function registerVoter(address voter) public {
        require(!voters[voter].registered, "Voter is already registered.");
        voters[voter].registered = true;
    }

    // Function to vote
    function vote(uint _candidateId) public {
        require(voters[msg.sender].registered, "Voter is not registered.");
        require(!voters[msg.sender].voted, "Voter has already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _candidateId;

        candidates[_candidateId].voteCount++;
    }

    // Function to get the vote count of a candidate
    function getVoteCount(uint _candidateId) public view returns (uint) {
        return candidates[_candidateId].voteCount;
    }
}
