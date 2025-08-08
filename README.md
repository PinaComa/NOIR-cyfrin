# 🧠 NOIR-cyfrin Projects

This repository contains a collection of zero-knowledge (zk) applications and circuit examples built with [Noir](https://github.com/noir-lang/noir).

Explore each project below:

---
## 🔗 Project Index

### [01_simple_circuit](./01_simple_circuit)
A basic Noir circuit demonstrating simple constraints and logic.

### [02_zk_ecdsa](./02_zk_ecdsa)
Zero-Knowledge proof system for verifying ECDSA signatures using Noir.  
Proves ownership of an Ethereum address without revealing the signature or private key.

### [03_zk_ecdsa_contract](./03_zk_ecdsa_contract)
This section creates a zero-knowledge circuit that verifies ECDSA signatures and generates a Solidity smart contract for on-chain verification. The circuit proves knowledge of a valid ECDSA signature that recovers to a specific Ethereum address without revealing the signature itself.


---

Each folder contains its own `README.md` file with more details. Click on a project to dive deeper.



---

# Noir ECDSA ZK Verification - Complete Summary

## Overview
This comprehensive guide covers verifying ECDSA signatures on-chain using Zero-Knowledge Proofs (ZKPs) with the Noir programming language. The system enables private signature verification where the proof of valid signature can be verified on-chain without revealing the signature itself.

## Key Concepts

### Noir Fundamentals
- **Dependencies**: External libraries (e.g., `dep::ecrecover`) for cryptographic operations
- **Array Types**: Fixed-size arrays with explicit typing (e.g., `[u8; 32]` for 32-byte arrays)
- **Deterministic Circuits**: Fixed input sizes required for ZK circuit determinism

### Off-Chain vs On-Chain Operations
- **Off-Chain**: Circuit development, proof generation (computationally intensive)
- **On-Chain**: Proof verification via smart contracts (efficient and cheap)

## ECDSA Verification Workflow

### 1. Public Key Handling
- Extract public key from development environment (e.g., Foundry keystore)
- Decompose into X and Y coordinates for separate circuit inputs
- Convert to proper format for Noir circuit consumption

### 2. Input Preparation
- Format cryptographic data into `u8` arrays of fixed sizes
- Use external scripts (JavaScript/TypeScript) for data conversion
- Configure inputs via `Prover.toml` for proof generation

### 3. Noir Circuit Implementation (`main.nr`)

```rust
use dep::ecrecover;

fn main(
    pub_key_x: [u8; 32],        // Public key X coordinate (private input)
    pub_key_y: [u8; 32],        // Public key Y coordinate (private input)
    signature: [u8; 64],         // ECDSA signature r,s values (private input)
    hashed_message: [u8; 32],    // Message hash (private input)
    expected_address: Field      // Expected Ethereum address (public input)
) {
    // Recover Ethereum address from signature components
    let recovered_address: Field = ecrecover::ecrecover(
        pub_key_x, 
        pub_key_y, 
        signature, 
        hashed_message
    );
    
    // Cryptographically prove signature validity
    assert(
        recovered_address == expected_address, 
        "Address does not match expected address"
    );
}
```

#### Circuit Inputs Specification
- **Private Inputs** (hidden from verifier):
  - `pub_key_x`: 32-byte X-coordinate of public key
  - `pub_key_y`: 32-byte Y-coordinate of public key
  - `signature`: 64-byte ECDSA signature (r and s components)
  - `hashed_message`: 32-byte message hash
- **Public Input** (visible to verifier):
  - `expected_address`: Ethereum address for verification

### 4. Proof Generation and Verification
- **Off-Chain Proof Generation**: Create ZK proof using circuit and inputs
- **Optional Off-Chain Verification**: Test proof validity before on-chain submission
- **On-Chain Verification**: Submit proof to deployed Verifier contract

## Smart Contract Integration

### Circuit Compilation
- Noir circuit compiles to `Verifier.sol` smart contract
- Contains embedded cryptographic verification logic
- Enables efficient on-chain proof verification

### Verifier Contract Interface
```solidity
contract HonkVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public view returns (bool);
}
```

## Complete Development Workflow

### Phase 1: Setup and Compilation
1. **Initialize Project**: `nargo init`
2. **Compile Circuit**: `nargo compile` → generates bytecode
3. **Generate Verification Key**: `bb write_vk --oracle_hash keccak`
4. **Generate Solidity Contract**: `bb write_solidity_verifier`

### Phase 2: Deployment and Integration
1. **Deploy Verifier Contract** to target blockchain
2. **Integrate Contract Address** into DApp
3. **Implement Proof Generation** in application logic
4. **Submit Proofs** for on-chain verification

### Phase 3: Production Usage
```solidity
// Example DApp integration
bool isValid = verifier.verify(proofBytes, [expectedAddress]);
require(isValid, "Invalid signature proof");
```

## Key Development Insights

### Performance Considerations
- **Off-chain operations** are computationally intensive but flexible
- **On-chain verification** optimized for gas efficiency using Keccak
- **Proof size** significantly smaller than original signature data

### Security Best Practices
1. **Never expose private inputs** in production environments
2. **Use unique message hashes** for each proof to prevent replay attacks
3. **Verify generated contracts** before deployment
4. **Implement proper access controls** in consuming smart contracts

### Architecture Benefits
- **Privacy Preservation**: Prove signature validity without revealing signature
- **Scalability**: Efficient on-chain verification of complex computations
- **Trustless Verification**: No need for trusted third parties
- **Composability**: Verifier contracts can be integrated into larger systems

## Use Cases and Applications

### Core Applications
- **Anonymous Authentication**: Prove address ownership without transaction history
- **Privacy-Preserving Identity**: Verify claims without exposing signatures
- **Selective Disclosure**: Prove specific attributes without revealing underlying data
- **ZK Login Systems**: Authenticate users without storing sensitive data

### Advanced Protocols
- **Private Voting Systems**: Prove eligibility without revealing identity
- **Confidential Transactions**: Verify transaction validity privately
- **Zero-Knowledge Identity**: Build privacy-first authentication systems
- **Compliance Proofs**: Demonstrate regulatory compliance without data exposure

## Development Tools and Dependencies

### Required Tools
- **Noir/Nargo**: Circuit development and compilation
- **Barretenberg (bb)**: Proof generation and verification key creation
- **Solidity Compiler**: Smart contract compilation and deployment

### Key Dependencies
- **ecrecover**: ECDSA signature recovery for Noir
- **keccak256**: Hashing function for gas optimization

## Best Practices for Production

### Circuit Design
- Keep circuits simple and well-tested
- Use established cryptographic primitives
- Implement comprehensive input validation
- Document all assumptions and constraints

### Integration Patterns
- Separate proof generation from verification logic
- Implement proper error handling for failed proofs
- Use events for proof verification tracking
- Consider upgradeability patterns for verifier contracts

### Testing Strategy
- Unit test individual circuit components
- Integration test full proof generation workflow
- Gas optimization testing for on-chain operations
- Security audit for production deployments

## Future Considerations

### Scalability Enhancements
- Batch proof verification for multiple signatures
- Recursive proof composition for complex workflows
- Layer 2 integration for reduced verification costs

### Advanced Features
- Multi-signature ZK verification
- Time-locked proof systems
- Cross-chain proof portability
- Dynamic circuit parameter updates

## Conclusion

The integration of Noir ZK circuits with on-chain smart contracts creates a powerful paradigm for building privacy-preserving applications on blockchain networks. This approach enables:

- **Verifiable Private Computation**: Prove knowledge without revealing sensitive data
- **Blockchain Integration**: Seamless connection between private proofs and public verification
- **Practical Applications**: Real-world use cases in authentication, identity, and compliance

By mastering these concepts, developers can build sophisticated protocols that leverage the transparency of blockchain while preserving the privacy of sensitive computations, opening new possibilities for decentralized applications that respect user privacy while maintaining trustless verification.

(by Claude.ai :)