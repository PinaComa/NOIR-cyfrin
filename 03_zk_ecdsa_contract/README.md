# ZK-ECDSA Smart Contract Verifier

A Zero-Knowledge proof system for ECDSA signature verification with on-chain Solidity verifier. This project demonstrates how to generate ZK proofs for ECDSA signatures and verify them on-chain without revealing the signature data.

## Overview

This project creates a zero-knowledge circuit that verifies ECDSA signatures and generates a Solidity smart contract for on-chain verification. The circuit proves knowledge of a valid ECDSA signature that recovers to a specific Ethereum address without revealing the signature itself.

## Project Structure

```
03_zk_ecdsa_contract/
├── src/
│   └── main.nr              # Main Noir circuit for ECDSA verification
├── target/
│   ├── 03_zk_ecdsa_contract.json  # Compiled circuit bytecode
│   ├── Verifier.sol         # Generated Solidity verifier contract
│   └── vk                   # Verification key for on-chain use
├── Nargo.toml              # Project configuration
└── README.md               # This file
```

## Dependencies

- **ecrecover**: ECDSA signature recovery implementation for Noir
- **keccak256**: Keccak256 hashing function

## Prerequisites

- [Noir/Nargo](https://noir-lang.org/docs/getting_started/installation/)
- [Barretenberg (bb)](https://noir-lang.org/docs/getting_started/installation/#option-2-compile-noir-from-source)

## Circuit Logic

The main circuit (`src/main.nr`) performs ECDSA signature verification:

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
    let address = ecrecover::ecrecover(pub_key_x, pub_key_y, signature, hashed_message);
    
    // Verify recovered address matches expected address
    assert(address == expected_address, "Address does not match the expected address");
}
```

### Input Specification

**Private Inputs** (hidden from verifier):
- `pub_key_x`: 32-byte array of the ECDSA public key X coordinate
- `pub_key_y`: 32-byte array of the ECDSA public key Y coordinate  
- `signature`: 64-byte array containing ECDSA signature (r and s values)
- `hashed_message`: 32-byte array of the message hash

**Public Input** (visible to verifier):
- `expected_address`: Field representing the Ethereum address

## Setup and Usage

### Step 1: Initialize Project

```bash
# Initialize Noir project (if starting from scratch)
nargo init
```

### Step 2: Compile Circuit

```bash
# Compile the Noir circuit to bytecode
nargo compile
```

This generates `03_zk_ecdsa_contract.json` in the `target/` directory.

### Step 3: Generate On-Chain Verification Key

```bash
# Generate verification key optimized for Ethereum (uses Keccak for gas efficiency)
bb write_vk --oracle_hash keccak -b ./target/03_zk_ecdsa_contract.json -o ./target
```

This creates a `vk` file optimized for on-chain verification.

### Step 4: Generate Solidity Verifier Contract

```bash
# Generate Solidity smart contract from verification key
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol
```

This creates `Verifier.sol` - a complete smart contract for on-chain proof verification.

## Generated Solidity Contract

The `Verifier.sol` contract contains:

- **Embedded verification key data**
- **Cryptographic verification logic**
- **Public `verify()` function**

### Contract Interface

```solidity
contract HonkVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public view returns (bool);
}
```

### Usage in Your DApp

1. **Deploy** the `Verifier.sol` contract to your target network
2. **Generate proofs** off-chain using the prover's private inputs
3. **Submit proofs** to the contract's `verify()` function with public inputs

```solidity
// Example usage
bool isValid = verifier.verify(proofBytes, [expectedAddress]);
require(isValid, "Invalid signature proof");
```

## Command Reference

| Command | Purpose |
|---------|---------|
| `nargo init` | Initialize new Noir project |
| `nargo compile` | Compile circuit to bytecode |
| `bb write_vk --oracle_hash keccak -b <bytecode> -o <output>` | Generate gas-optimized verification key |
| `bb write_solidity_verifier -k <vk> -o <output>` | Generate Solidity verifier contract |

## Security Considerations

1. **Private Input Protection**: Never expose private inputs in production
2. **Signature Uniqueness**: Use unique message hashes for each proof
3. **Contract Verification**: Verify the generated Solidity contract before deployment
4. **Gas Optimization**: The `--oracle_hash keccak` flag reduces on-chain verification costs

## Use Cases

- **Anonymous Authentication**: Prove ownership of an Ethereum address without revealing transaction history
- **Privacy-Preserving Identity**: Verify identity claims without exposing signatures
- **Selective Disclosure**: Prove specific attributes without revealing underlying data
- **ZK Login Systems**: Authenticate users without storing or transmitting signatures

## Deployment Guide

1. **Compile** the `Verifier.sol` contract using your preferred Solidity compiler
2. **Deploy** to your target blockchain (Ethereum, Polygon, etc.)
3. **Integrate** the contract address into your DApp
4. **Test** with known valid proofs before production use

## Troubleshooting

**Common Issues:**

- **Compilation errors**: Ensure all dependencies are correctly specified in `Nargo.toml`
- **Invalid proofs**: Verify input format and ensure signature data is correctly formatted
- **Gas estimation**: Use `--oracle_hash keccak` for more efficient on-chain verification
- **Contract deployment**: Check Solidity version compatibility

**File Issues:**
```bash
# Clean and rebuild
rm -rf target/
nargo compile
```

## Proof Generation

When you need to generate actual proofs for your application, you'll create a `Prover.toml` file with your specific inputs:

```toml
expected_address = "0x30722096AA6Ff8300159817784D4643Bf78c8328"
hashed_message = ["28", "138", "255", "149", "6", "133", "194", "237", ...]
pub_key_x = ["203", "145", "71", "82", "252", "51", "249", "124", ...]
pub_key_y = ["108", "12", "57", "117", "188", "162", "204", "106", ...]
signature = ["178", "201", "8", "4", "70", "181", "3", "78", ...]
```

> ⚠️ **Security Warning**: Never commit `Prover.toml` with real data to version control!

Then generate proofs with:
```bash
nargo prove
```

## Development Notes

- The circuit supports standard ECDSA signatures over secp256k1 curve
- Signature format should be 64 bytes (r + s values without recovery byte)
- All byte arrays are represented as decimal strings in `Prover.toml`
- The verification key is circuit-specific and must match the deployed contract
- You can generate the Solidity verifier contract without needing `Prover.toml`

## License

This project is open source and available under the MIT License.

---

*This project demonstrates the integration of zero-knowledge proofs with smart contracts for privacy-preserving on-chain verification.*



nargo init    
nargo compile    
bb write_vk --oracle_hash keccak -b ./target/03_zk_ecdsa_contract.json -o ./target   
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol