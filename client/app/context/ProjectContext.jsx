// ProjectContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import {
  useContract,
  useAddress,
  useConnectionStatus,
} from "@thirdweb-dev/react";

// Create a context
const ProjectContext = createContext(null);

export function ProjectProvider({ children, contractAddress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get user's wallet address
  const address = useAddress();
  const connectionStatus = useConnectionStatus();

  // Get contract instance
  const { contract } = useContract(contractAddress);

  // Get transaction function
  const {
    mutate: sendTransaction,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useSendTransaction();

  // Update loading and error states when transaction state changes
  useEffect(() => {
    setIsLoading(isTransactionLoading);
    if (transactionError) {
      setError(transactionError.message || "Transaction failed");
    }
  }, [isTransactionLoading, transactionError]);

  // Function to submit a project to the blockchain
  const submitProject = async (projectData) => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTransactionStatus("Preparing transaction...");
      setIsSuccess(false);

      // Format the team members array for the contract
      const formattedTeam = projectData.team.map((member) => ({
        member: member.member,
        role: member.role,
      }));

      // Prepare transaction
      const transaction = prepareContractCall({
        contract,
        method:
          "function createProject(address _owner, string _title, string _description, string _image, (address member, string role)[] _team, uint256 _target, uint256 _deadline) returns (uint256)",
        params: [
          address, // Owner (current connected wallet)
          projectData.title,
          projectData.description,
          projectData.image,
          formattedTeam,
          projectData.target * 10 ** 18, // Convert ETH to wei
          Math.floor(projectData.deadline), // Ensure deadline is an integer
        ],
      });

      setTransactionStatus("Sending transaction...");

      // Send transaction
      await sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Transaction successful:", result);
          setTransactionStatus("Transaction successful!");
          setIsSuccess(true);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("Transaction error:", error);
          setError(error.message || "Transaction failed");
          setTransactionStatus("Transaction failed");
          setIsLoading(false);
        },
      });
    } catch (err) {
      console.error("Error submitting project:", err);
      setError(err.message || "Failed to submit project");
      setTransactionStatus("Transaction failed");
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    submitProject,
    isLoading,
    error,
    transactionStatus,
    isSuccess,
    walletAddress: address,
    isConnected: connectionStatus === "connected",
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

// Custom hook to use the context
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
