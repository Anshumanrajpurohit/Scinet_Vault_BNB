// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBnbRequestBounty {
    event RequestCreated(uint256 indexed requestId, address indexed requester, uint256 bounty);
    event FileUploaded(uint256 indexed requestId, address indexed uploader, string fileHash);
    event FileApproved(uint256 indexed requestId, address indexed uploader);
    event FileRejected(uint256 indexed requestId, address indexed uploader);
    event BountyPaid(uint256 indexed requestId, address indexed uploader, uint256 amount);

    function createRequest() external payable returns (uint256);
    function uploadFile(uint256 requestId, string calldata fileHash) external;
    function approveUpload(uint256 requestId, address uploader) external;
    function rejectUpload(uint256 requestId, address uploader) external;
    function getUploaders(uint256 requestId) external view returns (address[] memory);
    function getUpload(uint256 requestId, address uploader) external view returns (string memory fileHash, bool approved);
    function getRequestInfo(uint256 requestId) external view returns (address requester, uint256 bounty, bool isOpen, address approvedUploader);
}
