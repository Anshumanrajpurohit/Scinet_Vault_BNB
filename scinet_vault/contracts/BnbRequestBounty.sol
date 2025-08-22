// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Ownable contract for ownership management
abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// Main contract inherits Ownable for ownership management
contract BnbRequestBounty is Ownable {
    struct Upload {
        address uploader;
        string fileHash;
        bool approved;
        bool exists;
    }

    struct Request {
        address requester;
        uint256 bounty;
        bool isOpen;
        address approvedUploader;
        mapping(address => Upload) uploads;
        address[] uploaders;
    }

    mapping(uint256 => Request) private requests;
    uint256 private requestCount;

    event RequestCreated(uint256 indexed requestId, address indexed requester, uint256 bounty);
    event FileUploaded(uint256 indexed requestId, address indexed uploader, string fileHash);
    event FileApproved(uint256 indexed requestId, address indexed uploader);
    event FileRejected(uint256 indexed requestId, address indexed uploader);
    event BountyPaid(uint256 indexed requestId, address indexed uploader, uint256 amount);

    // Create a new bounty request; bounty is sent as msg.value
    function createRequest() external payable returns (uint256) {
        require(msg.value > 0, "Bounty must be > 0");

        requestCount++;
        Request storage r = requests[requestCount];
        r.requester = msg.sender;
        r.bounty = msg.value;
        r.isOpen = true;

        emit RequestCreated(requestCount, msg.sender, msg.value);
        return requestCount;
    }

    // Upload a file hash to an open request; requester cannot upload
    function uploadFile(uint256 requestId, string calldata fileHash) external {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        Request storage r = requests[requestId];
        require(r.isOpen, "Request closed");
        require(msg.sender != r.requester, "Requester cannot upload");
        require(!r.uploads[msg.sender].exists, "Upload exists");

        r.uploads[msg.sender] = Upload({
            uploader: msg.sender,
            fileHash: fileHash,
            approved: false,
            exists: true
        });
        r.uploaders.push(msg.sender);

        emit FileUploaded(requestId, msg.sender, fileHash);
    }

    // Requester approves a specific upload, paying bounty to uploader
    function approveUpload(uint256 requestId, address uploader) external {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        Request storage r = requests[requestId];
        require(r.isOpen, "Request closed");
        require(msg.sender == r.requester, "Only requester");
        require(r.uploads[uploader].exists, "Upload missing");
        require(!r.uploads[uploader].approved, "Already approved");

        r.uploads[uploader].approved = true;
        r.approvedUploader = uploader;
        r.isOpen = false;

        (bool sent, ) = payable(uploader).call{value: r.bounty}("");
        require(sent, "Bounty transfer failed");

        emit FileApproved(requestId, uploader);
        emit BountyPaid(requestId, uploader, r.bounty);
    }

    // Requester rejects an upload; upload cleared
    function rejectUpload(uint256 requestId, address uploader) external {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        Request storage r = requests[requestId];
        require(r.isOpen, "Request closed");
        require(msg.sender == r.requester, "Only requester");
        require(r.uploads[uploader].exists, "Upload missing");
        require(!r.uploads[uploader].approved, "Cannot reject approved");

        delete r.uploads[uploader];

        emit FileRejected(requestId, uploader);
    }

    // Owner-only function example: emergency pause (as a usage demo)
    bool public paused;

    function pauseContract() external onlyOwner {
        paused = true;
    }

    function unpauseContract() external onlyOwner {
        paused = false;
    }

    // Modified upload with pause check
    function uploadFilePaused(uint256 requestId, string calldata fileHash) external {
        require(!paused, "Contract is paused");
        uploadFile(requestId, fileHash);
    }

    function getUploaders(uint256 requestId) external view returns (address[] memory) {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        return requests[requestId].uploaders;
    }

    function getUpload(uint256 requestId, address uploader) external view returns (string memory, bool) {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        Upload storage u = requests[requestId].uploads[uploader];
        require(u.exists, "Upload missing");
        return (u.fileHash, u.approved);
    }

    function getRequestInfo(uint256 requestId) external view returns (address, uint256, bool, address) {
        require(requestId > 0 && requestId <= requestCount, "Invalid request");
        Request storage r = requests[requestId];
        return (r.requester, r.bounty, r.isOpen, r.approvedUploader);
    }

    // Accept BNB sent to contract fallback
    receive() external payable {}
}
