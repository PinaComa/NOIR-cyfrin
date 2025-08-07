# ZK-ECDSA Signature Verification with Noir

A Zero-Knowledge proof system for ECDSA signature verification using the Noir programming language. This project demonstrates how to prove knowledge of a valid ECDSA signature without revealing the signature itself or the private key.

## Overview

This project implements a zero-knowledge circuit that verifies ECDSA signatures while keeping the signature data private. The circuit takes a public key, signature, and message hash as private inputs, and verifies that the signature corresponds to the expected Ethereum address (public input).

## Use Cases

- **Privacy-preserving authentication**: Prove you can sign messages from a specific address without revealing the signature
- **Selective disclosure**: Verify ownership of an Ethereum address without exposing transaction details
- **Zero-knowledge identity proofs**: Demonstrate control over a private key without revealing any signature data

## Project Structure

```
zk_ecdsa/
├── src/
│   └── main.nr              # Main Noir circuit
├── eth-key-recover/         # Ethereum keystore utilities
│   ├── decrypt-keystore.js  # Decrypt Foundry keystore files
│   └── package.json         # Node.js dependencies
├── extract_pubkey.mjs       # Extract public key from private key
├── generate_inputs.sh       # Convert hex inputs to Noir format
├── inputs.txt              # Raw hex input data
├── Prover.toml             # Noir circuit inputs (generated)
├── Nargo.toml              # Project configuration
└── target/                 # Compiled circuit and proof artifacts
```

## Dependencies

The circuit uses the following Noir libraries:
- `ecrecover-noir`: ECDSA signature recovery implementation
- `keccak256`: Keccak256 hashing function

## Setup

### Prerequisites

- [Noir/Nargo](https://noir-lang.org/docs/getting_started/installation/) (latest version)
- [Node.js](https://nodejs.org/) (for Ethereum utilities)
- Bash shell (for input generation script)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd zk_ecdsa
   ```

2. **Install Node.js dependencies:**
   ```bash
   cd eth-key-recover
   npm install
   cd ..
   ```

3. **Verify Noir installation:**
   ```bash
   nargo --version
   ```

## Usage

### Step 1: Prepare Your Ethereum Key

If you have a Foundry keystore file, decrypt it to get your private key:

```bash
cd eth-key-recover
# Edit decrypt-keystore.js with your keystore path and password
node decrypt-keystore.js
cd ..
```

### Step 2: Extract Public Key Components

Extract the public key X and Y coordinates from your private key:

```bash
# Edit extract_pubkey.mjs with your private key
node extract_pubkey.mjs
```

### Step 3: Generate Circuit Inputs

1. **Edit `inputs.txt`** with your signature data:
   ```
   expected_address = "0x30722096AA6Ff8300159817784D4643Bf78c8328"
   hashed_message   = "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"
   pub_key_x        = "0xcb914752fc33f97cc132cd4f0f56f18bfdcb838a5b63ca42d109f29c0c1c6952"
   pub_key_y        = "0x6c0c3975bca2cc6a98771cf82c60c15d3effe4155ace594a7eab1106edaa10ba"
   signature        = "0xb2c9080446b5034e8ef4a1cdc0314efcc2865594a56e7a4efe3684fc2b2c1fbd2a2e74a6a38948af3720bb4aa06cc5de6ccb1a66d339d173a15d4375224773451c"
   ```

2. **Convert inputs to Noir format:**
   ```bash
   chmod +x generate_inputs.sh
   ./generate_inputs.sh
   ```

   This script converts hex strings to decimal byte arrays and generates `Prover.toml`.

### Step 4: Generate and Verify the Proof

```bash
# Compile and execute the circuit
nargo execute

# Generate the proof
nargo prove

# Verify the proof
nargo verify
```

## Circuit Logic

The main circuit (`src/main.nr`) performs the following verification:

```rust
use dep::ecrecover;

fn main(
    pub_key_x: [u8; 32],           // Public key X coordinate (private)
    pub_key_y: [u8; 32],           // Public key Y coordinate (private)
    signature: [u8; 64],            // ECDSA signature r,s values (private)
    hashed_message: [u8; 32],       // Message hash (private)
    expected_address: Field         // Expected Ethereum address (public)
) {
    // Recover Ethereum address from signature
    let address = ecrecover::ecrecover(pub_key_x, pub_key_y, signature, hashed_message);
    
    // Verify the recovered address matches expected address
    assert(address == expected_address, "Address does not match the expected address");
}
```

### Input/Output Specification

**Private Inputs:**
- `pub_key_x`: 32-byte X coordinate of the ECDSA public key
- `pub_key_y`: 32-byte Y coordinate of the ECDSA public key  
- `signature`: 64-byte ECDSA signature (r and s values, without recovery byte)
- `hashed_message`: 32-byte hash of the signed message

**Public Inputs:**
- `expected_address`: The Ethereum address that should correspond to the public key

## Utilities Explained

### decrypt-keystore.js
Decrypts Foundry keystore files to extract private keys. Update the file paths and password before running.

### extract_pubkey.mjs
Takes a private key and extracts the uncompressed public key components (X and Y coordinates) needed for the circuit.

### generate_inputs.sh
Bash script that:
- Reads hex values from `inputs.txt`
- Removes the `0x` prefixes
- Strips the recovery byte (v) from the signature
- Converts hex strings to decimal byte arrays
- Generates the `Prover.toml` file in the format expected by Noir

## Security Considerations

1. **Private Key Safety**: Never commit private keys to version control
2. **Signature Uniqueness**: Each proof should use a unique message hash
3. **Input Validation**: Ensure all input data is properly formatted
4. **Recovery Byte**: The signature's recovery byte (v) is automatically stripped

## Troubleshooting

**Common Issues:**

- **Invalid signature format**: Ensure signature is exactly 130 hex characters (65 bytes)
- **Wrong address format**: Ethereum addresses should be 42 characters (0x + 40 hex chars)
- **Hex conversion errors**: Check that all hex strings in `inputs.txt` are valid

**Dependencies Issues:**
```bash
# Clean and reinstall dependencies
nargo clean
cd eth-key-recover && npm install
```

## Development

To extend this project:

1. **Add message signing**: Implement keccak256 hashing of arbitrary messages
2. **Batch verification**: Verify multiple signatures in one proof
3. **Different curves**: Support other elliptic curves beyond secp256k1

## License

This project is open source and available under the MIT License.

