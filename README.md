# NOIR - Zero-Knowledge Development Guide - Cyfrin

A comprehensive guide to building Zero-Knowledge applications using the Noir programming language and its ecosystem.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Best Practices](#best-practices)
- [Resources](#resources)

## Overview

This guide provides a complete introduction to Zero-Knowledge (ZK) proof development using Noir, from basic concepts to practical implementation. You'll learn how to set up your development environment, write circuits, generate proofs, and understand the complete ZK application architecture.

### What You'll Learn

- High-level ZK protocol architecture
- Setting up the Noir development environment
- Writing and testing Noir circuits
- Generating and verifying ZK proofs
- Understanding off-chain and on-chain components

## Architecture

ZK applications are structured in two main parts:

### Off-Chain Components (Prover's Side)

- **Circuits**: Programmatic rules written in Noir that define constraints
- **Front-end/CLI**: User interface that gathers inputs and generates proofs

### On-Chain Components (Verifier's Side)

- **Verifier Smart Contract**: Auto-generated contract that verifies ZK proofs
- **App Smart Contract**: Main application logic that uses verified proofs

## Installation

### Prerequisites

Ensure you have the following installed:
- curl
- A Unix-like terminal (macOS/Linux)
- Homebrew (for macOS users)

### Step 1: Install Nargo (Noir CLI)

```bash
# Install noirup (Noir version manager)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash

# Update your shell configuration
source ~/.zshrc  # for Zsh (macOS)
# or
source ~/.bashrc # for Bash (Linux)

# Install the latest stable Nargo
noirup

# Verify installation
nargo --version
```

### Step 2: Install Barretenberg (Proving Backend)

```bash
# Install bbup (auto-detects compatible version)
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/master/barretenberg/bbup/install | bash

# Update shell configuration (if needed)
source ~/.bashrc

# Verify installation
bb --version
```

### Step 3: Install jq (Required Dependency)

```bash
# Install via Homebrew (macOS)
brew install jq

# Verify installation
jq --version
```

## Getting Started

### Creating Your First Project

```bash
# Create a new Noir project
nargo new my_first_circuit

# Navigate to the project directory
cd my_first_circuit

# Check the project structure
ls -la
```

### Project Structure

```
my_first_circuit/
├── Nargo.toml      # Project manifest and configuration
└── src/
    └── main.nr     # Main circuit code
```

### Basic Circuit Example

```rust
// src/main.nr
fn main(x: Field, y: pub Field) {
    // Private input 'x' and public input 'y'
    // Assert that x is not equal to y
    assert(x != y);
}

#[test]
fn test_main() {
    // Test with valid inputs
    main(1, 2);
    
    // This would fail: main(1, 1);
}
```

## Core Concepts

### Input Types

- **Private Inputs**: `x: Field` - Hidden from verifiers
- **Public Inputs**: `y: pub Field` - Visible to both prover and verifier

### Data Types

- **Field**: Native, efficient type for general arithmetic
  - Best for: equality checks, general math
  - Cannot use: ordered comparisons (`<`, `>`)

- **Integer** (`u64`, `u32`, etc.): Field with range constraints
  - Best for: ordered comparisons, specific bit-widths
  - Less efficient due to additional constraints

### Constraints and Testing

- **`assert()`**: Defines rules that must be true for valid proofs
- **`#[test]`**: Function attribute for testing circuit logic

### Project Types

Configure in `Nargo.toml`:

- **`"bin"`**: Executable circuits for proof generation (most common)
- **`"lib"`**: Reusable code libraries
- **`"contract"`**: Aztec network smart contracts

## Development Workflow

### Complete Off-Chain Proof Generation

1. **Validate Code**
   ```bash
   nargo check
   ```

2. **Configure Inputs** (edit `Prover.toml`)
   ```toml
   x = "42"
   y = "24"
   ```

3. **Compile and Execute**
   ```bash
   nargo execute
   ```

4. **Generate Proof**
   ```bash
   bb prove -b ./target/circuit.json -w ./target/circuit.gz -o ./target/
   ```

5. **Create Verification Key**
   ```bash
   bb write_vk -b ./target/circuit.json -o ./target/
   ```

6. **Verify Proof**
   ```bash
   bb verify -k ./target/vk -p ./target/proof
   ```

### Key Commands Reference

| Command | Purpose |
|---------|---------|
| `nargo new <name>` | Create new project |
| `nargo check` | Validate code, generate Prover.toml |
| `nargo execute` | Compile to ACIR and generate witness |
| `nargo test` | Run circuit tests |
| `bb prove` | Generate cryptographic proof |
| `bb write_vk` | Generate verification key |
| `bb verify` | Verify proof off-chain |

## Project Structure Deep Dive

### Nargo.toml Configuration

```toml
[package]
name = "my_circuit"
type = "bin"
authors = ["PiCo"]
compiler_version = ">=0.23.0"

[dependencies]
# Add external Noir libraries here
```

### Source Code Organization

```
src/
├── main.nr          # Entry point for binary crates
├── lib.rs           # Entry point for library crates
└── modules/         # Additional modules
    ├── helpers.nr
    └── constants.nr
```

## Best Practices

### Circuit Design

1. **Use Field types** for better efficiency when possible
2. **Minimize constraints** to reduce proof generation time
3. **Write comprehensive tests** before generating proofs
4. **Keep circuits modular** for reusability

### Development Tips

1. **Clean builds**: Delete `target/` directory when changing code
2. **Test thoroughly**: Use `#[test]` functions extensively
3. **Version compatibility**: Use `bbup` to ensure compatible versions
4. **Error handling**: Add descriptive messages to `assert()` statements

### Security Considerations

1. **Validate all inputs** with appropriate constraints
2. **Test edge cases** thoroughly
3. **Understand public vs private** input implications
4. **Audit circuit logic** before production use

## Current Versions (August 2025)

- **Noir Language**: v1.0.0-beta.9
- **Nargo CLI**: v1.0.0-beta.8
- **Barretenberg**: v0.77.0 (February 2025)

## Resources

### Official Documentation
- [Noir Language Documentation](https://noir-lang.org/)
- [Aztec Network Documentation](https://docs.aztec.network/)

### Community
- [Noir Discord](https://discord.gg/aztec)
- [GitHub Repository](https://github.com/noir-lang/noir)

### Learning Materials
- [Noir Examples](https://github.com/noir-lang/noir-examples)
- [ZK Learning Resources](https://zkp.science/)

## Contributing

This guide is open source and welcomes contributions. Please feel free to:

- Report issues or inaccuracies
- Suggest improvements
- Add new examples
- Update version information

## Next Steps

After mastering the basics covered in this guide, consider exploring:

1. **On-chain verification** with Solidity verifier contracts
2. **Advanced circuit patterns** and optimization techniques
3. **Integration** with existing blockchain applications
4. **Complex ZK applications** like private voting or confidential transactions

---
by Gemini :) 